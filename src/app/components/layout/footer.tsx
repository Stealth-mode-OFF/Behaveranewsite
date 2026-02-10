import { useLanguage } from "@/app/LanguageContext";
import { Link } from "react-router-dom";
import { Phone, Linkedin, Facebook, Instagram, Mail, ArrowUpRight, Zap } from "lucide-react";
import { ACCOUNT_SETUP_URL, ECHO_PULSE_JOIN_URL } from "@/lib/urls";
import { trackSocialClick, trackExternalLink } from "@/lib/analytics";

export function Footer() {
  const { language } = useLanguage();
  
  const texts = {
    cz: {
      tagline: "Lidé jsou to nejcennější. My vám pomůžeme je udržet.",
      product: "Produkt",
      company: "Společnost",
      resources: "Zdroje",
      legal: "Právní",
      newsletter: "Newsletter",
      newsletterDesc: "Tipy pro HR a people analytics přímo do schránky.",
      emailPlaceholder: "váš@email.cz",
      subscribe: "Odebírat",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. Všechna práva vyhrazena.`,
      madeWith: "Vytvořeno s",
      inPrague: "v Praze",
    },
    en: {
      tagline: "People are your greatest asset. We help you keep them.",
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      newsletter: "Newsletter",
      newsletterDesc: "HR tips and people analytics insights to your inbox.",
      emailPlaceholder: "your@email.com",
      subscribe: "Subscribe",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. All rights reserved.`,
      madeWith: "Made with",
      inPrague: "in Prague",
    },
    de: {
      tagline: "Menschen sind Ihr wertvollstes Gut. Wir helfen Ihnen, sie zu halten.",
      product: "Produkt",
      company: "Unternehmen",
      resources: "Ressourcen",
      legal: "Rechtliches",
      newsletter: "Newsletter",
      newsletterDesc: "HR-Tipps und People-Analytics-Insights in Ihrem Posteingang.",
      emailPlaceholder: "ihre@email.de",
      subscribe: "Abonnieren",
      copyright: `© ${new Date().getFullYear()} Behavera s.r.o. Alle Rechte vorbehalten.`,
      madeWith: "Erstellt mit",
      inPrague: "in Prag",
    },
  };

  const txt = texts[language] || texts.en;

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

	  const productLinks = {
	    cz: [
	      { label: "Echo Pulse App", href: ECHO_PULSE_JOIN_URL, external: true },
	      { label: "Nastavení účtu", href: ACCOUNT_SETUP_URL, external: true },
	      { label: "Pricing", href: "#pricing" },
	      { label: "ROI Kalkulačka", href: "#roi" },
	    ],
	    en: [
	      { label: "Echo Pulse App", href: ECHO_PULSE_JOIN_URL, external: true },
	      { label: "Account Setup", href: ACCOUNT_SETUP_URL, external: true },
	      { label: "Pricing", href: "#pricing" },
	      { label: "ROI Calculator", href: "#roi" },
	    ],
	    de: [
	      { label: "Echo Pulse App", href: ECHO_PULSE_JOIN_URL, external: true },
	      { label: "Konto einrichten", href: ACCOUNT_SETUP_URL, external: true },
	      { label: "Preise", href: "#pricing" },
	      { label: "ROI-Rechner", href: "#roi" },
	    ],
	  };

  const companyLinks = {
    cz: [
      { label: "O nás", href: "/team" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
    en: [
      { label: "About", href: "/team" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
    de: [
      { label: "Über uns", href: "/team" },
      { label: "Fallstudien", href: "#case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
  };

  const resourceLinks = {
    cz: [
      { label: "Vědecký základ", href: "/research" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "FAQ", href: "#faq" },
    ],
    en: [
      { label: "Research", href: "/research" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "FAQ", href: "#faq" },
    ],
    de: [
      { label: "Wissenschaft", href: "/research" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "FAQ", href: "#faq" },
    ],
  };

  const legalLinks = {
    cz: [
      { label: "Obchodní podmínky", href: "/terms" },
      { label: "Ochrana osobních údajů", href: "/terms#privacy" },
      { label: "Cookies", href: "/terms#cookies" },
    ],
    en: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/terms#privacy" },
      { label: "Cookie Policy", href: "/terms#cookies" },
    ],
    de: [
      { label: "AGB", href: "/terms" },
      { label: "Datenschutz", href: "/terms#privacy" },
      { label: "Cookie-Richtlinie", href: "/terms#cookies" },
    ],
  };

  const info = companyInfo[language] || companyInfo.en;
  const products = productLinks[language] || productLinks.en;
  const company = companyLinks[language] || companyLinks.en;
  const resources = resourceLinks[language] || resourceLinks.en;
  const legal = legalLinks[language] || legalLinks.en;

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
    if (item.href.startsWith('#')) {
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-accent" />
                </div>
                <span className="text-lg font-bold tracking-tight">Echo Pulse</span>
              </Link>
              
              {/* Tagline */}
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                {txt.tagline}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/company/behavera/posts/?feedView=all"
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
            
            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {txt.resources}
              </h4>
              <ul className="space-y-2.5">
                {resources.map((item, i) => (
                  <li key={i}>{renderLink(item)}</li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {txt.legal}
              </h4>
              <ul className="space-y-2.5">
                {legal.map((item, i) => (
                  <li key={i}>{renderLink(item)}</li>
                ))}
              </ul>
              
              {/* Contact info under legal */}
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
