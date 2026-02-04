import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from './ui/button';
import { useModal } from '../ModalContext';
import { ArrowRight, Lock } from 'lucide-react';

export function DecisionLock() {
  const { t } = useLanguage();
  const { openBooking } = useModal();

  // Guard to ensure we don't crash if translations are missing (though we added them)
  if (!t.decisionLock) return null;

  return (
    <section className="py-24 bg-brand-background-dark border-y border-brand-border-dark/40 relative overflow-hidden">
        {/* Subtle background element to suggest 'locking' or precision */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-accent/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container-default max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Lock className="w-5 h-5 text-brand-accent opacity-80" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.2] tracking-tight">
                {t.decisionLock.title}
            </h2>
            
            <p className="text-xl text-brand-text-inverse-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                {t.decisionLock.subtitle}
            </p>
            
            <div className="flex justify-center">
                <Button
                    onClick={openBooking}
                    className="h-14 px-10 bg-white text-brand-primary hover:bg-brand-background-secondary text-lg font-bold rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all hover:scale-105"
                >
                    {t.decisionLock.cta}
                    <ArrowRight className="w-5 h-5 ml-2 opacity-80" />
                </Button>
            </div>
        </div>
    </section>
  );
}
