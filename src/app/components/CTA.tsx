import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useModal } from "../ModalContext";

export function CTA() {
  const { t } = useLanguage();
  const { openBooking } = useModal();

  return (
    <section className="section-spacing bg-white">
      <div className="container-default">
        <div className="card-base bg-brand-primary border-brand-primary/50 p-12 md:p-20 text-center relative overflow-hidden">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary opacity-40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

           <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
                {t.cta.title}
             </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Button 
                    onClick={openBooking}
                    className="h-14 px-8 bg-white text-brand-primary hover:bg-brand-background-secondary font-bold text-body rounded-xl shadow-lg w-full sm:w-auto"
                >
                    <Calendar className="mr-2 w-5 h-5" />
                    {t.cta.primary}
                </Button>
                <Button 
                    variant="outline"
                    onClick={openBooking}
                    className="h-14 px-8 border-white/20 text-white hover:bg-white/10 bg-transparent font-bold text-body rounded-xl w-full sm:w-auto backdrop-blur-sm"
                >
                    {t.cta.secondary}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
             </div>
             <p className="mt-8 text-brand-accent text-caption font-medium uppercase tracking-widest opacity-80">
                {t.cta.note}
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}
