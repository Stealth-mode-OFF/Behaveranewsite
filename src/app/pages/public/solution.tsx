import { useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { useModal } from "@/app/ModalContext";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import {
  Briefcase,
  Users,
  Target,
  ArrowRight,
  Check,
  BarChart3,
  ShieldAlert,
  Eye,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useSEO } from "@/app/hooks/useSEO";

/* ───────────────────────────────────────────────────
 *  Solutions Sub-Page — /for-ceos, /for-hr, /for-team-leads
 *  Fathom-inspired role-specific landing pages
 * ─────────────────────────────────────────────────── */

type RoleSlug = "ceos" | "hr" | "team-leads";

interface RolePage {
  icon: LucideIcon;
  color: string;
  meta: { title: string; description: string };
  hero: { badge: string; title: string; titleHighlight: string; subtitle: string };
  benefits: { icon: LucideIcon; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  cta: { title: string; button: string; micro: string };
}

type LangCopy = Record<RoleSlug, RolePage>;

const cz: LangCopy = {
  ceos: {
    icon: Briefcase,
    color: "#1a0a3e",
    meta: {
      title: "Behavera pro CEO & Founders — Viditelnost, ne intuice",
      description: "Přestaňte hádat, jak se vaši lidé cítí. Real-time engagement data pro strategická rozhodnutí.",
    },
    hero: {
      badge: "Pro CEO & Founders",
      title: "Přestaňte se spoléhat na",
      titleHighlight: " intuici",
      subtitle: "Získejte okamžitý přehled o náladě ve firmě, rizicích odchodů a skrytých signálech — vše na jednom dashboardu.",
    },
    benefits: [
      { icon: Eye, title: "Přehled jedním pohledem", desc: "Real-time dashboard ukazuje sentiment celé firmy bez čekání na kvartální reporty." },
      { icon: TrendingUp, title: "Prediktivní analytics", desc: "AI identifikuje riziko odchodu klíčových lidí 3–6 měsíců předem." },
      { icon: ShieldAlert, title: "Včasné varování", desc: "Automatické alerty, když tým nebo oddělení vykazuje negativní trend." },
      { icon: BarChart3, title: "ROI na lidský kapitál", desc: "Měřte dopad vašich people iniciativ na retenci a produktivitu." },
    ],
    stats: [
      { value: "40 %", label: "snížení neplánované fluktuace" },
      { value: "3×", label: "rychlejší identifikace problémů" },
      { value: "2 min", label: "doba vyplnění pulse checku" },
    ],
    cta: { title: "Připraveni vidět svou firmu jinak?", button: "Domluvit demo", micro: "30 min · Zdarma · Bez závazků" },
  },
  hr: {
    icon: Users,
    color: "#7C3AED",
    meta: {
      title: "Behavera pro HR — Prevence, ne hašení požárů",
      description: "Identifikujte rizikové zaměstnance a týmy předtím, než dají výpověď. Proaktivní engagement platforma pro HR.",
    },
    hero: {
      badge: "Pro HR",
      title: "Z reaktivního HR na",
      titleHighlight: " proaktivní strategii",
      subtitle: "Přestaňte hasit požáry. Behavera vám pomůže identifikovat rizika předtím, než se stanou problémem.",
    },
    benefits: [
      { icon: ShieldAlert, title: "Prediktivní alerty", desc: "Automatická upozornění na zaměstnance s vysokým rizikem odchodu." },
      { icon: BarChart3, title: "Engagement benchmarky", desc: "Porovnejte vaše výsledky s odvětvím a identifikujte mezery." },
      { icon: Eye, title: "Anonymní & bezpečné", desc: "Plná GDPR compliance, ISO 27001. Zaměstnanci důvěřují anonymitě." },
      { icon: TrendingUp, title: "Akční doporučení", desc: "AI navrhuje konkrétní kroky pro zlepšení engagementu v každém týmu." },
    ],
    stats: [
      { value: "80 %+", label: "response rate (vs 25 % u klasických průzkumů)" },
      { value: "6 měs.", label: "predikce odchodů předem" },
      { value: "50 000+", label: "zaměstnanců důvěřuje Behavera" },
    ],
    cta: { title: "Chcete vidět, jak to funguje pro HR?", button: "Domluvit demo", micro: "30 min · Zdarma · Bez závazků" },
  },
  "team-leads": {
    icon: Target,
    color: "#D97706",
    meta: {
      title: "Behavera pro Team Leads — Zdravý tým = lepší výsledky",
      description: "Pochopte dynamiku svého týmu a získejte nástroje pro budování zdravého pracovního prostředí.",
    },
    hero: {
      badge: "Pro Team Leads",
      title: "Budujte tým, ze kterého",
      titleHighlight: " lidé neodcházejí",
      subtitle: "Pochopte, co váš tým skutečně potřebuje. Získejte konkrétní akce, ne jen data.",
    },
    benefits: [
      { icon: Eye, title: "Team health skóre", desc: "Jednoduché vizualizace nálady a engagementu vašeho týmu v čase." },
      { icon: TrendingUp, title: "1-on-1 podklady", desc: "Anonymizované insighty pro efektivnější individuální schůzky." },
      { icon: ShieldAlert, title: "Včasné signály", desc: "Vidíte trendy předtím, než se projeví na výkonu nebo absencích." },
      { icon: BarChart3, title: "Porovnání s firmou", desc: "Jak si váš tým stojí oproti zbytku organizace." },
    ],
    stats: [
      { value: "2×", label: "vyšší engagement za 6 měsíců" },
      { value: "85 %", label: "manažerů říká, že lépe rozumí svému týmu" },
      { value: "< 2 min", label: "vyplnění pulse checku" },
    ],
    cta: { title: "Chcete silnější tým?", button: "Domluvit demo", micro: "30 min · Zdarma · Bez závazků" },
  },
};

const en: LangCopy = {
  ceos: {
    icon: Briefcase,
    color: "#1a0a3e",
    meta: {
      title: "Behavera for CEOs & Founders — Visibility, not guesswork",
      description: "Stop guessing how your people feel. Real-time engagement data for strategic people decisions.",
    },
    hero: {
      badge: "For CEOs & Founders",
      title: "Stop relying on",
      titleHighlight: " gut feeling",
      subtitle: "Get instant visibility into company sentiment, departure risks, and hidden signals — all in one dashboard.",
    },
    benefits: [
      { icon: Eye, title: "Bird's-eye view", desc: "Real-time dashboard shows company-wide sentiment without waiting for quarterly reports." },
      { icon: TrendingUp, title: "Predictive analytics", desc: "AI identifies key-person departure risk 3–6 months in advance." },
      { icon: ShieldAlert, title: "Early warning system", desc: "Automatic alerts when a team or department shows a negative trend." },
      { icon: BarChart3, title: "People ROI", desc: "Measure the impact of your people initiatives on retention and productivity." },
    ],
    stats: [
      { value: "40%", label: "reduction in unplanned turnover" },
      { value: "3×", label: "faster issue identification" },
      { value: "2 min", label: "to complete a pulse check" },
    ],
    cta: { title: "Ready to see your company differently?", button: "Book a demo", micro: "30 min · Free · No commitment" },
  },
  hr: {
    icon: Users,
    color: "#7C3AED",
    meta: {
      title: "Behavera for HR — Prevention, not firefighting",
      description: "Identify at-risk employees and teams before they resign. Proactive engagement platform for HR leaders.",
    },
    hero: {
      badge: "For HR Leaders",
      title: "From reactive HR to",
      titleHighlight: " proactive strategy",
      subtitle: "Stop firefighting. Behavera helps you identify risks before they become problems.",
    },
    benefits: [
      { icon: ShieldAlert, title: "Predictive alerts", desc: "Automatic notifications for employees with high departure risk." },
      { icon: BarChart3, title: "Engagement benchmarks", desc: "Compare your results with industry standards and identify gaps." },
      { icon: Eye, title: "Anonymous & secure", desc: "Full GDPR compliance, ISO 27001. Employees trust the anonymity." },
      { icon: TrendingUp, title: "Actionable recommendations", desc: "AI suggests concrete steps to improve engagement in every team." },
    ],
    stats: [
      { value: "80%+", label: "response rate (vs 25% for traditional surveys)" },
      { value: "6 mo.", label: "departure prediction in advance" },
      { value: "50,000+", label: "employees trust Behavera" },
    ],
    cta: { title: "Want to see how it works for HR?", button: "Book a demo", micro: "30 min · Free · No commitment" },
  },
  "team-leads": {
    icon: Target,
    color: "#D97706",
    meta: {
      title: "Behavera for Team Leads — Healthy team = better results",
      description: "Understand your team dynamics and get tools to build a healthy work environment.",
    },
    hero: {
      badge: "For Team Leads",
      title: "Build a team that",
      titleHighlight: " people don't leave",
      subtitle: "Understand what your team really needs. Get concrete actions, not just data.",
    },
    benefits: [
      { icon: Eye, title: "Team health score", desc: "Simple visualizations of your team's mood and engagement over time." },
      { icon: TrendingUp, title: "1-on-1 insights", desc: "Anonymized insights for more effective individual meetings." },
      { icon: ShieldAlert, title: "Early signals", desc: "See trends before they show up in performance or absenteeism." },
      { icon: BarChart3, title: "Company comparison", desc: "How your team stacks up against the rest of the organization." },
    ],
    stats: [
      { value: "2×", label: "higher engagement in 6 months" },
      { value: "85%", label: "of managers say they understand their team better" },
      { value: "< 2 min", label: "to complete a pulse check" },
    ],
    cta: { title: "Want a stronger team?", button: "Book a demo", micro: "30 min · Free · No commitment" },
  },
};

const de: LangCopy = {
  ceos: {
    icon: Briefcase,
    color: "#1a0a3e",
    meta: {
      title: "Behavera für CEOs & Gründer — Sichtbarkeit statt Bauchgefühl",
      description: "Hören Sie auf zu raten. Echtzeit-Engagement-Daten für strategische Personalentscheidungen.",
    },
    hero: {
      badge: "Für CEOs & Gründer",
      title: "Verlassen Sie sich nicht auf",
      titleHighlight: " Bauchgefühl",
      subtitle: "Sofortige Einblicke in die Unternehmensstimmung, Abgangsrisiken und versteckte Signale — alles in einem Dashboard.",
    },
    benefits: [
      { icon: Eye, title: "Überblick auf einen Blick", desc: "Echtzeit-Dashboard zeigt die Stimmung im Unternehmen ohne auf Quartalsberichte zu warten." },
      { icon: TrendingUp, title: "Prädiktive Analytik", desc: "KI identifiziert Abgangsrisiken 3–6 Monate im Voraus." },
      { icon: ShieldAlert, title: "Frühwarnsystem", desc: "Automatische Alerts bei negativen Trends in Teams oder Abteilungen." },
      { icon: BarChart3, title: "People ROI", desc: "Messen Sie die Auswirkungen Ihrer People-Initiativen auf Retention und Produktivität." },
    ],
    stats: [
      { value: "40 %", label: "Reduktion ungeplanter Fluktuation" },
      { value: "3×", label: "schnellere Problemerkennung" },
      { value: "2 Min", label: "für einen Pulse Check" },
    ],
    cta: { title: "Bereit, Ihr Unternehmen anders zu sehen?", button: "Demo buchen", micro: "30 Min · Kostenlos · Unverbindlich" },
  },
  hr: {
    icon: Users,
    color: "#7C3AED",
    meta: {
      title: "Behavera für HR — Prävention statt Feuerlöschen",
      description: "Identifizieren Sie gefährdete Mitarbeiter, bevor sie kündigen. Proaktive Engagement-Plattform für HR.",
    },
    hero: {
      badge: "Für HR-Leiter",
      title: "Von reaktivem HR zu",
      titleHighlight: " proaktiver Strategie",
      subtitle: "Hören Sie auf, Brände zu löschen. Behavera hilft Ihnen, Risiken zu erkennen, bevor sie zu Problemen werden.",
    },
    benefits: [
      { icon: ShieldAlert, title: "Prädiktive Alerts", desc: "Automatische Benachrichtigungen für Mitarbeiter mit hohem Abgangsrisiko." },
      { icon: BarChart3, title: "Engagement-Benchmarks", desc: "Vergleichen Sie Ihre Ergebnisse mit der Branche." },
      { icon: Eye, title: "Anonym & sicher", desc: "Volle DSGVO-Konformität, ISO 27001. Mitarbeiter vertrauen der Anonymität." },
      { icon: TrendingUp, title: "Handlungsempfehlungen", desc: "KI schlägt konkrete Schritte zur Verbesserung vor." },
    ],
    stats: [
      { value: "80 %+", label: "Rücklaufquote (vs 25 % bei klassischen Umfragen)" },
      { value: "6 Mon.", label: "Vorhersage von Abgängen" },
      { value: "50.000+", label: "Mitarbeiter vertrauen Behavera" },
    ],
    cta: { title: "Sehen, wie es für HR funktioniert?", button: "Demo buchen", micro: "30 Min · Kostenlos · Unverbindlich" },
  },
  "team-leads": {
    icon: Target,
    color: "#D97706",
    meta: {
      title: "Behavera für Team Leads — Gesundes Team = bessere Ergebnisse",
      description: "Verstehen Sie die Dynamik Ihres Teams und erhalten Sie Werkzeuge für ein gesundes Arbeitsumfeld.",
    },
    hero: {
      badge: "Für Team Leads",
      title: "Bauen Sie ein Team auf, das",
      titleHighlight: " niemand verlassen will",
      subtitle: "Verstehen Sie, was Ihr Team wirklich braucht. Konkrete Maßnahmen statt nur Daten.",
    },
    benefits: [
      { icon: Eye, title: "Team-Health-Score", desc: "Einfache Visualisierungen von Stimmung und Engagement über die Zeit." },
      { icon: TrendingUp, title: "1-on-1 Insights", desc: "Anonymisierte Insights für effektivere Einzelgespräche." },
      { icon: ShieldAlert, title: "Frühe Signale", desc: "Trends erkennen, bevor sie sich in Leistung oder Fehlzeiten zeigen." },
      { icon: BarChart3, title: "Firmenvergleich", desc: "Wie Ihr Team im Vergleich zum Rest der Organisation abschneidet." },
    ],
    stats: [
      { value: "2×", label: "höheres Engagement in 6 Monaten" },
      { value: "85 %", label: "der Manager verstehen ihr Team besser" },
      { value: "< 2 Min", label: "für einen Pulse Check" },
    ],
    cta: { title: "Ein stärkeres Team aufbauen?", button: "Demo buchen", micro: "30 Min · Kostenlos · Unverbindlich" },
  },
};

const allCopy = { cz, en, de };

const slugMap: Record<string, RoleSlug> = {
  "for-ceos": "ceos",
  "for-hr": "hr",
  "for-team-leads": "team-leads",
};

export function SolutionPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, ""); // e.g. "for-ceos"
  const { language } = useLanguage();
  const { openBooking } = useModal();

  const roleKey = slugMap[slug || ""];
  if (!roleKey) return <Navigate to="/" replace />;

  const langCopy = allCopy[language] || allCopy.en;
  const page = langCopy[roleKey];
  const Icon = page.icon;

  useSEO({ title: page.meta.title, description: page.meta.description });

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-[#FAFAFA] via-white to-white">
          <div className="container-default max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
                <Icon className="w-3.5 h-3.5" style={{ color: page.color }} />
                {page.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                {page.hero.title}
                <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
                  {page.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto">
                {page.hero.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats row */}
        <section className="py-12 md:py-16 bg-brand-background-secondary border-y border-brand-border">
          <div className="container-default max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {page.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold tracking-tight text-brand-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-spacing bg-white">
          <div className="container-default max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {page.benefits.map((benefit, idx) => {
                const BIcon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="flex gap-4 p-6 rounded-2xl bg-brand-background-secondary border border-brand-border"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${page.color}10` }}
                    >
                      <BIcon className="w-5 h-5" style={{ color: page.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-text-primary mb-1">{benefit.title}</h3>
                      <p className="text-sm text-brand-text-body leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-spacing bg-gradient-to-b from-brand-primary via-[#1a0a3e] to-[#0d0520] text-white text-center">
          <div className="container-default max-w-[700px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="w-8 h-8 text-brand-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {page.cta.title}
              </h2>
              <Button
                onClick={() => openBooking(`solution_${roleKey}_cta`)}
                className="rounded-2xl h-14 px-10 text-base font-bold bg-white text-brand-primary hover:bg-white/90 transition-all inline-flex items-center gap-2"
              >
                {page.cta.button}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-white/50 mt-3">{page.cta.micro}</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
