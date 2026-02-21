# Responsive QA Checklist — Premium Mobile-First Pass

> Last updated: 2025-01-XX  
> Branch: `main`  
> Commit: TBD (responsive pass)

---

## Automated Tests

Run the full suite:
```bash
npx playwright test e2e/responsive-qa.spec.ts --reporter=list
```

Run a single viewport group:
```bash
npx playwright test -g "Mobile 360px"
npx playwright test -g "Desktop 1440px"
```

### Test Matrix

| Viewport | Width × Height | Key Checks |
|----------|---------------|------------|
| Mobile S | 360 × 800 | Hero fit, sticky CTA, no h-scroll, no carousel arrows |
| Mobile M | 390 × 844 | Hero CTAs, no h-scroll |
| Mobile L | 430 × 932 | Sticky CTA width, hero render |
| Desktop | 1440 × 900 | Two-col hero, carousel arrows hover, no h-scroll |
| Desktop XL | 1728 × 1117 | No overflow, max-width containment |
| WCAG | 390 × 844 | Dot nav ≥24×24, form inputs ≥36px |

---

## Manual Verification Checklist

### Hero Section
- [ ] **Mobile (360–430px):** Single column, calm layout, no `min-h-screen` overflow
- [ ] **Mobile:** Subtitle uses `line-clamp-3`, expands on desktop
- [ ] **Mobile:** ProofLine hidden, trust chips visible below device image
- [ ] **Desktop (1024px+):** Two-column layout — copy left, device right
- [ ] **Desktop:** Device image constrained ≤680px width
- [ ] Carousel dots are ≥24×24 CSS px touch targets
- [ ] CTA buttons are ≥48px height
- [ ] Carousel auto-advance: 7s mobile, 5s desktop

### Sticky Mobile CTA
- [ ] Appears when hero CTAs scroll out of view (IntersectionObserver)
- [ ] Hides when `#lead-capture` section is in view
- [ ] Hides when keyboard opens (input/textarea focused)
- [ ] Two buttons: primary (test link) + secondary (book demo)
- [ ] All buttons ≥44px height
- [ ] iOS: safe-area-inset-bottom padding applied
- [ ] Backdrop blur / glass effect visible
- [ ] Hidden on `md:` breakpoint and above

### Logo Marquee  
- [ ] **Mobile:** Static 2-row grid (4×2), not animated marquee
- [ ] **Mobile:** Overflow row for remaining logos with smaller sizing
- [ ] **Desktop (md+):** Animated marquee visible
- [ ] All `<img>` tags have explicit `width`/`height` (CLS prevention)

### Carousel Sections (Case Studies, Dashboard Preview)
- [ ] **Mobile:** No visible prev/next arrow buttons
- [ ] **Mobile:** Swipe + dots only for navigation
- [ ] **Desktop:** Arrows appear on hover (`hidden md:flex`)
- [ ] Dot buttons ≥24×24 CSS px
- [ ] Cover images have `width`/`height` attributes + `loading="lazy"`

### Problem Section (BentoGrid)
- [ ] **Mobile:** Descriptions >80 chars get 2-line clamp + expand button
- [ ] **Mobile:** "Zobrazit detail" / "Show detail" button visible
- [ ] **Mobile:** AnimatePresence expand/collapse works smoothly
- [ ] **Desktop:** Full descriptions always visible without expand button
- [ ] Reduced min-heights: 140px large / 110px medium on mobile

### Pricing Section
- [ ] Scale labels readable at 360px (`text-[11px]`)
- [ ] Panel padding: `p-5` on mobile, `p-8` on sm, `p-10` on md+
- [ ] Slider thumb usable on touch screens

### Lead Capture Form
- [ ] Checkbox is ≥16×16 with proper alignment
- [ ] Label uses `items-start` + `gap-2.5` for touch-friendly spacing

### Visual Stability (CLS)
- [ ] Header logo has `width`/`height` attributes
- [ ] Footer logo has `width`/`height` attributes 
- [ ] Stats bar counters use `tabular-nums` (no width jitter)
- [ ] Team member photos have `width`/`height` attributes
- [ ] Hero device image has CSS `aspect-ratio`

---

## Lighthouse Mobile Audit

Run manually:

1. Build production: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools → Lighthouse → Mobile
4. Target scores:
   - Performance: ≥80
   - Accessibility: ≥90
   - Best Practices: ≥90
   - SEO: ≥90

Key CLS targets:
- **CLS < 0.1** (good threshold) on mobile viewport
- No images without explicit dimensions above the fold

---

## Files Modified in This Pass

| File | Changes |
|------|---------|
| `hero.tsx` | Two-col desktop, calm mobile, aspect-ratio, WCAG dots |
| `sticky-mobile-cta.tsx` | IntersectionObserver, dual CTA, safe-area, keyboard hide |
| `logo-marquee.tsx` | Mobile grid vs desktop marquee split |
| `case-studies.tsx` | Removed mobile prev/next arrows, CLS image dims |
| `snap-carousel.tsx` | Hidden arrows on mobile, WCAG dot targets |
| `problem.tsx` | Progressive disclosure with AnimatePresence |
| `pricing.tsx` | Mobile padding + scale label sizing |
| `lead-capture.tsx` | Checkbox enlargement + label alignment |
| `stats-bar.tsx` | `tabular-nums` for counter stability |
| `about-unfold.tsx` | Image width/height attributes |
| `header.tsx` | Logo width/height for CLS |
| `footer.tsx` | Logo width/height for CLS |

---

## Browser Testing Matrix

| Browser | Mobile | Desktop | Status |
|---------|--------|---------|--------|
| Chrome | iOS Safari sim / Android Chrome | macOS Chrome | ☐ |
| Safari | iPhone 14/15 real device | macOS Safari | ☐ |
| Firefox | - | macOS Firefox | ☐ |
| Edge | - | Windows Edge | ☐ |
