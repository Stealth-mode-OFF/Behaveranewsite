import React from "react";
import { ShieldCheck, FileText, Lock } from "lucide-react";
import { getBehaveraItem } from "../content/behaveraContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion";

const privacy = getBehaveraItem("/privacy-policy");
const terms = getBehaveraItem("/terms");

const securityHighlights = [
  "Zpracování osobních údajů probíhá v souladu s GDPR a platnými právními předpisy.",
  "Správcem údajů je Behavera s.r.o., Křižíkova 148/34, Karlín, Praha 8.",
  "Pověřenec pro ochranu osobních údajů: gdpr@behavera.com.",
  "Údaje uchováváme po dobu registrace a následně 6 měsíců, poté je anonymizujeme nebo vymažeme.",
  "Agregované statistiky jsou anonymizované a neobsahují osobní údaje.",
  "Subjekty údajů mají právo na přístup, přenos, opravu, výmaz a odvolání souhlasu."
];

const renderParagraphs = (content?: string) => {
  if (!content) {
    return <p>Obsah připravujeme.</p>;
  }

  return content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => <p key={index}>{line}</p>);
};

export function TrustCenter() {
  return (
    <section className="section-spacing bg-white border-t border-brand-border" id="legal">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-background-muted text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-brand-border">
              <ShieldCheck className="w-4 h-4" />
              Trust Center
            </div>
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4">Bezpečnost práce s daty</h2>
            <p className="text-brand-text-secondary leading-relaxed mb-6">
              Transparentně popisujeme, jak nakládáme s osobními údaji, jaké povinnosti přebíráme a jak chráníme
              důvěrné informace.
            </p>
            <ul className="space-y-3 text-sm text-brand-text-secondary">
              {securityHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-brand-primary mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-2/3">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="privacy" className="border-b border-brand-border">
                <AccordionTrigger className="text-left text-lg font-semibold text-brand-text-primary hover:text-brand-primary hover:no-underline py-6 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    {privacy?.title || "Zásady ochrany osobních údajů"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-brand-text-secondary pb-6 leading-relaxed space-y-4">
                  {renderParagraphs(privacy?.content)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="terms" className="border-b border-brand-border">
                <AccordionTrigger className="text-left text-lg font-semibold text-brand-text-primary hover:text-brand-primary hover:no-underline py-6 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    {terms?.title || "Obchodní a produktové podmínky"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-brand-text-secondary pb-6 leading-relaxed space-y-4">
                  {renderParagraphs(terms?.content)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
