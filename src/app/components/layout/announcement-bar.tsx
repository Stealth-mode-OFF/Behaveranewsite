import { useState, useEffect } from "react";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/app/language-context";
import { motion, AnimatePresence } from "framer-motion";

/** Height of the announcement bar in px — used to offset the header */
export const ANNOUNCEMENT_BAR_HEIGHT = 48;

/**
 * Announcement Bar — Fathom-inspired top banner
 * 
 * Fixed at the very top of the viewport (z-60).
 * The Header should offset itself by ANNOUNCEMENT_BAR_HEIGHT when visible.
 * Dismissible, stored in sessionStorage so it doesn't reappear.
 */
export function AnnouncementBar({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("announcement_dismissed") === "1";
    } catch {
      return false;
    }
  });

  const visible = !dismissed;

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [visible, onVisibilityChange]);

  const copy = {
    cz: {
      message: "Stále používáte Google Forms pro zpětnou vazbu?",
      cta: "Přejděte na Behavera →",
      link: "https://app.behavera.com/echo-pulse/try",
    },
    en: {
      message: "Still using Google Forms for employee feedback?",
      cta: "Switch to Behavera →",
      link: "https://app.behavera.com/echo-pulse/try",
    },
    de: {
      message: "Nutzen Sie noch Google Forms für Mitarbeiter-Feedback?",
      cta: "Wechseln Sie zu Behavera →",
      link: "https://app.behavera.com/echo-pulse/try",
    },
  };

  const c = copy[language] || copy.en;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("announcement_dismissed", "1");
    } catch {
      // Silent fail
    }
  };



  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: ANNOUNCEMENT_BAR_HEIGHT, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 bg-brand-primary text-white z-[60] overflow-hidden"
          style={{ height: ANNOUNCEMENT_BAR_HEIGHT }}
        >
          <div className="container-default flex items-center justify-center gap-2 sm:gap-3 h-full text-xs sm:text-sm relative pr-8">
            <Sparkles className="w-4 h-4 text-brand-accent flex-shrink-0 hidden sm:block" />
            <span className="font-medium text-white/90 truncate">
              {c.message}
            </span>
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-brand-accent transition-colors inline-flex items-center gap-1 underline underline-offset-2 shrink-0"
            >
              {c.cta}
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
