import { useCallback, useState, type ElementType, type MouseEvent as ReactMouseEvent } from "react";
import {
  Activity, Zap, Briefcase, Heart, Shield, Award, Scale, Cpu,
  MessageCircle, Clock, BarChart3, Brain, ExternalLink, Sparkles,
  Send, CheckCircle2, XCircle, TrendingUp, ChevronDown, Timer
} from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { getPulseCheckUrl, PULSE_SCAN_WINDOW_FEATURES, PULSE_SCAN_WINDOW_NAME } from "@/lib/urls";
import { trackPulseCheckOpen } from "@/lib/analytics";

/* ─── Icons ─── */
const topicIcons: Record<string, ElementType> = {
  quickScan: Activity, pay: Scale, perks: Heart, tools: Cpu,
  workload: Briefcase, recognition: Award, stress: Zap, values: Shield,
};
const topicKeys = ['quickScan', 'pay', 'perks', 'tools', 'workload', 'recognition', 'stress', 'values'] as const;
const stepIcons = [Send, MessageCircle, BarChart3];
const advantageIcons = [TrendingUp, BarChart3, Brain, Activity];

/* ─── Copy ─── */
type TCopy = {
  badge: string; title: string; titleHighlight: string; subtitle: string;
  stepsTitle: string; steps: { title: string; desc: string }[];
  topicsTitle: string; topicsSubtitle: string;
  topics: Record<string, { name: string; desc: string }>;
  topicChip: string; defaultBadge: string;
  compTitle: string; compSubtitle: string; compTimeSaved: string;
  advantages: { title: string; oldWay: string; ourWay: string }[];
  tryTitle: string; tryDesc: string; tryCta: string; tryNote: string;
};

const copy: Record<string, TCopy> = {
  cz: {
    badge: "Echo Pulse",
    title: "2 minuty. 85 % lidí odpoví. ",
    titleHighlight: "Každý měsíc.",
    subtitle: "Žádné formuláře. Zaměstnanci odpovídají v krátkém AI chatu \u2014 5\u20136 otázek, anonymně. Výsledky okamžitě v dashboardu.",
    stepsTitle: "Jak to funguje",
    steps: [
      { title: "Pulse Check se sám rozešle", desc: "Nastavíte jednou, dál běží automaticky. Slack, Teams nebo e-mail — bez práce navíc." },
      { title: "2min AI konverzace", desc: "Chatbot pokládá chytré otázky. Přirozeně, ne jako nudný formulář." },
      { title: "Výsledky v dashboardu", desc: "Okamžitý přehled, trendy v čase, AI doporučení k akci." },
    ],
    topicsTitle: "8 oblastí, které měříme",
    topicsSubtitle: "Začněte Quick Scanem pro celkový přehled, nebo cíleně nasaďte konkrétní téma tam, kde to váš tým nejvíce potřebuje.",
    topics: {
      quickScan: { name: "Quick Scan", desc: "Celkový přehled spokojenosti. Odhalí, kam se zaměřit." },
      pay: { name: "Odměňování", desc: "Férovost, transparentnost a srovnání s trhem." },
      perks: { name: "Benefity", desc: "Relevance a skutečné využívání nabízených benefitů." },
      tools: { name: "Nástroje", desc: "Mají lidé k dispozici to, co potřebují k práci?" },
      workload: { name: "Pracovní zátěž", desc: "Rovnováha mezi nároky a kapacitou týmu." },
      recognition: { name: "Uznání", desc: "Je dobrá práce vidět? Zpětná vazba a ocenění." },
      stress: { name: "Stres", desc: "Chronický stres, regenerace a riziko vyhoření." },
      values: { name: "Hodnoty", desc: "Soulad mezi deklarovanými a žitými hodnotami firmy." },
    },
    topicChip: "5\u20136 otázek \u00B7 2 min",
    defaultBadge: "Doporučený start",
    compTitle: "Proč ne Google Forms?",
    compSubtitle: "Sbírat zpětnou vazbu přes formuláře umí každý. Ale funguje to?",
    compTimeSaved: "Ušetříte ~6 hodin na každém kole zpětné vazby",
    advantages: [
      { title: "85 % návratnost vs. 15 %", oldWay: "Formuláře: 15\u201330 % lidí dokončí", ourWay: "Pulse: 85 %+ díky chat formátu" },
      { title: "Okamžitá analýza, ne Excel", oldWay: "Formuláře: Export \u2192 Excel \u2192 ruční grafy", ourWay: "Pulse: Real-time dashboard s AI insights" },
      { title: "Validovaná psychometrie", oldWay: "Formuláře: Otázky psané bez metodologie", ourWay: "Pulse: Navrženo behaviorálními psychology" },
      { title: "Trendy, ne snapshoty", oldWay: "Formuláře: 1\u00D7 ročně velký průzkum", ourWay: "Pulse: Průběžné měření s vizualizací trendů" },
    ],
    tryTitle: "Vyzkoušejte si to na vlastní kůži",
    tryDesc: "Projděte si ukázkový Quick Scan přesně tak, jak ho vyplňují vaši zaměstnanci.",
    tryCta: "Spustit ukázkový Pulse Check",
    tryNote: "Bez registrace \u00B7 Anonymní \u00B7 2 minuty",
  },
  en: {
    badge: "Echo Pulse",
    title: "2 minutes. 85% respond. ",
    titleHighlight: "Every month.",
    subtitle: "No forms. Employees respond in a short AI-powered chat \u2014 5\u20136 questions, fully anonymous. Results appear instantly in your dashboard.",
    stepsTitle: "How it works",
    steps: [
      { title: "Pulse Check sends itself", desc: "Set it up once, it runs automatically. Slack, Teams, or email — zero extra work." },
      { title: "2-min AI conversation", desc: "A chatbot asks smart questions. Natural, not like a boring form." },
      { title: "Results in dashboard", desc: "Instant overview, trends over time, AI-powered action recommendations." },
    ],
    topicsTitle: "8 areas we measure",
    topicsSubtitle: "Start with Quick Scan for a full overview, or deploy a specific topic where your team needs it most.",
    topics: {
      quickScan: { name: "Quick Scan", desc: "Overall satisfaction snapshot. Reveals where to focus." },
      pay: { name: "Compensation", desc: "Fair pay, transparency, and market comparison." },
      perks: { name: "Benefits", desc: "Relevance and actual usage of offered benefits." },
      tools: { name: "Tools", desc: "Do people have what they need to do great work?" },
      workload: { name: "Workload", desc: "Balance between demands and capacity." },
      recognition: { name: "Recognition", desc: "Is good work visible? Feedback and appreciation." },
      stress: { name: "Stress", desc: "Chronic stress levels, recovery, and burnout risk." },
      values: { name: "Values", desc: "Alignment between declared and lived values." },
    },
    topicChip: "5\u20136 questions \u00B7 2 min",
    defaultBadge: "Recommended start",
    compTitle: "Why not Google Forms?",
    compSubtitle: "Anyone can collect feedback with forms. But does it actually work?",
    compTimeSaved: "Save ~6 hours on every feedback cycle",
    advantages: [
      { title: "85% completion vs. 15%", oldWay: "Forms: 15\u201330% of people finish it", ourWay: "Pulse: 85%+ thanks to chat format" },
      { title: "Instant analysis, not Excel", oldWay: "Forms: Export \u2192 Excel \u2192 manual charts", ourWay: "Pulse: Real-time dashboard with AI insights" },
      { title: "Validated psychometrics", oldWay: "Forms: Questions without methodology", ourWay: "Pulse: Designed by behavioral psychologists" },
      { title: "Trends, not snapshots", oldWay: "Forms: Once-a-year big survey", ourWay: "Pulse: Continuous measurement with trends" },
    ],
    tryTitle: "Try it yourself",
    tryDesc: "Walk through a sample Quick Scan exactly as your employees would.",
    tryCta: "Launch sample Pulse Check",
    tryNote: "No signup \u00B7 Anonymous \u00B7 2 minutes",
  },
  de: {
    badge: "Echo Pulse",
    title: "2 Minuten. 85 % antworten. ",
    titleHighlight: "Jeden Monat.",
    subtitle: "Keine Formulare. Mitarbeiter antworten in einem kurzen AI-Chat \u2014 5\u20136 Fragen, v\u00f6llig anonym. Ergebnisse sofort im Dashboard.",
    stepsTitle: "So funktioniert es",
    steps: [
      { title: "Pulse Check sendet sich selbst", desc: "Einmal einrichten, läuft automatisch. Slack, Teams oder E-Mail — kein Mehraufwand." },
      { title: "2-Min AI-Gespräch", desc: "Ein Chatbot stellt kluge Fragen. Natürlich, nicht wie ein Formular." },
      { title: "Ergebnisse im Dashboard", desc: "Sofortiger Überblick, Trends und KI-gestützte Handlungsempfehlungen." },
    ],
    topicsTitle: "8 Bereiche, die wir messen",
    topicsSubtitle: "Starten Sie mit Quick Scan für einen Gesamtüberblick oder wählen Sie ein bestimmtes Thema.",
    topics: {
      quickScan: { name: "Quick Scan", desc: "Gesamtüberblick über Zufriedenheit. Zeigt, worauf es ankommt." },
      pay: { name: "Vergütung", desc: "Faire Bezahlung, Transparenz und Marktvergleich." },
      perks: { name: "Benefits", desc: "Relevanz und tatsächliche Nutzung der angebotenen Benefits." },
      tools: { name: "Tools", desc: "Haben Mitarbeiter, was sie für ihre Arbeit brauchen?" },
      workload: { name: "Arbeitsbelastung", desc: "Balance zwischen Anforderungen und Kapazität." },
      recognition: { name: "Anerkennung", desc: "Wird gute Arbeit gesehen? Feedback und Wertschätzung." },
      stress: { name: "Stress", desc: "Chronisches Stressniveau, Erholung und Burnout-Risiko." },
      values: { name: "Werte", desc: "Übereinstimmung zwischen erklärten und gelebten Werten." },
    },
    topicChip: "5\u20136 Fragen \u00B7 2 Min",
    defaultBadge: "Empfohlener Start",
    compTitle: "Warum nicht Google Forms?",
    compSubtitle: "Feedback mit Formularen sammeln kann jeder. Aber funktioniert es?",
    compTimeSaved: "Sparen Sie ~6 Stunden pro Feedback-Zyklus",
    advantages: [
      { title: "85 % Rücklauf vs. 15 %", oldWay: "Formulare: 15\u201330 % füllen es aus", ourWay: "Pulse: 85 %+ dank Chat-Format" },
      { title: "Sofortige Analyse, kein Excel", oldWay: "Formulare: Export \u2192 Excel \u2192 manuelle Diagramme", ourWay: "Pulse: Echtzeit-Dashboard mit KI-Insights" },
      { title: "Validierte Psychometrie", oldWay: "Formulare: Fragen ohne Methodik", ourWay: "Pulse: Von Verhaltenspsychologen entwickelt" },
      { title: "Trends, keine Momentaufnahmen", oldWay: "Formulare: 1\u00D7 jährlich große Umfrage", ourWay: "Pulse: Laufende Messung mit Trends" },
    ],
    tryTitle: "Testen Sie es selbst",
    tryDesc: "Durchlaufen Sie einen Quick Scan genau so, wie ihn Ihre Mitarbeiter ausfüllen würden.",
    tryCta: "Beispiel Pulse Check starten",
    tryNote: "Ohne Registrierung \u00B7 Anonym \u00B7 2 Minuten",
  },
};

export function SignalRadar() {
  const { language } = useLanguage();
  const [compOpen, setCompOpen] = useState(false);

  const c = copy[language] || copy.en;

  const tryLink = getPulseCheckUrl(language);

  return (
    <section className="section-spacing bg-brand-background-secondary/30 relative overflow-hidden" id="radar">
      <div className="container-default max-w-[1120px] mx-auto relative z-10">

        {/* ═══════════ HEADER ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-brand-primary/15 mb-8 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary" />
            </span>
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {c.badge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-brand-text-primary mb-6 leading-[1.1]">
            {c.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {c.titleHighlight}
            </span>
          </h2>

          <p className="text-lg text-brand-text-secondary leading-relaxed max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </motion.div>

        {/* ═══════════ HOW IT WORKS — 3 Steps ═══════════ */}
        <div className="mb-16">
          <h3 className="text-lg sm:text-xl font-bold text-brand-text-primary text-center mb-8">
            {c.stepsTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[56px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-brand-primary/20 via-brand-accent/40 to-brand-primary/20 z-0" />

            {c.steps.map((step, i) => {
              const StepIcon = stepIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="relative z-10 bg-white rounded-2xl p-6 sm:p-7 border border-brand-primary/8 shadow-sm hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary mx-auto mb-4 flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-brand-accent tracking-[0.15em] uppercase mb-3">
                    0{i + 1}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-brand-primary mb-2">{step.title}</h4>
                  <p className="text-[13px] text-brand-text-body leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ 8 TOPIC CARDS ═══════════ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-text-primary mb-4">
              {c.topicsTitle}
            </h3>
            <p className="text-base text-brand-text-body max-w-2xl mx-auto leading-relaxed">
              {c.topicsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topicKeys.map((key, i) => {
              const topic = c.topics[key];
              const TopicIcon = topicIcons[key] || Activity;
              const isDefault = key === 'quickScan';

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-0.5 ${
                    isDefault
                      ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/15'
                      : 'bg-white border-brand-primary/8 hover:border-brand-primary/20 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isDefault && (
                    <div className="absolute -top-2.5 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-accent text-white text-[10px] font-bold tracking-[0.08em] uppercase rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {c.defaultBadge}
                      </span>
                    </div>
                  )}

                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    isDefault ? 'bg-white/15' : 'bg-brand-background-secondary'
                  }`}>
                    <TopicIcon className={`w-[18px] h-[18px] ${
                      isDefault ? 'text-white' : 'text-brand-primary'
                    }`} />
                  </div>

                  <h4 className={`font-bold text-[15px] mb-1.5 ${
                    isDefault ? 'text-white' : 'text-brand-primary'
                  }`}>
                    {topic.name}
                  </h4>

                  <p className={`text-[13px] leading-relaxed mb-3 ${
                    isDefault ? 'text-white/80' : 'text-brand-text-body'
                  }`}>
                    {topic.desc}
                  </p>

                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    isDefault ? 'bg-white/15 text-white/90' : 'bg-brand-background-secondary text-brand-text-muted'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {c.topicChip}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ WHY NOT GOOGLE FORMS ═══════════ */}
        <div className="mb-16">
          <button
            onClick={() => setCompOpen(!compOpen)}
            className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-brand-text-primary">
                  {c.compTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Timer className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-semibold">{c.compTimeSaved}</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: compOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full bg-brand-background-secondary flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-brand-text-muted" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: compOpen ? 'auto' : 0,
              opacity: compOpen ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <p className="text-sm text-brand-text-body text-center max-w-2xl mx-auto leading-relaxed mb-6">
                {c.compSubtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.advantages.map((adv, i) => {
              const AdvIcon = advantageIcons[i] || Sparkles;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-brand-primary/8 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-9 h-9 rounded-lg bg-brand-background-secondary flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                      <AdvIcon className="w-[18px] h-[18px] text-brand-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h4 className="font-bold text-[15px] text-brand-primary mb-3">{adv.title}</h4>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-[13px] text-brand-text-muted leading-relaxed">{adv.oldWay}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[13px] text-brand-primary font-semibold leading-relaxed">{adv.ourWay}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </div>
            </div>
          </motion.div>
        </div>
        {/* ═══════════ QUICK SCAN CTA + TESTIMONIALS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-brand-border/60 bg-white p-6 sm:p-8 md:p-10 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="md:max-w-[55%]">
              <h3 className="text-lg sm:text-xl font-bold text-brand-text-primary mb-2 leading-tight">
                {c.tryTitle}
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed">
                {c.tryDesc}
              </p>
            </div>
              <button
              onClick={() => {
                window.open(tryLink, PULSE_SCAN_WINDOW_NAME, PULSE_SCAN_WINDOW_FEATURES);
                trackPulseCheckOpen('signal_radar', language);
              }}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-hover transition-colors cursor-pointer shrink-0"
            >
              {c.tryCta}
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Testimonials carousel */}
          <QuickScanTestimonials lang={language} />
        </motion.div>

      </div>
    </section>
  );
}

/* ─── Testimonials embedded in Quick Scan CTA ─── */

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Dominik Hegedus",
    role: "CEO",
    company: "Expando",
    quote: "It took just a moment — and those few answers delivered exactly what we needed. No complicated reports, no endless spreadsheets — just clear, actionable insights.",
  },
  {
    name: "Jiří",
    role: "CEO",
    company: "Logistika",
    quote: "Jsem nadšený! Jsem na pozici CEO od srpna. Mám dát do pořádku celou firmu a potřebuji rychle zjistit, co se kde děje. Tohle je pro mě nesmírně cenné!",
  },
  {
    name: "Tereza Müllerová",
    role: "COO",
    company: "StartupJobs",
    quote: "Překvapilo mě, kolik lidí se zapojilo. A i když naši lídři se svými týmy pravidelně mluví, v Pulsu se ukázaly věci, které jim lidé do očí neřekli.",
  },
  {
    name: "Karel Poplstein",
    role: "CEO",
    company: "Valxon",
    quote: "I thought people are no longer engaged and gave up on us. I was surprised when I saw how engaged and invested our employees are. Moreover, without Behavera, we would've kept treating symptoms instead of the real causes. It helped us see what we would've otherwise missed.",
  },
  {
    name: "Dana Kultová",
    role: "COO",
    company: "",
    quote: "The results more or less confirmed what I suspected. But what truly blew me away was the playbook full of practical, step-by-step recommendations. Thanks to that, we fine-tuned our processes, set clear KPIs, and improved team communication.",
  },
  {
    name: "Head of HR",
    role: "Head of HR",
    company: "",
    quote: "I had given up hope of finding out what the company thinks. People hated surveys and just 30 % responded. And the data was useless. Behavera gave us clear message from over two-thirds of employees, which is more than enough to act.",
  },
  {
    name: "Ema Nováková",
    role: "HR Manager",
    company: "Expando",
    quote: "Díky Behaveře lídři dostanou výstupy z průzkumu automaticky a to i s akčními doporučeními okamžitě a já tak ušetřím celý týden, který nyní mohu investovat do zlepšování procesů a rozvoje zaměstnanců.",
  },
  {
    name: "Martina",
    role: "Manažerka telesales týmu",
    company: "Teya",
    quote: "Díky Echo Pulse mám pravidelný feedback o tom, jestli je můj tým v pohodě. Hned vidím, kdy je třeba urgentně řešit nějaký problém i co moje lidi pálí nejvíc. Jsem v roli lídra čerstvě a Behavera mi pomáhá si správně definovat priority.",
  },
  {
    name: "Ján Pavlík",
    role: "Project Manager",
    company: "Expando",
    quote: "Behavera nám ukázala, že kromě špatné interní komunikace máme také problémy s efektivní motivací lidí. Hodně mě to překvapilo. Nikdy předtím jsem to nepovažoval za problém.",
  },
];

function QuickScanTestimonials({ lang }: { lang: string }) {
  const [idx, setIdx] = useState(0);

  const next = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  const t = testimonials[idx];

  return (
    <div className="border-t border-brand-border/40 pt-5">
      <div className="relative min-h-[100px] flex items-center">
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-brand-border/60 hover:bg-brand-background-secondary flex items-center justify-center text-brand-text-muted transition-colors z-10 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronDown className="w-3.5 h-3.5 rotate-90" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-10 text-center w-full"
          >
            <p className="text-[13px] sm:text-sm text-brand-text-secondary leading-relaxed italic mb-3">
              &ldquo;{t.quote}&rdquo;
            </p>
            <span className="text-xs text-brand-text-muted">
              — {t.name}, {t.role}{t.company ? ` · ${t.company}` : ''}
            </span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-brand-border/60 hover:bg-brand-background-secondary flex items-center justify-center text-brand-text-muted transition-colors z-10 cursor-pointer"
          aria-label="Next"
        >
          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1 mt-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              i === idx ? 'bg-brand-accent w-4' : 'bg-brand-border w-1.5 hover:bg-brand-text-muted/40'
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
