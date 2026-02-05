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

  const navItems = [
    { id: 'problem', label: t.header.nav.problem, type: 'scroll' },
    { id: 'how-it-works', label: t.header.nav.solution, type: 'scroll' },
    { id: 'solutions', label: t.header.nav.impact, type: 'scroll' },
  ];

  const pageLinks = [
    { path: '/research', label: language === 'cz' ? 'Věda' : language === 'de' ? 'Forschung' : 'Research' },
    { path: '/blog', label: 'Blog' },
    { path: '/case-studies', label: 'Case Studies' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-md border-b border-brand-border py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container-default flex items-center justify-between">
        
        {/* Logo - Text Only, Strong */}
        <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <span className={cn(
                "text-xl font-bold tracking-tighter transition-colors text-brand-text-primary"
            )}>
              Echo Pulse
            </span>
            <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:animate-pulse opacity-100"
            )} />
        </Link>

        {/* Desktop Nav - Minimal */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
             isHome ? (
                 <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className={cn(
                        "text-xs font-bold transition-colors hover:text-brand-primary uppercase tracking-widest",
                        isScrolled ? "text-brand-text-secondary" : "text-brand-text-secondary/80 hover:text-brand-primary"
                    )}
                >
                    {item.label}
                 </a>
             ) : (
                 <Link
                    key={item.id}
                    to={`/#${item.id}`}
                    className={cn(
                        "text-xs font-bold transition-colors hover:text-brand-primary uppercase tracking-widest",
                        isScrolled ? "text-brand-text-secondary" : "text-brand-text-secondary/80 hover:text-brand-primary"
                    )}
                 >
                     {item.label}
                 </Link>
             )
          ))}
          {pageLinks.map((link) => (
             <Link 
                key={link.path}
                to={link.path}
                className={cn(
                    "text-xs font-bold transition-colors hover:text-brand-primary uppercase tracking-widest",
                    isScrolled ? "text-brand-text-secondary" : "text-brand-text-secondary/80 hover:text-brand-primary"
                )}
            >
                {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-brand-text-primary">
             <LanguageSwitcher />
          </div>
          
          <Button 
            onClick={openBooking}
            variant={isScrolled ? "default" : "secondary"}
            className={cn(
                "rounded h-10 px-6 font-semibold transition-all text-sm",
                !isScrolled && "bg-brand-primary text-white hover:bg-brand-primary-hover",
                isScrolled && "bg-brand-primary text-white hover:bg-brand-primary-hover"
            )}
          >
            {t.header.bookDemo}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="text-brand-text-primary">
             <LanguageSwitcher />
          </div>
          <button
            className="p-2 transition-colors text-brand-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white z-40 flex flex-col pt-32 px-6"
          >
            <div className="flex flex-col gap-6">
               {navItems.map((item) => (
                 isHome ? (
                    <a 
                        key={item.id}
                        href={`#${item.id}`} 
                        className="text-4xl font-bold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors" 
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.label}
                    </a>
                 ) : (
                    <Link
                        key={item.id}
                        to={`/#${item.id}`}
                        className="text-4xl font-bold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors" 
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                 )
              ))}
              {pageLinks.map((link) => (
                 <Link 
                    key={link.path}
                    to={link.path}
                    className="text-4xl font-bold text-brand-text-primary tracking-tight hover:text-brand-primary transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {link.label}
                </Link>
              ))}
              <div className="mt-8 pt-8 border-t border-brand-border flex flex-col gap-4">
                <Button 
                    onClick={() => {
                        setMobileMenuOpen(false);
                        openBooking();
                    }}
                    className="w-full h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
                >
                  {t.header.bookDemo}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
