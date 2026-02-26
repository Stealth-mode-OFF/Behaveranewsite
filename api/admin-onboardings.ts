/**
 * Vercel Edge Function: Admin Onboarding Data API
 *
 * Returns all onboarding submissions with teams and members.
 * Protected by Supabase JWT — only authenticated admin users can access.
 *
 * GET /api/admin-onboardings
 *   Header: Authorization: Bearer <supabase-jwt>
 *
 * Returns JSON array of companies with nested teams → members.
 */

import { getCorsHeaders, logAdminAccess, verifyAdminAuth } from './_lib/admin-auth';

export const config = { runtime: 'edge' };

/* ─── Supabase fetch helper ─── */
async function supabaseGet(
  path: string,
  supabaseUrl: string,
  supabaseKey: string,
  params?: string
): Promise<unknown[]> {
  const url = `${supabaseUrl}/rest/v1/${path}${params ? `?${params}` : ''}`;
  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<unknown[]>;
}

/* ─── Name parsing from email ─── */
function parseName(fullName: string | null | undefined, email: string | null | undefined): { firstName: string; lastName: string } {
  if (fullName && fullName.trim().length > 0) {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  }
  if (email) {
    const local = email.split('@')[0] || '';
    const dotParts = local.split('.');
    if (dotParts.length >= 2) {
      return {
        firstName: capitalize(dotParts[0]),
        lastName: capitalize(dotParts.slice(1).join(' ')),
      };
    }
    return { firstName: capitalize(local), lastName: '' };
  }
  return { firstName: '', lastName: '' };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/* ─── Main handler ─── */
export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Auth check ──
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const auth = await verifyAdminAuth(req);
  if (!auth.authenticated) {
    const status = auth.error === 'Server misconfigured' ? 500 : auth.error === 'Insufficient permissions' ? 403 : 401;
    return new Response(JSON.stringify({ error: auth.error || 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  logAdminAccess(auth.email!, '/api/admin-onboardings', req.method, SUPABASE_URL, SUPABASE_KEY);

  // ── PATCH: update onboarding status ──
  if (req.method === 'PATCH') {
    try {
      const body = await req.json() as { id: string; status: string };
      const validStatuses = ['new', 'contacted', 'onboarding', 'active', 'rejected'];
      if (!body.id || !body.status || !validStatuses.includes(body.status)) {
        return new Response(JSON.stringify({ error: 'Missing id or invalid status' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const url = `${SUPABASE_URL}/rest/v1/onboarding_submissions?id=eq.${body.id}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ status: body.status, updated_at: new Date().toISOString() }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase PATCH failed: ${res.status} ${text}`);
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // ── GET: Fetch data ──
  try {
    // Get all submissions
    const submissions = (await supabaseGet(
      'onboarding_submissions',
      SUPABASE_URL,
      SUPABASE_KEY,
      'select=*&order=created_at.desc'
    )) as Record<string, unknown>[];

    // Get all teams
    const teams = (await supabaseGet(
      'onboarding_teams',
      SUPABASE_URL,
      SUPABASE_KEY,
      'select=*'
    )) as Record<string, unknown>[];

    // Get all members
    const members = (await supabaseGet(
      'onboarding_team_members',
      SUPABASE_URL,
      SUPABASE_KEY,
      'select=*'
    )) as Record<string, unknown>[];

    // Build nested structure: group by company
    interface MemberData {
      email: string;
      firstName: string;
      lastName: string;
      isLeader: boolean;
    }

    interface TeamData {
      id: string;
      name: string;
      leaderEmail: string;
      members: MemberData[];
    }

    interface CompanyData {
      id: string;
      companyName: string;
      ico: string;
      repName: string;
      repEmail: string;
      adminName: string;
      adminEmail: string;
      billingEmail: string;
      billingInterval: string;
      oauthProvider: string;
      employeeCount: number;
      totalPrice: number;
      status: string;
      createdAt: string;
      teams: TeamData[];
    }

    // Index teams by submission_id
    const teamsBySubmission = new Map<string, Record<string, unknown>[]>();
    for (const t of teams) {
      const sid = t.submission_id as string;
      if (!teamsBySubmission.has(sid)) teamsBySubmission.set(sid, []);
      teamsBySubmission.get(sid)!.push(t);
    }

    // Index members by team_id
    const membersByTeam = new Map<string, Record<string, unknown>[]>();
    for (const m of members) {
      const tid = m.team_id as string;
      if (!membersByTeam.has(tid)) membersByTeam.set(tid, []);
      membersByTeam.get(tid)!.push(m);
    }

    // Build response
    const companies: CompanyData[] = submissions.map((sub) => {
      const sid = sub.id as string;
      const subTeams = teamsBySubmission.get(sid) || [];

      const teamsData: TeamData[] = subTeams.map((t) => {
        const tid = t.id as string;
        const teamMembers = membersByTeam.get(tid) || [];
        const leaderEmail = (t.leader_email as string) || '';

        const membersData: MemberData[] = teamMembers.map((m) => {
          const email = (m.email as string) || '';
          const rawName = (m.full_name as string) || (m.name as string) || '';
          const { firstName, lastName } = parseName(rawName, email);
          return {
            email,
            firstName,
            lastName,
            isLeader: email.toLowerCase() === leaderEmail.toLowerCase(),
          };
        });

        // Sort: leader first, then alphabetically
        membersData.sort((a, b) => {
          if (a.isLeader && !b.isLeader) return -1;
          if (!a.isLeader && b.isLeader) return 1;
          return a.lastName.localeCompare(b.lastName);
        });

        return {
          id: tid,
          name: (t.name as string) || 'Bez názvu',
          leaderEmail,
          members: membersData,
        };
      });

      // Sort teams alphabetically
      teamsData.sort((a, b) => a.name.localeCompare(b.name));

      return {
        id: sid,
        companyName: (sub.company_name as string) || '',
        ico: (sub.company_id as string) || '',
        repName: (sub.rep_name as string) || '',
        repEmail: (sub.rep_email as string) || '',
        adminName: (sub.admin_name as string) || '',
        adminEmail: (sub.admin_email as string) || '',
        billingEmail: (sub.billing_email as string) || '',
        billingInterval: (sub.billing_interval as string) || '',
        oauthProvider: (sub.oauth_provider as string) || '',
        employeeCount: (sub.employee_count as number) || 0,
        totalPrice: (sub.total_price as number) || 0,
        status: (sub.status as string) || '',
        createdAt: (sub.created_at as string) || '',
        teams: teamsData,
      };
    });

    return new Response(JSON.stringify(companies), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
