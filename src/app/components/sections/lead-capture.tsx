import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { CheckCircle2, Loader2, ArrowRight, Check } from "lucide-react";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/LanguageContext";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { motion } from "framer-motion";

type LeadFormData = {
  name?: string;
  email: string;
};

export function LeadCaptureSection() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();

  const copy = {
    cz: {
      title: "Vyzkoušejte demo zdarma",
      subtitle: "Získejte okamžitý přístup k demo verzi Echo Pulse. Žádná instalace, žádné závazky.",
      benefits: [
        "Živá data a interaktivní dashboardy",
        "Vyzkoušejte všechny funkce",
        "Přístup ihned po registraci",
      ],
      nameLabel: "Jméno",
      namePlaceholder: "Jan Novák",
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Získat demo přístup",
      consent: "Odesláním souhlasíte se zpracováním osobních údajů. Žádný spam.",
      successTitle: "Přístup aktivován!",
      errorGeneric: "Něco se pokazilo. Zkuste to prosím znovu.",
      downloadCta: "Stáhnout PDF",
    },
    en: {
      title: "Try the demo for free",
      subtitle: "Get instant access to the Echo Pulse demo. No installation, no commitment.",
      benefits: [
        "Live data and interactive dashboards",
        "Try all features",
        "Access immediately after registration",
      ],
      nameLabel: "Name",
      namePlaceholder: "John Smith",
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      submit: "Get demo access",
      consent: "By submitting you agree to our privacy policy. No spam.",
      successTitle: "Access activated!",
      errorGeneric: "Something went wrong. Please try again.",
      downloadCta: "Download PDF",
    },
    de: {
      title: "Testen Sie die Demo kostenlos",
      subtitle: "Erhalten Sie sofortigen Zugang zur Echo Pulse Demo. Keine Installation, keine Verpflichtung.",
      benefits: [
        "Live-Daten und interaktive Dashboards",
        "Alle Funktionen ausprobieren",
        "Zugang sofort nach der Registrierung",
      ],
      nameLabel: "Name",
      namePlaceholder: "Max Mustermann",
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      submit: "Demo-Zugang erhalten",
      consent: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. Kein Spam.",
      successTitle: "Zugang aktiviert!",
      errorGeneric: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
      downloadCta: "PDF herunterladen",
    },
  };

  const txt = copy[language] || copy.en;

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);
    const result = await submitLead({ email: data.email, name: data.name, source: "ebook" });
    setIsSubmitting(false);
    if (result.ok) {
      setIsSuccess(true);
      reset();
    } else {
      setError(result.error || txt.errorGeneric);
    }
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
                /* ─── Success: Demo access ─── */
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[16px] font-bold text-brand-text-primary">
                      {txt.successTitle}
                    </h3>
                  </div>

                  {/* Login credentials */}
                  <div className="bg-[#FDFBFF] border border-brand-border rounded-xl p-5 mb-5 space-y-3">
                    <div>
                      <p className="text-[12px] text-brand-text-muted uppercase tracking-wide mb-1">Login</p>
                      <p className="text-[15px] font-mono font-medium text-brand-text-primary select-all">pulsedemo@behavera.com</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-brand-text-muted uppercase tracking-wide mb-1">{language === "cz" ? "Heslo" : language === "de" ? "Passwort" : "Password"}</p>
                      <p className="text-[15px] font-mono font-medium text-brand-text-primary select-all">showdemo</p>
                    </div>
                  </div>

                  {/* CTA button */}
                  <a
                    href="https://app.behavera.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-brand-primary text-white font-semibold text-[15px] hover:bg-brand-primary-hover transition-colors"
                  >
                    {language === "cz" ? "Otevřít demo aplikaci" : language === "de" ? "Demo-App öffnen" : "Open demo app"}
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
