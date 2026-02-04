import React from "react";
import { Link, Radio, Rocket } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-brand-text-primary tracking-tight leading-[1.1] mb-6">
            {t.howItWorks.title} <br />
            <span className="text-brand-primary">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed font-medium">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-brand-border rounded-lg p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-brand-background-muted rounded flex items-center justify-center border border-brand-border text-brand-primary">
                <Link className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">
                Step 01
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-text-primary">Connect</h3>
            <p className="text-brand-text-secondary leading-relaxed">
              Connect Echo Pulse to Slack or Teams. No IT required. 5-minute setup.
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-brand-background-muted rounded flex items-center justify-center border border-brand-border text-brand-primary">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">
                Step 02
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-text-primary">Listen</h3>
            <p className="text-brand-text-secondary leading-relaxed">
              AI continuously monitors signals from daily work. No surveys needed.
            </p>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-brand-background-muted rounded flex items-center justify-center border border-brand-border text-brand-primary">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">
                Step 03
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-text-primary">Act</h3>
            <p className="text-brand-text-secondary leading-relaxed">
              Receive weekly priority alerts and concrete action recommendations. 100% anonymous.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
