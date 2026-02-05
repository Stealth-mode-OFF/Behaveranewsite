/**
 * Vercel Serverless Function: Submit Lead to Pipedrive
 * 
 * This endpoint receives lead data from the frontend and:
 * 1. Validates the input
 * 2. Creates Person + Lead in Pipedrive
 * 3. Optionally stores in Supabase (if configured)
 * 
 * Environment variables required:
 * - PIPEDRIVE_API_KEY
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
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

// Pipedrive API helper
async function pipedriveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || 'behavera';
  
  if (!apiKey) {
    throw new Error('PIPEDRIVE_API_KEY not configured');
  }

  const url = `https://${domain}.pipedrive.com/api/v1${endpoint}?api_token=${apiKey}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pipedrive API error: ${response.status}`);
  }

  return data.data;
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

    // Build name from available fields
    const name = payload.name 
      || (payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : null)
      || payload.firstName
      || payload.email.split('@')[0];

    // 1. Create organization if company provided
    let organizationId: number | undefined;
    if (payload.company) {
      const org = await pipedriveRequest<{ id: number }>('/organizations', 'POST', {
        name: payload.company,
        visible_to: 3,
      });
      organizationId = org.id;
    }

    // 2. Create person
    const person = await pipedriveRequest<{ id: number }>('/persons', 'POST', {
      name,
      email: [payload.email],
      phone: payload.phone ? [payload.phone] : undefined,
      org_id: organizationId,
      visible_to: 3,
    });

    // 3. Create lead with source info
    const sourceLabel = payload.source || 'website';
    const sizeLabel = payload.companySize ? ` | ${payload.companySize}` : '';
    const roleLabel = payload.role ? ` | ${payload.role}` : '';
    
    const leadTitle = `[${sourceLabel}] ${name}${sizeLabel}${roleLabel}`;

    const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
      title: leadTitle,
      person_id: person.id,
      organization_id: organizationId,
    });

    // Add note with additional context
    if (payload.companySize || payload.role || payload.source) {
      await pipedriveRequest('/notes', 'POST', {
        content: `
**Lead Source:** ${payload.source || 'website'}
**Company Size:** ${payload.companySize || 'Not specified'}
**Role:** ${payload.role || 'Not specified'}
**Submitted:** ${new Date().toISOString()}
        `.trim(),
        lead_id: lead.id,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      personId: person.id,
      leadId: lead.id,
      organizationId,
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Pipedrive API error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to create lead',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500, headers: corsHeaders });
  }
}
