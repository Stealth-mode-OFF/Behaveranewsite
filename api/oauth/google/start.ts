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

/** Returns an HTML page that posts an error to window.opener and closes */
function postErrorToOpener(type: string, error: string, state: string): Response {
  const payload = JSON.stringify({ error, contacts: [], state });
  const html = `<!DOCTYPE html>
<html><head><title>Error</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: '${type}', payload: ${payload} }, window.location.origin);
  }
  window.close();
</script>
<p>OAuth is not configured. You can close this window.</p>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${url.origin}/api/oauth/google/callback`;

  if (!clientId) {
    return postErrorToOpener('GOOGLE_CONTACTS', 'oauth_not_configured', state);
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
