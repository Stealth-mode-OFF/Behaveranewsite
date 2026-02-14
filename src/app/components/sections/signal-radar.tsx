import { useCallback, useState, useRef, useEffect, type ElementType, type MouseEvent as ReactMouseEvent } from "react";
import {
  Activity, Zap, Briefcase, Heart, Shield, Award, Scale, Cpu,
  MessageCircle, Clock, BarChart3, Brain, ExternalLink, Sparkles,
  Send, CheckCircle2, XCircle, TrendingUp, ChevronDown, Timer,
  ChevronLeft, ChevronRight, X, Play, ArrowRight, Loader2
} from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { trackPulseCheckOpen } from "@/lib/analytics";

/* ─── Icons ─── */
const topicIcons: Record<string, ElementType> = {
  quickScan: Activity, pay: Scale, perks: Heart, tools: Cpu,
  workload: Briefcase, recognition: Award, stress: Zap, values: Shield,
};
const stepIcons = [Send, MessageCircle, BarChart3];
const advantageIcons = [TrendingUp, BarChart3, Brain, Activity];

/* ─── Copy ─── */
type TCopy = {
  badge: string; title: string; titleHighlight: string; subtitle: string;
  steps: { label: string; desc: string }[];
  topicsTitle: string; topicsSubtitle: string;
  topicCards: { key: string; name: string; desc: string; sampleQ: string; ceoInsight: string; link: string }[];
  chatLabel: string; ceoLabel: string; cardCta: string;
  compTitle: string; compSubtitle: string; compTimeSaved: string;
  advantages: { title: string; oldWay: string; ourWay: string }[];
};

const PULSE_BASE = "https://bibi.behavera.com/free/behiro/pulse-showcase-";

const copy: Record<string, TCopy> = {
  cz: {
    badge: "Echo Pulse",
    title: "2 minuty. V\u011bt\u0161ina lid\u00ed odpov\u00ed. ",
    titleHighlight: "Ka\u017ed\u00fd m\u011bs\u00edc.",
    subtitle: "\u017d\u00e1dn\u00e9 formul\u00e1\u0159e. Zam\u011bstnanci odpov\u00eddaj\u00ed v kr\u00e1tk\u00e9m AI chatu \u2014 ov\u011b\u0159en\u00e9 ot\u00e1zky, kter\u00e9 mluv\u00ed lidsky. 80\u00a0%+ lid\u00ed re\u00e1ln\u011b a r\u00e1do odpov\u00edd\u00e1.",
    steps: [
      { label: "Automatick\u00e9 rozesl\u00e1n\u00ed", desc: "Slack, Teams nebo e-mail" },
      { label: "2min AI rozhovor", desc: "Ov\u011b\u0159en\u00e9 ot\u00e1zky od psycholog\u016f" },
      { label: "V\u00fdsledky ihned", desc: "Dashboard s AI doporu\u010den\u00edmi" },
    ],
    topicsTitle: "8 rozhovor\u016f, kter\u00e9 odhal\u00ed, co lid\u00e9 ne\u0159eknou nahlas",
    topicsSubtitle: "Ka\u017ed\u00fd set je kr\u00e1tk\u00e1 AI konverzace na jedno t\u00e9ma. Ot\u00e1zky jsou ov\u011b\u0159eny behavior\u00e1ln\u00edmi psychology a lid\u00e9 na n\u011b re\u00e1ln\u011b a r\u00e1di odpov\u00eddaj\u00ed.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Celkov\u00fd pulse va\u0161eho t\u00fdmu v 5 ot\u00e1zk\u00e1ch. Spokojenost, bari\u00e9ry i to, co lidi bav\u00ed \u2014 r\u00e1zem m\u00e1te obr\u00e1zek, kde za\u010d\u00edt.", sampleQ: "\u201eJak spokojen\u011b se v posledn\u00ed dob\u011b c\u00edt\u00ed\u0161 v pr\u00e1ci?\u201c", ceoInsight: "Okam\u017eit\u011b vid\u00edte, jestli se n\u00e1lada ve firm\u011b zlep\u0161uje nebo zhor\u0161uje \u2014 bez \u010dek\u00e1n\u00ed na kvart\u00e1ln\u00ed report.", link: PULSE_BASE + "initial?x_lang=cs" },
      { key: "pay", name: "Odm\u011b\u0148ov\u00e1n\u00ed", desc: "F\u00e9rovost odm\u011bn, motivace a srovn\u00e1n\u00ed s trhem. 6 ot\u00e1zek, kter\u00e9 odhal\u00ed, jestli v\u00e1m lid\u00e9 odch\u00e1zej\u00ed kv\u016fli pen\u011bz\u016fm.", sampleQ: "\u201eP\u0159i\u0161la ti tv\u00e1 odm\u011bna f\u00e9rov\u00e1 vzhledem k pr\u00e1ci, kterou odv\u00e1d\u00ed\u0161?\u201c", ceoInsight: "Zjist\u00edte, jestli v\u00e1m lid\u00e9 odch\u00e1zej\u00ed kv\u016fli pen\u011bz\u016fm \u2014 nebo kv\u016fli n\u011b\u010demu, co se d\u00e1 vy\u0159e\u0161it levn\u011bji.", link: PULSE_BASE + "pay?x_lang=cs" },
      { key: "perks", name: "Benefity", desc: "Relevance benefit\u016f, jejich skute\u010dn\u00e9 vyu\u017e\u00edv\u00e1n\u00ed a co lidem chyb\u00ed. 6 ot\u00e1zek v\u010detn\u011b n\u00e1vrh\u016f na zlep\u0161en\u00ed.", sampleQ: "\u201eDodaly ti tv\u00e9 benefity za posledn\u00ed m\u011bs\u00edc energii nav\u00edc, kterou jsi mohl/a vyu\u017e\u00edt?\u201c", ceoInsight: "P\u0159esta\u0148te utr\u00e1cet za benefity, kter\u00e9 nikdo nepou\u017e\u00edv\u00e1. Investujte do toho, co lid\u00e9 skute\u010dn\u011b cht\u011bj\u00ed.", link: PULSE_BASE + "perks?x_lang=cs" },
      { key: "tools", name: "N\u00e1stroje & prost\u0159ed\u00ed", desc: "Maj\u00ed lid\u00e9 k dispozici v\u0161e, co pot\u0159ebuj\u00ed? Vybaven\u00ed, podpora i zp\u011btn\u00e1 vazba od mana\u017eera. 6 ot\u00e1zek.", sampleQ: "\u201eM\u00e1m k dispozici v\u0161e, co pot\u0159ebuju \u2014 n\u00e1stroje, vybaven\u00ed i podporu \u2014 abych mohl/a d\u011blat svou pr\u00e1ci naplno.\u201c", ceoInsight: "\u010casto sta\u010d\u00ed opravit jednu blbost \u2014 \u0161patn\u00fd n\u00e1stroj, pomal\u00fd notebook \u2014 a produktivita cel\u00e9ho t\u00fdmu sko\u010d\u00ed.", link: PULSE_BASE + "tools?x_lang=cs" },
      { key: "workload", name: "Pracovn\u00ed z\u00e1t\u011b\u017e", desc: "Rovnov\u00e1ha mezi n\u00e1roky, kapacitou a prioritami. 6 ot\u00e1zek, kter\u00e9 odhal\u00ed, kdo je p\u0159et\u00ed\u017een\u00fd d\u0159\u00edve, ne\u017e vyho\u0159\u00ed.", sampleQ: "\u201eI p\u0159es nepl\u00e1novan\u00e9 zm\u011bny a vyru\u0161en\u00ed zvl\u00e1d\u00e1m svoje denn\u00ed \u00fakoly a projekty.\u201c", ceoInsight: "P\u0159et\u00ed\u017een\u00ed lid\u00e9 nevyho\u0159\u00ed za den \u2014 ale sign\u00e1ly jsou vid\u011bt m\u011bs\u00edce p\u0159edem. Pokud v\u00edte, kam se d\u00edvat.", link: PULSE_BASE + "workload?x_lang=cs" },
      { key: "recognition", name: "Uzn\u00e1n\u00ed", desc: "Je dobr\u00e1 pr\u00e1ce vid\u011bt? Zp\u011btn\u00e1 vazba, ocen\u011bn\u00ed, formy uzn\u00e1n\u00ed, kter\u00e9 lidem vyhovuj\u00ed. 6 ot\u00e1zek.", sampleQ: "\u201eP\u0159i\u0161lo ti v uplynul\u00e9m m\u011bs\u00edci, \u017ee si n\u011bkdo v\u0161iml, kdy\u017e se ti n\u011bco povedlo, a ocenil to?\u201c", ceoInsight: "80\u00a0% lid\u00ed, kte\u0159\u00ed odch\u00e1zej\u00ed, \u0159\u00edk\u00e1, \u017ee se nec\u00edtili dost ocen\u011bni. Tohle m\u011b\u0159en\u00ed v\u00e1m uk\u00e1\u017ee, kde to ho\u0159\u00ed.", link: PULSE_BASE + "recognition?x_lang=cs" },
      { key: "stress", name: "Stres & wellbeing", desc: "Chronick\u00fd stres, regenerace a riziko vyho\u0159en\u00ed. 6 ot\u00e1zek, kter\u00e9 m\u011b\u0159\u00ed pracovn\u00ed tlak i schopnost odpo\u010d\u00edvat.", sampleQ: "\u201eJak \u010dasto t\u011b pracovn\u00ed n\u00e1por t\u00ed\u017e\u00ed, i kdy\u017e m\u00e1\u0161 volno?\u201c", ceoInsight: "Burnout stoj\u00ed firmu 2\u20133 ro\u010dn\u00ed platy na ka\u017ed\u00e9m \u010dlov\u011bku. Sign\u00e1ly zobrazujeme, ne\u017e je pozd\u011b.", link: PULSE_BASE + "stress?x_lang=cs" },
      { key: "values", name: "Hodnoty & kultura", desc: "Soulad mezi deklarovan\u00fdmi a \u017eit\u00fdmi hodnotami. 6 ot\u00e1zek v\u010detn\u011b: \u201eCo byste \u0159ekli kamar\u00e1dovi o pr\u00e1ci u n\u00e1s?\u201c", sampleQ: "\u201eKdy\u017e se t\u011b kamar\u00e1d zept\u00e1, pro\u010d by m\u011bl j\u00edt pracovat k n\u00e1m \u2014 co mu \u0159ekne\u0161?\u201c", ceoInsight: "Zjist\u00edte, jestli va\u0161e hodnoty \u017eij\u00ed v praxi \u2014 nebo jestli jsou jen na zdi v kuchy\u0148ce.", link: PULSE_BASE + "values?x_lang=cs" },
    ],
    chatLabel: "Uk\u00e1zka ot\u00e1zky",
    ceoLabel: "Pro\u010d to pot\u0159ebujete v\u011bd\u011bt",
    cardCta: "Vyzkou\u0161et",
    compTitle: "Pro\u010d ne Google Forms?",
    compSubtitle: "Sb\u00edrat zp\u011btnou vazbu p\u0159es formul\u00e1\u0159e um\u00ed ka\u017ed\u00fd. Ale funguje to?",
    compTimeSaved: "U\u0161et\u0159\u00edte ~6 hodin na ka\u017ed\u00e9m kole zp\u011btn\u00e9 vazby",
    advantages: [
      { title: "80\u00a0%+ n\u00e1vratnost vs. 30\u201340\u00a0%", oldWay: "Formul\u00e1\u0159e: 30\u201340\u00a0% lid\u00ed dokon\u010d\u00ed", ourWay: "Pulse: typicky 80\u00a0%+ d\u00edky chat form\u00e1tu" },
      { title: "Okam\u017eit\u00e1 anal\u00fdza, ne Excel", oldWay: "Formul\u00e1\u0159e: Export \u2192 Excel \u2192 ru\u010dn\u00ed grafy", ourWay: "Pulse: Real-time dashboard s AI insights" },
      { title: "Validovan\u00e1 psychometrie", oldWay: "Formul\u00e1\u0159e: Ot\u00e1zky psan\u00e9 bez metodologie", ourWay: "Pulse: Navr\u017eeno behavior\u00e1ln\u00edmi psychology" },
      { title: "Trendy, ne snapshoty", oldWay: "Formul\u00e1\u0159e: 1\u00d7 ro\u010dn\u011b velk\u00fd pr\u016fzkum", ourWay: "Pulse: Pr\u016fb\u011b\u017en\u00e9 m\u011b\u0159en\u00ed s vizualizac\u00ed trend\u016f" },
    ],
  },
  en: {
    badge: "Echo Pulse",
    title: "2 minutes. Most people respond. ",
    titleHighlight: "Every month.",
    subtitle: "No forms. Employees respond in a short AI-powered chat \u2014 tested questions that feel human. 80%+ actually enjoy answering.",
    steps: [
      { label: "Auto-sends itself", desc: "Slack, Teams, or email" },
      { label: "2-min AI chat", desc: "Psychologist-designed questions" },
      { label: "Instant results", desc: "Dashboard with AI insights" },
    ],
    topicsTitle: "8 conversations that reveal what people won\u2019t say out loud",
    topicsSubtitle: "Each set is a short AI conversation on one topic. Questions are validated by behavioral psychologists \u2014 and people genuinely enjoy answering them.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Your team\u2019s overall pulse in 5 questions. Satisfaction, barriers, and what brings joy \u2014 you get the full picture of where to start.", sampleQ: "\u201cHow happy have you felt at work recently?\u201d", ceoInsight: "Instantly see whether company morale is improving or declining \u2014 no waiting for quarterly reports.", link: PULSE_BASE + "initial?x_lang=en" },
      { key: "pay", name: "Compensation", desc: "Pay fairness, motivation, and market comparison. 6 questions that reveal whether people leave over money \u2014 or something else.", sampleQ: "\u201cDid your compensation feel fair given the work you put in?\u201d", ceoInsight: "Find out if people leave over money \u2014 or something cheaper to fix.", link: PULSE_BASE + "pay?x_lang=en" },
      { key: "perks", name: "Benefits", desc: "Benefit relevance, actual usage, and what\u2019s missing. 6 questions including suggestions for improvement.", sampleQ: "\u201cDid your benefits give you extra energy you could actually use?\u201d", ceoInsight: "Stop spending on perks nobody uses. Invest in what people actually want.", link: PULSE_BASE + "perks?x_lang=en" },
      { key: "tools", name: "Tools & Environment", desc: "Do people have everything they need? Equipment, support, and manager feedback. 6 questions.", sampleQ: "\u201cI have everything I need \u2014 tools, equipment, and support \u2014 to do my best work.\u201d", ceoInsight: "Often fixing one thing \u2014 a bad tool, a slow laptop \u2014 boosts the entire team\u2019s productivity.", link: PULSE_BASE + "tools?x_lang=en" },
      { key: "workload", name: "Workload", desc: "Balance between demands, capacity, and priorities. 6 questions that spot overload before people burn out.", sampleQ: "\u201cEven with unexpected changes and interruptions, I manage my daily tasks and projects.\u201d", ceoInsight: "Overloaded people don\u2019t burn out overnight \u2014 but the signals show months in advance. If you know where to look.", link: PULSE_BASE + "workload?x_lang=en" },
      { key: "recognition", name: "Recognition", desc: "Is good work visible? Feedback, appreciation, and preferred forms of recognition. 6 questions.", sampleQ: "\u201cIn the past month, did someone notice when you did something well and appreciate it?\u201d", ceoInsight: "80% of people who leave say they didn\u2019t feel appreciated enough. This shows you where it\u2019s burning.", link: PULSE_BASE + "recognition?x_lang=en" },
      { key: "stress", name: "Stress & Wellbeing", desc: "Chronic stress, recovery, and burnout risk. 6 questions measuring work pressure and the ability to recharge.", sampleQ: "\u201cHow often does work pressure weigh on you even when you\u2019re off?\u201d", ceoInsight: "Burnout costs 2\u20133 annual salaries per person. We surface the signals before it\u2019s too late.", link: PULSE_BASE + "stress?x_lang=en" },
      { key: "values", name: "Values & Culture", desc: "Alignment between declared and lived values. 6 questions including: \u201cWhat would you tell a friend about working here?\u201d", sampleQ: "\u201cWhen a friend asks why they should come work for us \u2014 what do you tell them?\u201d", ceoInsight: "Discover whether your values live in practice \u2014 or just on the kitchen wall poster.", link: PULSE_BASE + "values?x_lang=en" },
    ],
    chatLabel: "Sample question",
    ceoLabel: "Why you need to know this",
    cardCta: "Try",
    compTitle: "Why not Google Forms?",
    compSubtitle: "Anyone can collect feedback with forms. But does it actually work?",
    compTimeSaved: "Save ~6 hours on every feedback cycle",
    advantages: [
      { title: "80%+ completion vs. 30\u201340%", oldWay: "Forms: 30\u201340% of people finish it", ourWay: "Pulse: typically 80%+ thanks to chat format" },
      { title: "Instant analysis, not Excel", oldWay: "Forms: Export \u2192 Excel \u2192 manual charts", ourWay: "Pulse: Real-time dashboard with AI insights" },
      { title: "Validated psychometrics", oldWay: "Forms: Questions without methodology", ourWay: "Pulse: Designed by behavioral psychologists" },
      { title: "Trends, not snapshots", oldWay: "Forms: Once-a-year big survey", ourWay: "Pulse: Continuous measurement with trends" },
    ],
  },
  de: {
    badge: "Echo Pulse",
    title: "2 Minuten. Die meisten antworten. ",
    titleHighlight: "Jeden Monat.",
    subtitle: "Keine Formulare. Mitarbeiter antworten in einem kurzen AI-Chat \u2014 getestete Fragen, die menschlich klingen. 80\u00a0%+ antworten gerne.",
    steps: [
      { label: "Automatischer Versand", desc: "Slack, Teams oder E-Mail" },
      { label: "2-Min AI-Gespr\u00e4ch", desc: "Von Psychologen validierte Fragen" },
      { label: "Sofortige Ergebnisse", desc: "Dashboard mit KI-Empfehlungen" },
    ],
    topicsTitle: "8 Gespr\u00e4che, die zeigen, was Mitarbeiter nicht laut sagen",
    topicsSubtitle: "Jedes Set ist ein kurzes AI-Gespr\u00e4ch zu einem Thema. Fragen sind von Verhaltenspsychologen validiert \u2014 und Mitarbeiter beantworten sie gerne.",
    topicCards: [
      { key: "quickScan", name: "Quick Scan", desc: "Der Gesamtpuls Ihres Teams in 5 Fragen. Zufriedenheit, Hindernisse & was Freude macht \u2014 auf einen Blick.", sampleQ: "\u201eWie zufrieden f\u00fchlst du dich aktuell bei der Arbeit?\u201c", ceoInsight: "Sofort sehen, ob sich die Stimmung verbessert oder verschlechtert \u2014 ohne auf den Quartalsbericht zu warten.", link: PULSE_BASE + "initial?x_lang=en" },
      { key: "pay", name: "Verg\u00fctung", desc: "Fairness, Motivation und Marktvergleich. 6 Fragen, die zeigen, ob Mitarbeiter wegen Geld gehen.", sampleQ: "\u201eEmpfandest du deine Verg\u00fctung als fair f\u00fcr die Arbeit, die du geleistet hast?\u201c", ceoInsight: "Erfahren Sie, ob Mitarbeiter wegen des Geldes gehen \u2014 oder wegen etwas, das g\u00fcnstiger zu l\u00f6sen ist.", link: PULSE_BASE + "pay?x_lang=en" },
      { key: "perks", name: "Benefits", desc: "Relevanz, tats\u00e4chliche Nutzung und was fehlt. 6 Fragen inkl. Verbesserungsvorschl\u00e4ge.", sampleQ: "\u201eHaben dir deine Benefits im letzten Monat zus\u00e4tzliche Energie gegeben?\u201c", ceoInsight: "H\u00f6ren Sie auf, f\u00fcr Benefits auszugeben, die niemand nutzt. Investieren Sie in das, was Mitarbeiter wirklich wollen.", link: PULSE_BASE + "perks?x_lang=en" },
      { key: "tools", name: "Tools & Umgebung", desc: "Haben Mitarbeiter alles, was sie brauchen? Ausstattung, Support & Manager-Feedback. 6 Fragen.", sampleQ: "\u201eIch habe alles \u2014 Werkzeuge, Ausstattung und Unterst\u00fctzung \u2014 um meine Arbeit bestm\u00f6glich zu erledigen.\u201c", ceoInsight: "Oft reicht es, eine Kleinigkeit zu reparieren, um die Produktivit\u00e4t des ganzen Teams zu steigern.", link: PULSE_BASE + "tools?x_lang=en" },
      { key: "workload", name: "Arbeitsbelastung", desc: "Balance zwischen Anforderungen, Kapazit\u00e4t und Priorit\u00e4ten. 6 Fragen, die \u00dcberlastung fr\u00fch erkennen.", sampleQ: "\u201eAuch bei unerwarteten \u00c4nderungen und Unterbrechungen schaffe ich meine t\u00e4glichen Aufgaben und Projekte.\u201c", ceoInsight: "\u00dcberlastete Mitarbeiter brennen nicht \u00fcber Nacht aus \u2014 aber die Signale zeigen sich Monate vorher.", link: PULSE_BASE + "workload?x_lang=en" },
      { key: "recognition", name: "Anerkennung", desc: "Wird gute Arbeit gesehen? Feedback, Wertsch\u00e4tzung und bevorzugte Formen. 6 Fragen.", sampleQ: "\u201eHat im letzten Monat jemand bemerkt, wenn dir etwas gelungen ist, und es anerkannt?\u201c", ceoInsight: "80\u00a0% der Mitarbeiter, die gehen, f\u00fchlten sich nicht genug wertgesch\u00e4tzt. Hier sehen Sie, wo es brennt.", link: PULSE_BASE + "recognition?x_lang=en" },
      { key: "stress", name: "Stress & Wellbeing", desc: "Chronischer Stress, Erholung und Burnout-Risiko. 6 Fragen zu Arbeitsdruck & Regeneration.", sampleQ: "\u201eWie oft belastet dich der Arbeitsdruck auch in deiner Freizeit?\u201c", ceoInsight: "Burnout kostet 2\u20133 Jahresgeh\u00e4lter pro Person. Wir zeigen die Signale, bevor es zu sp\u00e4t ist.", link: PULSE_BASE + "stress?x_lang=en" },
      { key: "values", name: "Werte & Kultur", desc: "\u00dcbereinstimmung zwischen erkl\u00e4rten und gelebten Werten. 6 Fragen inkl. \u201eWas w\u00fcrden Sie einem Freund sagen?\u201c", sampleQ: "\u201eWenn ein Freund fragt, warum er bei uns arbeiten sollte \u2014 was sagst du ihm?\u201c", ceoInsight: "Erfahren Sie, ob Ihre Werte in der Praxis leben \u2014 oder nur am Poster in der K\u00fcche h\u00e4ngen.", link: PULSE_BASE + "values?x_lang=en" },
    ],
    chatLabel: "Beispielfrage",
    ceoLabel: "Warum Sie das wissen m\u00fcssen",
    cardCta: "Ausprobieren",
    compTitle: "Warum nicht Google Forms?",
    compSubtitle: "Feedback mit Formularen sammeln kann jeder. Aber funktioniert es?",
    compTimeSaved: "Sparen Sie ~6 Stunden pro Feedback-Zyklus",
    advantages: [
      { title: "80\u00a0%+ R\u00fccklauf vs. 30\u201340\u00a0%", oldWay: "Formulare: 30\u201340\u00a0% f\u00fcllen es aus", ourWay: "Pulse: typisch 80\u00a0%+ dank Chat-Format" },
      { title: "Sofortige Analyse, kein Excel", oldWay: "Formulare: Export \u2192 Excel \u2192 manuelle Diagramme", ourWay: "Pulse: Echtzeit-Dashboard mit KI-Insights" },
      { title: "Validierte Psychometrie", oldWay: "Formulare: Fragen ohne Methodik", ourWay: "Pulse: Von Verhaltenspsychologen entwickelt" },
      { title: "Trends, keine Momentaufnahmen", oldWay: "Formulare: 1\u00d7 j\u00e4hrlich gro\u00dfe Umfrage", ourWay: "Pulse: Laufende Messung mit Trends" },
    ],
  },
};

export function SignalRadar() {
  const { language } = useLanguage();
  const [compOpen, setCompOpen] = useState(false);
  const [pulseEmbedUrl, setPulseEmbedUrl] = useState<string | null>(null);

  const c = copy[language] || copy.en;

  const openPulseEmbed = (url: string) => {
    setPulseEmbedUrl(url);
    trackPulseCheckOpen('signal_radar_card', language);
  };

  return (
    <section className="section-spacing bg-brand-background-secondary/30 relative overflow-hidden" id="radar">
      <div className="container-default max-w-[1120px] mx-auto relative z-10">

        {/* ═══════════ MERGED HEADER + HOW IT WORKS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
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

          <p className="text-lg text-brand-text-secondary leading-relaxed max-w-2xl mx-auto mb-10">
            {c.subtitle}
          </p>

          {/* Inline 3-step flow */}
          <div className="flex items-start justify-center gap-3 sm:gap-4">
            {c.steps.map((step, i) => {
              const StepIcon = stepIcons[i];
              return (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex flex-col items-center text-center w-[100px] sm:w-[130px]">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20 mb-2.5">
                      <StepIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[12px] sm:text-[13px] font-semibold text-brand-text-primary leading-tight">{step.label}</span>
                    <span className="text-[11px] text-brand-text-muted leading-tight mt-0.5">{step.desc}</span>
                  </div>
                  {i < c.steps.length - 1 && (
                    <div className="flex items-center pt-5">
                      <div className="w-6 sm:w-10 h-[2px] bg-gradient-to-r from-brand-primary/30 to-brand-accent/30 rounded-full" />
                      <ArrowRight className="w-3.5 h-3.5 text-brand-accent/50 -ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════ 8 TOPIC CARDS — Premium Carousel ═══════════ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-brand-text-primary mb-3 leading-tight">
              {c.topicsTitle}
            </h3>
            <p className="text-[15px] text-brand-text-body max-w-2xl mx-auto leading-relaxed">
              {c.topicsSubtitle}
            </p>
          </div>

          <TopicCarousel cards={c.topicCards} chatLabel={c.chatLabel} ceoLabel={c.ceoLabel} cardCta={c.cardCta} onOpenPulse={openPulseEmbed} />

          {/* Social proof strip under cards */}
          <div className="mt-8 pt-6 border-t border-brand-border/30">
            <QuickScanTestimonials lang={language} />
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



      </div>

      {/* ═══════════ PULSE EMBED DIALOG ═══════════ */}
      <PulseEmbedDialog url={pulseEmbedUrl} onClose={() => setPulseEmbedUrl(null)} />
    </section>
  );
}

/* ─── Types ─── */

type TopicCard = TCopy['topicCards'][number];

/* ─── Signal Detail Side Panel ─── */
function SignalDetailPanel({
  card,
  cardNum,
  chatLabel,
  ceoLabel,
  onClose,
  onOpenPulse,
}: {
  card: TopicCard;
  cardNum: number;
  chatLabel: string;
  ceoLabel: string;
  onClose: () => void;
  onOpenPulse?: (url: string) => void;
}) {
  const TopicIcon = topicIcons[card.key] || Activity;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-brand-border/40"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary rounded-t-2xl" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-background-secondary/80 hover:bg-brand-background-secondary flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center shadow-lg shadow-brand-primary/20 relative">
              <TopicIcon className="w-6 h-6 text-white" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center shadow-sm">{cardNum}</span>
            </div>
            <h3 className="text-lg font-bold text-brand-text-primary leading-tight">{card.name}</h3>
          </div>
          <p className="text-sm text-brand-text-body leading-relaxed">{card.desc}</p>
        </div>
        <div className="px-6 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-text-muted mb-2 flex items-center gap-1.5">
            <MessageCircle className="w-3 h-3" />
            {chatLabel}
          </div>
          <div className="bg-gradient-to-br from-brand-background-secondary to-brand-background-secondary/60 rounded-xl rounded-tl-sm px-4 py-3.5 text-sm text-brand-text-secondary leading-relaxed italic border border-brand-border/30">
            {card.sampleQ}
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-xl p-4 border border-amber-200/40">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" />
              {ceoLabel}
            </div>
            <p className="text-[13px] text-amber-900/80 leading-relaxed font-medium">{card.ceoInsight}</p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={() => { onClose(); onOpenPulse?.(card.link); }}
            className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-primary/25 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {card.name}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Pulse Embed Dialog ─── */

function PulseEmbedDialog({ url, onClose }: { url: string | null; onClose: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [url, onClose]);

  if (!url) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[500px] h-[min(90vh,900px)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg border border-brand-border/40 flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
              <span className="text-sm text-brand-text-muted">Loading\u2026</span>
            </div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          allow="clipboard-write"
          title="Echo Pulse"
        />
      </motion.div>
    </motion.div>
  );
}


/* ─── Topic Carousel — Premium horizontal showcase ─── */

function TopicCarousel({
  cards,
  chatLabel,
  ceoLabel,
  cardCta,
  onOpenPulse,
}: {
  cards: TopicCard[];
  chatLabel: string;
  ceoLabel: string;
  cardCta: string;
  onOpenPulse: (url: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<{ card: TopicCard; num: number } | null>(null);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  return (
    <>
      <div className="relative group/carousel">
        {/* Nav arrows */}
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-brand-border shadow-xl flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-brand-border shadow-xl flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-brand-background-secondary/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-brand-background-secondary/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-2 py-4 -mx-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {cards.map((card, i) => {
            const TopicIcon = topicIcons[card.key] || Activity;
            const cardNum = i + 1;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="shrink-0 w-[360px] sm:w-[400px] rounded-2xl bg-white border border-brand-primary/8 shadow-lg hover:shadow-2xl hover:border-brand-primary/20 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group/card"
              >
                {/* Gradient accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary opacity-60 group-hover/card:opacity-100 transition-opacity" />

                {/* Card header */}
                <div className="px-6 pt-5 pb-0">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center shrink-0 relative shadow-lg shadow-brand-primary/20 group-hover/card:scale-105 group-hover/card:shadow-brand-primary/30 transition-all">
                      <TopicIcon className="w-6 h-6 text-white" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center shadow-sm">{cardNum}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[17px] text-brand-text-primary leading-tight group-hover/card:text-brand-primary transition-colors">{card.name}</h4>
                    </div>
                  </div>
                </div>

                {/* Clickable body */}
                <div
                  className="flex-1 flex flex-col cursor-pointer px-6 pb-4"
                  onClick={() => setSelectedCard({ card, num: cardNum })}
                >
                  {/* Description */}
                  <p className="text-[13.5px] text-brand-text-body leading-relaxed mb-4">
                    {card.desc}
                  </p>

                  {/* Sample question — chat bubble preview */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-text-muted/70 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3" />
                      {chatLabel}
                    </div>
                    <div className="bg-gradient-to-br from-brand-primary/[0.04] to-brand-primary/[0.08] rounded-xl rounded-tl-sm px-4 py-3 text-[13px] text-brand-text-secondary leading-relaxed italic border border-brand-primary/10">
                      {card.sampleQ}
                    </div>
                  </div>

                  {/* CEO insight — compact */}
                  <div className="mt-auto">
                    <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/40 rounded-lg px-3.5 py-3 border border-amber-200/30">
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700/80 mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3" />
                        {ceoLabel}
                      </div>
                      <p className="text-[12.5px] text-amber-900/70 leading-relaxed font-medium line-clamp-2">
                        {card.ceoInsight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={() => onOpenPulse(card.link)}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 border-t border-brand-border/30 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover transition-all cursor-pointer w-full group/cta"
                >
                  <Play className="w-4 h-4" />
                  <span>{cardCta} {card.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Signal Detail Panel */}
      <AnimatePresence>
        {selectedCard && (
          <SignalDetailPanel
            card={selectedCard.card}
            cardNum={selectedCard.num}
            chatLabel={chatLabel}
            ceoLabel={ceoLabel}
            onClose={() => setSelectedCard(null)}
            onOpenPulse={onOpenPulse}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Testimonials ─── */

type Testimonial = { name: string; role: string; company: string; quote: string };

const testimonials: Testimonial[] = [
  { name: "Dominik Hegedus", role: "CEO", company: "Expando", quote: "It took just a moment \u2014 and those few answers delivered exactly what we needed. No complicated reports, no endless spreadsheets \u2014 just clear, actionable insights." },
  { name: "Ji\u0159\u00ed", role: "CEO", company: "logistick\u00e1 firma", quote: "Jsem nad\u0161en\u00fd! Jsem na pozici CEO od srpna. M\u00e1m d\u00e1t do po\u0159\u00e1dku celou firmu a pot\u0159ebuji rychle zjistit, co se kde d\u011bje. Tohle je pro m\u011b nesm\u00edrn\u011b cenn\u00e9!" },
  { name: "Tereza M\u00fcllerov\u00e1", role: "COO", company: "StartupJobs", quote: "P\u0159ekvapilo m\u011b, kolik lid\u00ed se zapojilo. A i kdy\u017e na\u0161i l\u00edd\u0159i se sv\u00fdmi t\u00fdmy pravideln\u011b mluv\u00ed, v Pulsu se uk\u00e1zaly v\u011bci, kter\u00e9 jim lid\u00e9 do o\u010d\u00ed ne\u0159ekli." },
  { name: "Karel Poplstein", role: "CEO", company: "Valxon", quote: "I thought people are no longer engaged and gave up on us. I was surprised when I saw how engaged and invested our employees are. Moreover, without Behavera, we would\u2019ve kept treating symptoms instead of the real causes." },
  { name: "Dana Kultov\u00e1", role: "COO", company: "klientsk\u00e1 firma", quote: "The results more or less confirmed what I suspected. But what truly blew me away was the playbook full of practical, step-by-step recommendations." },
  { name: "Ema Nov\u00e1kov\u00e1", role: "HR Manager", company: "Expando", quote: "D\u00edky Behave\u0159e l\u00edd\u0159i dostanou v\u00fdstupy z pr\u016fzkumu automaticky a to i s ak\u010dn\u00edmi doporu\u010den\u00edmi okam\u017eit\u011b a j\u00e1 tak u\u0161et\u0159\u00edm cel\u00fd t\u00fdden." },
  { name: "Martina", role: "Mana\u017eerka telesales t\u00fdmu", company: "Teya", quote: "D\u00edky Echo Pulse m\u00e1m pravideln\u00fd feedback o tom, jestli je m\u016fj t\u00fdm v pohod\u011b. Hned vid\u00edm, kdy je t\u0159eba urgentn\u011b \u0159e\u0161it n\u011bjak\u00fd probl\u00e9m." },
  { name: "J\u00e1n Pavl\u00edk", role: "Project Manager", company: "Expando", quote: "Behavera n\u00e1m uk\u00e1zala, \u017ee krom\u011b \u0161patn\u00e9 intern\u00ed komunikace m\u00e1me tak\u00e9 probl\u00e9my s efektivn\u00ed motivac\u00ed lid\u00ed. Hodn\u011b m\u011b to p\u0159ekvapilo." },
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
              \u2014 {t.name}, {t.role}{t.company ? ` \u00b7 ${t.company}` : ''}
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
