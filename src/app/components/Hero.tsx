import React from "react";
import { useLanguage } from "../LanguageContext";
import { Button } from "./ui/button";
import { Play, ChevronRight, CheckCircle2 } from "lucide-react";
import { useModal } from "../ModalContext";

const dashboardPreview = "/assets/dashboard-preview.svg";

export function Hero() {
  const { openBooking } = useModal();
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-24 bg-[#0a0a0a] text-white overflow-hidden border-b border-white/5" id="hero">
      
      {/* Background - Technical Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          {/* Subtle vignetting for focus */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      </div>

      <div className="container-default relative z-10 flex flex-col items-center">
        
        {/* The Badge - System Status Style */}
        <div className="flex items-center gap-3 mb-8 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 cursor-default">
            <div className="relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping opacity-75"></div>
            </div>
            <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-slate-300">
                {t.hero.badge}
            </span>
        </div>

        {/* The Headline - Precise & Measured */}
        <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-2xl">
                {t.hero.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">{t.hero.titleHighlight}</span>
            </h1>
        </div>

        {/* The Subhead - Low Cognitive Load */}
        <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-lg md:text-xl text-slate-400 font-normal leading-relaxed antialiased">
                {t.hero.subtitle}
            </p>
        </div>

        {/* Action Buttons - Clear Hierarchy */}
        <div className="flex flex-col items-center gap-6 mb-16">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
                 <Button 
                    onClick={openBooking}
                    className="h-14 px-10 bg-white text-slate-900 hover:bg-slate-200 text-lg font-bold rounded-lg transition-all min-w-[220px] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105"
                  >
                    {t.hero.primaryCta}
                    <ChevronRight className="w-5 h-5 ml-2 opacity-80" />
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    className="h-14 px-8 text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white text-base font-medium rounded-lg transition-all min-w-[160px]"
                  >
                    <Play className="w-4 h-4 mr-2 opacity-60" />
                    {t.hero.secondaryCta}
                  </Button>
            </div>
            {/* Risk Reversal */}
            <p className="text-sm text-slate-400 font-medium opacity-80">
                {t.hero.riskReversal}
            </p>
        </div>

        {/* Trust Signals - Integrated Data Points */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-20 py-8 border-y border-white/5 w-full max-w-4xl bg-white/[0.02] rounded-full">
            <div className="flex items-center gap-2.5 group">
                <CheckCircle2 className="w-5 h-5 text-brand-primary/80 group-hover:text-brand-primary transition-colors" />
                <span className="text-sm text-slate-400 font-medium tracking-wide group-hover:text-slate-200 transition-colors">{t.hero.trust.security}</span>
            </div>
             <div className="flex items-center gap-2.5 group">
                <CheckCircle2 className="w-5 h-5 text-brand-primary/80 group-hover:text-brand-primary transition-colors" />
                <span className="text-sm text-slate-400 font-medium tracking-wide group-hover:text-slate-200 transition-colors">{t.hero.trust.support}</span>
            </div>
             <div className="flex items-center gap-2.5 group">
                <CheckCircle2 className="w-5 h-5 text-brand-primary/80 group-hover:text-brand-primary transition-colors" />
                <span className="text-sm text-slate-400 font-medium tracking-wide group-hover:text-slate-200 transition-colors">{t.hero.trust.implementation}</span>
            </div>
        </div>

        {/* The Dashboard - Technical Frame */}
        <div className="relative w-full max-w-6xl mx-auto perspective-1000 group">
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#15171e] shadow-[0_0_50px_-10px_rgba(59,130,246,0.15)] transition-all duration-700 group-hover:shadow-[0_0_70px_-10px_rgba(59,130,246,0.25)] group-hover:border-brand-primary/20">
                {/* Image */}
                 <img 
                    src={dashboardPreview} 
                    alt="Echo Pulse Dashboard Interface" 
                    className="w-full h-auto block opacity-90 transition-opacity group-hover:opacity-100"
                />
                {/* Screen Glare/Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                
                {/* Active Scan Line Animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" style={{ animationDuration: '3s' }} />
            </div>
        </div>

      </div>
    </section>
  );
}
