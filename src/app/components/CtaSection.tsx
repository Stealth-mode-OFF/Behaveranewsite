import React from "react";
import { useModal } from "../ModalContext";
import { Button } from "./ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function CtaSection() {
  const { openBooking } = useModal();
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-brand-primary border-t border-white/5">
      <div className="container-default text-center">
        
        <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                {t.cta.title}
            </h2>
            <p className="text-xl text-indigo-200 leading-relaxed font-medium">
                {t.cta.subtitle}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
                onClick={openBooking}
                className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg min-w-[240px]"
            >
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <span className="text-indigo-300 text-sm hidden sm:block font-medium px-2">{t.cta.secondary}</span>

            <a 
                href="tel:+420777123456" 
                className="flex items-center gap-3 text-indigo-200 hover:text-white transition-colors h-12 px-6 font-medium text-lg rounded-lg border border-white/5 hover:bg-white/5"
            >
                <Phone className="w-5 h-5" />
                <span>{t.cta.secondaryLink}</span>
            </a>
        </div>

        <div className="pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left max-w-4xl mx-auto">
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
                      <p className="text-indigo-200 text-sm leading-relaxed">{desc}</p>
                    )}
                  </div>
                );
              })}
        </div>

      </div>
    </section>
  );
}
