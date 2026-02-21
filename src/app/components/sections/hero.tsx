import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap, Users } from "lucide-react";
import { useModal } from "@/app/contexts/modal-context";
import { useLanguage } from "@/app/contexts/language-context";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero/hero-dashboard-cz.webp";
import heroDashboardEn from "@/assets/hero/hero-dashboard-en.webp";

/**
 * Hero — Sharp, conversion-focused with rotating headline.
 *
 * Three rotating headlines targeted at CEO & HR.
 * Only the h1 rotates — subtitle, CTAs, trust line stay fixed.
 * Auto-advances every 5s with manual dot navigation.
 */

/* ─── Carousel headline type ─── */
interface HeroHeadline {
  text: React.ReactNode;
  highlight: string;
}

export function Hero() {
  const { language } = useLanguage();
  const { openBooking } = useModal();

  const copy = {
    cz: {
      badge: "Pro CEO a HR, kteří nechtějí hádat",
      headlines: [
        {
          text: <>Vaši nejlepší lidé<br className="hidden md:block" />{' '}přemýšlejí o odchodu.{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">Vy to nevíte.</span></>,
          highlight: "",
        },
        {
          text: <>Kde se ztrácí výkon<br className="hidden md:block" />{' '}a vzniká tření{' '}</>,
          highlight: "mezi vašimi týmy?",
        },
        {
          text: <>Tichá demotivace stojí víc<br className="hidden md:block" />{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">než hlasitý odchod.</span></>,
          highlight: "",
        },
      ] as HeroHeadline[],
      subtitle: "Krátký AI pulse, který zachytí, kde se ztrácí výkon, kde vzniká tření mezi týmy, kde hrozí tichá demotivace — a co má vedení udělat jako první.",
      primaryCta: "Otestovat 1 tým zdarma",
      ctaMicro: "Bez kreditní karty · Bez závazku · Výsledky ihned",
      secondaryCta: "Rezervovat demo",
      proofLine: "Používá Prusa Research (1 000+ zaměstnanců), Expando, Valxon a dalších 40+ firem.",
      socialProof: "50 000+ otestovaných lidí",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Výsledky okamžitě v dashboardu" },
        { icon: Zap, text: "Pro firmy 50–500 lidí" },
      ],
    },
    en: {
      badge: "For CEOs and HR who refuse to guess",
      headlines: [
        {
          text: "Your best people are",
          highlight: "thinking about leaving.",
        },
        {
          text: <>Where performance drops<br className="hidden md:block" />{' '}and friction builds{' '}</>,
          highlight: "between your teams?",
        },
        {
          text: <>Silent demotivation costs more<br className="hidden md:block" />{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">than a loud resignation.</span></>,
          highlight: "",
        },
      ] as HeroHeadline[],
      subtitle: "A short AI pulse that catches where performance is slipping, where friction builds between teams, where quiet demotivation lurks — and what leadership should tackle first.",
      primaryCta: "Test 1 team for free",
      ctaMicro: "No credit card · No commitment · Results are instant",
      secondaryCta: "Book a demo",
      proofLine: "Trusted by Prusa Research (1,000+ employees), Expando, Valxon, and 40+ more companies.",
      socialProof: "50,000+ people assessed",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Instant results in dashboard" },
        { icon: Zap, text: "For companies 50–500 people" },
      ],
    },
    de: {
      badge: "Für CEOs und HR, die nicht raten wollen",
      headlines: [
        {
          text: "Ihre besten Leute denken",
          highlight: "über einen Wechsel nach.",
        },
        {
          text: <>Wo Leistung verloren geht<br className="hidden md:block" />{' '}und Reibung entsteht{' '}</>,
          highlight: "zwischen Ihren Teams?",
        },
        {
          text: <>Stille Demotivation kostet mehr<br className="hidden md:block" />{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">als eine laute Kündigung.</span></>,
          highlight: "",
        },
      ] as HeroHeadline[],
      subtitle: "Ein kurzer AI-Pulse, der erkennt, wo Leistung sinkt, wo Reibung zwischen Teams entsteht, wo stille Demotivation droht — und was die Führung zuerst tun sollte.",
      primaryCta: "1 Team kostenlos testen",
      ctaMicro: "Keine Kreditkarte · Unverbindlich · Ergebnisse sofort",
      secondaryCta: "Demo buchen",
      proofLine: "Vertraut von Prusa Research (1.000+ MA), Expando, Valxon und 40+ weiteren Unternehmen.",
      socialProof: "50.000+ getestete Personen",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Ergebnisse sofort im Dashboard" },
        { icon: Zap, text: "Für Unternehmen 50–500 MA" },
      ],
    },
  };

  const c = copy[language] || copy.en;

  /* ─── Carousel state — only headlines rotate ─── */
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const slideCount = c.headlines.length;

  const goToSlide = useCallback((index: number) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }, [activeSlide]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount]);

  const headline = c.headlines[activeSlide];
  const heroImage = language === 'cz'
    ? { src: heroDashboardCz, width: 2400, height: 1456 }
    : { src: heroDashboardEn, width: 2400, height: 1453 };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-background-secondary via-white to-brand-background-secondary -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[15%] w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-default relative z-10">
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

            {/* Rotating headline — only h1 changes, rest stays static */}
            <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col justify-start mb-6">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h1
                  key={activeSlide}
                  custom={direction}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-h1 text-brand-text-primary"
                >
                  {headline.text}
                  {headline.highlight && <br />}
                  {headline.highlight && (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">
                      {headline.highlight}
                    </span>
                  )}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Static subtitle */}
            <p className="text-base md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto mb-4">
              {c.subtitle}
            </p>

            {/* Carousel dots */}
            <div className="flex items-center justify-center gap-2 mb-10 mt-2">
              {c.headlines.map((_: HeroHeadline, idx: number) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Headline ${idx + 1}`}
                  className="group relative p-1"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? "w-8 h-2 bg-brand-primary"
                        : "w-2 h-2 bg-brand-primary/25 group-hover:bg-brand-primary/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center"
            >
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all">
                <a href="https://app.behavera.com/echo-pulse/try" target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  {c.primaryCta}
                </a>
              </Button>
              
              <Button
                onClick={() => openBooking('hero')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
              >
                {c.secondaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Micro-copy + Trust */}
            <p className="text-xs text-brand-text-muted mb-3">{c.ctaMicro}</p>
            <p className="text-xs font-medium text-brand-text-muted/80 mb-6">{c.proofLine}</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center"
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
                imageAlt={language === 'cz' ? "Behavera Dashboard - Rizikové signály a týmová analytika" : language === 'de' ? "Behavera Dashboard - Risikosignale und Team-Analytics" : "Behavera Dashboard - Risk signals and team analytics"}
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
