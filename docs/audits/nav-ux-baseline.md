# NAV-UX Baseline Snapshot

Date: 2026-02-20
Branch: `nav-ux-refactor`

## Scope baseline

### Hardcoded external CTA/link references in `src/app`
- Total matches for `app.behavera.com|www.behavera.com/start|podminky-pouzivani-sluzby|ochrana-osobnich-udaju|bibi.behavera.com`: `20`
- File hits:
  - `src/app/app.tsx:128`
  - `src/app/app.tsx:130`
  - `src/app/pages/public/onboarding.tsx:2012`
  - `src/app/pages/public/onboarding.tsx:2021`
  - `src/app/components/layout/signup-modal.tsx:1400`
  - `src/app/components/layout/signup-modal.tsx:1402`
  - `src/app/components/sections/problem.tsx:148`
  - `src/app/components/layout/announcement-bar.tsx:36`
  - `src/app/components/layout/announcement-bar.tsx:41`
  - `src/app/components/layout/announcement-bar.tsx:46`
  - `src/app/components/layout/header.tsx:174`
  - `src/app/components/layout/header.tsx:253`
  - `src/app/components/layout/sticky-mobile-cta.tsx:30`
  - `src/app/components/sections/hero.tsx:224`
  - `src/app/components/sections/role-selection.tsx:217`
  - `src/app/components/sections/cta-section.tsx:145`
  - `src/app/components/sections/cta-section.tsx:156`
  - `src/app/components/sections/pricing.tsx:408`
  - `src/app/components/sections/pricing.tsx:416`
  - `src/app/components/sections/signal-radar.tsx:49`

## Redirect baseline

### `vercel.json` redirects (edge)
- `/podminky-pouzivani-sluzby` -> `/terms` (`permanent: true`)
- `/ochrana-osobnich-udaju` -> `/privacy-policy` (`permanent: true`)
- `/demo` -> `/?demo=1` (`permanent: false`)
- `/engagement` -> `/?scroll=radar` (`permanent: false`)

### `src/app/app.tsx` in-app redirects (`<Navigate>`)
- `/podminky-pouzivani-sluzby` -> `/terms`
- `/ochrana-osobnich-udaju` -> `/privacy-policy`
- `/signup` -> `/?signup=1`
- `/demo` -> `/?demo=1`
- `/engagement` -> `/?scroll=radar`

## Build baseline
- `npm run build`: ✅ success (vite build + `scripts/generate-og-pages.mjs`)
