import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { useLanguage } from "@/app/LanguageContext";

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-white border-b border-brand-border" id="faq">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
          <div className="lg:w-1/3">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-4 md:mb-6 tracking-tight">
              {t.faq.title}
            </h2>
            <p className="text-lg text-brand-text-secondary mb-8 leading-relaxed">
              {t.faq.desc}
            </p>
            <a 
                href="mailto:support@echopulse.cz" 
                className="inline-flex items-center text-brand-primary font-bold hover:underline text-sm uppercase tracking-wide"
            >
              {t.faq.contact}
            </a>
          </div>

          <div className="lg:w-2/3">
            <Accordion type="single" collapsible className="w-full">
              {t.faq.items.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-brand-border">
                  <AccordionTrigger className="text-left text-lg font-medium text-brand-text-primary hover:text-brand-primary hover:no-underline py-6 transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-brand-text-secondary pb-6 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
