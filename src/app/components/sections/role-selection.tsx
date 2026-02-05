import React from "react";
import { Briefcase, Users, ChevronRight, BarChart, ShieldCheck, TrendingUp, Target, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

type RoleCardConfig = {
  id: string;
  icon: LucideIcon;
  role: string;
  title: string;
  list: string[];
  cta: string;
};

const listIcons: LucideIcon[] = [BarChart, ShieldCheck];

export function RoleSelection() {
  const { t } = useLanguage();

  const scrollToLead = () => {
    const element = document.getElementById('lead-capture');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles: RoleCardConfig[] = [
    {
      id: "investor",
      icon: TrendingUp,
      role: t.roleSelection.investor.role,
      title: t.roleSelection.investor.title,
      list: t.roleSelection.investor.list,
      cta: t.roleSelection.investor.cta,
    },
    {
      id: "ceo",
      icon: Briefcase,
      role: t.roleSelection.ceo.role,
      title: t.roleSelection.ceo.title,
      list: t.roleSelection.ceo.list,
      cta: t.roleSelection.ceo.cta,
    },
    {
      id: "hr",
      icon: Users,
      role: t.roleSelection.hr.role,
      title: t.roleSelection.hr.title,
      list: t.roleSelection.hr.list,
      cta: t.roleSelection.hr.cta,
    },
    {
      id: "teamLeader",
      icon: Target,
      role: t.roleSelection.teamLeader.role,
      title: t.roleSelection.teamLeader.title,
      list: t.roleSelection.teamLeader.list,
      cta: t.roleSelection.teamLeader.cta,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-primary border-b border-white/5 relative">
      <div className="container-default max-w-[1200px]">
        
        {/* Header - Calm & Direct */}
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {t.roleSelection.title}
            </h2>
            <p className="text-brand-text-on-dark text-lg leading-relaxed font-medium">
                {t.roleSelection.subtitle}
            </p>
            {t.roleSelection.benefits && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-sm text-brand-text-on-dark font-semibold">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} onClick={scrollToLead} />
          ))}

        </div>
      </div>
    </section>
  );
}

type RoleCardProps = {
  role: RoleCardConfig;
  onClick: () => void;
};

function RoleCard({ role, onClick }: RoleCardProps) {
  const Icon = role.icon;

  return (
    <button 
      onClick={onClick}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-2xl text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-accent/10 items-center"
    >
      {/* Subtle Top Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:via-white opacity-30 group-hover:opacity-80 transition-all" />
      
      <div className="flex flex-col items-center mb-6 md:mb-8 gap-3 md:gap-4 w-full">
        <div className="p-3 md:p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:bg-brand-accent/20 transition-all shadow-inner">
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-brand-accent group-hover:text-white transition-colors" />
        </div>
        <span className="text-base md:text-lg font-bold uppercase tracking-widest text-brand-accent group-hover:text-white transition-colors text-center">
          {role.role}
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center group-hover:text-white transition-colors tracking-tight leading-tight">
        {role.title}
      </h3>
      
      <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-brand-text-on-dark text-sm font-semibold leading-relaxed flex-1 w-full">
        {role.list.map((item, index) => {
          const ItemIcon = listIcons[index] || BarChart;
          return (
            <li key={index} className="flex gap-3 items-start">
              <ItemIcon className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-white transition-colors mt-0.5" />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center text-white font-semibold text-sm group-hover:translate-x-1 duration-300 border-t border-white/10 pt-4 w-full">
        {role.cta}
        <ChevronRight className="w-4 h-4 ml-auto text-brand-accent group-hover:text-white transition-colors" />
      </div>
    </button>
  );
}
