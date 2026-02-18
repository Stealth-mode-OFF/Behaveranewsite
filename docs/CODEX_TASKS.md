# Codex — Úkoly pro tebe

> Tento soubor je tvůj pracovní seznam. Přečti si ho celý před začátkem práce.
> Ostatní úkoly (I1-I6, D1-D5) řeší Copilot nebo člověk — **neřeš je, nesahej na ně**.

## Pravidla

1. **Jeden task = jeden commit.** Nedělej obří commit přes celé repo.
2. **Po každém tasku ověř**: `npx tsc --noEmit && npm run build` — musí projít s 0 chybami.
3. **Commit messages v angličtině**, formát: `type: popis` (např. `ci: add GitHub Actions workflow`).
4. **Nesahej na soubory, které nejsou součástí tvého tasku.** Žádné "vylepšování" navíc.
5. **Neměň routy, URL strukturu ani SEO metadata.** To je produkční web.
6. **Neinstaluj nové závislosti** pokud to task explicitně nevyžaduje.

## Co NEŘEŠÍŠ (dělá Copilot v interaktivní session)

- Refaktoring `onboarding.tsx` (1870 řádků) — vyžaduje UX diskuzi
- Refaktoring `signup-modal.tsx` (1563 řádků) — konverzní flow, nesmí se rozbít
- Změny `echo-pulse` URL — závisí na externím app.behavera.com
- SEO audit, Core Web Vitals ladění
- Nové stránky a funkce
- Supabase migrace a schema changes
- Cokoliv co vyžaduje přístup k Vercel dashboard nebo Supabase dashboard

---

## Tvoje tasky — dělej v tomto pořadí

### Task C1: CI pipeline ⬅ ZAČNI TÍMTO

Vytvoř `.github/workflows/ci.yml` — GitHub Actions workflow.

**Trigger:** push na `main` + pull request do `main`.

**Steps:**
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
- run: npm ci
- run: npx tsc --noEmit
- run: npm run build
```

**Verifikace:** `npm run build` musí projít. Workflow soubor musí být validní YAML.

**Commit:** `ci: add GitHub Actions workflow for build + typecheck`

---

### Task C2: Lazy-load landing page sections

Soubor: `src/app/pages/public/landing.tsx`

Aktuálně jsou tyto sekce importované eagerly (přímo nahoře):
- `Hero`
- `LogoMarquee`
- `StatsBar`
- `ProblemSection`
- `SignalRadar`
- `DashboardPreview`
- `RoleSelection`

**Přesuň je na lazy import** pomocí `lazyNamed()` helperu, který už v tom souboru existuje (viz jak je použitý pro `CaseStudiesSection`, `FAQ`, `PurchaseSection` atd.). Pak je v JSX obal do `<LazySection>` wrapperu, který tam taky už existuje.

**Vzor (už funguje v tom souboru):**
```tsx
const CaseStudiesSection = lazyNamed(
  () => import("@/app/components/sections/case-studies"),
  "CaseStudiesSection"
);
// ...
<LazySection><CaseStudiesSection /></LazySection>
```

**Udělej totéž pro těchto 7 sekcí.** Smaž jejich eager importy nahoře.

**Pozor:** `Hero` je export `{ Hero }` z `hero.tsx`, `LogoMarquee` z `logo-marquee.tsx` atd. Ověř si exportované jméno v každém souboru.

**Verifikace:** `npx tsc --noEmit && npm run build` — 0 errors. Main chunk (`index-*.js`) by měl klesnout pod 500 KB.

**Commit:** `perf: lazy-load all landing page sections to reduce main chunk`

---

### Task C3: Smazat Supabase Edge Functions

Smaž celou složku `supabase/functions/` včetně všech podsložek.

**Důvod:** Produkce používá Vercel serverless funkce v `api/`. Supabase edge funkce jsou duplicitní kopie, které se nepoužívají a budou se rozcházet.

**NESAHEJ na složku `api/`** — ta zůstává.
**NESAHEJ na `supabase-setup-*.sql` soubory** v root — ty zůstávají.

**Verifikace:** `npm run build` musí projít.

**Commit:** `chore: remove duplicate Supabase Edge Functions (production uses Vercel api/)`

---

### Task C4: Vyčistit console.log/warn/error

Projdi složku `src/` a najdi všechny `console.log`, `console.warn`, `console.error`.

**Ponech tyto (legitimní):**
- `console.error` v `catch` blocích (error handling)
- `console.error` v `ErrorBoundary` (`componentDidCatch`)
- `console.error` v `main.tsx` (app bootstrap error)

**Smaž tyto (nepotřebné):**
- `console.log` pro debugging (výpisy dat, stavů)
- `console.warn` informační (ne skutečná varování)

Pokud si nejsi jistý, **ponech** — lepší nechat než smazat produkční error handling.

**Verifikace:** `npx tsc --noEmit && npm run build` — 0 errors.

**Commit:** `chore: remove debug console statements from production code`

---

### Task C5: Playwright E2E scaffold

**Instalace:** `npm install -D @playwright/test` + `npx playwright install chromium`

**Vytvoř `playwright.config.ts`** v root:
- `baseURL: 'http://localhost:4173'` (Vite preview server)
- `webServer: { command: 'npm run build && npm run preview', port: 4173 }`
- Jen Chromium (ne Firefox/WebKit — zrychlí to testy)

**Vytvoř tyto testy v `e2e/`:**

1. `e2e/homepage.spec.ts` — Homepage se renderuje, má `<h1>`, má header s logem, má footer
2. `e2e/blog.spec.ts` — `/blog` zobrazí seznam článků, klik na první článek otevře detail s `<article>`
3. `e2e/legal.spec.ts` — `/terms` a `/privacy-policy` se načtou a mají obsah
4. `e2e/onboarding.spec.ts` — `/start` zobrazí step 1 s formulářem, vyplnění company name + employee count umožní jít na step 2

**Přidej do `package.json`:**
```json
"test:e2e": "playwright test"
```

**Přidej do `.github/workflows/ci.yml`** (pokud existuje) step:
```yaml
- run: npx playwright install chromium --with-deps
- run: npm run test:e2e
```

**Verifikace:** `npm run test:e2e` — všechny testy zelené.

**Commit:** `test: add Playwright E2E tests for critical user flows`

---

### Task C6: Type-safe ConfirmStep props

Soubor: `src/app/pages/public/onboarding.tsx`

Najdi komponentu `ConfirmStep` (přibližně řádek 1620). Její props mají tyto typy:

```tsx
txt: any;
register: any;
watch: any;
getValues: any;
errors: any;
```

**Nahraď je správnými typy z `react-hook-form`:**

```tsx
import { UseFormRegister, UseFormWatch, UseFormGetValues, FieldErrors } from 'react-hook-form';

// V props typu ConfirmStep:
txt: typeof import('@/app/translations').translations.en;  // nebo Record<string, any> pokud je příliš složité
register: UseFormRegister<OnboardingFormData>;
watch: UseFormWatch<OnboardingFormData>;
getValues: UseFormGetValues<OnboardingFormData>;
errors: FieldErrors<OnboardingFormData>;
```

Typ `OnboardingFormData` už v tom souboru existuje — najdi ho.

**Verifikace:** `npx tsc --noEmit` — 0 errors.

**Commit:** `refactor: replace any types in ConfirmStep with proper react-hook-form types`

---

### Task C7: Odstranit statický blog fallback

> ⚠️ **DĚLEJ JAKO POSLEDNÍ.** Tento task závisí na tom, že CMS (Supabase) je source of truth pro blog.

Soubor: `src/lib/blog-content.ts` (1187 řádků) — obsahuje hardcoded `BLOG_POSTS` a `BLOG_AUTHORS`.

Soubor: `src/lib/cms-service.ts` — obsahuje fallback logiku, která vrací `DEFAULT_POSTS` když Supabase není dostupné.

**Kroky:**
1. V `cms-service.ts` odstraň `DEFAULT_POSTS` a fallback na statická data. Funkce `getPosts()` a `getPostBySlug()` mají vracet data jen ze Supabase. Pokud Supabase není configured, vrať prázdné pole / null.
2. Smaž soubor `src/lib/blog-content.ts` pokud po kroku 1 nikdo jiný neimportuje `BLOG_POSTS` nebo `BLOG_AUTHORS`.
3. Zkontroluj `grep -r "blog-content" src/` — pokud existují další importy, uprav je.

**NESAHEJ na case studies fallback** — ten zatím zůstává.

**Verifikace:** `npx tsc --noEmit && npm run build` — 0 errors. Bundle size by se měl zmenšit (cms-service chunk byl 265 KB).

**Commit:** `refactor: remove hardcoded blog content, use Supabase CMS as sole data source`

---

## Shrnutí pořadí

```
C1 → C2 → C3 → C4 → C5 → C6 → C7
```

Dělej je v tomto pořadí. Každý task commitni zvlášť. Po každém ověř build.
