import { useState } from "react";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Announcement Bar — Fathom-inspired top banner
 * 
 * Sits above the header with a rotating/static promotional message.
 * Dismissible, stored in sessionStorage so it doesn't reappear.
 */
export function AnnouncementBar() {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("announcement_dismissed") === "1";
    } catch {
      return false;
    }
  });

  const copy = {
    cz: {
      message: "Stále používáte Google Forms pro zpětnou vazbu?",
      cta: "Přejděte na Echo Pulse →",
      link: "#radar",
    },
    en: {
      message: "Still using Google Forms for employee feedback?",
      cta: "Switch to Echo Pulse →",
      link: "#radar",
    },
    de: {
      message: "Nutzen Sie noch Google Forms für Mitarbeiter-Feedback?",
      cta: "Wechseln Sie zu Echo Pulse →",
      link: "#radar",
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

  const handleClick = () => {
    const el = document.getElementById("radar");
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-brand-primary text-white relative z-[60] overflow-hidden"
        >
          <div className="container-default flex items-center justify-center gap-3 py-2.5 text-sm relative">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 hidden sm:block" />
            <span className="font-medium text-white/90">
              {c.message}
            </span>
            <button
              type="button"
              onClick={handleClick}
              className="font-bold text-white hover:text-brand-accent transition-colors inline-flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              {c.cta}
            </button>
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
