/**
 * Vercel Edge Function: Admin Leads API
 *
 * Returns all leads (generic + event QR) from Supabase.
 * Protected by same auth as admin-onboardings (JWT + local-admin fallback).
 *
 * GET /api/admin-leads
 *   Header: Authorization: Bearer <token>
 *
 * Returns { leads: Lead[], eventLeads: EventLead[] }
 */

export const config = { runtime: 'edge' };

/* ─── CORS headers ─── */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

/* ─── JWT verification (lightweight, edge-compatible) ─── */
async function verifySupabaseJwt(token: string, jwtSecret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureInput = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = await crypto.subtle.sign('HMAC', key, signatureInput);
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (expectedSig !== parts[2]) return false;

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

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

/* ─── Main handler ─── */
export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Auth: local-admin fallback + JWT + Supabase user endpoint
  let authenticated = false;
  const ADMIN_SECRET = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'admin123';
  if (token === 'local-admin' || token === ADMIN_SECRET) {
    authenticated = true;
  }

  if (!authenticated && JWT_SECRET) {
    authenticated = await verifySupabaseJwt(token, JWT_SECRET);
  }
  if (!authenticated) {
    try {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      authenticated = userRes.ok;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Fetch both tables in parallel (event_leads may not exist yet) ──
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
