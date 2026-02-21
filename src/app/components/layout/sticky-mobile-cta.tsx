import { useEffect, useState, useRef, useCallback } from "react";
import { X, ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { useModal } from "@/app/contexts/modal-context";
import { trackStickyCtaDismissed } from "@/lib/analytics";

/**
 * StickyMobileCta — Premium mobile-first sticky bar.
 *
 * Shows when hero CTAs scroll out of view (IntersectionObserver).
 * Hides when lead-capture form is in view or any input/textarea is focused.
 * Two buttons: primary (test) + secondary (demo booking).
 * iOS safe-area aware. WCAG 2.2 target-size compliant (≥ 44px height).
 */
export function StickyMobileCta() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const [heroCtasVisible, setHeroCtasVisible] = useState(true);
  const [leadFormVisible, setLeadFormVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const heroObserver = useRef<IntersectionObserver | null>(null);
  const leadObserver = useRef<IntersectionObserver | null>(null);

  // Track input/textarea focus to hide bar when keyboard is up
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        setInputFocused(true);
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        setInputFocused(false);
      }
    };
    document.addEventListener('focusin', onFocusIn, { passive: true });
    document.addEventListener('focusout', onFocusOut, { passive: true });
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  // IntersectionObserver: hero CTAs
  useEffect(() => {
    const heroCtas = document.querySelector('[data-hero-ctas]');
    if (!heroCtas) {
      // Fallback: show after a scroll threshold if hero CTAs marker not found
      setHeroCtasVisible(false);
      return;
    }
    heroObserver.current = new IntersectionObserver(
      ([entry]) => setHeroCtasVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    heroObserver.current.observe(heroCtas);
    return () => heroObserver.current?.disconnect();
  }, []);

  // IntersectionObserver: lead-capture section
  useEffect(() => {
    const leadSection = document.getElementById('lead-capture');
    if (!leadSection) return;
    leadObserver.current = new IntersectionObserver(
      ([entry]) => setLeadFormVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    leadObserver.current.observe(leadSection);
    return () => leadObserver.current?.disconnect();
  }, []);

  const isVisible = !heroCtasVisible && !leadFormVisible && !inputFocused && !isDismissed;

  const labels = {
    cz: { primary: 'Otestovat 1 tým zdarma', secondary: 'Rezervovat demo' },
    en: { primary: 'Test 1 team for free', secondary: 'Book a demo' },
    de: { primary: '1 Team kostenlos testen', secondary: 'Demo buchen' },
  };
  const l = labels[language] || labels.en;

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom-4 duration-300"
      role="complementary"
      aria-label="Quick actions"
    >
      <div
        className="bg-white/95 backdrop-blur-md border-t border-brand-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2.5"
        style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-2">
          {/* Primary CTA */}
          <a
            href="https://app.behavera.com/echo-pulse/try"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-[44px] flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary text-white font-semibold text-[13px] hover:bg-brand-primary-hover active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            {l.primary}
          </a>
          {/* Secondary CTA */}
          <button
            type="button"
            onClick={() => openBooking('sticky_cta')}
            className="h-[44px] px-3 flex items-center justify-center gap-1 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-[13px] hover:bg-brand-primary/5 active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {l.secondary}
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
          {/* Dismiss */}
          <button
            type="button"
            onClick={() => { setIsDismissed(true); trackStickyCtaDismissed(); }}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-brand-text-muted/60 hover:text-brand-text-primary hover:bg-brand-background-secondary transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
