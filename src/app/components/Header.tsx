import React, { useState, useEffect } from "react";
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
  const { t } = useLanguage();
  const { openBooking } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: 'problem', label: t.header.nav.problem },
    { id: 'how-it-works', label: t.header.nav.solution },
    { id: 'solutions', label: t.header.nav.impact },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container-default flex items-center justify-between">
        
        {/* Logo - Text Only, Strong */}
        <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <span className={cn(
                "text-xl font-bold tracking-tighter transition-colors",
                isScrolled ? "text-slate-900" : "text-white"
            )}>
              Echo Pulse
            </span>
            <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:animate-pulse",
                isScrolled ? "opacity-100" : "opacity-100"
            )} />
        </div>

        {/* Desktop Nav - Minimal */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
             <a 
                key={item.id}
                href={`#${item.id}`} 
                className={cn(
                    "text-xs font-bold transition-colors hover:text-brand-primary uppercase tracking-widest",
                    isScrolled ? "text-slate-500" : "text-slate-300"
                )}
            >
                {item.label}
             </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className={isScrolled ? "text-slate-900" : "text-white"}>
             <LanguageSwitcher />
          </div>
          
          <Button 
            onClick={openBooking}
            variant={isScrolled ? "default" : "secondary"}
            className={cn(
                "rounded h-10 px-6 font-semibold transition-all text-sm",
                !isScrolled && "bg-white text-slate-900 hover:bg-slate-100 border border-transparent hover:border-white/20",
                isScrolled && "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {t.header.bookDemo}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <div className={isScrolled ? "text-slate-900" : "text-white"}>
             <LanguageSwitcher />
          </div>
          <button
            className={cn(
                "p-2 transition-colors",
                isScrolled ? "text-slate-900" : "text-white"
            )}
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
            className="fixed inset-0 bg-slate-900 z-40 flex flex-col pt-32 px-6"
          >
            <div className="flex flex-col gap-6">
               {navItems.map((item) => (
                 <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className="text-4xl font-bold text-white tracking-tight hover:text-brand-primary transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {item.label}
                </a>
              ))}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                <Button 
                    onClick={() => {
                        setMobileMenuOpen(false);
                        openBooking();
                    }}
                    className="w-full justify-center rounded h-14 text-lg font-bold bg-white text-slate-900 hover:bg-slate-200"
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
