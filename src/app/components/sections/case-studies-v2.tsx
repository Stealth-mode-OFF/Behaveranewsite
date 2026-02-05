import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, Clock, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { CmsService } from "@/lib/cms-service";
import { CaseStudy } from "@/lib/types";
import { useLanguage } from "@/app/LanguageContext";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

/**
 * Case Studies V2 - iPad Pro Level Design
 * 
 * Features:
 * - Large metric cards as hero element
 * - Company logos/names prominently displayed
 * - Quote from client
 * - Minimal, confident design
 */
export function CaseStudiesSectionV2() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { openBooking } = useModal();

  useEffect(() => {
    CmsService.getCaseStudies()
      .then((data) => {
        setStudies(data.filter(Boolean).filter((s) => s.status === "published").slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const texts = {
    cz: {
      badge: "Ověřené výsledky",
      title: "Co říkají klienti",
      subtitle: "Konkrétní čísla od skutečných firem.",
      readMore: "Celá případovka",
      cta: "Chcete podobné výsledky?",
      ctaButton: "Domluvit konzultaci",
      allCases: "Všechny případové studie",
    },
    en: {
      badge: "Proven Results",
      title: "What clients say",
      subtitle: "Real numbers from real companies.",
      readMore: "Full case study",
      cta: "Want similar results?",
      ctaButton: "Schedule consultation",
      allCases: "All case studies",
    },
    de: {
      badge: "Bewährte Ergebnisse",
      title: "Was Kunden sagen",
      subtitle: "Echte Zahlen von echten Unternehmen.",
      readMore: "Vollständige Fallstudie",
      cta: "Möchten Sie ähnliche Ergebnisse?",
      ctaButton: "Beratung vereinbaren",
      allCases: "Alle Fallstudien",
    },
  };

  const t = texts[language] || texts.en;

  // Loading skeleton
  if (loading) {
    return (
      <section className="section-spacing bg-white" id="case-studies">
        <div className="container-default">
          <div className="animate-pulse">
            <div className="h-10 bg-brand-border rounded w-64 mb-4 mx-auto"></div>
            <div className="h-6 bg-brand-border rounded w-96 mb-12 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-brand-background-secondary border border-brand-border rounded-3xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (studies.length === 0) return null;

  return (
    <section className="section-spacing bg-white" id="case-studies">
      <div className="container-default max-w-[1200px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-brand-text-muted tracking-[0.15em] uppercase">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {studies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <CaseStudyCard study={study} readMoreText={t.readMore} index={index} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-brand-background-secondary rounded-2xl border border-brand-border">
            <p className="text-brand-text-primary font-semibold">
              {t.cta}
            </p>
            <Button
              onClick={openBooking}
              className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl"
            >
              {t.ctaButton}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type CaseStudyCardProps = {
  study: CaseStudy;
  readMoreText: string;
  index: number;
};

function CaseStudyCard({ study, readMoreText, index }: CaseStudyCardProps) {
  // Color variants for cards
  const cardColors = [
    "from-violet-50 to-purple-50 border-violet-100",
    "from-blue-50 to-cyan-50 border-blue-100", 
    "from-amber-50 to-orange-50 border-amber-100",
  ];

  const accentColors = [
    "text-violet-600 bg-violet-100",
    "text-blue-600 bg-blue-100",
    "text-amber-600 bg-amber-100",
  ];

  return (
    <Link
      to={`/case-studies/${study.slug}`}
      className={cn(
        "group flex flex-col h-full bg-gradient-to-br rounded-3xl border p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        cardColors[index % cardColors.length]
      )}
    >
      {/* Company Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          accentColors[index % accentColors.length]
        )}>
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-bold text-brand-text-primary block">
            {study.clientName}
          </span>
          <span className="text-xs text-brand-text-muted">
            {study.industry || "Enterprise"}
          </span>
        </div>
      </div>

      {/* Headline Result - The Hero */}
      {study.results.length > 0 && (
        <div className="mb-6 pb-6 border-b border-brand-border/50">
          <div className="text-4xl sm:text-5xl font-bold text-brand-text-primary mb-1">
            {study.results[0].value}
          </div>
          <div className="text-sm text-brand-text-secondary font-medium">
            {study.results[0].label}
          </div>
        </div>
      )}

      {/* Secondary Results */}
      {study.results.length > 1 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {study.results.slice(1, 3).map((result, idx) => (
            <div key={idx}>
              <div className="text-xl font-bold text-brand-text-primary">
                {result.value}
              </div>
              <div className="text-xs text-brand-text-muted">
                {result.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote or Challenge */}
      <p className="text-sm text-brand-text-secondary leading-relaxed flex-1 mb-6 line-clamp-3">
        "{study.challenge}"
      </p>

      {/* Read More */}
      <div className="flex items-center text-sm font-bold text-brand-primary group-hover:text-brand-primary-hover mt-auto">
        {readMoreText}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
