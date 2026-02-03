import React from "react";
import { MessageSquare, BarChart3, Rocket, Lock } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default">
        
        {/* Header - Left Aligned, Strict Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-end">
             <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-brand-text-primary tracking-tight leading-[1.1] mb-6">
                    {t.howItWorks.title} <br/> 
                    <span className="text-brand-primary">{t.howItWorks.titleHighlight}</span>
                </h2>
                <div className="h-1 w-24 bg-brand-border"></div>
            </div>
            <div className="lg:pl-8">
                <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed font-medium">
                    {t.howItWorks.subtitle}
                </p>
            </div>
        </div>

        {/* The Grid - Strict Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
            
            {/* 1. Contextual AI - Large Vertical Card */}
            <div className="bg-brand-background-secondary border border-brand-border rounded-lg overflow-hidden flex flex-col h-full group hover:border-brand-primary/30 transition-colors">
                <div className="p-8 md:p-10 pb-0">
                    <div className="flex items-center gap-4 mb-6">
                         <div className="w-10 h-10 bg-white border border-brand-border rounded flex items-center justify-center shadow-sm text-brand-primary">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">Step 01</span>
                    </div>
                   
                    <h3 className="text-2xl font-bold text-brand-text-primary mb-4">{t.howItWorks.steps.step1.title}</h3>
                    <p className="text-brand-text-secondary leading-relaxed mb-8 max-w-md">
                        {t.howItWorks.steps.step1.desc}
                    </p>
                </div>
                <div className="mt-auto border-t border-brand-border bg-white h-full relative overflow-hidden">
                    <img 
                        src="/assets/negative-insights.svg" 
                        alt="AI Detected Issues Interface" 
                        className="w-[85%] mx-auto h-auto object-cover object-top shadow-2xl shadow-brand-primary/10 rounded-t-lg mt-8 opacity-100 group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Right Column Stack */}
            <div className="flex flex-col gap-8 h-full">
                
                {/* 2. Auto-Pilot - Compact Horizontal Layout */}
                <div className="bg-white border border-brand-border rounded-lg overflow-hidden flex flex-col md:flex-row h-full min-h-[320px] group hover:shadow-lg hover:shadow-brand-primary/5 transition-all">
                    {/* Text Column */}
                    <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-center">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-brand-background-muted rounded flex items-center justify-center border border-brand-border text-brand-primary">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">Step 02</span>
                         </div>
                         
                         <h3 className="text-xl font-bold mb-4 text-brand-text-primary">{t.howItWorks.steps.step2.title}</h3>
                         <div className="space-y-4 text-brand-text-secondary text-sm leading-relaxed">
                            <p>
                                {t.howItWorks.steps.step2.desc}
                            </p>
                         </div>
                    </div>

                    {/* Image Column - Strictly Contained */}
                    <div className="md:w-1/2 bg-brand-background-secondary relative overflow-hidden flex items-center justify-center p-8">
                         <img 
                            src="/assets/mobile-dashboard.svg" 
                            alt="Mobile Dashboard Interface" 
                            className="w-full max-w-[200px] shadow-2xl shadow-brand-primary/10 rounded transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500" 
                        />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[240px]">
                    
                    {/* 3. Action Plans */}
                    <div className="bg-white border border-brand-border rounded-lg p-8 flex flex-col justify-between hover:border-brand-primary/30 transition-colors group">
                         <div>
                            <div className="flex items-center justify-between mb-6">
                                <Rocket className="w-8 h-8 text-brand-primary p-1.5 bg-brand-background-muted rounded" />
                                <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">Step 03</span>
                            </div>
                            <h3 className="font-bold text-brand-text-primary text-lg mb-2">{t.howItWorks.steps.step3.title}</h3>
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                                {t.howItWorks.steps.step3.desc}
                            </p>
                         </div>
                    </div>

                    {/* 4. Privacy */}
                    <div className="bg-brand-background-secondary border border-brand-border rounded-lg p-8 flex flex-col justify-between hover:border-brand-primary/30 transition-colors">
                         <div>
                             <div className="flex items-center justify-between mb-6">
                                <Lock className="w-8 h-8 text-brand-text-muted p-1.5 bg-white border border-brand-border rounded" />
                                <span className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-widest">Step 04</span>
                            </div>
                            <h3 className="font-bold text-brand-text-primary text-lg mb-2">{t.howItWorks.steps.step4.title}</h3>
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                                {t.howItWorks.steps.step4.desc}
                            </p>
                         </div>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
