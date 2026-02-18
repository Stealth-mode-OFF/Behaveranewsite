# Behavera Website — Handover Documentation

> Last updated: 2025-07-18 | Audit commit range: `8a53b51..HEAD`

## 1. Architecture Overview

### Stack
- **Frontend**: React 18 + TypeScript + Vite 6 SPA
- **Styling**: Tailwind CSS 4 + Radix UI primitives (dialog, label, select, slot)
- **Hosting**: Vercel (project `behaveranewsite`, team `josefs-projects-f1cdc60d`)
- **Backend**: Vercel Serverless Functions (`api/`) + Supabase Edge Functions (`supabase/functions/`)
- **Database**: Supabase PostgreSQL (project `gruomxlcwerzevjohqdo`)
- **Auth**: Supabase Auth (admin CMS) + local fallback credentials
- **Analytics**: Vercel Web Analytics + custom event tracking (consent-gated)
- **3rd-party**: Pipedrive CRM, Slack webhooks, Google/Microsoft OAuth (onboarding contacts import)

### Entrypoint
```
index.html → src/main.tsx → src/app/App.tsx (BrowserRouter)
```

### Routing (App.tsx)
| Route | Component | Lazy? |
|-------|-----------|-------|
| `/` | LandingPage | No (eagerly loaded) |
| `/terms` | TermsPage | Yes |
| `/privacy-policy` | PrivacyPolicyPage | Yes |
| `/blog` | BlogPage | Yes |
| `/blog/:slug` | BlogPostPage | Yes |
| `/case-studies` | CaseStudiesPage | Yes |
| `/case-studies/:slug` | CaseStudyPage | Yes |
| `/changelog` | ChangelogPage | Yes |
| `/team` | TeamPage | Yes |
| `/echo-pulse-vs-google-forms` | ComparisonGoogleFormsPage | Yes |
| `/for-ceos`, `/for-hr`, `/for-team-leads` | SolutionPage | Yes |
| `/start` | OnboardingPage | Yes |
| `/admin/*` | Admin CMS (gated by `VITE_ADMIN_ENABLED`) | Yes |
| `/podminky-pouzivani-sluzby` | → Redirect to `/terms` | - |
| `/ochrana-osobnich-udaju` | → Redirect to `/privacy-policy` | - |

### State Management
- **LanguageContext** — EN/CZ/DE with browser detection + localStorage persistence
- **ModalContext** — booking / demo / signup modal states (global, works from any route)
- **AuthContext** — Supabase auth + local fallback for admin CMS

### Data Flow
```
Client → CmsService (src/lib/cms-service.ts)
  ├─ Supabase configured? → Supabase queries (posts, case_studies, authors)
  └─ Not configured? → Static fallback data (src/lib/blog-content.ts)
```

### API Layer (Vercel Serverless — `api/`)
| Endpoint | Purpose |
|----------|---------|
| `api/submit-lead.ts` | Lead capture → Supabase + Pipedrive |
| `api/submit-onboarding.ts` | Self-service signup → Supabase + Pipedrive + Slack |
| `api/ares-lookup.ts` | Czech company registry lookup (IČO → company data) |
| `api/invitations/send.ts` | Send team member invitation emails |
| `api/cz-terms.ts` | Serve Czech T&C content |
| `api/cz-privacy.ts` | Serve Czech privacy policy content |
| `api/oauth/google/*` | Google OAuth flow for contacts import |
| `api/oauth/microsoft/*` | Microsoft OAuth flow for contacts import |

### Supabase Edge Functions (`supabase/functions/`)
Parallel implementations exist for: `ares-lookup`, `submit-lead`, `submit-onboarding`, `send-invitation`. These are the Supabase-hosted equivalents — the Vercel `api/` versions are the ones actually used in production.

### Key Environment Variables (Vercel)
| Variable | Purpose |
|----------|---------|
| `VITE_ADMIN_ENABLED` | Enable CMS admin routes (client-side) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_URL` | Server-side Supabase URL |
| `SUPABASE_SERVICE_KEY` | Server-side Supabase service key |
| `PIPEDRIVE_API_KEY` | Pipedrive CRM API key |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook (#sales_inbound_leads) |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth for contacts import |
| `MS_CLIENT_ID/SECRET` | Microsoft OAuth for contacts import |

---

## 2. Audit Report

### Baseline (before audit)
- **Build**: ✓ (3.92s)
- **TypeScript errors**: 9 (3 files)
- **Main chunk**: 683 KB (Vite warning at 500 KB)
- **Total source**: 94 files, ~25K lines

### Findings (High / Medium / Low)

#### HIGH
| # | Finding | Evidence | Impact | Resolution | Risk |
|---|---------|----------|--------|------------|------|
| H1 | 4x duplicate `aria-label` JSX attributes | snap-carousel.tsx L174,182,201,222 | TS17001, accessibility confusion | **Fixed**: Removed inline duplicates, kept descriptive versions | None |
| H2 | `string \| undefined` passed as `string` to analytics tracking | blog-post.tsx L215,217 | TS2345, potential runtime TypeError | **Fixed**: Added early guards and narrowed slug/key types | None |
| H3 | Implicit `any` in state setter callbacks | onboarding.tsx L697,702 | TS7006, loses type safety | **Fixed**: Added `: number` type annotations | None |
| H4 | Dead `invitedCount` prop in ConfirmStep | onboarding.tsx L1633 | TS2339, confusing to maintainers | **Fixed**: Removed from destructuring | None |
| H5 | No automated tests | Entire repo | Zero regression safety net | **Not fixed** — requires team decision on testing strategy | N/A |

#### MEDIUM
| # | Finding | Evidence | Impact | Resolution |
|---|---------|----------|--------|------------|
| M1 | 8 dead files (UI wrappers + sections) | accordion.tsx, separator.tsx, skeleton.tsx, toggle.tsx, tooltip.tsx, use-mobile.ts, integrations-showcase.tsx, testimonials-carousel.tsx | Confuses new devs, bloats codebase | **Fixed**: Deleted |
| M2 | 22 unused Radix UI packages | package.json | Bloated node_modules, slower installs | **Fixed**: Removed from dependencies |
| M3 | Duplicate API functions (api/ vs supabase/) | api/submit-lead.ts ↔ supabase/functions/submit-lead/index.ts (×4 pairs) | Risk of logic drift between implementations | **Left as-is** — different runtimes (Vercel vs Supabase Edge), both may be needed |
| M4 | 683 KB main chunk | Build output | Slow first load on mobile | **Left as-is** — requires major lazy-loading refactor of landing page sections; framer-motion is the main contributor |
| M5 | 19 console.log/warn/error calls | Various files | Most are legitimate error handlers in catch blocks | **Left as-is** — review individually if needed |
| M6 | `echo-pulse/try` URL paths in 12+ files | hero.tsx, pricing.tsx, header.tsx, etc. | Old brand naming in external app URLs | **Left as-is** — these are `app.behavera.com` URLs that still use `/echo-pulse/` paths; the external app controls those routes |

#### LOW
| # | Finding | Evidence | Impact | Resolution |
|---|---------|----------|--------|------------|
| L1 | `/echo-pulse-vs-google-forms` URL slug | App.tsx L136 | Old brand in URL | **Left as-is** — SEO indexed, changing breaks search rankings. Add redirect if/when renamed |
| L2 | `behavera_legal_pages.txt` contains "Echo Pulse" | public/behavera_legal_pages.txt | Legal document text | **Left as-is** — must not alter legal content |
| L3 | Demo credentials in client bundle | demo-access-modal.tsx L19-22 | Public demo accounts — intentional | **Left as-is** — these are meant to be shared |
| L4 | `ECHO_PULSE_JOIN_URL` constant name | urls.ts L6 | Old naming convention | **Left as-is** — renaming requires app-side coordination |
| L5 | Large files (onboarding 1870L, signup-modal 1563L) | src/app/pages/public/ | Hard to maintain | **Not addressed** — refactoring these into sub-components is a separate task that risks regressions |

---

## 3. What Was Changed (and Why)

### Commit 1: `fix: resolve all 9 TypeScript strict-mode errors`
- **snap-carousel.tsx**: Removed 4 duplicate `aria-label` attributes (kept the descriptive version on separate line)
- **blog-post.tsx**: Added early `if (!slug) return` + `if (!key) return` guards before using in analytics calls
- **onboarding.tsx**: Added `: number` type to `setCurrentStep` callbacks, removed dead `invitedCount` prop

### Commit 2: `chore: remove 8 dead files`
- Deleted 6 UI wrapper components (accordion, separator, skeleton, toggle, tooltip, use-mobile) — all from shadcn/ui scaffolding but never imported
- Deleted 2 section components (integrations-showcase, testimonials-carousel) — scaffolded but never wired into any page

### Commit 3: `chore: remove 22 unused Radix UI packages`
- Trimmed `package.json` from 26 Radix packages down to the 4 actually imported (`react-dialog`, `react-label`, `react-select`, `react-slot`)

---

## 4. What Was Left Unchanged (and Why)

| Item | Reason |
|------|--------|
| Duplicate api/ vs supabase/ functions | Different hosting runtimes; both may be deployed independently |
| 683 KB main chunk | Requires architectural refactor (lazy-load landing sections + code-split framer-motion); high regression risk |
| `echo-pulse/try` external URLs | External app paths, not controlled by this repo |
| `/echo-pulse-vs-google-forms` route | SEO-indexed URL, cannot change without redirect plan |
| Legal text files with "Echo Pulse" | Legal content must not be altered without legal review |
| Demo credentials in client code | Intentional — demo accounts are meant to be public |
| Large component files (onboarding, signup-modal) | Refactoring risks regressions; splitting should be a dedicated task with proper QA |
| 19 console statements | Most are legitimate error handlers; stripping needs case-by-case review |

---

## 5. Post-Audit Verification

| Check | Before | After |
|-------|--------|-------|
| Build | ✓ 3.92s | ✓ 4.00s |
| TypeScript errors | 9 | **0** |
| Source files | 94 | 86 (-8 dead files) |
| Radix dependencies | 26 | **4** |
| Routes working | ✓ | ✓ (no routing changes) |
| CMS flow | ✓ | ✓ (no CMS changes) |
| SEO/routing | ✓ | ✓ (no URL changes) |

---

## 6. Known Risks & Limitations

1. **No test suite** — The biggest ongoing risk. Any change requires manual smoke testing. Adding at least Playwright E2E tests for critical flows (landing, blog, onboarding, CMS) is strongly recommended.

2. **Blog content hardcoded in bundle** — `blog-content.ts` (1187 lines) ships all article HTML in the JS bundle. If more posts are added via CMS, the static fallback grows. Consider removing static fallback once CMS is the source of truth.

3. **Main chunk size** — 683 KB is borderline for mobile. The landing page eagerly imports Hero, LogoMarquee, StatsBar, ProblemSection, SignalRadar, DashboardPreview, RoleSelection. Lazy-loading more of these would help.

4. **Two identical API codebases** — `api/` (Vercel) and `supabase/functions/` will drift without a shared lib or a decision to deprecate one.

5. **Admin auth has local fallback** — When Supabase isn't configured, `admin123` works. Fine for development, but make sure Supabase auth is always configured in production.

---

## 7. Recommended Next Steps

1. **Add E2E tests** (Playwright) — Cover: homepage render, blog listing + detail, onboarding flow, CMS login + CRUD
2. **Lazy-load more landing sections** — Move Hero, LogoMarquee, StatsBar below the fold to reduce main chunk
3. **Consolidate API duplication** — Pick Vercel or Supabase Edge as canonical; delete the other or extract shared logic
4. **Remove static blog fallback** — Once CMS is stable, delete the embedded `BLOG_POSTS` array from `blog-content.ts`
5. **Update external app URLs** — When `app.behavera.com` removes `/echo-pulse/` paths, do a find/replace in this repo
6. **Set up CI** — Add a GitHub Actions workflow: `npm ci && npx tsc --noEmit && npm run build`
