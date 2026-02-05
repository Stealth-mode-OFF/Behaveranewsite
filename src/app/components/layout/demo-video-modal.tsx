import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { 
  X, 
  Play, 
  Monitor, 
  Calendar, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  Lock
} from 'lucide-react';

/**
 * DemoVideoModal - Lead Magnet Choice Modal
 * 
 * This is the MAIN conversion modal. When user clicks any "See Demo" CTA,
 * they get two high-value options:
 * 
 * 1. SELF-SERVE DEMO (Primary for autonomous buyers)
 *    - Enter email + phone → Get instant access to app.behavera.com
 *    - Best for: Tech-savvy, want to explore on their own
 * 
 * 2. GUIDED CONSULTATION (Primary for relationship buyers)
 *    - Book 20min call with expert
 *    - Best for: Want personalized guidance, have specific questions
 * 
 * UX Psychology:
 * - Both options presented as equally valuable
 * - Self-serve on LEFT (faster, no commitment)
 * - Consultation on RIGHT (recommended badge, higher value)
 * - Clear value props for each
 */

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo, openDemoRequest, openBooking } = useModal();
  const { t } = useLanguage();

  const handleSelfServeDemo = () => {
    closeVideo();
    setTimeout(() => openDemoRequest(), 100);
  };

  const handleConsultation = () => {
    closeVideo();
    setTimeout(() => openBooking(), 100);
  };

  const copy = t.demoChoiceModal || {
    title: "Jak chcete poznat Echo Pulse?",
    subtitle: "Vyberte si cestu, která vám vyhovuje",
    
    selfServe: {
      badge: "Okamžitý přístup",
      title: "Projít si demo sám",
      subtitle: "Získejte přístup k demo aplikaci s reálnými daty",
      features: [
        "Kompletní demo prostředí",
        "Neomezený čas na prozkoumání",
        "Reálná firemní data"
      ],
      cta: "Získat přístup",
      note: "Vyžaduje pracovní email + telefon"
    },
    
    guided: {
      badge: "Doporučujeme",
      title: "Konzultace s expertem",
      subtitle: "20min video hovor s naším konzultantem",
      features: [
        "Personalizovaná ukázka",
        "Odpovědi na vaše dotazy",
        "Konkrétní use-cases pro váš obor"
      ],
      cta: "Vybrat termín",
      note: "Žádné závazky"
    }
  };

  return (
    <Dialog open={isVideoOpen} onOpenChange={closeVideo}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden bg-white border-brand-border">
        <DialogTitle className="sr-only">Choose Demo Option</DialogTitle>
        <DialogDescription className="sr-only">Choose how you want to experience Echo Pulse</DialogDescription>
        
        {/* Close Button */}
        <button 
          onClick={closeVideo}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-brand-background-secondary rounded-full text-brand-text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl mb-5">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-2">
              {copy.title}
            </h2>
            <p className="text-brand-text-secondary">
              {copy.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Option 1: Self-serve Demo */}
            <motion.button
              onClick={handleSelfServeDemo}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left p-6 bg-brand-background-secondary hover:bg-white border-2 border-brand-border hover:border-brand-primary/40 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/5"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-semibold mb-4">
                <Monitor className="w-3 h-3" />
                {copy.selfServe.badge}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white border border-brand-border text-brand-primary flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-colors">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-brand-text-primary mb-1">
                {copy.selfServe.title}
              </h3>
              <p className="text-sm text-brand-text-secondary mb-4">
                {copy.selfServe.subtitle}
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-5">
                {copy.selfServe.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-brand-primary font-semibold group-hover:gap-2.5 transition-all">
                  <Lock className="w-4 h-4" />
                  {copy.selfServe.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              
              {/* Note */}
              <p className="text-xs text-brand-text-muted mt-3">
                {copy.selfServe.note}
              </p>
            </motion.button>

            {/* Option 2: Guided Consultation */}
            <motion.button
              onClick={handleConsultation}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left p-6 bg-brand-primary/5 hover:bg-brand-primary/10 border-2 border-brand-primary/20 hover:border-brand-primary/40 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/10 relative"
            >
              {/* Recommended Badge */}
              <div className="absolute -top-3 right-4">
                <div className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full shadow-lg">
                  {copy.guided.badge}
                </div>
              </div>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-semibold mb-4">
                <Clock className="w-3 h-3" />
                20 min
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-brand-text-primary mb-1">
                {copy.guided.title}
              </h3>
              <p className="text-sm text-brand-text-secondary mb-4">
                {copy.guided.subtitle}
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-5">
                {copy.guided.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-brand-primary font-bold group-hover:gap-2.5 transition-all">
                  <Calendar className="w-4 h-4" />
                  {copy.guided.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              
              {/* Note */}
              <p className="text-xs text-brand-text-muted mt-3">
                {copy.guided.note}
              </p>
            </motion.button>
          </div>

          {/* Trust Note */}
          <p className="text-center text-sm text-brand-text-muted mt-8">
            Žádný spam, žádné závazky. Vaše data jsou v bezpečí.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
