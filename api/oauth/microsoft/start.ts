/**
 * GET /api/oauth/microsoft/start
 *
 * Redirects to Microsoft identity platform for OAuth consent.
 * Scopes: User.Read + People.Read + Contacts.Read
 * NO Mail.Read — GDPR compliant.
 */

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const redirectUri = `${url.origin}/api/oauth/microsoft/callback`;

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Microsoft OAuth not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
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
