import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/contexts/language-context";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Heart, BarChart3, Users, Zap } from "lucide-react";
import pwcLogo from "@/assets/clients/pwc.webp";
import vodafoneLogo from "@/assets/clients/vodafone.webp";
import notinoLogo from "@/assets/clients/notino.webp";
import o2Logo from "@/assets/clients/o2.webp";
import lidlLogo from "@/assets/clients/lidl.webp";
import prusaLogo from "@/assets/clients/prusa.webp";
import teyaLogo from "@/assets/clients/teya.webp";
import martinusLogo from "@/assets/clients/martinus.webp";
import startupjobsLogo from "@/assets/clients/startupjobs.webp";
import raynetLogo from "@/assets/clients/raynet.webp";
import growRangersLogo from "@/assets/clients/grow-rangers.webp";
import logo365 from "@/assets/clients/365.svg";
import expandoLogo from "@/assets/clients/expando.svg";

import { StatChip } from "@/app/components/ui/stat-chip";

// Export logos for reuse in other components
export const clientLogos = [
  { name: "PwC", src: pwcLogo },
  { name: "Vodafone", src: vodafoneLogo },
  { name: "Notino", src: notinoLogo },
  { name: "O2", src: o2Logo },
  { name: "Lidl", src: lidlLogo },
  { name: "Prusa", src: prusaLogo },
  { name: "Teya", src: teyaLogo },
  { name: "Martinus", src: martinusLogo },
  { name: "StartupJobs", src: startupjobsLogo },
  { name: "Raynet", src: raynetLogo },
  { name: "Grow Rangers", src: growRangersLogo },
  { name: "365", src: logo365 },
  { name: "Expando", src: expandoLogo },
];

export function LogoMarquee() {
  const { language } = useLanguage();

  const title = {
    cz: "Používají firmy jako",
    en: "Used by companies like",
    de: "Verwendet von Unternehmen wie",
  };

  return (
    <section className="section-spacing-compact bg-white border-b border-brand-border relative z-20 overflow-hidden">
      <div className="container-default">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-5 md:mb-6"
        >
          <h2 className="text-center text-sm font-medium text-brand-text-muted uppercase tracking-widest">
            {title[language] || title.en}
          </h2>
        </motion.div>
        
        {/* Mobile: 2-row calm logo grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-4 gap-x-2 gap-y-3 items-center justify-items-center">
            {clientLogos.slice(0, 8).map((logo, index) => (
              <div
                key={index}
                className="w-[72px] h-[32px] flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="max-w-full max-h-full w-auto h-auto object-contain grayscale opacity-50"
                  loading="lazy"
                  width={72}
                  height={32}
                />
              </div>
            ))}
          </div>
          {/* Overflow row for remaining logos */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {clientLogos.slice(8).map((logo, index) => (
              <div
                key={`extra-${index}`}
                className="w-[64px] h-[28px] flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="max-w-full max-h-full w-auto h-auto object-contain grayscale opacity-50"
                  loading="lazy"
                  width={64}
                  height={28}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Marquee */}
        <div className="hidden md:block relative marquee-container">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="w-full inline-flex flex-nowrap overflow-hidden">
            <ul className="flex items-center [&_li]:mx-6 md:[&_li]:mx-10 animate-infinite-scroll shrink-0">
              {clientLogos.map((logo, index) => (
                <li key={index} className="shrink-0">
                  <div className="w-[120px] h-[44px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      className="max-w-full max-h-full w-auto h-auto object-contain grayscale opacity-60 transition-all duration-300"
                      loading="lazy"
                      width={120}
                      height={44}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <ul className="flex items-center [&_li]:mx-6 md:[&_li]:mx-10 animate-infinite-scroll shrink-0" aria-hidden="true">
              {clientLogos.map((logo, index) => (
                <li key={`duplicate-${index}`} className="shrink-0">
                  <div className="w-[120px] h-[44px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt=""
                      className="max-w-full max-h-full w-auto h-auto object-contain grayscale opacity-60 transition-all duration-300"
                      loading="lazy"
                      width={120}
                      height={44}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Animated Stats Row */}
        <StatsRow language={language} />

        {/* Proof Chips — tighter on mobile */}
        <ProofChips language={language} />
      </div>
    </section>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: {
  end: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [count, setCount] = useState(end);
  const [blur, setBlur] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startFrom = Math.round(end * 0.85);
    setCount(startFrom);
    setBlur(3);
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(startFrom + (end - startFrom) * eased));
      setBlur(Math.max(0, 3 * (1 - progress / 0.6)));
      if (progress < 1) requestAnimationFrame(animate);
    };
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

/* ─── Stats Row ─── */
type StatItem = { icon: typeof Users; value: number; prefix: string; suffix: string; label: string };

function StatsRow({ language }: { language: string }) {
  const stats: Record<string, StatItem[]> = {
    cz: [
      { icon: Users, value: 50000, prefix: "", suffix: "+", label: "otestovaných lidí" },
      { icon: TrendingUp, value: 80, prefix: "", suffix: "%+", label: "návratnost" },
      { icon: Zap, value: 2, prefix: "", suffix: " min", label: "na vyplnění" },
    ],
    en: [
      { icon: Users, value: 50000, prefix: "", suffix: "+", label: "people assessed" },
      { icon: TrendingUp, value: 80, prefix: "", suffix: "%+", label: "completion rate" },
      { icon: Zap, value: 2, prefix: "", suffix: " min", label: "to complete" },
    ],
    de: [
      { icon: Users, value: 50000, prefix: "", suffix: "+", label: "getestete Personen" },
      { icon: TrendingUp, value: 80, prefix: "", suffix: "%+", label: "Rücklaufquote" },
      { icon: Zap, value: 2, prefix: "", suffix: " Min", label: "zum Ausfüllen" },
    ],
  };

  const items = stats[language] || stats.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 mt-6 md:mt-8 py-4 border-t border-brand-border/50"
    >
      {items.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon className="w-4 h-4 text-brand-primary/60" />
              <span className="text-xl sm:text-2xl font-bold text-brand-text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  duration={stat.value > 100 ? 3000 : 1800}
                />
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-brand-text-muted uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Proof Chips ─── */
type ProofChip = { icon: typeof TrendingUp; metric: string; label: string; company: string };

function ProofChips({ language }: { language: string }) {
  const chips: Record<string, ProofChip[]> = {
    cz: [
      { icon: TrendingUp, metric: "+37 %", label: "nárůst prodeje klientů", company: "Expando" },
      { icon: Heart, metric: "+25 %", label: "spokojenost zaměstnanců", company: "Valxon" },
      { icon: BarChart3, metric: "60 %", label: "míra zapojení, 1 000+ lidí", company: "Prusa Research" },
    ],
    en: [
      { icon: TrendingUp, metric: "+37%", label: "client sales increase", company: "Expando" },
      { icon: Heart, metric: "+25%", label: "employee satisfaction", company: "Valxon" },
      { icon: BarChart3, metric: "60%", label: "response rate, 1,000+ people", company: "Prusa Research" },
    ],
    de: [
      { icon: TrendingUp, metric: "+37 %", label: "Kundenumsatz-Steigerung", company: "Expando" },
      { icon: Heart, metric: "+25 %", label: "Mitarbeiterzufriedenheit", company: "Valxon" },
      { icon: BarChart3, metric: "60 %", label: "Rücklaufquote, 1.000+ MA", company: "Prusa Research" },
    ],
  };

  const items = chips[language] || chips.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 md:mt-6"
    >
      {items.map((chip, idx) => (
        <StatChip
          key={idx}
          icon={chip.icon}
          metric={chip.metric}
          label={chip.label}
          company={chip.company}
        />
      ))}
    </motion.div>
  );
}
