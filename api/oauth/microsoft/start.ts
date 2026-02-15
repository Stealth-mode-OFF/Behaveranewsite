/**
 * GET /api/oauth/microsoft/start
 *
 * Redirects to Microsoft identity platform for OAuth consent.
 * Scopes: User.Read + People.Read + Contacts.Read
 * NO Mail.Read — GDPR compliant.
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

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const redirectUri = `${url.origin}/api/oauth/microsoft/callback`;

  if (!clientId) {
    return postErrorToOpener('MICROSOFT_CONTACTS', 'oauth_not_configured', state);
  }

  // Scopes — people + contacts only, NEVER mail content
  const scopes = [
    'openid',
    'User.Read',
    'People.Read',
    'Contacts.Read',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    response_mode: 'query',
    prompt: 'consent',
    state,
  });

  return Response.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`,
    302
  );
}
