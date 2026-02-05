import React from "react";
import { AlertTriangle, TrendingDown, EyeOff, ZapOff } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function ProblemSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white text-brand-text-primary border-b border-brand-border" id="problem">
      
      <div className="container-default max-w-[1120px] mx-auto">
        
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

        {/* The Grid of Truth - Precision Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-brand-border shadow-md rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-brand-border">
            {(() => {
              const items = Array.isArray(t.problems.items) ? t.problems.items : [];
              
              // SYSTEM CELL: Uniform structure for cells 1-3
              const dataCell = (index: number, Icon: React.ElementType, valueClass?: string) => {
                const item = items[index] || { title: "", value: "", desc: "" };
                return (
                  <div className="p-10 flex flex-col items-start gap-3 h-full hover:bg-brand-background-secondary/50 transition-colors group">
                    {/* Icon - 24×24, structural element */}
                    <Icon className="w-6 h-6 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                    
                    {/* Label - 11px uppercase, part of rhythm */}
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted group-hover:text-brand-text-secondary transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Primary Content - Large metric */}
                    <div className={`text-6xl font-bold tracking-tight mt-6 ${valueClass || "text-brand-text-primary"}`}>
                      {item.value}
                    </div>
                    
                    {/* Secondary Text - Body copy */}
                    <p className="text-[15px] text-brand-text-secondary leading-[1.7] mt-3">
                      {item.desc}
                    </p>
                  </div>
                );
              };

              return (
                <>
                  {/* Cell 1 - Data */}
                  {dataCell(0, EyeOff)}

                  {/* Cell 2 - Data with accent */}
                  {dataCell(1, ZapOff, "text-brand-error")}

                  {/* Cell 3 - Data */}
                  {dataCell(2, TrendingDown)}

                  {/* Cell 4 - System Alert (MATCHES STRUCTURE) */}
                  <div className="p-10 flex flex-col items-start gap-3 h-full bg-brand-primary text-white group">
                    {/* Icon - Same size, same position, no container */}
                    <AlertTriangle className="w-6 h-6" />
                    
                    {/* Label - Consistent with other cells */}
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted-on-dark">
                      {t.problems.ctaBox?.label || "SYSTEM ALERT"}
                    </h3>
                    
                    {/* Primary Content - Heading (replaces large number) */}
                    <h4 className="text-xl font-bold tracking-tight leading-tight mt-6">
                      {t.problems.ctaBox?.title || ""}
                    </h4>
                    
                    {/* Secondary Text - Body copy */}
                    <p className="text-sm text-brand-text-on-dark font-medium leading-relaxed mt-3">
                      {t.problems.ctaBox?.desc || ""}
                    </p>
                  </div>
                </>
              );
            })()}
        </div>
      </div>
    </section>
  );
}
