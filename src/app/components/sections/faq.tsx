import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Shield, Zap, Users, BarChart, HelpCircle, ShieldCheck, Lock, Globe, Server } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { cn } from "@/app/components/ui/utils";
import { trackFaqCategoryChanged, trackFaqItemToggled } from "@/lib/analytics";
import { Button } from "@/app/components/ui/button";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * FAQ - Luxury Accordion with Categories
 * 
 * Features:
 * - Category tabs for organization
 * - Smooth spring animations
 * - Icon per category
 * - Apple-style design
 */

type FAQCategory = {
  id: string;
  label: string;
  shortLabel: string;
  icon: ReactNode;
};

type FAQItem = {
  q: string;
  a: string;
  category?: string;
};

export function FAQ() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItem, setOpenItem] = useState<number | null>(null);

  // Categories
  const categories: FAQCategory[] = [
    {
      id: "all",
      label: language === 'cz' ? "Vše" : language === 'de' ? "Alle" : "All",
      shortLabel: language === 'cz' ? "Vše" : language === 'de' ? "Alle" : "All",
      icon: <BarChart className="w-4 h-4" />,
    },
    {
      id: "product",
      label: language === 'cz' ? "Produkt" : language === 'de' ? "Produkt" : "Product",
      shortLabel: language === 'cz' ? "Produkt" : language === 'de' ? "Produkt" : "Produkt",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "privacy",
      label: language === 'cz' ? "Bezpečnost" : language === 'de' ? "Sicherheit" : "Privacy",
      shortLabel: language === 'cz' ? "Data" : language === 'de' ? "Daten" : "Privacy",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "implementation",
      label: language === 'cz' ? "Nasazení" : language === 'de' ? "Einführung" : "Implementation",
      shortLabel: language === 'cz' ? "Setup" : language === 'de' ? "Setup" : "Setup",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  // Map FAQ items to categories (basic heuristic based on content)
  const sourceItems: FAQItem[] = Array.isArray(t.faq?.items) ? t.faq.items : [];

  const faqItems: FAQItem[] = sourceItems.map((item) => {
    let category = "product";
    const text = `${item.q} ${item.a}`.toLowerCase();
    if (text.includes("gdpr") || text.includes("data") || text.includes("security") || text.includes("bezpečnost") || text.includes("anonymní")) {
      category = "privacy";
    } else if (text.includes("implement") || text.includes("nasaz") || text.includes("čas") || text.includes("time") || text.includes("setup") || text.includes("integr")) {
      category = "implementation";
    }
    return { ...item, category };
  });

  const filteredItems = activeCategory === "all" 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
    if (openItem !== index && filteredItems[index]) {
      trackFaqItemToggled(filteredItems[index].q);
    }
  };

  return (
    <section className="section-spacing bg-white relative overflow-hidden noise-texture" id="faq">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-[8%] h-40 w-40 rounded-full bg-brand-accent/[0.15] blur-3xl" />
        <div className="absolute bottom-6 right-[10%] h-52 w-52 rounded-full bg-brand-primary/[0.12] blur-3xl" />
      </div>
      <div className="container-default relative" style={{ maxWidth: '720px' }}>
        <div className="section-shell px-4 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center"
        >
          <div className="section-badge">
            <HelpCircle className="w-3.5 h-3.5" />
            {language === 'cz' ? 'Časté otázky' : language === 'de' ? 'Häufige Fragen' : 'FAQ'}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {t.faq?.title || "Remove risks,"}
            <span className="text-gradient">
              {t.faq?.titleHighlight || " not just questions"}
            </span>
          </h2>
          <p className="text-body-lg text-brand-text-secondary max-w-2xl mx-auto mb-10 md:mb-14">
            {t.faq?.desc || "Get answers to common questions about Behavera."}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.3, ease: MOTION_EASE }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex p-1.5 surface-elevated rounded-2xl max-w-full overflow-x-auto chip-scroll gap-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenItem(null);
                    trackFaqCategoryChanged(cat.id);
                  }}
                  className={cn(
                    "relative px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2",
                    isActive 
                      ? "text-white" 
                      : "text-brand-text-secondary hover:text-brand-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="faqCategoryBg"
                      className="absolute inset-0 bg-brand-primary rounded-xl"
                      transition={{ duration: 0.3, ease: MOTION_EASE }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.icon}
                    <span className="sm:hidden text-caption">{cat.shortLabel}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: MOTION_EASE }}
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={`${activeCategory}-${item.q}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: MOTION_EASE }}
              >
                <FAQAccordionItem
                  question={item.q}
                  answer={item.a}
                  isOpen={openItem === index}
                  onToggle={() => toggleItem(index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5, ease: MOTION_EASE }}
          className="mt-12 text-center"
        >
          <p className="text-body text-brand-text-secondary mb-4">
            {language === 'cz' ? "Nenašli jste odpověď?" : language === 'de' ? "Keine Antwort gefunden?" : "Didn't find your answer?"}
          </p>
          <Button asChild size="default" variant="outline" className="surface-elevated surface-elevated-hover rounded-xl">
            <a href="mailto:support@behavera.com">
              <Mail className="w-4 h-4" />
              {t.faq?.contact || (language === 'cz' ? 'Kontaktujte nás' : language === 'de' ? 'Kontaktieren Sie uns' : 'Contact us')}
            </a>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <TrustBadges language={language} />
        </div>
      </div>
    </section>
  );
}

type FAQAccordionItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

/* ─── Trust Badges ─── */
function TrustBadges({ language }: { language: string }) {
  const badges = {
    cz: [
      { icon: ShieldCheck, label: "GDPR", sub: "Plně v souladu" },
      { icon: Lock, label: "Šifrování", sub: "AES-256 / TLS 1.3" },
      { icon: Server, label: "EU hosting", sub: "Data v EU" },
      { icon: Globe, label: "ISO 27001", sub: "Certifikováno" },
    ],
    en: [
      { icon: ShieldCheck, label: "GDPR", sub: "Fully compliant" },
      { icon: Lock, label: "Encrypted", sub: "AES-256 / TLS 1.3" },
      { icon: Server, label: "EU hosting", sub: "Data stays in EU" },
      { icon: Globe, label: "ISO 27001", sub: "Certified" },
    ],
    de: [
      { icon: ShieldCheck, label: "DSGVO", sub: "Vollständig konform" },
      { icon: Lock, label: "Verschlüsselt", sub: "AES-256 / TLS 1.3" },
      { icon: Server, label: "EU-Hosting", sub: "Daten in der EU" },
      { icon: Globe, label: "ISO 27001", sub: "Zertifiziert" },
    ],
  };

  const items = badges[language as keyof typeof badges] || badges.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5, ease: MOTION_EASE }}
      className="mt-10 pt-8 border-t border-brand-border/40"
    >
      <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
        {items.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-primary/70" />
              </div>
              <div>
                <div className="text-xs font-bold text-brand-text-primary leading-tight">{badge.label}</div>
                <div className="text-badge text-brand-text-muted leading-tight">{badge.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function FAQAccordionItem({ question, answer, isOpen, onToggle }: FAQAccordionItemProps) {
  return (
    <div className={cn(
      "surface-elevated rounded-2xl transition-all duration-300",
      isOpen ? "border-brand-primary/30 shadow-lg shadow-brand-primary/10" : "hover:border-brand-primary/20"
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-[15px] sm:text-base font-semibold pr-3 transition-colors duration-200",
          isOpen ? "text-brand-primary" : "text-brand-text-primary"
        )}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: MOTION_EASE }}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200",
            isOpen ? "bg-brand-primary text-white" : "bg-brand-background-secondary text-brand-text-muted"
          )}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: MOTION_EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
              <div className="h-px bg-brand-border mb-3" />
              <p className="text-sm sm:text-[15px] text-brand-text-secondary leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
