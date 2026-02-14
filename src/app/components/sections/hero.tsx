import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap, Users, Eye, ShieldAlert, TrendingUp } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero-dashboard-cz.webp";
import heroDashboardEn from "@/assets/hero-dashboard-en.webp";
import { getPulseCheckUrl, PULSE_SCAN_WINDOW_FEATURES, PULSE_SCAN_WINDOW_NAME } from "@/lib/urls";
import { trackPulseCheckOpen } from "@/lib/analytics";

/**
 * Hero — Fathom-inspired with tabbed value pillars
 * 
 * Features:
 * - Tabbed value pillars (Visibility / Prevention / Action) — auto-rotating
 * - Device Stage with MacBook mock
 * - Progressive reveal animation
 * - Consistent CTA language
 */

type ValuePillar = {
  id: string;
  label: string;
  description: string;
  icon: typeof Eye;
};

export function Hero() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const [activePillar, setActivePillar] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const copy = {
    cz: {
      badge: "Zpětná vazba, která funguje",
      headline: <>Zjistěte, co se<br className="hidden md:block" />{' '}ve firmě{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A78BFA]">doopravdy děje</span></>,
      headlineHighlight: "",
      primaryCta: "Domluvit demo",
      ctaMicro: "30 min · Zdarma · Bez závazků",
      secondaryCta: "Vyzkoušet zdarma",
      socialProof: "50 000+ otestovaných lidí",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Výsledky do hodiny" },
        { icon: Zap, text: "Typicky 80 %+ návratnost" },
      ],
      pillars: [
        {
          id: "visibility",
          label: "Viditelnost",
          description: "Okamžitý přehled o náladě v každém týmu. Sledujte trendy, identifikujte problémy dříve než eskalují.",
          icon: Eye,
        },
        {
          id: "prevention",
          label: "Prevence",
          description: "Systém vás upozorní, když něco nesedí — přetížení, napětí v týmu nebo pokles energie. Reagujte včas.",
          icon: ShieldAlert,
        },
        {
          id: "action",
          label: "Akce",
          description: "Nevíte, co řešit první? Echo Pulse řadí problémy podle dopadu na business a rizika odchodu klíčových lidí.",
          icon: TrendingUp,
        },
      ] as ValuePillar[],
    },
    en: {
      badge: "Feedback that actually works",
      headline: "Find out what's really",
      headlineHighlight: "happening in your company",
      primaryCta: "Book a demo",
      ctaMicro: "30 min · Free · No commitment",
      secondaryCta: "Try it free",
      socialProof: "50,000+ people assessed",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Results in 1 hour" },
        { icon: Zap, text: "Typically 80%+ completion" },
      ],
      pillars: [
        {
          id: "visibility",
          label: "Visibility",
          description: "Instant overview of how every team feels. Track trends, spot issues before they escalate.",
          icon: Eye,
        },
        {
          id: "prevention",
          label: "Prevention",
          description: "The system alerts you when something's off — overload, team tension, or a significant energy drop. React in time.",
          icon: ShieldAlert,
        },
        {
          id: "action",
          label: "Action",
          description: "Don't know what to solve first? Echo Pulse ranks problems by business impact and departure risk.",
          icon: TrendingUp,
        },
      ] as ValuePillar[],
    },
    de: {
      badge: "Feedback, das funktioniert",
      headline: "Erfahren Sie, was in Ihrem",
      headlineHighlight: "Unternehmen wirklich passiert",
      primaryCta: "Demo buchen",
      ctaMicro: "30 Min · Kostenlos · Unverbindlich",
      secondaryCta: "Kostenlos testen",
      socialProof: "50.000+ getestete Personen",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Ergebnisse in 1 Stunde" },
        { icon: Zap, text: "Typisch 80 %+ Rücklaufquote" },
      ],
      pillars: [
        {
          id: "visibility",
          label: "Sichtbarkeit",
          description: "Sofortiger Überblick über die Stimmung in jedem Team. Trends verfolgen, Probleme frühzeitig erkennen.",
          icon: Eye,
        },
        {
          id: "prevention",
          label: "Prävention",
          description: "Das System warnt Sie, wenn etwas nicht stimmt — Überlastung, Teamspannungen oder Energieabfall.",
          icon: ShieldAlert,
        },
        {
          id: "action",
          label: "Aktion",
          description: "Wissen Sie nicht, was Sie zuerst lösen sollen? Echo Pulse priorisiert nach Geschäftsauswirkung und Abgangsrisiko.",
          icon: TrendingUp,
        },
      ] as ValuePillar[],
    },
  };

  const c = copy[language] || copy.en;
  const heroImage = language === 'cz'
    ? { src: heroDashboardCz, width: 2400, height: 1456 }
    : { src: heroDashboardEn, width: 2400, height: 1453 };

  // Auto-rotate pillars every 5 seconds
  const nextPillar = useCallback(() => {
    setActivePillar((prev) => (prev + 1) % c.pillars.length);
  }, [c.pillars.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextPillar, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextPillar]);

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

            {/* ── Value Pillars — Fathom-style tabs ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-10"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Pillar tabs */}
              <div className="flex items-center justify-center gap-1 mb-5">
                {c.pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  const isActive = activePillar === idx;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => setActivePillar(idx)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                          : "text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pillar.label}</span>
                      {/* Progress bar for auto-rotation */}
                      {isActive && !isPaused && (
                        <motion.div
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/40 rounded-full origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                          key={`progress-${activePillar}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pillar description */}
              <div className="h-[60px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activePillar}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-lg md:text-xl text-brand-text-body leading-relaxed max-w-xl mx-auto font-normal"
                  >
                    {c.pillars[activePillar].description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center"
            >
              <Button
                onClick={() => openBooking('hero')}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
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
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 rounded-2xl"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {c.secondaryCta}
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
