import React from "react";
import { useLanguage } from "../LanguageContext";
import { MessageCircle, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export function WhyBehavera() {
  const { t } = useLanguage();

  const items = [
    { icon: MessageCircle, color: { bg: "from-rose-500/10 to-rose-600/5", border: "border-rose-500/20", icon: "text-rose-600" } },
    { icon: Zap, color: { bg: "from-amber-500/10 to-amber-600/5", border: "border-amber-500/20", icon: "text-amber-600" } },
    { icon: Target, color: { bg: "from-cyan-500/10 to-cyan-600/5", border: "border-cyan-500/20", icon: "text-cyan-600" } },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white text-brand-text-primary" id="about">
      <div className="container-default max-w-[1120px] mx-auto">
        <div className="max-w-3xl mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-brand-primary/10 mb-10 shadow-lg shadow-brand-primary/5"
          >
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              Why Us
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.015em] mb-6 md:mb-8 text-brand-text-primary leading-[1.1]"
          >
            {t.whyBehavera.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-brand-text-secondary leading-[1.7] font-medium"
          >
            {t.whyBehavera.desc}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-14">
          {t.whyBehavera.points.map((point, index) => {
            const { icon: Icon, color } = items[index];
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative group"
              >
                {/* Decorative gradient blob on hover */}
                <div className={`absolute -inset-4 bg-gradient-to-br ${color.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${color.bg} ${color.border} border flex items-center justify-center mb-6 md:mb-8 ${color.icon}`}
                >
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-text-primary mb-3 md:mb-4 tracking-[-0.01em]">{point.title}</h3>
                <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
                  {point.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
