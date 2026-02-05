import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Link } from "react-router-dom";
import { Phone, MapPin, Linkedin, Github, ExternalLink, Mail, ArrowUpRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const { t, language } = useLanguage();
  const linkTargets = ["#solutions", "#pricing", "#about", "#lead-capture"];
  
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
      { label: "Echo Pulse App", href: "https://app.behavera.com/echo-pulse/join", external: true },
      { label: "Nastavení účtu", href: "https://app.behavera.com/setup/", external: true },
      { label: "Pricing", href: "#pricing" },
      { label: "ROI Kalkulačka", href: "#roi" },
    ],
    en: [
      { label: "Echo Pulse App", href: "https://app.behavera.com/echo-pulse/join", external: true },
      { label: "Account Setup", href: "https://app.behavera.com/setup/", external: true },
      { label: "Pricing", href: "#pricing" },
      { label: "ROI Calculator", href: "#roi" },
    ],
    de: [
      { label: "Echo Pulse App", href: "https://app.behavera.com/echo-pulse/join", external: true },
      { label: "Konto einrichten", href: "https://app.behavera.com/setup/", external: true },
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
      { label: "Výzkum", href: "/research" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "FAQ", href: "#faq" },
    ],
    en: [
      { label: "Research", href: "/research" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "FAQ", href: "#faq" },
    ],
    de: [
      { label: "Forschung", href: "/research" },
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
  
  return (
    <footer className="bg-brand-primary text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.1)_0%,transparent_50%)]" />
      
      <div className="container-default relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Zap className="w-5 h-5 text-brand-accent" />
                </div>
                <span className="text-xl font-bold tracking-tight">Echo Pulse</span>
              </div>
              
              {/* Tagline */}
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-sm">
                {txt.tagline}
              </p>
              
              {/* Contact */}
              <div className="space-y-3 mb-8">
                <a 
                  href="tel:+420605839456" 
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">+420 605 839 456</span>
                </a>
                <a 
                  href="mailto:hello@behavera.com" 
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-medium">hello@behavera.com</span>
                </a>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{info.address}</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/company/behavera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 hover:border-white/20"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/behavera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 hover:border-white/20"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Links Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {/* Product */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                    {txt.product}
                  </h4>
                  <ul className="space-y-3">
                    {products.map((item, i) => (
                      <li key={i}>
                        {item.external ? (
                          <a 
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white transition-colors flex items-center gap-1 group"
                          >
                            {item.label}
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                          </a>
                        ) : (
                          <a href={item.href} className="text-white/80 hover:text-white transition-colors">
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Company */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                    {txt.company}
                  </h4>
                  <ul className="space-y-3">
                    {company.map((item, i) => (
                      <li key={i}>
                        <Link to={item.href} className="text-white/80 hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Resources */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                    {txt.resources}
                  </h4>
                  <ul className="space-y-3">
                    {resources.map((item, i) => (
                      <li key={i}>
                        <Link to={item.href} className="text-white/80 hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Legal */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-5">
                    {txt.legal}
                  </h4>
                  <ul className="space-y-3">
                    {legal.map((item, i) => (
                      <li key={i}>
                        <Link to={item.href} className="text-white/80 hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span>{txt.copyright}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span>{txt.madeWith}</span>
              <span className="text-red-400">♥</span>
              <span>{txt.inPrague}</span>
              <span className="mx-2">•</span>
              <span className="text-white/70 font-medium">{info.ico}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
