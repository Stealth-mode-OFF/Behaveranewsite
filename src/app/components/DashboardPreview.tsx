import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import dashboardPreview from "../../assets/57784f33eede4d7388f560072042dfccbed29cab.png";

// Control surface annotations
const annotations = {
  en: {
    sectionLabel: "INTERFACE",
    title: "A control surface, not a report",
    subtitle: "Real-time organizational state, continuously updated.",
    features: [
      { label: "Signal detection", value: "Continuous", desc: "Pattern recognition across behavioral vectors" },
      { label: "Risk classification", value: "Automated", desc: "Machine-scored severity across all monitored dimensions" },
      { label: "Action priority", value: "Hierarchical", desc: "Intervention points ranked by predicted impact" },
    ],
  },
  cz: {
    sectionLabel: "ROZHRANÍ",
    title: "Kontrolní panel, ne reporty",
    subtitle: "Stav organizace v reálném čase, průběžně aktualizovaný.",
    features: [
      { label: "Detekce signálů", value: "Průběžná", desc: "Rozpoznávání vzorců napříč behaviorálními vektory" },
      { label: "Klasifikace rizik", value: "Automatizovaná", desc: "Strojově hodnocená závažnost ve všech sledovaných dimenzích" },
      { label: "Priorita akcí", value: "Hierarchická", desc: "Intervenční body seřazené podle predikovaného dopadu" },
    ],
  },
  de: {
    sectionLabel: "OBERFLÄCHE",
    title: "Eine Steuerungsoberfläche, kein Bericht",
    subtitle: "Organisationszustand in Echtzeit, kontinuierlich aktualisiert.",
    features: [
      { label: "Signalerkennung", value: "Kontinuierlich", desc: "Mustererkennung über Verhaltensvektoren hinweg" },
      { label: "Risikoeinstufung", value: "Automatisiert", desc: "Maschinell bewerteter Schweregrad in allen überwachten Dimensionen" },
      { label: "Aktionspriorität", value: "Hierarchisch", desc: "Interventionspunkte nach vorhergesagtem Impact geordnet" },
    ],
  },
};

export function DashboardPreview() {
  const { language } = useLanguage();
  const data = annotations[language] || annotations.en;

  return (
    <section className="py-24 md:py-32 bg-[#0A0A0F]" id="preview">
      <div className="container-default">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <span className="font-mono text-xs font-medium tracking-[0.15em] text-[#71717A] uppercase">
              {data.sectionLabel}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-[-0.02em] mb-4 max-w-3xl">
            {data.title}
          </h2>
          <p className="text-lg text-[#A1A1AA] max-w-2xl">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Dashboard Image - Dark Framed */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-20 border border-[#27272A] rounded-lg overflow-hidden bg-[#18181B] shadow-2xl"
        >
          {/* Annotation Overlays - System Readouts */}
          <div className="absolute top-6 left-6 bg-[#0A0A0F]/90 backdrop-blur-sm border border-[#27272A] rounded px-4 py-2.5 z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
              <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">Live</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 bg-[#0A0A0F]/90 backdrop-blur-sm border border-[#27272A] rounded px-4 py-2.5 z-10">
            <span className="font-mono text-xs text-white tabular-nums">12 active signals</span>
          </div>

          <img 
            src={dashboardPreview} 
            alt="Echo Pulse Dashboard" 
            className="w-full h-auto block"
          />

          {/* Bottom readout strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0F]/95 backdrop-blur-sm border-t border-[#27272A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">Teams</span>
                <span className="font-mono text-sm text-white tabular-nums">147</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">Monitored</span>
                <span className="font-mono text-sm text-white tabular-nums">2,841</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider">Response Rate</span>
                <span className="font-mono text-sm text-[#10B981] tabular-nums">94%</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#52525B] uppercase tracking-wider">
              Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </motion.div>

        {/* Capabilities Grid - System Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#27272A] border border-[#27272A]">
          {data.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#18181B] p-8 md:p-10"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-lg font-semibold text-white">
                  {feature.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#71717A]">
                  {feature.label}
                </span>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
