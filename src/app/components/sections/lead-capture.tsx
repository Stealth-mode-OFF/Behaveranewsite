import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { CheckCircle2, Loader2, ArrowRight, Check, Download } from "lucide-react";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/LanguageContext";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { motion } from "framer-motion";
import { trackLeadSubmitted, trackEbookDownload } from "@/lib/analytics";

type LeadFormData = {
  name?: string;
  email: string;
};

const EBOOKS = [
  {
    file: "/ebooks/lide-odchazeji-z-dobrych-firem.pdf",
    title: { cz: "Lidé odcházejí i z dobrých firem", en: "People Leave Good Companies Too", de: "Mitarbeiter verlassen auch gute Firmen" },
    size: "4.3 MB",
  },
  {
    file: "/ebooks/motivovani-jen-2-z-10.pdf",
    title: { cz: "Opravdu motivovaní jsou jen 2 z 10", en: "Only 2 in 10 Are Truly Motivated", de: "Nur 2 von 10 sind wirklich motiviert" },
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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();

  const copy = {
    cz: {
      title: "Stáhněte si zdarma 2 e-booky",
      titleHighlight: "",
      subtitle: "Praktické průvodce prevencí fluktuace — s checklisty, frameworky a reálnými čísly.",
      benefits: [
        "7 varovných signálů před odchodem",
        "ROI kalkulačka prevence",
        "Checklist pro 1:1 rozhovory",
      ],
      nameLabel: "Jméno",
      namePlaceholder: "Jan Novák",
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Stáhnout e-booky zdarma",
      consent: "Odesláním souhlasíte se zpracováním osobních údajů. Žádný spam.",
      successTitle: "Hotovo! Stahování začalo.",
      successSubtitle: "Pokud se stahování nespustilo, klikněte na tlačítka níže:",
      errorGeneric: "Něco se pokazilo. Zkuste to prosím znovu.",
    },
    en: {
      title: "Download 2 free e-books",
      titleHighlight: "",
      subtitle: "Practical guides to turnover prevention — with checklists, frameworks, and real data.",
      benefits: [
        "7 warning signs before departure",
        "Prevention ROI calculator",
        "1:1 meeting checklist",
      ],
      nameLabel: "Name",
      namePlaceholder: "John Smith",
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      submit: "Download free e-books",
      consent: "By submitting you agree to our privacy policy. No spam.",
      successTitle: "Done! Download started.",
      successSubtitle: "If download didn't start, click buttons below:",
      errorGeneric: "Something went wrong. Please try again.",
    },
    de: {
      title: "Laden Sie 2 kostenlose E-Books herunter",
      titleHighlight: "",
      subtitle: "Praktische Leitfäden zur Fluktuationsprävention — mit Checklisten, Frameworks und echten Zahlen.",
      benefits: [
        "7 Warnsignale vor dem Abgang",
        "ROI-Rechner für Prävention",
        "Checkliste für 1:1-Gespräche",
      ],
      nameLabel: "Name",
      namePlaceholder: "Max Mustermann",
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      submit: "Kostenlose E-Books herunterladen",
      consent: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. Kein Spam.",
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
    submitLead({ email: data.email, name: data.name, source: "ebook" });
    trackLeadSubmitted('ebook');
    
    // Immediately trigger downloads
    setTimeout(() => {
      downloadFile(EBOOKS[0].file, `${EBOOKS[0].title[language] || EBOOKS[0].title.en}.pdf`);
      trackEbookDownload(EBOOKS[0].title.en, 'auto');
    }, 100);
    setTimeout(() => {
      downloadFile(EBOOKS[1].file, `${EBOOKS[1].title[language] || EBOOKS[1].title.en}.pdf`);
      trackEbookDownload(EBOOKS[1].title.en, 'auto');
    }, 600);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <section className="py-20 md:py-28 bg-[#FDFBFF]" id="lead-capture">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-text-primary mb-3 leading-snug">
              {txt.title}
              <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
                {txt.titleHighlight}
              </span>
            </h2>
            <p className="text-[15px] text-brand-text-muted leading-relaxed mb-6">
              {txt.subtitle}
            </p>

            <ul className="space-y-2.5">
              {txt.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-brand-text-secondary">
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
                    <h3 className="text-[16px] font-bold text-brand-text-primary">
                      {txt.successTitle}
                    </h3>
                  </div>
                  <p className="text-[13px] text-brand-text-muted mb-5">{txt.successSubtitle}</p>

                  {/* Ebook download buttons */}
                  <div className="space-y-3">
                    {EBOOKS.map((eb, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { downloadFile(eb.file, `${eb.title[language] || eb.title.en}.pdf`); trackEbookDownload(eb.title.en, 'manual'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 hover:bg-[#FDFBFF] transition-all group text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Download className="w-[18px] h-[18px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-brand-text-primary truncate">
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
                    <p className="text-[13px] text-red-600 bg-red-50 rounded-lg px-3.5 py-2.5">
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
                        {txt.submit}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-brand-text-muted text-center">
                    {txt.consent}
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
