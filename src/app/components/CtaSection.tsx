import React from "react";
import { useModal } from "../ModalContext";
import { Button } from "./ui/button";
import { ArrowRight, Phone, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function CtaSection() {
  const { openBooking, openVideo } = useModal();
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-brand-primary border-t border-white/5">
      <div className="container-default text-center">
        
        <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                {t.cta.title}
            </h2>
            <p className="text-xl text-brand-text-inverse-secondary leading-relaxed font-medium">
                {t.cta.subtitle}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Primary CTA - Consultation */}
            <Button 
                onClick={openBooking}
                className="h-14 px-10 bg-white hover:bg-brand-background-secondary text-brand-primary font-bold rounded-xl min-w-[260px] text-lg shadow-xl shadow-brand-primary/30"
            >
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            {/* Secondary CTA - Demo */}
            <Button 
                onClick={openVideo}
                variant="outline"
                className="h-14 px-10 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl min-w-[260px] text-lg border-2 border-white/30 hover:border-white/50"
            >
                <Play className="w-5 h-5 mr-2" />
                {t.cta.demoButton || "Vyzkoušet demo"}
            </Button>
        </div>
        
        {/* Phone as tertiary */}
        <div className="flex items-center justify-center gap-3 text-brand-text-inverse-secondary mb-16">
            <span className="text-sm">{t.cta.secondary}</span>
            <a 
                href="tel:+420777123456" 
                className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors font-semibold"
            >
                <Phone className="w-4 h-4" />
                <span>{t.cta.secondaryLink}</span>
            </a>
        </div>

        <div className="pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left max-w-4xl mx-auto">
            {(Array.isArray(t.cta.benefits) ? t.cta.benefits : [])
              .filter(Boolean)
              .map((benefit: any, index: number) => {
                const title = typeof benefit === "string" ? benefit : benefit?.title;
                const desc = typeof benefit === "string" ? "" : benefit?.desc;
                if (!title) return null;
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <strong className="block text-white text-xs uppercase tracking-widest font-bold">{title}</strong>
                    {desc && (
                      <p className="text-brand-text-inverse-secondary text-sm leading-relaxed">{desc}</p>
                    )}
                  </div>
                );
              })}
        </div>

      </div>
    </section>
  );
}
