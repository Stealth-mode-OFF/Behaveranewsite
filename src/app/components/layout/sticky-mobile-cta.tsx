import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { useNavigate } from "react-router-dom";
import { trackStickyCtaDismissed } from "@/lib/analytics";

export function StickyMobileCta() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white border-t border-brand-border shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/start')}
            className="flex-1 h-12 rounded-[var(--button-radius)] bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-hover transition-colors"
          >
            {language === 'cz' ? 'Otestovat na 1 týmu zdarma' : language === 'de' ? '1 Team kostenlos testen' : 'Test 1 team for free'}
          </button>
          <button
            type="button"
            onClick={() => { setIsDismissed(true); trackStickyCtaDismissed(); }}
            className="w-10 h-10 flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
