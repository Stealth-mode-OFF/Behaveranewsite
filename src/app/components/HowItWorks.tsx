import React from "react";
import { Link, Radio, Rocket } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

export function HowItWorks() {
  const { t } = useLanguage();

  const icons = [Link, Radio, Rocket];
  const colors = [
    { bg: "from-blue-500/10 to-blue-600/5", border: "border-blue-500/20", icon: "text-blue-600" },
    { bg: "from-violet-500/10 to-violet-600/5", border: "border-violet-500/20", icon: "text-violet-600" },
    { bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20", icon: "text-emerald-600" },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-brand-primary/10 mb-10 shadow-lg shadow-brand-primary/5"
          >
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {t.howItWorks.badge}
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary tracking-[-0.015em] leading-[1.1] mb-8"
          >
            {t.howItWorks.title} <br />
            <span className="text-gradient-animate">{t.howItWorks.titleHighlight}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-brand-text-secondary leading-[1.7] font-medium"
          >
            {t.howItWorks.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Link, step: "01", content: t.howItWorks.steps.step1 },
            { icon: Radio, step: "02", content: t.howItWorks.steps.step2 },
            { icon: Rocket, step: "03", content: t.howItWorks.steps.step3 },
          ].map((item, index) => {
            const Icon = item.icon;
            const color = colors[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="card-premium bg-white border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${color.bg} rounded-xl flex items-center justify-center ${color.border} border ${color.icon}`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">
                    {t.howItWorks.stepLabel} {item.step}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-text-primary tracking-[-0.01em]">{item.content.title}</h3>
                <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
                  {item.content.desc}
                </p>
                
                {/* Progress indicator line */}
                <div className="mt-auto pt-4">
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${((index + 1) / 3) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
                      className={`h-full bg-gradient-to-r ${color.bg.replace('/10', '/60').replace('/5', '/40')}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
