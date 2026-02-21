import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Shield, Zap, Users, BarChart, HelpCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { cn } from "@/app/components/ui/utils";
import { trackFaqCategoryChanged, trackFaqItemToggled } from "@/lib/analytics";

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
    { id: "all", label: language === 'cz' ? "Vše" : language === 'de' ? "Alle" : "All", icon: <BarChart className="w-4 h-4" /> },
    { id: "product", label: language === 'cz' ? "Produkt" : language === 'de' ? "Produkt" : "Product", icon: <Zap className="w-4 h-4" /> },
    { id: "privacy", label: language === 'cz' ? "Bezpečnost" : language === 'de' ? "Sicherheit" : "Privacy", icon: <Shield className="w-4 h-4" /> },
    { id: "implementation", label: language === 'cz' ? "Nasazení" : language === 'de' ? "Einführung" : "Implementation", icon: <Users className="w-4 h-4" /> },
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
    <section className="section-spacing bg-brand-background-secondary/30" id="faq">
      <div className="container-default max-w-[900px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <HelpCircle className="w-3.5 h-3.5" />
            {language === 'cz' ? 'Časté otázky' : language === 'de' ? 'Häufige Fragen' : 'FAQ'}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {t.faq?.title || "Remove risks,"}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.faq?.titleHighlight || " not just questions"}
            </span>
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            {t.faq?.desc || "Get answers to common questions about Behavera."}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex p-1.5 bg-white border border-brand-border rounded-2xl shadow-sm max-w-full overflow-x-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenItem(null);
                    trackFaqCategoryChanged(cat.id);
                  }}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    isActive 
                      ? "text-white" 
                      : "text-brand-text-secondary hover:text-brand-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="faqCategoryBg"
                      className="absolute inset-0 bg-brand-primary rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.icon}
                    <span className="hidden sm:inline">{cat.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-brand-text-secondary mb-4">
            {language === 'cz' ? "Nenašli jste odpověď?" : language === 'de' ? "Keine Antwort gefunden?" : "Didn't find your answer?"}
          </p>
          <a
            href="mailto:support@behavera.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-border rounded-xl text-brand-primary font-semibold hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
          >
            <Mail className="w-4 h-4" />
            {t.faq?.contact || "Contact us"}
          </a>
        </motion.div>
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

function FAQAccordionItem({ question, answer, isOpen, onToggle }: FAQAccordionItemProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all duration-300",
      isOpen ? "border-brand-primary/30 shadow-lg shadow-brand-primary/5" : "border-brand-border hover:border-brand-primary/20"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-lg font-semibold pr-4 transition-colors",
          isOpen ? "text-brand-primary" : "text-brand-text-primary"
        )}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
            isOpen ? "bg-brand-primary text-white" : "bg-brand-background-secondary text-brand-text-muted"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              <div className="h-px bg-brand-border mb-4" />
              <p className="text-brand-text-secondary leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
