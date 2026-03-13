import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, ArrowRight, Bot, Zap } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { Button } from "@/app/components/ui/button";
import { useModal } from "@/app/contexts/modal-context";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROMPTS = {
  cz: {
    badge: "AI Diagnostika",
    title: "Zjistěte za 2 minuty,",
    titleHighlight: " jak na tom jste",
    subtitle: "Zkopírujte tento prompt do ChatGPT nebo Claude. AI vám na základě veřejných informací o vaší firmě odhadne, kde vám hrozí rizika v týmech — a co s tím.",
    copyLabel: "Zkopírovat prompt",
    copiedLabel: "Zkopírováno!",
    promptText: `Jsi expert na employee engagement, firemní kulturu a HR analytics. Potřebuji tvoji pomoc s rychlou diagnostikou naší firmy.

Naše firma: [DOPLŇ NÁZEV FIRMY]
Počet zaměstnanců: [DOPLŇ POČET]
Obor: [DOPLŇ OBOR]

Na základě toho, co o nás víš z veřejných zdrojů (web, LinkedIn, Glassdoor, recenze, sociální sítě, tiskové zprávy), prosím:

1. **Odhad engagement skóre** — Na škále 1–5, kde odhaduješ náš employee engagement? Proč?

2. **Top 3 rizika** — Jaké jsou pravděpodobně naše největší slabiny v oblasti:
   - Retence klíčových lidí
   - Manažerská kvalita
   - Onboarding nováčků
   - Firemní kultura vs. deklarované hodnoty

3. **Skryté náklady** — Kolik nás pravděpodobně stojí, že engagement neměříme systematicky každý měsíc? Vyčísli v Kč (průměrná fluktuace v ČR, náklady nahrazení zaměstnance = 50–200 % ročního platu).

4. **Benchmark** — Jak si stojíme oproti nejlepším firmám v našem oboru v ČR?

5. **3 akční kroky** — Co bys doporučil udělat jako první, abychom situaci zlepšili?

Buď konkrétní, přímý a neboj se pojmenovat problémy.`,
    steps: [
      { num: "1", text: "Zkopírujte prompt" },
      { num: "2", text: "Vložte do ChatGPT nebo Claude" },
      { num: "3", text: "Doplňte název firmy a obor" },
    ],
    cta: "Chcete přesnější data? Vyzkoušejte Echo Pulse",
    ctaDesc: "AI prompt dává odhad. Echo Pulse měří realitu.",
  },
  en: {
    badge: "AI Diagnostics",
    title: "Find out in 2 minutes",
    titleHighlight: " where you stand",
    subtitle: "Copy this prompt into ChatGPT or Claude. AI will estimate your team risks based on public information about your company — and suggest what to do.",
    copyLabel: "Copy prompt",
    copiedLabel: "Copied!",
    promptText: `You are an expert in employee engagement, company culture, and HR analytics. I need your help with a quick diagnostic of our company.

Our company: [INSERT COMPANY NAME]
Number of employees: [INSERT NUMBER]
Industry: [INSERT INDUSTRY]

Based on what you know about us from public sources (website, LinkedIn, Glassdoor, reviews, social media, press releases), please:

1. **Engagement score estimate** — On a 1–5 scale, where do you estimate our employee engagement? Why?

2. **Top 3 risks** — What are likely our biggest weaknesses in:
   - Key talent retention
   - Management quality
   - New hire onboarding
   - Company culture vs. declared values

3. **Hidden costs** — How much is it likely costing us that we don't measure engagement systematically every month? Quantify (average turnover rate, replacement cost = 50–200% of annual salary).

4. **Benchmark** — How do we compare to the best companies in our industry?

5. **3 action steps** — What would you recommend doing first to improve the situation?

Be specific, direct, and don't shy away from naming problems.`,
    steps: [
      { num: "1", text: "Copy the prompt" },
      { num: "2", text: "Paste into ChatGPT or Claude" },
      { num: "3", text: "Add your company name & industry" },
    ],
    cta: "Want precise data? Try Echo Pulse",
    ctaDesc: "AI prompt gives estimates. Echo Pulse measures reality.",
  },
  de: {
    badge: "AI-Diagnostik",
    title: "Finden Sie in 2 Minuten heraus,",
    titleHighlight: " wo Sie stehen",
    subtitle: "Kopieren Sie diesen Prompt in ChatGPT oder Claude. Die KI schätzt anhand öffentlicher Informationen Ihre Team-Risiken ein — und schlägt Maßnahmen vor.",
    copyLabel: "Prompt kopieren",
    copiedLabel: "Kopiert!",
    promptText: `Sie sind ein Experte für Employee Engagement, Unternehmenskultur und HR-Analytics. Ich brauche Ihre Hilfe bei einer schnellen Diagnostik unseres Unternehmens.

Unser Unternehmen: [NAME EINFÜGEN]
Mitarbeiterzahl: [ANZAHL EINFÜGEN]
Branche: [BRANCHE EINFÜGEN]

Basierend auf öffentlichen Quellen (Website, LinkedIn, Glassdoor, Bewertungen, Social Media, Pressemitteilungen), bitte:

1. **Engagement-Score-Schätzung** — Auf einer Skala von 1–5, wo schätzen Sie unser Employee Engagement ein? Warum?

2. **Top 3 Risiken** — Was sind wahrscheinlich unsere größten Schwächen bei:
   - Bindung von Schlüsselpersonen
   - Führungsqualität
   - Onboarding neuer Mitarbeiter
   - Unternehmenskultur vs. kommunizierte Werte

3. **Versteckte Kosten** — Wie viel kostet es uns wahrscheinlich, dass wir Engagement nicht systematisch jeden Monat messen? (Durchschnittliche Fluktuation, Ersatzkosten = 50–200 % des Jahresgehalts)

4. **Benchmark** — Wie stehen wir im Vergleich zu den besten Unternehmen unserer Branche?

5. **3 Sofortmaßnahmen** — Was würden Sie als Erstes empfehlen?

Seien Sie konkret, direkt und scheuen Sie sich nicht, Probleme zu benennen.`,
    steps: [
      { num: "1", text: "Prompt kopieren" },
      { num: "2", text: "In ChatGPT oder Claude einfügen" },
      { num: "3", text: "Firmenname & Branche ergänzen" },
    ],
    cta: "Präzise Daten gewünscht? Testen Sie Echo Pulse",
    ctaDesc: "Ein AI-Prompt gibt Schätzungen. Echo Pulse misst die Realität.",
  },
};

export function AiPromptChecker() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const [copied, setCopied] = useState(false);
  const promptRef = useRef<HTMLPreElement>(null);

  const c = PROMPTS[language as keyof typeof PROMPTS] || PROMPTS.en;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(c.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = c.promptText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="section-spacing bg-brand-background-secondary relative overflow-hidden noise-texture" id="ai-check">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] left-[40%] h-64 w-96 rounded-full bg-brand-accent/[0.08] blur-[100px]" />
        <div className="absolute bottom-[12%] right-[10%] h-48 w-48 rounded-full bg-brand-primary/[0.06] blur-[80px]" />
      </div>

      <div className="container-default relative" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="section-badge">
            <Sparkles className="w-3.5 h-3.5" />
            {c.badge}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-3">
            {c.title}
            <span className="text-gradient">
              {c.titleHighlight}
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-xl mx-auto">
            {c.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.4, ease: MOTION_EASE }}
          className="flex items-center justify-center gap-3 sm:gap-6 mb-6 md:mb-8"
        >
          {c.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center shrink-0">
                {step.num}
              </span>
              <span className="text-xs sm:text-sm text-brand-text-secondary font-medium">{step.text}</span>
              {idx < c.steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-brand-text-muted ml-1 hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Prompt Card — dark terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: MOTION_EASE }}
          className="relative group"
        >
          {/* Glow ring behind card */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-accent/30 via-brand-accent/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: 'linear-gradient(180deg, rgba(26,15,60,0.95), rgba(13,5,32,0.98))' }}>
            {/* Terminal header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-xs text-white/40 font-mono ml-1">engagement-check.prompt</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background-dark min-h-[36px] ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/25'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {c.copiedLabel}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {c.copyLabel}
                  </>
                )}
              </button>
            </div>

            {/* Prompt content */}
            <div className="px-4 py-4 sm:px-5 sm:py-5 max-h-[260px] overflow-y-auto">
              <pre
                ref={promptRef}
                className="text-[13px] sm:text-sm leading-relaxed text-white/75 whitespace-pre-wrap font-mono selection:bg-brand-accent/30"
              >
                {c.promptText}
              </pre>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-brand-background-deep to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* CTA below prompt */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4, ease: MOTION_EASE }}
          className="mt-8 md:mt-10 text-center"
        >
          <p className="text-sm text-brand-text-muted mb-4 flex items-center justify-center gap-2">
            <Bot className="w-4 h-4" />
            {c.ctaDesc}
          </p>
          <Button asChild size="lg" className="rounded-xl shadow-lg shadow-brand-primary/20">
            <a href="https://app.behavera.com/echo-pulse/try" target="_blank" rel="noopener noreferrer">
              <Zap className="w-4 h-4 mr-1.5" />
              {c.cta}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
