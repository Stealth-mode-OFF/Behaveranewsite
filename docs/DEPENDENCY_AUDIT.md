# Dependency Audit

Generated: 2026-02-10

This document flags `package.json` dependencies that do not appear to be referenced anywhere under `src/` (simple string match).

These entries are **candidates** for removal, not a guarantee. Some packages may be used indirectly (generated UI components, dynamic imports, runtime injection), or intentionally kept for near-term work.

## Candidate Unused (No `src/` References Found)

- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-progress`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-slider`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toggle-group`
- `vercel`

## Notes

- Many Radix packages are typically pulled in by UI primitives (e.g. shadcn/ui). If we later add those components, some of these may become used.
- `vercel` is usually a CLI/tooling dependency (often a `devDependency`) rather than something imported into `src/`.
