import { AlertTriangle, TrendingDown, EyeOff, ZapOff, ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/components/ui/utils";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Problem Section - Bento Grid Style
 * 
 * Features:
 * - Apple-style Bento grid layout
 * - Varied cell sizes for visual hierarchy
 * - Animated stat counters
 * - CTA cell with gradient
 */
export function ProblemSection() {
  const { t, language } = useLanguage();


  // Extract items from translations
  const items = Array.isArray(t.problems?.items) ? t.problems.items : [];
  
  // Bento grid data
  const cells = [
    { 
      index: 0, 
      icon: EyeOff,
      size: "large" as const, // 2x2 on desktop
      accent: "bg-gradient-to-br from-brand-background-secondary to-brand-background-muted",
    },
    { 
      index: 1, 
      icon: ZapOff,
      size: "medium" as const,
      accent: "bg-gradient-to-br from-red-50 to-red-100",
      valueColor: "text-brand-error",
    },
    { 
      index: 2, 
      icon: TrendingDown,
      size: "medium" as const,
      accent: "bg-gradient-to-br from-amber-50 to-amber-100",
    },
  ];

  return (
    <section className="section-spacing bg-brand-background-secondary text-brand-text-primary" id="problem">
      <div className="container-default">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="section-badge text-brand-error">
            <span className="w-2 h-2 bg-brand-error rounded-full animate-pulse" />
            {t.problems?.badge}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {t.problems?.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.problems?.titleHighlight}
            </span>
          </h2>
          <p className="text-body-lg text-brand-text-secondary leading-relaxed mb-10 md:mb-14">
            {t.problems?.subtitle}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Large Feature Cell (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: MOTION_EASE }}
            className="md:col-span-2 lg:col-span-2"
          >
            <BentoCell
              item={items[0]}
              icon={cells[0].icon}
              size="large"
              accent={cells[0].accent}
            />
          </motion.div>

          {/* Medium Cells */}
          {cells.slice(1).map((cell, idx) => (
            <motion.div
              key={cell.index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3, ease: MOTION_EASE }}
            >
              <BentoCell
                item={items[cell.index]}
                icon={cell.icon}
                size="medium"
                accent={cell.accent}
                valueColor={cell.valueColor}
              />
            </motion.div>
          ))}

          {/* CTA Cell — full width on desktop second row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.3, ease: MOTION_EASE }}
            className="md:col-span-2 lg:col-span-4"
          >
            <div className="h-full min-h-[120px] rounded-3xl bg-gradient-to-br from-brand-primary via-brand-primary to-brand-background-dark p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:gap-8 justify-start text-white relative overflow-hidden group">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 mb-4 lg:mb-0 flex justify-center lg:justify-start shrink-0">
                <AlertTriangle className="w-6 h-6 text-brand-accent" />
              </div>

              <div className="relative z-10 text-left flex-1">
                <span className="text-badge font-bold uppercase tracking-[0.12em] text-white/60 block mb-1">
                  {t.problems?.ctaBox?.label}
                </span>
                <h4 className="text-h4 tracking-tight mb-1.5">
                  {t.problems?.ctaBox?.title}
                </h4>
                <p className="text-body-sm text-white/80">
                  {t.problems?.ctaBox?.desc}
                </p>
              </div>
              <div className="relative z-10 mt-4 lg:mt-0 shrink-0">
                <Button asChild size="default" variant="inverse" className="w-full sm:w-auto">
                  <a
                    href="https://app.behavera.com/echo-pulse/try"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {language === 'cz' ? 'Otestovat zdarma' : language === 'de' ? 'Kostenlos testen' : 'Try for free'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type BentoCellProps = {
  item?: {
    title?: string;
    value?: string;
    desc?: string;
  };
  icon: LucideIcon;
  size: "large" | "medium";
  accent?: string;
  valueColor?: string;
  detailLabel?: string;
};

function BentoCell({ item, icon: Icon, size, accent, valueColor, detailLabel }: BentoCellProps) {
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage();
  const expandLabel = detailLabel || (language === 'cz' ? 'Zobrazit detail' : language === 'de' ? 'Details anzeigen' : 'Show details');
  const rawDesc = item?.desc || "";
  // Split out source citation from description
  const sourceMatch = rawDesc.match(/\s*\[?(Zdroj|Source|Quelle):\s*([^\]]+)\]?\.?\s*$/i);
  const descText = sourceMatch ? rawDesc.slice(0, sourceMatch.index).trim() : rawDesc;
  const sourceText = sourceMatch ? `${sourceMatch[1]}: ${sourceMatch[2].trim()}` : null;
  // Only show expand/collapse if description is long enough to warrant it
  const hasLongDesc = descText.length > 80;

  return (
    <div className={cn(
      "h-full rounded-3xl p-4 md:p-6 flex flex-col justify-start border border-brand-border/50 group hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300",
      accent || "bg-brand-background-secondary",
      size === "large" ? "min-h-[140px] md:min-h-[160px] lg:min-h-[180px]" : "min-h-[110px] md:min-h-[120px]"
    )}>
      <div className="mb-3 md:mb-4 flex justify-center">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-text-muted group-hover:text-brand-primary transition-colors duration-200" />
      </div>
      
      <div className="text-left">
        <span className="text-badge font-bold uppercase tracking-[0.12em] text-brand-text-muted block mb-1.5 md:mb-2">
          {item?.title || ""}
        </span>
        {/* Animated Counter */}
        <div className={cn(
          "font-bold tracking-tight mb-1.5 md:mb-2 transition-colors duration-200",
          size === "large" ? "text-h2" : "text-h3",
          valueColor || "text-brand-text-primary"
        )}>
          {item?.value || ""}
        </div>
        
        {/* Desktop: always show full text. Mobile: progressive disclosure */}
        <p className="hidden md:block text-base text-brand-text-secondary leading-relaxed">
          {descText}
        </p>
        {sourceText && (
          <p className="hidden md:block text-xs text-brand-text-muted mt-2">{sourceText}</p>
        )}
        
        {/* Mobile: truncated with expand */}
        <div className="md:hidden">
          {hasLongDesc ? (
            <>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: MOTION_EASE }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                      {descText}
                    </p>
                    {sourceText && (
                      <p className="text-xs text-brand-text-muted mt-1.5">{sourceText}</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.p
                    key="short"
                    className="text-sm text-brand-text-secondary leading-relaxed line-clamp-2"
                  >
                    {descText}
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                className="mt-1.5 inline-flex items-center gap-1 text-caption font-semibold text-brand-primary hover:text-brand-accent transition-colors duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2"
              >
                {expanded ? (language === 'cz' ? 'Skrýt' : language === 'de' ? 'Weniger' : 'Less') : expandLabel}
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", expanded && "rotate-180")} />
              </button>
            </>
          ) : (
            <p className="text-sm text-brand-text-secondary leading-relaxed">
              {descText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
