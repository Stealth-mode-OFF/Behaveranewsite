/**
 * Vercel Serverless Function: Nonprofit Lead
 * 
 * Receives lead data from /pro-neziskovky landing page and:
 * 1. Forwards to /api/submit-lead (Pipedrive + Supabase)
 * 2. Sends Slack notification tagged NEZISKOVKY
 * 
 * Environment variables:
 * - SLACK_WEBHOOK_URL — Slack Incoming Webhook URL
 * - (inherits PIPEDRIVE_API_KEY etc. from submit-lead)
 */

export const config = {
  runtime: 'edge',
};

interface NonprofitPayload {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

async function notifySlack(payload: NonprofitPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping notification');
    return;
  }

  const time = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "🏷️ NEZISKOVKY — Nový zájemce", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Jméno:*\n${payload.name}` },
        { type: "mrkdwn", text: `*E-mail:*\n${payload.email}` },
        { type: "mrkdwn", text: `*Telefon:*\n${payload.phone || '—'}` },
        { type: "mrkdwn", text: `*Organizace:*\n${payload.organization || '—'}` },
      ],
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: `📅 ${time} · Zdroj: Givt × Behavera newsletter` },
      ],
    },
  ];

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
    if (!res.ok) {
      console.warn('Slack notification failed:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('Slack notification error:', err);
  }
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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const payload: NonprofitPayload = await request.json();

    // Validate
    if (!payload.email || !payload.name) {
      return new Response(
        JSON.stringify({ error: 'Jméno a e-mail jsou povinné.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Forward to existing Pipedrive + Supabase endpoint
    //    We construct the internal URL from the request origin
    const origin = new URL(request.url).origin;
    const leadRes = await fetch(`${origin}/api/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        phone: payload.phone || undefined,
        company: payload.organization || undefined,
        source: 'neziskovky',
      }),
    });

    if (!leadRes.ok) {
      console.warn('submit-lead forwarding failed:', leadRes.status);
    }

    // 2. Send Slack notification (don't block on it)
    // Using waitUntil-like pattern: fire and don't await for user response speed
    const slackPromise = notifySlack(payload);

    // Wait for Slack too so it actually sends before the edge function exits
    await slackPromise;

    const leadData = leadRes.ok ? await leadRes.json() : null;

    return new Response(
      JSON.stringify({
        success: true,
        leadId: leadData?.leadId,
        personId: leadData?.personId,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Nonprofit lead error:', error);
    return new Response(
      JSON.stringify({ error: 'Odeslání selhalo.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
