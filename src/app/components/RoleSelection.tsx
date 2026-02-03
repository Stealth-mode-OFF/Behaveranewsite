import React from "react";
import { Briefcase, Users, ChevronRight, BarChart, ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function RoleSelection() {
  const { t } = useLanguage();

  const scrollToProblem = () => {
    const element = document.getElementById('problem');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-24 bg-[#0a0a0a] border-b border-white/5 relative">
      <div className="container-default">
        
        {/* Header - Calm & Direct */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {t.roleSelection.title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                {t.roleSelection.subtitle}
            </p>
        </div>

        {/* The Choice Grid - Symmetrical & Balanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* CEO Card */}
            <button 
                onClick={scrollToProblem}
                className="group relative bg-[#15171e] border border-white/5 p-8 rounded-lg text-left hover:border-brand-primary/40 hover:bg-[#1a1c23] transition-all duration-300 flex flex-col h-full"
            >
                {/* Subtle Top Highlight */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-brand-primary opacity-30 group-hover:opacity-100 transition-all" />
                
                <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-slate-800/50 rounded border border-white/5 group-hover:border-brand-primary/20 transition-colors">
                        <Briefcase className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-brand-primary/80 transition-colors">
                        {t.roleSelection.ceo.role}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors">
                    {t.roleSelection.ceo.title}
                </h3>
                
                <ul className="space-y-3 mb-8 text-slate-400 text-sm leading-relaxed flex-1">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />
                        <span>{t.roleSelection.ceo.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />
                        <span>{t.roleSelection.ceo.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-slate-300 font-medium text-sm group-hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                    {t.roleSelection.ceo.cta}
                    <ChevronRight className="w-4 h-4 ml-2 text-brand-primary opacity-70 group-hover:opacity-100" />
                </div>
            </button>

            {/* HR Card */}
            <button 
                onClick={scrollToProblem}
                className="group relative bg-[#15171e] border border-white/5 p-8 rounded-lg text-left hover:border-violet-500/40 hover:bg-[#1a1c23] transition-all duration-300 flex flex-col h-full"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-violet-500 opacity-30 group-hover:opacity-100 transition-all" />
                
                <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-slate-800/50 rounded border border-white/5 group-hover:border-violet-500/20 transition-colors">
                        <Users className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-violet-500/80 transition-colors">
                        {t.roleSelection.hr.role}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">
                    {t.roleSelection.hr.title}
                </h3>
                
                <ul className="space-y-3 mb-8 text-slate-400 text-sm leading-relaxed flex-1">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />
                        <span>{t.roleSelection.hr.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />
                        <span>{t.roleSelection.hr.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-slate-300 font-medium text-sm group-hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                    {t.roleSelection.hr.cta}
                    <ChevronRight className="w-4 h-4 ml-2 text-violet-500 opacity-70 group-hover:opacity-100" />
                </div>
            </button>

        </div>
      </div>
    </section>
  );
}
