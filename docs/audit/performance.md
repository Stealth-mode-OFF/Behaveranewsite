# Performance Notes

## Optimizations Applied
- **Route-level code-splitting**: public and admin pages are lazy-loaded via `React.lazy` and `Suspense`.
- **Below-the-fold lazy sections**: case studies, FAQ, pricing, trust, CTA, and lead capture load on demand.
- **Hero image stability**: explicit `width`/`height` and `fetchPriority="high"` added to prevent CLS.
- **Bundle trimming**: removed unused UI components and dependencies (carousel, charts, drawers, OTP, etc.).

## How to Verify
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Preview: `npm run preview`
4. Open Lighthouse in Chrome DevTools and run on the homepage.

## Manual Checklist
- Header renders **one** language switcher.
- Logo marquee appears once (duplication only for marquee animation).
- Demo CTA renders once per section.
- Admin editors still open and load with lazy chunk when accessed.

## Optional Next Steps
- Add explicit image `width`/`height` for other large inline images to further reduce CLS.
- Consider `vite` manualChunks if the main chunk remains >500 kB.
