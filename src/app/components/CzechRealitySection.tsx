import React from "react";
import { BatteryWarning, Gauge, Activity } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function CzechRealitySection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#0f1115] text-slate-300 border-t border-slate-800">
      <div className="container-default">
        
        {/* Header - Sober Management Briefing */}
        <div className="max-w-3xl mb-16 border-l-2 border-slate-700 pl-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 leading-[1.2]">
                {t.czechReality.title}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                {t.czechReality.subtitle}
            </p>
        </div>

        {/* The Two Archetypes Grid - Strict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Archetype A: Burnout/Stagnation */}
            <div className="bg-[#15171e] border border-white/5 p-8 rounded-lg flex flex-col h-full hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="p-2 bg-orange-500/10 rounded text-orange-500">
                        <BatteryWarning className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                        {t.czechReality.archetypeA.title}
                    </h3>
                </div>
                
                <ul className="space-y-6 text-sm md:text-base leading-relaxed mb-8 flex-1">
                    <li className="flex gap-4">
                        <span className="text-orange-500/50 font-mono text-xs pt-1">01</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">{t.czechReality.archetypeA.point1.title}</strong>
                            <span className="text-slate-500">{t.czechReality.archetypeA.point1.desc}</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-orange-500/50 font-mono text-xs pt-1">02</span>
                         <div>
                            <strong className="text-slate-200 block mb-1">{t.czechReality.archetypeA.point2.title}</strong>
                            <span className="text-slate-500">{t.czechReality.archetypeA.point2.desc}</span>
                        </div>
                    </li>
                </ul>

                <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded text-xs text-orange-200/70 font-mono flex items-center gap-2 mt-auto">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-[10px] shrink-0">Diagnóza:</span>
                    <span className="truncate">{t.czechReality.archetypeA.diagnosis}</span>
                </div>
            </div>

            {/* Archetype B: Uncontrolled Growth */}
            <div className="bg-[#15171e] border border-white/5 p-8 rounded-lg flex flex-col h-full hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                    <div className="p-2 bg-blue-500/10 rounded text-blue-500">
                        <Gauge className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                        {t.czechReality.archetypeB.title}
                    </h3>
                </div>
                
                <ul className="space-y-6 text-sm md:text-base leading-relaxed mb-8 flex-1">
                    <li className="flex gap-4">
                        <span className="text-blue-500/50 font-mono text-xs pt-1">01</span>
                         <div>
                            <strong className="text-slate-200 block mb-1">{t.czechReality.archetypeB.point1.title}</strong>
                            <span className="text-slate-500">{t.czechReality.archetypeB.point1.desc}</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-blue-500/50 font-mono text-xs pt-1">02</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">{t.czechReality.archetypeB.point2.title}</strong>
                            <span className="text-slate-500">{t.czechReality.archetypeB.point2.desc}</span>
                        </div>
                    </li>
                </ul>

                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded text-xs text-blue-200/70 font-mono flex items-center gap-2 mt-auto">
                    <span className="text-blue-500 font-bold uppercase tracking-wider text-[10px] shrink-0">Diagnóza:</span>
                    <span className="truncate">{t.czechReality.archetypeB.diagnosis}</span>
                </div>
            </div>

        </div>

        {/* The Synthesis / Conclusion - Compact & Direct */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1a1c23] border border-white/5 rounded-lg p-8 shadow-lg">
            <div className="flex items-start gap-5">
                <div className="p-2.5 bg-brand-primary/10 rounded text-brand-primary shrink-0 border border-brand-primary/20">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg mb-2 tracking-tight">
                        {t.czechReality.synthesis.title}
                    </h4>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
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
