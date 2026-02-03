import React from "react";
import { AlertTriangle, TrendingDown, EyeOff, ZapOff } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-white text-brand-text-primary border-b border-brand-border" id="problem">
      
      <div className="container-default">
        
        {/* Section Header - Strict Alignment */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-brand-border">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 bg-brand-error rounded-full animate-pulse" />
                    <span className="font-mono text-xs font-bold text-brand-error tracking-widest uppercase">
                        {t.problems.badge}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary leading-[1.2]">
                    {t.problems.title}
                </h2>
            </div>
            <div className="max-w-md text-left md:text-right mt-6 md:mt-0">
                <p className="text-lg font-medium text-brand-text-secondary leading-relaxed">
                    {t.problems.subtitle}
                </p>
            </div>
        </div>

        {/* The Grid of Truth - Clean & Bordered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-brand-border shadow-sm rounded-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-brand-border">
            
            {/* Cell 1 */}
            <div className="p-8 flex flex-col h-full hover:bg-brand-background-secondary transition-colors group">
                <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted group-hover:text-brand-text-secondary transition-colors">{t.problems.items[0].title}</h3>
                    <EyeOff className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-text-muted transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-brand-text-primary">{t.problems.items[0].value}</div>
                    <p className="text-sm text-brand-text-secondary leading-relaxed pr-4">
                        {t.problems.items[0].desc}
                    </p>
                </div>
            </div>

            {/* Cell 2 */}
            <div className="p-8 flex flex-col h-full hover:bg-brand-background-secondary transition-colors group">
                 <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted group-hover:text-brand-text-secondary transition-colors">{t.problems.items[1].title}</h3>
                    <ZapOff className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-error transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-brand-error">{t.problems.items[1].value}</div>
                    <p className="text-sm text-brand-text-secondary leading-relaxed pr-4">
                        {t.problems.items[1].desc}
                    </p>
                </div>
            </div>

            {/* Cell 3 */}
            <div className="p-8 flex flex-col h-full hover:bg-brand-background-secondary transition-colors group">
                 <div className="flex justify-between items-start mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted group-hover:text-brand-text-secondary transition-colors">{t.problems.items[2].title}</h3>
                    <TrendingDown className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-text-muted transition-colors" />
                </div>
                <div className="mt-auto">
                    <div className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-brand-text-primary">{t.problems.items[2].value}</div>
                    <p className="text-sm text-brand-text-secondary leading-relaxed pr-4">
                        {t.problems.items[2].desc}
                    </p>
                </div>
            </div>

            {/* Cell 4 - The Call to Action / Insight */}
            <div className="p-8 flex flex-col h-full bg-brand-primary text-white relative overflow-hidden group">
                 {/* Subtle pattern */}
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />
                 
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center mb-6 border border-white/20 group-hover:border-white/40 transition-colors">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold leading-tight mb-3 tracking-tight">
                            {t.problems.ctaBox.title}
                        </h3>
                         <p className="text-sm text-white/80 leading-relaxed">
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
