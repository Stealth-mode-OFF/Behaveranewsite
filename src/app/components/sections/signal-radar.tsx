import { useCallback, useState, useRef, useEffect, type ElementType, type MouseEvent as ReactMouseEvent } from "react";
import {
  Activity, Zap, Briefcase, Heart, Shield, Award, Scale, Cpu,
  MessageCircle, Clock, BarChart3, Brain, ExternalLink, Sparkles,
  Send, CheckCircle2, XCircle, TrendingUp, ChevronDown, Timer,
  ChevronLeft, ChevronRight
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
  topicCards: { key: string; name: string; desc: string; sampleQ: string; ceoInsight: string; link: string }[];
  topicChip: string; chatLabel: string; ceoLabel: string;
  compTitle: string; compSubtitle: string; compTimeSaved: string;
  advantages: { title: string; oldWay: string; ourWay: string }[];
  tryTitle: string; tryDesc: string; tryCta: string; tryNote: string;
};

const PULSE_BASE = "https://bibi.behavera.com/free/behiro/pulse-showcase-";

const copy: Record<string, TCopy> = {
  cz: {
    badge: "Echo Pulse",
    title: "2 minuty. Většina lidí odpoví. ",
    titleHighlight: "Každý měsíc.",
    subtitle: "Žádné formuláře. Zaměstnanci odpovídají v krátkém AI chatu \u2014 ověřené otázky, které mluví lidsky. 80 %+ lidí reálně a rádo odpovídá.",
    stepsTitle: "Jak to funguje",
    steps: [
      { title: "Pulse Check se sám rozešle", desc: "Nastavíte jednou, dál běží automaticky. Slack, Teams nebo e-mail — bez práce navíc." },
      { title: "2min AI konverzace", desc: "Chatbot pokládá ověřené otázky navrženými psychology. Přirozeně, jako rozhovor s kolegou." },
      { title: "Výsledky v dashboardu", desc: "Okamžitý přehled, trendy v čase, AI doporučení k akci." },
    ],
    topicsTitle: "8 rozhovorů, které odhalí, co lidé neřeknou nahlas",
    topicsSubtitle: "Každý set je krátká AI konverzace na jedno téma. Otázky jsou ověřeny behaviorálními psychology a lidé na ně reálně a rádi odpovídají.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Celkový pulse vašeho týmu v 5 otázkách. Spokojenost, bariéry i to, co lidi baví — rázem máte obrázek, kde začít.", sampleQ: "\"Jak spokojeně se v poslední době cítíš v práci?\"", ceoInsight: "Okamžitě vidíte, jestli se nálada ve firmě zlepšuje nebo zhoršuje — bez čekání na kvartální report.", link: PULSE_BASE + "initial?x_lang=cs" },
      { key: "pay", name: "Odměňování", desc: "Férovost odměn, motivace a srovnání s trhem. 6 otázek, které odhalí, jestli vám lidé odcházejí kvůli penězům.", sampleQ: "\"Přišla ti tvá odměna férová vzhledem k práci, kterou odvádíš?\"", ceoInsight: "Zjistíte, jestli vám lidé odcházejí kvůli penězům — nebo kvůli něčemu, co se dá vyřešit levněji.", link: PULSE_BASE + "pay?x_lang=cs" },
      { key: "perks", name: "Benefity", desc: "Relevance benefitů, jejich skutečné využívání a co lidem chybí. 6 otázek včetně návrhů na zlepšení.", sampleQ: "\"Dodaly ti tvé benefity za poslední měsíc energii navíc, kterou jsi mohl/a využít?\"", ceoInsight: "Přestaňte utrácet za benefity, které nikdo nepoužívá. Investujte do toho, co lidé skutečně chtějí.", link: PULSE_BASE + "perks?x_lang=cs" },
      { key: "tools", name: "Nástroje & prostředí", desc: "Mají lidé k dispozici vše, co potřebují? Vybavení, podpora i zpětná vazba od manažera. 6 otázek.", sampleQ: "\"Mám k dispozici vše, co potřebuju — nástroje, vybavení i podporu — abych mohl/a dělat svou práci naplno.\"", ceoInsight: "Často stačí opravit jednu blbost — špatný nástroj, pomalý notebook — a produktivita celého týmu skočí.", link: PULSE_BASE + "tools?x_lang=cs" },
      { key: "workload", name: "Pracovní zátěž", desc: "Rovnováha mezi nároky, kapacitou a prioritami. 6 otázek, které odhalí, kdo je přetížený dříve, než vyhoří.", sampleQ: "\"I přes neplánované změny a vyrušení zvládám svoje denní úkoly a projekty.\"", ceoInsight: "Přetížení lidé nevyhoří za den — ale signály jsou vidět měsíce předem. Pokud víte, kam se dívat.", link: PULSE_BASE + "workload?x_lang=cs" },
      { key: "recognition", name: "Uznání", desc: "Je dobrá práce vidět? Zpětná vazba, ocenění, formy uznání, které lidem vyhovují. 6 otázek.", sampleQ: "\"Přišlo ti v uplynulém měsíci, že si někdo všiml, když se ti něco povedlo, a ocenil to?\"", ceoInsight: "80 % lidí, kteří odcházejí, říká, že se necítili dost oceněni. Tohle měření vám ukáže, kde to hoří.", link: PULSE_BASE + "recognition?x_lang=cs" },
      { key: "stress", name: "Stres & wellbeing", desc: "Chronický stres, regenerace a riziko vyhoření. 6 otázek, které měří pracovní tlak i schopnost odpočívat.", sampleQ: "\"Jak často tě pracovní nápor tíží, i když máš volno?\"", ceoInsight: "Burnout stojí firmu 2–3 roční platy na každém člověku. Signály zobrazujeme, než je pozdě.", link: PULSE_BASE + "stress?x_lang=cs" },
      { key: "values", name: "Hodnoty & kultura", desc: "Soulad mezi deklarovanými a žitými hodnotami. 6 otázek včetně: \"Co byste řekli kamarádovi o práci u nás?\"", sampleQ: "\"Když se tě kamarád zeptá, proč by měl jít pracovat k nám — co mu řekneš?\"", ceoInsight: "Zjistíte, jestli vaše hodnoty žijí v praxi — nebo jestli jsou jen na zdi v kuchyňce.", link: PULSE_BASE + "values?x_lang=cs" },
    ],
    topicChip: "5\u20136 otázek \u00B7 2 min",
    chatLabel: "Ukázka otázky",
    ceoLabel: "Proč to potřebujete vědět",
    compTitle: "Proč ne Google Forms?",
    compSubtitle: "Sbírat zpětnou vazbu přes formuláře umí každý. Ale funguje to?",
    compTimeSaved: "Ušetříte ~6 hodin na každém kole zpětné vazby",
    advantages: [
      { title: "80 %+ návratnost vs. 30–40 %", oldWay: "Formuláře: 30\u201340 % lidí dokončí", ourWay: "Pulse: typicky 80 %+ díky chat formátu" },
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
    title: "2 minutes. Most people respond. ",
    titleHighlight: "Every month.",
    subtitle: "No forms. Employees respond in a short AI-powered chat \u2014 tested questions that feel human. 80%+ actually enjoy answering.",
    stepsTitle: "How it works",
    steps: [
      { title: "Pulse Check sends itself", desc: "Set it up once, it runs automatically. Slack, Teams, or email — zero extra work." },
      { title: "2-min AI conversation", desc: "A chatbot asks psychologist-designed questions. Natural, like talking to a colleague." },
      { title: "Results in dashboard", desc: "Instant overview, trends over time, AI-powered action recommendations." },
    ],
    topicsTitle: "8 conversations that reveal what people won't say out loud",
    topicsSubtitle: "Each set is a short AI conversation on one topic. Questions are validated by behavioral psychologists — and people genuinely enjoy answering them.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Your team's overall pulse in 5 questions. Satisfaction, barriers, and what brings joy — you get the full picture of where to start.", sampleQ: "\"How happy have you felt at work recently?\"", ceoInsight: "Instantly see whether company morale is improving or declining — no waiting for quarterly reports.", link: PULSE_BASE + "initial?x_lang=en" },
      { key: "pay", name: "Compensation", desc: "Pay fairness, motivation, and market comparison. 6 questions that reveal whether people leave over money — or something else.", sampleQ: "\"Did your compensation feel fair given the work you put in?\"", ceoInsight: "Find out if people leave over money — or something cheaper to fix.", link: PULSE_BASE + "pay?x_lang=en" },
      { key: "perks", name: "Benefits", desc: "Benefit relevance, actual usage, and what's missing. 6 questions including suggestions for improvement.", sampleQ: "\"Did your benefits give you extra energy you could actually use?\"", ceoInsight: "Stop spending on perks nobody uses. Invest in what people actually want.", link: PULSE_BASE + "perks?x_lang=en" },
      { key: "tools", name: "Tools & Environment", desc: "Do people have everything they need? Equipment, support, and manager feedback. 6 questions.", sampleQ: "\"I have everything I need — tools, equipment, and support — to do my best work.\"", ceoInsight: "Often fixing one thing — a bad tool, a slow laptop — boosts the entire team's productivity.", link: PULSE_BASE + "tools?x_lang=en" },
      { key: "workload", name: "Workload", desc: "Balance between demands, capacity, and priorities. 6 questions that spot overload before people burn out.", sampleQ: "\"Even with unexpected changes and interruptions, I manage my daily tasks and projects.\"", ceoInsight: "Overloaded people don't burn out overnight — but the signals show months in advance. If you know where to look.", link: PULSE_BASE + "workload?x_lang=en" },
      { key: "recognition", name: "Recognition", desc: "Is good work visible? Feedback, appreciation, and preferred forms of recognition. 6 questions.", sampleQ: "\"In the past month, did someone notice when you did something well and appreciate it?\"", ceoInsight: "80% of people who leave say they didn't feel appreciated enough. This shows you where it's burning.", link: PULSE_BASE + "recognition?x_lang=en" },
      { key: "stress", name: "Stress & Wellbeing", desc: "Chronic stress, recovery, and burnout risk. 6 questions measuring work pressure and the ability to recharge.", sampleQ: "\"How often does work pressure weigh on you even when you're off?\"", ceoInsight: "Burnout costs 2–3 annual salaries per person. We surface the signals before it's too late.", link: PULSE_BASE + "stress?x_lang=en" },
      { key: "values", name: "Values & Culture", desc: "Alignment between declared and lived values. 6 questions including: \"What would you tell a friend about working here?\"", sampleQ: "\"When a friend asks why they should come work for us — what do you tell them?\"", ceoInsight: "Discover whether your values live in practice — or just on the kitchen wall poster.", link: PULSE_BASE + "values?x_lang=en" },
    ],
    topicChip: "5\u20136 questions \u00B7 2 min",
    chatLabel: "Sample question",
    ceoLabel: "Why you need to know this",
    compTitle: "Why not Google Forms?",
    compSubtitle: "Anyone can collect feedback with forms. But does it actually work?",
    compTimeSaved: "Save ~6 hours on every feedback cycle",
    advantages: [
      { title: "80%+ completion vs. 30–40%", oldWay: "Forms: 30\u201340% of people finish it", ourWay: "Pulse: typically 80%+ thanks to chat format" },
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
    title: "2 Minuten. Die meisten antworten. ",
    titleHighlight: "Jeden Monat.",
    subtitle: "Keine Formulare. Mitarbeiter antworten in einem kurzen AI-Chat \u2014 getestete Fragen, die menschlich klingen. 80 %+ antworten gerne.",
    stepsTitle: "So funktioniert es",
    steps: [
      { title: "Pulse Check sendet sich selbst", desc: "Einmal einrichten, läuft automatisch. Slack, Teams oder E-Mail — kein Mehraufwand." },
      { title: "2-Min AI-Gespräch", desc: "Ein Chatbot stellt von Psychologen validierte Fragen. Natürlich, wie ein Gespräch mit einem Kollegen." },
      { title: "Ergebnisse im Dashboard", desc: "Sofortiger Überblick, Trends und KI-gestützte Handlungsempfehlungen." },
    ],
    topicsTitle: "8 Gespräche, die zeigen, was Mitarbeiter nicht laut sagen",
    topicsSubtitle: "Jedes Set ist ein kurzes AI-Gespräch zu einem Thema. Fragen sind von Verhaltenspsychologen validiert — und Mitarbeiter beantworten sie gerne.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Der Gesamtpuls Ihres Teams in 5 Fragen. Zufriedenheit, Hindernisse & was Freude macht — auf einen Blick.", sampleQ: "\"Wie zufrieden fühlst du dich aktuell bei der Arbeit?\"", ceoInsight: "Sofort sehen, ob sich die Stimmung verbessert oder verschlechtert — ohne auf den Quartalsbericht zu warten.", link: PULSE_BASE + "initial?x_lang=en" },
      { key: "pay", name: "Vergütung", desc: "Fairness, Motivation und Marktvergleich. 6 Fragen, die zeigen, ob Mitarbeiter wegen Geld gehen.", sampleQ: "\"Empfandest du deine Vergütung als fair für die Arbeit, die du geleistet hast?\"", ceoInsight: "Erfahren Sie, ob Mitarbeiter wegen des Geldes gehen — oder wegen etwas, das günstiger zu lösen ist.", link: PULSE_BASE + "pay?x_lang=en" },
      { key: "perks", name: "Benefits", desc: "Relevanz, tatsächliche Nutzung und was fehlt. 6 Fragen inkl. Verbesserungsvorschläge.", sampleQ: "\"Haben dir deine Benefits im letzten Monat zusätzliche Energie gegeben?\"", ceoInsight: "Hören Sie auf, für Benefits auszugeben, die niemand nutzt. Investieren Sie in das, was Mitarbeiter wirklich wollen.", link: PULSE_BASE + "perks?x_lang=en" },
      { key: "tools", name: "Tools & Umgebung", desc: "Haben Mitarbeiter alles, was sie brauchen? Ausstattung, Support & Manager-Feedback. 6 Fragen.", sampleQ: "\"Ich habe alles — Werkzeuge, Ausstattung und Unterstützung — um meine Arbeit bestmöglich zu erledigen.\"", ceoInsight: "Oft reicht es, eine Kleinigkeit zu reparieren, um die Produktivität des ganzen Teams zu steigern.", link: PULSE_BASE + "tools?x_lang=en" },
      { key: "workload", name: "Arbeitsbelastung", desc: "Balance zwischen Anforderungen, Kapazität und Prioritäten. 6 Fragen, die Überlastung früh erkennen.", sampleQ: "\"Auch bei unerwarteten Änderungen und Unterbrechungen schaffe ich meine täglichen Aufgaben und Projekte.\"", ceoInsight: "Überlastete Mitarbeiter brennen nicht über Nacht aus — aber die Signale zeigen sich Monate vorher.", link: PULSE_BASE + "workload?x_lang=en" },
      { key: "recognition", name: "Anerkennung", desc: "Wird gute Arbeit gesehen? Feedback, Wertschätzung und bevorzugte Formen. 6 Fragen.", sampleQ: "\"Hat im letzten Monat jemand bemerkt, wenn dir etwas gelungen ist, und es anerkannt?\"", ceoInsight: "80 % der Mitarbeiter, die gehen, fühlten sich nicht genug wertgeschätzt. Hier sehen Sie, wo es brennt.", link: PULSE_BASE + "recognition?x_lang=en" },
      { key: "stress", name: "Stress & Wellbeing", desc: "Chronischer Stress, Erholung und Burnout-Risiko. 6 Fragen zu Arbeitsdruck & Regeneration.", sampleQ: "\"Wie oft belastet dich der Arbeitsdruck auch in deiner Freizeit?\"", ceoInsight: "Burnout kostet 2–3 Jahresgehälter pro Person. Wir zeigen die Signale, bevor es zu spät ist.", link: PULSE_BASE + "stress?x_lang=en" },
      { key: "values", name: "Werte & Kultur", desc: "Übereinstimmung zwischen erklärten und gelebten Werten. 6 Fragen inkl. \"Was würden Sie einem Freund sagen?\"", sampleQ: "\"Wenn ein Freund fragt, warum er bei uns arbeiten sollte — was sagst du ihm?\"", ceoInsight: "Erfahren Sie, ob Ihre Werte in der Praxis leben — oder nur am Poster in der Küche hängen.", link: PULSE_BASE + "values?x_lang=en" },
    ],
    topicChip: "5\u20136 Fragen \u00B7 2 Min",
    chatLabel: "Beispielfrage",
    ceoLabel: "Warum Sie das wissen müssen",
    compTitle: "Warum nicht Google Forms?",
    compSubtitle: "Feedback mit Formularen sammeln kann jeder. Aber funktioniert es?",
    compTimeSaved: "Sparen Sie ~6 Stunden pro Feedback-Zyklus",
    advantages: [
      { title: "80 %+ Rücklauf vs. 30–40 %", oldWay: "Formulare: 30\u201340 % füllen es aus", ourWay: "Pulse: typisch 80 %+ dank Chat-Format" },
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

        {/* ═══════════ 8 TOPIC CARDS — Infinite Carousel ═══════════ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-text-primary mb-4">
              {c.topicsTitle}
            </h3>
            <p className="text-base text-brand-text-body max-w-2xl mx-auto leading-relaxed mb-5">
              {c.topicsSubtitle}
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10">
              <div className="flex -space-x-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-brand-primary/20 border-2 border-white flex items-center justify-center">
                    <span className="text-[7px] font-bold text-brand-primary">{i + 1}</span>
                  </div>
                ))}
              </div>
              <span className="text-[12px] font-semibold text-brand-primary">{c.topicCards.length} {language === 'cz' ? 'oblastí' : language === 'de' ? 'Bereiche' : 'areas'} · {language === 'cz' ? '~45 otázek celkem' : language === 'de' ? '~45 Fragen gesamt' : '~45 questions total'}</span>
            </div>
          </div>

          <TopicCarousel cards={c.topicCards} topicChip={c.topicChip} chatLabel={c.chatLabel} ceoLabel={c.ceoLabel} />
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

/* ─── Infinite Topic Carousel ─── */

type TopicCard = TCopy['topicCards'][number];

function TopicCarousel({
  cards,
  topicChip,
  chatLabel,
  ceoLabel,
}: {
  cards: TopicCard[];
  topicChip: string;
  chatLabel: string;
  ceoLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPos = useRef(0);
  const CARD_WIDTH = 360; // card width + gap
  const SPEED = 0.5; // px per frame

  // Duplicate cards 3x for seamless infinite scroll
  const tripled = [...cards, ...cards, ...cards];
  const setWidth = cards.length * CARD_WIDTH;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start in the middle set
    scrollPos.current = setWidth;
    el.scrollLeft = setWidth;

    const tick = () => {
      if (!isPaused && el) {
        scrollPos.current += SPEED;
        // If we've scrolled past the middle + full set, jump back to middle
        if (scrollPos.current >= setWidth * 2) {
          scrollPos.current -= setWidth;
        }
        el.scrollLeft = scrollPos.current;
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, setWidth]);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    scrollPos.current += dir * CARD_WIDTH;
    el.scrollTo({ left: scrollPos.current, behavior: 'smooth' });
  };

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Nav arrows */}
      <button
        onClick={() => scrollBy(-1)}
        className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-brand-border shadow-lg flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scrollBy(1)}
        className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-brand-border shadow-lg flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-brand-background-secondary/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-brand-background-secondary/30 to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden scroll-smooth"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {tripled.map((card, i) => {
          const TopicIcon = topicIcons[card.key] || Activity;
          const cardNum = (i % cards.length) + 1;
          return (
            <div
              key={`${card.key}-${i}`}
              className="shrink-0 w-[340px] rounded-2xl bg-white border border-brand-primary/8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 p-5 pb-0">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 relative">
                  <TopicIcon className="w-5 h-5 text-brand-primary" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">{cardNum}</span>
                </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[15px] text-brand-primary leading-tight">{card.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-brand-text-muted" />
                    <span className="text-[11px] text-brand-text-muted font-medium">{topicChip}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-brand-text-body leading-relaxed px-5 pt-3">
                {card.desc}
              </p>

              {/* Sample AI chat bubble */}
              <div className="px-5 pt-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-text-muted mb-2 flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3" />
                  {chatLabel}
                </div>
                <div className="bg-brand-background-secondary rounded-xl rounded-tl-sm px-4 py-3 text-[13px] text-brand-text-secondary leading-relaxed italic border border-brand-border/40">
                  {card.sampleQ}
                </div>
              </div>

              {/* CEO insight */}
              <div className="px-5 pt-4 pb-5 mt-auto">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-accent mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  {ceoLabel}
                </div>
                <p className="text-[12px] text-brand-text-body leading-relaxed">
                  {card.ceoInsight}
                </p>
              </div>

              {/* Try it link */}
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 border-t border-brand-border/40 text-[13px] font-semibold text-brand-primary hover:bg-brand-background-secondary transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {card.name}
              </a>
            </div>
          );
        })}
      </div>
    </div>
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
    company: "logistická firma",
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
    company: "klientská firma",
    quote: "The results more or less confirmed what I suspected. But what truly blew me away was the playbook full of practical, step-by-step recommendations. Thanks to that, we fine-tuned our processes, set clear KPIs, and improved team communication.",
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
