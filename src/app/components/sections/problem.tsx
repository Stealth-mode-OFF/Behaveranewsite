import { AlertTriangle, TrendingDown, EyeOff, ZapOff, ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { motion } from "framer-motion";
import { cn } from "@/app/components/ui/utils";

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
      accent: "bg-gradient-to-br from-slate-50 to-slate-100",
    },
    { 
      index: 1, 
      icon: ZapOff,
      size: "medium" as const,
      accent: "bg-gradient-to-br from-red-50 to-rose-100",
      valueColor: "text-brand-error",
    },
    { 
      index: 2, 
      icon: TrendingDown,
      size: "medium" as const,
      accent: "bg-gradient-to-br from-amber-50 to-orange-100",
    },
  ];

  return (
    <section className="section-spacing bg-white text-brand-text-primary" id="problem">
      <div className="container-default">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-error font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
              <div className="w-2 h-2 bg-brand-error rounded-full animate-pulse" />
              {t.problems?.badge || "The Problem"}
            </div>
            <h2 className="text-h2 text-brand-text-primary">
              {t.problems?.title || "People don't leave"}
              <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
                {t.problems?.titleHighlight || " overnight."}
              </span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-md text-left md:text-right mt-8 md:mt-0"
          >
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              {t.problems?.subtitle || "These numbers represent the hidden costs of poor visibility."}
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Large Feature Cell (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
              transition={{ delay: idx * 0.05 }}
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

          {/* CTA Cell */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-full min-h-[200px] rounded-3xl bg-gradient-to-br from-brand-primary via-brand-primary to-[#1a0a3e] p-6 md:p-8 flex flex-col justify-start text-white relative overflow-hidden group">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 mb-4 flex justify-center">
                <AlertTriangle className="w-6 h-6 text-brand-accent" />
              </div>
              
              <div className="relative z-10 text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 block mb-2">
                  {t.problems?.ctaBox?.label || "System Alert"}
                </span>
                <h4 className="text-lg font-bold tracking-tight mb-3">
                  {t.problems?.ctaBox?.title || "Don't wait until it's too late"}
                </h4>
                <p className="text-sm text-white/80 mb-4">
                  {t.problems?.ctaBox?.desc || "Get visibility before the damage is done."}
                </p>
                <a
                  href="https://app.behavera.com/echo-pulse/try"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-accent font-semibold inline-flex items-center group/btn"
                >
                  {language === 'cz' ? 'Otestovat zdarma' : language === 'de' ? 'Kostenlos testen' : 'Try for free'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </a>
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
};

function BentoCell({ item, icon: Icon, size, accent, valueColor }: BentoCellProps) {
  return (
    <div className={cn(
      "h-full rounded-3xl p-4 md:p-6 flex flex-col justify-start border border-brand-border/50 group hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300",
      accent || "bg-brand-background-secondary",
      size === "large" ? "min-h-[160px] lg:min-h-[180px]" : "min-h-[120px]"
    )}>
      <div className="mb-4 flex justify-center">
        <Icon className="w-6 h-6 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
      </div>
      
      <div className="text-left">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted block mb-2">
          {item?.title || ""}
        </span>
        {/* Animated Counter */}
        <div className={cn(
          "font-bold tracking-tight mb-2 transition-colors",
          size === "large" ? "text-h2" : "text-h3",
          valueColor || "text-brand-text-primary"
        )}>
          {item?.value || ""}
        </div>
        
        <p className="text-base text-brand-text-secondary leading-relaxed">
          {item?.desc || ""}
        </p>
      </div>
    </div>
  );
}
