/**
 * Vercel Edge Function: Submit COMPLETE onboarding data
 *
 * Receives the full onboarding payload (company, teams, members, OAuth info)
 * and persists it to Supabase + creates a Pipedrive lead.
 *
 * Environment variables required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_KEY
 * - PIPEDRIVE_API_KEY (optional — lead creation skipped if missing)
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
 */

export const config = { runtime: 'edge' };

/* ─── Types ─── */

interface TeamMember {
  name: string;
  email: string;
  photo?: string;
}

interface TeamPayload {
  id: string;
  name: string;
  leaderEmail: string;
  members: TeamMember[];
}

interface OnboardingPayload {
  // Company (Step 1)
  companyName: string;
  companyId?: string;          // IČO from ARES
  repName: string;
  repEmail: string;
  billingEmail?: string;
  adminName?: string;
  adminEmail?: string;
  employeeCount?: number;

  // Plan (Step 4)
  billingInterval?: 'monthly' | 'yearly';
  agreedToTerms?: boolean;

  // OAuth (Step 2)
  oauthProvider?: 'google' | 'microsoft' | null;

  // Teams (Step 3)
  teams: TeamPayload[];
}

/* ─── Supabase helpers ─── */

async function supabasePost(
  table: string,
  body: Record<string, unknown> | Record<string, unknown>[],
  supabaseUrl: string,
  supabaseKey: string,
  returnData = false
): Promise<Record<string, unknown>[] | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: returnData ? 'return=representation' : 'return=minimal',
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${table} insert failed (${res.status}): ${text}`);
  }

  return returnData ? res.json() : null;
}

/* ─── Pipedrive helpers (copied from submit-lead.ts) ─── */

async function pipedriveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || 'behavera';
  if (!apiKey) throw new Error('PIPEDRIVE_API_KEY not configured');

  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `https://${domain}.pipedrive.com/api/v1${endpoint}${sep}api_token=${apiKey}`;

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pipedrive error: ${response.status}`);
  }
  return data.data;
}

async function findPersonByEmail(email: string): Promise<number | null> {
  try {
    const result = await pipedriveRequest<{
      items: Array<{ item: { id: number } }>;
    }>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`
    );
    return result.items?.[0]?.item?.id ?? null;
  } catch {
    return null;
  }
}

async function createPipedriveLead(payload: OnboardingPayload) {
  if (!process.env.PIPEDRIVE_API_KEY) return { personId: null, leadId: null };

  const totalMembers = payload.teams.reduce((s, t) => s + t.members.length, 0);
  const name = payload.repName || payload.repEmail.split('@')[0];

  // Deduplicate person
  let personId = await findPersonByEmail(payload.repEmail);
  const isExisting = !!personId;

  if (!personId) {
    // Create organization
    let orgId: number | undefined;
    if (payload.companyName) {
      try {
        const org = await pipedriveRequest<{ id: number }>('/organizations', 'POST', {
          name: payload.companyName,
          visible_to: 3,
        });
        orgId = org.id;
      } catch { /* org may already exist */ }
    }

    const person = await pipedriveRequest<{ id: number }>('/persons', 'POST', {
      name,
      email: [payload.repEmail],
      org_id: orgId,
      visible_to: 3,
    });
    personId = person.id;
  }

  // Create lead
  const source = `onboarding:${payload.billingInterval || 'yearly'}:${totalMembers}members:${payload.teams.length}teams:${payload.oauthProvider || 'manual'}`;
  const title = `[echopulse.cz/${source}] ${name} | ${payload.companyName}`;

  const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
    title,
    person_id: personId,
  });

  // Add rich note
  const teamLines = payload.teams
    .map(
      (t, i) =>
        `**Team ${i + 1}: ${t.name}** (${t.members.length} members, leader: ${t.leaderEmail || 'not set'})`
    )
    .join('\n');

  const note = `
**🚀 Full Onboarding Submission**
**Company:** ${payload.companyName}${payload.companyId ? ` (IČO: ${payload.companyId})` : ''}
**Rep:** ${payload.repName} <${payload.repEmail}>
**Admin:** ${payload.adminName || '—'} <${payload.adminEmail || '—'}>
**Billing Email:** ${payload.billingEmail || '—'}
**Employees:** ${payload.employeeCount || '—'}
**Plan:** ${payload.billingInterval || '—'}
**OAuth:** ${payload.oauthProvider || 'manual entry'}
**Teams:** ${payload.teams.length} | **Total Members:** ${totalMembers}
${teamLines}
**Submitted:** ${new Date().toISOString()}
${isExisting ? '\n⚠️ Person already existed in Pipedrive' : ''}
  `.trim();

  await pipedriveRequest('/notes', 'POST', {
    content: note,
    lead_id: lead.id,
  });

  return { personId, leadId: lead.id };
}

/* ─── Main handler ─── */

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
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Supabase not configured' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const payload: OnboardingPayload = await request.json();

    // Validate required fields
    if (!payload.repEmail || !payload.companyName) {
      return new Response(
        JSON.stringify({ error: 'Email and company name are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ─── 1. Save to Supabase ───

    // Insert submission
    const submissionRows = await supabasePost(
      'onboarding_submissions',
      {
        company_name: payload.companyName,
        company_id: payload.companyId || null,
        rep_name: payload.repName,
        rep_email: payload.repEmail,
        billing_email: payload.billingEmail || null,
        admin_name: payload.adminName || null,
        admin_email: payload.adminEmail || null,
        employee_count: payload.employeeCount || null,
        billing_interval: payload.billingInterval || null,
        agreed_to_terms: payload.agreedToTerms ?? false,
        oauth_provider: payload.oauthProvider || null,
        status: 'new',
      },
      supabaseUrl,
      supabaseKey,
      true
    );

    const submissionId = submissionRows?.[0]?.id as string;
    if (!submissionId) {
      throw new Error('Failed to get submission ID from Supabase');
    }

    // Insert teams + members
    for (let i = 0; i < payload.teams.length; i++) {
      const team = payload.teams[i];

      const teamRows = await supabasePost(
        'onboarding_teams',
        {
          submission_id: submissionId,
          name: team.name,
          leader_email: team.leaderEmail || null,
          sort_order: i,
        },
        supabaseUrl,
        supabaseKey,
        true
      );

      const teamId = teamRows?.[0]?.id as string;
      if (!teamId || team.members.length === 0) continue;

      // Batch insert all members for this team
      const memberRows = team.members.map((m) => ({
        team_id: teamId,
        name: m.name || '',
        email: m.email,
        photo_url: m.photo || '',
      }));

      await supabasePost('onboarding_team_members', memberRows, supabaseUrl, supabaseKey);
    }

    // ─── 2. Create Pipedrive lead (async, don't block response) ───
    let pipedriveResult = { personId: null as number | null, leadId: null as string | null };
    try {
      pipedriveResult = await createPipedriveLead(payload);

      // Update submission with Pipedrive IDs
      if (pipedriveResult.personId || pipedriveResult.leadId) {
        await fetch(`${supabaseUrl}/rest/v1/onboarding_submissions?id=eq.${submissionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            pipedrive_person_id: pipedriveResult.personId,
            pipedrive_lead_id: pipedriveResult.leadId,
          }),
        });
      }
    } catch (err) {
      console.warn('Pipedrive lead creation failed (Supabase data saved):', err);
    }

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        personId: pipedriveResult.personId,
        leadId: pipedriveResult.leadId,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Onboarding submission error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to save onboarding data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
