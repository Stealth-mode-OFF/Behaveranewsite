/**
 * Vercel Serverless Function: Submit Nonprofit Lead
 *
 * Receives lead data from the /pro-neziskovky form and:
 * 1. Validates the input
 * 2. Creates / updates Person in Pipedrive
 * 3. Creates a Lead in Pipedrive
 * 4. Sends a Slack notification with the Pipedrive lead link
 * 5. Stores a backup row in Supabase
 *
 * Required env vars:
 *   PIPEDRIVE_API_KEY
 *   PIPEDRIVE_COMPANY_DOMAIN   (defaults to "behavera")
 *   SLACK_WEBHOOK_URL           (Slack incoming-webhook URL)
 *
 * Optional env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

/* ── Types ─────────────────────────────────────── */

interface NonprofitLeadPayload {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

interface PipedriveSearchResult {
  items: Array<{
    item: {
      id: number;
      name: string;
      emails: string[];
    };
  }>;
}

/* ── Pipedrive helpers ─────────────────────────── */

function getPipedriveUrl(endpoint: string): string {
  const apiKey = process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || "behavera";

  if (!apiKey) throw new Error("PIPEDRIVE_API_KEY not configured");

  const sep = endpoint.includes("?") ? "&" : "?";
  return `https://${domain}.pipedrive.com/api/v1${endpoint}${sep}api_token=${apiKey}`;
}

async function pipedriveRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: Record<string, unknown>,
): Promise<T> {
  const url = getPipedriveUrl(endpoint);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pipedrive API error: ${response.status}`);
  }

  return data.data;
}

async function findPersonByEmail(email: string): Promise<number | null> {
  try {
    const result = await pipedriveRequest<PipedriveSearchResult>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`,
    );
    return result.items?.[0]?.item?.id ?? null;
  } catch {
    return null;
  }
}

/* ── Slack helper ──────────────────────────────── */

async function sendSlackNotification(payload: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  leadId: string;
  personId: number;
  isExisting: boolean;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("SLACK_WEBHOOK_URL not configured, skipping Slack notification");
    return;
  }

  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || "behavera";
  const leadUrl = `https://${domain}.pipedrive.com/leads/inbox/${payload.leadId}`;

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🏢 Nový lead z /pro-neziskovky",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Jméno:*\n${payload.name}` },
        { type: "mrkdwn", text: `*Email:*\n${payload.email}` },
        {
          type: "mrkdwn",
          text: `*Telefon:*\n${payload.phone || "—"}`,
        },
        {
          type: "mrkdwn",
          text: `*Organizace:*\n${payload.organization || "—"}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: payload.isExisting
          ? "⚠️ Kontakt již existoval v Pipedrive"
          : "✅ Nový kontakt vytvořen v Pipedrive",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Otevřít lead v Pipedrive", emoji: true },
          url: leadUrl,
          style: "primary",
        },
      ],
    },
  ];

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });

    if (!res.ok) {
      console.warn("Slack notification failed:", res.status, await res.text());
    }
  } catch (error) {
    console.warn("Slack notification error:", error);
  }
}

/* ── Supabase backup ───────────────────────────── */

async function saveToSupabase(payload: NonprofitLeadPayload): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("Supabase not configured, skipping backup");
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        company: payload.organization,
        source: "behavera.com/pro-neziskovky",
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn("Supabase backup failed:", response.status);
    }
  } catch (error) {
    console.warn("Supabase backup error:", error);
  }
}

/* ── Edge runtime config ───────────────────────── */

export const config = {
  runtime: "edge",
};

/* ── Handler ───────────────────────────────────── */

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const payload: NonprofitLeadPayload = await request.json();

    /* ── Validate ─────────────────────────────── */
    if (!payload.email || !payload.name) {
      return new Response(
        JSON.stringify({ error: "Jméno a e-mail jsou povinné" }),
        { status: 400, headers: corsHeaders },
      );
    }

    /* ── Supabase backup (fire & forget) ─────── */
    saveToSupabase(payload);

    /* ── Person: find or create ───────────────── */
    let personId = await findPersonByEmail(payload.email);
    let isExisting = false;

    if (personId) {
      isExisting = true;
      // Update phone if provided
      if (payload.phone) {
        try {
          await pipedriveRequest(`/persons/${personId}`, "PUT", {
            phone: [{ value: payload.phone, primary: true }],
          });
        } catch {
          /* ignore update errors */
        }
      }
    } else {
      // Create organisation if provided
      let orgId: number | undefined;
      if (payload.organization) {
        try {
          const org = await pipedriveRequest<{ id: number }>(
            "/organizations",
            "POST",
            { name: payload.organization, visible_to: 3 },
          );
          orgId = org.id;
        } catch {
          /* org might already exist */
        }
      }

      // Create person
      const person = await pipedriveRequest<{ id: number }>(
        "/persons",
        "POST",
        {
          name: payload.name,
          email: [payload.email],
          phone: payload.phone ? [payload.phone] : undefined,
          org_id: orgId,
          visible_to: 3,
        },
      );
      personId = person.id;
    }

    /* ── Lead ─────────────────────────────────── */
    const orgLabel = payload.organization ? ` | ${payload.organization}` : "";
    const leadTitle = `[pro-neziskovky] ${payload.name}${orgLabel}`;

    const lead = await pipedriveRequest<{ id: string }>(
      "/leads",
      "POST",
      { title: leadTitle, person_id: personId },
    );

    /* ── Note ─────────────────────────────────── */
    const noteContent = [
      `**Zdroj:** behavera.com/pro-neziskovky`,
      `**Organizace:** ${payload.organization || "Neuvedeno"}`,
      `**Telefon:** ${payload.phone || "Neuveden"}`,
      `**Odesláno:** ${new Date().toISOString()}`,
      isExisting ? "\n⚠️ Kontakt již existoval v Pipedrive" : "",
    ]
      .filter(Boolean)
      .join("\n");

    await pipedriveRequest("/notes", "POST", {
      content: noteContent,
      lead_id: lead.id,
    });

    /* ── Slack notification ───────────────────── */
    // Don't await — fire & forget so user doesn't wait
    sendSlackNotification({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      organization: payload.organization,
      leadId: lead.id,
      personId,
      isExisting,
    });

    /* ── Response ─────────────────────────────── */
    return new Response(
      JSON.stringify({
        success: true,
        personId,
        leadId: lead.id,
        isExisting,
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("nonprofit-lead error:", error);

    return new Response(
      JSON.stringify({
        error: "Nepodařilo se odeslat formulář",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders },
    );
  }
}
