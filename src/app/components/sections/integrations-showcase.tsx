import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Mail, MessageSquare, Video, Calendar, BarChart3, Users, Zap, ArrowRight } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";

/* ───────────────────────────────────────────────────
 *  Integrations Showcase — Fathom-inspired
 *  "Works wherever your people already work"
 * ─────────────────────────────────────────────────── */

const copy = {
  cz: {
    badge: "Integrace",
    title: "Funguje tam,",
    titleHighlight: " kde váš tým už pracuje",
    subtitle:
      "Echo Pulse se napojí na nástroje, které denně používáte. Žádný nový software, žádné přihlašování navíc.",
    cta: "Domluvit demo",
    categories: [
      {
        name: "Komunikace",
        items: [
          { icon: "slack", label: "Slack" },
          { icon: "email", label: "E-mail" },
        ],
      },
      {
        name: "HR systémy",
        items: [
          { icon: "users", label: "BambooHR" },
          { icon: "users", label: "Personio" },
          { icon: "users", label: "SAP HR" },
        ],
      },
      {
        name: "Produktivita",
        items: [
          { icon: "calendar", label: "Google Calendar" },
          { icon: "video", label: "Zoom / Meet" },
          { icon: "chart", label: "Power BI" },
        ],
      },
    ],
  },
  en: {
    badge: "Integrations",
    title: "Works wherever",
    titleHighlight: " your team already works",
    subtitle:
      "Echo Pulse plugs into the tools you use every day. No new software to learn, no extra logins.",
    cta: "Book a demo",
    categories: [
      {
        name: "Communication",
        items: [
          { icon: "slack", label: "Slack" },
          { icon: "email", label: "Email" },
        ],
      },
      {
        name: "HR Systems",
        items: [
          { icon: "users", label: "BambooHR" },
          { icon: "users", label: "Personio" },
          { icon: "users", label: "SAP HR" },
        ],
      },
      {
        name: "Productivity",
        items: [
          { icon: "calendar", label: "Google Calendar" },
          { icon: "video", label: "Zoom / Meet" },
          { icon: "chart", label: "Power BI" },
        ],
      },
    ],
  },
  de: {
    badge: "Integrationen",
    title: "Funktioniert dort,",
    titleHighlight: " wo Ihr Team bereits arbeitet",
    subtitle:
      "Echo Pulse integriert sich in die Tools, die Sie täglich nutzen. Keine neue Software, keine zusätzlichen Logins.",
    cta: "Demo buchen",
    categories: [
      {
        name: "Kommunikation",
        items: [
          { icon: "slack", label: "Slack" },
          { icon: "email", label: "E-Mail" },
        ],
      },
      {
        name: "HR-Systeme",
        items: [
          { icon: "users", label: "BambooHR" },
          { icon: "users", label: "Personio" },
          { icon: "users", label: "SAP HR" },
        ],
      },
      {
        name: "Produktivität",
        items: [
          { icon: "calendar", label: "Google Calendar" },
          { icon: "video", label: "Zoom / Meet" },
          { icon: "chart", label: "Power BI" },
        ],
      },
    ],
  },
} as const;

const iconMap: Record<string, React.ElementType> = {
  slack: MessageSquare,
  email: Mail,
  users: Users,
  calendar: Calendar,
  video: Video,
  chart: BarChart3,
};

const brandColors: Record<string, string> = {
  Slack: "#4A154B",
  "E-mail": "#EA4335",
  Email: "#EA4335",
  "E-Mail": "#EA4335",
  BambooHR: "#73C41D",
  Personio: "#0F1740",
  "SAP HR": "#0070F2",
  "Google Calendar": "#4285F4",
  "Zoom / Meet": "#2D8CFF",
  "Power BI": "#F2C811",
};

export function IntegrationsShowcase() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const t = copy[language] || copy.en;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-spacing bg-brand-background-secondary" id="integrations">
      <div className="container-default max-w-[1120px] mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <Zap className="w-3.5 h-3.5 text-brand-accent" />
            {t.badge}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1] mb-4">
            {t.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-base md:text-lg text-brand-text-body leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Integration grid — 3 categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {t.categories.map((category, catIdx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="bg-white rounded-2xl border border-brand-border p-6"
            >
              <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest mb-5">
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.items.map((item) => {
                  const Icon = iconMap[item.icon] || Zap;
                  const color = brandColors[item.label] || "#6D28D9";
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-brand-text-primary">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={() => openBooking("integrations_cta")}
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
