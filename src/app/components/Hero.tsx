import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, Shield, Clock, MessageCircle, Sparkles } from "lucide-react";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

export function Hero() {
  const { t } = useLanguage();
  const { openVideo, openBooking } = useModal();

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-48 lg:pb-28 overflow-hidden relative bg-gradient-to-b from-brand-background-secondary/30 to-white">
      {/* Premium Animated Background Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated gradient blobs */}
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-brand-primary/8 to-brand-accent/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-0 right-1/4 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-brand-accent/6 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-gradient-to-t from-brand-primary/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] hidden lg:block"
        >
          <div className="w-3 h-3 rounded-full bg-brand-accent/30" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 left-[10%] hidden lg:block"
        >
          <div className="w-2 h-2 rounded-full bg-brand-primary/20" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-40 right-[20%] hidden lg:block"
        >
          <div className="w-4 h-4 rounded-lg rotate-45 border-2 border-brand-accent/20" />
        </motion.div>
      </div>

      <div className="container-default mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-12 md:mb-20">
          
          {/* Target Audience Badge - Premium Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full border border-brand-primary/15 mb-10 shadow-lg shadow-brand-primary/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-primary">
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Outcome-First Title - Animated Gradient */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] text-brand-text-primary mb-6 md:mb-8 leading-[1.08]"
          >
            {t.hero.title}
            <br />
            <span className="text-gradient-animate">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Clear Value Proposition */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-brand-text-secondary leading-[1.6] max-w-3xl mb-8 md:mb-12 font-medium"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Primary + Secondary CTA - Premium Shine Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 md:mb-8"
          >
            <Button 
              onClick={openBooking}
              size="lg"
              className="w-full sm:w-auto btn-shine"
            >
              {t.hero.primaryCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={openVideo}
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

        {/* Dashboard Preview - Premium with Glow & Perspective */}
        <motion.div 
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto perspective-1000"
        >
          {/* Glow effect behind the dashboard */}
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/20 via-brand-accent/20 to-brand-primary/20 rounded-3xl blur-2xl opacity-50 -z-10" />
          
          <div className="relative rounded-2xl shadow-2xl border border-brand-border/30 bg-white overflow-hidden ring-1 ring-brand-primary/5 group">
            {/* Browser chrome effect */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 font-medium border border-gray-200 text-center">
                  app.echopulse.cz/dashboard
                </div>
              </div>
            </div>
            
            {/* Subtle hover lift effect */}
            <div className="transition-transform duration-500 group-hover:scale-[1.01]">
              <img 
                src={dashboardPreview} 
                alt="Echo Pulse Dashboard" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
