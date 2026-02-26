/**
 * Shared admin authentication for Vercel Edge Functions.
 * Verifies Supabase JWT + checks email against ADMIN_EMAILS allowlist.
 */

export interface AdminAuthResult {
  authenticated: boolean;
  email: string | null;
  error?: string;
}

const ALLOWED_ORIGINS = [
  'https://cz.behavera.com',
  'https://www.behavera.com',
  'https://behavera.com',
];

if (process.env.VERCEL_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function verifyAdminAuth(req: Request): Promise<AdminAuthResult> {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { authenticated: false, email: null, error: 'Server misconfigured' };
  }

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { authenticated: false, email: null, error: 'Unauthorized' };
  }

  let email: string | null = null;

  if (JWT_SECRET) {
    const jwtResult = await verifySupabaseJwt(token, JWT_SECRET);
    if (jwtResult.valid) {
      email = jwtResult.email;
    }
  }

  if (!email) {
    try {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      if (userRes.ok) {
        const userData = (await userRes.json()) as { email?: string };
        email = userData.email || null;
      }
    } catch {
      // ignore
    }
  }

  if (!email) {
    return { authenticated: false, email: null, error: 'Invalid or expired token' };
  }

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email.toLowerCase())) {
    return { authenticated: false, email, error: 'Insufficient permissions' };
  }

  return { authenticated: true, email };
}

export async function logAdminAccess(
  email: string,
  endpoint: string,
  method: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/rest/v1/admin_audit_log`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email,
        endpoint,
        method,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking — don't fail the request if logging fails
  }
}

async function verifySupabaseJwt(
  token: string,
  jwtSecret: string
): Promise<{ valid: boolean; email: string | null }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, email: null };

    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') return { valid: false, email: null };

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

    if (expectedSig !== parts[2]) return { valid: false, email: null };

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return { valid: false, email: null };

    return { valid: true, email: payload.email || null };
  } catch {
    return { valid: false, email: null };
  }
}
