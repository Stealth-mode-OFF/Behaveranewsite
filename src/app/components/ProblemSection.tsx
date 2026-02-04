import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

// Cost data - enterprise-grade presentation
const costData = {
  en: {
    sectionLabel: "THE HIDDEN COST",
    title: "What you can't see is already affecting results",
    cells: [
      { label: "Disengaged employees", value: "67%", unit: "of workforce", desc: "Quiet quitting costs $450B+ annually in the US alone", source: "Gallup 2023" },
      { label: "Average replacement cost", value: "1.5–2×", unit: "annual salary", desc: "For specialized and leadership roles", source: "SHRM" },
      { label: "Warning window", value: "6–9", unit: "months", desc: "Signals visible before departure—if monitored", source: "Research synthesis" },
      { label: "Manager attribution", value: "70%", unit: "variance", desc: "Team engagement variance explained by direct manager", source: "Gallup Q12" },
    ],
  },
  cz: {
    sectionLabel: "SKRYTÉ NÁKLADY",
    title: "Co nevidíte, už ovlivňuje výsledky",
    cells: [
      { label: "Neangažovaných zaměstnanců", value: "67%", unit: "pracovní síly", desc: "Quiet quitting stojí $450B+ ročně jen v USA", source: "Gallup 2023" },
      { label: "Náklady na náhradu", value: "1,5–2×", unit: "roční mzdy", desc: "U specializovaných a vedoucích pozic", source: "SHRM" },
      { label: "Varovné okno", value: "6–9", unit: "měsíců", desc: "Signály viditelné před odchodem—pokud se monitorují", source: "Syntéza výzkumu" },
      { label: "Vliv manažera", value: "70%", unit: "variace", desc: "Variace engagement vysvětlená přímým nadřízeným", source: "Gallup Q12" },
    ],
  },
  de: {
    sectionLabel: "VERSTECKTE KOSTEN",
    title: "Was Sie nicht sehen, beeinflusst bereits die Ergebnisse",
    cells: [
      { label: "Unengagierte Mitarbeiter", value: "67%", unit: "der Belegschaft", desc: "Quiet Quitting kostet $450B+ jährlich allein in den USA", source: "Gallup 2023" },
      { label: "Ersatzkosten", value: "1,5–2×", unit: "Jahresgehalt", desc: "Für spezialisierte und Führungsrollen", source: "SHRM" },
      { label: "Warnfenster", value: "6–9", unit: "Monate", desc: "Signale sichtbar vor Abgang—wenn überwacht", source: "Forschungssynthese" },
      { label: "Manager-Zuschreibung", value: "70%", unit: "Varianz", desc: "Team-Engagement-Varianz erklärt durch direkten Vorgesetzten", source: "Gallup Q12" },
    ],
  },
};

export function ProblemSection() {
  const { language } = useLanguage();
  const data = costData[language] || costData.en;

  return (
    <section className="py-24 md:py-32 bg-white" id="problem">
      <div className="container-default">
        
        {/* Section Header - Minimal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
            <span className="font-mono text-xs font-medium tracking-[0.15em] text-[#71717A] uppercase">
              {data.sectionLabel}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0A0A0F] tracking-[-0.02em] max-w-3xl">
            {data.title}
          </h2>
        </motion.div>

        {/* Data Grid - Enterprise Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E5E5] border border-[#E5E5E5]">
          {data.cells.map((cell, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 md:p-10 flex flex-col"
            >
              {/* Label */}
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA] mb-8">
                {cell.label}
              </span>
              
              {/* Value + Unit */}
              <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-4xl md:text-5xl font-semibold text-[#0A0A0F] tracking-tight tabular-nums">
                    {cell.value}
                  </span>
                  <span className="text-sm text-[#71717A]">{cell.unit}</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-[#52525B] leading-relaxed mb-4">
                  {cell.desc}
                </p>
                
                {/* Source */}
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                  {cell.source}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
