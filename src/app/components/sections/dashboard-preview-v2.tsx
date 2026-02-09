import React from "react";
import { Eye, Zap, ShieldAlert, Bot, Target } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { useModal } from "@/app/ModalContext";
import { motion } from "framer-motion";
import { SnapCarousel, FeatureGrid } from "@/app/components/ui/snap-carousel";
// iPad App Screenshots - CZ version
import screenshotBenefitsCz from "@/assets/IMG_2149.webp";
import screenshotAICz from "@/assets/IMG_2152.webp";
import screenshotValuesCz from "@/assets/IMG_2153.webp";
// iPad App Screenshots - EN version
import screenshotBenefitsEn from "@/assets/IMG_2156.webp";
import screenshotAIEn from "@/assets/IMG_2157.webp";
import screenshotValuesEn from "@/assets/IMG_2158.webp";

/**
 * Dashboard Preview V2 - iPad Pro Level Design
 * 
 * Features:
 * - Snap-scroll carousel for multiple dashboard views
 * - Animated feature grid below
 * - Seamless video integration
 */
export function DashboardPreviewV2() {
  const { t, language } = useLanguage();
  const { openVideo } = useModal();

  // Select screenshots based on language (CZ gets Czech, EN/DE get English)
  const screenshotBenefits = language === 'cz' ? screenshotBenefitsCz : screenshotBenefitsEn;
  const screenshotAI = language === 'cz' ? screenshotAICz : screenshotAIEn;
  const screenshotValues = language === 'cz' ? screenshotValuesCz : screenshotValuesEn;

  // Three iPad screenshots for carousel
  const slides = [
    {
      id: "benefits-view",
      image: screenshotBenefits,
      title: language === 'cz' ? "Benefity & Engagement" : language === 'de' ? "Benefits & Engagement" : "Benefits & Engagement",
      description: language === 'cz' 
        ? "Sledujte engagement index a rozložení napříč týmy v reálném čase."
        : language === 'de'
        ? "Verfolgen Sie den Engagement-Index und die Teamverteilung in Echtzeit."
        : "Track engagement index and team distribution in real-time.",
      badge: language === 'cz' ? "Echo Pulse" : "Echo Pulse",
    },
    {
      id: "ai-assistant",
      image: screenshotAI,
      title: language === 'cz' ? "AI Asistent" : language === 'de' ? "KI-Assistent" : "AI Assistant",
      description: language === 'cz' 
        ? "Získejte okamžité insights a konkrétní akční doporučení od AI."
        : language === 'de'
        ? "Erhalten Sie sofortige Einblicke und konkrete Handlungsempfehlungen von KI."
        : "Get instant insights and actionable recommendations from AI.",
      badge: language === 'cz' ? "AI Powered" : "AI Powered",
    },
    {
      id: "values-view",
      image: screenshotValues,
      title: language === 'cz' ? "Hodnoty & Priority" : language === 'de' ? "Werte & Prioritäten" : "Values & Priorities",
      description: language === 'cz' 
        ? "Analyzujte firemní hodnoty a priority s rychlými akcemi pro management."
        : language === 'de'
        ? "Analysieren Sie Unternehmenswerte und Prioritäten mit schnellen Aktionen für das Management."
        : "Analyze company values and priorities with quick actions for management.",
      badge: language === 'cz' ? "Trendy" : "Trends",
    },
  ];

  const icons = [Eye, ShieldAlert, Zap];
  
  const features = (t.dashboard?.features || [])
    .filter(Boolean)
    .map((feature: any, index: number) => ({
      icon: React.createElement(icons[index] || Eye, { className: "w-6 h-6" }),
      title: feature?.title || '',
      description: feature?.desc || '',
    }))
    .filter((f: any) => f.title);

  return (
    <section className="section-spacing bg-white relative overflow-hidden" id="preview">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
      
      <div className="container-default max-w-[1120px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20">
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
                {t.dashboard?.badge}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary tracking-[-0.015em] leading-[1.15]">
              {t.dashboard?.title}
              <span className="block text-brand-primary mt-3">{t.dashboard?.titleHighlight}</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-left md:text-right mt-8 md:mt-0"
          >
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              {t.dashboard?.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <SnapCarousel 
            slides={slides}
            onSlideClick={openVideo}
            autoplayInterval={6000}
          />
        </motion.div>

        {/* Feature Grid */}
        {features.length > 0 && (
          <FeatureGrid features={features} />
        )}

      </div>
    </section>
  );
}
