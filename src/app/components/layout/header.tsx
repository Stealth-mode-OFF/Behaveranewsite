import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/app/contexts/language-context";
import { cn } from "@/app/components/ui/utils";
import { useModal } from "@/app/contexts/modal-context";
import { BEHAVERA_LOGIN_URL } from "@/lib/urls";
import { trackLoginClick } from "@/lib/analytics";

export function Header({ topOffset = 0 }: { topOffset?: number }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { openDemo } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open (prevents iOS momentum scroll behind overlay) */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileMenuOpen]);

  const navItems = [
    {
      id: "radar",
      label:
        language === "cz"
          ? "Jak to funguje"
          : language === "de"
          ? "So funktioniert's"
          : "How it works",
    },
    {
      id: "pricing",
      label:
        language === "cz" ? "Ceník" : language === "de" ? "Preise" : "Pricing",
    },
  ];

  const caseStudiesLabel =
    language === "cz"
      ? "Případové studie"
      : language === "de"
      ? "Fallstudien"
      : "Case studies";

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

  /* ─── Shared nav-link class ─── */
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
          ? "bg-white/95 backdrop-blur-xl border-b border-brand-border/40 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-default flex items-center justify-between relative z-50">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo-behavera.png"
            alt="Behavera"
            className="h-7 w-auto"
            width={120}
            height={28}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) =>
            isHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
                className={navLinkClass}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                className={navLinkClass}
              >
                {item.label}
              </Link>
            )
          )}
          <Link to="/case-studies" className={navLinkClass}>
            {caseStudiesLabel}
          </Link>
          <Link to="/blog" className={navLinkClass}>
            {blogLabel}
          </Link>
          {isHome ? (
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('about');
              }}
              className={navLinkClass}
            >
              {aboutLabel}
            </a>
          ) : (
            <Link to="/#about" className={navLinkClass}>
              {aboutLabel}
            </Link>
          )}
        </nav>

        {/* ── Right actions ── */}
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
            href="https://app.behavera.com/echo-pulse/try"
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

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Panel — slides from right */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[min(85vw,360px)] bg-white shadow-2xl z-40 flex flex-col pt-24 pb-8 px-8 overflow-y-auto"
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex flex-col items-end gap-0.5">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {isHome ? (
                      <a
                        href={`#${item.id}`}
                        className="block py-3 text-right text-[22px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          setTimeout(() => scrollTo(item.id), 350);
                        }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={`/#${item.id}`}
                        className="block py-3 text-right text-[22px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                {[
                  { to: '/case-studies', label: caseStudiesLabel },
                  { to: '/blog', label: blogLabel },
                ].map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + (navItems.length + idx) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={item.to}
                      className="block py-3 text-right text-[22px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 + (navItems.length + 2) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  {isHome ? (
                    <a
                      href="#about"
                      className="block py-3 text-right text-[22px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => scrollTo('about'), 350);
                      }}
                    >
                      {aboutLabel}
                    </a>
                  ) : (
                    <Link
                      to="/#about"
                      className="block py-3 text-right text-[22px] font-semibold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {aboutLabel}
                    </Link>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 }}
                className="mt-auto pt-8 border-t border-brand-border/40 flex flex-col gap-3"
              >
                <a
                  href="https://app.behavera.com/echo-pulse/try"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-12 flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-base transition-colors"
                >
                  {ctaLabel}
                </a>
                <a
                  href={BEHAVERA_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 flex items-center justify-center rounded-full border border-brand-border text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-primary/40 transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    trackLoginClick("header_mobile");
                  }}
                >
                  {loginLabel}
                </a>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
