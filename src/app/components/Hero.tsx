import React from "react";
import { Button } from "./ui/button";
import { Play, ChevronRight, CheckCircle2 } from "lucide-react";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

export function Hero() {
  const { t } = useLanguage();
  const { openBooking, openDemoVideo } = useModal();

  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container-default px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-text-primary mb-6 leading-tight"
          >
            {t.hero.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-2xl mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button 
              onClick={openBooking}
              className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all w-full sm:w-auto group"
            >
              {t.hero.primaryCta}
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={openDemoVideo}
              variant="outline"
              className="h-12 px-8 border-brand-primary/10 hover:bg-brand-primary/5 text-brand-primary font-semibold rounded-lg w-full sm:w-auto"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {t.hero.secondaryCta}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-brand-border/40 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium text-brand-text-muted uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
              {t.hero.trust.security}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
              {t.hero.trust.support}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
              {t.hero.trust.implementation}
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
            src="/assets/dashboard-preview.svg" 
            alt="Echo Pulse Dashboard" 
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
