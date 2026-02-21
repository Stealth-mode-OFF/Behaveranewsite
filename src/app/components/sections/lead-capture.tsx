import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

import { Loader2, ArrowRight, Check, Download } from "lucide-react";
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
      title: "Než začnete měřit, ",
      titleHighlight: "pochopte proč lidé odcházejí",
      subtitle: "Stáhněte si 2 e-booky plné dat a konkrétních strategií z českých firem. Zjistěte, co stojí za fluktuací — a jak ji zastavit dřív, než přijdete o klíčové lidi.",
      benefits: [
        "Proč odcházejí i z dobrých firem — a co s tím",
        "Tvrdá čísla: jen 2 z 10 zaměstnanců jsou skutečně motivovaní",
        "Konkrétní kroky, které můžete zavést tento měsíc",
      ],
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Stáhnout e-booky zdarma",
      consent: "Souhlasím se zasíláním tipů a novinek. Odhlásit se můžete kdykoliv.",
      privacy: "Odesláním souhlasíte se zpracováním osobních údajů.",
      successTitle: "Hotovo! Stahování začalo.",
      successSub: "Pokud se stahování nespustilo automaticky:",
      error: "Něco se pokazilo. Zkuste to znovu.",
      dl: "Stáhnout",
    },
    en: {
      title: "Before you start measuring, ",
      titleHighlight: "understand why people leave",
      subtitle: "Download 2 e-books packed with data and proven retention strategies. Learn what really drives turnover — and how to stop it before you lose your best people.",
      benefits: [
        "Why people leave even good companies — and what to do",
        "Hard data: only 2 in 10 employees are truly motivated",
        "Actionable steps you can implement this month",
      ],
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      submit: "Download e-books free",
      consent: "I agree to receive occasional tips and product news. Unsubscribe anytime.",
      privacy: "By submitting you agree to our privacy policy.",
      successTitle: "Done! Download started.",
      successSub: "If it didn't start automatically:",
      error: "Something went wrong. Please try again.",
      dl: "Download",
    },
    de: {
      title: "Bevor Sie messen, ",
      titleHighlight: "verstehen Sie warum Mitarbeiter gehen",
      subtitle: "Laden Sie 2 E-Books voller Daten und bewährter Retentionsstrategien herunter. Erfahren Sie, was Fluktuation wirklich antreibt — und wie Sie sie stoppen, bevor Sie Ihre besten Leute verlieren.",
      benefits: [
        "Warum Mitarbeiter selbst gute Unternehmen verlassen — und was hilft",
        "Harte Zahlen: Nur 2 von 10 Mitarbeitern sind wirklich motiviert",
        "Konkrete Schritte, die Sie noch diesen Monat umsetzen können",
      ],
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      submit: "E-Books kostenlos herunterladen",
      consent: "Ich stimme dem Erhalt von Tipps und Neuigkeiten zu. Abmeldung jederzeit möglich.",
      privacy: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.",
      successTitle: "Fertig! Download gestartet.",
      successSub: "Falls der Download nicht automatisch gestartet ist:",
      error: "Etwas ist schief gelaufen. Bitte erneut versuchen.",
      dl: "Herunterladen",
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
      <div className="container-default max-w-2xl text-center">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {txt.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {txt.titleHighlight}
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
            {txt.subtitle}
          </p>
        </motion.div>

        {/* E-book cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {EBOOKS.map((eb, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm text-left flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-text-primary mb-0.5">{eb.title}</p>
                <p className="text-[12px] text-brand-text-muted">PDF · {eb.size}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form / Success */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-md mx-auto"
        >
          {isSuccess ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border/60">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-brand-text-primary">{txt.successTitle}</h3>
              </div>
              <p className="text-[13px] text-brand-text-muted mb-4">{txt.successSub}</p>
              <div className="space-y-2.5">
                {EBOOKS.map((eb, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { downloadFile(eb.file, `${eb.title}.pdf`); trackEbookDownload(eb.title, 'manual'); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-brand-border hover:border-brand-primary/30 hover:bg-brand-background-secondary transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-text-primary truncate">{eb.title}</p>
                      <p className="text-[11px] text-brand-text-muted">PDF · {eb.size}</p>
                    </div>
                    <span className="text-xs font-medium text-brand-primary shrink-0">{txt.dl}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                  className="h-12 px-6 text-sm font-semibold shrink-0 w-full sm:w-auto"
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
              </div>

              {error && (
                <p className="text-[13px] text-brand-error bg-brand-error/5 rounded-lg px-3 py-2">{txt.error}</p>
              )}

              <label className="flex items-center justify-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
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
