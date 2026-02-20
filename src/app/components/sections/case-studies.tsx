import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Quote, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CmsService } from "@/lib/cms-service";
import { CaseStudy } from "@/lib/types";
import { sanitizeHtml } from "@/lib/sanitize";
import { useLanguage } from "@/app/contexts/language-context";
import { HOME_SECTION_IDS } from "@/app/config/routes";
import { cn } from "@/app/components/ui/utils";

// Logo imports
import effectixLogo from "@/assets/clients/effectix.png";
import growRangersLogo from "@/assets/clients/grow-rangers.png";
import hajdukPartnersLogo from "@/assets/clients/hajduk-partners.png";
import lidlLogo from "@/assets/clients/lidl.png";
import martinusLogo from "@/assets/clients/martinus.png";
import medevioLogo from "@/assets/clients/medevio.png";
import notinoLogo from "@/assets/clients/notino.png";
import o2Logo from "@/assets/clients/o2.png";
import optimioLogo from "@/assets/clients/optimio.png";
import prusaLogo from "@/assets/clients/prusa.png";
import pwcLogo from "@/assets/clients/pwc.png";
import raynetLogo from "@/assets/clients/raynet.png";
import socialmindLogo from "@/assets/clients/socialmind.png";
import sprinxLogo from "@/assets/clients/sprinx.png";
import startupjobsLogo from "@/assets/clients/startupjobs.png";
import teyaLogo from "@/assets/clients/teya.png";
import valxonLogo from "@/assets/clients/valxon.png";
import vodafoneLogo from "@/assets/clients/vodafone.png";
import websupportLogo from "@/assets/clients/websupport.png";
import logo365 from "@/assets/clients/365.svg";
import expandoLogo from "@/assets/clients/expando.svg";

// Map clientName → logo
const LOGO_MAP: Record<string, string> = {

  'Vodafone Czech Republic': vodafoneLogo,
  'Valxon': valxonLogo,
  'Expando': expandoLogo,
  '365.bank': logo365,
  'Effectix': effectixLogo,
  'Grow Rangers': growRangersLogo,
  'Hajduk Partners': hajdukPartnersLogo,
  'Lidl': lidlLogo,
  'Martinus': martinusLogo,
  'Medevio': medevioLogo,
  'Notino': notinoLogo,
  'O2': o2Logo,
  'Optimio': optimioLogo,
  'Prusa Research': prusaLogo,
  'PwC': pwcLogo,
  'Raynet': raynetLogo,
  'Socialmind': socialmindLogo,
  'Sprinx': sprinxLogo,
  'StartupJobs': startupjobsLogo,
  'Teya': teyaLogo,
  'Websupport': websupportLogo,
};

/**
 * Case Studies - 3D Flip Card Design
 * 
 * Front: Logo + Company name + Hero metric + Tags
 * Back: All results + Challenge + Solution + CTA
 */
export function CaseStudiesSection() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCaseSlug, setSelectedCaseSlug] = useState<string | null>(null);
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
      title: "Co říkají",
      titleHighlight: " klienti",
      subtitle: "Konkrétní čísla od skutečných firem.",
      readMore: "Celá případovka",
      cta: "Chcete podobné výsledky?",
      ctaButton: "Domluvit demo",
      showMore: "Zobrazit více případovek",
      showLess: "Zobrazit méně",
      flipHint: "Najeďte pro detail",
    },
    en: {
      badge: "Proven Results",
      title: "What clients",
      titleHighlight: " say",
      subtitle: "Real numbers from real companies.",
      readMore: "Full case study",
      cta: "Want similar results?",
      ctaButton: "Book a demo",
      showMore: "Show more case studies",
      showLess: "Show less",
      flipHint: "Hover for details",
    },
    de: {
      badge: "Bewährte Ergebnisse",
      title: "Was Kunden",
      titleHighlight: " sagen",
      subtitle: "Echte Zahlen von echten Unternehmen.",
      readMore: "Vollständige Fallstudie",
      cta: "Möchten Sie ähnliche Ergebnisse?",
      ctaButton: "Demo buchen",
      showMore: "Mehr Fallstudien anzeigen",
      showLess: "Weniger anzeigen",
      flipHint: "Hover für Details",
    },
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('case');
    if (slug) {
      setSelectedCaseSlug(slug);
    }
  }, []);

  useEffect(() => {
    if (!selectedCaseSlug) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCaseModal();
      }
    };

    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [selectedCaseSlug]);

  const selectedStudy = useMemo(
    () => studies.find((study) => study.slug === selectedCaseSlug) || null,
    [studies, selectedCaseSlug]
  );

  const openCaseModal = (slug: string) => {
    setSelectedCaseSlug(slug);
    const next = new URL(window.location.href);
    next.searchParams.set('case', slug);
    window.history.pushState({}, '', next.toString());
  };

  const closeCaseModal = () => {
    setSelectedCaseSlug(null);
    const next = new URL(window.location.href);
    next.searchParams.delete('case');
    window.history.replaceState({}, '', next.toString());
  };

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
      <section className="section-spacing bg-white" id={HOME_SECTION_IDS.caseStudies}>
        <div className="container-default">
          <div className="animate-pulse">
            <div className="h-10 bg-brand-border rounded w-64 mb-4 mx-auto" />
            <div className="h-6 bg-brand-border rounded w-96 mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-brand-background-secondary border border-brand-border rounded-3xl h-[380px] sm:h-[420px]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (studies.length === 0) return null;

  return (
    <section className="section-spacing bg-white" id={HOME_SECTION_IDS.caseStudies}>
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
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
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
                <FlipCard study={study} readMoreText={t.readMore} flipHint={t.flipHint} index={index} isMobile language={language} onOpenCase={openCaseModal} />
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
                  <FlipCard study={study} readMoreText={t.readMore} flipHint={t.flipHint} index={index} language={language} onOpenCase={openCaseModal} />
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

      <AnimatePresence>
        {selectedStudy && (
          <CaseStudyQuickViewModal
            study={selectedStudy}
            language={language}
            onClose={closeCaseModal}
          />
        )}
      </AnimatePresence>
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
  onOpenCase: (slug: string) => void;
};

const gradients = [
  "from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6]",
  "from-[#1E40AF] via-[#2563EB] to-[#3B82F6]",
  "from-[#B45309] via-[#D97706] to-[#F59E0B]",
];

const accentDots = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-amber-500",
];

function FlipCard({ study, readMoreText, flipHint, index, isMobile, language, onOpenCase }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const gradient = gradients[index % gradients.length];
  const accentDot = accentDots[index % accentDots.length];
  const logo = LOGO_MAP[study.clientName];

  return (
    <div
      className="flip-card-container h-[380px] sm:h-[420px] w-full cursor-pointer"
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
          {/* Full-bleed photo */}
          <img
            src={study.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200'}
            alt={study.clientName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="h-full flex flex-col relative p-6">
            {/* Top: Logo */}
            <div className="flex items-start justify-between">
              {logo ? (
                <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center p-2.5">
                  <img
                    src={logo}
                    alt={study.clientName}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  gradient
                )}>
                  <span className="text-white text-2xl font-bold">
                    {study.clientName.charAt(0)}
                  </span>
                </div>
              )}
              {/* Employee count badge */}
              {study.employeeCount && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
                  <Building2 className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-xs font-semibold text-white">{study.employeeCount}</span>
                </div>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom: Company info + tags */}
            <div>
              <h3 className="text-xl font-bold text-white mb-0.5 drop-shadow-lg">
                {study.clientName}
              </h3>
              <span className="text-sm text-white/70 font-medium">
                {language === 'cz' && study.industry_cz ? study.industry_cz : study.industry || "Enterprise"}
              </span>

              {/* Tags */}
              {study.tags && study.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {study.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Flip hint */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/50 mt-4">
              <Sparkles className="w-3 h-3" />
              <span>{flipHint}</span>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full flex flex-col bg-white rounded-3xl p-6 relative overflow-hidden border border-brand-border/50">
            {/* Decorative blob */}
            <div className={cn(
              "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[70px] opacity-15 bg-gradient-to-br",
              gradient
            )} />

            {/* Header with logo */}
            <div className="relative z-10 flex items-center gap-3 mb-4 pb-3 border-b border-brand-border/30">
              {logo ? (
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm border border-brand-border/30 flex items-center justify-center p-1.5 shrink-0">
                  <img src={logo} alt={study.clientName} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", gradient)}>
                  <span className="text-white text-sm font-bold">{study.clientName.charAt(0)}</span>
                </div>
              )}
              <div className="min-w-0">
                <span className="text-sm font-bold text-brand-text-primary block truncate">{study.clientName}</span>
                <span className="text-[11px] text-brand-text-muted">{language === 'cz' && study.industry_cz ? study.industry_cz : study.industry || "Enterprise"}</span>
              </div>
            </div>

            {/* All results */}
            <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
              {(language === 'cz' && study.results_cz ? study.results_cz : study.results).map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", accentDot)} />
                  <div>
                    <div className="text-base font-bold text-brand-text-primary leading-tight">{r.value}</div>
                    <div className="text-[10px] text-brand-text-muted leading-tight">{r.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Narrative summary */}
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              <div className="flex items-start gap-2 mb-2">
                <Quote className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                <p className="text-[12px] text-brand-text-secondary leading-relaxed line-clamp-4">
                  {language === 'cz' && study.cardSummary_cz ? study.cardSummary_cz : study.cardSummary ? study.cardSummary : study.challenge}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCase(study.slug);
              }}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2.5 mt-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r",
                gradient
              )}
            >
              {readMoreText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function loc<T>(language: string, cz: T | undefined, fallback: T): T {
  return language === 'cz' && cz ? cz : fallback;
}

function CaseStudyQuickViewModal({
  study,
  language,
  onClose,
}: {
  study: CaseStudy;
  language: string;
  onClose: () => void;
}) {
  const title = loc(language, study.title_cz, study.title);
  const challenge = loc(language, study.challenge_cz, study.challenge);
  const solution = loc(language, study.solution_cz, study.solution);
  const industry = loc(language, study.industry_cz, study.industry);
  const results = loc(language, study.results_cz, study.results);
  const content = sanitizeHtml(loc(language, study.content_cz, study.content));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] p-3 sm:p-6 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#090312]/72 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1120px] h-[min(92vh,940px)] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_45px_120px_-45px_rgba(42,18,85,0.85)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-brand-text-primary border border-brand-border hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="h-full overflow-y-auto">
          {study.coverImage && (
            <div className="h-[240px] md:h-[320px] overflow-hidden">
              <img src={study.coverImage} alt={study.clientName} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="max-w-4xl mx-auto p-6 md:p-9">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary uppercase tracking-[0.12em] mb-2">
                <span>{study.clientName}</span>
                <span className="text-brand-text-muted">•</span>
                <span className="text-brand-text-muted">{industry}</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-brand-text-primary leading-tight">{title}</h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {results.map((res, idx) => (
                <div key={idx} className="rounded-xl border border-brand-border/60 bg-brand-background-secondary/40 p-3.5">
                  <div className="text-2xl font-bold text-brand-primary leading-none mb-1">{res.value}</div>
                  <div className="text-xs text-brand-text-muted uppercase tracking-[0.08em]">{res.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div className="rounded-xl border border-brand-border/60 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-brand-text-muted font-semibold mb-2">
                  {language === 'cz' ? 'Výzva' : language === 'de' ? 'Herausforderung' : 'Challenge'}
                </div>
                <p className="text-sm text-brand-text-secondary leading-relaxed">{challenge}</p>
              </div>
              <div className="rounded-xl border border-brand-border/60 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-brand-text-muted font-semibold mb-2">
                  {language === 'cz' ? 'Řešení' : language === 'de' ? 'Lösung' : 'Solution'}
                </div>
                <p className="text-sm text-brand-text-secondary leading-relaxed">{solution}</p>
              </div>
            </div>

            <div className="case-study-content prose prose-lg prose-violet max-w-none text-brand-text-secondary" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
