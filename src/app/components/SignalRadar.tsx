import React from "react";
import { Radar, Activity, Zap, Shield, Briefcase, Award, TrendingUp, Heart, Battery } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function SignalRadar() {
  const { t } = useLanguage();

  const signals = [
    { icon: Activity, key: 'mood' },
    { icon: Battery, key: 'stress' },
    { icon: Zap, key: 'workload' },
    { icon: Briefcase, key: 'tools' },
    { icon: Award, key: 'recognition' },
    { icon: TrendingUp, key: 'growth' },
    { icon: Shield, key: 'rewards' },
    { icon: Heart, key: 'benefits' },
    { icon: Radar, key: 'evp' }
  ];

  return (
    <section className="py-12 bg-white text-slate-900 border-b border-slate-200 overflow-hidden" id="radar">
      <div className="container-default relative z-10">
        
        {/* Header - Compact */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] font-bold text-brand-primary tracking-widest uppercase">
                        {t.radar.badge}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-2">
                    {t.radar.title} <span className="text-slate-500">{t.radar.titleHighlight}</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                    {t.radar.subtitle}
                </p>
            </div>
            
            {/* Legend / Status */}
            <div className="hidden md:flex gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-t border-slate-200 pt-2">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Stable</span>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    <span>Active</span>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    <span>Friction</span>
                </div>
            </div>
        </div>

        {/* The Grid of Signals - Compact Islands */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {signals.map((signal, index) => {
                const Icon = signal.icon;
                const data = t.radar.signals[signal.key];
                
                return (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 group hover:bg-white hover:border-brand-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col h-full">
                        
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-white rounded-lg text-slate-500 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-colors border border-slate-200 shadow-sm">
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 group-hover:text-brand-primary/70 transition-colors uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-slate-100 h-fit">
                                0{index + 1}
                            </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mb-1.5 tracking-tight">
                            {data.title}
                        </h3>
                        
                        <div className="space-y-1 mb-3 flex-1">
                            {data.metrics.map((metric: string, i: number) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 group-hover:text-slate-900 transition-colors">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-brand-primary" />
                                    <span>{metric}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-3 mt-auto">
                            <p className="text-[11px] font-mono text-brand-primary font-semibold leading-relaxed bg-brand-primary/5 border border-brand-primary/10 p-2.5 rounded-lg">
                                "{data.question}"
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Scientific Footnote */}
        <div className="mt-8 flex items-start gap-3 opacity-60 max-w-2xl mx-auto text-center justify-center">
             <p className="text-[10px] text-slate-500 leading-relaxed">
                {t.radar.methodology}
            </p>
        </div>

      </div>
    </section>
  );
}
