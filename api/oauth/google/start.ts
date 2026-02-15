/**
 * GET /api/oauth/google/start
 *
 * Redirects to Google OAuth consent screen.
 * Requested scopes: profile + People API (readonly contacts/directory).
 * NO email-content scopes requested — GDPR compliant.
 *
 * Query params:
 *   ?state=<opaque_token>  — round-tripped back to callback
 */

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${url.origin}/api/oauth/google/callback`;

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Google OAuth not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Scopes — directory + contacts only, NEVER email content
  const scopes = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/directory.readonly',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'online', // no refresh token needed — one-shot
    prompt: 'consent',
    state,
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    302
  );
}
