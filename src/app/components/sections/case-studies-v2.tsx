import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CmsService } from "@/lib/cms-service";
import { CaseStudy } from "@/lib/types";
import { useLanguage } from "@/app/LanguageContext";
import { cn } from "@/app/components/ui/utils";

/**
 * Case Studies V2 - 3D Flip Card Design
 * 
 * Features:
 * - 3D card flip on hover (front: visual + basics, back: details)
 * - Glassmorphism & gradient accents
 * - Smooth perspective transitions
 * - Mobile: tap to flip
 */
export function CaseStudiesSectionV2() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    CmsService.getCaseStudies()
      .then((data) => {
        setStudies(data.filter(Boolean).filter((s) => s.status === "published"));
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
      showMore: "Zobrazit více případovek",
      showLess: "Zobrazit méně",
      flipHint: "Najeďte pro detail",
    },
    en: {
      badge: "Proven Results",
      title: "What clients say",
      subtitle: "Real numbers from real companies.",
      readMore: "Full case study",
      cta: "Want similar results?",
      ctaButton: "Schedule consultation",
      showMore: "Show more case studies",
      showLess: "Show less",
      flipHint: "Hover for details",
    },
    de: {
      badge: "Bewährte Ergebnisse",
      title: "Was Kunden sagen",
      subtitle: "Echte Zahlen von echten Unternehmen.",
      readMore: "Vollständige Fallstudie",
      cta: "Möchten Sie ähnliche Ergebnisse?",
      ctaButton: "Beratung vereinbaren",
      showMore: "Mehr Fallstudien anzeigen",
      showLess: "Weniger anzeigen",
      flipHint: "Hover für Details",
    },
  };

  const t = texts[language] || texts.en;

  const visibleStudies = isExpanded ? studies : studies.slice(0, 3);
  const hasMoreStudies = studies.length > 3;

  // Carousel navigation
  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll('.case-study-card');
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveIndex(index);
      }
    }
  };

  if (loading) {
    return (
      <section className="section-spacing bg-white" id="case-studies">
        <div className="container-default">
          <div className="animate-pulse">
            <div className="h-10 bg-brand-border rounded w-64 mb-4 mx-auto" />
            <div className="h-6 bg-brand-border rounded w-96 mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-brand-background-secondary border border-brand-border rounded-3xl h-[420px]" />
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Mobile: Horizontal Carousel */}
        <div className="md:hidden relative">
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollLeft = container.scrollLeft;
              const cardWidth = container.offsetWidth * 0.85;
              const newIndex = Math.round(scrollLeft / cardWidth);
              setActiveIndex(Math.min(newIndex, studies.length - 1));
            }}
          >
            {studies.map((study, index) => (
              <motion.div
                key={study.id}
                className="case-study-card flex-shrink-0 w-[85%] snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FlipCard study={study} readMoreText={t.readMore} flipHint={t.flipHint} index={index} isMobile language={language} />
              </motion.div>
            ))}
          </div>

          {studies.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
                className={cn(
                  "p-2 rounded-full border border-brand-border bg-white shadow-sm transition-all",
                  activeIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-brand-background-secondary hover:shadow-md"
                )}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-brand-primary" />
              </button>
              <div className="flex gap-2">
                {studies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === activeIndex ? "w-6 bg-brand-primary" : "bg-brand-border hover:bg-brand-accent"
                    )}
                    aria-label={`Go to ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollToCard(Math.min(activeIndex + 1, studies.length - 1))}
                disabled={activeIndex === studies.length - 1}
                className={cn(
                  "p-2 rounded-full border border-brand-border bg-white shadow-sm transition-all",
                  activeIndex === studies.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-brand-background-secondary hover:shadow-md"
                )}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-brand-primary" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:block">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index < 3 ? index * 0.1 : (index - 3) * 0.1 + 0.1, layout: { duration: 0.3 } }}
                >
                  <FlipCard study={study} readMoreText={t.readMore} flipHint={t.flipHint} index={index} language={language} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {hasMoreStudies && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "group inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all duration-300",
                  "bg-gradient-to-br from-brand-background-secondary to-white",
                  "border-brand-border hover:border-brand-accent",
                  "hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                <span className="text-brand-text-primary font-semibold">
                  {isExpanded ? t.showLess : t.showMore}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
                {!isExpanded && (
                  <span className="text-sm text-brand-text-muted">+{studies.length - 3}</span>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Flip Card ─── */

type FlipCardProps = {
  study: CaseStudy;
  readMoreText: string;
  flipHint: string;
  index: number;
  isMobile?: boolean;
  language: string;
};

const gradients = [
  "from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6]",
  "from-[#1E40AF] via-[#2563EB] to-[#3B82F6]",
  "from-[#B45309] via-[#D97706] to-[#F59E0B]",
];

const bgPatterns = [
  "from-violet-50 via-purple-50 to-fuchsia-50",
  "from-blue-50 via-sky-50 to-cyan-50",
  "from-amber-50 via-orange-50 to-yellow-50",
];

function FlipCard({ study, readMoreText, flipHint, index, isMobile, language }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const gradient = gradients[index % gradients.length];
  const bgPattern = bgPatterns[index % bgPatterns.length];

  return (
    <div
      className="flip-card-container h-[420px] w-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => !isMobile && setFlipped(true)}
      onMouseLeave={() => !isMobile && setFlipped(false)}
      onClick={() => isMobile && setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={cn(
            "h-full flex flex-col justify-between bg-gradient-to-br border border-brand-border/40 rounded-3xl relative overflow-hidden",
            bgPattern
          )}>
            {/* Decorative gradient blob */}
            <div className={cn(
              "absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-30 bg-gradient-to-br",
              gradient
            )} />
            <div className={cn(
              "absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-[60px] opacity-20 bg-gradient-to-br",
              gradient
            )} />

            {/* Top: Cover image or gradient header */}
            <div className={cn(
              "relative h-[160px] flex items-end p-6 overflow-hidden"
            )}>
              {study.coverImage ? (
                <>
                  <img
                    src={study.coverImage}
                    alt={study.clientName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </>
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-base block leading-tight drop-shadow-lg">
                    {study.clientName}
                  </span>
                  <span className="text-white/70 text-xs">
                    {study.industry || "Enterprise"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Hero metric */}
            <div className="px-6 pt-5 pb-2 flex-1 relative z-10">
              {study.results.length > 0 && (
                <div className="mb-4">
                  <div className={cn(
                    "text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r mb-1",
                    gradient
                  )}>
                    {study.results[0].value}
                  </div>
                  <div className="text-sm text-brand-text-secondary font-medium">
                    {study.results[0].label}
                  </div>
                </div>
              )}

              {/* Secondary results */}
              {study.results.length > 1 && (
                <div className="flex gap-6">
                  {study.results.slice(1, 3).map((r, i) => (
                    <div key={i}>
                      <div className="text-lg font-bold text-brand-text-primary">{r.value}</div>
                      <div className="text-[11px] text-brand-text-muted">{r.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: hint */}
            <div className="px-6 pb-5 relative z-10">
              <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{flipHint}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className={cn(
            "h-full flex flex-col bg-gradient-to-br rounded-3xl p-6 relative overflow-hidden border border-brand-border/40",
            bgPattern
          )}>
            {/* Decorative blob */}
            <div className={cn(
              "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[70px] opacity-20 bg-gradient-to-br",
              gradient
            )} />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-5 pb-4 border-b border-brand-border/40">
              <div className={cn(
                "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center",
                gradient
              )}>
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-brand-text-primary block">{study.clientName}</span>
                <span className="text-[11px] text-brand-text-muted">{study.industry || "Enterprise"}</span>
              </div>
            </div>

            {/* Challenge */}
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-start gap-2 mb-3">
                <Quote className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <p className="text-sm text-brand-text-secondary leading-relaxed line-clamp-4">
                  {study.challenge}
                </p>
              </div>

              {/* Solution preview */}
              {study.solution && (
                <div className="mt-auto mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-text-muted block mb-1.5">
                    {language === 'cz' ? 'Řešení' : language === 'de' ? 'Lösung' : 'Solution'}
                  </span>
                  <p className="text-[13px] text-brand-text-body leading-relaxed line-clamp-3">
                    {study.solution}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              to={`/case-studies/${study.slug}`}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r",
                gradient
              )}
            >
              {readMoreText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
