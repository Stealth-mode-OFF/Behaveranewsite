import React from "react";
import { AlertTriangle, TrendingDown, EyeOff, ZapOff } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-white text-brand-text-primary border-b border-brand-border" id="problem">
      
      <div className="container-default max-w-[1120px] mx-auto px-4">
        
        {/* Section Header - Strict Alignment */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 pb-10 border-b border-brand-border">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-brand-error rounded-full animate-pulse" />
                    <span className="font-mono text-[11px] font-bold text-brand-error tracking-[0.15em] uppercase">
                        {t.problems.badge}
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.015em] text-brand-text-primary leading-[1.15]">
                    {t.problems.title}
                </h2>
            </div>
            <div className="max-w-md text-left md:text-right mt-8 md:mt-0">
                <p className="text-lg font-medium text-brand-text-secondary leading-[1.7]">
                    {t.problems.subtitle}
                </p>
            </div>
        </div>

        {/* The Grid of Truth - Clean & Bordered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-brand-border shadow-md rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-brand-border">
            {(() => {
              const items = Array.isArray(t.problems.items) ? t.problems.items : [];
              const cell = (index: number, icon: React.ReactNode, valueClass?: string) => {
                const item = items[index] || { title: "", value: "", desc: "" };
                return (
                  <div className="p-10 flex flex-col h-full hover:bg-brand-background-secondary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-12">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted group-hover:text-brand-text-secondary transition-colors">{item.title}</h3>
                      {icon}
                    </div>
                    <div className="mt-auto">
                      <div className={`text-5xl md:text-6xl font-bold mb-4 tracking-[-0.02em] ${valueClass || "text-brand-text-primary"}`}>{item.value}</div>
                      <p className="text-[15px] text-brand-text-secondary leading-[1.7] pr-2">{item.desc}</p>
                    </div>
                  </div>
                );
              };

              return (
                <>
                  {/* Cell 1 */}
                  {cell(0, <EyeOff className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-text-muted transition-colors" />)}

                  {/* Cell 2 */}
                  {cell(1, <ZapOff className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-error transition-colors" />, "text-brand-error")}

                  {/* Cell 3 */}
                  {cell(2, <TrendingDown className="w-5 h-5 text-brand-text-muted/50 group-hover:text-brand-text-muted transition-colors" />)}

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
                          {t.problems.ctaBox?.title || ""}
                        </h3>
                        <p className="text-sm text-brand-text-on-dark font-medium leading-relaxed">
                          {t.problems.ctaBox?.desc || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </div>
      </div>
    </section>
  );
}
