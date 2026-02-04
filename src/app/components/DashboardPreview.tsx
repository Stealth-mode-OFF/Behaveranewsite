import React from "react";
import { Eye, Zap, ShieldAlert, Play } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useModal } from "../ModalContext";
import { motion } from "framer-motion";
// TODO: Replace with AI Assistant screenshot when available in src/assets (e.g. ai-assistant.png)
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

export function DashboardPreview() {
  const { t } = useLanguage();
  const { openVideo } = useModal();

  const icons = [Eye, ShieldAlert, Zap];

  return (
    <section className="py-32 bg-white relative overflow-hidden" id="preview">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
      
      <div className="container-default max-w-[1120px] mx-auto px-4 relative z-10">
        
        {/* Header - The "Why" behind the screen */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 max-w-full">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold text-brand-text-muted tracking-[0.15em] uppercase">
                        {t.dashboard.badge}
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-text-primary tracking-[-0.015em] leading-[1.15]">
                    {t.dashboard.title}
                    <span className="block text-brand-primary mt-3">{t.dashboard.titleHighlight}</span>
                </h2>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md text-left md:text-right mt-8 md:mt-0"
            >
                <p className="text-lg text-brand-text-secondary leading-[1.7] font-medium">
                    {t.dashboard.subtitle}
                </p>
            </motion.div>
        </div>

        {/* The Dashboard - Clickable for Demo */}
        <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-border/40 bg-brand-background-secondary mb-24 max-w-full ring-1 ring-brand-primary/5 group cursor-pointer"
             onClick={openVideo}
             role="button"
             tabIndex={0}
             onKeyDown={(e) => e.key === 'Enter' && openVideo()}
             aria-label="Watch product demo"
        >
             <img 
                src={dashboardPreview} 
                alt="Echo Pulse Main Dashboard" 
                className="w-full h-auto block transform group-hover:scale-[1.005] transition-transform duration-700"
            />
            
            {/* Play Overlay - Shows on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-brand-primary ml-1" />
                </div>
                <span className="text-white font-semibold text-lg drop-shadow-lg">
                  {t.dashboard.watchDemo || "Přehrát demo"}
                </span>
              </div>
            </div>
            
            {/* Subtle play indicator - Always visible */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg text-brand-primary font-medium text-sm opacity-90 group-hover:opacity-0 transition-opacity border border-brand-border/30">
              <Play className="w-4 h-4" />
              {t.dashboard.watchDemo || "Přehrát demo"}
            </div>
        </motion.div>

        {/* Key Capabilities Grid - Calm & Technical */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-full border-t border-brand-border pt-16">
                        {t.dashboard.features
                            .filter(Boolean)
                            .map((feature: any, index: number) => {
                                if (!feature?.title) return null;
                                const Icon = icons[index] || Eye;
                                return (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex gap-6 items-start group"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-brand-background-secondary border border-brand-border flex items-center justify-center shrink-0 text-brand-primary shadow-sm mt-1 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-brand-text-primary mb-3 text-lg group-hover:text-brand-primary transition-colors">{feature.title}</h3>
                                            <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
                                                {feature.desc || ''}
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
