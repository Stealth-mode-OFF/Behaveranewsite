import React from "react";
import { BatteryWarning, Gauge, Activity } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function CzechRealitySection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-brand-background-dark text-brand-text-inverse-secondary border-t border-brand-border-dark/40">
      <div className="container-default">
        
        {/* Header - Sober Management Briefing */}
        <div className="max-w-3xl mb-16 border-l-2 border-white/20 pl-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 leading-[1.2]">
                {t.czechReality.title}
            </h2>
            <p className="text-lg text-brand-text-inverse-secondary leading-relaxed max-w-2xl">
                {t.czechReality.subtitle}
            </p>
        </div>

        {/* The Two Archetypes Grid - Strict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Archetype A: Burnout/Stagnation */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col h-full hover:border-white/20 transition-colors group">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="p-2 bg-brand-accent/10 rounded text-brand-accent">
                        <BatteryWarning className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-brand-accent transition-colors">
                        {t.czechReality.archetypeA.title}
                    </h3>
                </div>
                
                <ul className="space-y-6 text-sm md:text-base leading-relaxed mb-8 flex-1">
                    <li className="flex gap-4">
                        <span className="text-brand-accent/60 font-mono text-xs pt-1">01</span>
                        <div>
                            <strong className="text-white block mb-1">{t.czechReality.archetypeA.point1.title}</strong>
                            <span className="text-brand-text-inverse-secondary">{t.czechReality.archetypeA.point1.desc}</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-brand-accent/60 font-mono text-xs pt-1">02</span>
                         <div>
                            <strong className="text-white block mb-1">{t.czechReality.archetypeA.point2.title}</strong>
                            <span className="text-brand-text-inverse-secondary">{t.czechReality.archetypeA.point2.desc}</span>
                        </div>
                    </li>
                </ul>

                <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded text-xs text-brand-text-inverse-secondary font-mono flex items-center gap-2 mt-auto">
                    <span className="text-brand-accent font-bold uppercase tracking-wider text-[10px] shrink-0">Diagnóza:</span>
                    <span className="truncate">{t.czechReality.archetypeA.diagnosis}</span>
                </div>
            </div>

            {/* Archetype B: Uncontrolled Growth */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col h-full hover:border-white/20 transition-colors group">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="p-2 bg-brand-accent/10 rounded text-brand-accent">
                        <Gauge className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-brand-accent transition-colors">
                        {t.czechReality.archetypeB.title}
                    </h3>
                </div>
                
                <ul className="space-y-6 text-sm md:text-base leading-relaxed mb-8 flex-1">
                    <li className="flex gap-4">
                        <span className="text-brand-accent/60 font-mono text-xs pt-1">01</span>
                        <div>
                            <strong className="text-white block mb-1">{t.czechReality.archetypeB.point1.title}</strong>
                            <span className="text-brand-text-inverse-secondary">{t.czechReality.archetypeB.point1.desc}</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-brand-accent/60 font-mono text-xs pt-1">02</span>
                        <div>
                            <strong className="text-white block mb-1">{t.czechReality.archetypeB.point2.title}</strong>
                            <span className="text-brand-text-inverse-secondary">{t.czechReality.archetypeB.point2.desc}</span>
                        </div>
                    </li>
                </ul>

                <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded text-xs text-brand-text-inverse-secondary font-mono flex items-center gap-2 mt-auto">
                    <span className="text-brand-accent font-bold uppercase tracking-wider text-[10px] shrink-0">Diagnóza:</span>
                    <span className="truncate">{t.czechReality.archetypeB.diagnosis}</span>
                </div>
            </div>

        </div>

        {/* The Synthesis / Conclusion - Compact & Direct */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-lg p-8 shadow-lg">
            <div className="flex items-start gap-5">
                <div className="p-2.5 bg-brand-accent/10 rounded text-brand-accent shrink-0 border border-brand-accent/20">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg mb-2 tracking-tight">
                        {t.czechReality.synthesis.title}
                    </h4>
                    <p className="text-brand-text-inverse-secondary text-sm md:text-base leading-relaxed">
                        {t.czechReality.synthesis.desc}
                    </p>
                </div>
            </div>
            {/* Optional: could add a small button or link here later */}
        </div>

      </div>
    </section>
  );
}
