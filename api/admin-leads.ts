/**
 * Vercel Edge Function: Admin Leads API
 *
 * Returns all leads (generic + event QR) from Supabase.
 * Protected by same auth as admin-onboardings (Supabase JWT + allowlist).
 *
 * GET /api/admin-leads
 *   Header: Authorization: Bearer <token>
 *
 * Returns { leads: Lead[], eventLeads: EventLead[] }
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

/* ─── Supabase PATCH helper ─── */
async function supabasePatch(
  table: string,
  id: string,
  body: Record<string, unknown>,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<void> {
  const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase PATCH ${table} failed: ${res.status} ${text}`);
  }
}

/* ─── Main handler ─── */
export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

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

  logAdminAccess(auth.email!, '/api/admin-leads', req.method, SUPABASE_URL, SUPABASE_KEY);

  // ── PATCH: toggle processed status ──
  if (req.method === 'PATCH') {
    try {
      const body = await req.json() as { id: string; table: 'leads' | 'event_leads'; processed: boolean };
      if (!body.id || !body.table || !['leads', 'event_leads'].includes(body.table)) {
        return new Response(JSON.stringify({ error: 'Missing id or invalid table' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      await supabasePatch(body.table, body.id, { processed: body.processed }, SUPABASE_URL, SUPABASE_KEY);
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

  // ── GET: Fetch both tables in parallel (event_leads may not exist yet) ──
  try {
    const [leads, eventLeads] = await Promise.allSettled([
      supabaseGet('leads', SUPABASE_URL, SUPABASE_KEY, 'select=*&order=created_at.desc'),
      supabaseGet('event_leads', SUPABASE_URL, SUPABASE_KEY, 'select=*&order=created_at.desc'),
    ]);

    return new Response(JSON.stringify({
      leads: leads.status === 'fulfilled' ? leads.value : [],
      eventLeads: eventLeads.status === 'fulfilled' ? eventLeads.value : [],
    }), {
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
