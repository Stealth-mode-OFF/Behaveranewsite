import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronDown, Building2, Users, Target } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { cn } from "@/app/components/ui/utils";

/* ─── Testimonial Data ─── */

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  lang: "cs" | "en";
};

type Category = {
  id: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  label: { cz: string; en: string; de: string };
  testimonials: Testimonial[];
};

const categories: Category[] = [
  {
    id: "ceo",
    icon: Target,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    label: { cz: "CEO / COO / Majitelé", en: "CEO / COO / Owners", de: "CEO / COO / Inhaber" },
    testimonials: [
      {
        name: "Dominik Hegedus",
        role: "CEO",
        company: "Expando",
        quote: "It took just a moment — and those few answers delivered exactly what we needed. No complicated reports, no endless spreadsheets — just clear, actionable insights.",
        lang: "en",
      },
      {
        name: "Jiří",
        role: "CEO",
        company: "Logistika",
        quote: "Jsem nadšený! Jsem na pozici CEO od srpna. Mám dát do pořádku celou firmu a potřebuji rychle zjistit, co se kde děje. Tohle je pro mě nesmírně cenné!",
        lang: "cs",
      },
      {
        name: "Tereza Müllerová",
        role: "COO",
        company: "StartupJobs",
        quote: "Překvapilo mě, kolik lidí se zapojilo. A i když naši lídři se svými týmy pravidelně mluví, v Pulsu se ukázaly věci, které jim lidé do očí neřekli.",
        lang: "cs",
      },
      {
        name: "Karel Poplstein",
        role: "CEO",
        company: "Valxon",
        quote: "I thought people are no longer engaged and gave up on us. I was surprised when I saw how engaged and invested our employees are. Moreover, without Behavera, we would've kept treating symptoms instead of the real causes. It helped us see what we would've otherwise missed.",
        lang: "en",
      },
      {
        name: "Dana Kultová",
        role: "COO",
        company: "",
        quote: "The results more or less confirmed what I suspected. But what truly blew me away was the playbook full of practical, step-by-step recommendations. Thanks to that, we fine-tuned our processes, set clear KPIs, and improved team communication.",
        lang: "en",
      },
    ],
  },
  {
    id: "hr",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: { cz: "HR / People / HRBP", en: "HR / People / HRBP", de: "HR / People / HRBP" },
    testimonials: [
      {
        name: "Head of HR",
        role: "Head of HR",
        company: "",
        quote: "I had given up hope of finding out what the company thinks. People hated surveys and just 30 % responded. And the data was useless. Behavera gave us clear message from over two-thirds of employees, which is more than enough to act.",
        lang: "en",
      },
      {
        name: "Ema Nováková",
        role: "HR Manager",
        company: "Expando",
        quote: "Díky Behaveře lídři dostanou výstupy z průzkumu automaticky a to i s akčními doporučeními okamžitě a já tak ušetřím celý týden, který nyní mohu investovat do zlepšování procesů a rozvoje zaměstnanců.",
        lang: "cs",
      },
    ],
  },
  {
    id: "manager",
    icon: Building2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: { cz: "Team Leadeři / Manažeři", en: "Team Leaders / Managers", de: "Teamleiter / Manager" },
    testimonials: [
      {
        name: "Martina",
        role: "Manažerka telesales týmu",
        company: "Teya",
        quote: "Díky Echo Pulse mám pravidelný feedback o tom, jestli je můj tým v pohodě. Hned vidím, kdy je třeba urgentně řešit nějaký problém i co moje lidi pálí nejvíc. Jsem v roli lídra čerstvě a Behavera mi pomáhá si správně definovat priority.",
        lang: "cs",
      },
      {
        name: "Ján Pavlík",
        role: "Project Manager",
        company: "Expando",
        quote: "Při tvorbě otázek jsem se neptal na slabá místa ve firmě obecně, ale zaměřil jsem se pouze na konkrétní osoby. Uniklo mi tak mnoho souvislostí, což vedlo k nesprávnému posouzení příčin problémů - nebo jsem je neviděl vůbec.",
        lang: "cs",
      },
    ],
  },
];

/* ─── Component ─── */

export function Testimonials() {
  const { language } = useLanguage();
  const [openCategory, setOpenCategory] = useState<string>("ceo");

  const lang = language as "cz" | "en" | "de";

  const texts = {
    cz: {
      badge: "Reference",
      title: "Co říkají lidé,",
      titleHighlight: "kteří to používají",
    },
    en: {
      badge: "Testimonials",
      title: "What people say",
      titleHighlight: "who actually use it",
    },
    de: {
      badge: "Referenzen",
      title: "Was die Nutzer",
      titleHighlight: "tatsächlich sagen",
    },
  };

  const t = texts[lang] || texts.en;

  return (
    <section className="section-spacing bg-brand-background-secondary/30">
      <div className="container-default max-w-[1000px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-brand-text-muted tracking-[0.15em] uppercase">
              {t.badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
        </motion.div>

        {/* Category Accordions */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const isOpen = openCategory === cat.id;
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white border border-brand-border/50 overflow-hidden shadow-sm"
              >
                {/* Category Header */}
                <button
                  onClick={() => setOpenCategory(isOpen ? "" : cat.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-brand-background-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", cat.bgColor)}>
                      <Icon className={cn("w-4.5 h-4.5", cat.color)} />
                    </div>
                    <span className="text-base font-bold text-brand-text-primary">
                      {cat.label[lang]}
                    </span>
                    <span className="text-xs text-brand-text-muted bg-brand-background-secondary px-2 py-0.5 rounded-full">
                      {cat.testimonials.length}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-7 h-7 rounded-full bg-brand-background-secondary flex items-center justify-center shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-brand-text-muted" />
                  </motion.div>
                </button>

                {/* Testimonials */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {cat.testimonials.map((testimonial, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={cn(
                              "rounded-xl border p-5 relative",
                              cat.bgColor,
                              cat.borderColor
                            )}
                          >
                            <Quote className={cn("w-5 h-5 mb-3 opacity-40", cat.color)} />
                            <p className="text-[14px] text-brand-text-primary leading-relaxed mb-4 italic">
                              &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                cat.id === "ceo" ? "bg-violet-500" : cat.id === "hr" ? "bg-blue-500" : "bg-emerald-500"
                              )}>
                                {testimonial.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-sm font-bold text-brand-text-primary block leading-tight">
                                  {testimonial.name}
                                </span>
                                <span className="text-xs text-brand-text-muted">
                                  {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ""}
                                </span>
                              </div>
                              {testimonial.lang === "en" && (
                                <span className="ml-auto text-[10px] font-medium text-brand-text-muted bg-white px-2 py-0.5 rounded-full border border-brand-border/50">
                                  EN
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
