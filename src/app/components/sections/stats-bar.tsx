import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { Users, TrendingUp, Zap, MessageSquare, Mail } from "lucide-react";

/**
 * Stats Bar — Fathom-inspired key metrics section
 * 
 * 3 large animated stats in a clean row right after the logo marquee.
 * Animated counters that count up when in view.
 */

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { 
  end: number; suffix?: string; prefix?: string; duration?: number 
}) {
  // Start with the real value so crawlers / slow renders never show "0"
  const [count, setCount] = useState(end);
  const [blur, setBlur] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    // Start from ~85% of target — subtle roll-up, never a frantic race from 0
    const startFrom = Math.round(end * 0.85);
    setCount(startFrom);
    setBlur(3); // start slightly blurred

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gentle ease-out: fast initial movement, long soft settling
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(startFrom + (end - startFrom) * eased));
      // Blur goes from 3px -> 0 in the first 60% of animation
      setBlur(Math.max(0, 3 * (1 - progress / 0.6)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    // Small delay so the fade-in starts before counting
    setTimeout(() => requestAnimationFrame(animate), 120);
  }, [inView, end, duration]);

  return (
    <span 
      ref={ref}
      style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined, transition: 'filter 0.1s' }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

type Stat = {
  icon: typeof Users;
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
};

export function StatsBar() {
  const { language } = useLanguage();

  const stats: Record<string, Stat[]> = {
    cz: [
      {
        icon: Users,
        value: 50000,
        prefix: "",
        suffix: "+",
        label: "otestovaných lidí",
        description: "ve firmách od 30 do 500 zaměstnanců",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "návratnost",
        description: "u firem 50–300 lidí, první měsíc",
      },
      {
        icon: Zap,
        value: 2,
        prefix: "",
        suffix: " min",
        label: "na vyplnění",
        description: "a výsledky okamžitě v dashboardu",
      },
    ],
    en: [
      {
        icon: Users,
        value: 50000,
        prefix: "",
        suffix: "+",
        label: "people assessed",
        description: "in companies from 30 to 500 employees",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "completion rate",
        description: "companies 50–300 people, first month",
      },
      {
        icon: Zap,
        value: 2,
        prefix: "",
        suffix: " min",
        label: "to complete",
        description: "with results instantly in your dashboard",
      },
    ],
    de: [
      {
        icon: Users,
        value: 50000,
        prefix: "",
        suffix: "+",
        label: "getestete Personen",
        description: "in Unternehmen von 30 bis 500 Mitarbeitenden",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "Rücklaufquote",
        description: "Firmen 50–300 MA, erster Monat",
      },
      {
        icon: Zap,
        value: 2,
        prefix: "",
        suffix: " Min",
        label: "zum Ausfüllen",
        description: "mit sofortigen Ergebnissen im Dashboard",
      },
    ],
  };

  const integrationsCopy = {
    cz: "Funguje přes Slack, MS Teams nebo e-mail. Žádný nový software.",
    en: "Works via Slack, MS Teams, or email. No new software.",
    de: "Funktioniert über Slack, MS Teams oder E-Mail. Keine neue Software.",
  };

  const items = stats[language] || stats.en;

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent_70%)]" />
      
      <div className="container-default relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-brand-border">
          {items.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-center px-6 md:px-10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/5 mb-4">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-brand-text-primary tracking-tight mb-2 font-display">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix}
                    duration={stat.value > 100 ? 3000 : 1800} 
                  />
                </div>
                <div className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-brand-text-muted">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Integration strip — early "no new software" proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-brand-border/50 flex flex-wrap items-center justify-center gap-4 text-sm text-brand-text-muted"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-primary/60" />
            <span className="font-medium">Slack</span>
          </div>
          <span className="text-brand-border">·</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary/60" />
            <span className="font-medium">MS Teams</span>
          </div>
          <span className="text-brand-border">·</span>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-brand-primary/60" />
            <span className="font-medium">E-mail</span>
          </div>
          <span className="hidden sm:inline text-brand-border">|</span>
          <span>{integrationsCopy[language] || integrationsCopy.en}</span>
        </motion.div>
      </div>
    </section>
  );
}
