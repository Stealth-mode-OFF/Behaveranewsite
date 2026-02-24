import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

import { Loader2, ArrowRight, Check, Download, BookOpen } from "lucide-react";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/contexts/language-context";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { motion } from "framer-motion";
import { trackLeadSubmitted, trackEbookDownload } from "@/lib/analytics";

type LeadFormData = {
  email: string;
  marketingConsent: boolean;
};

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

export function LeadCaptureSection() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    defaultValues: { marketingConsent: false }
  });

  const copy = {
    cz: {
      badge: "2 e-booky zdarma",
      title: "Data a strategie ",
      titleHighlight: "proti fluktuaci",
      subtitle: "Proč lidé odcházejí i z dobrých firem a co s tím. Konkrétní čísla a kroky z českého trhu.",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Stáhnout zdarma",
      consent: "Souhlasím se zasíláním tipů a novinek. Odhlásit se můžete kdykoliv.",
      privacy: "Odesláním souhlasíte se zpracováním osobních údajů.",
      successTitle: "E-booky se stahují",
      successSub: "Nestáhlo se? Klikněte na název:",
      error: "Něco se pokazilo. Zkuste to znovu.",
      dl: "Stáhnout",
    },
    en: {
      badge: "2 free e-books",
      title: "Data & strategies ",
      titleHighlight: "to reduce turnover",
      subtitle: "Why people leave good companies and what to do about it. Real numbers and actionable steps.",
      emailPlaceholder: "john.smith@company.com",
      submit: "Download free",
      consent: "I agree to receive occasional tips and product news. Unsubscribe anytime.",
      privacy: "By submitting you agree to our privacy policy.",
      successTitle: "Your e-books are downloading",
      successSub: "Didn't start? Click the title:",
      error: "Something went wrong. Please try again.",
      dl: "Download",
    },
    de: {
      badge: "2 kostenlose E-Books",
      title: "Daten & Strategien ",
      titleHighlight: "gegen Fluktuation",
      subtitle: "Warum Mitarbeiter gute Unternehmen verlassen und was dagegen hilft. Konkrete Zahlen und Maßnahmen.",
      emailPlaceholder: "max.mustermann@firma.de",
      submit: "Kostenlos herunterladen",
      consent: "Ich stimme dem Erhalt von Tipps und Neuigkeiten zu. Abmeldung jederzeit möglich.",
      privacy: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.",
      successTitle: "Die E-Books werden heruntergeladen",
      successSub: "Nicht gestartet? Klicken Sie auf den Titel:",
      error: "Etwas ist schief gelaufen. Bitte erneut versuchen.",
      dl: "Download",
    },
  };

  const txt = copy[language] || copy.en;

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

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
    <section className="section-spacing bg-brand-background-secondary" id="lead-capture">
      <div className="container-default max-w-xl text-center">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
            {txt.badge}
          </div>

          <h2 className="text-h2 text-brand-text-primary mb-3">
            {txt.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {txt.titleHighlight}
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary leading-relaxed mb-8 max-w-md mx-auto">
            {txt.subtitle}
          </p>
        </motion.div>

        {/* Single card with form or success */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-border/60 max-w-md mx-auto"
        >
          {isSuccess ? (
            <div>
              <div className="w-10 h-10 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <p className="text-base font-bold text-brand-text-primary mb-1">{txt.successTitle}</p>
              <p className="text-[13px] text-brand-text-muted mb-5">{txt.successSub}</p>
              <div className="space-y-2">
                {EBOOKS.map((eb, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { downloadFile(eb.file, `${eb.title}.pdf`); trackEbookDownload(eb.title, 'manual'); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-brand-background-secondary hover:bg-brand-primary/5 border border-transparent hover:border-brand-primary/20 transition-all group text-left cursor-pointer"
                  >
                    <span className="text-sm font-medium text-brand-text-primary group-hover:text-brand-primary transition-colors">{eb.title}</span>
                    <Download className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Ebook names as subtle list */}
              <div className="flex flex-col gap-1.5 mb-2">
                {EBOOKS.map((eb, i) => (
                  <div key={i} className="flex items-center gap-2 text-left">
                    <Download className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span className="text-[13px] text-brand-text-secondary">{eb.title}</span>
                    <span className="text-[11px] text-brand-text-muted">({eb.size})</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0">
                  <Input
                    type="email"
                    autoComplete={autocompleteAttributes.email}
                    placeholder={txt.emailPlaceholder}
                    className="h-12 w-full"
                    {...register("email", validationRules.workEmail)}
                  />
                  {errors.email?.message && (
                    <p className="text-[12px] text-brand-error mt-1 text-left">{errors.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="shrink-0 w-full sm:w-auto"
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
              </div>

              {error && (
                <p className="text-[13px] text-brand-error bg-brand-error/5 rounded-lg px-3 py-2">{txt.error}</p>
              )}

              <label className="flex items-start justify-center gap-2.5 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer shrink-0"
                  {...register("marketingConsent")}
                />
                <span className="text-[11px] text-brand-text-muted leading-relaxed group-hover:text-brand-text-secondary transition-colors">
                  {txt.consent}
                </span>
              </label>

              <p className="text-[11px] text-brand-text-muted">{txt.privacy}</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
