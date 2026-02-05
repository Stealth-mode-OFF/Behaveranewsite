import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Link } from "react-router-dom";
import { Phone, MapPin, Linkedin } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  const linkTargets = ["#solutions", "#pricing", "#about", "#lead-capture"];
  const phoneLabel = language === 'cz' ? 'Zavolejte nám' : language === 'de' ? 'Rufen Sie uns an' : 'Call us';
  
  const companyInfo = {
    cz: {
      name: "Behavera s.r.o.",
      ico: "IČO: 19060369",
      address: "Křižíkova 148/34, Praha 8",
    },
    en: {
      name: "Behavera s.r.o.",
      ico: "ID: 19060369",
      address: "Křižíkova 148/34, Prague 8, CZ",
    },
    de: {
      name: "Behavera s.r.o.",
      ico: "Reg.-Nr.: 19060369",
      address: "Křižíkova 148/34, Prag 8, CZ",
    },
  };

  const legalLinks = {
    cz: [
      { label: "Podmínky", href: "/terms" },
      { label: "Ochrana údajů", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
    en: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
    de: [
      { label: "AGB", href: "/terms" },
      { label: "Datenschutz", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
  };

  const info = companyInfo[language] || companyInfo.en;
  const legal = legalLinks[language] || legalLinks.en;
  
  return (
    <footer className="bg-brand-background-secondary border-t border-brand-border py-12 md:py-16 lg:py-20 text-sm text-brand-text-secondary">
      <div className="container-default">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Brand & Contact */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    <span className="font-bold text-brand-text-primary tracking-tight">Echo Pulse</span>
                </div>
                <div className="text-xs text-brand-text-muted space-y-1">
                  <p className="font-medium text-brand-text-secondary">{info.name}</p>
                  <p>{info.ico}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{info.address}</span>
                  </div>
                </div>
                <a 
                  href="tel:+420605839456" 
                  className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors font-medium mt-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>+420 605 839 456</span>
                </a>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-8">
                {t.footer.links.map((link, i) => (
                <a key={i} href={linkTargets[i] || "#"} className="hover:text-brand-primary transition-colors font-medium">{link}</a>
                ))}
                <Link to="/blog" className="hover:text-brand-primary transition-colors font-medium">Blog</Link>
            </div>

            {/* Legal & Social */}
            <div className="text-right flex flex-col items-end gap-3">
                <p>{t.footer.rights}</p>
                <div className="flex gap-4 justify-end items-center flex-wrap">
                    {legal.map((item, i) => (
                      <Link key={i} to={item.href} className="hover:text-brand-primary transition-colors text-xs">
                        {item.label}
                      </Link>
                    ))}
                </div>
                <a
                  href="https://linkedin.com/company/behavera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
}
