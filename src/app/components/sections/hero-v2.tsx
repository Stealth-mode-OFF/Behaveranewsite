import React from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero-dashboard-cz.png";
import heroDashboardEn from "@/assets/hero-dashboard-en.png";

/**
 * Hero V2 - iPad Pro Level Design
 * 
 * Features:
 * - Device Stage with MacBook mock
 * - iPhone notification companion
 * - Animated dashboard elements
 * - Progressive reveal animation
 * - Outcome-focused copy
 */
export function HeroV2() {
  const { t, language } = useLanguage();
  const { openVideo, openBooking } = useModal();

  const copy = {
    cz: {
      badge: "Pro firmy 30–350 lidí",
        headline: "Mějte přehled co se ve firmě skutečně děje",
        headlineHighlight: "",
      subheadline: "Průběžný pulse feedback a risk signály. Víte, kde to vře — a co s tím.",
      primaryCta: "Konzultace zdarma",
      secondaryCta: "3min demo",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Setup za 1 hodinu" },
        { icon: Zap, text: "První data ihned" },
      ],
    },
    en: {
      badge: "For companies of 30–350 people",
      headline: "Predict departures",
      headlineHighlight: "before they happen",
      subheadline: "Continuous pulse feedback and risk signals. Know where it's brewing — and what to do.",
      primaryCta: "Free consultation",
      secondaryCta: "3min demo",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "1 hour setup" },
        { icon: Zap, text: "Instant first data" },
      ],
    },
    de: {
      badge: "Für Unternehmen mit 30–350 Mitarbeitern",
      headline: "Kündigungen vorhersagen",
      headlineHighlight: "bevor sie passieren",
      subheadline: "Kontinuierliches Pulse-Feedback und Risikosignale. Wissen Sie, wo es brodelt — und was zu tun ist.",
      primaryCta: "Kostenlose Beratung",
      secondaryCta: "3min Demo",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Setup in 1 Stunde" },
        { icon: Zap, text: "Sofortige Daten" },
      ],
    },
  };

  const c = copy[language] || copy.en;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background - Subtle gradient with grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-brand-background-secondary -z-20" />
      
      {/* Ambient light blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[100px]"
        />
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
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-border shadow-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-text-secondary">
                {c.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-[-0.02em] text-brand-text-primary leading-[1.05] mb-6"
            >
              {c.headline}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                {c.headlineHighlight}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-brand-text-secondary leading-relaxed mb-10 max-w-xl mx-auto"
            >
              {c.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12 justify-center"
            >
              <Button
                onClick={openBooking}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
              >
                {c.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={openVideo}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold text-brand-text-secondary hover:text-brand-primary"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {c.secondaryCta}
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 justify-center"
            >
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
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <DeviceFrame type="macbook" className="w-full max-w-[500px] sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1200px] mx-auto">
              <AnimatedDashboardContent 
                imageSrc={language === 'cz' ? heroDashboardCz : heroDashboardEn} 
                imageAlt="Echo Pulse Dashboard - Risk signály a team analytics"
              />
            </DeviceFrame>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
