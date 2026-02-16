import { motion } from "framer-motion";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { useNavigate } from "react-router-dom";

/**
 * CTA Section - Full-width Dark Premium Design
 * 
 * Features:
 * - Full viewport height on desktop
 * - Animated gradient background
 * - Large centered headline
 * - Trust indicators inline
 * - Premium "final word" feel
 */
export function CtaSection() {
  const { openBooking } = useModal();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const copy = {
    cz: {
      badge: "Připraveni?",
      headline: "Spusťte Echo Pulse.",
      headlineHighlight: "A přestaňte hádat, co se ve firmě děje.",
      subheadline: "Buď si to bezpečně otestujete na jednom týmu, nebo to rovnou spustíte ve firmě.",
      primaryCta: "Otestovat na 1 týmu zdarma",
      primaryMicro: "Bez závazku. Výsledky jsou vidět okamžitě.",
      secondaryCta: "Objednat pro firmu",
      secondaryMicro: "Karta nebo faktura. Bez smlouvy.",
      demoLink: "Chci si to nejdřív projít na demu",
      trust: ["Bez kreditky", "GDPR ready", "Výsledky okamžitě"],
    },
    en: {
      badge: "Ready?",
      headline: "Launch Echo Pulse.",
      headlineHighlight: "And stop guessing what's happening in your company.",
      subheadline: "Either safely test it with one team, or launch it across your company right away.",
      primaryCta: "Test 1 team for free",
      primaryMicro: "No commitment. Results are instant.",
      secondaryCta: "Order for company",
      secondaryMicro: "Card or invoice. No contract.",
      demoLink: "I'd like to see a demo first",
      trust: ["No credit card", "GDPR ready", "Instant results"],
    },
    de: {
      badge: "Bereit?",
      headline: "Starten Sie Echo Pulse.",
      headlineHighlight: "Und hören Sie auf zu raten, was im Unternehmen passiert.",
      subheadline: "Testen Sie es sicher mit einem Team oder starten Sie direkt im ganzen Unternehmen.",
      primaryCta: "1 Team kostenlos testen",
      primaryMicro: "Unverbindlich. Ergebnisse sofort sichtbar.",
      secondaryCta: "Für das Unternehmen bestellen",
      secondaryMicro: "Karte oder Rechnung. Ohne Vertrag.",
      demoLink: "Ich möchte zuerst eine Demo sehen",
      trust: ["Keine Kreditkarte", "DSGVO-konform", "Sofortige Ergebnisse"],
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
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              {c.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
          >
            {c.headline}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent/60">
              {c.headlineHighlight}
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {c.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center justify-center gap-6 mb-12"
          >
            {/* Two buttons row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary CTA */}
              <a
                href="https://app.behavera.com/echo-pulse/try"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-w-[240px] h-14 px-8 rounded-[var(--button-radius)] bg-white text-brand-primary font-semibold text-base hover:bg-white/90 transition-all shadow-2xl shadow-white/10 hover:shadow-white/20 w-full sm:w-auto"
              >
                {c.primaryCta}
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Secondary CTA */}
              <a
                href="https://www.echopulse.cz/start"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-w-[220px] h-14 px-8 rounded-[var(--button-radius)] bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all w-full sm:w-auto"
              >
                {c.secondaryCta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Microcopy row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <span className="text-xs text-white/50">{c.primaryMicro}</span>
              <span className="text-xs text-white/50">{c.secondaryMicro}</span>
            </div>

            {/* Demo link */}
            <button
              type="button"
              onClick={() => openBooking('cta_section')}
              className="text-sm text-white/60 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60 transition-colors cursor-pointer"
            >
              {c.demoLink}
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
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
