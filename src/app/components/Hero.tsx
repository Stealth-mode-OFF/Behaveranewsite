import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

// Evidence data - from Gallup Q12 Meta-Analysis
const evidenceStats = [
  { value: "183,806", label: "business units studied", labelCz: "zkoumaných týmů", labelDe: "untersuchte Teams" },
  { value: "23%", label: "higher profit (engaged)", labelCz: "vyšší zisk (engagovaní)", labelDe: "höherer Gewinn (engagiert)" },
  { value: "52%", label: "turnover preventable", labelCz: "odchodům šlo zabránit", labelDe: "Fluktuation vermeidbar" },
  { value: "70%", label: "variance = manager", labelCz: "variace = manažer", labelDe: "Varianz = Manager" },
];

export function Hero() {
  const { language } = useLanguage();
  const { openBooking } = useModal();

  // Statement-based hero content
  const statements = {
    en: {
      status: "SYSTEM STATUS: OBSERVING",
      line1: "Most organizations learn about instability",
      line2: "after it becomes visible in results.",
      line3: "By then, the cost is already incurred.",
      solution: "Echo Pulse observes the signals you cannot see.",
      solutionSub: "Continuously. Before they become problems.",
      cta: "Request access",
      source: "Gallup Q12 Meta-Analysis • 3.3M employees • 73 countries",
    },
    cz: {
      status: "STAV SYSTÉMU: MONITOROVÁNÍ",
      line1: "Většina organizací se dozví o nestabilitě,",
      line2: "až když se projeví ve výsledcích.",
      line3: "V tu chvíli už jsou náklady vynaloženy.",
      solution: "Echo Pulse sleduje signály, které nevidíte.",
      solutionSub: "Průběžně. Dřív, než se z nich stanou problémy.",
      cta: "Získat přístup",
      source: "Gallup Q12 Meta-Analysis • 3.3M zaměstnanců • 73 zemí",
    },
    de: {
      status: "SYSTEMSTATUS: ÜBERWACHUNG",
      line1: "Die meisten Organisationen erfahren von Instabilität,",
      line2: "nachdem sie in den Ergebnissen sichtbar wird.",
      line3: "Zu diesem Zeitpunkt sind die Kosten bereits entstanden.",
      solution: "Echo Pulse beobachtet die Signale, die Sie nicht sehen.",
      solutionSub: "Kontinuierlich. Bevor sie zu Problemen werden.",
      cta: "Zugang anfordern",
      source: "Gallup Q12 Meta-Analysis • 3.3M Mitarbeiter • 73 Länder",
    },
  };

  const s = statements[language] || statements.en;

  return (
    <section className="min-h-screen flex flex-col justify-center relative bg-[#FAFAFA]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      <div className="container-default relative z-10 py-32 md:py-40">
        
        {/* Main Content - Statement Based */}
        <div className="max-w-4xl">
          
          {/* System Status - Monospace */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              <span className="font-mono text-xs font-medium tracking-[0.15em] text-[#71717A] uppercase">
                {s.status}
              </span>
            </div>
          </motion.div>

          {/* The Statement - Reality, Not Marketing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-semibold leading-[1.25] text-[#0A0A0F] tracking-[-0.02em]">
              {s.line1}
              <br />
              <span className="text-[#71717A]">{s.line2}</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-[#71717A] font-normal">
              {s.line3}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 h-px bg-[#D4D4D4] mb-12 origin-left"
          />

          {/* The Solution Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-3xl font-semibold text-[#1E3A5F] leading-tight tracking-[-0.01em]">
              {s.solution}
            </p>
            <p className="mt-3 text-lg text-[#3F3F46]">
              {s.solutionSub}
            </p>
          </motion.div>

          {/* Single CTA - High Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              onClick={openBooking}
              className="h-14 px-10 bg-[#1E3A5F] hover:bg-[#152942] text-white font-medium text-base rounded-md transition-colors duration-150"
            >
              {s.cta}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </motion.div>
        </div>

        {/* Evidence Strip - Bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 pt-12 border-t border-[#E5E5E5]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {evidenceStats.map((stat, index) => (
              <div key={index} className="text-left">
                <div className="font-mono text-3xl md:text-4xl font-semibold text-[#0A0A0F] tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-[#71717A] leading-snug">
                  {language === 'cz' ? stat.labelCz : language === 'de' ? stat.labelDe : stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
            {s.source}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
