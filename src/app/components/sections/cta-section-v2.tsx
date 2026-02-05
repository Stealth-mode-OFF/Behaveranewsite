import React from "react";
import { motion } from "framer-motion";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Sparkles, Shield, Clock, Check } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

/**
 * CTA Section V2 - Full-width Dark Premium Design
 * 
 * Features:
 * - Full viewport height on desktop
 * - Animated gradient background
 * - Large centered headline
 * - Trust indicators inline
 * - Premium "final word" feel
 */
export function CtaSectionV2() {
  const { openBooking, openVideo } = useModal();
  const { t, language } = useLanguage();

  const copy = {
    cz: {
      badge: "Připraveni začít?",
      headline: "Vaši lidé mluví.",
      headlineHighlight: "Slyšíte je?",
      subheadline: "Získejte jasný signál z vašeho týmu. Bez anonymních dotazníků, které nikdo nečte.",
      primaryCta: "Začít zdarma",
      secondaryCta: "Konzultace",
      demoCta: "Přehrát demo",
      trust: ["30denní trial", "Bez kreditky", "GDPR ready"],
    },
    en: {
      badge: "Ready to start?",
      headline: "Your people are talking.",
      headlineHighlight: "Are you listening?",
      subheadline: "Get clear signals from your team. Without anonymous surveys nobody reads.",
      primaryCta: "Start free",
      secondaryCta: "Book a call",
      demoCta: "Watch demo",
      trust: ["30-day trial", "No credit card", "GDPR ready"],
    },
    de: {
      badge: "Bereit zu starten?",
      headline: "Ihre Mitarbeiter sprechen.",
      headlineHighlight: "Hören Sie zu?",
      subheadline: "Erhalten Sie klare Signale von Ihrem Team. Ohne anonyme Umfragen, die niemand liest.",
      primaryCta: "Kostenlos starten",
      secondaryCta: "Gespräch buchen",
      demoCta: "Demo ansehen",
      trust: ["30 Tage Test", "Keine Kreditkarte", "DSGVO-konform"],
    },
  };

  const c = copy[language] || copy.en;

  return (
    <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-primary via-[#1a0a3e] to-[#0d0520]">
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large glow orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px]"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-default relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-10"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-semibold text-white">
              {c.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
          >
            {c.headline}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-violet-400 to-brand-accent">
              {c.headlineHighlight}
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {c.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            {/* Primary CTA */}
            <a
              href="https://app.behavera.com/echo-pulse/join"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[220px] h-14 px-8 rounded-xl bg-white text-brand-primary font-semibold text-base hover:bg-white/90 transition-all shadow-2xl shadow-white/10 hover:shadow-white/20"
            >
              {c.primaryCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            
            {/* Secondary CTA */}
            <Button 
              onClick={openBooking}
              variant="outline"
              size="lg"
              className="min-w-[180px] h-14 border-white/30 hover:border-white/50 text-white hover:bg-white/10 rounded-xl"
            >
              {c.secondaryCta}
            </Button>
            
            {/* Demo CTA */}
            <Button 
              onClick={openVideo}
              variant="ghost"
              size="lg"
              className="h-14 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {c.demoCta}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-white/60"
          >
            {c.trust.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-brand-accent" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}
