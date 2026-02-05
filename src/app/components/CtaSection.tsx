import React from "react";
import { useModal } from "../ModalContext";
import { Button } from "./ui/button";
import { ArrowRight, Phone, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function CtaSection() {
  const { openBooking, openVideo } = useModal();
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-brand-primary border-t border-white/5">
      <div className="container-default text-center max-w-[1120px] mx-auto">
        
        <div className="max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full border border-white/20 mb-12 backdrop-blur-sm">
              <span className="font-mono text-[11px] font-bold text-white tracking-[0.15em] uppercase">
                Get Started
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 tracking-[-0.015em] leading-[1.1]">
                {t.cta.title}
            </h2>
            <p className="text-2xl text-brand-text-inverse-secondary leading-[1.7] font-medium max-w-3xl mx-auto">
                {t.cta.subtitle}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            {/* Primary CTA - Consultation */}
            <Button 
                onClick={openBooking}
                variant="inverse"
                size="lg"
                className="min-w-[280px]"
            >
                {t.cta.primary}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {/* Secondary CTA - Demo */}
            <Button 
                onClick={openVideo}
                variant="outline"
                size="lg"
                className="min-w-[280px] border-white/30 hover:border-white/50 text-white hover:bg-white/10"
            >
                <Play className="w-4 h-4 mr-2" />
                {t.cta.demoButton || "Vyzkoušet demo"}
            </Button>
        </div>
        
        {/* Phone as tertiary */}
        <div className="flex items-center justify-center gap-4 text-brand-text-inverse-secondary mb-20">
            <span className="text-base font-medium">{t.cta.secondary}</span>
            <a 
                href="tel:+420777123456" 
                className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors font-bold text-lg"
            >
                <Phone className="w-5 h-5" />
                <span>{t.cta.secondaryLink}</span>
            </a>
        </div>

        <div className="pt-20 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left max-w-5xl mx-auto">
            {(Array.isArray(t.cta.benefits) ? t.cta.benefits : [])
              .filter(Boolean)
              .map((benefit: any, index: number) => {
                const title = typeof benefit === "string" ? benefit : benefit?.title;
                const desc = typeof benefit === "string" ? "" : benefit?.desc;
                if (!title) return null;
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <strong className="block text-white text-[11px] uppercase tracking-[0.15em] font-bold font-mono">{title}</strong>
                    {desc && (
                      <p className="text-brand-text-inverse-secondary text-[15px] leading-[1.7]">{desc}</p>
                    )}
                  </div>
                );
              })}
        </div>

      </div>
    </section>
  );
}
