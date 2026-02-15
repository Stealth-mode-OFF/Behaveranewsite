import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { CheckCircle2, Loader2, ArrowRight, Check, Download, BookOpen } from "lucide-react";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/LanguageContext";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { motion } from "framer-motion";
import { trackLeadSubmitted, trackEbookDownload } from "@/lib/analytics";

type LeadFormData = {
  name?: string;
  email: string;
  marketingConsent: boolean;
};

const EBOOKS = [
  {
    file: "/ebooks/lide-odchazeji-z-dobrych-firem.pdf",
    title: { cz: "Lidé odcházejí i z dobrých firem", en: "People Leave Good Companies Too", de: "Mitarbeiter verlassen auch gute Firmen" },
    desc: {
      cz: "Proč odcházejí i spokojení lidé a jak tomu předejít.",
      en: "Why even satisfied employees leave and how to prevent it.",
      de: "Warum auch zufriedene Mitarbeiter gehen und wie man es verhindert.",
    },
    size: "4.3 MB",
  },
  {
    file: "/ebooks/motivovani-jen-2-z-10.pdf",
    title: { cz: "Opravdu motivovaní jsou jen 2 z 10", en: "Only 2 in 10 Are Truly Motivated", de: "Nur 2 von 10 sind wirklich motiviert" },
    desc: {
      cz: "Co stojí za nízkou angažovaností a jak ji měřit.",
      en: "What's behind low engagement and how to measure it.",
      de: "Was hinter geringem Engagement steckt und wie man es misst.",
    },
    size: "4.1 MB",
  },
];

// Trigger file download
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function LeadCaptureSection() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEbooks, setSelectedEbooks] = useState<Set<number>>(new Set([0, 1]));
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    defaultValues: { marketingConsent: false }
  });

  const toggleEbook = (index: number) => {
    setSelectedEbooks(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        // Don't allow deselecting the last one
        if (next.size > 1) next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const copy = {
    cz: {
      title: "Stáhněte si zdarma e-booky",
      titleHighlight: "",
      subtitle: "Praktické průvodce prevencí fluktuace — s checklisty, frameworky a reálnými čísly.",
      selectLabel: "Vyberte si e-booky ke stažení:",
      benefits: [
        "7 varovných signálů před odchodem",
        "ROI kalkulačka prevence",
        "Checklist pro 1:1 rozhovory",
      ],
      nameLabel: "Jméno",
      namePlaceholder: "Jan Novák",
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      submitOne: "Stáhnout e-book zdarma",
      submitBoth: "Stáhnout oba e-booky zdarma",
      consent: "Souhlasím se zasíláním občasných tipů a novinek. Odhlásit se můžete kdykoliv.",
      consentPrivacy: "Odesláním souhlasíte se zpracováním osobních údajů.",
      successTitle: "Hotovo! Stahování začalo.",
      successSubtitle: "Pokud se stahování nespustilo, klikněte na tlačítka níže:",
      errorGeneric: "Něco se pokazilo. Zkuste to prosím znovu.",
    },
    en: {
      title: "Download free e-books",
      titleHighlight: "",
      subtitle: "Practical guides to turnover prevention — with checklists, frameworks, and real data.",
      selectLabel: "Choose e-books to download:",
      benefits: [
        "7 warning signs before departure",
        "Prevention ROI calculator",
        "1:1 meeting checklist",
      ],
      nameLabel: "Name",
      namePlaceholder: "John Smith",
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      submitOne: "Download free e-book",
      submitBoth: "Download both e-books free",
      consent: "I agree to receive occasional tips and product news. You can unsubscribe anytime.",
      consentPrivacy: "By submitting you agree to our privacy policy.",
      successTitle: "Done! Download started.",
      successSubtitle: "If download didn't start, click buttons below:",
      errorGeneric: "Something went wrong. Please try again.",
    },
    de: {
      title: "Kostenlose E-Books herunterladen",
      titleHighlight: "",
      subtitle: "Praktische Leitfäden zur Fluktuationsprävention — mit Checklisten, Frameworks und echten Zahlen.",
      selectLabel: "Wählen Sie E-Books zum Herunterladen:",
      benefits: [
        "7 Warnsignale vor dem Abgang",
        "ROI-Rechner für Prävention",
        "Checkliste für 1:1-Gespräche",
      ],
      nameLabel: "Name",
      namePlaceholder: "Max Mustermann",
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      submitOne: "Kostenloses E-Book herunterladen",
      submitBoth: "Beide E-Books kostenlos herunterladen",
      consent: "Ich stimme dem gelegentlichen Erhalt von Tipps und Produktneuigkeiten zu. Abmeldung jederzeit möglich.",
      consentPrivacy: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.",
      successTitle: "Fertig! Download gestartet.",
      successSubtitle: "Falls der Download nicht gestartet ist, klicken Sie auf die Schaltflächen unten:",
      errorGeneric: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    },
  };

  const txt = copy[language] || copy.en;

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    // Submit lead (don't block on it)
    const ebookTitles = Array.from(selectedEbooks).map(i => EBOOKS[i].title.en).join(', ');
    submitLead({ email: data.email, name: data.name, source: `ebook:${ebookTitles}`, marketingConsent: data.marketingConsent });
    trackLeadSubmitted('ebook');
    
    // Download only selected ebooks
    const selected = Array.from(selectedEbooks).sort();
    selected.forEach((idx, i) => {
      setTimeout(() => {
        downloadFile(EBOOKS[idx].file, `${EBOOKS[idx].title[language] || EBOOKS[idx].title.en}.pdf`);
        trackEbookDownload(EBOOKS[idx].title.en, 'auto');
      }, 100 + i * 500);
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <section className="section-spacing bg-brand-background-secondary" id="lead-capture">
      <div className="container-default max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
              {txt.title}
              <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
                {txt.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-brand-text-body leading-relaxed mb-6">
              {txt.subtitle}
            </p>

            <ul className="space-y-2.5">
              {txt.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-brand-text-secondary">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-success shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Form or Downloads */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-lg shadow-black/[0.03] border border-brand-border/60">
              {isSuccess ? (
                /* ─── Success: Ebook downloads ─── */
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-brand-text-primary">
                      {txt.successTitle}
                    </h3>
                  </div>
                  <p className="text-[13px] text-brand-text-muted mb-5">{txt.successSubtitle}</p>

                  {/* Ebook download buttons — only selected */}
                  <div className="space-y-3">
                    {EBOOKS.map((eb, i) => selectedEbooks.has(i) && (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { downloadFile(eb.file, `${eb.title[language] || eb.title.en}.pdf`); trackEbookDownload(eb.title.en, 'manual'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 hover:bg-brand-background-secondary transition-all group text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Download className="w-[18px] h-[18px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-text-primary truncate">
                            {eb.title[language] || eb.title.en}
                          </p>
                          <p className="text-[12px] text-brand-text-muted">
                            PDF · {eb.size}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ─── Form ─── */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {/* ─── Ebook selection cards ─── */}
                  <div>
                    <p className="text-[13px] font-semibold text-brand-text-primary mb-2.5">{txt.selectLabel}</p>
                    <div className="space-y-2">
                      {EBOOKS.map((eb, i) => {
                        const isSelected = selectedEbooks.has(i);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleEbook(i)}
                            className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? "border-brand-primary/40 bg-brand-background-secondary ring-1 ring-brand-primary/10"
                                : "border-brand-border hover:border-brand-border-strong bg-white"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "border-brand-border bg-white"
                            }`}>
                              {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-brand-primary" : "text-brand-text-muted"}`} />
                                <p className={`text-[13px] font-semibold leading-tight ${isSelected ? "text-brand-text-primary" : "text-brand-text-secondary"}`}>
                                  {eb.title[language] || eb.title.en}
                                </p>
                              </div>
                              <p className="text-[11px] text-brand-text-muted mt-1 leading-relaxed">
                                {eb.desc[language] || eb.desc.en}
                              </p>
                              <p className="text-[11px] text-brand-text-muted/70 mt-0.5">
                                PDF · {eb.size}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <FormField label={txt.nameLabel} error={errors.name?.message}>
                    <Input
                      type="text"
                      autoComplete={autocompleteAttributes.name}
                      placeholder={txt.namePlaceholder}
                      className="h-11"
                      {...register("name")}
                    />
                  </FormField>

                  <FormField label={txt.emailLabel} error={errors.email?.message} required>
                    <Input
                      type="email"
                      autoComplete={autocompleteAttributes.email}
                      placeholder={txt.emailPlaceholder}
                      className="h-11"
                      {...register("email", validationRules.workEmail)}
                    />
                  </FormField>

                  {error && (
                    <p className="text-[13px] text-brand-error bg-brand-error/5 rounded-lg px-3.5 py-2.5">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-12 text-[15px] font-semibold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {selectedEbooks.size === 2 ? txt.submitBoth : txt.submitOne}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>

                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
                      {...register("marketingConsent")}
                    />
                    <span className="text-[12px] text-brand-text-muted leading-relaxed group-hover:text-brand-text-secondary transition-colors">
                      {txt.consent}
                    </span>
                  </label>

                  <p className="text-xs text-brand-text-muted text-center">
                    {txt.consentPrivacy}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
