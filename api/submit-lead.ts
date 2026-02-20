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
 * - PIPEDRIVE_API_KEY or PIPEDRIVE_API_TOKEN
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
 * - SUPABASE_URL (optional, for backup storage)
 * - SUPABASE_SERVICE_KEY (optional, for backup storage)
 */

interface LeadAttributionPayload {
  first_touch_source?: string;
  first_touch_medium?: string;
  first_touch_campaign?: string;
  first_touch_landing_page?: string;
  first_touch_referrer?: string;
  last_touch_source?: string;
  last_touch_medium?: string;
  last_touch_campaign?: string;
  last_touch_landing_page?: string;
  last_touch_referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  visits?: number;
  page_views?: number;
  last_seen_at?: string;
}

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
  marketingConsent?: boolean;
  attribution?: LeadAttributionPayload;
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

interface PipedriveResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const MAX_LEAD_TITLE_LENGTH = 255;

function normalizePipedriveDomain(rawDomain: string | undefined): string {
  const fallback = 'behavera';
  if (!rawDomain) return fallback;

  const trimmed = rawDomain.trim().toLowerCase();
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  const host = withoutProtocol.replace(/\/.*$/, '');
  const subdomain = host.replace(/\.pipedrive\.com$/, '');

  return subdomain || fallback;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function buildSourceLabel(payload: LeadPayload): string {
  const baseSource = payload.source
    ? `behavera.com/${payload.source}`
    : 'behavera.com';

  const channel = payload.attribution?.last_touch_source;
  const medium = payload.attribution?.last_touch_medium;
  const campaign = payload.attribution?.last_touch_campaign || payload.attribution?.utm_campaign;

  const parts = [baseSource];
  if (channel) parts.push(`src:${channel}`);
  if (medium) parts.push(`med:${medium}`);
  if (campaign) parts.push(`cmp:${campaign}`);

  return parts.join(' | ');
}

function formatAttributionBlock(attribution?: LeadAttributionPayload): string {
  if (!attribution) {
    return '**Attribution:** Not captured';
  }

  const firstTouch = `${attribution.first_touch_source || 'direct'} / ${attribution.first_touch_medium || 'none'}`;
  const lastTouch = `${attribution.last_touch_source || 'direct'} / ${attribution.last_touch_medium || 'none'}`;

  const lines = [
    '**Attribution Snapshot**',
    `- Visits before submit: ${attribution.visits ?? 'n/a'}`,
    `- Page views before submit: ${attribution.page_views ?? 'n/a'}`,
    `- First touch: ${firstTouch}`,
    `- First campaign: ${attribution.first_touch_campaign || 'n/a'}`,
    `- First landing page: ${attribution.first_touch_landing_page || 'n/a'}`,
    `- First referrer: ${attribution.first_touch_referrer || 'n/a'}`,
    `- Last touch: ${lastTouch}`,
    `- Last campaign: ${attribution.last_touch_campaign || attribution.utm_campaign || 'n/a'}`,
    `- Last landing page: ${attribution.last_touch_landing_page || 'n/a'}`,
    `- Last referrer: ${attribution.last_touch_referrer || 'n/a'}`,
    `- UTM source/medium: ${attribution.utm_source || 'n/a'} / ${attribution.utm_medium || 'n/a'}`,
    `- UTM term/content: ${attribution.utm_term || 'n/a'} / ${attribution.utm_content || 'n/a'}`,
    `- Paid IDs: gclid=${attribution.gclid || 'n/a'}, fbclid=${attribution.fbclid || 'n/a'}, msclkid=${attribution.msclkid || 'n/a'}, ttclid=${attribution.ttclid || 'n/a'}`,
    `- Last seen at: ${attribution.last_seen_at || 'n/a'}`,
  ];

  return lines.join('\n');
}

// Pipedrive API helper
async function pipedriveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const apiToken = process.env.PIPEDRIVE_API_KEY || process.env.PIPEDRIVE_API_TOKEN;
  const domain = normalizePipedriveDomain(process.env.PIPEDRIVE_COMPANY_DOMAIN);

  if (!apiToken) {
    throw new Error('PIPEDRIVE_API_KEY or PIPEDRIVE_API_TOKEN not configured');
  }

  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `https://${domain}.pipedrive.com/api/v1${endpoint}${sep}api_token=${apiToken}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json() as PipedriveResponse<T>;

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
async function saveToSupabase(payload: LeadPayload, source: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase not configured, skipping backup');
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name || payload.firstName || null,
        first_name: payload.firstName || null,
        last_name: payload.lastName || null,
        phone: payload.phone || null,
        company: payload.company || null,
        company_size: payload.companySize || null,
        role: payload.role || null,
        source,
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

    const source = buildSourceLabel(payload);

    // Build name from available fields
    const name = payload.name
      || (payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : null)
      || payload.firstName
      || payload.email.split('@')[0];

    // Save to Supabase as backup (async, don't wait)
    saveToSupabase(payload, source);

    // 1. Check for existing person (deduplicate)
    let personId = await findPersonByEmail(payload.email);
    let isExisting = false;

    if (personId) {
      // Person exists - update their info if we have more data
      isExisting = true;
      console.log(`Found existing person: ${personId}`);

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

    const leadTitle = truncate(`[${source}] ${name}${sizeLabel}${roleLabel}`, MAX_LEAD_TITLE_LENGTH);

    const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
      title: leadTitle,
      person_id: personId,
    });

    // 5. Add note with additional context + attribution
    const noteContent = [
      '**Website Lead Submission**',
      '',
      `**Website Source:** ${source}`,
      `**Company Size:** ${payload.companySize || 'Not specified'}`,
      `**Role:** ${payload.role || 'Not specified'}`,
      `**Phone:** ${payload.phone || 'Not provided'}`,
      `**Company:** ${payload.company || 'Not provided'}`,
      `**Marketing Consent:** ${payload.marketingConsent === true ? 'yes' : payload.marketingConsent === false ? 'no' : 'not provided'}`,
      `**Submitted:** ${new Date().toISOString()}`,
      '',
      formatAttributionBlock(payload.attribution),
      isExisting ? '\n⚠️ Note: This person already existed in Pipedrive' : '',
    ]
      .filter(Boolean)
      .join('\n')
      .trim();

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
