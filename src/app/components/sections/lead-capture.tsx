import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { CheckCircle2, Loader2, Mail, ArrowRight, BookOpen, Shield, Download, FileText, PartyPopper } from "lucide-react";
import { submitLead } from "@/app/utils/lead";
import { useLanguage } from "@/app/LanguageContext";
import { validationRules, autocompleteAttributes } from "@/app/utils/validation";
import { motion } from "framer-motion";

type LeadFormData = {
  name?: string;
  email: string;
};

export function LeadCaptureSection() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();

  const copy = {
    cz: {
      badge: "Zdarma ke stažení",
      title: "Průvodce prevencí fluktuace",
      subtitle: "Praktický e-book s checklisty a frameworky. Co měřit, kdy reagovat, jak předejít odchodům klíčových lidí.",
      benefits: [
        "7 varovných signálů před odchodem",
        "ROI kalkulačka prevence",
        "Checklist pro 1:1 rozhovory"
      ],
      nameLabel: "Jméno",
      namePlaceholder: "Jan Novák",
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      submit: "Získat e-book zdarma",
      consent: "Odesláním souhlasíte se zpracováním osobních údajů.",
      noSpam: "Bez spamu. Pouze hodnotný obsah.",
      successTitle: "Váš e-book je připraven!",
      successMessage: "Klikněte na tlačítko níže a stáhněte si PDF.",
      downloadButton: "Stáhnout PDF",
      downloadNote: "Přímé stažení • PDF • 2.4 MB",
      errorGeneric: "Něco se pokazilo. Zkuste to prosím znovu."
    },
    en: {
      badge: "Free Download",
      title: "Turnover Prevention Guide",
      subtitle: "Practical e-book with checklists and frameworks. What to measure, when to act, how to prevent key people from leaving.",
      benefits: [
        "7 warning signs before departure",
        "Prevention ROI calculator",
        "1:1 meeting checklist"
      ],
      nameLabel: "Name",
      namePlaceholder: "John Smith",
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      submit: "Get free e-book",
      consent: "By submitting you agree to our privacy policy.",
      noSpam: "No spam. Only valuable content.",
      successTitle: "Your e-book is ready!",
      successMessage: "Click the button below to download your PDF.",
      downloadButton: "Download PDF",
      downloadNote: "Direct download • PDF • 2.4 MB",
      errorGeneric: "Something went wrong. Please try again."
    },
    de: {
      badge: "Kostenloser Download",
      title: "Leitfaden zur Fluktuationsprävention",
      subtitle: "Praktisches E-Book mit Checklisten und Frameworks. Was messen, wann reagieren, wie Abgänge verhindern.",
      benefits: [
        "7 Warnsignale vor dem Abgang",
        "ROI-Rechner für Prävention",
        "Checkliste für 1:1-Gespräche"
      ],
      nameLabel: "Name",
      namePlaceholder: "Max Mustermann",
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      submit: "Kostenloses E-Book erhalten",
      consent: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.",
      noSpam: "Kein Spam. Nur wertvolle Inhalte.",
      successTitle: "Ihr E-Book ist bereit!",
      successMessage: "Klicken Sie auf die Schaltfläche unten, um Ihr PDF herunterzuladen.",
      downloadButton: "PDF herunterladen",
      downloadNote: "Direkter Download • PDF • 2.4 MB",
      errorGeneric: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
    }
  };

  const txt = copy[language] || copy.en;

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    const result = await submitLead({
      email: data.email,
      name: data.name,
      source: "ebook"
    });

    setIsSubmitting(false);

    if (result.ok) {
      setIsSuccess(true);
      reset();
    } else {
      setError(result.error || txt.errorGeneric);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-brand-background-secondary/50 to-white relative overflow-hidden" id="lead-capture">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-brand-primary/20">
              <BookOpen className="w-4 h-4" />
              {txt.badge}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-text-primary mb-5 leading-tight">
              {txt.title}
            </h2>
            
            <p className="text-lg text-brand-text-secondary leading-relaxed mb-8">
              {txt.subtitle}
            </p>
            
            {/* Benefits */}
            <ul className="space-y-3">
              {txt.benefits.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                  </div>
                  <span className="text-brand-text-primary font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-primary/5 border border-brand-border/50">
              {isSuccess ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto mb-6"
                  >
                    <PartyPopper className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-brand-text-primary mb-2">{txt.successTitle}</h3>
                  <p className="text-brand-text-secondary mb-6">{txt.successMessage}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <a
                      href="/ebooks/lide-odchazeji-z-dobrych-firem.pdf"
                      download
                      className="inline-flex items-center justify-center gap-3 w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-primary/20 group"
                    >
                      <Download className="w-5 h-5 group-hover:animate-bounce" />
                      Stáhnout e-book: Lidé odcházejí i z dobrých firem
                    </a>
                    <a
                      href="/ebooks/motivovani-jen-2-z-10.pdf"
                      download
                      className="inline-flex items-center justify-center gap-3 w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-primary/20 group"
                    >
                      <Download className="w-5 h-5 group-hover:animate-bounce" />
                      Stáhnout e-book: Opravdu motivovaní jsou jen 2 z 10
                    </a>
                  </div>
                  <p className="text-xs text-brand-text-muted mt-2 flex items-center justify-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    PDF • Okamžité stažení • 4 MB
                  </p>
                </div>
              ) : (
                <>
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-7 h-7 text-brand-primary" />
                    </div>
                    <p className="text-sm text-brand-text-muted flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      {txt.noSpam}
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label={txt.nameLabel}
                        error={errors.name?.message}
                      >
                        <Input
                          type="text"
                          autoComplete={autocompleteAttributes.name}
                          placeholder={txt.namePlaceholder}
                          className="h-12 rounded-xl"
                          {...register("name")}
                        />
                      </FormField>
                      <FormField
                        label={txt.emailLabel}
                        error={errors.email?.message}
                        required
                      >
                        <Input
                          type="email"
                          autoComplete={autocompleteAttributes.email}
                          placeholder={txt.emailPlaceholder}
                          className="h-12 rounded-xl"
                          {...register("email", validationRules.workEmail)}
                        />
                      </FormField>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full h-14 text-base font-semibold rounded-xl group"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {txt.submit}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-brand-text-muted text-center pt-2">
                      {txt.consent}
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
