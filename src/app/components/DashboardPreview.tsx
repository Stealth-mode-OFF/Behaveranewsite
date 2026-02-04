import React from "react";
import { Eye, Zap, ShieldAlert } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
// TODO: Replace with AI Assistant screenshot when available in src/assets (e.g. ai-assistant.png)
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

export function DashboardPreview() {
  const { t } = useLanguage();

  const icons = [Eye, ShieldAlert, Zap];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="preview">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      
      <div className="container-default relative z-10">
        
        {/* Header - The "Why" behind the screen */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold text-brand-text-muted tracking-widest uppercase">
                        {t.dashboard.badge}
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary tracking-tight leading-tight">
                    {t.dashboard.title}
                    <span className="block text-brand-primary mt-2">{t.dashboard.titleHighlight}</span>
                </h2>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md text-left md:text-right mt-6 md:mt-0"
            >
                <p className="text-lg text-brand-text-secondary leading-relaxed">
                    {t.dashboard.subtitle}
                </p>
            </motion.div>
        </div>

        {/* The Dashboard - Rigid Container */}
        <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="relative rounded-xl overflow-hidden shadow-2xl shadow-brand-primary/10 border border-brand-border bg-brand-background-secondary mb-20 max-w-6xl mx-auto ring-1 ring-brand-primary/5 group"
        >
             <img 
                src={dashboardPreview} 
                alt="Echo Pulse Main Dashboard" 
                className="w-full h-auto block transform group-hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>

        {/* Key Capabilities Grid - Calm & Technical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto border-t border-brand-border pt-12">
            {t.dashboard.features.map((feature, index) => {
                const Icon = icons[index];
                return (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex gap-5 items-start group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-brand-background-secondary border border-brand-border flex items-center justify-center shrink-0 text-brand-primary shadow-sm mt-1 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-brand-text-primary mb-2 text-base group-hover:text-brand-primary transition-colors">{feature.title}</h3>
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>

      </div>
    </section>
  );
}
