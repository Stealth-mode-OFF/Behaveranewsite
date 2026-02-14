import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap, Users } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero-dashboard-cz.webp";
import heroDashboardEn from "@/assets/hero-dashboard-en.webp";

/**
 * Hero — Sharp, conversion-focused.
 *
 * One painful headline → one concrete subtitle → dual CTA → trust line.
 * No rotating tabs. Minimal cognitive load. CEO lands and decides.
 */

export function Hero() {
  const { language } = useLanguage();
  const { openBooking, openDemo } = useModal();

  const copy = {
    cz: {
      badge: "Pro CEO a HR, kteří nechtějí hádat",
      headline: <>Vaši nejlepší lidé<br className="hidden md:block" />{' '}přemýšlejí o odchodu.{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A78BFA]">Vy to nevíte.</span></>,
      headlineHighlight: "",
      subtitle: "Echo Pulse sbírá zpětnou vazbu přes krátký AI chat jednou měsíčně. Výsledky vidíte okamžitě v dashboardu — podle týmů, témat i rizik. Přestaňte hádat. Začněte vědět.",
      primaryCta: "Vyzkouším sám",
      ctaMicro: "2 minuty · Zdarma · Bez závazků",
      secondaryCta: "Rezervovat demo",
      socialProof: "50 000+ otestovaných lidí",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Výsledky okamžitě v dashboardu" },
        { icon: Zap, text: "80 %+ návratnost · firmy 50–500 lidí" },
      ],
    },
    en: {
      badge: "For CEOs and HR who refuse to guess",
      headline: "Your best people are",
      headlineHighlight: "thinking about leaving.",
      subtitle: "Echo Pulse collects feedback through a short AI chat once a month. Results appear instantly in your dashboard — by team, topic, and risk. Stop guessing. Start knowing.",
      primaryCta: "Try it yourself",
      ctaMicro: "2 minutes · Free · No commitment",
      secondaryCta: "Book a demo",
      socialProof: "50,000+ people assessed",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Instant results in dashboard" },
        { icon: Zap, text: "80%+ completion · companies 50–500 people" },
      ],
    },
    de: {
      badge: "Für CEOs und HR, die nicht raten wollen",
      headline: "Ihre besten Leute denken",
      headlineHighlight: "über einen Wechsel nach.",
      subtitle: "Echo Pulse sammelt Feedback über einen kurzen AI-Chat einmal im Monat. Ergebnisse erscheinen sofort in Ihrem Dashboard — nach Team, Thema und Risiko. Hören Sie auf zu raten.",
      primaryCta: "Selbst testen",
      ctaMicro: "2 Min · Kostenlos · Unverbindlich",
      secondaryCta: "Demo buchen",
      socialProof: "50.000+ getestete Personen",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Ergebnisse sofort im Dashboard" },
        { icon: Zap, text: "80 %+ Rücklaufquote · Firmen 50–500 MA" },
      ],
    },
  };

  const c = copy[language] || copy.en;
  const heroImage = language === 'cz'
    ? { src: heroDashboardCz, width: 2400, height: 1456 }
    : { src: heroDashboardEn, width: 2400, height: 1453 };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-brand-background-secondary -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[15%] w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-default mx-auto relative z-10">
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

            {/* Subtitle — one concrete paragraph, no tabs */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto mb-10"
            >
              {c.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center"
            >
              <Button
                onClick={() => openDemo('hero')}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {c.primaryCta}
              </Button>
              
              <Button
                onClick={() => openBooking('hero')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 rounded-2xl"
              >
                {c.secondaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Micro-copy + Trust */}
            <p className="text-xs text-brand-text-muted mb-6">{c.ctaMicro}</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 justify-center"
            >
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
