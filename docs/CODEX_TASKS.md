# Codex — Úkoly pro tebe

> Tento soubor je tvůj pracovní seznam. Přečti si ho celý před začátkem práce.
> Úkoly označené "HOTOVO" neřeš — ty už udělal Copilot.
> Úkoly označené "ČEKÁ NA JOSEFA" jsou blokované rozhodnutím — neřeš je, dokud se u nich nezmění status.

---

## Pravidla

1. **Jeden task = jeden commit.** Nedělej obří commit přes celé repo.
2. **Po každém tasku ověř**: `npx tsc --noEmit && npm run build` — musí projít s 0 chybami.
3. **Commit messages v angličtině**, formát: `type: popis` (např. `test: add Playwright E2E tests`).
4. **Nesahej na soubory, které nejsou součástí tvého tasku.** Žádné "vylepšování" navíc.
5. **Neměň routy, URL strukturu ani SEO metadata.** To je produkční web.
6. **Neinstaluj nové závislosti** pokud to task explicitně nevyžaduje.

---

## HOTOVO — udělal Copilot, NEŘEŠ

| ✅ | Task | Commit |
|----|------|--------|
| ✅ | C1: CI pipeline (`.github/workflows/ci.yml`) | Součást příštího commitu |
| ✅ | C2: Lazy-load landing sections + manualChunks (684→293 KB) | Součást příštího commitu |
| ✅ | C4: Console.log audit — **všech 19 je legitimních** (catch/ErrorBoundary), žádné debug logy | Nic ke smazání |
| ✅ | C6: Type-safe ConfirmStep props (5× `any` → proper types) | Součást příštího commitu |

---

## TVOJE TASKY — dělej v tomto pořadí

### CX1: Playwright E2E scaffold ⬅ ZAČNI TÍMTO

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

**Přidej do `.github/workflows/ci.yml`** nový step za `npm run build`:
```yaml
- name: Install Playwright
  run: npx playwright install chromium --with-deps
- name: E2E tests
  run: npm run test:e2e
```

**Verifikace:** `npm run test:e2e` — všechny testy zelené.

**Commit:** `test: add Playwright E2E tests for critical user flows`

---

### CX2: Smazat Supabase Edge Functions

> ⚠️ **ČEKÁ NA JOSEFA (D2).** Dělej až dostaneš potvrzení.

Smaž celou složku `supabase/functions/` včetně všech podsložek.

**Důvod:** Produkce používá Vercel serverless funkce v `api/`. Supabase edge funkce jsou duplicitní kopie, které se nepoužívají a budou se rozcházet.

**NESAHEJ na složku `api/`** — ta zůstává.
**NESAHEJ na `supabase-setup-*.sql` soubory** v root — ty zůstávají.

**Verifikace:** `npm run build` musí projít.

**Commit:** `chore: remove duplicate Supabase Edge Functions (production uses Vercel api/)`

---

### CX3: Odstranit statický blog fallback

> ⚠️ **ČEKÁ NA JOSEFA (D3).** Dělej až dostaneš potvrzení, že CMS je source of truth.

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

## TASKY PRO COPILOTA — NEŘEŠ JE

Tohle dělá Copilot v interaktivní session. Uvádím je tu jen pro kontext, abys věděl, co se řeší jinde a **nesahal na tyto soubory**.

| # | Task | Soubory kterých se NEDOTÝKEJ |
|---|------|------|
| I1 | Onboarding refactor (rozdělit 1868 řádků) | `onboarding.tsx` — potřeba UX diskuze |
| I2 | Signup modal refactor (1563 řádků) | `signup-modal.tsx` — konverzní flow, nesmí se rozbít |
| I3 | Update echo-pulse URLs | závisí na externím app.behavera.com |
| I4 | SEO audit + Core Web Vitals | iterativní — Lighthouse + diskuze |
| I5 | Nové stránky a funkce | vše nové co neexistuje |
| I6 | Supabase migrace / schema changes | vyžaduje Supabase dashboard |

---

## Shrnutí pořadí

```
CX1 → CX2 (po D2) → CX3 (po D3)
```

Dělej je v tomto pořadí. Každý task commitni zvlášť. Po každém ověř build.

---

## Rozhodnutí čekající na člověka (Josefa)

Tyto věci **neřeš**, vyžadují business rozhodnutí:

- **D1:** DNS pro www.behavera.com — CNAME musí směřovat na `cname.vercel-dns.com`
- **D2:** Potvrzení smazání Supabase Edge Functions (CX2 závisí na tomto)
- **D3:** Kdy smazat statický blog fallback (CX3 závisí na tomto)
- **D4:** Testing strategy — E2E testy teď nebo po feature sprintu
- **D5:** `npm audit fix` — 26 vulnerabilities (20 high, 6 moderate)
