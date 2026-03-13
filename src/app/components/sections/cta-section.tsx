import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useModal } from "@/app/contexts/modal-context";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowRight, Sparkles, Check, BookOpen, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { submitLead } from "@/app/utils/lead";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { trackLeadSubmitted, trackEbookDownload } from "@/lib/analytics";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * CTA Section - Full-width Dark Premium Design
 * 
 * Features:
 * - Full viewport height on desktop
 * - Animated gradient background
 * - Large centered headline
 * - Trust indicators inline
 * - Premium "final word" feel
 */
export function CtaSection() {
  const { openBooking } = useModal();
  const { language } = useLanguage();

  const copy = {
    cz: {
      badge: "Připraveni?",
      headline: "Spusťte Behavera.",
      headlineHighlight: "A přestaňte hádat, co se ve firmě děje.",
      subheadline: "Buď si to bezpečně otestujete na jednom týmu, nebo to rovnou spustíte ve firmě.",
      primaryCta: "Objednat pro celou firmu",
      primaryMicro: "Karta nebo faktura. Bez smlouvy.",
      secondaryCta: "Otestovat 1 tým zdarma",
      secondaryMicro: "Bez závazku. Výsledky jsou vidět okamžitě.",
      demoLink: "Chci si to nejdřív projít na demu",
      trust: ["Bez kreditky", "GDPR ready", "Výsledky okamžitě"],
    },
    en: {
      badge: "Ready?",
      headline: "Launch Behavera.",
      headlineHighlight: "And stop guessing what's happening in your company.",
      subheadline: "Either safely test it with one team, or launch it across your company right away.",
      primaryCta: "Order for the whole company",
      primaryMicro: "Card or invoice. No contract.",
      secondaryCta: "Test 1 team for free",
      secondaryMicro: "No commitment. Results are instant.",
      demoLink: "I'd like to see a demo first",
      trust: ["No credit card", "GDPR ready", "Instant results"],
    },
    de: {
      badge: "Bereit?",
      headline: "Starten Sie Behavera.",
      headlineHighlight: "Und hören Sie auf zu raten, was im Unternehmen passiert.",
      subheadline: "Testen Sie es sicher mit einem Team oder starten Sie direkt im ganzen Unternehmen.",
      primaryCta: "Für das ganze Unternehmen bestellen",
      primaryMicro: "Karte oder Rechnung. Ohne Vertrag.",
      secondaryCta: "1 Team kostenlos testen",
      secondaryMicro: "Unverbindlich. Ergebnisse sofort sichtbar.",
      demoLink: "Ich möchte zuerst eine Demo sehen",
      trust: ["Keine Kreditkarte", "DSGVO-konform", "Sofortige Ergebnisse"],
    },
  };

  const c = copy[language] || copy.en;

  return (
    <section id="lead-capture" className="section-spacing relative min-h-[60vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(180deg, #1E1245 0%, #110828 50%, #0A0418 100%)' }}>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large glow orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: MOTION_EASE }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: MOTION_EASE, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-accent/20 rounded-full blur-[150px]"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-default relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: MOTION_EASE }}
            className="section-badge section-badge-dark mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span>{c.badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.3, ease: MOTION_EASE }}
            className="text-h2 text-white mb-6"
          >
            {c.headline}
            <br />
            <span className="text-gradient">
              {c.headlineHighlight}
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3, ease: MOTION_EASE }}
            className="text-body md:text-body-lg text-white/70 max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed"
          >
            {c.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.3, ease: MOTION_EASE }}
            className="flex flex-col items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {/* Two buttons row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary CTA — Objednat pro celou firmu (bílé) */}
              <Button asChild size="default" variant="inverse" className="w-full sm:w-auto shadow-2xl shadow-white/10 hover:shadow-white/20">
                <a
                  href="https://www.behavera.com/start"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.primaryCta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>

              {/* Secondary CTA — Otestovat 1 tým zdarma (fialové) */}
              <Button asChild size="default" variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white">
                <a
                  href="https://app.behavera.com/echo-pulse/try"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.secondaryCta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Microcopy row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <span className="text-xs text-white/50">{c.primaryMicro}</span>
              <span className="text-xs text-white/50">{c.secondaryMicro}</span>
            </div>

            {/* Demo link */}
            <button
              type="button"
              onClick={() => openBooking('cta_section')}
              className="text-body-sm text-white/60 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60 transition-colors duration-200 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2"
            >
              {c.demoLink}
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: MOTION_EASE }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/60"
          >
            {c.trust.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-brand-accent" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Lead Capture — ebook download */}
          <EbookCapture language={language} />

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}

/* ─── Ebook Lead Capture ─── */
const EBOOKS = [
  { file: "/ebooks/lide-odchazeji-z-dobrych-firem.pdf", title: "Lidé odcházejí z dobrých firem", size: "4.3 MB" },
  { file: "/ebooks/motivovani-jen-2-z-10.pdf", title: "Motivováni jen 2 z 10", size: "4.1 MB" },
];

const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

type LeadFormData = { email: string; marketingConsent: boolean };

function EbookCapture({ language }: { language: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    defaultValues: { marketingConsent: false },
  });

  const copy = {
    cz: {
      notReady: "Ještě nejste připraveni?",
      badge: "2 e-booky zdarma",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Stáhnout",
      consent: "Souhlasím se zasíláním tipů a novinek.",
      successTitle: "E-booky se stahují!",
      dl: "Stáhnout",
    },
    en: {
      notReady: "Not ready yet?",
      badge: "2 free e-books",
      emailPlaceholder: "john@company.com",
      submit: "Download",
      consent: "I agree to receive tips and news.",
      successTitle: "Your e-books are downloading!",
      dl: "Download",
    },
    de: {
      notReady: "Noch nicht bereit?",
      badge: "2 kostenlose E-Books",
      emailPlaceholder: "max@firma.de",
      submit: "Herunterladen",
      consent: "Ich stimme dem Erhalt von Tipps zu.",
      successTitle: "Die E-Books werden heruntergeladen!",
      dl: "Download",
    },
  };

  const txt = copy[language as keyof typeof copy] || copy.en;

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    submitLead({ email: data.email, source: 'ebook', marketingConsent: data.marketingConsent });
    trackLeadSubmitted('ebook');
    EBOOKS.forEach((eb, i) => {
      setTimeout(() => {
        downloadFile(eb.file, `${eb.title}.pdf`);
        trackEbookDownload(eb.title, 'auto');
      }, 100 + i * 500);
    });
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25, duration: 0.3, ease: MOTION_EASE }}
      className="mt-12 sm:mt-16 pt-10 border-t border-white/10"
    >
      <p className="text-body-sm text-white/50 mb-3">{txt.notReady}</p>
      <div className="section-badge section-badge-dark mb-6">
        <BookOpen className="w-3.5 h-3.5 text-brand-accent" />
        <span>{txt.badge}</span>
      </div>

      {isSuccess ? (
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 text-brand-accent mb-3">
            <Check className="w-4 h-4" />
            <span className="text-sm font-semibold">{txt.successTitle}</span>
          </div>
          <div className="space-y-2">
            {EBOOKS.map((eb, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { downloadFile(eb.file, `${eb.title}.pdf`); trackEbookDownload(eb.title, 'manual'); }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-left cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2"
              >
                <span className="text-body-sm text-white/80">{eb.title}</span>
                <Download className="w-3.5 h-3.5 text-white/50 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <Input
                type="email"
                autoComplete={autocompleteAttributes.email}
                placeholder={txt.emailPlaceholder}
                className="h-11 w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-brand-accent"
                {...register("email", validationRules.workEmail)}
              />
              {errors.email?.message && (
                <p className="text-badge text-brand-error mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" size="sm" disabled={isSubmitting} className="shrink-0 min-h-[44px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{txt.submit} <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </Button>
          </div>
          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-white/30 text-brand-accent focus:ring-brand-accent/30 cursor-pointer bg-transparent"
              {...register("marketingConsent")}
            />
            <span className="text-[10px] text-white/40">{txt.consent}</span>
          </label>
        </form>
      )}
    </motion.div>
  );
}
