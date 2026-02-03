import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useLanguage } from "../LanguageContext";

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-b border-slate-200" id="faq">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
              {t.faq.title}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
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
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200">
                  <AccordionTrigger className="text-left text-lg font-medium text-slate-900 hover:text-brand-primary hover:no-underline py-6 transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-slate-600 pb-6 leading-relaxed">
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
