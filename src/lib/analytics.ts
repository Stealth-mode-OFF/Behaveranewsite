/**
 * Analytics — Vercel Web Analytics + Custom Event Tracking
 *
 * Wraps @vercel/analytics `track()` with typed, consent-aware helpers.
 * Every marketing / sales event on the site flows through this module.
 *
 * Events are only fired when the user has accepted analytics cookies.
 */

import { track } from "@vercel/analytics";

// ─── Cookie consent check ───────────────────────────────────────────
const COOKIE_CONSENT_KEY = "behavera_cookie_consent";

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return false;
    const consent = JSON.parse(raw);
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/** Fire a Vercel Analytics custom event (consent-gated). */
function safeTrack(event: string, data?: Record<string, string | number | boolean>) {
  if (!hasAnalyticsConsent()) return;
  track(event, data);
}

// ─── CTA / Booking ──────────────────────────────────────────────────

export function trackBookingOpen(location: string) {
  safeTrack("booking_modal_opened", { location });
}

export function trackBookingClose() {
  safeTrack("booking_modal_closed");
}

export function trackBookingCalendarLoaded() {
  safeTrack("booking_calendar_loaded");
}

// ─── Pulse Check (Try Free) ─────────────────────────────────────────

export function trackPulseCheckOpen(location: string, language: string) {
  safeTrack("pulse_check_opened", { location, language });
}

// ─── Lead Capture ───────────────────────────────────────────────────

export function trackLeadSubmitted(source: string) {
  safeTrack("lead_submitted", { source });
}

export function trackLeadFailed(source: string) {
  safeTrack("lead_submission_failed", { source });
}

export function trackEbookDownload(title: string, method: "auto" | "manual") {
  safeTrack("ebook_download", { title, method });
}

// ─── Lead Popup (exit-intent) ───────────────────────────────────────

export function trackLeadPopupTriggered(trigger: "exit_intent" | "timeout" | "scroll_depth") {
  safeTrack("lead_popup_triggered", { trigger });
}

export function trackLeadPopupDismissed() {
  safeTrack("lead_popup_dismissed");
}

// ─── Pricing ────────────────────────────────────────────────────────

export function trackPricingBillingToggle(interval: "monthly" | "yearly") {
  safeTrack("pricing_billing_toggle", { interval });
}

export function trackPricingSliderChanged(employeeCount: number) {
  safeTrack("pricing_slider_changed", { employee_count: employeeCount });
}

// ─── Role Selection ─────────────────────────────────────────────────

export function trackRoleSelected(role: string) {
  safeTrack("role_selected", { role });
}

// ─── FAQ ─────────────────────────────────────────────────────────────

export function trackFaqCategoryChanged(category: string) {
  safeTrack("faq_category_changed", { category });
}

export function trackFaqItemToggled(question: string) {
  safeTrack("faq_item_toggled", { question: question.slice(0, 100) });
}

// ─── Navigation & Outbound ──────────────────────────────────────────

export function trackLoginClick(location: string) {
  safeTrack("login_click", { location });
}

export function trackExternalLink(url: string, label: string) {
  safeTrack("external_link_click", { url, label });
}

export function trackSocialClick(platform: string) {
  safeTrack("social_link_click", { platform });
}

// ─── Mobile CTA ─────────────────────────────────────────────────────

export function trackStickyCtaDismissed() {
  safeTrack("sticky_mobile_cta_dismissed");
}

// ─── Blog (TOC, CTA, depth) ───────────────────────────────────────

export function trackBlogTocClick(slug: string, headingId: string) {
  safeTrack("blog_toc_click", { slug, heading_id: headingId });
}

export function trackBlogCtaView(type: "lead" | "demo", slug: string, position: "mid" | "end" | "rail") {
  safeTrack("blog_cta_view", { type, slug, position });
}

export function trackBlogCtaClick(type: "lead" | "demo", slug: string, position: "mid" | "end" | "rail") {
  safeTrack("blog_cta_click", { type, slug, position });
}

export function trackBlogDepth(slug: string, milestone: 25 | 50 | 75 | 100) {
  safeTrack("blog_depth", { slug, milestone });
}

// ─── Cookie Consent ─────────────────────────────────────────────────

export function trackCookieConsent(choice: "accept_all" | "essential_only" | "custom", analyticsEnabled?: boolean) {
  // This one fires unconditionally since the user just made the consent decision
  track("cookie_consent", { choice, analytics_enabled: analyticsEnabled ?? false });
}

// ─── Language ───────────────────────────────────────────────────────

export function trackLanguageSwitch(language: string) {
  safeTrack("language_switched", { language });
}
