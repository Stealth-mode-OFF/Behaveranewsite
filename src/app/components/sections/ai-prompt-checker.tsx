import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Zap, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { Button } from "@/app/components/ui/button";
import { useModal } from "@/app/contexts/modal-context";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type PromptCopy = {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  copyLabel: string;
  copiedLabel: string;
  promptText: string;
  cta: string;
  ctaDesc: string;
  tryItFree: string;
};

const PROMPTS: Record<string, PromptCopy> = {
  cz: {
    badge: "AI Diagnostika",
    title: "Zjistěte za 2 minuty,",
    titleHighlight: " jak na tom jste",
    subtitle: "Zkopírujte prompt do ChatGPT nebo Claude, doplňte název firmy, počet zaměstnanců a obor. AI odhadne vaše rizika a skryté náklady.",
    copyLabel: "Zkopírovat prompt",
    copiedLabel: "Zkopírováno!",
    promptText: `Jsi expert na employee engagement, firemní kulturu a HR analytics. Potřebuji tvoji pomoc s rychlou diagnostikou naší firmy.

Naše firma: [DOPLŇ NÁZEV FIRMY]
Počet zaměstnanců: [DOPLŇ POČET]
Obor: [DOPLŇ OBOR]

Nejdřív mi prosím vysvětli kontext — proč by nás tohle mělo zajímat. Podívej se na tyto zdroje a řekni mi konkrétní čísla:

**Proč měřit engagement pravidelně?**
• Kolik procent zaměstnanců v ČR není aktivně angažovaných? Podívej se na Gallup State of the Global Workplace, Atmoskop (český průzkum spokojenosti) a data ČSÚ o trhu práce.
• Jak dlouho typicky trvá, než roční průzkum odhalí problém s klíčovým člověkem — a o kolik rychleji to zachytí měsíční pulse survey?
• Kolik v Kč stojí nahrazení jednoho zaměstnance v ČR? Vycházej z dat ČSÚ o průměrné mzdě a SHRM/Gallup benchmarků nákladů fluktuace (50–200 % ročního platu). Spočítej to pro náš počet lidí.
• O kolik vyšší ziskovost mají firmy s angažovanými týmy? Podívej se na Gallup meta-analýzu Q12 a Hppy/Deloitte Human Capital Trends.

Na základě toho, co o nás víš z veřejných zdrojů (web, LinkedIn, Glassdoor, Atmoskop, recenze, sociální sítě, tiskové zprávy), prosím:

1. **Odhad engagement skóre** — Na škále 0–100 (kde 70+ = silný engagement, 50–70 = prostor ke zlepšení, pod 50 = potřeba akce), kde odhaduješ náš employee engagement? Proč?

2. **Top 3 rizika** — Jaké jsou pravděpodobně naše největší slabiny v oblasti:
   - Retence klíčových lidí
   - Manažerská kvalita
   - Onboarding nováčků
   - Firemní kultura vs. deklarované hodnoty

3. **Skryté náklady fluktuace** — Spočítej, kolik nás ročně stojí neměřený engagement:
   - Použij aktuální data o fluktuaci v ČR (ČSÚ, Atmoskop, Grafton Recruitment průzkumy)
   - Vyčísli v Kč: kolik lidí pravděpodobně ročně odejde, kolik to stojí, a kolik bychom ušetřili, kdyby se fluktuace snížila o 3–5 %

4. **Benchmark** — Jak si stojíme oproti nejlepším firmám v našem oboru v ČR? Podívej se na Best Employers ČR, Atmoskop žebříčky a Glassdoor hodnocení.

5. **3 akční kroky** — Co bys doporučil udělat jako první, abychom situaci zlepšili?

6. **Proč měřit měsíčně** — Vysvětli s oporou o data (Gallup, Deloitte, McKinsey), proč roční průzkum spokojenosti nestačí a proč firmy s měsíčním pulse měřením mají prokazatelně lepší výsledky.

Buď konkrétní, přímý a neboj se pojmenovat problémy. Uveď konkrétní čísla a zdroje.`,
    cta: "Chcete přesnější data než odhad od AI?",
    ctaDesc: "Echo Pulse měří realitu přímo od vašich lidí. Každý měsíc. Anonymně.",
    tryItFree: "Vyzkoušet Echo Pulse",
  },
  en: {
    badge: "AI Diagnostics",
    title: "Find out in 2 minutes",
    titleHighlight: " where you stand",
    subtitle: "Copy this prompt into ChatGPT or Claude, add your company name, employee count, and industry. AI will estimate your risks and hidden costs.",
    copyLabel: "Copy prompt",
    copiedLabel: "Copied!",
    promptText: `You are an expert in employee engagement, company culture, and HR analytics. I need your help with a quick diagnostic of our company.

Our company: [INSERT COMPANY NAME]
Number of employees: [INSERT NUMBER]
Industry: [INSERT INDUSTRY]

First, explain the context — why should we care? Look up these sources and give me concrete numbers:

**Why measure engagement regularly?**
• What percentage of UK employees are not actively engaged? Check Gallup State of the Global Workplace, CIPD Employee Outlook reports, and ONS labour market data.
• How long does it typically take for an annual survey to spot a key person disengaging — and how much faster does a monthly pulse survey catch it?
• What does it cost in GBP to replace one employee in the UK? Use ONS average salary data and CIPD/SHRM benchmarks for replacement costs (50–200% of annual salary). Calculate for our headcount.
• How much more profitable are companies with engaged teams? Check the Gallup Q12 meta-analysis and Deloitte Human Capital Trends.

Based on what you know about us from public sources (website, LinkedIn, Glassdoor, Indeed reviews, social media, press releases), please:

1. **Engagement score estimate** — On a 0–100 scale (where 70+ = strong engagement, 50–70 = room for improvement, below 50 = action needed), where do you estimate our employee engagement? Why?

2. **Top 3 risks** — What are likely our biggest weaknesses in:
   - Key talent retention
   - Management quality
   - New hire onboarding
   - Company culture vs. declared values

3. **Hidden turnover costs** — Calculate our annual cost of unmeasured engagement:
   - Use current UK turnover data (ONS, CIPD, XpertHR benchmarks)
   - Calculate in GBP: how many people likely leave per year, what it costs, and how much we'd save if turnover dropped by 3–5%

4. **Benchmark** — How do we compare to the best companies in our industry? Check Sunday Times Best Companies, Glassdoor Best Places to Work UK, and Great Place to Work rankings.

5. **3 action steps** — What would you recommend doing first to improve the situation?

6. **Why measure monthly** — Explain with evidence (Gallup, Deloitte, McKinsey) why annual surveys aren't enough and why companies using monthly pulse surveys see measurably better outcomes.

Be specific, direct, and don't shy away from naming problems. Cite concrete numbers and sources.`,
    cta: "Want more precise data than an AI estimate?",
    ctaDesc: "Echo Pulse measures reality directly from your people. Every month. Anonymously.",
    tryItFree: "Try Echo Pulse",
  },
  de: {
    badge: "AI-Diagnostik",
    title: "Finden Sie in 2 Minuten heraus,",
    titleHighlight: " wo Sie stehen",
    subtitle: "Kopieren Sie den Prompt in ChatGPT oder Claude, ergänzen Sie Firmenname, Mitarbeiterzahl und Branche. Die KI schätzt Ihre Risiken und versteckten Kosten.",
    copyLabel: "Prompt kopieren",
    copiedLabel: "Kopiert!",
    promptText: `Sie sind ein Experte für Employee Engagement, Unternehmenskultur und HR-Analytics. Ich brauche Ihre Hilfe bei einer schnellen Diagnostik unseres Unternehmens.

Unser Unternehmen: [NAME EINFÜGEN]
Mitarbeiterzahl: [ANZAHL EINFÜGEN]
Branche: [BRANCHE EINFÜGEN]

Erklären Sie zuerst den Kontext — warum sollte uns das interessieren? Schauen Sie in diese Quellen und nennen Sie konkrete Zahlen:

**Warum Engagement regelmäßig messen?**
• Wie viel Prozent der Mitarbeiter in Deutschland sind nicht aktiv engagiert? Prüfen Sie den Gallup Engagement Index Deutschland, Destatis Arbeitsmarktdaten und den Kununu Zufriedenheitsindex.
• Wie lange dauert es typischerweise, bis eine jährliche Befragung ein Problem erkennt — und wie viel schneller erfasst es ein monatlicher Pulse Survey?
• Was kostet der Ersatz eines Mitarbeiters in Deutschland in Euro? Nutzen Sie Destatis-Durchschnittsgehälter und SHRM/Gallup-Benchmarks für Ersatzkosten (50–200 % des Jahresgehalts). Berechnen Sie es für unsere Mitarbeiterzahl.
• Um wie viel rentabler sind Unternehmen mit engagierten Teams? Prüfen Sie die Gallup Q12 Meta-Analyse und Deloitte Human Capital Trends.

Basierend auf öffentlichen Quellen (Website, LinkedIn, Glassdoor, Kununu, Bewertungen, Social Media, Pressemitteilungen), bitte:

1. **Engagement-Score-Schätzung** — Auf einer Skala von 0–100 (wobei 70+ = starkes Engagement, 50–70 = Verbesserungspotenzial, unter 50 = Handlungsbedarf), wo schätzen Sie unser Employee Engagement ein? Warum?

2. **Top 3 Risiken** — Was sind wahrscheinlich unsere größten Schwächen bei:
   - Bindung von Schlüsselpersonen
   - Führungsqualität
   - Onboarding neuer Mitarbeiter
   - Unternehmenskultur vs. kommunizierte Werte

3. **Versteckte Fluktuationskosten** — Berechnen Sie unsere jährlichen Kosten durch ungemessenes Engagement:
   - Nutzen Sie aktuelle Fluktuationsdaten für Deutschland (Destatis, IAB, Hays Fachkräfte-Index)
   - Berechnen Sie in Euro: Wie viele gehen jährlich, was kostet das, und wie viel sparen wir bei 3–5 % weniger Fluktuation?

4. **Benchmark** — Wie stehen wir im Vergleich zu den besten Unternehmen unserer Branche? Prüfen Sie Great Place to Work Deutschland, Kununu Top Companies und Glassdoor-Bewertungen.

5. **3 Sofortmaßnahmen** — Was würden Sie als Erstes empfehlen?

6. **Warum monatlich messen** — Erklären Sie mit Belegen (Gallup, Deloitte, McKinsey), warum jährliche Befragungen nicht ausreichen und warum Unternehmen mit monatlichen Pulse Surveys nachweislich bessere Ergebnisse erzielen.

Seien Sie konkret, direkt und scheuen Sie sich nicht, Probleme zu benennen. Nennen Sie konkrete Zahlen und Quellen.`,
    cta: "Präzisere Daten als eine KI-Schätzung gewünscht?",
    ctaDesc: "Echo Pulse misst die Realität direkt von Ihren Mitarbeitern. Jeden Monat. Anonym.",
    tryItFree: "Echo Pulse testen",
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
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = c.promptText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="section-spacing bg-brand-background-secondary relative overflow-hidden noise-texture" id="ai-check">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[30%] h-80 w-[500px] rounded-full bg-brand-accent/[0.06] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] h-56 w-56 rounded-full bg-brand-primary/[0.05] blur-[90px]" />
      </div>

      <div className="container-default relative" style={{ maxWidth: '860px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="section-badge">
            <Sparkles className="w-3.5 h-3.5" />
            {c.badge}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {c.title}
            <span className="text-gradient">{c.titleHighlight}</span>
          </h2>
          <p className="text-body text-brand-text-secondary max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </motion.div>

        {/* Prompt Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: MOTION_EASE }}
          className="relative group mb-8 md:mb-10"
        >
          {/* Glow ring */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-accent/25 via-brand-accent/8 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: 'linear-gradient(180deg, rgba(26,15,60,0.95), rgba(13,5,32,0.98))' }}>
            {/* Terminal header */}
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 min-h-[36px] ${
                  copied
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40 hover:scale-[1.02]'
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
            <div className="px-4 py-4 sm:px-5 sm:py-5 max-h-[340px] overflow-y-auto scrollbar-thin">
              <pre
                ref={promptRef}
                className="text-[13px] sm:text-sm leading-relaxed text-white/70 whitespace-pre-wrap font-mono selection:bg-brand-accent/30"
              >
                {c.promptText}
              </pre>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[rgba(13,5,32,0.98)] to-transparent pointer-events-none rounded-b-2xl" />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4, ease: MOTION_EASE }}
          className="text-center"
        >
          <p className="text-base font-semibold text-brand-text-primary mb-1">{c.cta}</p>
          <p className="text-sm text-brand-text-muted mb-5">{c.ctaDesc}</p>
          <Button
            onClick={() => openBooking()}
            size="lg"
            className="rounded-full shadow-lg shadow-brand-primary/20 group/btn"
          >
            <Zap className="w-4 h-4 mr-1.5" />
            {c.tryItFree}
            <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
