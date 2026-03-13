import { motion } from "framer-motion";
import { useLanguage } from "@/app/contexts/language-context";
import { useModal } from "@/app/contexts/modal-context";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import { Check, X, ArrowRight, AlertTriangle, Zap, BarChart3, Shield, Users } from "lucide-react";
import { useSEO } from "@/app/hooks/use-seo";

/* ───────────────────────────────────────────────────
 *  Comparison Page — Behavera vs Google Forms
 *  SEO landing page targeting "Google Forms employee survey alternative"
 * ─────────────────────────────────────────────────── */

const copy = {
  cz: {
    meta: {
      title: "Behavera vs Google Forms — Proč přejít na chytřejší engagement",
      description: "Porovnání Behavera a Google Forms pro měření spokojenosti zaměstnanců. Zjistěte, proč 50 000+ lidí důvěřuje Behavera.",
    },
    hero: {
      badge: "Srovnání",
      title: "Proč firmy přecházejí z",
      titleHighlight: " Google Forms",
      subtitle: "Google Forms zvládne anketu. Behavera zachytí signály ještě předtím, než je pozdě.",
    },
    painPoints: {
      title: "Kde Google Forms nestačí",
      items: [
        { icon: "alert", text: "Nízká response rate — lidé ignorují dlouhé dotazníky" },
        { icon: "alert", text: "Žádné prediktivní signály — jen historická data" },
        { icon: "alert", text: "Ruční analýza — hodiny v tabulkách" },
        { icon: "alert", text: "Bez benchmarků — nevíte, jestli je to dobře nebo špatně" },
      ],
    },
    comparison: {
      title: "Přímé srovnání",
      features: [
        { feature: "Doba vyplnění", forms: "15–25 min", echo: "2 min", winner: "echo" },
        { feature: "Response rate", forms: "20–35 %", echo: "80 %+", winner: "echo" },
        { feature: "Prediktivní analýza", forms: "Ne", echo: "Ano — AI radar", winner: "echo" },
        { feature: "Real-time dashboard", forms: "Ne", echo: "Ano", winner: "echo" },
        { feature: "Anonymita & GDPR", forms: "Základní", echo: "Plná — ISO 27001", winner: "echo" },
        { feature: "Automatické doporučení", forms: "Ne", echo: "Ano", winner: "echo" },
        { feature: "Benchmarky odvětví", forms: "Ne", echo: "Ano", winner: "echo" },
        { feature: "Cena", forms: "Zdarma", echo: "Od $2/zaměstnanec", winner: "forms" },
      ],
    },
    cta: {
      title: "Připraveni na upgrade?",
      subtitle: "Přestaňte hádat. Začněte měřit.",
      button: "Domluvit demo",
      micro: "30 min · Zdarma · Bez závazků",
    },
  },
  en: {
    meta: {
      title: "Behavera vs Google Forms — Why Smart Teams Switch",
      description: "Compare Behavera and Google Forms for employee engagement surveys. Discover why 50,000+ people trust Behavera for retention intelligence.",
    },
    hero: {
      badge: "Comparison",
      title: "Why companies switch from",
      titleHighlight: " Google Forms",
      subtitle: "Google Forms can run a survey. Behavera catches the signals before it's too late.",
    },
    painPoints: {
      title: "Where Google Forms falls short",
      items: [
        { icon: "alert", text: "Low response rates — people ignore long questionnaires" },
        { icon: "alert", text: "No predictive signals — just historical data" },
        { icon: "alert", text: "Manual analysis — hours in spreadsheets" },
        { icon: "alert", text: "No benchmarks — no idea if results are good or bad" },
      ],
    },
    comparison: {
      title: "Head-to-head comparison",
      features: [
        { feature: "Time to complete", forms: "15–25 min", echo: "2 min", winner: "echo" },
        { feature: "Response rate", forms: "20–35%", echo: "80%+", winner: "echo" },
        { feature: "Predictive analytics", forms: "No", echo: "Yes — AI radar", winner: "echo" },
        { feature: "Real-time dashboard", forms: "No", echo: "Yes", winner: "echo" },
        { feature: "Anonymity & GDPR", forms: "Basic", echo: "Full — ISO 27001", winner: "echo" },
        { feature: "Auto recommendations", forms: "No", echo: "Yes", winner: "echo" },
        { feature: "Industry benchmarks", forms: "No", echo: "Yes", winner: "echo" },
        { feature: "Price", forms: "Free", echo: "From $2/employee", winner: "forms" },
      ],
    },
    cta: {
      title: "Ready to upgrade?",
      subtitle: "Stop guessing. Start measuring.",
      button: "Book a demo",
      micro: "30 min · Free · No commitment",
    },
  },
  de: {
    meta: {
      title: "Behavera vs Google Forms — Warum kluge Teams wechseln",
      description: "Vergleichen Sie Behavera und Google Forms für Mitarbeiterbefragungen. Entdecken Sie, warum 50.000+ Mitarbeiter Behavera vertrauen.",
    },
    hero: {
      badge: "Vergleich",
      title: "Warum Unternehmen von",
      titleHighlight: " Google Forms wechseln",
      subtitle: "Google Forms kann eine Umfrage durchführen. Behavera erkennt die Signale, bevor es zu spät ist.",
    },
    painPoints: {
      title: "Wo Google Forms an Grenzen stößt",
      items: [
        { icon: "alert", text: "Niedrige Rücklaufquoten — lange Fragebögen werden ignoriert" },
        { icon: "alert", text: "Keine prädiktiven Signale — nur historische Daten" },
        { icon: "alert", text: "Manuelle Analyse — stundenlang in Tabellen" },
        { icon: "alert", text: "Keine Benchmarks — unklar, ob Ergebnisse gut oder schlecht sind" },
      ],
    },
    comparison: {
      title: "Direkter Vergleich",
      features: [
        { feature: "Ausfüllzeit", forms: "15–25 Min", echo: "2 Min", winner: "echo" },
        { feature: "Rücklaufquote", forms: "20–35 %", echo: "80 %+", winner: "echo" },
        { feature: "Prädiktive Analytik", forms: "Nein", echo: "Ja — AI Radar", winner: "echo" },
        { feature: "Echtzeit-Dashboard", forms: "Nein", echo: "Ja", winner: "echo" },
        { feature: "Anonymität & DSGVO", forms: "Basis", echo: "Voll — ISO 27001", winner: "echo" },
        { feature: "Auto-Empfehlungen", forms: "Nein", echo: "Ja", winner: "echo" },
        { feature: "Branchen-Benchmarks", forms: "Nein", echo: "Ja", winner: "echo" },
        { feature: "Preis", forms: "Kostenlos", echo: "Ab $2/Mitarbeiter", winner: "forms" },
      ],
    },
    cta: {
      title: "Bereit für das Upgrade?",
      subtitle: "Hören Sie auf zu raten. Beginnen Sie zu messen.",
      button: "Demo buchen",
      micro: "30 Min · Kostenlos · Unverbindlich",
    },
  },
};

export function ComparisonGoogleFormsPage() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const t = copy[language] || copy.en;

  useSEO({
    title: t.meta.title,
    description: t.meta.description,
  });

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
                <BarChart3 className="w-3.5 h-3.5 text-brand-accent" />
                {t.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                {t.hero.title}
                <span className="text-gradient">
                  {t.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto">
                {t.hero.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-default max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
                {t.painPoints.title}
              </h2>
              <div className="grid gap-4">
                {t.painPoints.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-50/60 border border-red-100"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-brand-text-primary">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 md:py-24 bg-brand-background-secondary">
          <div className="container-default max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
                {t.comparison.title}
              </h2>
              <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                <div className="grid grid-cols-3 text-center font-bold text-sm border-b border-brand-border">
                  <div className="p-4 text-left text-brand-text-muted" />
                  <div className="p-4 bg-gray-50 text-brand-text-secondary">Google Forms</div>
                  <div className="p-4 bg-brand-primary/5 text-brand-primary">Behavera</div>
                </div>
                {t.comparison.features.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 text-center text-sm border-b border-brand-border/50 last:border-b-0"
                  >
                    <div className="p-4 text-left font-medium text-brand-text-primary">
                      {row.feature}
                    </div>
                    <div className="p-4 bg-gray-50/50 flex items-center justify-center gap-1.5">
                      {row.winner === "forms" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-brand-text-body">{row.forms}</span>
                    </div>
                    <div className="p-4 bg-brand-primary/[0.02] flex items-center justify-center gap-1.5">
                      {row.winner === "echo" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span className="font-medium text-brand-text-primary">{row.echo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
                {t.cta.title}
              </h2>
              <p className="text-lg text-white/70 mb-8">{t.cta.subtitle}</p>
              <Button
                onClick={() => openBooking("comparison_gforms_cta")}
                className="rounded-2xl h-14 px-10 text-base font-bold bg-white text-brand-primary hover:bg-white/90 transition-all inline-flex items-center gap-2"
              >
                {t.cta.button}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-white/50 mt-3">{t.cta.micro}</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
