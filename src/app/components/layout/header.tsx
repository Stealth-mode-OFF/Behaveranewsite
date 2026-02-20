import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/app/contexts/language-context";
import { cn } from "@/app/components/ui/utils";
import { BEHAVERA_LOGIN_URL, ECHO_PULSE_TRY_URL } from "@/lib/urls";
import { trackLoginClick } from "@/lib/analytics";
import { HOME_SECTION_IDS, NAV_ITEMS, ROUTES, homeAnchor } from "@/app/config/routes";

export function Header({ topOffset = 0 }: { topOffset?: number }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === ROUTES.home;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open (prevents iOS momentum scroll behind overlay) */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileMenuOpen]);

  const navLabelById: Record<(typeof NAV_ITEMS)[number], string> = {
    radar:
      language === "cz"
        ? "Jak to funguje"
        : language === "de"
          ? "So funktioniert's"
          : "How it works",
    "case-studies":
      language === "cz"
        ? "Případové studie"
        : language === "de"
          ? "Fallstudien"
          : "Case studies",
    pricing:
      language === "cz"
        ? "Ceník"
        : language === "de"
          ? "Preise"
          : "Pricing",
  };

  const blogLabel = "Blog";
  const aboutLabel =
    language === "cz"
      ? "O nás"
      : language === "de"
        ? "Über uns"
        : "About";
  const loginLabel =
    language === "cz"
      ? "Přihlášení"
      : language === "de"
        ? "Anmelden"
        : "Sign in";
  const ctaLabel =
    language === "cz"
      ? "Otestovat zdarma"
      : language === "de"
        ? "Kostenlos testen"
        : "Test for free";

  const navLinkClass = cn(
    "text-[13px] font-medium transition-colors",
    isScrolled
      ? "text-brand-text-secondary hover:text-brand-primary"
      : "text-brand-text-secondary/80 hover:text-brand-text-primary"
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const triggerAboutUnfold = () => {
    window.dispatchEvent(new Event('behavera:about:open'));
  };

  const blogLinkTarget = `${ROUTES.home}?scroll=${HOME_SECTION_IDS.blog}`;
  const aboutLinkTarget = `${ROUTES.home}?scroll=${HOME_SECTION_IDS.about}&open=${HOME_SECTION_IDS.about}`;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ top: topOffset }}
      className={cn(
        "fixed left-0 right-0 transition-all duration-300",
        mobileMenuOpen ? "z-[60]" : "z-50",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-brand-border/40 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-default flex items-center justify-between">
        <Link
          to={ROUTES.home}
          className="flex items-center group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src="/logo-behavera.png" alt="Behavera" className="h-7 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((itemId) =>
            isHome ? (
              <a
                key={itemId}
                href={`#${itemId}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(itemId);
                }}
                className={navLinkClass}
              >
                {navLabelById[itemId]}
              </a>
            ) : (
              <Link key={itemId} to={homeAnchor(itemId)} className={navLinkClass}>
                {navLabelById[itemId]}
              </Link>
            )
          )}
          {isHome ? (
            <a
              href={`#${HOME_SECTION_IDS.blog}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(HOME_SECTION_IDS.blog);
              }}
              className={navLinkClass}
            >
              {blogLabel}
            </a>
          ) : (
            <Link to={blogLinkTarget} className={navLinkClass}>
              {blogLabel}
            </Link>
          )}
          {isHome ? (
            <button
              type="button"
              className={navLinkClass}
              onClick={triggerAboutUnfold}
            >
              {aboutLabel}
            </button>
          ) : (
            <Link to={aboutLinkTarget} className={navLinkClass}>
              {aboutLabel}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <a
            href={BEHAVERA_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLoginClick("header_desktop")}
            className="hidden lg:inline-flex text-[13px] font-medium text-brand-text-muted hover:text-brand-text-primary transition-colors"
          >
            {loginLabel}
          </a>

          <a
            href={ECHO_PULSE_TRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden lg:inline-flex items-center justify-center h-9 px-5 text-[13px] font-semibold rounded-full transition-all",
              "bg-brand-primary text-white hover:bg-brand-primary-hover",
              isScrolled && "shadow-sm"
            )}
          >
            {ctaLabel}
          </a>

          <button
            type="button"
            className="lg:hidden p-2 text-brand-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white/98 backdrop-blur-xl z-40 flex flex-col pt-28 px-6"
            id="mobile-navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((itemId) =>
                isHome ? (
                  <a
                    key={itemId}
                    href={`#${itemId}`}
                    className="py-3 text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      setTimeout(() => scrollTo(itemId), 350);
                    }}
                  >
                    {navLabelById[itemId]}
                  </a>
                ) : (
                  <Link
                    key={itemId}
                    to={homeAnchor(itemId)}
                    className="py-3 text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {navLabelById[itemId]}
                  </Link>
                )
              )}
              {isHome ? (
                <a
                  href={`#${HOME_SECTION_IDS.blog}`}
                  className="py-3 text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setTimeout(() => scrollTo(HOME_SECTION_IDS.blog), 350);
                  }}
                >
                  {blogLabel}
                </a>
              ) : (
                <Link
                  to={blogLinkTarget}
                  className="py-3 text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {blogLabel}
                </Link>
              )}
              {isHome ? (
                <button
                  type="button"
                  className="py-3 text-left text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => triggerAboutUnfold(), 350);
                  }}
                >
                  {aboutLabel}
                </button>
              ) : (
                <Link
                  to={aboutLinkTarget}
                  className="py-3 text-[28px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {aboutLabel}
                </Link>
              )}

              <div className="mt-8 pt-8 border-t border-brand-border/60 flex flex-col gap-3">
                <a
                  href={ECHO_PULSE_TRY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-12 flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-base"
                >
                  {ctaLabel}
                </a>
                <a
                  href={BEHAVERA_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 flex items-center justify-center text-sm font-medium text-brand-text-muted hover:text-brand-text-primary transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    trackLoginClick("header_mobile");
                  }}
                >
                  {loginLabel}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
