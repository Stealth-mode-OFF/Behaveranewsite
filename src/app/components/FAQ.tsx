import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { HelpCircle, Mail } from "lucide-react";

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-white to-brand-background-secondary/30 border-b border-brand-border" id="faq">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/3"
          >
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-brand-primary/10 mb-6 shadow-lg shadow-brand-primary/5">
                <HelpCircle className="w-4 h-4 text-brand-primary" />
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4 md:mb-6 tracking-tight">
                {t.faq.title}
              </h2>
              <p className="text-lg text-brand-text-secondary mb-8 leading-relaxed">
                {t.faq.desc}
              </p>
              <a 
                href="mailto:support@echopulse.cz" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary font-bold rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                {t.faq.contact}
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-2/3"
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {t.faq.items.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-white border border-brand-border rounded-xl px-5 data-[state=open]:shadow-md data-[state=open]:border-brand-primary/20 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-medium text-brand-text-primary hover:text-brand-primary hover:no-underline py-5 transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-brand-text-secondary pb-5 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
