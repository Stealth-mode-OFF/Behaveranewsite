# Co dál — Plán práce (aktualizace 2026-02-19)

> Stav: Commit `9f2196a` na `main`. Build OK, 0 TS chyb, chunk 684 KB.
> Vulnerabilities: 26 (6 moderate, 20 high) — nárůst od posledního auditu.

---

## HOTOVO (z minulých sessions)

| ✅ | Co se udělalo |
|----|--------------|
| ✅ | Blog listing + post UX polish |
| ✅ | České právní redirecty (308) |
| ✅ | CMS přepojení na Supabase + fallback |
| ✅ | Onboarding 5→3 kroky + pricing fix + Slack webhook |
| ✅ | Rebrand Echo Pulse → Behavera (33 souborů) |
| ✅ | Handover audit (4 fáze) + HANDOVER.md |
| ✅ | CODEX_TASKS.md (C1–C7) |
| ✅ | Case studies polish (listing + detail + CMS mapping) |
| ✅ | Responsiveness audit — 3 fixy (z-index, scroll lock, announcement overflow) |
| ✅ | Smazání 8 dead souborů + 22 nepoužívaných Radix balíčků |
| ✅ | Oprava 9 TypeScript strict-mode chyb |

---

## COPILOT — co udělám já teď v téhle session

Tohle můžu udělat hned, interaktivně, protože vyžadují rozhodnutí nebo kontext:

### CP1: Lazy-load landing page sekcí ⬅ UDĚLÁM HNED
Původně C2 — ale je to jednoduchý mechanický task, pattern už existuje v souboru.  
Přesunu `Hero`, `LogoMarquee`, `StatsBar`, `ProblemSection`, `DashboardPreview`, `SignalRadar`, `RoleSelection` na `lazyNamed()` + `<LazySection>`.  
**Cíl:** Main chunk pod 500 KB.

### CP2: Type-safe ConfirmStep props ⬅ UDĚLÁM HNED
Původně C6 — ale jsem v kontextu toho souboru, vím co tam je.  
Nahradím 5× `any` v `ConfirmStep` props správnými typy z `react-hook-form`.

### CP3: Vyčistit console.log ⬅ UDĚLÁM HNED
Původně C4. Všech 19 statements je v `catch` blocích nebo error boundary → **všechny jsou legitimní, žádné debug logy tam nejsou**. Ověřím a potvrdím, nic mazat nebudu.

### CP4: CI pipeline ⬅ UDĚLÁM HNED
Původně C1. Jednoduchý `.github/workflows/ci.yml`.

---

## CODEX — co má udělat Codex (autonomně, bez diskuze)

Codex dostane aktualizovaný task list. Z původních C1–C7 přebírám CP1–CP4.  
Codexovi zůstávají 2 větší tasky + nový:

### CX1: Playwright E2E scaffold (původně C5)
Instalace `@playwright/test`, konfigurace, 4 test suity:
- `e2e/homepage.spec.ts` — landing page render + header + footer
- `e2e/blog.spec.ts` — /blog listing + /blog/:slug detail  
- `e2e/legal.spec.ts` — /terms + /privacy-policy
- `e2e/onboarding.spec.ts` — /start step 1→2→3

Přidat `test:e2e` do `package.json`, integrovat do CI workflow (`.github/workflows/ci.yml`).

**Commit:** `test: add Playwright E2E tests for critical user flows`

### CX2: Smazat Supabase Edge Functions (původně C3)
Smazat celý `supabase/functions/` (5 funkcí). Produkce používá `api/`.

⚠️ **Závisí na potvrzení od Josefa (D2).**

**Commit:** `chore: remove duplicate Supabase Edge Functions`

### CX3: Odstranit statický blog fallback (původně C7)
Smazat `BLOG_POSTS` + `BLOG_AUTHORS` z `blog-content.ts`, odstranit fallback v `cms-service.ts`.

⚠️ **Závisí na potvrzení od Josefa (D3) — CMS musí být source of truth.**

**Commit:** `refactor: remove hardcoded blog content, use Supabase CMS as sole data source`

---

## JOSEF (člověk) — rozhodnutí která blokují další práci

| # | Rozhodnutí | Blokuje | Status |
|---|-----------|---------|--------|
| D1 | **DNS pro www.behavera.com** — CNAME → `cname.vercel-dns.com` | Produkční doména | ⏳ čeká |
| D2 | **Potvrdit smazání Supabase Edge Functions** | CX2 | ⏳ čeká |
| D3 | **Potvrdit, že CMS je source of truth pro blog** | CX3 | ⏳ čeká |
| D4 | **npm audit fix** — 26 vulnerabilities (20 high, 6 moderate) | Security | ⏳ čeká |
| D5 | **Kdy udělat E2E testy** — teď nebo po feature sprintu? | CX1 | ⏳ čeká |

---

## BUDOUCÍ PRÁCE (po tomhle sprintu)

Tyto věci vyžadují víc kontextu, UX diskuzi nebo přístup k externím službám:

| # | Task | Kdo | Proč |
|---|------|-----|------|
| F1 | **Onboarding refactor** — rozdělit 1868 řádků | Copilot + Josef | UX rozhodnutí o struktuře komponent |
| F2 | **Signup modal refactor** — rozdělit 1563 řádků | Copilot + Josef | Konverzní flow, nesmí se rozbít |
| F3 | **Update echo-pulse URLs** | Copilot | Závisí na app.behavera.com backend |
| F4 | **SEO audit + Core Web Vitals** | Copilot | Lighthouse + iterace |
| F5 | **Nové stránky/funkce** | Copilot + Josef | Cokoli nového |
| F6 | **Supabase schema changes** | Copilot + Josef | Vyžaduje dashboard přístup |
| F7 | **Aktualizace závislostí** | Copilot + Josef | `npm audit fix --force` + manuální test |

---

## POŘADÍ PRÁCE

```
TERAZ (Copilot v téhle session):
  1. CP1 — lazy-load landing sekcí (chunk 684→<500 KB)
  2. CP2 — type-safe ConfirmStep (smaž 5× any)
  3. CP3 — ověřit console statements (žádné debug logy)
  4. CP4 — CI pipeline (.github/workflows/ci.yml)
  → commit + push

POTOM (Codex, po Josefově potvrzení):
  5. CX1 — Playwright E2E scaffold (po D5)
  6. CX2 — smazat supabase/functions/ (po D2)
  7. CX3 — smazat blog fallback (po D3)

BUDOUCNOST:
  8. D4/F7 — npm audit fix (po Josefově OK)
  9. F1 — onboarding refactor
  10. F2 — signup modal refactor
  11. F4 — SEO + Core Web Vitals
```
