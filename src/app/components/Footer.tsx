import React from "react";
import { useLanguage } from "../LanguageContext";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const { t, language } = useLanguage();
  const linkTargets = ["#solutions", "#pricing", "#about", "#lead-capture"];
  
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/behavera", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/behavera", label: "Twitter" },
  ];

  const legalLinks = {
    cz: [
      { label: "Podmínky služby", href: "/terms" },
      { label: "Ochrana osobních údajů", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
    en: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
    de: [
      { label: "AGB", href: "/terms" },
      { label: "Datenschutz", href: "/terms#privacy" },
      { label: "Trust Center", href: "/terms#trust" },
    ],
  };

  const currentLegalLinks = legalLinks[language] || legalLinks.en;

  const companyInfo = {
    cz: {
      name: "Behavera s.r.o.",
      address: "Křižíkova 148/34, Karlín, 186 00 Praha 8",
      ico: "IČO: 19060369",
      email: "hello@echopulse.cz",
    },
    en: {
      name: "Behavera s.r.o.",
      address: "Křižíkova 148/34, Karlín, 186 00 Prague 8, Czech Republic",
      ico: "Company ID: 19060369",
      email: "hello@echopulse.cz",
    },
    de: {
      name: "Behavera s.r.o.",
      address: "Křižíkova 148/34, Karlín, 186 00 Prag 8, Tschechien",
      ico: "Handelsregister-Nr.: 19060369",
      email: "hello@echopulse.cz",
    },
  };

  const info = companyInfo[language] || companyInfo.en;
  
  return (
    <footer className="relative bg-gradient-to-b from-brand-background-secondary to-brand-background-muted/30 border-t border-brand-border py-16 md:py-20 lg:py-24 text-sm overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/3 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/3 rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container-default relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand column */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="font-bold text-xl text-brand-text-primary tracking-tight">Echo Pulse</span>
            </motion.div>
            <p className="text-brand-text-secondary max-w-sm mb-6 leading-relaxed">
              AI-powered behavioral intelligence for proactive team management. Predict issues before they escalate.
            </p>
            
            {/* Company info */}
            <div className="text-sm text-brand-text-muted space-y-1 mb-6">
              <p className="font-medium text-brand-text-secondary">{info.name}</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{info.address}</span>
              </div>
              <p>{info.ico}</p>
            </div>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/30 hover:shadow-md transition-all duration-300"
                  aria-label={social.label}
                  whileHover={{ y: -2 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Links column */}
          <div>
            <h4 className="font-bold text-brand-text-primary mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {t.footer.links.map((link, i) => (
                <li key={i}>
                  <a 
                    href={linkTargets[i] || "#"} 
                    className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-brand-primary transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <Link 
                  to="/blog" 
                  className="text-brand-text-secondary hover:text-brand-primary transition-colors font-medium inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-brand-primary transition-all duration-300" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h4 className="font-bold text-brand-text-primary mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <a 
              href={`mailto:${info.email}`}
              className="inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors font-medium mb-3"
            >
              <Mail className="w-4 h-4" />
              {info.email}
            </a>
            <a 
              href="tel:+420605839456" 
              className="inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors font-medium mb-6"
            >
              <Phone className="w-4 h-4" />
              +420 605 839 456
            </a>
            
            {/* Legal links */}
            <div className="mt-6 pt-6 border-t border-brand-border">
              <h4 className="font-bold text-brand-text-primary mb-3 text-xs uppercase tracking-wider">Legal</h4>
              {currentLegalLinks.map((item, i) => (
                <Link 
                  key={i} 
                  to={item.href} 
                  className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors block mb-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-brand-text-muted text-sm">
            © {new Date().getFullYear()} {info.name} {t.footer.rights.replace(/Behavera s\.r\.o\.\s*/i, '')}
          </p>
          <p className="text-brand-text-muted text-xs">
            Crafted with precision in Prague 🇨🇿
          </p>
        </div>
      </div>
    </footer>
  );
}
