import { useLanguage } from "@/app/contexts/language-context";
import { Link, useLocation } from "react-router-dom";
import { Phone, Linkedin, Facebook, Instagram, Mail, ArrowUpRight, Calendar } from "lucide-react";
import { ECHO_PULSE_JOIN_URL } from "@/lib/urls";
import { trackSocialClick } from "@/lib/analytics";
import { useModal } from "@/app/contexts/modal-context";
import { Button } from "@/app/components/ui/button";

export function Footer() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Helper: anchor links must use /#anchor from non-home pages
  const anchor = (hash: string) => isHome ? hash : `/${hash}`;
  
  const texts = {
    cz: {
      tagline: "Lidé jsou to nejcennější. My vám pomůžeme je udržet.",
      product: "Produkt",
      company: "Společnost",
      support: "Podpora & právní",
      bookDemo: "Domluvit demo",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. Všechna práva vyhrazena.`,
      madeWith: "Vytvořeno s",
      inPrague: "v Praze",
    },
    en: {
      tagline: "People are your greatest asset. We help you keep them.",
      product: "Product",
      company: "Company",
      support: "Support & Legal",
      bookDemo: "Book a Demo",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. All rights reserved.`,
      madeWith: "Made with",
      inPrague: "in Prague",
    },
    de: {
      tagline: "Menschen sind Ihr wertvollstes Gut. Wir helfen Ihnen, sie zu halten.",
      product: "Produkt",
      company: "Unternehmen",
      support: "Support & Rechtliches",
      bookDemo: "Demo buchen",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. Alle Rechte vorbehalten.`,
      madeWith: "Erstellt mit",
      inPrague: "in Prag",
    },
  };

  const txt = texts[language] || texts.en;

  const companyInfo = {
    cz: {
      name: "Behavera s.r.o.",
      ico: "IČO: 03525520",
      address: "Křižíkova 148/34, Praha 8",
    },
    en: {
      name: "Behavera s.r.o.",
      ico: "ID: 03525520",
      address: "Křižíkova 148/34, Prague 8, CZ",
    },
    de: {
      name: "Behavera s.r.o.",
      ico: "Reg.-Nr.: 03525520",
      address: "Křižíkova 148/34, Prag 8, CZ",
    },
  };

  const productLinks = {
    cz: [
      { label: "Behavera App", href: ECHO_PULSE_JOIN_URL, external: true },
      { label: "Jak to funguje", href: anchor("#radar") },
      { label: "Ceník", href: anchor("#pricing") },
      { label: "FAQ", href: anchor("#faq") },
    ],
    en: [
      { label: "Behavera App", href: ECHO_PULSE_JOIN_URL, external: true },
      { label: "How it works", href: anchor("#radar") },
      { label: "Pricing", href: anchor("#pricing") },
      { label: "FAQ", href: anchor("#faq") },
    ],
    de: [
      { label: "Behavera App", href: ECHO_PULSE_JOIN_URL, external: true },
      { label: "So funktioniert es", href: anchor("#radar") },
      { label: "Preise", href: anchor("#pricing") },
      { label: "FAQ", href: anchor("#faq") },
    ],
  };

  const companyLinks = {
    cz: [
      { label: "O nás", href: anchor("#about") },
      { label: "Případové studie", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
    en: [
      { label: "About", href: anchor("#about") },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
    de: [
      { label: "Über uns", href: anchor("#about") },
      { label: "Fallstudien", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
  };

  const supportLegalLinks = {
    cz: [
      { label: "Obchodní podmínky", href: "/terms" },
      { label: "Ochrana osobních údajů", href: "/privacy-policy" },
    ],
    en: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
    de: [
      { label: "AGB", href: "/terms" },
      { label: "Datenschutz", href: "/privacy-policy" },
    ],
  };

  const info = companyInfo[language] || companyInfo.en;
  const products = productLinks[language] || productLinks.en;
  const company = companyLinks[language] || companyLinks.en;
  const supportLegal = supportLegalLinks[language] || supportLegalLinks.en;

  // Helper to render links properly (internal vs external vs anchor)
  const renderLink = (item: { label: string; href: string; external?: boolean }) => {
    if (item.external) {
      return (
        <a 
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          {item.label}
          <ArrowUpRight className="w-3 h-3" />
        </a>
      );
    }
    if (item.href.startsWith('#') || item.href.startsWith('/#')) {
      return (
        <a href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
          {item.label}
        </a>
      );
    }
    return (
      <Link to={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
        {item.label}
      </Link>
    );
  };
  
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-default max-w-6xl">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center mb-5">
                <img
                  src="/logo-behavera.png"
                  alt="Behavera"
                  className="h-6 w-auto brightness-0 invert"
                  width={103}
                  height={24}
                />
              </Link>
              
              {/* Tagline */}
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                {txt.tagline}
              </p>

              {/* CTA */}
              <Button 
                onClick={() => openBooking('footer_cta')}
                className="mb-6 rounded h-10 px-6 font-semibold text-sm bg-white text-brand-primary hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {txt.bookDemo}
              </Button>
              
              {/* Social Links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/company/behavera/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSocialClick('linkedin')}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/behavera"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSocialClick('instagram')}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/BehaveraTDC"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSocialClick('facebook')}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {txt.product}
              </h4>
              <ul className="space-y-2.5">
                {products.map((item, i) => (
                  <li key={i}>{renderLink(item)}</li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {txt.company}
              </h4>
              <ul className="space-y-2.5">
                {company.map((item, i) => (
                  <li key={i}>{renderLink(item)}</li>
                ))}
              </ul>
            </div>
            
            {/* Support & Legal + Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {txt.support}
              </h4>
              <ul className="space-y-2.5">
                {supportLegal.map((item, i) => (
                  <li key={i}>{renderLink(item)}</li>
                ))}
              </ul>
              
              {/* Contact info */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <a 
                  href="mailto:hello@behavera.com" 
                  className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  hello@behavera.com
                </a>
                <a 
                  href="tel:+420605839456" 
                  className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +420 605 839 456
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-5 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <span>{txt.copyright}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{info.ico}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>{txt.madeWith}</span>
              <span className="text-red-400">♥</span>
              <span>{txt.inPrague}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
