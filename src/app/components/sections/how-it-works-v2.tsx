import React from "react";
import { motion } from "framer-motion";
import { MessageSquareText, Brain, Layers, Zap, ArrowDown } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { cn } from "@/app/components/ui/utils";

/**
 * How It Works V2 - Iceberg Concept
 * 
 * Top: Ready-made questions for every occasion
 * Bottom: Deep AI processing beneath the surface
 */

const categoryIcons = [
  { icon: "🎯", label: { cz: "Onboarding", en: "Onboarding", de: "Onboarding" } },
  { icon: "🔥", label: { cz: "Vyhoření", en: "Burnout", de: "Burnout" } },
  { icon: "💬", label: { cz: "Engagement", en: "Engagement", de: "Engagement" } },
  { icon: "🏢", label: { cz: "Kultura", en: "Culture", de: "Kultur" } },
  { icon: "📈", label: { cz: "Výkon", en: "Performance", de: "Leistung" } },
  { icon: "🤝", label: { cz: "Hodnoty (EVP)", en: "Values (EVP)", de: "Werte (EVP)" } },
  { icon: "🚪", label: { cz: "Odchody", en: "Exit", de: "Austritt" } },
  { icon: "⭐", label: { cz: "Leadership", en: "Leadership", de: "Leadership" } },
];

export function HowItWorksV2() {
  const { language } = useLanguage();

  const texts = {
    cz: {
      badge: "Jak to funguje",
      title: "Otázky pro každou",
      titleHighlight: "příležitost",
      subtitle: "Máme připravené sady otázek na všechno, co budete potřebovat. A neustále je vyvíjíme dál.",
      icebergTitle: "To je jen špička ledovce.",
      icebergSubtitle: "Skutečná síla je pod povrchem — v hloubkovém AI zpracování, které z odpovědí vytěží víc, než by dokázal celý tým analytiků.",
      aiFeatures: [
        { title: "Kontextová analýza", desc: "AI chápe, co lidé říkají mezi řádky" },
        { title: "Prediktivní modely", desc: "Odhalí rizika dřív, než se projeví" },
        { title: "Personalizované akce", desc: "Konkrétní doporučení pro každý tým" },
      ],
    },
    en: {
      badge: "How it works",
      title: "Questions for every",
      titleHighlight: "occasion",
      subtitle: "We have ready-made question sets for everything you'll need. And we keep developing them further.",
      icebergTitle: "That's just the tip of the iceberg.",
      icebergSubtitle: "The real power lies beneath the surface — in deep AI processing that extracts more from responses than an entire team of analysts could.",
      aiFeatures: [
        { title: "Contextual analysis", desc: "AI understands what people say between the lines" },
        { title: "Predictive models", desc: "Spots risks before they surface" },
        { title: "Personalized actions", desc: "Specific recommendations for each team" },
      ],
    },
    de: {
      badge: "So funktioniert es",
      title: "Fragen für jeden",
      titleHighlight: "Anlass",
      subtitle: "Wir haben fertige Fragensets für alles, was Sie brauchen. Und wir entwickeln sie ständig weiter.",
      icebergTitle: "Das ist nur die Spitze des Eisbergs.",
      icebergSubtitle: "Die wahre Stärke liegt unter der Oberfläche — in der tiefen KI-Verarbeitung, die mehr aus Antworten herausholt, als ein ganzes Analystenteam könnte.",
      aiFeatures: [
        { title: "Kontextanalyse", desc: "KI versteht, was Menschen zwischen den Zeilen sagen" },
        { title: "Prädiktive Modelle", desc: "Erkennt Risiken, bevor sie auftreten" },
        { title: "Personalisierte Maßnahmen", desc: "Konkrete Empfehlungen für jedes Team" },
      ],
    },
  };

  const t = texts[language] || texts.en;
  const lang = language as 'cz' | 'en' | 'de';

  return (
    <section className="section-spacing bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default max-w-[900px] mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-8">
            <MessageSquareText className="w-3.5 h-3.5 text-brand-primary" />
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text-primary tracking-tight mb-5">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Question Categories - Pill Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categoryIcons.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-background-secondary rounded-full border border-brand-border hover:border-brand-primary/30 hover:shadow-sm transition-all cursor-default"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-sm font-semibold text-brand-text-primary">{cat.label[lang]}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-brand-border text-brand-text-muted">
            <span className="text-sm font-medium">+ {language === 'cz' ? 'další v přípravě' : language === 'de' ? 'weitere in Vorbereitung' : 'more coming'}</span>
          </div>
        </motion.div>

        {/* Iceberg Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-brand-border to-brand-primary/40" />
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-brand-primary" />
          </div>
        </motion.div>

        {/* Deep AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#1a0f36] via-[#2D1B69] to-[#1E1145] p-8 md:p-12 text-center overflow-hidden relative">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-accent/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                <Brain className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-bold text-white/80 tracking-wider uppercase">Deep AI</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                {t.icebergTitle}
              </h3>
              <p className="text-base md:text-lg text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
                {t.icebergSubtitle}
              </p>

              {/* AI Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {t.aiFeatures.map((feature, i) => {
                  const icons = [Layers, Zap, MessageSquareText];
                  const Icon = icons[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-brand-accent" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
                      <p className="text-xs text-white/50 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
