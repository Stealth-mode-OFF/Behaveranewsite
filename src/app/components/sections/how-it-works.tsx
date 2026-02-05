import React from "react";
import { Link, Radio, Rocket } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-10 shadow-sm">
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {t.howItWorks.badge}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-brand-text-primary tracking-[-0.015em] leading-[1.1] mb-8">
            {t.howItWorks.title} <br />
            <span className="text-brand-primary">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-xl text-brand-text-secondary leading-[1.7] font-medium">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-brand-primary/20">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-background-secondary rounded-xl flex items-center justify-center border border-brand-primary/10 text-brand-primary">
                <Link className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">
                {t.howItWorks.stepLabel} 01
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-text-primary tracking-[-0.01em]">{t.howItWorks.steps.step1.title}</h3>
            <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
              {t.howItWorks.steps.step1.desc}
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-brand-primary/20">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-background-secondary rounded-xl flex items-center justify-center border border-brand-primary/10 text-brand-primary">
                <Radio className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">
                {t.howItWorks.stepLabel} 02
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-text-primary tracking-[-0.01em]">{t.howItWorks.steps.step2.title}</h3>
            <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
              {t.howItWorks.steps.step2.desc}
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-brand-primary/20">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-background-secondary rounded-xl flex items-center justify-center border border-brand-primary/10 text-brand-primary">
                <Rocket className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">
                {t.howItWorks.stepLabel} 03
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-text-primary tracking-[-0.01em]">{t.howItWorks.steps.step3.title}</h3>
            <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
              {t.howItWorks.steps.step3.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
