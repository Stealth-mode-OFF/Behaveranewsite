import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../LanguageContext";
import { cn } from "./ui/utils";
import { useModal } from "../ModalContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simplified enterprise nav - fewer items, clearer hierarchy
  const pageLinks = [
    { path: '/research', label: language === 'cz' ? 'Metodologie' : language === 'de' ? 'Methodik' : 'Methodology' },
    { path: '/case-studies', label: language === 'cz' ? 'Reference' : language === 'de' ? 'Referenzen' : 'Evidence' },
    { path: '/blog', label: language === 'cz' ? 'Analýzy' : language === 'de' ? 'Analysen' : 'Analysis' },
  ];

  const ctaLabel = language === 'cz' ? 'Získat přístup' : language === 'de' ? 'Zugang anfordern' : 'Request access';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] py-4" 
            : "bg-transparent py-6"
      )}
    >
      <div className="container-default flex items-center justify-between">
        
        {/* Logo - Minimal, System-Like */}
        <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <span className="text-lg font-semibold tracking-[-0.02em] text-[#0A0A0F]">
              Echo Pulse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981] group-hover:shadow-[0_0_10px_#10B981] transition-shadow" />
        </Link>

        {/* Desktop Nav - Enterprise Minimal */}
        <nav className="hidden lg:flex items-center gap-10">
          {pageLinks.map((link) => (
             <Link 
                key={link.path}
                to={link.path}
                className="text-[13px] font-medium tracking-wide text-[#52525B] hover:text-[#0A0A0F] transition-colors duration-150"
            >
                {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions - Streamlined */}
        <div className="hidden lg:flex items-center gap-6">
          <LanguageSwitcher />
          
          <Button 
            onClick={openBooking}
            className="h-10 px-6 bg-[#1E3A5F] hover:bg-[#152942] text-white font-medium text-sm rounded-md transition-colors duration-150"
          >
            {ctaLabel}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            className="p-2 text-[#0A0A0F]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Clean Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-40 flex flex-col pt-28 px-6"
          >
            <div className="flex flex-col gap-1">
              {pageLinks.map((link) => (
                 <Link 
                    key={link.path}
                    to={link.path}
                    className="py-4 text-2xl font-semibold text-[#0A0A0F] tracking-tight border-b border-[#F4F4F5]" 
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {link.label}
                </Link>
              ))}
              <div className="mt-8">
                <Button 
                    onClick={() => {
                        setMobileMenuOpen(false);
                        openBooking();
                    }}
                    className="w-full h-14 bg-[#1E3A5F] hover:bg-[#152942] text-white font-medium text-base rounded-md"
                >
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
}
