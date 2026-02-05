import React from "react";
import { useLanguage } from "../LanguageContext";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const { t } = useLanguage();
  const linkTargets = ["#solutions", "#pricing", "#about", "#lead-capture"];
  const legalTargets = ["#legal", "#legal"];
  
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/echopulse", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/echopulse", label: "Twitter" },
    { icon: Github, href: "https://github.com/behavera/echo-pulse", label: "GitHub" },
  ];
  
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
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h4 className="font-bold text-brand-text-primary mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <a 
              href="mailto:hello@echopulse.cz" 
              className="inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors font-medium mb-6"
            >
              <Mail className="w-4 h-4" />
              hello@echopulse.cz
            </a>
            
            <div className="mt-6 pt-6 border-t border-brand-border">
              {t.footer.legal.map((item, i) => {
                const isTerms = item === "Terms" || item === "Podmínky" || item === "AGB";
                if (isTerms) {
                  return (
                    <Link key={i} to="/terms" className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors block mb-2">
                      {item}
                    </Link>
                  );
                }
                return (
                  <a key={i} href={legalTargets[i] || "#legal"} className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors block mb-2">
                    {item}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-brand-text-muted text-sm">
            {t.footer.rights}
          </p>
          <p className="text-brand-text-muted text-xs">
            Crafted with precision in Prague 🇨🇿
          </p>
        </div>
      </div>
    </footer>
  );
}
