import React from "react";
import { useLanguage } from "../LanguageContext";
import { MessageCircle, Zap, Target } from "lucide-react";

export function WhyBehavera() {
  const { t } = useLanguage();

  const icons = [MessageCircle, Zap, Target];

  return (
    <section className="section-spacing bg-slate-900 text-white" id="about">
      <div className="container-default">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-white">
            {t.whyBehavera.title}
          </h2>
          <p className="text-body text-slate-400">
            {t.whyBehavera.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {t.whyBehavera.points.map((point, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="relative">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-h3 text-white mb-3">{point.title}</h3>
                <p className="text-body text-slate-400">
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
