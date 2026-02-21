/**
 * UI Scale Tokens — single source of truth for recurring Tailwind class combos.
 *
 * Why:
 *   Raw Tailwind is flexible but allows accidental inflation (h-12 + py-4, text-3xl
 *   in a pill, etc.). These tokens lock approved sizes so components stay
 *   consistent without a runtime CSS-in-JS layer.
 *
 * Rules:
 *   1. Every chip/pill MUST use `chipTokens`.
 *   2. Buttons always go through the CVA in button.tsx — these tokens are
 *      listed here only for documentation / auditing.
 *   3. Section padding is controlled by CSS vars in theme.css
 *      (`section-spacing` / `section-spacing-compact`). The tokens here
 *      mirror them for reference.
 *   4. Never combine a fixed height (`h-*`) with vertical padding (`py-*`)
 *      unless you explicitly account for content height.
 */

/* ─── Chip / Pill ─── */
export const chipTokens = {
  /** Small proof chip — 28-30 px tall, caption text */
  sm: "flex items-center gap-1.5 py-1 px-3 rounded-md text-caption leading-tight",
  /** Medium badge chip — 34-36 px tall, small text */
  md: "flex items-center gap-2 py-1.5 px-4 rounded-lg text-sm leading-tight",
} as const;

/* ─── Button (reference — actual impl in button.tsx CVA) ─── */
export const buttonTokens = {
  /** 40 px touch target */
  sm: "h-10 px-4 text-sm rounded-lg",
  /** 48 px default */
  md: "h-12 px-6 text-sm rounded-xl",
  /** 52 px hero-only */
  lg: "h-13 px-8 text-base rounded-xl",
} as const;

/* ─── Section Spacing (reference — actual impl in theme.css) ─── */
export const sectionTokens = {
  /** Compact spacing — logos, stats bar (40 / 48 / 56 px) */
  sm: "section-spacing-compact",
  /** Default spacing — most sections (56 / 80 / 96 px) */
  md: "section-spacing",
  /** Explicit large — hero, CTA only */
  lg: "py-20 md:py-28 lg:py-32",
} as const;

/* ─── Max heights — guardrails for visual audit ─── */
export const maxHeights = {
  /** Proof chips should never exceed this in rendered px */
  chip: 44,
  /** Default button rendered max */
  button: 52,
} as const;
