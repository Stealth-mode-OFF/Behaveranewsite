import React from 'react';
import { useLanguage } from '@/app/LanguageContext';
import { Radio, Cpu, Zap } from 'lucide-react';

export function MethodologySection() {
  const { t } = useLanguage();

  const icons = [Radio, Cpu, Zap];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-brand-primary text-white border-y border-white/5">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full border border-white/20 mb-10 backdrop-blur-sm">
            <span className="font-mono text-[11px] font-bold text-white tracking-[0.15em] uppercase">
              Our Method
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.015em] mb-6 md:mb-8 leading-[1.1]">
            {t.methodology.title}
          </h2>
          <p className="text-xl text-brand-text-inverse-secondary leading-[1.7] font-medium">
            {t.methodology.subtitle}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Visual Connection System (Desktop) */}
          <div className="absolute top-14 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
          
          {t.methodology.cards
            .filter(Boolean)
            .map((card: any, index: number) => {
              if (!card?.title) return null;
              const Icon = icons[index] || Radio;
              return (
                <div key={index} className="group relative bg-white/5 p-6 md:p-10 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all hover:-translate-y-1 duration-300 z-10">
                
                {/* Step Number - Process Indicator */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 text-4xl md:text-5xl font-black text-white/[0.03] font-mono select-none group-hover:text-white/[0.06] transition-colors">
                    0{index + 1}
                </div>

                <div className="relative w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 md:mb-8 text-brand-accent border border-white/5 shadow-inner group-hover:shadow-[0_0_15px_rgba(167,139,250,0.3)] transition-all">
                  <div className="absolute inset-0 bg-brand-accent/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 group-hover:text-white transition-colors tracking-[-0.01em]">{card.title}</h3>
                <p className="text-brand-text-inverse-secondary leading-[1.7] text-[15px]">
                  {card.desc || ''}
                </p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
