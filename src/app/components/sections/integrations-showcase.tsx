import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Globe, Send, MousePointerClick, LayoutDashboard, ArrowRight, Zap } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";

/* ───────────────────────────────────────────────────
 *  How It Works — browser-only, zero-install flow
 *  Employee gets link → answers → Leader sees dashboard
 * ─────────────────────────────────────────────────── */

const copy = {
  cz: {
    badge: "Jak to funguje",
    title: "Celé to běží",
    titleHighlight: " v prohlížeči. Žádná instalace.",
    subtitle:
      "Zaměstnanec dostane unikátní odkaz, klikne, odpoví — hotovo. Leader se přihlásí do dashboardu a vše vidí. Z počítače, tabletu i mobilu.",
    cta: "Domluvit demo",
    steps: [
      {
        icon: "send",
        title: "Odeslání odkazu",
        description: "Zaměstnanec obdrží unikátní odkaz přes e-mail nebo Slack.",
        color: "#4A154B",
      },
      {
        icon: "click",
        title: "Odpověď v prohlížeči",
        description: "Klikne, odpoví na krátký AI chat za 2 minuty a odešle zpětnou vazbu.",
        color: "#2D1B69",
      },
      {
        icon: "dashboard",
        title: "Výsledky v dashboardu",
        description: "Leader se přihlásí a okamžitě vidí výsledky — podle týmů, témat i rizik.",
        color: "#059669",
      },
    ],
  },
  en: {
    badge: "How it works",
    title: "Everything runs",
    titleHighlight: " in the browser. Zero installation.",
    subtitle:
      "Employee receives a unique link, clicks, answers — done. Leader logs into the dashboard and sees everything. From desktop, tablet, or phone.",
    cta: "Book a demo",
    steps: [
      {
        icon: "send",
        title: "Link delivery",
        description: "Employee receives a unique link via email or Slack.",
        color: "#4A154B",
      },
      {
        icon: "click",
        title: "Answer in browser",
        description: "They click, answer a short AI chat in 2 minutes, and submit feedback.",
        color: "#2D1B69",
      },
      {
        icon: "dashboard",
        title: "Results in dashboard",
        description: "Leader logs in and instantly sees results — by team, topic, and risk.",
        color: "#059669",
      },
    ],
  },
  de: {
    badge: "So funktioniert's",
    title: "Alles läuft",
    titleHighlight: " im Browser. Keine Installation.",
    subtitle:
      "Mitarbeiter erhalten einen einzigartigen Link, klicken, antworten — fertig. Der Leader meldet sich im Dashboard an und sieht alles. Vom PC, Tablet oder Handy.",
    cta: "Demo buchen",
    steps: [
      {
        icon: "send",
        title: "Link-Versand",
        description: "Mitarbeiter erhalten einen einzigartigen Link per E-Mail oder Slack.",
        color: "#4A154B",
      },
      {
        icon: "click",
        title: "Antwort im Browser",
        description: "Sie klicken, beantworten einen kurzen AI-Chat in 2 Minuten und senden Feedback.",
        color: "#2D1B69",
      },
      {
        icon: "dashboard",
        title: "Ergebnisse im Dashboard",
        description: "Der Leader meldet sich an und sieht sofort Ergebnisse — nach Team, Thema und Risiko.",
        color: "#059669",
      },
    ],
  },
} as const;

const stepIconMap: Record<string, React.ElementType> = {
  send: Send,
  click: MousePointerClick,
  dashboard: LayoutDashboard,
};

export function IntegrationsShowcase() {
  const { language } = useLanguage();
  const { openSignup } = useModal();
  const t = copy[language] || copy.en;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-spacing bg-brand-background-secondary" id="how-it-works">
      <div className="container-default" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <Globe className="w-3.5 h-3.5 text-brand-accent" />
            {t.badge}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1] mb-4">
            {t.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* 3-step flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {t.steps.map((step, idx) => {
            const Icon = stepIconMap[step.icon] || Zap;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="bg-white rounded-2xl border border-brand-border p-6 relative group"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-1 md:left-4 w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {idx + 1}
                </div>
                
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${step.color}12` }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <h3 className="text-base font-bold text-brand-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-text-body leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow connector (visible on md+, except last) */}
                {idx < 2 && (
                  <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-brand-border-strong" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-center"
        >
          <Button
            onClick={() => openSignup("how_it_works_cta")}
            className="rounded-2xl h-12 px-8 font-semibold text-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-all inline-flex items-center gap-2"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
