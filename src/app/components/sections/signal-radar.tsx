import React from "react";
import { Activity, Zap, Briefcase, TrendingUp, Heart, Battery, Shield, Award, Scale, Cpu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { useLanguage } from "@/app/LanguageContext";

const signals = [
    { key: "mood", icon: Activity },
    { key: "stress", icon: Zap },
    { key: "workload", icon: Briefcase },
    { key: "tools", icon: Cpu },
    { key: "recognition", icon: Award },
    { key: "growth", icon: TrendingUp },
    { key: "rewards", icon: Scale },
    { key: "benefits", icon: Heart },
    { key: "evp", icon: Shield },
];

export function SignalRadar() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-brand-background-secondary/30 border-b border-white/5 relative overflow-hidden" id="radar">
      <div className="container-default max-w-[1120px] mx-auto relative z-10">
        
        {/* Header - Clean & Centered */}
        <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-brand-primary/20 mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                </span>
                <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
                    {t.radar.badge}
                </span>
            </div>
            
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.015em] text-brand-primary mb-6 leading-[1.1]">
                {t.radar.title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed max-w-2xl mx-auto">
                {t.radar.subtitle}
            </p>
            
            {/* Summary - smaller, more subtle */}
            <p className="text-base text-brand-text-muted leading-relaxed max-w-xl mx-auto mt-4">
                {t.radar.summary}
            </p>
        </div>

        {/* Accordion with centered trigger */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="signals" className="border-none">
            {/* Centered trigger button */}
            <div className="flex justify-center">
              <AccordionTrigger className="justify-center gap-2 text-base sm:text-lg font-bold text-brand-primary hover:no-underline py-4 px-8 hover:text-brand-accent transition-colors bg-white rounded-full shadow-sm border border-brand-border hover:shadow-md data-[state=open]:shadow-md">
                {t.radar.accordionLabel}
              </AccordionTrigger>
            </div>
            
            {/* Content */}
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-10">
                {signals.map((signal, index) => {
                  const Icon = signal.icon;
                  const data = t.radar.signals[signal.key as keyof typeof t.radar.signals];

                  if (!data) return null;

                  return (
                    <div key={index} className="flex flex-col h-full group">
                      <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_2px_20px_rgba(46,16,101,0.05)] hover:shadow-[0_20px_40px_rgba(46,16,101,0.1)] border border-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300 relative h-full flex flex-col hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-3 bg-brand-background-secondary rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 ring-1 ring-brand-primary/10 group-hover:ring-brand-primary/20">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-brand-primary tracking-[-0.01em]">
                            {data.title}
                          </h3>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                          {data.metrics.map((metric: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-sm font-medium text-brand-text-secondary/80 group-hover:text-brand-text-primary transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                              <span className="leading-relaxed">{metric}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto">
                          <div className="relative bg-brand-background-secondary/50 border border-brand-primary/10 rounded-xl p-4 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                            <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.12em] mb-2 group-hover:text-brand-accent/80 transition-colors">
                              {t.radar.coreInsightLabel}
                            </p>
                            <p className="text-brand-primary font-semibold text-sm leading-relaxed group-hover:text-white transition-colors italic">
                              "{data.question}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Scientific Footnote */}
        <div className="mt-16 text-center">
             <p className="text-sm text-brand-text-muted max-w-2xl mx-auto leading-relaxed">
                {t.radar.methodology}
            </p>
        </div>

      </div>
    </section>
  );
}
