/**
 * ONE-TIME backfill endpoint.
 *
 * Reads leads from Supabase where source contains "neziskov" or "nonprofit",
 * creates Person + Lead in Pipedrive for each, and optionally notifies Slack.
 *
 * Usage:
 *   curl -X POST https://www.behavera.com/api/backfill-nonprofit-leads \
 *        -H "Content-Type: application/json" \
 *        -d '{"secret":"backfill-2026"}'
 *
 * After successful run → DELETE this file from the repo.
 *
 * Env vars (already on Vercel):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY,
 *   PIPEDRIVE_API_TOKEN (preferred) or PIPEDRIVE_API_KEY, PIPEDRIVE_COMPANY_DOMAIN,
 *   SLACK_WEBHOOK_URL (optional)
 */

export const config = { runtime: "edge" };

/* ── Pipedrive helpers ─────────────────────────── */

function getPipedriveUrl(endpoint: string): string {
  const apiKey = process.env.PIPEDRIVE_API_TOKEN || process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || "behavera";
  if (!apiKey) throw new Error("PIPEDRIVE_API_TOKEN not configured");
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
    throw new Error(data.error || `Pipedrive error ${response.status}`);
  }
  return data.data;
}

async function findPersonByEmail(
  email: string,
): Promise<number | null> {
  try {
    const r = await pipedriveRequest<{
      items: Array<{ item: { id: number } }>;
    }>(
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`,
    );
    return r.items?.[0]?.item?.id ?? null;
  } catch {
    return null;
  }
}

/* ── Slack helper ──────────────────────────────── */

async function notifySlack(msg: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: msg }),
    });
  } catch {
    /* best effort */
  }
}

/* ── Types ─────────────────────────────────────── */

interface SupabaseLead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  company: string | null;
  company_size: string | null;
  role: string | null;
  source: string;
  created_at: string;
}

interface BackfillResult {
  email: string;
  name: string | null;
  personId: number;
  leadId: string;
  status: "created" | "existing-person";
  error?: undefined;
}

interface BackfillError {
  email: string;
  name: string | null;
  error: string;
  personId?: undefined;
  leadId?: undefined;
  status?: undefined;
}

/* ── Handler ───────────────────────────────────── */

export default async function handler(request: Request): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "POST only" }),
      { status: 405, headers },
    );
  }

  // Simple secret guard so nobody accidentally triggers this
  try {
    const body = await request.json();
    if (body.secret !== "backfill-2026") {
      return new Response(
        JSON.stringify({ error: "Invalid secret" }),
        { status: 403, headers },
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Send {"secret":"backfill-2026"}' }),
      { status: 400, headers },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Supabase not configured" }),
      { status: 500, headers },
    );
  }

  if (!process.env.PIPEDRIVE_API_TOKEN && !process.env.PIPEDRIVE_API_KEY) {
    return new Response(
      JSON.stringify({ error: "PIPEDRIVE_API_TOKEN not configured" }),
      { status: 500, headers },
    );
  }

  /* ── 1. Fetch leads from Supabase ──────────── */

  // Match sources like "behavera.com/pro-neziskovky", "pro-neziskovky", "nonprofit" etc.
  const query = `${supabaseUrl}/rest/v1/leads?or=(source.ilike.*neziskov*,source.ilike.*nonprofit*)&order=created_at.asc`;

  const supaRes = await fetch(query, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: "application/json",
    },
  });

  if (!supaRes.ok) {
    const txt = await supaRes.text();
    return new Response(
      JSON.stringify({ error: `Supabase query failed: ${supaRes.status}`, details: txt }),
      { status: 500, headers },
    );
  }

  const leads: SupabaseLead[] = await supaRes.json();

  if (leads.length === 0) {
    // If no leads matched the filter, try fetching ALL leads so user can inspect
    const allRes = await fetch(
      `${supabaseUrl}/rest/v1/leads?order=created_at.desc&limit=50`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Accept: "application/json",
        },
      },
    );
    const allLeads: SupabaseLead[] = allRes.ok ? await allRes.json() : [];

    return new Response(
      JSON.stringify({
        message: "No nonprofit leads found in Supabase with source matching *neziskov* or *nonprofit*",
        totalLeadsInDb: allLeads.length,
        sources: [...new Set(allLeads.map((l) => l.source))],
        recentLeads: allLeads.slice(0, 10).map((l) => ({
          email: l.email,
          name: l.name,
          source: l.source,
          created_at: l.created_at,
        })),
      }),
      { status: 200, headers },
    );
  }

  /* ── 2. Process each lead ──────────────────── */

  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN || "behavera";
  const results: (BackfillResult | BackfillError)[] = [];

  for (const lead of leads) {
    try {
      const name = lead.name || lead.email.split("@")[0];
      let personId = await findPersonByEmail(lead.email);
      let isExisting = false;

      if (personId) {
        isExisting = true;
        // Update phone if available
        if (lead.phone) {
          try {
            await pipedriveRequest(`/persons/${personId}`, "PUT", {
              phone: [{ value: lead.phone, primary: true }],
            });
          } catch { /* ignore */ }
        }
      } else {
        // Create org if company provided
        let orgId: number | undefined;
        if (lead.company) {
          try {
            const org = await pipedriveRequest<{ id: number }>(
              "/organizations",
              "POST",
              { name: lead.company, visible_to: 3 },
            );
            orgId = org.id;
          } catch { /* org may exist */ }
        }

        // Create person
        const person = await pipedriveRequest<{ id: number }>(
          "/persons",
          "POST",
          {
            name,
            email: [lead.email],
            phone: lead.phone ? [lead.phone] : undefined,
            org_id: orgId,
            visible_to: 3,
          },
        );
        personId = person.id;
      }

      // Create lead
      const orgLabel = lead.company ? ` | ${lead.company}` : "";
      const leadTitle = `[pro-neziskovky backfill] ${name}${orgLabel}`;

      const pLead = await pipedriveRequest<{ id: string }>(
        "/leads",
        "POST",
        { title: leadTitle, person_id: personId },
      );

      // Add note
      const noteContent = [
        `**Zdroj:** ${lead.source}`,
        `**Organizace:** ${lead.company || "—"}`,
        `**Telefon:** ${lead.phone || "—"}`,
        `**Role:** ${lead.role || "—"}`,
        `**Velikost firmy:** ${lead.company_size || "—"}`,
        `**Původně odesláno:** ${lead.created_at}`,
        `**Backfill:** ${new Date().toISOString()}`,
        isExisting ? "\n⚠️ Kontakt již existoval v Pipedrive" : "",
      ]
        .filter(Boolean)
        .join("\n");

      await pipedriveRequest("/notes", "POST", {
        content: noteContent,
        lead_id: pLead.id,
      });

      // Slack
      const leadUrl = `https://${domain}.pipedrive.com/leads/inbox/${pLead.id}`;
      notifySlack(
        `🔄 Backfill lead: *${name}* (${lead.email})${orgLabel}\n<${leadUrl}|Otevřít v Pipedrive>`,
      );

      results.push({
        email: lead.email,
        name,
        personId,
        leadId: pLead.id,
        status: isExisting ? "existing-person" : "created",
      });

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      results.push({
        email: lead.email,
        name: lead.name,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const created = results.filter((r) => !r.error).length;
  const failed = results.filter((r) => r.error).length;

  // Summary Slack message
  notifySlack(
    `✅ Backfill hotov: ${created} lead(ů) vytvořeno, ${failed} chyb z ${leads.length} celkem.`,
  );

  return new Response(
    JSON.stringify({
      message: `Backfill complete: ${created} created, ${failed} failed out of ${leads.length} total`,
      results,
    }),
    { status: 200, headers },
  );
}
