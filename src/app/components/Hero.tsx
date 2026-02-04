import React from "react";
import { Button } from "./ui/button";
import { Play, ChevronRight, CheckCircle2 } from "lucide-react";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
// TODO: Replace with AI Assistant screenshot when available in src/assets (e.g. ai-assistant.png)
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

export function Hero() {
  const { t } = useLanguage();
  const { openBooking } = useModal();
  const scrollToLead = () => {
    const element = document.getElementById("lead-capture");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-32 pb-16 md:pt-44 md:pb-28 overflow-hidden relative bg-brand-background-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute top-40 right-10 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl" />
      </div>

      <div className="container-default px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-background-secondary rounded-full border border-brand-border mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-h1 font-bold tracking-tight text-brand-text-primary mb-6 leading-tight"
          >
            {t.hero.title}{" "}
            <span className="text-brand-accent">
                {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body text-brand-text-secondary leading-relaxed max-w-2xl mb-10"
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
              onClick={scrollToLead}
              className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-black/10 hover:shadow-xl transition-all w-full sm:w-auto group"
            >
              {t.hero.primaryCta}
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={openBooking}
              variant="outline"
              className="h-12 px-8 border-brand-border-strong hover:bg-brand-background-secondary text-brand-text-primary font-semibold rounded-lg w-full sm:w-auto"
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
            className="mt-12 pt-8 border-t border-brand-border/60 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium text-brand-text-muted uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              {t.hero.trust.security}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              {t.hero.trust.support}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              {t.hero.trust.implementation}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              {t.hero.trust.languages}
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-6xl mx-auto rounded-2xl shadow-2xl border border-brand-border bg-white overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white/30 to-transparent pointer-events-none z-10" />
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
