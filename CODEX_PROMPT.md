# Codex Master Prompt — Admin Security & UX Audit Fix

## Context

You are working on `Behaveranewsite` — a Czech B2B SaaS website (Behavera) deployed on Vercel Edge Runtime with Supabase as the database. The admin panel lives at `/admin` and is gated by `VITE_ADMIN_ENABLED` env var on the frontend + Supabase Auth on the backend.

**An audit found critical security holes and UX issues in the admin area. Your job is to fix ALL of them in a single pass, carefully and precisely.**

The site language is **Czech** (CZ). All user-facing admin UI text must be in Czech. English is acceptable only in code comments and API error messages.

---

## Architecture Overview

- **Runtime:** Vercel Edge Functions (`export const config = { runtime: 'edge' }`)
- **Auth:** Supabase Auth (JWT) — frontend uses `@supabase/supabase-js`, APIs verify JWT manually
- **Frontend:** React 18 + TypeScript + Tailwind CSS + React Router DOM + lucide-react icons + sonner toasts
- **Database:** Supabase PostgreSQL (tables: `leads`, `event_leads`, `onboarding_submissions`, `onboarding_teams`, `onboarding_team_members`)
- **Integrations:** Pipedrive CRM, Slack webhooks, Google Sheets webhooks

### Key Files

| File | Purpose |
|---|---|
| `api/admin-leads.ts` | Admin API — GET leads, PATCH toggle processed |
| `api/admin-onboardings.ts` | Admin API — GET onboardings, PATCH change status |
| `api/submit-lead.ts` | Public form — creates Pipedrive lead + Supabase backup |
| `api/submit-onboarding.ts` | Public form — saves onboarding to Supabase + Pipedrive + Slack + Sheets |
| `api/qr-lead.ts` | Public form — QR event lead capture (has honeypot already) |
| `src/lib/auth-context.tsx` | Frontend auth provider (Supabase Auth + local-admin fallback) |
| `src/lib/config.ts` | `adminEnabled` flag from `VITE_ADMIN_ENABLED` |
| `src/lib/supabase.ts` | Supabase client init |
| `src/app/App.tsx` | Routes — admin routes gated by `adminEnabled` |
| `src/app/pages/admin/admin-login.tsx` | Login page |
| `src/app/pages/admin/admin-layout.tsx` | Sidebar layout — mixed CZ/EN nav labels |
| `src/app/pages/admin/dashboard.tsx` | Dashboard — has fake placeholder metrics |
| `src/app/pages/admin/leads.tsx` | Leads table with processed toggle |
| `src/app/pages/admin/onboardings.tsx` | Onboardings list + detail with status dropdown |
| `src/app/pages/admin/post-list.tsx` | Blog post management — English UI |
| `src/app/pages/admin/case-study-list.tsx` | Case study management — English UI |
| `src/app/pages/admin/post-editor.tsx` | Blog post editor |
| `src/app/pages/admin/case-study-editor.tsx` | Case study editor |
| `supabase-setup-leads-pipedrive.sql` | SQL migration for processed columns |

### Env vars available on Vercel (Production)

```
SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
VITE_ADMIN_ENABLED
PIPEDRIVE_API_TOKEN, PIPEDRIVE_COMPANY_DOMAIN
SLACK_WEBHOOK_URL, SLACK_BOT_TOKEN
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET
```

**NOTE:** There is NO `ADMIN_EMAILS` env var yet. You will add one to Vercel after implementation. Its value will be: `josef@behavera.com,admin@behavera.com`

---

## Issues to Fix (in priority order)

### 1. CRITICAL — Remove local-admin and default admin123 secret

**Current problem in `api/admin-leads.ts` and `api/admin-onboardings.ts`:**
```typescript
const ADMIN_SECRET = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'admin123';
if (token === 'local-admin' || token === ADMIN_SECRET) {
  authenticated = true;
}
```
This means ANYONE can call `/api/admin-leads` with `Authorization: Bearer local-admin` or `Bearer admin123` and get ALL lead data.

**Current problem in `src/lib/auth-context.tsx`:**
```typescript
const LOCAL_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@behavera.com';
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
```
Local fallback auth with hardcoded credentials.

**Fix:**
- **API files:** Remove the entire `local-admin` / `ADMIN_SECRET` fallback block from BOTH `api/admin-leads.ts` and `api/admin-onboardings.ts`. Authentication must ONLY go through JWT verification or Supabase `/auth/v1/user` endpoint.
- **auth-context.tsx:** Remove the entire local fallback mechanism. If Supabase is not configured (`supabase === null`), `login()` should return `{ success: false, error: 'Autentizace není nakonfigurována' }`. Remove `LOCAL_ADMIN_EMAIL`, `LOCAL_ADMIN_PASSWORD`, `LOCAL_SESSION_KEY` constants and all `sessionStorage` usage.

### 2. CRITICAL — Add admin email allowlist check

**Current problem:** Both admin APIs accept ANY valid Supabase JWT. Any registered user (even a random customer) can access admin data.

**Fix:** After JWT verification succeeds, extract the user's email from the JWT payload (or from the `/auth/v1/user` response) and check it against an allowlist.

In both `api/admin-leads.ts` and `api/admin-onboardings.ts`:

```typescript
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

// After authentication succeeds, extract email and check allowlist
```

**Implementation approach — create a shared auth helper:**

Create a new file `api/_lib/admin-auth.ts` (Vercel ignores `_lib` folders as non-routes) with:

```typescript
/**
 * Shared admin authentication for Vercel Edge Functions.
 * Verifies Supabase JWT + checks email against ADMIN_EMAILS allowlist.
 */

export interface AdminAuthResult {
  authenticated: boolean;
  email: string | null;
  error?: string;
}

export async function verifyAdminAuth(req: Request): Promise<AdminAuthResult> {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { authenticated: false, email: null, error: 'Server misconfigured' };
  }

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { authenticated: false, email: null, error: 'Unauthorized' };
  }

  let email: string | null = null;

  // 1. Try JWT verification (fast path)
  if (JWT_SECRET) {
    const jwtResult = await verifySupabaseJwt(token, JWT_SECRET);
    if (jwtResult.valid) {
      email = jwtResult.email;
    }
  }

  // 2. Fallback: verify via Supabase /auth/v1/user endpoint
  if (!email) {
    try {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      if (userRes.ok) {
        const userData = await userRes.json() as { email?: string };
        email = userData.email || null;
      }
    } catch {
      // ignore
    }
  }

  if (!email) {
    return { authenticated: false, email: null, error: 'Invalid or expired token' };
  }

  // 3. Check admin allowlist
  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email.toLowerCase())) {
    return { authenticated: false, email, error: 'Insufficient permissions' };
  }

  return { authenticated: true, email };
}

async function verifySupabaseJwt(token: string, jwtSecret: string): Promise<{ valid: boolean; email: string | null }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, email: null };

    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') return { valid: false, email: null };

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureInput = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = await crypto.subtle.sign('HMAC', key, signatureInput);
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (expectedSig !== parts[2]) return { valid: false, email: null };

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return { valid: false, email: null };

    return { valid: true, email: payload.email || null };
  } catch {
    return { valid: false, email: null };
  }
}
```

Then refactor BOTH `api/admin-leads.ts` and `api/admin-onboardings.ts` to:
1. Import `verifyAdminAuth` from `./_lib/admin-auth`
2. Remove the duplicated `verifySupabaseJwt` function
3. Remove the `local-admin` / `ADMIN_SECRET` block
4. Replace the auth section with a single call: `const auth = await verifyAdminAuth(req);`
5. Return appropriate error if `!auth.authenticated`

### 3. HIGH — Lock CORS to own domains

**Current:** `'Access-Control-Allow-Origin': '*'` in both admin APIs.

**Fix:** In both `api/admin-leads.ts` and `api/admin-onboardings.ts`, replace the static `*` with a dynamic origin check:

```typescript
const ALLOWED_ORIGINS = [
  'https://cz.behavera.com',
  'https://www.behavera.com',
  'https://behavera.com',
];

// In dev, also allow localhost
if (process.env.VERCEL_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };
}
```

Put this CORS logic into `api/_lib/admin-auth.ts` as an exported function so both APIs share it. Replace all usages of static `corsHeaders` with `getCorsHeaders(req)`.

**IMPORTANT:** Keep `Access-Control-Allow-Origin: '*'` on the PUBLIC form endpoints (`submit-lead.ts`, `submit-onboarding.ts`, `qr-lead.ts`) — those need to be callable from any origin.

### 4. HIGH — Add admin audit logging

**Fix:** After successful authentication in admin APIs, log every request to a Supabase table `admin_audit_log`.

Add to `api/_lib/admin-auth.ts`:

```typescript
export async function logAdminAccess(
  email: string,
  endpoint: string,
  method: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/rest/v1/admin_audit_log`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email,
        endpoint,
        method,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking — don't fail the request if logging fails
  }
}
```

Call it in both admin APIs after auth succeeds (fire-and-forget is OK here since it's non-critical):

```typescript
// Don't await — audit logging is non-blocking
logAdminAccess(auth.email!, '/api/admin-leads', req.method, SUPABASE_URL, SUPABASE_KEY);
```

Add SQL migration for the table (append to the SQL migration file or create new one).

### 5. MEDIUM — Fix dashboard placeholders

**File:** `src/app/pages/admin/dashboard.tsx`

**Current problems:**
- `"+2 this month"` is hardcoded on every card — it's fake data
- `"Total Views"` card shows `"—"` with a link to `"#"` — placeholder
- `"Active Authors"` card shows `"—"` with a link to `"#"` — placeholder
- "Recent Activity" section shows 3 identical fake items: `"Content updated"` / `"Recently • Behavera Team"`
- All text is in English

**Fix:**
- Remove the `"Total Views"` and `"Active Authors"` StatCards entirely (they have no data source)
- Replace `"+2 this month"` with actual data: calculate how many posts/case studies were created/updated this month by filtering the data by date
- Replace `"Recent Activity"` with actual data from the loaded posts and case studies (show most recently updated items), or remove the section if no timestamp data is available
- Translate ALL text to Czech:
  - `"Dashboard"` → `"Přehled"`
  - `"Overview of your content performance and status."` → `"Přehled obsahu a stavu administrace."`
  - `"Total Posts"` → `"Články"`
  - `"Case Studies"` → `"Případové studie"`
  - `"Manage Content"` → `"Spravovat"`
  - `"Recent Activity"` → `"Poslední aktivita"`
  - `"Latest updates to your content."` → `"Poslední změny obsahu."`
  - `"Quick Actions"` → `"Rychlé akce"`
  - `"Write New Article"` → `"Napsat článek"`
  - `"Add Case Study"` → `"Přidat případovou studii"`

### 6. MEDIUM — Unify admin UI language to Czech

**Affected files and specific changes:**

#### `src/app/pages/admin/admin-login.tsx`
- `"Admin Portal"` → `"Administrace"`
- `"Sign in with your Supabase account"` → `"Přihlaste se svým účtem"`
- `"Please enter email and password"` → `"Zadejte email a heslo"`
- `"Email address"` placeholder → `"E-mailová adresa"`
- `"Password"` placeholder → `"Heslo"`
- `"Welcome back"` → `"Vítejte zpět"`
- `"Invalid credentials"` → `"Neplatné přihlašovací údaje"`
- `"Authentication service unavailable"` → `"Služba ověření je nedostupná"`
- `"Signing in..."` → `"Přihlašuji…"`
- `"Sign In"` → `"Přihlásit se"`

#### `src/app/pages/admin/admin-layout.tsx`
- Section header `"Overview"` → `"Přehled"`
- Nav item `"Dashboard"` → `"Přehled"`
- Section header `"Content"` → `"Obsah"`
- Nav item `"Blog Posts"` → `"Články"`
- Nav item `"Case Studies"` → `"Případové studie"`
- Section header `"Sales"` → `"Prodej"` (already has some CZ)
- `"Sign Out"` (both desktop and mobile) → `"Odhlásit se"`
- Mobile header `"CMS"` → `"Admin"`

#### `src/app/pages/admin/post-list.tsx`
- `"Blog Posts"` → `"Články"`
- `"Manage your articles and insights."` → `"Správa článků a příspěvků."`
- `"Create New"` → `"Nový článek"`
- `"Search posts..."` → `"Hledat články…"`
- `"Loading content..."` → `"Načítám…"`
- `"No posts found matching your criteria."` → `"Žádné články neodpovídají hledání."`
- `"Are you sure you want to delete this post?"` → `"Opravdu chcete smazat tento článek?"`
- `"Post deleted"` → `"Článek smazán"`
- `"Failed to delete"` → `"Smazání selhalo"`
- `"Failed to load posts"` → `"Nepodařilo se načíst články"`
- Table headers: `"Title"` → `"Název"`, `"Author"` → `"Autor"`, `"Status"` → `"Stav"`, `"Published"` → `"Publikováno"`, `"Actions"` → `"Akce"`

#### `src/app/pages/admin/case-study-list.tsx`
- `"Case Studies"` → `"Případové studie"`
- `"Showcase your success stories and client results."` → `"Správa případových studií a úspěšných příběhů."`
- `"Create New"` → `"Nová studie"`
- `"Search clients or titles..."` → `"Hledat klienta nebo název…"`
- `"Loading case studies..."` → `"Načítám…"`
- `"No case studies found."` → `"Žádné případové studie nenalezeny."`
- Table headers: `"Client"` → `"Klient"`, `"Title"` → `"Název"`, `"Industry"` → `"Odvětví"`, `"Status"` → `"Stav"`, `"Actions"` → `"Akce"`
- Delete confirm: `Delete "${study.clientName}"? This cannot be undone.` → `Opravdu smazat "${study.clientName}"? Tuto akci nelze vrátit.`
- `"Deleted: ..."` → `"Smazáno: ..."`
- `"Failed to delete case study"` → `"Smazání selhalo"`
- `"Failed to load case studies"` → `"Nepodařilo se načíst případové studie"`

### 7. MEDIUM — Anti-spam on public forms

**File:** `api/submit-lead.ts`

Currently has NO spam protection. Add:

1. **Honeypot field** — check for `_hp` field (same pattern as `qr-lead.ts`):
```typescript
if (payload._hp) {
  // Honeypot triggered — silently accept but don't process
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
}
```

2. **Email validation** — basic format check:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(payload.email)) {
  return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400, headers: corsHeaders });
}
```

**File:** `api/submit-onboarding.ts`

Add same honeypot check. The payload type already exists, just add `_hp?: string` to `OnboardingPayload` and check it early:
```typescript
if ((payload as any)._hp) {
  return new Response(JSON.stringify({ success: true, submissionId: 'ok' }), { status: 200, headers: corsHeaders });
}
```

Add basic email validation for `repEmail`.

**NOTE:** `api/qr-lead.ts` already has honeypot — no changes needed there.

### 8. LOW — Fix leads page "Nezpracované" filter label bug

**File:** `src/app/pages/admin/leads.tsx`

In the processed filter buttons, the first button labeled `"Nezpracované"` has key `'all'` but label says "Nezpracované" — this is misleading. It should say `"Vše"` (meaning "All") since it shows all leads regardless of processed state. Fix:

```typescript
['all', 'Vše', null, ...] as const,
```

This is currently:
```typescript
['all', 'Nezpracované', null, leads.filter(l => !l.processed).length + eventLeads.filter(l => !l.processed).length] as const,
```

Change `'Nezpracované'` to `'Vše'` and remove the count for the "all" option (it doesn't show count anyway since `key === 'all'` skips the count badge).

### 9. SQL Migration

Create or update the SQL migration file to include:

```sql
-- admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Index for querying by email and time
CREATE INDEX IF NOT EXISTS admin_audit_log_email_idx ON admin_audit_log(email);
CREATE INDEX IF NOT EXISTS admin_audit_log_timestamp_idx ON admin_audit_log(timestamp DESC);

-- RLS: only service role can insert (API uses service key)
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_audit_log' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON admin_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
```

---

## Implementation Constraints

1. **Do NOT break existing functionality.** The frontend auth must still work with Supabase Auth. The admin PATCH endpoints for processed/status must still work.
2. **All API files use `export const config = { runtime: 'edge' }`.** Do not use Node.js APIs. Only use Web APIs (fetch, crypto.subtle, TextEncoder, atob/btoa, Request/Response).
3. **Do NOT install new packages.** Use only what's already in `package.json`.
4. **Vercel Edge Functions:** Files in `api/` are auto-routed. Files in `api/_lib/` are NOT routes (private modules). Use relative imports between them.
5. **Keep existing CORS `*` on public endpoints** (`submit-lead.ts`, `submit-onboarding.ts`, `qr-lead.ts`). Only lock CORS on admin endpoints.
6. **The `auth-context.tsx` changes must NOT break non-admin pages.** If Supabase is not configured, the auth context should just report `isAuthenticated: false` gracefully. Non-admin routes don't use auth.
7. **Test the TypeScript build** with `npx tsc --noEmit` after all changes. Ignore pre-existing errors in `src/lib/blog-content.ts` (275 errors, known issue). Your changes must introduce ZERO new errors.
8. **Commit message format:** `fix: admin security audit — auth hardening, CORS, audit log, CZ localization`

---

## Files to Create

1. `api/_lib/admin-auth.ts` — shared auth verification + CORS + audit logging

## Files to Modify

1. `api/admin-leads.ts` — use shared auth, remove local-admin, lock CORS
2. `api/admin-onboardings.ts` — use shared auth, remove local-admin, lock CORS
3. `src/lib/auth-context.tsx` — remove local fallback auth
4. `src/app/pages/admin/dashboard.tsx` — remove placeholders, translate to CZ
5. `src/app/pages/admin/admin-login.tsx` — translate to CZ
6. `src/app/pages/admin/admin-layout.tsx` — translate to CZ
7. `src/app/pages/admin/post-list.tsx` — translate to CZ
8. `src/app/pages/admin/case-study-list.tsx` — translate to CZ
9. `src/app/pages/admin/leads.tsx` — fix "Nezpracované" → "Vše" label bug
10. `api/submit-lead.ts` — add honeypot + email validation
11. `api/submit-onboarding.ts` — add honeypot + email validation
12. `supabase-setup-leads-pipedrive.sql` — add audit_log table

## Files NOT to Touch

- `api/qr-lead.ts` (already has honeypot, no changes needed)
- `api/nonprofit-lead.ts`
- `src/app/pages/admin/onboardings.tsx` (already fully Czech)
- `src/app/pages/admin/leads.tsx` (only the one label fix above)
- Any files in `src/app/components/`
- Any files in `content/`
- Any files in `archive/`

---

## Post-Implementation

After all code changes:

1. Run `npx tsc --noEmit 2>&1 | grep -v blog-content.ts` — must show 0 errors from changed files
2. Run `git add -A && git commit -m "fix: admin security audit — auth hardening, CORS, audit log, CZ localization"`
3. **Manual step (tell user):** Add `ADMIN_EMAILS` env var in Vercel dashboard with value `josef@behavera.com,admin@behavera.com`
4. **Manual step (tell user):** Run the SQL migration in Supabase SQL Editor
