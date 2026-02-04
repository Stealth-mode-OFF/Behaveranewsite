import React from "react";
import { Activity, Zap, Briefcase, TrendingUp, Heart, Battery, Shield, Award, Scale, Cpu } from "lucide-react";
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
    <section className="py-24 bg-brand-background-secondary/30 border-b border-white/5 relative overflow-hidden" id="radar">
      <div className="container-default relative z-10">
        
        {/* Header - Expert & Authoritative */}
        <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                </span>
                <span className="font-mono text-xs font-bold text-brand-primary tracking-widest uppercase">
                    {t.radar.badge}
                </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-primary mb-6 leading-[1.1]">
                {t.radar.title} <span className="text-brand-accent">{t.radar.titleHighlight}</span>
            </h2>
            <p className="text-xl text-brand-text-secondary leading-relaxed font-medium">
                {t.radar.subtitle}
            </p>
        </div>

        {/* The Grid - High Clarity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {signals.map((signal, index) => {
                const Icon = signal.icon;
                const data = t.radar.signals[signal.key as keyof typeof t.radar.signals];
                
                // Guard clause to prevent crash if translation is missing
                if (!data) return null;

                return (
                    <div key={index} className="flex flex-col h-full group">
                        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(11,18,32,0.06)] hover:shadow-[0_20px_40px_rgba(11,18,32,0.12)] border border-brand-border hover:border-brand-border-strong transition-all duration-300 relative h-full flex flex-col hover:-translate-y-1">
                            
                            {/* Card Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3.5 bg-brand-background-secondary rounded-xl text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 ring-1 ring-brand-border group-hover:ring-brand-accent/40">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-text-primary tracking-tight">
                                    {data.title}
                                </h3>
                            </div>
                            
                            {/* Metrics List - What We Extract */}
                            <div className="space-y-4 mb-8 flex-1">
                                {data.metrics.map((metric: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 text-sm font-semibold text-brand-text-secondary/80 group-hover:text-brand-text-primary transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                        <span className="leading-relaxed">{metric}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Insight Box - Core Value */}
                            <div className="mt-auto">
                                <div className="relative bg-brand-background-secondary/60 border border-brand-border rounded-xl p-5 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300 group-hover:shadow-lg">
                                    <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-widest mb-2 group-hover:text-brand-text-inverse-secondary transition-colors">
                                        Core Insight
                                    </p>
                                    <p className="text-brand-text-primary font-bold text-base leading-relaxed group-hover:text-white transition-colors italic">
                                        "{data.question}"
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>

        {/* Scientific Footnote */}
        <div className="mt-16 text-center">
             <p className="text-sm font-medium text-brand-text-muted max-w-2xl mx-auto opacity-70">
                {t.radar.methodology}
            </p>
        </div>

      </div>
    </section>
  );
}
