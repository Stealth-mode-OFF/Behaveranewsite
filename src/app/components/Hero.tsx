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
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative bg-gradient-to-b from-brand-background-secondary/50 to-white">
      {/* Subtle Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-default px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          
          {/* Target Audience Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Outcome-First Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text-primary mb-6 leading-[1.1]"
          >
            {t.hero.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Clear Value Proposition */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-2xl mb-8"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Primary + Secondary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button 
              onClick={openVideo}
              className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg w-full sm:w-auto"
            >
              {t.hero.primaryCta}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={openBooking}
              variant="outline"
              className="h-12 px-8 bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-semibold rounded-lg w-full sm:w-auto"
            >
              {t.hero.secondaryCta}
            </Button>
          </motion.div>

          {/* Risk Reversal */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-sm text-brand-text-muted"
          >
            {t.hero.riskReversal}
          </motion.p>

          {/* Trust Indicators - Compact */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 pt-8 border-t border-brand-border/30 flex flex-wrap justify-center gap-6 md:gap-10"
          >
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Shield className="w-4 h-4 text-brand-primary" />
              <span>{t.hero.trust.security}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <MessageCircle className="w-4 h-4 text-brand-primary" />
              <span>{t.hero.trust.support}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>{t.hero.trust.implementation}</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-6xl mx-auto rounded-xl shadow-2xl border border-brand-border/50 bg-white overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-10" />
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
