import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Zap, ChevronRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { Button } from "@/app/components/ui/button";
import { useModal } from "@/app/contexts/modal-context";

/* ── Inline brand logos (small SVGs) ── */
function ChatGPTLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.709 15.955l4.72-2.756.08-.046 2.698-1.575c.063-.037.122-.08.175-.128l2.442-1.427.263-.176 4.6-2.685a.063.063 0 0 0 .032-.056.064.064 0 0 0-.064-.064H4.163a.064.064 0 0 0-.06.042.063.063 0 0 0 .004.059l.601 1.05v.001l1.613 2.823.092.16 1.79 3.134.092.16 1.258 2.202.263.46c.026.045-.006-.002 0 0l-5.107-1.178z" />
      <path d="M19.676 7.107a.063.063 0 0 0-.064-.064l-.36.003H4.163a.064.064 0 0 0-.06.042.063.063 0 0 0 .025.075l.601 1.05L8.8 15.81l.263.46 3.13-1.827.175-.128 2.442-1.427.263-.176 4.6-2.685a.063.063 0 0 0 .032-.056l-.03-2.864z" />
    </svg>
  );
}

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type PromptCopy = {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  steps: string[];
  launchLabel: string;
  launchHint: string;
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
    subtitle: "Zkopírujte prompt, doplňte 3 údaje o své firmě a nechte AI odkrýt vaše skryté náklady.",
    steps: ["Zkopírujte prompt níže", "Vložte do ChatGPT nebo Claude", "Doplňte název firmy, počet lidí a obor"],
    launchLabel: "Otevřít v",
    launchHint: "Prompt se zkopíruje a otevře se nové okno — stačí vložit (Ctrl+V)",
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
    subtitle: "Copy the prompt, fill in 3 details about your company and let AI uncover your hidden costs.",
    steps: ["Copy the prompt below", "Paste into ChatGPT or Claude", "Fill in company name, headcount & industry"],
    launchLabel: "Open in",
    launchHint: "Prompt is copied and a new window opens — just paste (Ctrl+V)",
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
    subtitle: "Kopieren Sie den Prompt, ergänzen Sie 3 Angaben und lassen Sie die KI Ihre versteckten Kosten aufdecken.",
    steps: ["Prompt unten kopieren", "In ChatGPT oder Claude einfügen", "Firmenname, Mitarbeiterzahl & Branche ergänzen"],
    launchLabel: "Öffnen in",
    launchHint: "Der Prompt wird kopiert und ein neues Fenster öffnet sich — einfach einfügen (Strg+V)",
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

  const copyToClipboard = useCallback(async () => {
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
  }, [c.promptText]);

  const handleCopy = async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunch = useCallback(async (url: string) => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [copyToClipboard]);

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
          <p className="text-body text-brand-text-secondary max-w-2xl mx-auto mb-5">
            {c.subtitle}
          </p>
          {/* 3-step instruction pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {c.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-text-primary shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                  {step}
                </span>
                {i < c.steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-brand-text-muted/40 hidden sm:block" />}
              </div>
            ))}
          </div>

          {/* Quick-launch links — subtle, secondary to our CTA */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => handleLaunch("https://chat.openai.com/")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-[#10a37f]/80 hover:bg-[#10a37f] border border-[#10a37f]/30 hover:border-[#10a37f]/50 transition-all duration-200"
            >
              <ChatGPTLogo className="w-3.5 h-3.5" />
              ChatGPT
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
            <button
              type="button"
              onClick={() => handleLaunch("https://claude.ai/new")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-[#d97757]/80 hover:bg-[#d97757] border border-[#d97757]/30 hover:border-[#d97757]/50 transition-all duration-200"
            >
              <ClaudeLogo className="w-3.5 h-3.5" />
              Claude
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
          </div>
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
