import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap, Users } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero-dashboard-cz.webp";
import heroDashboardEn from "@/assets/hero-dashboard-en.webp";
import { getPulseCheckUrl, PULSE_SCAN_WINDOW_FEATURES, PULSE_SCAN_WINDOW_NAME } from "@/lib/urls";
import { trackPulseCheckOpen } from "@/lib/analytics";

/**
 * Hero - iPad Pro Level Design
 * 
 * Features:
 * - Device Stage with MacBook mock
 * - iPhone notification companion
 * - Animated dashboard elements
 * - Progressive reveal animation
 * - Outcome-focused copy
 */
export function Hero() {
  const { language } = useLanguage();
  const { openBooking } = useModal();

  const copy = {
    cz: {
      badge: "Zpětná vazba, která funguje",
      headline: <>Zjistěte, co se<br className="hidden md:block" />{' '}ve firmě{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A78BFA]">doopravdy děje</span></>,
      headlineHighlight: "",
      subheadline: <>Lidé neodcházejí ze dne na den. Rozhodují se měsíce.<br className="hidden sm:block" />Echo Pulse vám dá čas reagovat — abyste to věděli včas.</>,
      primaryCta: "Domluvit demo",
      ctaMicro: "30 min · Zdarma · Bez závazků",
      secondaryCta: "Vyzkoušet zdarma",
      socialProof: "50 000+ nasbíraných odpovědí",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Výsledky do hodiny" },
        { icon: Zap, text: "Typicky 80 %+ návratnost" },
      ],
    },
    en: {
      badge: "Feedback that actually works",
      headline: "Find out what's really",
      headlineHighlight: "happening in your company",
      subheadline: "People don't quit overnight. They decide over months. Echo Pulse gives you time to react — so you know before it's too late.",
      primaryCta: "Book a demo",
      ctaMicro: "30 min · Free · No commitment",
      secondaryCta: "Try it free",
      socialProof: "50,000+ responses collected",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Results in 1 hour" },
        { icon: Zap, text: "Typically 80%+ completion" },
      ],
    },
    de: {
      badge: "Feedback, das funktioniert",
      headline: "Erfahren Sie, was in Ihrem",
      headlineHighlight: "Unternehmen wirklich passiert",
      subheadline: "Mitarbeiter kündigen nicht über Nacht. Sie entscheiden sich über Monate. Echo Pulse gibt Ihnen Zeit zu reagieren — damit Sie es rechtzeitig wissen.",
      primaryCta: "Demo buchen",
      ctaMicro: "30 Min · Kostenlos · Unverbindlich",
      secondaryCta: "Kostenlos testen",
      socialProof: "50.000+ gesammelte Antworten",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Ergebnisse in 1 Stunde" },
        { icon: Zap, text: "Typisch 80 %+ Rücklaufquote" },
      ],
    },
  };

  const c = copy[language] || copy.en;
  const heroImage = language === 'cz'
    ? { src: heroDashboardCz, width: 2400, height: 1456 }
    : { src: heroDashboardEn, width: 2400, height: 1453 };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background - Subtle gradient with grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-brand-background-secondary -z-20" />
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[15%] w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-default mx-auto relative z-10">
        {/* Content - Stacked Layout for Maximum Device Impact */}
        <div className="flex flex-col items-center gap-12 lg:gap-16">
          
          {/* Top: Copy - Centered */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-border shadow-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-brand-text-muted">
                {c.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-[-0.03em] text-brand-text-primary leading-[1.05] mb-6 font-display"
            >
              {c.headline}
              {c.headlineHighlight && <br />}
              {c.headlineHighlight && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">
                  {c.headlineHighlight}
                </span>
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg md:text-xl text-brand-text-body leading-relaxed mb-10 max-w-xl mx-auto font-normal"
            >
              {c.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12 justify-center"
            >
              <Button
                onClick={() => openBooking('hero')}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
              >
                {c.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => {
                  const tryLink = getPulseCheckUrl(language);
                  window.open(tryLink, PULSE_SCAN_WINDOW_NAME, PULSE_SCAN_WINDOW_FEATURES);
                  trackPulseCheckOpen('hero', language);
                }}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {c.secondaryCta}
              </Button>
            </motion.div>

            {/* Micro-copy under CTA */}
            <p className="text-xs text-brand-text-muted mb-8">{c.ctaMicro}</p>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 justify-center"
            >
              {/* Social proof stat */}
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                <Users className="w-4 h-4" />
                <span>{c.socialProof}</span>
              </div>
              <span className="hidden sm:inline text-brand-border">|</span>
              {c.trust.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <item.icon className="w-4 h-4 text-brand-primary/70" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom: Device Stage - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <DeviceFrame type="macbook" className="w-full max-w-[500px] sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1200px] mx-auto">
              <AnimatedDashboardContent 
                imageSrc={heroImage.src} 
                imageAlt="Echo Pulse Dashboard - Risk signály a team analytics"
                width={heroImage.width}
                height={heroImage.height}
                fetchPriority="high"
              />
            </DeviceFrame>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
