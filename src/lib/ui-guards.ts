/**
 * UI Hierarchy Guards — dev-mode warnings for visual hierarchy violations.
 *
 * These are NOT runtime enforcers that block rendering.
 * They log console warnings in development only.
 *
 * Usage:
 *   import { warnLgOutsideHero, warnMultiplePrimaries } from "@/lib/ui-guards";
 *   warnLgOutsideHero("PricingSection");
 *   warnMultiplePrimaries("CtaSection", 2);
 */

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== "production";

/**
 * Warn if size="lg" button is used outside Hero.
 * Call from any section component that accidentally receives a lg button.
 */
export function warnLgOutsideHero(componentName: string): void {
  if (!isDev) return;
  console.warn(
    `[UI Hierarchy] ⚠️ size="lg" Button detected in <${componentName}>. ` +
      `Only the Hero section may use size="lg". Use size="default" instead.`,
  );
}

/**
 * Warn if multiple primary-weight buttons exist in same section.
 * @param componentName — section name for the warning
 * @param count — number of primary/inverse buttons found
 */
export function warnMultiplePrimaries(componentName: string, count: number): void {
  if (!isDev || count <= 1) return;
  console.warn(
    `[UI Hierarchy] ⚠️ ${count} primary-weight buttons in <${componentName}>. ` +
      `Only 1 primary (default/inverse) per section. Downgrade extras to outline/ghost.`,
  );
}
