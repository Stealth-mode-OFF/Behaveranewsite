import { motion } from "framer-motion";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { getPulseCheckUrl, PULSE_SCAN_WINDOW_FEATURES, PULSE_SCAN_WINDOW_NAME } from "@/lib/urls";
import { trackPulseCheckOpen } from "@/lib/analytics";

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

  const copy = {
    cz: {
      badge: "Připraveni?",
      headline: "Vaši lidé vám chtějí něco říct.",
      headlineHighlight: "Slyšíte je?",
      subheadline: "30 minut stačí, abyste zjistili, jestli Echo Pulse dává smysl pro vaši firmu.",
      primaryCta: "Domluvit demo",
      demoCta: "Nebo si nejdřív vyzkoušejte Pulse Check zdarma →",
      trust: ["Bez kreditky", "GDPR ready", "Výsledky do hodiny"],
    },
    en: {
      badge: "Ready?",
      headline: "Your people want to tell you something.",
      headlineHighlight: "Are you listening?",
      subheadline: "30 minutes is all it takes to find out if Echo Pulse makes sense for your company.",
      primaryCta: "Book a demo",
      demoCta: "Or try a free Pulse Check first →",
      trust: ["No credit card", "GDPR ready", "Results in 1 hour"],
    },
    de: {
      badge: "Bereit zu starten?",
      headline: "Ihre Mitarbeiter sprechen.",
      headlineHighlight: "Hören Sie zu?",
      subheadline: "Erhalten Sie klare Signale von Ihrem Team. Ohne anonyme Umfragen, die niemand liest.",
      primaryCta: "Demo buchen",
      demoCta: "Oder sehen Sie sich zuerst die 3-Min-Demo an →",
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center justify-center gap-4 mb-12"
          >
            <Button 
              onClick={() => openBooking('cta_section')}
              size="lg"
              className="min-w-[240px] h-14 px-8 bg-white text-brand-primary font-semibold text-base hover:bg-white/90 transition-all shadow-2xl shadow-white/10 hover:shadow-white/20"
            >
              {c.primaryCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <button
              type="button"
              onClick={() => {
                const tryLink = getPulseCheckUrl(language);
                window.open(tryLink, PULSE_SCAN_WINDOW_NAME, PULSE_SCAN_WINDOW_FEATURES);
                trackPulseCheckOpen('cta_section', language);
              }}
              className="text-white/70 hover:text-white underline underline-offset-4 transition-colors"
            >
              {c.demoCta}
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
