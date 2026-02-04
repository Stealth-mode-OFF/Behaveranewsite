import React from "react";
import { Briefcase, Users, ChevronRight, BarChart, ShieldCheck, TrendingUp, Target } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function RoleSelection() {
  const { t } = useLanguage();

  const scrollToLead = () => {
    const element = document.getElementById('lead-capture');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-brand-primary border-b border-white/5 relative">
      <div className="container-default max-w-[1400px]">
        
        {/* Header - Calm & Direct */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {t.roleSelection.title}
            </h2>
            <p className="text-brand-accent text-lg leading-relaxed opacity-80">
                {t.roleSelection.subtitle}
            </p>
            {t.roleSelection.benefits && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-sm text-white/80 font-medium">
                {t.roleSelection.benefits.map((benefit: string, index: number) => (
                  <span key={index} className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {benefit}
                  </span>
                ))}
              </div>
            )}
        </div>

        {/* The Choice Grid - 4 Columns Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
            
            {/* Investor Card */}
            <button 
                onClick={scrollToLead}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 items-center"
            >
                {/* Subtle Top Highlight */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:via-white opacity-30 group-hover:opacity-80 transition-all" />
                
                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-brand-accent/20 transition-all shadow-inner">
                        <TrendingUp className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest text-brand-accent group-hover:text-white transition-colors text-center">
                        {t.roleSelection.investor.role}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-white transition-colors tracking-tight leading-tight">
                    {t.roleSelection.investor.title}
                </h3>
                
                <ul className="space-y-4 mb-8 text-indigo-100 text-sm font-medium leading-relaxed flex-1 w-full">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.investor.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.investor.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-white font-semibold text-sm group-hover:translate-x-1 duration-300 border-t border-white/10 pt-4 w-full">
                    {t.roleSelection.investor.cta}
                    <ChevronRight className="w-4 h-4 ml-auto text-brand-accent group-hover:text-white transition-colors" />
                </div>
            </button>

            {/* CEO Card */}
            <button 
                onClick={scrollToLead}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 items-center"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:via-white opacity-30 group-hover:opacity-80 transition-all" />
                
                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-brand-accent/20 transition-all shadow-inner">
                        <Briefcase className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest text-brand-accent group-hover:text-white transition-colors text-center">
                        {t.roleSelection.ceo.role}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-white transition-colors tracking-tight leading-tight">
                    {t.roleSelection.ceo.title}
                </h3>
                
                <ul className="space-y-4 mb-8 text-indigo-100 text-sm font-medium leading-relaxed flex-1 w-full">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.ceo.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.ceo.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-white font-semibold text-sm group-hover:translate-x-1 duration-300 border-t border-white/10 pt-4 w-full">
                    {t.roleSelection.ceo.cta}
                    <ChevronRight className="w-4 h-4 ml-auto text-brand-accent group-hover:text-white transition-colors" />
                </div>
            </button>

            {/* HR Card */}
            <button 
                onClick={scrollToLead}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 items-center"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:via-white opacity-30 group-hover:opacity-80 transition-all" />
                
                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-brand-accent/20 transition-all shadow-inner">
                        <Users className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest text-brand-accent group-hover:text-white transition-colors text-center">
                        {t.roleSelection.hr.role}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-white transition-colors tracking-tight leading-tight">
                    {t.roleSelection.hr.title}
                </h3>
                
                <ul className="space-y-4 mb-8 text-indigo-100 text-sm font-medium leading-relaxed flex-1 w-full">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.hr.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.hr.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-white font-semibold text-sm group-hover:translate-x-1 duration-300 border-t border-white/10 pt-4 w-full">
                    {t.roleSelection.hr.cta}
                    <ChevronRight className="w-4 h-4 ml-auto text-brand-accent group-hover:text-white transition-colors" />
                </div>
            </button>

            {/* Team Leader Card */}
            <button 
                onClick={scrollToLead}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 items-center"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:via-white opacity-30 group-hover:opacity-80 transition-all" />
                
                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-brand-accent/20 transition-all shadow-inner">
                        <Target className="w-8 h-8 text-brand-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest text-brand-accent group-hover:text-white transition-colors text-center">
                        {t.roleSelection.teamLeader.role}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-white transition-colors tracking-tight leading-tight">
                    {t.roleSelection.teamLeader.title}
                </h3>
                
                <ul className="space-y-4 mb-8 text-indigo-100 text-sm font-medium leading-relaxed flex-1 w-full">
                    <li className="flex gap-3 items-start">
                        <BarChart className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.teamLeader.list[0]}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
                        <span>{t.roleSelection.teamLeader.list[1]}</span>
                    </li>
                </ul>

                <div className="mt-auto flex items-center text-white font-semibold text-sm group-hover:translate-x-1 duration-300 border-t border-white/10 pt-4 w-full">
                    {t.roleSelection.teamLeader.cta}
                    <ChevronRight className="w-4 h-4 ml-auto text-brand-accent group-hover:text-white transition-colors" />
                </div>
            </button>

        </div>
      </div>
    </section>
  );
}
