import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Link } from "react-router-dom";
import { Github, Phone } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  const linkTargets = ["#solutions", "#pricing", "#about", "#lead-capture"];
  const legalTargets = ["#legal", "#legal"];
  const phoneLabel = language === 'cz' ? 'Zavolejte nám' : language === 'de' ? 'Rufen Sie uns an' : 'Call us';
  
  return (
    <footer className="bg-brand-background-secondary border-t border-brand-border py-12 md:py-16 lg:py-20 text-sm text-brand-text-secondary">
      <div className="container-default">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    <span className="font-bold text-brand-text-primary tracking-tight">Echo Pulse</span>
                </div>
                <a 
                  href="tel:+420605839456" 
                  className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>+420 605 839 456</span>
                </a>
            </div>
            
            <div className="flex gap-8">
                {t.footer.links.map((link, i) => (
                <a key={i} href={linkTargets[i] || "#"} className="hover:text-brand-primary transition-colors font-medium">{link}</a>
                ))}
                <Link to="/blog" className="hover:text-brand-primary transition-colors font-medium">Blog</Link>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
                <p>{t.footer.rights}</p>
                <div className="flex gap-6 justify-end items-center">
                    {t.footer.legal.map((item, i) => {
                        const isTerms = item === "Terms" || item === "Podmínky" || item === "AGB";
                        if (isTerms) {
                          return (
                            <Link key={i} to="/terms" className="hover:text-brand-primary transition-colors">
                              {item}
                            </Link>
                          );
                        }
                        return (
                          <a key={i} href={legalTargets[i] || "#legal"} className="hover:text-brand-primary transition-colors">
                            {item}
                          </a>
                        );
                    })}
                    <a
                      href="https://github.com/behavera/echo-pulse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-primary transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
