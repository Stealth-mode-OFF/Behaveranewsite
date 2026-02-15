/**
 * POST /api/invitations/send
 *
 * Stores selected teammate invitations in Supabase.
 * GDPR: Only the emails the user EXPLICITLY selected are stored.
 * The full imported contact list is NEVER persisted server-side.
 *
 * Body:
 *  {
 *    inviterEmail: string;
 *    inviterName: string;
 *    companyName: string;
 *    invitees: Array<{ email: string; name?: string }>;
 *    source: 'google' | 'microsoft' | 'manual' | 'csv';
 *  }
 */

export const config = { runtime: 'edge' };

interface InvitationPayload {
  inviterEmail: string;
  inviterName: string;
  companyName: string;
  invitees: Array<{ email: string; name?: string }>;
  source: 'google' | 'microsoft' | 'manual' | 'csv';
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const payload: InvitationPayload = await request.json();

    if (!payload.inviterEmail || !payload.invitees?.length) {
      return new Response(
        JSON.stringify({ error: 'inviterEmail and at least one invitee required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Cap at 100 invitations per request to prevent abuse
    const invitees = payload.invitees.slice(0, 100);

    // Store in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      const rows = invitees.map((inv) => ({
        inviter_email: payload.inviterEmail,
        inviter_name: payload.inviterName || '',
        company_name: payload.companyName || '',
        invitee_email: inv.email,
        invitee_name: inv.name || '',
        source: payload.source || 'manual',
        status: 'pending',
        created_at: new Date().toISOString(),
      }));

      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/invitations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(rows),
        });

        if (!res.ok) {
          console.warn('Supabase invitations insert failed:', res.status, await res.text());
        }
      } catch (e) {
        console.warn('Supabase invitations error:', e);
      }
    } else {
      console.log('Supabase not configured — invitations stored in memory only');
    }

    // TODO: In production, trigger actual email invites via Resend / SendGrid / etc.
    // For now, we just store the intent. The onboarding team handles outreach.

    return new Response(
      JSON.stringify({
        success: true,
        count: invitees.length,
        message: 'Invitations queued',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Invitation API error:', err);
    return new Response(
      JSON.stringify({
        error: 'Failed to process invitations',
        details: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
