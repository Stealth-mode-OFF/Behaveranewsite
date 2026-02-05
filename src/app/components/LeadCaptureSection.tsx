import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormField } from "./ui/form-field";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "../utils/lead";
import { useLanguage } from "../LanguageContext";
import { validationRules, autocompleteAttributes } from "../utils/validation";

type LeadFormData = {
  name?: string;
  email: string;
};

export function LeadCaptureSection() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();

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
      setError(result.error || t.leadCapture.errorGeneric);
    }
  };

  return (
    <section className="section-spacing bg-white border-t border-brand-border" id="lead-capture">
      <div className="container-default">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-background-muted text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-brand-border">
              {t.leadCapture.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
              {t.leadCapture.title}
            </h2>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              {t.leadCapture.subtitle}
            </p>
          </div>

          <div className="bg-brand-background-secondary border border-brand-border rounded-2xl p-8 shadow-sm">
            {isSuccess ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">{t.leadCapture.successTitle}</h3>
                <p className="text-brand-text-secondary">{t.leadCapture.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  label={t.leadCapture.nameLabel}
                  error={errors.name?.message}
                >
                  <Input
                    type="text"
                    autoComplete={autocompleteAttributes.name}
                    placeholder={t.leadCapture.namePlaceholder}
                    {...register("name")}
                  />
                </FormField>

                <FormField
                  label={t.leadCapture.emailLabel}
                  error={errors.email?.message}
                  helperText="Bez spamu. Pouze hodnotný obsah."
                  required
                >
                  <Input
                    type="email"
                    autoComplete={autocompleteAttributes.email}
                    placeholder={t.leadCapture.emailPlaceholder}
                    {...register("email", validationRules.workEmail)}
                  />
                </FormField>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t.leadCapture.submit}
                </Button>

                <p className="text-xs text-brand-text-muted text-center">
                  {t.leadCapture.consent}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
