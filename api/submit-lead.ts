/**
 * Vercel Serverless Function: Submit Lead to Pipedrive + Supabase
 * 
 * This endpoint receives lead data from the frontend and:
 * 1. Validates the input
 * 2. Checks for duplicate person in Pipedrive (by email)
 * 3. Creates or updates Person + Lead in Pipedrive
 * 4. Stores in Supabase as backup
 * 
 * Environment variables required:
 * - PIPEDRIVE_API_TOKEN (preferred) or PIPEDRIVE_API_KEY
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
 * - SUPABASE_URL (optional, for backup storage)
 * - SUPABASE_SERVICE_KEY (optional, for backup storage)
 */

interface LeadPayload {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  companySize?: string;
  role?: string;
  source?: string;
}

interface PipedriveSearchResult {
  items: Array<{
    item: {
      id: number;
      name: string;
      emails: string[];
    };
  }>;
}

// Pipedrive API helper
async function pipedriveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.PIPEDRIVE_API_TOKEN || process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || 'behavera';
  
  if (!apiKey) {
    throw new Error('PIPEDRIVE_API_TOKEN not configured');
  }

  const url = `https://${domain}.pipedrive.com/api/v1${endpoint}${endpoint.includes('?') ? '&' : '?'}api_token=${apiKey}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pipedrive API error: ${response.status}`);
  }

  return data.data;
}

// Search for existing person by email
async function findPersonByEmail(email: string): Promise<number | null> {
  try {
    const result = await pipedriveRequest<PipedriveSearchResult>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`
    );
    
    if (result.items && result.items.length > 0) {
      return result.items[0].item.id;
    }
    return null;
  } catch {
    return null;
  }
}

// Save to Supabase as backup
async function saveToSupabase(payload: LeadPayload): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured, skipping backup');
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name || payload.firstName,
        phone: payload.phone,
        company: payload.company,
        company_size: payload.companySize,
        role: payload.role,
        source: payload.source || 'behavera.com',
        created_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      console.warn('Supabase backup failed:', response.status);
    }
  } catch (error) {
    console.warn('Supabase backup error:', error);
  }
}

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const payload: LeadPayload = await request.json();

    // Validate required fields
    if (!payload.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: corsHeaders });
    }

    // Normalize source - always include behavera.com
    const source = payload.source 
      ? `behavera.com/${payload.source}` 
      : 'behavera.com';

    // Build name from available fields
    const name = payload.name 
      || (payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : null)
      || payload.firstName
      || payload.email.split('@')[0];

    // Save to Supabase as backup (async, don't wait)
    saveToSupabase({ ...payload, source });

    // 1. Check for existing person (deduplicate)
    let personId = await findPersonByEmail(payload.email);
    let isExisting = false;
    
    if (personId) {
      // Person exists - update their info if we have more data
      isExisting = true;
      
      // Optionally update phone if provided and not set
      if (payload.phone) {
        try {
          await pipedriveRequest(`/persons/${personId}`, 'PUT', {
            phone: [{ value: payload.phone, primary: true }],
          });
        } catch {
          // Ignore update errors
        }
      }
    } else {
      // 2. Create organization if company provided
      let organizationId: number | undefined;
      if (payload.company) {
        try {
          const org = await pipedriveRequest<{ id: number }>('/organizations', 'POST', {
            name: payload.company,
            visible_to: 3,
          });
          organizationId = org.id;
        } catch {
          // Organization might already exist, continue without it
        }
      }

      // 3. Create new person
      const person = await pipedriveRequest<{ id: number }>('/persons', 'POST', {
        name,
        email: [payload.email],
        phone: payload.phone ? [payload.phone] : undefined,
        org_id: organizationId,
        visible_to: 3,
      });
      personId = person.id;
    }

    // 4. Create lead with source info
    const sizeLabel = payload.companySize ? ` | ${payload.companySize}` : '';
    const roleLabel = payload.role ? ` | ${payload.role}` : '';
    
    const leadTitle = `[${source}] ${name}${sizeLabel}${roleLabel}`;

    const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
      title: leadTitle,
      person_id: personId,
    });

    // 5. Add note with additional context
    const noteContent = `
**Website Source:** ${source}
**Company Size:** ${payload.companySize || 'Not specified'}
**Role:** ${payload.role || 'Not specified'}
**Phone:** ${payload.phone || 'Not provided'}
**Company:** ${payload.company || 'Not provided'}
**Submitted:** ${new Date().toISOString()}
${isExisting ? '\n⚠️ Note: This person already existed in Pipedrive' : ''}
    `.trim();

    await pipedriveRequest('/notes', 'POST', {
      content: noteContent,
      lead_id: lead.id,
    });

    return new Response(JSON.stringify({
      success: true,
      personId,
      leadId: lead.id,
      isExisting,
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Pipedrive API error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to create lead',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500, headers: corsHeaders });
  }
}
