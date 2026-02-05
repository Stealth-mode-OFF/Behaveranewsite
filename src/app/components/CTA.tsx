import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useModal } from "../ModalContext";

export function CTA() {
  const { t } = useLanguage();
  const { openBooking } = useModal();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="card-base bg-brand-primary border-brand-primary/50 p-16 md:p-24 text-center relative overflow-hidden rounded-3xl">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-primary opacity-40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

           <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-5xl md:text-6xl font-bold tracking-[-0.015em] text-white mb-10 leading-[1.1]">
                {t.cta.title}
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
                <Button 
                    onClick={openBooking}
                    variant="inverse"
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Calendar className="mr-2 w-4 h-4" />
                    {t.cta.primary}
                </Button>
                <Button 
                    variant="outline"
                    onClick={openBooking}
                    size="lg"
                    className="w-full sm:w-auto border-white/30 hover:border-white/50 text-white hover:bg-white/10"
                >
                    {t.cta.secondary}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </div>
             <p className="mt-12 text-brand-text-muted-on-dark text-[11px] font-bold font-mono uppercase tracking-[0.15em]">
                {t.cta.note}
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}
