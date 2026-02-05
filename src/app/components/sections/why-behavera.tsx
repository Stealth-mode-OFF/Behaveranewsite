import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { MessageCircle, Zap, Target } from "lucide-react";

export function WhyBehavera() {
  const { t } = useLanguage();

  const icons = [MessageCircle, Zap, Target];

  return (
    <section className="section-spacing bg-white text-brand-text-primary" id="about">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="max-w-3xl mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-10 shadow-sm">
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              Why Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.015em] mb-6 md:mb-8 text-brand-text-primary leading-[1.1]">
            {t.whyBehavera.title}
          </h2>
          <p className="text-xl text-brand-text-secondary leading-[1.7] font-medium">
            {t.whyBehavera.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-14">
          {t.whyBehavera.points.map((point, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-brand-background-secondary border border-brand-primary/10 flex items-center justify-center mb-6 md:mb-8 text-brand-primary">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-text-primary mb-3 md:mb-4 tracking-[-0.01em]">{point.title}</h3>
                <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
