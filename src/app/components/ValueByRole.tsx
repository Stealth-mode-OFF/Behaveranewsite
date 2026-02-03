import React from "react";
import { Check, Shield, Users, Target, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

export function ValueByRole() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-t border-brand-border relative overflow-hidden" id="value-by-role">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
      <div className="absolute -left-20 top-40 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-40 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-default relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-6 tracking-tight">
                {t.valueByRole.title}
            </h2>
            <p className="text-brand-text-secondary text-lg leading-relaxed">
                {t.valueByRole.subtitle}
            </p>
        </div>

        {/* The Comparative Grid - Using Flexbox for smooth expansion animation */}
        <div className="flex flex-col lg:flex-row gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/5 max-w-6xl mx-auto ring-1 ring-brand-border">
            
            {/* CEO Column - Strategic / Light Purple Mode */}
            <motion.div 
                initial={{ flex: 1 }}
                whileHover={{ flex: 1.2 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-brand-background-secondary p-10 md:p-14 flex flex-col relative group min-h-[600px] border-b lg:border-b-0 lg:border-r border-brand-border w-full lg:w-auto"
            >
                {/* Subtle gradient sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-white rounded-xl text-brand-primary border border-brand-border shadow-sm">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-text-primary uppercase tracking-wider mb-1 flex items-center gap-2">
                            {t.valueByRole.ceo.title}
                            <ArrowUpRight className="w-4 h-4 opacity-50" />
                        </h3>
                        <div className="h-0.5 w-12 bg-brand-primary" />
                    </div>
                </div>

                <div className="mb-12 flex-1 relative z-10">
                    <p className="text-brand-text-secondary text-lg md:text-xl font-medium leading-relaxed">
                        {t.valueByRole.ceo.desc}
                    </p>
                </div>

                <div className="border-t border-brand-border pt-10 relative z-10">
                    <ul className="space-y-6">
                        {t.valueByRole.ceo.list.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group/item">
                                <div className="mt-1.5 p-1 rounded-full bg-brand-primary/10 text-brand-primary shrink-0 group-hover/item:bg-brand-primary group-hover/item:text-white transition-colors">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <strong className="block text-brand-text-primary text-base font-bold uppercase tracking-wide mb-1 group-hover/item:text-brand-primary transition-colors">{item.title}</strong>
                                    <p className="text-sm text-brand-text-muted leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>

            {/* HR Column - Operational / Pure White Mode */}
            <motion.div 
                 initial={{ flex: 1 }}
                 whileHover={{ flex: 1.2 }}
                 transition={{ duration: 0.4, ease: "easeInOut" }}
                 className="bg-white p-10 md:p-14 flex flex-col relative group min-h-[600px] w-full lg:w-auto"
            >
                 <div className="absolute inset-0 bg-gradient-to-bl from-brand-background-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                 <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-brand-background-muted border border-brand-border rounded-xl text-brand-text-muted">
                        <Users className="w-6 h-6" />
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-brand-text-primary uppercase tracking-wider mb-1 flex items-center gap-2">
                            {t.valueByRole.hr.title}
                             <ArrowUpRight className="w-4 h-4 opacity-50" />
                        </h3>
                        <div className="h-0.5 w-12 bg-brand-border-strong" />
                    </div>
                </div>

                 <div className="mb-12 flex-1 relative z-10">
                    <p className="text-brand-text-secondary text-lg md:text-xl font-medium leading-relaxed">
                        {t.valueByRole.hr.desc}
                    </p>
                </div>

                <div className="border-t border-brand-border pt-10 relative z-10">
                    <ul className="space-y-6">
                        {t.valueByRole.hr.list.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group/item">
                                <div className="mt-1.5 p-1 rounded-full bg-brand-background-muted text-brand-text-muted shrink-0 group-hover/item:bg-brand-text-muted group-hover/item:text-white transition-colors">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <strong className="block text-brand-text-primary text-base font-bold uppercase tracking-wide mb-1 group-hover/item:text-brand-text-muted transition-colors">{item.title}</strong>
                                    <p className="text-sm text-brand-text-muted leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>

        </div>

        {/* Bottom Stabilizer */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full text-xs font-bold text-brand-text-muted border border-brand-border uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-3.5 h-3.5 text-brand-primary" />
                <span>{t.valueByRole.bottomBadge}</span>
            </div>
        </div>

      </div>
    </section>
  );
}
