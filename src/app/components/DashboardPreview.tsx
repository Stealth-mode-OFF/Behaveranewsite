import React from "react";
import dashboardPreview from 'figma:asset/1c0865d7f205b99cb7db33b13aca36d11f4a3876.png';
import { Eye, Zap, ShieldAlert } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function DashboardPreview() {
  const { t } = useLanguage();

  const icons = [Eye, ShieldAlert, Zap];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden" id="preview">
      <div className="container-default">
        
        {/* Header - The "Why" behind the screen */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 max-w-5xl mx-auto">
            <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 tracking-widest uppercase">
                        {t.dashboard.badge}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                    {t.dashboard.title}
                    <span className="block text-slate-500 mt-2">{t.dashboard.titleHighlight}</span>
                </h2>
            </div>
            <div className="max-w-md text-left md:text-right mt-6 md:mt-0">
                <p className="text-lg text-slate-600 leading-relaxed">
                    {t.dashboard.subtitle}
                </p>
            </div>
        </div>

        {/* The Dashboard - Rigid Container */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border border-slate-200 bg-white mb-20 max-w-5xl mx-auto ring-1 ring-slate-900/5">
             <img 
                src={dashboardPreview} 
                alt="Echo Pulse Main Dashboard" 
                className="w-full h-auto block"
            />
        </div>

        {/* Key Capabilities Grid - Calm & Technical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto border-t border-slate-200 pt-12">
            {t.dashboard.features.map((feature, index) => {
                const Icon = icons[index];
                return (
                    <div key={index} className="flex gap-5 items-start">
                        <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-900 shadow-sm mt-1">
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2 text-base">{feature.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>

      </div>
    </section>
  );
}
