/**
 * GET /api/oauth/google/callback
 *
 * Google redirects here after consent. We:
 *  1. Exchange the code for an access_token
 *  2. Fetch ALL contacts from People API with pagination
 *     (otherContacts + directory)
 *  3. Return an HTML page that posts results to the opener window
 *
 * Security: access_token is SHORT-LIVED, never stored server-side.
 * GDPR: We only return name + email from contacts. The full address-book
 *        is NOT persisted.
 */

export const config = { runtime: 'edge' };

interface GoogleContact {
  name?: string;
  email: string;
  photo?: string;
}

const MAX_PAGES = 20; // Safety cap: 20 × 200 = 4 000 contacts max

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const error = url.searchParams.get('error');

  if (error || !code) {
    return postToOpener({ error: error || 'no_code', contacts: [], state });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = `${url.origin}/api/oauth/google/callback`;

  try {
    // 1. Exchange code -> token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('Google token exchange failed:', body);
      return postToOpener({ error: 'token_exchange_failed', contacts: [], state });
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const contacts: GoogleContact[] = [];

    // 2a. Other Contacts (personal address book) — paginated
    try {
      let pageToken: string | undefined;
      let page = 0;
      do {
        const params = new URLSearchParams({
          readMask: 'names,emailAddresses,photos',
          pageSize: '200',
        });
        if (pageToken) params.set('pageToken', pageToken);

        const otherRes = await fetch(
          `https://people.googleapis.com/v1/otherContacts?${params}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        if (!otherRes.ok) break;

        const data = await otherRes.json();
        for (const person of data.otherContacts || []) {
          const email = person.emailAddresses?.[0]?.value;
          if (email) {
            contacts.push({
              name: person.names?.[0]?.displayName || '',
              email,
              photo: person.photos?.[0]?.url || '',
            });
          }
        }
        pageToken = data.nextPageToken;
        page++;
      } while (pageToken && page < MAX_PAGES);
    } catch (e) {
      console.warn('Failed to fetch otherContacts:', e);
    }

    // 2b. Directory (Google Workspace org directory) — paginated
    try {
      let pageToken: string | undefined;
      let page = 0;
      do {
        const params = new URLSearchParams({
          readMask: 'names,emailAddresses,photos',
          sources: 'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE',
          pageSize: '200',
        });
        if (pageToken) params.set('pageToken', pageToken);

        const dirRes = await fetch(
          `https://people.googleapis.com/v1/people:listDirectoryPeople?${params}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        if (!dirRes.ok) break;

        const data = await dirRes.json();
        for (const person of data.people || []) {
          const email = person.emailAddresses?.[0]?.value;
          if (email) {
            contacts.push({
              name: person.names?.[0]?.displayName || '',
              email,
              photo: person.photos?.[0]?.url || '',
            });
          }
        }
        pageToken = data.nextPageToken;
        page++;
      } while (pageToken && page < MAX_PAGES);
    } catch (e) {
      console.warn('Failed to fetch directory:', e);
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
    console.error('Google OAuth callback error:', err);
    return postToOpener({ error: 'server_error', contacts: [], state });
  }
}

/** Returns an HTML page that posts the result to window.opener */
function postToOpener(payload: {
  error: string | null;
  contacts: GoogleContact[];
  state: string;
}): Response {
  const json = JSON.stringify(payload);
  const html = `<!DOCTYPE html>
<html><head><title>Connecting\u2026</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'GOOGLE_CONTACTS', payload: ${json} }, window.location.origin);
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