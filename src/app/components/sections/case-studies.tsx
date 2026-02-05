import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CmsService } from "@/lib/cms-service";
import { CaseStudy } from "@/lib/types";
import { useLanguage } from "@/app/LanguageContext";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";

export function CaseStudiesSection() {
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
      title: "Případové studie",
      subtitle: "Konkrétní příběhy firem, které díky Echo Pulse získaly jasnější signály a rychlejší rozhodování.",
      readMore: "Číst případovou studii",
      cta: "Chcete podobné výsledky?",
      ctaButton: "Domluvit konzultaci",
    },
    en: {
      title: "Case Studies",
      subtitle: "Real stories from companies that gained clearer signals and faster decision-making with Echo Pulse.",
      readMore: "Read case study",
      cta: "Want similar results?",
      ctaButton: "Schedule consultation",
    },
    de: {
      title: "Fallstudien",
      subtitle: "Echte Geschichten von Unternehmen, die mit Echo Pulse klarere Signale und schnellere Entscheidungen gewonnen haben.",
      readMore: "Fallstudie lesen",
      cta: "Möchten Sie ähnliche Ergebnisse?",
      ctaButton: "Beratung vereinbaren",
    },
  };

  const t = texts[language] || texts.en;

  // Show loading or empty state
  if (loading) {
    return (
      <section className="section-spacing bg-brand-background-secondary border-t border-brand-border" id="case-studies">
        <div className="container-default">
          <div className="animate-pulse">
            <div className="h-10 bg-brand-border rounded w-64 mb-4"></div>
            <div className="h-6 bg-brand-border rounded w-96 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-brand-border rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (studies.length === 0) return null;

  return (
    <section className="section-spacing bg-brand-background-secondary border-t border-brand-border" id="case-studies">
      <div className="container-default">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studies.map((study) => (
            <Link
              key={study.id}
              to={`/case-studies/${study.slug}`}
              className="group cursor-pointer bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              {study.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.coverImage}
                    alt={study.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">
                  {study.clientName}
                </span>
                <h3 className="text-lg font-bold text-brand-text-primary mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {study.title}
                </h3>
                <p className="text-brand-text-secondary text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {study.challenge}
                </p>
                
                {/* Results preview */}
                {study.results.length > 0 && (
                  <div className="flex gap-4 mb-4 pt-4 border-t border-brand-border">
                    {study.results.slice(0, 2).map((result, idx) => (
                      <div key={idx} className="flex-1">
                        <div className="text-xl font-bold text-brand-primary">{result.value}</div>
                        <div className="text-xs text-brand-text-muted uppercase tracking-wide">{result.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center text-sm font-bold text-brand-primary group-hover:text-brand-primary-hover">
                  {t.readMore}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-brand-text-secondary mb-4">
            {t.cta}
          </p>
          <Button
            onClick={openBooking}
            className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
          >
            {t.ctaButton}
          </Button>
        </div>
      </div>
    </section>
  );
}
