# Repo Map

## Runtime Structure

- `src/main.tsx`: React bootstrap.
- `src/app/app.tsx`: Main app shell, route tree, global providers/modals.
- `src/app/contexts/`: shared app contexts.
  - `language-context.tsx`
  - `modal-context.tsx`
- `src/app/pages/public/`: public pages (`landing`, `blog`, `blog-post`, `case-studies`, `case-study`, legal pages, onboarding, etc.).
- `src/app/pages/admin/`: admin pages (`dashboard`, list/edit pages, layout/login).
- `src/app/components/layout/`: global layout and overlays (header/footer/modals/cookie banner).
- `src/app/components/sections/`: landing sections.
- `src/app/components/onboarding/`: onboarding-specific components.
- `src/app/components/ui/`: reusable UI primitives.
- `src/app/hooks/`: app hooks (kebab-case naming).
- `src/lib/`: service/data/util layer (`cms-service`, `analytics`, `supabase`, sanitization, etc.).

## Assets

- Canonical runtime assets are in:
  - `src/assets/clients/`
  - `src/assets/team/`
  - `src/assets/hero/`
- Legacy and non-runtime assets were moved to `archive/legacy/`.

## APIs and Public Files

- Vercel APIs: `api/` (unchanged endpoint paths).
- Public URL-critical files: `public/` (filenames unchanged).

## Documentation

- `docs/tasks/`
- `docs/plans/`
- `docs/handover/`
- `docs/audit/`
- `docs/changelog.md`

## Legacy Archive

- `archive/legacy/dead-code/`: removed runtime dead code.
- `archive/legacy/assets-duplicates/`: duplicate non-runtime assets.
- `archive/legacy/assets-unused/`: unused non-runtime assets.
- `archive/legacy/inventory.md`: source -> destination movement ledger with reasons and SHA1.
