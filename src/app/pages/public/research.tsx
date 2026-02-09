import React from 'react';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import {
  ArrowRight,
  Brain,
  Scale,
  Shield,
  CheckCircle2,
  Lightbulb,
  Microscope,
  Target,
  BarChart3,
  AlertTriangle,
  FileText,
  Heart,
  Zap,
  DollarSign,
  Gift,
  Award,
  Rocket,
  Wrench,
  Activity,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Multi-language copy                                                */
/* ------------------------------------------------------------------ */

type ResearchCopy = {
  seo: { title: string; description: string; keywords: string };
  badge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroStats: { value: string; label: string }[];
  evidenceStats: { value: string; label: string; source: string }[];
  modelsLabel: string;
  modelsTitle: string;
  modelsSubtitle: string;
  models: { title: string; authors: string; year: string; description: string; maps: string[] }[];
  areasLabel: string;
  areasTitle: string;
  areasSubtitle: string;
  areas: { name: string; desc: string }[];
  howLabel: string;
  howTitle: string;
  howSubtitle: string;
  howSteps: { title: string; desc: string }[];
  howProofs: string[];
  rigorLabel: string;
  rigorTitle: string;
  rigorSubtitle: string;
  rigorPoints: { title: string; desc: string }[];
  boundaryLabel: string;
  boundaryTitle: string;
  boundarySubtitle: string;
  boundaries: { title: string; desc: string }[];
  ctaBadge: string;
  ctaTitle: string;
  ctaTitleHighlight: string;
  ctaDesc: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaNote: string;
};

const copy: Record<string, ResearchCopy> = {
  cz: {
    seo: {
      title: 'Vědecký základ | Echo Pulse by Behavera',
      description: 'Echo Pulse stojí na třech vědecky ověřených modelech: JD-R, Self-Determination Theory a Equity Theory. 50 000+ otestovaných, 91% návratnost.',
      keywords: 'JD-R model, Self-Determination Theory, Equity Theory, organizační psychologie, engagement, burnout detekce, Behavera',
    },
    badge: 'VĚDECKÝ ZÁKLAD',
    heroTitle: 'Jak Echo Pulse funguje',
    heroTitleHighlight: 'pod kapotou',
    heroSubtitle: 'Náš systém stojí na desetiletích validovaného výzkumu v organizační psychologii. Žádné buzzwordy — modely, které prokazatelně předpovídají chování lidí ve firmách.',
    heroStats: [
      { value: '3', label: 'Vědecké modely' },
      { value: '50k+', label: 'Otestovaných lidí' },
      { value: '91%', label: 'Návratnost' },
    ],
    evidenceStats: [
      { value: '€50k', label: 'Úspora na udržení 1 klíčového zaměstnance', source: 'SHRM Benchmarking' },
      { value: '59%', label: 'Méně odchodů u engagovaných týmů', source: 'Gallup Q12' },
      { value: '20%', label: 'Vyšší produktivita engagovaných lidí', source: 'Gallup 2023' },
      { value: '70%', label: 'Vlivu na engagement má přímý manažer', source: 'Manager Impact Study' },
    ],
    modelsLabel: '01 — VĚDECKÉ ZÁKLADY',
    modelsTitle: 'Tři modely v jádru systému',
    modelsSubtitle: 'Otázky v Echo Pulse vycházejí z modelů, které mají tisíce citací v akademické literatuře a desítky let empirického ověřování.',
    models: [
      {
        title: 'JD-R Model',
        authors: 'Bakker & Demerouti',
        year: '2001',
        description: 'Job Demands-Resources model vysvětluje, proč lidé vyhoří nebo naopak podávají výkon. Když nároky (zátěž, tlak, nejasnosti) převýší zdroje (podpora, autonomie, nástroje), roste riziko vyhoření. Když zdrojů přibývá, roste engagement.',
        maps: ['Pracovní zátěž', 'Stres', 'Nástroje'],
      },
      {
        title: 'Self-Determination Theory',
        authors: 'Deci & Ryan',
        year: '1985',
        description: 'Vnitřní motivace závisí na třech psychologických potřebách: autonomie (rozhoduji sám), kompetence (rostu a učím se) a sounáležitost (patřím do týmu). Deficit v jedné oblasti degraduje celkovou motivaci.',
        maps: ['Uznání', 'Hodnoty', 'Quick Scan'],
      },
      {
        title: 'Equity Theory',
        authors: 'Adams',
        year: '1963',
        description: 'Vnímaná spravedlnost odměňování má silnější vliv na rozhodnutí odejít než absolutní výše platu. Lidé porovnávají svůj vklad a odměnu s kolegy — a pokud cítí nerovnováhu, motivace klesá.',
        maps: ['Odměňování', 'Benefity'],
      },
    ],
    areasLabel: '02 — CO MĚŘÍME',
    areasTitle: '8 oblastí, které rozhodují o výkonu a setrvání',
    areasSubtitle: 'Každá oblast odpovídá konkrétnímu vědeckému konstruktu. Kombinace všech 8 dává kompletní obraz toho, co lidi drží ve firmě — a co je tiše tlačí k odchodu.',
    areas: [
      { name: 'Quick Scan', desc: 'Celkový přehled spokojenosti. Odhalí, kam se zaměřit.' },
      { name: 'Odměňování', desc: 'Férovost, transparentnost a srovnání s trhem.' },
      { name: 'Benefity', desc: 'Relevance a skutečné využívání nabízených benefitů.' },
      { name: 'Nástroje', desc: 'Mají lidé k dispozici to, co potřebují k práci?' },
      { name: 'Pracovní zátěž', desc: 'Rovnováha mezi nároky a kapacitou týmu.' },
      { name: 'Uznání', desc: 'Je dobrá práce vidět? Zpětná vazba a ocenění.' },
      { name: 'Stres', desc: 'Chronický stres, regenerace a riziko vyhoření.' },
      { name: 'Hodnoty', desc: 'Soulad mezi deklarovanými a žitými hodnotami firmy.' },
    ],
    howLabel: '03 — SBĚR DAT',
    howTitle: 'Chat místo dotazníku',
    howSubtitle: 'Echo Pulse vypadá jako krátká konverzace s chatbotem, ne jako formulář. Proto ho lidé skutečně dokončí.',
    howSteps: [
      { title: 'Pošlete Pulse Check', desc: 'Jeden odkaz pro celý tým. Bez instalace, bez loginu, funguje na mobilu.' },
      { title: '5 otázek, 3 minuty', desc: 'AI chatbot pokládá cílené otázky v přirozeném jazyce. Zaměstnanci mohou psát vlastní komentáře.' },
      { title: 'Výsledky okamžitě', desc: 'Real-time dashboard s AI analýzou, trendy v čase a konkrétními doporučeními pro manažery.' },
    ],
    howProofs: [
      '100% anonymita — agregace min. 5 respondentů',
      'Otázky navržené a revidované psychometrickým týmem',
      'End-to-end encryption, GDPR-compliant',
      'Měsíční nebo dvoutýdenní frekvence dle potřeby',
    ],
    rigorLabel: '04 — KVALITA',
    rigorTitle: 'Ne generic GPT wrapper',
    rigorSubtitle: 'Echo Pulse využívá proprietární AI model natrénovaný na behaviorální data a organizační psychologii.',
    rigorPoints: [
      { title: 'Vlastní psychometrický tým', desc: 'Otázky nejsou AI-generované náhodně — jsou vytvořené a peer-reviewed odborníky na psychometrii.' },
      { title: 'Proprietární behaviorální logika', desc: 'AI detekuje skryté vzorce, posuny v tónu odpovědí a bariéry výkonu na základě vlastního know-how.' },
      { title: 'Validované na 50 000+ lidech', desc: 'Model průběžně zpřesňujeme na základě reálných dat z organizací různých velikostí a odvětví.' },
      { title: 'Akční doporučení, ne prázdné fráze', desc: 'Manažer dostane konkrétní kroky, ne 50stránkový report. Každé doporučení je zasazené do kontextu jeho týmu.' },
    ],
    boundaryLabel: '05 — HRANICE SYSTÉMU',
    boundaryTitle: 'Co Echo Pulse není',
    boundarySubtitle: 'Jasné vymezení systému zajišťuje správné použití a etickou implementaci.',
    boundaries: [
      { title: 'Není klinická diagnostika', desc: 'Systém detekuje rizikové vzorce v týmech. Není náhradou za profesionální psychologickou intervenci.' },
      { title: 'Není hodnocení výkonu', desc: 'Měří organizační zdraví a engagement. Není navržen pro individuální performance management.' },
      { title: 'Není roční průzkum spokojenosti', desc: 'Zaměřuje se na prediktivní signály v krátkých pulsech. Nezahrnuje širokou satisfaction metriku.' },
      { title: 'Není nástroj na kontrolu', desc: 'Data jsou anonymní a agregovaná. Slouží k pochopení týmu, ne k sledování jednotlivců.' },
    ],
    ctaBadge: 'DALŠÍ KROK',
    ctaTitle: 'Zjistěte, jestli Echo Pulse',
    ctaTitleHighlight: 'sedí na vaši firmu',
    ctaDesc: '15minutové demo. Ukážeme vám, jak Echo Pulse funguje pro firmy jako je ta vaše — a co se dozvíte už z prvního Pulse Checku.',
    ctaPrimary: 'Vyzkoušet demo',
    ctaSecondary: 'Zpět na hlavní stránku',
    ctaNote: 'Zdarma pro tým do 5 lidí. Bez závazků.',
  },
  en: {
    seo: {
      title: 'Scientific Foundation | Echo Pulse by Behavera',
      description: 'Echo Pulse is built on three validated models: JD-R, Self-Determination Theory, and Equity Theory. 50,000+ tested, 91% response rate.',
      keywords: 'JD-R model, Self-Determination Theory, Equity Theory, organizational psychology, engagement, burnout detection, Behavera',
    },
    badge: 'SCIENTIFIC FOUNDATION',
    heroTitle: 'How Echo Pulse works',
    heroTitleHighlight: 'under the hood',
    heroSubtitle: 'Our system is built on decades of validated research in organizational psychology. No buzzwords — models that demonstrably predict behavior in organizations.',
    heroStats: [
      { value: '3', label: 'Scientific models' },
      { value: '50k+', label: 'People tested' },
      { value: '91%', label: 'Response rate' },
    ],
    evidenceStats: [
      { value: '€50k', label: 'Saved by retaining 1 key employee', source: 'SHRM Benchmarking' },
      { value: '59%', label: 'Fewer departures in engaged teams', source: 'Gallup Q12' },
      { value: '20%', label: 'Higher productivity from engaged people', source: 'Gallup 2023' },
      { value: '70%', label: 'Of engagement impact comes from direct manager', source: 'Manager Impact Study' },
    ],
    modelsLabel: '01 — SCIENTIFIC FOUNDATION',
    modelsTitle: 'Three models at the core',
    modelsSubtitle: 'Echo Pulse questions are based on models with thousands of academic citations and decades of empirical validation.',
    models: [
      {
        title: 'JD-R Model',
        authors: 'Bakker & Demerouti',
        year: '2001',
        description: 'The Job Demands-Resources model explains why people burn out or thrive. When demands (workload, pressure, ambiguity) exceed resources (support, autonomy, tools), burnout risk rises. When resources grow, engagement follows.',
        maps: ['Workload', 'Stress', 'Tools'],
      },
      {
        title: 'Self-Determination Theory',
        authors: 'Deci & Ryan',
        year: '1985',
        description: 'Intrinsic motivation depends on three psychological needs: autonomy (I decide), competence (I grow and learn), and relatedness (I belong). A deficit in any one degrades overall motivation.',
        maps: ['Recognition', 'Values', 'Quick Scan'],
      },
      {
        title: 'Equity Theory',
        authors: 'Adams',
        year: '1963',
        description: 'Perceived fairness of rewards has a stronger impact on turnover decisions than absolute pay levels. People compare their input-reward ratio with peers — and when they sense imbalance, motivation drops.',
        maps: ['Compensation', 'Benefits'],
      },
    ],
    areasLabel: '02 — WHAT WE MEASURE',
    areasTitle: '8 areas that determine performance and retention',
    areasSubtitle: 'Each area maps to a specific scientific construct. Combined, they provide a complete picture of what keeps people — and what quietly pushes them toward the door.',
    areas: [
      { name: 'Quick Scan', desc: 'Overall satisfaction snapshot. Reveals where to focus.' },
      { name: 'Compensation', desc: 'Fair pay, transparency, and market comparison.' },
      { name: 'Benefits', desc: 'Relevance and actual usage of offered benefits.' },
      { name: 'Tools', desc: 'Do people have what they need to do great work?' },
      { name: 'Workload', desc: 'Balance between demands and team capacity.' },
      { name: 'Recognition', desc: 'Is good work visible? Feedback and appreciation.' },
      { name: 'Stress', desc: 'Chronic stress levels, recovery, and burnout risk.' },
      { name: 'Values', desc: 'Alignment between declared and lived company values.' },
    ],
    howLabel: '03 — DATA COLLECTION',
    howTitle: 'A chat, not a survey',
    howSubtitle: "Echo Pulse looks like a short chatbot conversation, not a form. That's why people actually complete it.",
    howSteps: [
      { title: 'Send a Pulse Check', desc: 'One link for the whole team. No install, no login, works on mobile.' },
      { title: '5 questions, 3 minutes', desc: 'AI chatbot asks targeted questions in natural language. Employees can write their own comments.' },
      { title: 'Results instantly', desc: 'Real-time dashboard with AI analysis, trends over time, and concrete recommendations for managers.' },
    ],
    howProofs: [
      '100% anonymity — min. 5 respondents per segment',
      'Questions designed and reviewed by psychometric team',
      'End-to-end encryption, GDPR-compliant',
      'Monthly or bi-weekly frequency as needed',
    ],
    rigorLabel: '04 — QUALITY',
    rigorTitle: 'Not a generic GPT wrapper',
    rigorSubtitle: 'Echo Pulse uses a proprietary AI model trained on behavioral data and organizational psychology.',
    rigorPoints: [
      { title: 'Dedicated psychometric team', desc: "Questions aren't randomly AI-generated — they're created and peer-reviewed by psychometrics specialists." },
      { title: 'Proprietary behavioral logic', desc: 'AI detects hidden patterns, shifts in response tone, and performance barriers based on proprietary know-how.' },
      { title: 'Validated on 50,000+ people', desc: 'The model is continuously refined based on real data from organizations of various sizes and industries.' },
      { title: 'Actionable recommendations, not empty phrases', desc: "Managers get concrete steps, not 50-page reports. Every recommendation is contextualized to their team." },
    ],
    boundaryLabel: '05 — SYSTEM BOUNDARIES',
    boundaryTitle: "What Echo Pulse isn't",
    boundarySubtitle: 'Clear boundaries ensure proper use and ethical implementation.',
    boundaries: [
      { title: 'Not clinical diagnostics', desc: 'The system detects risk patterns in teams. It does not substitute professional psychological intervention.' },
      { title: 'Not performance reviews', desc: 'It measures organizational health and engagement. Not designed for individual performance management.' },
      { title: 'Not an annual satisfaction survey', desc: 'It focuses on predictive signals through short pulses. Not broad satisfaction metrics.' },
      { title: 'Not a surveillance tool', desc: 'Data is anonymous and aggregated. It serves to understand teams, not monitor individuals.' },
    ],
    ctaBadge: 'NEXT STEP',
    ctaTitle: 'See if Echo Pulse is',
    ctaTitleHighlight: 'right for your company',
    ctaDesc: "15-minute demo. We'll show you how Echo Pulse works for companies like yours — and what you'll learn from the very first Pulse Check.",
    ctaPrimary: 'Book a demo',
    ctaSecondary: 'Back to homepage',
    ctaNote: 'Free for teams up to 5 people. No commitment.',
  },
  de: {
    seo: {
      title: 'Wissenschaftliche Grundlage | Echo Pulse by Behavera',
      description: 'Echo Pulse basiert auf drei validierten Modellen: JD-R, Self-Determination Theory und Equity Theory. 50.000+ getestet, 91% Antwortrate.',
      keywords: 'JD-R Modell, Self-Determination Theory, Equity Theory, Organisationspsychologie, Engagement, Burnout-Erkennung, Behavera',
    },
    badge: 'WISSENSCHAFTLICHE GRUNDLAGE',
    heroTitle: 'Wie Echo Pulse',
    heroTitleHighlight: 'unter der Haube funktioniert',
    heroSubtitle: 'Unser System basiert auf Jahrzehnten validierter Forschung in der Organisationspsychologie. Keine Buzzwords — Modelle, die nachweislich Verhalten in Organisationen vorhersagen.',
    heroStats: [
      { value: '3', label: 'Wissenschaftliche Modelle' },
      { value: '50k+', label: 'Getestete Personen' },
      { value: '91%', label: 'Antwortrate' },
    ],
    evidenceStats: [
      { value: '€50k', label: 'Ersparnis durch Bindung eines Schlüsselmitarbeiters', source: 'SHRM Benchmarking' },
      { value: '59%', label: 'Weniger Abgänge bei engagierten Teams', source: 'Gallup Q12' },
      { value: '20%', label: 'Höhere Produktivität engagierter Mitarbeiter', source: 'Gallup 2023' },
      { value: '70%', label: 'Des Engagement-Einflusses kommt vom direkten Vorgesetzten', source: 'Manager Impact Study' },
    ],
    modelsLabel: '01 — WISSENSCHAFTLICHE GRUNDLAGE',
    modelsTitle: 'Drei Modelle im Kern',
    modelsSubtitle: 'Echo Pulse Fragen basieren auf Modellen mit tausenden akademischen Zitierungen und Jahrzehnten empirischer Validierung.',
    models: [
      {
        title: 'JD-R Modell',
        authors: 'Bakker & Demerouti',
        year: '2001',
        description: 'Das Job Demands-Resources Modell erklärt, warum Menschen ausbrennen oder Leistung bringen. Wenn Anforderungen (Belastung, Druck, Unklarheiten) die Ressourcen (Unterstützung, Autonomie, Werkzeuge) übersteigen, steigt das Burnout-Risiko. Wenn Ressourcen wachsen, steigt das Engagement.',
        maps: ['Arbeitsbelastung', 'Stress', 'Werkzeuge'],
      },
      {
        title: 'Self-Determination Theory',
        authors: 'Deci & Ryan',
        year: '1985',
        description: 'Intrinsische Motivation hängt von drei psychologischen Bedürfnissen ab: Autonomie (ich entscheide), Kompetenz (ich wachse und lerne) und Zugehörigkeit (ich gehöre dazu). Ein Defizit in einem Bereich beeinträchtigt die Gesamtmotivation.',
        maps: ['Anerkennung', 'Werte', 'Quick Scan'],
      },
      {
        title: 'Equity Theory',
        authors: 'Adams',
        year: '1963',
        description: 'Wahrgenommene Fairness der Vergütung hat einen stärkeren Einfluss auf Kündigungsentscheidungen als die absolute Gehaltshöhe. Menschen vergleichen ihr Input-Reward-Verhältnis mit Kollegen — und wenn sie ein Ungleichgewicht spüren, sinkt die Motivation.',
        maps: ['Vergütung', 'Benefits'],
      },
    ],
    areasLabel: '02 — WAS WIR MESSEN',
    areasTitle: '8 Bereiche, die über Leistung und Verbleib entscheiden',
    areasSubtitle: 'Jeder Bereich entspricht einem spezifischen wissenschaftlichen Konstrukt. Zusammen ergeben sie ein vollständiges Bild dessen, was Menschen hält — und was sie still zur Tür bewegt.',
    areas: [
      { name: 'Quick Scan', desc: 'Gesamtüberblick der Zufriedenheit. Zeigt, wo der Fokus liegen sollte.' },
      { name: 'Vergütung', desc: 'Faire Bezahlung, Transparenz und Marktvergleich.' },
      { name: 'Benefits', desc: 'Relevanz und tatsächliche Nutzung der angebotenen Benefits.' },
      { name: 'Werkzeuge', desc: 'Haben die Menschen, was sie für gute Arbeit brauchen?' },
      { name: 'Arbeitsbelastung', desc: 'Gleichgewicht zwischen Anforderungen und Teamkapazität.' },
      { name: 'Anerkennung', desc: 'Ist gute Arbeit sichtbar? Feedback und Wertschätzung.' },
      { name: 'Stress', desc: 'Chronischer Stress, Erholung und Burnout-Risiko.' },
      { name: 'Werte', desc: 'Übereinstimmung zwischen deklarierten und gelebten Unternehmenswerten.' },
    ],
    howLabel: '03 — DATENERFASSUNG',
    howTitle: 'Ein Chat, keine Umfrage',
    howSubtitle: 'Echo Pulse sieht aus wie ein kurzes Chatbot-Gespräch, nicht wie ein Formular. Deshalb füllen es die Leute tatsächlich aus.',
    howSteps: [
      { title: 'Pulse Check senden', desc: 'Ein Link für das gesamte Team. Keine Installation, kein Login, funktioniert auf dem Handy.' },
      { title: '5 Fragen, 3 Minuten', desc: 'KI-Chatbot stellt gezielte Fragen in natürlicher Sprache. Mitarbeiter können eigene Kommentare schreiben.' },
      { title: 'Ergebnisse sofort', desc: 'Echtzeit-Dashboard mit KI-Analyse, Trends über die Zeit und konkreten Empfehlungen für Führungskräfte.' },
    ],
    howProofs: [
      '100% Anonymität — min. 5 Befragte pro Segment',
      'Fragen von psychometrischem Team entwickelt und geprüft',
      'End-to-End-Verschlüsselung, DSGVO-konform',
      'Monatliche oder zweiwöchentliche Frequenz nach Bedarf',
    ],
    rigorLabel: '04 — QUALITÄT',
    rigorTitle: 'Kein generischer GPT-Wrapper',
    rigorSubtitle: 'Echo Pulse nutzt ein proprietäres KI-Modell, trainiert auf Verhaltensdaten und Organisationspsychologie.',
    rigorPoints: [
      { title: 'Eigenes psychometrisches Team', desc: 'Fragen werden nicht zufällig KI-generiert — sie werden von Psychometrie-Spezialisten erstellt und peer-reviewed.' },
      { title: 'Proprietäre Verhaltenslogik', desc: 'KI erkennt verborgene Muster, Tonverschiebungen in Antworten und Leistungsbarrieren basierend auf eigenem Know-how.' },
      { title: 'Validiert an 50.000+ Menschen', desc: 'Das Modell wird kontinuierlich auf Basis realer Daten aus Organisationen verschiedener Größen und Branchen verfeinert.' },
      { title: 'Handlungsempfehlungen, keine leeren Phrasen', desc: 'Führungskräfte erhalten konkrete Schritte, keine 50-seitigen Berichte. Jede Empfehlung ist im Teamkontext verankert.' },
    ],
    boundaryLabel: '05 — SYSTEMGRENZEN',
    boundaryTitle: 'Was Echo Pulse nicht ist',
    boundarySubtitle: 'Klare Grenzen gewährleisten korrekte Nutzung und ethische Implementierung.',
    boundaries: [
      { title: 'Keine klinische Diagnostik', desc: 'Das System erkennt Risikomuster in Teams. Es ersetzt keine professionelle psychologische Intervention.' },
      { title: 'Keine Leistungsbeurteilung', desc: 'Es misst organisatorische Gesundheit und Engagement. Nicht für individuelles Performance Management konzipiert.' },
      { title: 'Keine jährliche Zufriedenheitsumfrage', desc: 'Es konzentriert sich auf prädiktive Signale in kurzen Pulsen. Keine breiten Zufriedenheitsmetriken.' },
      { title: 'Kein Überwachungstool', desc: 'Daten sind anonym und aggregiert. Es dient dem Verständnis von Teams, nicht der Überwachung Einzelner.' },
    ],
    ctaBadge: 'NÄCHSTER SCHRITT',
    ctaTitle: 'Finden Sie heraus, ob Echo Pulse',
    ctaTitleHighlight: 'zu Ihrem Unternehmen passt',
    ctaDesc: '15-Minuten-Demo. Wir zeigen Ihnen, wie Echo Pulse für Unternehmen wie Ihres funktioniert — und was Sie schon beim ersten Pulse Check erfahren.',
    ctaPrimary: 'Demo buchen',
    ctaSecondary: 'Zurück zur Startseite',
    ctaNote: 'Kostenlos für Teams bis 5 Personen. Ohne Verpflichtung.',
  },
};

/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */

const modelColors = [
  { bg: 'bg-brand-primary', border: 'border-brand-border', icon: Scale },
  { bg: 'bg-brand-accent', border: 'border-brand-border', icon: Brain },
  { bg: 'bg-brand-primary-hover', border: 'border-brand-border', icon: Target },
];

const areaIcons = [Activity, DollarSign, Gift, Wrench, BarChart3, Award, Heart, Rocket];

const ModelCard = ({
  model,
  color,
  index,
}: {
  model: ResearchCopy['models'][number];
  color: (typeof modelColors)[number];
  index: number;
}) => {
  const Icon = color.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative bg-brand-background-primary rounded-3xl overflow-hidden border ${color.border} hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500`}
    >
      <div className={`${color.bg} p-8 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{model.title}</h3>
            <p className="text-sm text-white/70 font-mono">
              {model.authors}, {model.year}
            </p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <p className="text-brand-text-secondary leading-relaxed mb-6">{model.description}</p>
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">
            Echo Pulse areas
          </p>
          <div className="flex flex-wrap gap-2">
            {model.maps.map((m, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${color.bg} text-white`}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BoundaryItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/70 leading-relaxed">{description}</p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export const ResearchPage = () => {
  const { language } = useLanguage();
  const c = copy[language] || copy.en;

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords,
    ogType: 'website',
  });

  const stepIcons = [MessageCircle, Zap, BarChart3];
  const stepColors = ['bg-brand-primary', 'bg-brand-accent', 'bg-brand-primary-hover'];
  const boundaryIcons = [AlertTriangle, BarChart3, FileText, Shield];

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary text-brand-text-body">
      <Header />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-background-muted/60 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-accent/8 via-transparent to-transparent rounded-full blur-3xl" />

          <div className="container mx-auto px-4 max-w-5xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 text-xs font-mono font-bold mb-8">
                <Microscope className="w-4 h-4 text-brand-primary" />
                <span className="text-brand-primary tracking-[0.15em] uppercase">{c.badge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 tracking-tight leading-[1.1]">
                {c.heroTitle}
                <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  {c.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-brand-text-secondary max-w-3xl mx-auto leading-relaxed mb-12">
                {c.heroSubtitle}
              </p>

              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {c.heroStats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">{s.value}</div>
                    <div className="text-sm text-brand-text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Evidence Strip ── */}
        <section className="bg-brand-background-primary border-y border-brand-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border">
              {c.evidenceStats.map((s, i) => (
                <div key={i} className="text-center p-6">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2">
                    {s.value}
                  </div>
                  <p className="text-sm text-brand-text-primary font-medium mb-1">{s.label}</p>
                  <p className="text-xs text-brand-text-muted font-mono">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Primary Models ── */}
        <section className="py-24 bg-brand-background-secondary">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                {c.modelsLabel}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                {c.modelsTitle}
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">{c.modelsSubtitle}</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {c.models.map((model, i) => (
                <ModelCard key={i} model={model} color={modelColors[i]} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 8 Areas We Measure ── */}
        <section className="py-24 bg-brand-background-primary">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                {c.areasLabel}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                {c.areasTitle}
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">{c.areasSubtitle}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {c.areas.map((area, i) => {
                const AreaIcon = areaIcons[i] || Target;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-brand-background-secondary hover:bg-brand-background-muted p-5 rounded-xl border border-brand-border hover:border-brand-primary/30 transition-all text-center"
                  >
                    <AreaIcon className="w-7 h-7 mx-auto mb-3 text-brand-primary" />
                    <div className="font-semibold text-brand-text-primary text-sm mb-2">{area.name}</div>
                    <div className="text-xs text-brand-text-secondary leading-relaxed">{area.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How Collection Works ── */}
        <section className="py-24 bg-brand-background-secondary">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                {c.howLabel}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                {c.howTitle}
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">{c.howSubtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
              {c.howSteps.map((step, i) => {
                const StepIcon = stepIcons[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative bg-brand-background-primary p-8 rounded-2xl border border-brand-border hover:shadow-xl hover:border-brand-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl ${stepColors[i]} flex items-center justify-center`}>
                        <StepIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-5xl font-bold text-brand-primary/10">{i + 1}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-brand-text-primary">{step.title}</h4>
                    <p className="text-brand-text-secondary leading-relaxed">{step.desc}</p>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-brand-primary/20" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Collection guarantees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-brand-background-primary rounded-2xl p-8 border border-brand-border"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {c.howProofs.map((proof, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary mt-0.5 flex-shrink-0" />
                    <span className="text-brand-text-secondary text-sm">{proof}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Scientific Rigor ── */}
        <section className="py-24 bg-brand-background-primary">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                {c.rigorLabel}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                {c.rigorTitle}
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">{c.rigorSubtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {c.rigorPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-brand-background-secondary rounded-2xl p-6 border border-brand-border hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:scale-105 transition-all duration-300">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-brand-text-primary text-lg pt-2">{point.title}</h3>
                  </div>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">{point.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── System Boundaries ── */}
        <section className="py-24 bg-brand-primary relative overflow-hidden">

          <div className="container mx-auto px-4 max-w-5xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                {c.boundaryLabel}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                {c.boundaryTitle}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">{c.boundarySubtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {c.boundaries.map((b, i) => (
                <BoundaryItem key={i} icon={boundaryIcons[i]} title={b.title} description={b.desc} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 bg-gradient-to-b from-brand-background-secondary to-brand-background-primary">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-brand-background-primary rounded-3xl p-10 md:p-14 shadow-2xl shadow-brand-primary/10 border border-brand-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-accent/8 via-brand-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-mono font-bold mb-6">
                  <Lightbulb className="w-4 h-4" />
                  {c.ctaBadge}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-6 tracking-tight">
                  {c.ctaTitle}
                  <br />
                  <span className="text-brand-primary">{c.ctaTitleHighlight}</span>
                </h2>
                <p className="text-brand-text-secondary leading-relaxed mb-10">{c.ctaDesc}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/#booking"
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-primary-hover transition-colors shadow-lg shadow-brand-primary/20"
                  >
                    {c.ctaPrimary}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-brand-background-secondary text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-brand-background-muted transition-colors border border-brand-border"
                  >
                    {c.ctaSecondary}
                  </Link>
                </div>
                <p className="text-xs text-brand-text-muted mt-8">{c.ctaNote}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
