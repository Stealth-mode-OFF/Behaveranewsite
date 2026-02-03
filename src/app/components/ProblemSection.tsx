import React from "react";
import { AlertTriangle, TrendingDown, EyeOff, ZapOff } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-[#F8F9FA] text-slate-900 border-b border-slate-200" id="problem">
      
      <div className="container-default">
        
        {/* Section Header - Strict Alignment */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-slate-200">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    <span className="font-mono text-xs font-bold text-red-600 tracking-widest uppercase">
                        {t.problems.badge}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
                    {t.problems.title}
                </h2>
            </div>
            <div className="max-w-md text-left md:text-right mt-6 md:mt-0">
                <p className="text-lg font-medium text-slate-600 leading-relaxed">
                    {t.problems.subtitle}
                </p>
            </div>
        </div>

        {/* The Grid of Truth - Clean & Bordered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Cell 1 */}
            <div className="p-8 flex flex-col h-full hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{t.problems.items[0].title}</h3>
                    <EyeOff className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-slate-900">{t.problems.items[0].value}</div>
                    <p className="text-sm text-slate-600 leading-relaxed pr-4">
                        {t.problems.items[0].desc}
                    </p>
                </div>
            </div>

            {/* Cell 2 */}
            <div className="p-8 flex flex-col h-full hover:bg-slate-50 transition-colors group">
                 <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{t.problems.items[1].title}</h3>
                    <ZapOff className="w-5 h-5 text-slate-300 group-hover:text-red-400 transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-red-600">{t.problems.items[1].value}</div>
                    <p className="text-sm text-slate-600 leading-relaxed pr-4">
                        {t.problems.items[1].desc}
                    </p>
                </div>
            </div>

            {/* Cell 3 */}
            <div className="p-8 flex flex-col h-full hover:bg-slate-50 transition-colors group">
                 <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{t.problems.items[2].title}</h3>
                    <TrendingDown className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-slate-900">{t.problems.items[2].value}</div>
                    <p className="text-sm text-slate-600 leading-relaxed pr-4">
                        {t.problems.items[2].desc}
                    </p>
                </div>
            </div>

            {/* Cell 4 - The Call to Action / Insight */}
            <div className="p-8 flex flex-col h-full bg-[#1e293b] text-white relative overflow-hidden group">
                 {/* Subtle pattern */}
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                 
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/20 transition-colors">
                        <AlertTriangle className="w-5 h-5 text-white/90" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold leading-tight mb-3 tracking-tight">
                            {t.problems.ctaBox.title}
                        </h3>
                         <p className="text-sm text-slate-400 leading-relaxed">
                            {t.problems.ctaBox.desc}
                         </p>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
