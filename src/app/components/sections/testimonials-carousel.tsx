import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

/**
 * Testimonials Carousel — Fathom-inspired G2-style short quotes
 * 
 * Features:
 * - Auto-rotating carousel of short client quotes
 * - Star rating, name, title, company
 * - Clean, scannable format (not full case studies)
 * - Manual navigation arrows
 */

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
};

export function TestimonialsCarousel() {
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Record<string, Testimonial[]> = {
    cz: [
      {
        quote: "Trvalo to jen chvíli — a těch pár odpovědí přineslo přesně to, co jsme potřebovali. Žádné složité reporty, žádné nekonečné tabulky — jen jasné, použitelné insighty.",
        name: "Dominik Hegedus",
        role: "CEO",
        company: "Expando",
        rating: 5,
      },
      {
        quote: "Za 3 minuty jsme ověřili naše firemní hodnoty u 60 % zaměstnanců. Výstup byl okamžitý a přehledný — přesně pro management.",
        name: "HR tým",
        role: "HR Team",
        company: "Prusa Research",
        rating: 5,
      },
      {
        quote: "Nový CEO díky Echo Pulse odhalil, že problém není v penězích, ale v podmínkách. Spokojenost vyskočila z 4.4 na 9 z 10.",
        name: "Karel Poplstein",
        role: "CEO",
        company: "Valxon",
        rating: 5,
      },
      {
        quote: "Konečně máme data místo dohadů. Manažeři vědí, co řešit, a lidé cítí, že je někdo slyší. Fluktuace nám klesla o třetinu.",
        name: "Hana Novotná",
        role: "HR Director",
        company: "Tech firma",
        rating: 5,
      },
    ],
    en: [
      {
        quote: "It took just a moment — and those few answers delivered exactly what we needed. No complicated reports, no endless spreadsheets — just clear, actionable insights.",
        name: "Dominik Hegedus",
        role: "CEO",
        company: "Expando",
        rating: 5,
      },
      {
        quote: "In just 3 minutes per employee, we verified our core values across 60% of staff — including production teams. Output was instant and clear.",
        name: "HR Team",
        role: "HR",
        company: "Prusa Research",
        rating: 5,
      },
      {
        quote: "New CEO used Echo Pulse to discover dissatisfaction wasn't about pay — it was about conditions. Satisfaction jumped from 4.4/10 to 9/10.",
        name: "Karel Poplstein",
        role: "CEO",
        company: "Valxon",
        rating: 5,
      },
      {
        quote: "We finally have data instead of guesswork. Managers know what to fix, people feel heard. Our attrition dropped by a third.",
        name: "Hana Novotná",
        role: "HR Director",
        company: "Tech company",
        rating: 5,
      },
    ],
    de: [
      {
        quote: "Es dauerte nur einen Moment — und diese wenigen Antworten lieferten genau das, was wir brauchten. Keine komplizierten Berichte, keine endlosen Tabellen.",
        name: "Dominik Hegedus",
        role: "CEO",
        company: "Expando",
        rating: 5,
      },
      {
        quote: "In nur 3 Minuten pro Mitarbeiter haben wir unsere Kernwerte bei 60 % der Belegschaft verifiziert — einschließlich der Produktion.",
        name: "HR Team",
        role: "HR",
        company: "Prusa Research",
        rating: 5,
      },
      {
        quote: "Der neue CEO entdeckte mit Echo Pulse, dass die Unzufriedenheit nicht am Gehalt lag — sondern an den Bedingungen. Die Zufriedenheit stieg von 4,4 auf 9 von 10.",
        name: "Karel Poplstein",
        role: "CEO",
        company: "Valxon",
        rating: 5,
      },
      {
        quote: "Endlich haben wir Daten statt Vermutungen. Manager wissen, was zu tun ist, und die Mitarbeiter fühlen sich gehört.",
        name: "Hana Novotná",
        role: "HR-Direktorin",
        company: "Tech-Unternehmen",
        rating: 5,
      },
    ],
  };

  const items = testimonials[language] || testimonials.en;

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const texts = {
    cz: { badge: "Co říkají klienti", title: "Ověřeno reálnými", titleHighlight: " firmami" },
    en: { badge: "What clients say", title: "Verified by real", titleHighlight: " companies" },
    de: { badge: "Was Kunden sagen", title: "Bestätigt von echten", titleHighlight: " Unternehmen" },
  };
  const t = texts[language] || texts.en;

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container-default max-w-[900px] mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <Quote className="w-3.5 h-3.5" />
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text-primary tracking-tight">
            {t.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="min-h-[220px] md:min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-2xl mx-auto px-4"
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: items[active].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-brand-text-primary leading-relaxed font-medium mb-8 relative">
                  <span className="text-brand-accent/30 text-4xl font-serif absolute -top-4 -left-2">"</span>
                  {items[active].quote}
                  <span className="text-brand-accent/30 text-4xl font-serif">"</span>
                </blockquote>

                {/* Attribution */}
                <div>
                  <div className="font-bold text-brand-text-primary">{items[active].name}</div>
                  <div className="text-sm text-brand-text-muted">
                    {items[active].role} · {items[active].company}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-brand-text-muted" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === active
                      ? "bg-brand-primary w-6"
                      : "bg-brand-border hover:bg-brand-text-muted"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-brand-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
