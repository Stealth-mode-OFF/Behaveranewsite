import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Radio, Cpu, Zap } from 'lucide-react';

export function MethodologySection() {
  const { t } = useLanguage();

  const icons = [Radio, Cpu, Zap];

  return (
    <section className="py-24 bg-brand-primary text-white border-y border-white/5">
      <div className="container-default">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {t.methodology.title}
          </h2>
          <p className="text-lg text-indigo-200 leading-relaxed">
            {t.methodology.subtitle}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Visual Connection System (Desktop) */}
          <div className="absolute top-14 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
          
          {t.methodology.cards.map((card: any, index: number) => {
            const Icon = icons[index];
            return (
              <div key={index} className="group relative bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all hover:-translate-y-1 duration-300 z-10">
                
                {/* Step Number - Process Indicator */}
                <div className="absolute top-4 right-6 text-4xl font-black text-white/[0.03] font-mono select-none group-hover:text-white/[0.06] transition-colors">
                    0{index + 1}
                </div>

                <div className="relative w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-brand-accent border border-white/5 shadow-inner group-hover:shadow-[0_0_15px_rgba(167,139,250,0.3)] transition-all">
                  <div className="absolute inset-0 bg-brand-accent/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon className="w-6 h-6 relative z-10" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{card.title}</h3>
                <p className="text-indigo-200 leading-relaxed text-sm md:text-base">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
