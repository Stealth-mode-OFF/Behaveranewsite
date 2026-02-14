import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { Users, TrendingUp, Zap } from "lucide-react";

/**
 * Stats Bar — Fathom-inspired key metrics section
 * 
 * 3 large animated stats in a clean row right after the logo marquee.
 * Animated counters that count up when in view.
 */

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { 
  end: number; suffix?: string; prefix?: string; duration?: number 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
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
        description: "věří Echo Pulse se zpětnou vazbou",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "návratnost dotazníků",
        description: "díky AI chat formátu místo formulářů",
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
        description: "trust Echo Pulse with their feedback",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "completion rate",
        description: "thanks to AI chat format over forms",
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
        description: "vertrauen Echo Pulse mit ihrem Feedback",
      },
      {
        icon: TrendingUp,
        value: 80,
        prefix: "",
        suffix: "%+",
        label: "Rücklaufquote",
        description: "dank AI-Chat-Format statt Formularen",
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
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                    duration={stat.value > 100 ? 2500 : 1500} 
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
      </div>
    </section>
  );
}
