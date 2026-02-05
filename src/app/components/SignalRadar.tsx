import React from "react";
import { Activity, Zap, Briefcase, TrendingUp, Heart, Battery, Shield, Award, Scale, Cpu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useLanguage } from "../LanguageContext";

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
    <section className="py-32 bg-brand-background-secondary/30 border-b border-white/5 relative overflow-hidden" id="radar">
      <div className="container-default max-w-[1120px] mx-auto px-4 relative z-10">
        
        {/* Header - Expert & Authoritative */}
        <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-brand-primary/20 mb-10 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                </span>
                <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
                    {t.radar.badge}
                </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-[-0.015em] text-brand-primary mb-8 leading-[1.1]">
                {t.radar.title} <span className="text-brand-accent">{t.radar.titleHighlight}</span>
            </h2>
            <p className="text-xl text-brand-text-secondary leading-[1.7] font-medium max-w-2xl mx-auto">
                {t.radar.subtitle}
            </p>
        </div>

        <div className="text-center mb-10">
          <p className="text-xl text-brand-text-secondary leading-[1.7] font-medium">
            {t.radar.summary}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="signals" className="border-none">
            <AccordionTrigger className="text-xl font-bold text-brand-primary hover:no-underline py-6 hover:text-brand-accent transition-colors">
              {t.radar.accordionLabel}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pt-12">
                {signals.map((signal, index) => {
                  const Icon = signal.icon;
                  const data = t.radar.signals[signal.key as keyof typeof t.radar.signals];

                  if (!data) return null;

                  return (
                    <div key={index} className="flex flex-col h-full group">
                      <div className="bg-white rounded-2xl p-10 shadow-[0_2px_20px_rgba(46,16,101,0.05)] hover:shadow-[0_20px_40px_rgba(46,16,101,0.1)] border border-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300 relative h-full flex flex-col hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="p-4 bg-brand-background-secondary rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 ring-1 ring-brand-primary/10 group-hover:ring-brand-primary/20">
                            <Icon className="w-7 h-7" />
                          </div>
                          <h3 className="text-2xl font-bold text-brand-primary tracking-[-0.01em]">
                            {data.title}
                          </h3>
                        </div>

                        <div className="space-y-5 mb-10 flex-1">
                          {data.metrics.map((metric: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 text-[15px] font-semibold text-brand-text-secondary/80 group-hover:text-brand-text-primary transition-colors">
                              <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                              <span className="leading-[1.7]">{metric}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto">
                          <div className="relative bg-brand-background-secondary/50 border border-brand-primary/10 rounded-xl p-6 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300 group-hover:shadow-lg">
                            <p className="text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3 group-hover:text-brand-accent/80 transition-colors">
                              {t.radar.coreInsightLabel}
                            </p>
                            <p className="text-brand-primary font-bold text-lg leading-[1.6] group-hover:text-white transition-colors italic">
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
        <div className="mt-20 text-center">
             <p className="text-[15px] font-medium text-brand-text-secondary max-w-2xl mx-auto leading-[1.7]">
                {t.radar.methodology}
            </p>
        </div>

      </div>
    </section>
  );
}
