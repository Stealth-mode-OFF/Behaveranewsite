# NAV-UX plan v3: komentare + task split + Codex maximizace

> Tento dokument je operacni verze pro implementaci.
> Cile: 1) sjednotit UX navigace, 2) zachovat funkcni legacy URL, 3) neznicit konverzi produktovych CTA.
> Posledni aktualizace: 2026-02-20.

---


## 0) Doporučené modely pro Codex tasky

### Přepínání modelu (viz screenshot VS Code)

- **GPT-5.3-Codex** — použij pro všechny codebase-heavy tasky (C1, C2, C3, C5, C6, C7)
   - Nejnovější, nejpřesnější na multi-file codebase scan, dependency graph, TypeScript generování, tabulky, line numbers.
   - Je to "codex-1" v tomto plánu, jen novější verze.
- **GPT-5.1-Codex-Max** — použij pro analytické, strategické, komentované tasky (C4, C8)
   - Má lepší reasoning, shrnutí, diagramy, risk analýzy, komentáře.
   - Vhodné pro „Attribution flow trace“ a „Risk analysis + rollback playbook“.
- **GPT-5.2-Codex** — fallback, pokud by 5.3 nefungoval.
- **GPT-5.2** — generalista, nebrat na codebase.
- **GPT-5.1-Codex-Mini** — jen na rychlé, triviální úlohy.

### Jak z Codexu dostat maximum
1. **Full-auto mode** — každý task spouštět jako samostatný Codex run, ne batch.
2. **Přesné acceptance criteria** — Codex dostane jasný checklist co musí výstup obsahovat.
3. **Output format** — pro každý task specifikovat přesný formát (markdown tabulka, `.ts` soubor, atd.).
4. **Self-verification** — každý task končí příkazem, který Codex provede sám, aby ověřil svůj výstup.
5. **File paths** — každý task obsahuje konkrétní soubory které má číst.
6. **Context boundary** — explicitně říct co NE-číst (node_modules, dist, .git).
7. **Jeden task = jeden soubor výstupu** — Codex vrací jeden jasný artefakt, ne rozsáhlou konverzaci.

---

## 1) Rozhodnuti, ktera musi byt pevna pred implementaci

> **Schvaluje: Josef** — pred zahajenim C1–C8.

### R1: Typy odkazu v UI
- `navigacni odkazy` (header/footer/menu): vzdy kanonicke relativni cesty (`/blog`, `/case-studies`, `/start`).
- `produktove konverzni CTA` (napr. "Otestovat zdarma"): mohou jit primo na `app.behavera.com/*` — pouzivat konstanty z `src/lib/urls.ts`.
- `legacy odkazy`: NIKDY v novem UI, pouze pres redirect vrstvu v `vercel.json`.
- `email/kontaktni`: `mailto:` a `tel:` jsou OK jako hardcoded stringy.

### R2: Redirect policy
- `301` pro legacy GET obsahove stranky.
- `308` jen tam, kde je potreba striktne zachovat method/body (typicky API endpointy).
- Zadny redirect chain; kazda legacy URL smeruje primo na final kanonickou URL.
- Zachovat query params (`utm_*`, `gclid`, `fbclid`, interni attribution parametry).
- Aktualni stav `vercel.json`: 4 redirecty (`/podminky-pouzivani-sluzby`, `/ochrana-osobnich-udaju`, `/demo`, `/engagement`).
- Aktualne v `app.tsx`: dalsi 3 in-app redirecty (`/podminky-pouzivani-sluzby`, `/ochrana-osobnich-udaju`, `/signup`).
- **Sjednotit**: vsechny redirecty presunout do `vercel.json`, z `app.tsx` odstranit `<Navigate>` komponenty.

### R3: Canonical owner
- Kazdy obsahovy typ ma jednoho vlastnika URL (blog, case studies, start flow).
- `sitemap.xml`, `canonical`, `robots.txt` musi odpovidat stejne source-of-truth mape.
- Aktualni stav `sitemap.xml`: chybi `/privacy-policy`, `/team`, `/start`, `/pro-neziskovky`, `/changelog`, vsechny blog a case-study slugy.
- `canonical` se nastavuje pres `useSEO()` hook (viz `src/app/hooks/use-seo.ts`), ale ne vsechny stranky ho pouzivaji.

### R4: Branch strategie
- Vse na feature branchi `nav-ux-refactor`.
- Jeden squash merge do `main` po splneni Definition of Done.
- Zadne inkrementalni commity na `main` behem refactoru.

---

## 2) Claude komentare k planu

### Co je spravne
- Centralni route mapa (`src/app/config/routes.ts`) je nutna.
- Redirect vrstva v `vercel.json` je spravne misto pro vsechny redirecty.
- Dulezitost query params pro attribution je spravne zachycena.
- Pozadavek na konzistenci canonical + sitemap je spravne.
- Dvoukrokovy pristup k `cms-service.ts` je bezpecny.

### Co upravit
- Pravidlo "navbar nikdy subdomena" je spravne, ale JIZ existuje vyjimka v `src/lib/urls.ts` — to je spravny pattern, centralizovat tam.
- ISR/Next.js ted nedavat do scope; aktualni stack je SPA (Vite + React Router v6).
- `routes.ts` musi exportovat helper FUNKCE (napr. `blogPostPath(slug)`), ne jen stringy — jinak se rozleze inline concatenation.

### Co chybi a pridavam
- Formalni URL governance (owner + proces, kdyz pribude nova verejna URL).
- Explicitni mapovani ktere soubory obsahuji kolik odkazu (viz scan nize).
- Scope guard: **NEMENIT onboarding.tsx (1868 radku) ani signup-modal.tsx (1563 radku)** — to patri do F1/F2 v `next-plan.md`.

### Aktualni stav codebase (scan 2026-02-20)
Soubory s nejvice URL odkazy (zdroj: `grep -rc` pres `src/`):
```
blog-content.ts    : 62 odkazu (vsechny uvnitr article HTML — NEresit)
privacy-policy.tsx : 11 (mailto + legal, NEresit)
header.tsx         : 11 (⬅ PRIORITA — navigace + CTA)
footer.tsx         : 10 (⬅ PRIORITA — navigace + kontakt)
terms.tsx          :  6 (legal linky, NEresit)
app.tsx            :  6 (route definice — refactor na routes.ts)
onboarding.tsx     :  5 (OUT OF SCOPE)
signal-radar.tsx   :  4 (bibi.behavera.com — jiz pres urls.ts)
nonprofit.tsx      :  4 (contact + branding)
team.tsx           :  4 (SEO)
```

Externich domen v `src/` (mimo email/tel):
```
app.behavera.com    : 11x (hero, pricing, cta, header, footer, announcement, mobile-cta, problem, role-selection)
www.behavera.com    : 6x  (pricing, cta-section, signup-modal, onboarding)
cz.behavera.com     : 3x  (terms)
bibi.behavera.com   : 3x  (signal-radar, urls.ts)
```

---

## 3) CODEX tasky — maximalizovane

### Doporuceny model: `codex-1` (pokud neni receno jinak)

---

### C1: Kompletni URL inventory celeho codebase

**Prompt pro Codex:**
```
# TASK: Complete URL inventory of the Behavera marketing site codebase

## What to do
Scan the ENTIRE `src/` directory and `api/` directory. Find every instance of:
1. React Router `<Link to="...">` — extract the `to` value
2. HTML `<a href="...">` — extract the `href` value
3. `navigate("...")` or `navigate('...')` calls
4. `window.location` assignments
5. Constants in `src/lib/urls.ts`
6. Redirect definitions in `vercel.json` and `<Navigate to="...">` in `app.tsx`

## What to produce
Create a file `docs/audits/url-inventory.md` with this EXACT structure:

### Table 1: Internal navigation links
| File | Line | Link type | Value | Category |
Where Category is one of: `nav` (menu/header/footer), `cta` (conversion button), `legal` (terms/privacy), `seo` (canonical/og), `redirect` (Navigate/301), `content` (inside blog HTML)

### Table 2: External domain references
| File | Line | Domain | Full URL | Purpose |

### Table 3: Redirect map (current state)
| Source | Destination | Type | Defined in |

### Summary statistics
- Total internal links: N
- Total external links: N  
- Links using urls.ts constants: N
- Hardcoded full URLs that SHOULD use urls.ts: N (list them)
- Routes in app.tsx without sitemap entry: N (list them)
- Sitemap entries without matching route: N (list them)

## Files to read
- src/lib/urls.ts
- src/app/app.tsx
- vercel.json
- public/sitemap.xml
- public/robots.txt
- Then grep ALL .tsx and .ts files in src/ and api/

## Do NOT read
- node_modules/
- dist/
- .git/
- *.css files
- scripts/

## Self-verification
After creating the file, run:
grep -c 'href=\|to="\|navigate(' src/**/*.tsx src/**/*.ts src/lib/*.ts | sort -t: -k2 -rn
and verify your table row count matches the grep count (± blog-content.ts which has 62 content links).

## Output
Single file: docs/audits/url-inventory.md
```

**Acceptance criteria:**
- [ ] Table 1 has 80+ rows (expected from grep)
- [ ] Table 2 lists all 4 external domains (app, www, cz, bibi)
- [ ] Table 3 has 7 redirects (4 vercel.json + 3 app.tsx Navigate)
- [ ] Summary stats are complete
- [ ] Self-verification section at bottom with grep output

---

### C2: Redirect spec — final tabulka old → new

**Prompt pro Codex:**
```
# TASK: Design the complete redirect map for Behavera site

## Context
Read these files first:
- docs/audits/url-inventory.md (output of previous task C1)
- vercel.json (current redirects)
- src/app/app.tsx (current in-app Navigate redirects)
- public/sitemap.xml

## What to do
1. List ALL URLs that currently redirect (both vercel.json and app.tsx <Navigate>)
2. Identify any URLs that SHOULD redirect but don't (legacy paths, old slugs)
3. For each redirect, specify:
   - Source path (old)
   - Destination path (new, canonical)
   - Status code (301 or 308) with justification
   - Query param handling (pass-through or strip)
4. Verify NO redirect chains exist (A→B→C is forbidden; must be A→C)
5. Verify ALL destinations are valid routes in app.tsx

## What to produce
Create file: `docs/audits/redirect-spec.md`

### Section 1: Current redirects (as-is)
Table with: Source | Destination | Status | Defined in | Issues

### Section 2: Proposed redirect map (to-be)
Table with: Source | Destination | Status | Query handling | Notes

### Section 3: vercel.json block (ready to copy-paste)
The actual JSON `"redirects": [...]` array, formatted and ready for implementation.

### Section 4: Removed Navigate components
List of <Navigate> components to remove from app.tsx after vercel.json handles them.

### Section 5: Chain verification
For each redirect, trace the full path and confirm it's single-hop.

## Rules
- ALL redirects go in vercel.json, NONE as React <Navigate> (except for query-param based like /signup → /?signup=1)
- Legacy Czech paths (podminky-pouzivani-sluzby, ochrana-osobnich-udaju) → 301
- /demo and /engagement → 302 (temporary, query-param based)
- All UTM params (utm_source, utm_medium, utm_campaign, utm_content, utm_term), gclid, fbclid MUST pass through
- vercel.json supports $1 capture groups for path segments

## Output
Single file: docs/audits/redirect-spec.md
```

**Acceptance criteria:**
- [ ] Every current redirect is documented
- [ ] vercel.json block is valid JSON
- [ ] No redirect chains
- [ ] Query param pass-through is explicit for each redirect
- [ ] Navigate components to remove are listed with file:line

---

### C3: Canonical / sitemap / robots gap analysis

**Prompt pro Codex:**
```
# TASK: SEO consistency audit — canonical, sitemap, robots

## Context
Read these files:
- public/sitemap.xml
- public/robots.txt
- src/app/hooks/use-seo.ts (the useSEO hook that sets canonical)
- src/app/seo.config.ts
- src/app/app.tsx (all route definitions)
- src/lib/urls.ts (SITE_ORIGIN constant)

Then grep for `useSEO(` in all .tsx files under src/app/pages/ to find which pages set canonical and which don't.

## What to produce
Create file: `docs/audits/seo-gap-report.md`

### Table 1: Route vs Sitemap vs Canonical matrix
| Route path | In sitemap? | Sets canonical? | canonical URL | Issues |

Cover ALL routes from app.tsx including:
/, /terms, /privacy-policy, /blog, /blog/:slug, /case-studies, /case-studies/:slug,
/changelog, /team, /echo-pulse-vs-google-forms, /for-ceos, /for-hr, /for-team-leads,
/start, /pro-neziskovky

### Table 2: Sitemap gaps
Routes that exist in app.tsx but are NOT in sitemap.xml (with recommendation: add or intentionally exclude)

### Table 3: Canonical gaps
Pages that do NOT call useSEO() with canonicalUrl parameter

### Table 4: robots.txt review
Current rules + any missing Disallow rules (e.g., should /signup redirect be disallowed?)

### Section 5: Recommended sitemap.xml
Full XML content for an updated sitemap that includes all public routes.
For blog posts and case studies, note that these are dynamic — document the pattern,
not individual URLs (unless you can extract all slugs from blog-content.ts and cms-service.ts).

### Section 6: Recommended actions (prioritized)
Numbered list of specific fixes, each with file path and what to change.

## Output
Single file: docs/audits/seo-gap-report.md
```

**Acceptance criteria:**
- [ ] Matrix covers all 15+ routes from app.tsx
- [ ] Each route clearly marked as in/out of sitemap
- [ ] Pages without canonical are listed
- [ ] Updated sitemap.xml draft is included
- [ ] Each recommendation has a specific file path

---

### C4: Attribution handoff spec (model: `o3`)

**Prompt pro Codex:**
```
# TASK: Attribution parameter handling specification

## Context
Read these files:
- src/lib/urls.ts
- src/lib/analytics.ts
- src/lib/config.ts
- src/app/components/layout/header.tsx
- src/app/components/layout/footer.tsx
- src/app/components/sections/hero.tsx
- src/app/components/sections/cta-section.tsx
- src/app/components/sections/pricing.tsx
- src/app/pages/public/onboarding.tsx (just the form submission parts, search for 'utm' or 'attribution')
- api/submit-lead.ts
- api/submit-onboarding.ts
- vercel.json

## What to do
1. Trace the full journey of a UTM parameter from first landing to form submission:
   - User arrives at cz.behavera.com/?utm_source=google&utm_medium=cpc
   - User navigates internally (header links, CTA clicks)
   - User reaches /start (onboarding) or opens signup modal
   - User submits a form
   - Data goes to API endpoint → Supabase/Pipedrive
   
2. For each step, document:
   - Are UTM params preserved? How?
   - Are they stored in sessionStorage/localStorage/cookie?
   - Are they passed in form data?
   - Are they sent to the API?

3. Identify gaps where attribution is LOST.

## What to produce
Create file: `docs/audits/attribution-spec.md`

### Section 1: Parameter taxonomy
Table: Param name | Source | Example | Priority
(utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, internal ref params)

### Section 2: Current attribution flow
Diagram (text-based) showing the parameter journey through the app.

### Section 3: Gap analysis
Where are params lost? Specifically:
- Internal React Router navigation (does it preserve query params?)
- Redirect hops in vercel.json (does Vercel pass query params by default?)
- Form submissions (are UTM params included in the payload?)
- Cross-domain links to app.behavera.com (are params forwarded?)

### Section 4: Recommendations
Specific code changes to ensure zero attribution loss.
Each recommendation: file path, what exists now, what should change.

## Output
Single file: docs/audits/attribution-spec.md
```

**Acceptance criteria:**
- [ ] Full parameter taxonomy documented
- [ ] End-to-end flow traced from landing to API
- [ ] Each gap has a specific file + line reference
- [ ] Recommendations are actionable (not vague)

---

### C5: Route contract navrh — `routes.ts` soubor

**Prompt pro Codex:**
```
# TASK: Design the central route configuration file

## Context
Read these files:
- src/app/app.tsx (all current route definitions, lines 124-181)
- src/lib/urls.ts (external URL constants)
- src/app/hooks/use-seo.ts (SEO hook interface)
- src/app/seo.config.ts (SEO config type)
- docs/audits/url-inventory.md (C1 output, if it exists)

## What to do
Design a TypeScript file `src/app/config/routes.ts` that:

1. Exports a `ROUTES` const object with all route paths as string literals.
2. Exports helper FUNCTIONS for dynamic routes:
   - `blogPostPath(slug: string): string`
   - `caseStudyPath(slug: string): string`
   - `adminPostEditPath(id: string): string`
   - `adminCaseStudyEditPath(id: string): string`
3. Exports `EXTERNAL_URLS` that re-exports from urls.ts (so components import from one place).
4. Exports `REDIRECTS` array matching the vercel.json format.
5. Exports a `SEO_CONFIG` map: route path → { title, description, canonical, sitemap priority }.
6. All exports are fully typed with TypeScript.
7. Include JSDoc comments.

## Constraints
- MUST be a pure TypeScript file (no React imports).
- MUST NOT import from any component file.
- MAY import from src/lib/urls.ts.
- Route paths must match EXACTLY what's in app.tsx today.
- Helper functions must use template literals, not string concatenation.

## What to produce
Create file: `src/app/config/routes.ts` — full, working TypeScript code.
Also create file: `docs/audits/route-contract.md` — documentation of the naming conventions and rules.

The docs file should include:
1. Naming conventions (camelCase for keys, kebab-case for paths)
2. When to add a new route (checklist)
3. Migration guide: how to convert a hardcoded link to use ROUTES

## Self-verification
After creating routes.ts, run:
npx tsc --noEmit src/app/config/routes.ts
to verify it compiles.

## Output
Two files: src/app/config/routes.ts + docs/audits/route-contract.md
```

**Acceptance criteria:**
- [ ] ROUTES object covers all 15+ routes from app.tsx
- [ ] Helper functions for all dynamic routes
- [ ] EXTERNAL_URLS re-exports app.behavera.com, bibi.behavera.com
- [ ] TypeScript compiles without errors
- [ ] JSDoc on every export
- [ ] Migration guide in docs

---

### C6: Component dependency graph pro nav-related soubory

**Prompt pro Codex:**
```
# TASK: Map the component dependency graph for navigation-related files

## What to do
For each of these files, find ALL imports and ALL importers:
- src/app/components/layout/header.tsx
- src/app/components/layout/footer.tsx
- src/app/components/layout/sticky-mobile-cta.tsx
- src/app/components/layout/announcement-bar.tsx
- src/app/components/layout/signup-modal.tsx
- src/app/components/layout/booking-modal.tsx
- src/app/components/layout/demo-access-modal.tsx
- src/app/components/sections/hero.tsx
- src/app/components/sections/cta-section.tsx
- src/app/components/sections/pricing.tsx
- src/app/components/sections/problem.tsx
- src/app/components/sections/role-selection.tsx
- src/app/app.tsx
- src/lib/urls.ts

For each file, document:
1. What it imports (only local imports, not node_modules)
2. What files import IT
3. Which URLs/links it contains (from C1 data or grep)
4. Size (line count)
5. Risk assessment: HIGH (breaking change affects conversion), MEDIUM (visible UX change), LOW (safe refactor)

## What to produce
Create file: `docs/audits/nav-dependency-graph.md`

### Table: Component impact matrix
| File | Imports from | Imported by | URL count | Lines | Risk |

### Section: Safe refactor order
Based on the dependency graph, what's the safest ORDER to refactor these files to avoid breaking intermediate builds?

### Section: Shared state
List any shared state (Context, zustand, etc.) that nav components use. Specifically:
- LanguageContext
- ModalContext
- Any other shared hooks

## Output
Single file: docs/audits/nav-dependency-graph.md
```

**Acceptance criteria:**
- [ ] All 14 files covered
- [ ] Import/importer relationships are bidirectional and consistent
- [ ] Risk levels are justified
- [ ] Refactor order is practical
- [ ] Shared state documented

---

### C7: Hardcoded URL → constant migration plan

**Prompt pro Codex:**
```
# TASK: Create an exact migration plan for replacing hardcoded URLs with route constants

## Context
Read: docs/audits/url-inventory.md (C1 output)
Read: src/app/config/routes.ts (C5 output, if exists)
Read: src/lib/urls.ts

## What to do
For every hardcoded URL in the codebase that should be replaced:
1. List the exact file, line number, current code, and replacement code.
2. Group by file for efficient batch editing.
3. Mark which replacements are SAFE (no behavior change) vs RISKY (might change behavior).

## What to produce
Create file: `docs/audits/url-migration-plan.md`

### Per-file sections
For each file that needs changes:
```
#### header.tsx
| Line | Current | Replacement | Safe? |
| 174 | `href="https://app.behavera.com/echo-pulse/try"` | `href={EXTERNAL_URLS.echoPulseTry}` | ✅ |
```

### Summary
- Total replacements: N
- Safe replacements: N
- Risky replacements: N (with explanation why)
- Files untouched (and why): list

### Estimated implementation time
Per file, in minutes.

## Output
Single file: docs/audits/url-migration-plan.md
```

**Acceptance criteria:**
- [ ] Every hardcoded URL from C1 is addressed (migrated or explicitly skipped with reason)
- [ ] Line numbers are accurate
- [ ] Replacement code is syntactically correct
- [ ] Risk assessment for each change

---

### C8: Risk analysis a rollback scenare (model: `o3`)

**Prompt pro Codex:**
```
# TASK: Risk analysis for the NAV-UX migration

## Context
Read ALL docs/audits/*.md files (C1-C7 outputs).
Read: src/app/app.tsx
Read: vercel.json

## What to do
Think through what can go wrong during this migration and design rollback procedures.

## What to produce
Create file: `docs/audits/risk-analysis.md`

### Section 1: Risk matrix
| Risk | Probability | Impact | Mitigation |
Categories: SEO (rankings drop), Conversion (CTA breaks), UX (404s/loops), Technical (build fails)

### Section 2: Pre-deploy checklist
Exact commands to run before deploying:
- Build verification
- Link scan (grep for leaked old patterns)
- Redirect chain test (curl -I each legacy URL)

### Section 3: Post-deploy verification
Exact URLs to check after deploy, with expected status codes.

### Section 4: Rollback playbook
Step-by-step instructions for:
- Scenario A: 404 spike (within 5 minutes of deploy)
- Scenario B: Conversion drop (detected after 24h)
- Scenario C: SEO ranking drop (detected after 7 days)
Each with: trigger condition, action steps, verification.

### Section 5: Monitoring dashboard spec
What to track in Vercel Analytics / custom logging:
- Redirect hit rates
- 404 URLs
- Top landing pages pre/post
- Conversion funnel completion rate

## Output
Single file: docs/audits/risk-analysis.md
```

**Acceptance criteria:**
- [ ] At least 8 risks identified
- [ ] Each risk has probability + impact + mitigation
- [ ] Pre-deploy checklist has runnable commands
- [ ] Post-deploy has specific URLs and expected status codes
- [ ] Rollback is step-by-step, not vague

---

## 4) Codex execution order

```
FAZE 1 — audit (parallelizable):
  C1 (URL inventory)       ← PRVNI, vsechno ostatni na nem zavisi
  C3 (SEO gap report)      ← muze bezet paralelne s C1

FAZE 2 — design (zavisi na C1):
  C4 (Attribution spec)    ← zavisi na C1
  C5 (Route contract)      ← zavisi na C1
  C6 (Dependency graph)    ← zavisi na C1

FAZE 3 — planning (zavisi na C1+C5):
  C2 (Redirect spec)       ← zavisi na C1
  C7 (Migration plan)      ← zavisi na C1+C5
  C8 (Risk analysis)       ← zavisi na C1-C7 (posledni!)
```

**Celkovy pocet Codex runu: 8**
**Odhadovany cas: ~45 minut** (pokud kazdy run trva 5-7 min)

---

## 5) COPILOT/CLAUDE tasky (implementace)

> Tyto tasky se NEZAHAJUJI dokud Codex nedokonci C1–C8 a Josef neschvali vystupy.

### COPILOT (implementace)
| # | Ukol | Zavislost | Odhadovany cas |
|---|------|-----------|----------------|
| I1 | Vytvorit `src/app/config/routes.ts` (z C5 navrhu, mozna jen merge) | C5 | 15 min |
| I2 | Refactor header.tsx + footer.tsx + sticky-mobile-cta.tsx na route helpers | I1, C6, C7 | 30 min |
| I3 | Refactor marketing sekce (hero, problem, cta, pricing, announcement, role-selection) | I1, C7 | 45 min |
| I4 | Presunout vsechny redirecty do `vercel.json` + odstranit `<Navigate>` z app.tsx | C2 | 20 min |
| I5 | Aktualizovat canonical na vsech strankach + sitemap.xml + robots.txt | C3 | 30 min |
| I6 | `cms-service.ts` krok A: no-behavior cleanup (dead code, type fixes) | — | 20 min |
| I7 | `cms-service.ts` krok B: source-of-truth behavior change | I6 | 20 min |
| I8 | Build + smoke test + pre-deploy checklist (z C8) | I1–I7 | 15 min |
| I9 | Deploy + post-deploy verification (z C8) | I8 | 10 min |

**Celkovy odhadovany cas implementace: ~3.5 hodiny** (1 focused session)

> **SCOPE GUARD**: Nasledujici soubory se v tomto refactoru NEMENI:
> - `src/app/pages/public/onboarding.tsx` (1868 radku) — to je F1
> - `src/app/components/layout/signup-modal.tsx` (1563 radku) — to je F2
> - `src/lib/blog-content.ts` (62 content linku uvnitr HTML) — toto jsou obsahove linky, ne navigacni
> - `src/app/pages/public/privacy-policy.tsx` — pravni text, nemenit
> - `src/app/pages/public/terms.tsx` — pravni text, nemenit

---

## 6) Implementacni poradi

1. **Josef schvali R1–R4** (decision records).
2. **Codex bezi C1–C8** (8 runu, ~45 min).
3. **Josef review C1–C8 vystupy** (10–15 min).
4. **Copilot vytvori feature branch** `nav-ux-refactor`.
5. **I1** (`routes.ts`) — zlomovy bod, vsechno ostatni na tom zavisi.
6. **I2–I3** (nav + marketing sekce) — nejvetsi objem prace.
7. **I4** (redirecty do vercel.json).
8. **I5** (SEO sync).
9. **I6–I7** (`cms-service.ts`) — ve dvou commitech.
10. **I8** (pre-deploy checklist).
11. **I9** (deploy + post-deploy).
12. **Squash merge** `nav-ux-refactor` → `main`.

---

## 7) Definition of Done (release gate)

- [ ] 0 hardcoded navigacnich linku v `header.tsx`, `footer.tsx`, `sticky-mobile-cta.tsx`.
- [ ] 0 hardcoded `www.behavera.com` odkazu v marketing sekcich (hero, cta, pricing, problem).
- [ ] Vsechny `app.behavera.com` linky pouzivaji `EXTERNAL_URLS.*` z routes.ts.
- [ ] 0 redirect chain (kazda testovana legacy URL max 1 hop — overeno `curl -I`).
- [ ] `vercel.json` obsahuje vsechny redirecty, `app.tsx` nema zadny `<Navigate>` pro obsahove stranky.
- [ ] Top legacy URL vraci expected status a cil.
- [ ] `canonical` odpovida final URL na vsech verejnych strankach.
- [ ] `sitemap.xml` obsahuje vsechny verejne kanonicke URL.
- [ ] UTM/query params se pri redirectu neztraceji (overeno `curl -I "url?utm_source=test"`).
- [ ] `npm run build` projde bez chyb.
- [ ] Smoke test: `/`, `/blog`, `/blog/:slug`, `/case-studies`, `/case-studies/:slug`, `/start`, `/team`, `/pro-neziskovky` bez runtime error.

---

## 8) Minimalni monitoring a rollback

### Monitoring (MVP)
- `redirect_hit` pocitadlo (legacy source URL → final URL)
- `final_landing_url` log
- `utm_source` zachyceni (pokud existuje v query)
- 404 rate a 5xx rate po deploy (Vercel Analytics)

### Rollback triggery
- 404 rate > 2x baseline v prvnich 60 minutach
- 5xx rate > 0.5% v prvnich 60 minutach
- Pokles konverzniho kroku (signup/start completion) > 20% za 24h
- Kriticka URL nevraci expected redirect status

### Rollback akce (v poradi)
1. `git revert` merge commitu na `main`
2. `vercel deploy --prod` s revert commitem
3. Overit ze produkce odpovida stavu pred migraci
4. Post-mortem do `docs/audits/post-mortem-YYYY-MM-DD.md`

---

## 9) Test matrix

| Dimenze | Varianty |
|---------|----------|
| Prohlizec | Desktop Chrome, Desktop Safari, Mobile Safari, Mobile Chrome |
| Auth stav | Non-auth (vetsina), admin logged in |
| UTM params | Bez, s `utm_source=google&utm_medium=cpc`, s `gclid=xxx` |
| Navigace | Forward click, back button, direct URL, refresh |
| Sit | Broadband, Fast 3G (cold load) |
| Cesty | `/`, `/blog`, `/blog/:slug`, `/case-studies`, `/case-studies/:slug`, `/start`, `/team`, `/pro-neziskovky`, `/for-ceos` |
| Legacy | `/podminky-pouzivani-sluzby`, `/ochrana-osobnich-udaju`, `/demo`, `/engagement`, `/signup` |

---

## 10) Co NERESIT ted

- Full migrace na Next.js/ISR
- Onboarding refactor (F1 v next-plan.md, 1868 radku)
- Signup modal refactor (F2, 1563 radku)
- Komplexni event taxonomy nad ramec MVP monitoringu
- CMS UI migrace
- Cross-domain tracking app.behavera.com ↔ www.behavera.com (future)
- npm audit fix (D4 v next-plan.md)

---

## 11) Shrnuti

- Pragmaticka migrace navigace, ne replatforming.
- Klic je oddelit `navigacni UX` od `produktovych CTA` od `pravnich textu`.
- Redirecty deterministicke, bez chainu, s query passthrough.
- `cms-service.ts` na 2 kroky kvuli bezpecnosti release.
- Codex dostane 8 presne definovanych tasku s acceptance criteria.
- Copilot implementuje az po Codex auditach a Josefove schvaleni.
- Feature branch, squash merge, rollback plan.
