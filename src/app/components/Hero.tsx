import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, Shield, Clock, MessageCircle } from "lucide-react";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

export function Hero() {
  const { t } = useLanguage();
  const { openVideo, openBooking } = useModal();

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-48 lg:pb-28 overflow-hidden relative bg-gradient-to-b from-brand-background-secondary/30 to-white">
      {/* Subtle Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-brand-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-brand-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container-default mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-12 md:mb-20">
          
          {/* Target Audience Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-brand-primary/20 mb-10 shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-primary">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Outcome-First Title - UPGRADED */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] text-brand-text-primary mb-6 md:mb-8 leading-[1.08]"
          >
            {t.hero.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-primary to-brand-accent">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Clear Value Proposition - UPGRADED */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-brand-text-secondary leading-[1.6] max-w-3xl mb-8 md:mb-12 font-medium"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Primary + Secondary CTA - SYSTEM COMMAND REDESIGN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 md:mb-8"
          >
            <Button 
              onClick={openVideo}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.hero.primaryCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={openBooking}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.hero.secondaryCta}
            </Button>
          </motion.div>

          {/* Risk Reversal - UPGRADED */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-brand-text-muted max-w-lg leading-relaxed"
          >
            {t.hero.riskReversal}
          </motion.p>

          {/* Trust Indicators - UPGRADED */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-brand-border/40 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-12"
          >
            <div className="flex items-center gap-3 text-sm text-brand-text-secondary">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="font-medium">{t.hero.trust.security}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-text-secondary">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="font-medium">{t.hero.trust.support}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-text-secondary">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="font-medium">{t.hero.trust.implementation}</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview - UPGRADED */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-6xl mx-auto rounded-2xl shadow-2xl border border-brand-border/30 bg-white overflow-hidden ring-1 ring-brand-primary/5"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none z-10" />
          <img 
            src={dashboardPreview} 
            alt="Echo Pulse Dashboard" 
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
