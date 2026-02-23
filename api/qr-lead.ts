// v2
/**
 * Vercel Edge Function: QR / Event Lead Capture
 *
 * Receives lead data from /scan_QR (kiosk + mobile QR) and:
 * 1. Validates payload + honeypot spam check
 * 2. Finds / creates Person in Pipedrive (dedup by email)
 * 3. Creates Organisation (best effort)
 * 4. Creates Lead + detailed Note in Pipedrive
 * 5. Sends Slack Block-Kit notification with Pipedrive link
 * 6. Backs up to Supabase event_leads table
 *
 * Env vars (reuse existing):
 *   PIPEDRIVE_API_KEY, PIPEDRIVE_COMPANY_DOMAIN (default "behavera")
 *   SLACK_WEBHOOK_URL
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

export const config = { runtime: "edge" };

/* ── Enums ─────────────────────────────────────── */

const EMPLOYEES_BUCKETS = ["1-49", "50-199", "200-999", "1000+"] as const;
const FEEDBACK_FREQ = ["no", "ad_hoc", "quarterly", "monthly_plus"] as const;
const DECISION_ROLES = ["decision_maker", "co_decision_maker", "connector"] as const;

type EmployeesBucket = (typeof EMPLOYEES_BUCKETS)[number];
type FeedbackFrequency = (typeof FEEDBACK_FREQ)[number];
type DecisionRole = (typeof DECISION_ROLES)[number];

/* ── Types ─────────────────────────────────────── */

interface QrLeadPayload {
  company: string;
  email: string;
  phone?: string;
  contact_name?: string;
  phone_required?: boolean;
  employees_bucket: EmployeesBucket;
  feedback_frequency: FeedbackFrequency;
  decision_role: DecisionRole;
  consent_contact: boolean;
  consent_marketing?: boolean;
  consent_privacy_url?: string;
  consent_version?: string;
  source?: {
    page?: string;
    src?: string;
    rep?: string;
    booth?: string;
    event?: string;
    source_meta?: Record<string, string>;
  };
  client?: {
    user_agent?: string;
    locale?: string;
    tz?: string;
  };
  // honeypot — must be empty
  _hp?: string;
}

interface PipedriveSearchResult {
  items: Array<{ item: { id: number; name: string; emails: string[] } }>;
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
    headers: { "Content-Type": "application/json", Accept: "application/json" },
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
    const r = await pipedriveRequest<PipedriveSearchResult>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`,
    );
    return r.items?.[0]?.item?.id ?? null;
  } catch {
    return null;
  }
}

/* ── Human-readable labels ─────────────────────── */

const bucketLabels: Record<EmployeesBucket, string> = {
  "1-49": "1–49",
  "50-199": "50–199",
  "200-999": "200–999",
  "1000+": "1 000+",
};

const feedbackLabels: Record<FeedbackFrequency, string> = {
  no: "Ne",
  ad_hoc: "Ad hoc",
  quarterly: "Ano (kvartálně)",
  monthly_plus: "Ano (měsíčně+)",
};

const roleLabels: Record<DecisionRole, string> = {
  decision_maker: "Rozhodovatel",
  co_decision_maker: "Spolurozhodovatel",
  connector: "Propojím s rozhodovatelem",
};

/* ── Slack notification ────────────────────────── */

async function sendSlackNotification(
  payload: QrLeadPayload,
  leadId: string,
  personId: number,
  isExisting: boolean,
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || "behavera";
  const leadUrl = `https://${domain}.pipedrive.com/leads/inbox/${leadId}`;
  const src = payload.source;

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "📱 Nový lead z QR / kiosku", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Firma:*\n${payload.company}` },
        { type: "mrkdwn", text: `*Email:*\n${payload.email}` },
        { type: "mrkdwn", text: `*Telefon:*\n${payload.phone || "—"}` },
        { type: "mrkdwn", text: `*Kontakt:*\n${payload.contact_name || "—"}` },
      ],
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Zaměstnanci:*\n${bucketLabels[payload.employees_bucket] || payload.employees_bucket}` },
        { type: "mrkdwn", text: `*Zpětná vazba:*\n${feedbackLabels[payload.feedback_frequency] || payload.feedback_frequency}` },
        { type: "mrkdwn", text: `*Role:*\n${roleLabels[payload.decision_role] || payload.decision_role}` },
        { type: "mrkdwn", text: `*Event:*\n${src?.event || "—"} / Booth: ${src?.booth || "—"}` },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: [
            src?.rep ? `Rep: ${src.rep}` : null,
            src?.src ? `Src: ${src.src}` : null,
            isExisting ? "⚠️ Existující kontakt" : "✅ Nový kontakt",
          ]
            .filter(Boolean)
            .join(" · "),
        },
      ],
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
    if (!res.ok) console.warn("Slack failed:", res.status);
  } catch (e) {
    console.warn("Slack error:", e);
  }
}

/* ── Supabase backup ───────────────────────────── */

async function saveToSupabase(
  payload: QrLeadPayload,
  createdAt: string,
): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.log("Supabase not configured, skipping backup");
    return;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/event_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: payload.email,
        company: payload.company,
        phone: payload.phone || null,
        contact_name: payload.contact_name || null,
        employees_bucket: payload.employees_bucket,
        feedback_frequency: payload.feedback_frequency,
        decision_role: payload.decision_role,
        consent_contact: payload.consent_contact,
        consent_marketing: payload.consent_marketing ?? false,
        consent_privacy_url: payload.consent_privacy_url || null,
        consent_version: payload.consent_version || null,
        source_page: payload.source?.page || "behavera.com/scan_QR",
        source_src: payload.source?.src || null,
        source_rep: payload.source?.rep || null,
        source_booth: payload.source?.booth || null,
        source_event: payload.source?.event || null,
        source_meta: payload.source?.source_meta
          ? JSON.stringify(payload.source.source_meta)
          : null,
        client_user_agent: payload.client?.user_agent || null,
        client_locale: payload.client?.locale || null,
        client_tz: payload.client?.tz || null,
        created_at: createdAt,
      }),
    });
    if (!res.ok) console.warn("Supabase backup failed:", res.status);
  } catch (e) {
    console.warn("Supabase backup error:", e);
  }
}

/* ── Handler ───────────────────────────────────── */

export default async function handler(request: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: cors });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: cors,
    });
  }

  try {
    const payload: QrLeadPayload = await request.json();
    const createdAt = new Date().toISOString();

    /* ── Honeypot ─────────────────────────────── */
    if (payload._hp) {
      // Silent 200 so bots think it worked
      return new Response(
        JSON.stringify({ success: true, honeypot: true }),
        { status: 200, headers: cors },
      );
    }

    /* ── Validate ─────────────────────────────── */
    if (!payload.email || !payload.company) {
      return new Response(
        JSON.stringify({ error: "Firma a e-mail jsou povinné" }),
        { status: 400, headers: cors },
      );
    }
    if (!payload.consent_contact) {
      return new Response(
        JSON.stringify({ error: "Souhlas se zpracováním je povinný" }),
        { status: 400, headers: cors },
      );
    }
    if (
      !EMPLOYEES_BUCKETS.includes(payload.employees_bucket) ||
      !FEEDBACK_FREQ.includes(payload.feedback_frequency) ||
      !DECISION_ROLES.includes(payload.decision_role)
    ) {
      return new Response(
        JSON.stringify({ error: "Neplatné hodnoty kvalifikačních otázek" }),
        { status: 400, headers: cors },
      );
    }

    /* ── Supabase backup (fire & forget) ─────── */
    saveToSupabase(payload, createdAt);

    /* ── Person: find or create ───────────────── */
    const displayName = payload.contact_name || payload.company;
    let personId = await findPersonByEmail(payload.email);
    let isExisting = false;

    if (personId) {
      isExisting = true;
      if (payload.phone) {
        try {
          await pipedriveRequest(`/persons/${personId}`, "PUT", {
            phone: [{ value: payload.phone, primary: true }],
          });
        } catch {
          /* ignore */
        }
      }
    } else {
      // Organisation (best effort)
      let orgId: number | undefined;
      try {
        const org = await pipedriveRequest<{ id: number }>(
          "/organizations",
          "POST",
          { name: payload.company, visible_to: 3 },
        );
        orgId = org.id;
      } catch {
        /* may already exist */
      }

      const person = await pipedriveRequest<{ id: number }>(
        "/persons",
        "POST",
        {
          name: displayName,
          email: [payload.email],
          phone: payload.phone ? [payload.phone] : undefined,
          org_id: orgId,
          visible_to: 3,
        },
      );
      personId = person.id;
    }

    /* ── Lead ─────────────────────────────────── */
    const leadTitle = `[event-lead] ${payload.company} | ${payload.email}`;

    const lead = await pipedriveRequest<{ id: string }>(
      "/leads",
      "POST",
      { title: leadTitle, person_id: personId },
    );

    /* ── Note (comprehensive) ─────────────────── */
    const src = payload.source;
    const noteContent = [
      `**Zdroj:** ${src?.page || "behavera.com/scan_QR"}`,
      `**Firma:** ${payload.company}`,
      `**Email:** ${payload.email}`,
      `**Telefon:** ${payload.phone || "—"}`,
      `**Kontaktní osoba:** ${payload.contact_name || "—"}`,
      "",
      "**Kvalifikace:**",
      `  Počet zaměstnanců: ${bucketLabels[payload.employees_bucket]}`,
      `  Zpětná vazba: ${feedbackLabels[payload.feedback_frequency]}`,
      `  Role v rozhodnutí: ${roleLabels[payload.decision_role]}`,
      "",
      "**Tracking:**",
      `  Event: ${src?.event || "—"}`,
      `  Booth: ${src?.booth || "—"}`,
      `  Rep: ${src?.rep || "—"}`,
      `  Src: ${src?.src || "—"}`,
      src?.source_meta
        ? `  Meta: ${JSON.stringify(src.source_meta)}`
        : null,
      "",
      "**Consent:**",
      `  Kontaktní souhlas: ✅ (${createdAt})`,
      `  Marketing: ${payload.consent_marketing ? "✅" : "❌"}`,
      `  Privacy URL: ${payload.consent_privacy_url || "/privacy-policy"}`,
      `  Verze: ${payload.consent_version || "v1"}`,
      "",
      `**Odesláno:** ${createdAt}`,
      `**Kiosk phone_required:** ${payload.phone_required ? "ano" : "ne"}`,
      isExisting ? "\n⚠️ Kontakt již existoval v Pipedrive" : "",
    ]
      .filter((l) => l !== null)
      .join("\n");

    await pipedriveRequest("/notes", "POST", {
      content: noteContent,
      lead_id: lead.id,
    });

    /* ── Slack (fire & forget) ────────────────── */
    sendSlackNotification(payload, lead.id, personId, isExisting);

    /* ── Response ─────────────────────────────── */
    return new Response(
      JSON.stringify({
        success: true,
        personId,
        leadId: lead.id,
        isExisting,
      }),
      { status: 200, headers: cors },
    );
  } catch (error) {
    console.error("qr-lead error:", error);
    return new Response(
      JSON.stringify({
        error: "Nepodařilo se odeslat",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: cors },
    );
  }
}
