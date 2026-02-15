/**
 * GET /api/oauth/microsoft/callback
 *
 * Microsoft redirects here after consent. We:
 *  1. Exchange the code for an access_token
 *  2. Fetch contacts from Microsoft Graph (People + Contacts)
 *  3. Return an HTML page that posts results to the opener window
 *
 * Security: access_token is SHORT-LIVED, never stored server-side.
 * GDPR: Only name + email returned. Full address-book NOT persisted.
 */

export const config = { runtime: 'edge' };

interface MicrosoftContact {
  name?: string;
  email: string;
  photo?: string;
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const error = url.searchParams.get('error');

  if (error || !code) {
    return postToOpener({ error: error || 'no_code', contacts: [], state });
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
  const redirectUri = `${url.origin}/api/oauth/microsoft/callback`;

  try {
    // 1. Exchange code -> token
    const tokenRes = await fetch(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      }
    );

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('Microsoft token exchange failed:', body);
      return postToOpener({ error: 'token_exchange_failed', contacts: [], state });
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const contacts: MicrosoftContact[] = [];

    // 2a. People API — frequent contacts & org directory
    try {
      const peopleRes = await fetch(
        'https://graph.microsoft.com/v1.0/me/people?$top=200&$select=displayName,scoredEmailAddresses',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      if (peopleRes.ok) {
        const data = await peopleRes.json();
        for (const person of data.value || []) {
          const email = person.scoredEmailAddresses?.[0]?.address;
          if (email) {
            contacts.push({
              name: person.displayName || '',
              email,
            });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch People:', e);
    }

    // 2b. Contacts API — personal contacts
    try {
      const contactsRes = await fetch(
        'https://graph.microsoft.com/v1.0/me/contacts?$top=200&$select=displayName,emailAddresses',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        for (const contact of data.value || []) {
          const email = contact.emailAddresses?.[0]?.address;
          if (email) {
            contacts.push({
              name: contact.displayName || '',
              email,
            });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Contacts:', e);
    }

    // 3. Deduplicate by email
    const seen = new Set<string>();
    const unique = contacts.filter((c) => {
      const key = c.email.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return postToOpener({ error: null, contacts: unique, state });
  } catch (err) {
    console.error('Microsoft OAuth callback error:', err);
    return postToOpener({ error: 'server_error', contacts: [], state });
  }
}

/** Returns an HTML page that posts the result to window.opener */
function postToOpener(payload: {
  error: string | null;
  contacts: MicrosoftContact[];
  state: string;
}): Response {
  const json = JSON.stringify(payload);
  const html = `<!DOCTYPE html>
<html><head><title>Connecting\u2026</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'MICROSOFT_CONTACTS', payload: ${json} }, window.location.origin);
  }
  window.close();
</script>
<p>Redirecting\u2026 you can close this window.</p>
</body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
