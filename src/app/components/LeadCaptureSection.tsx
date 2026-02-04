import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "../utils/lead";
import { useLanguage } from "../LanguageContext";

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
    <section className="section-spacing bg-white border-t border-slate-200" id="lead-capture">
      <div className="container-default">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6 border border-slate-200">
              {t.leadCapture.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              {t.leadCapture.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t.leadCapture.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            {isSuccess ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.leadCapture.successTitle}</h3>
                <p className="text-slate-600">{t.leadCapture.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="lead-name">
                    {t.leadCapture.nameLabel}
                  </label>
                  <Input
                    id="lead-name"
                    {...register("name")}
                    className="h-11 border-slate-200 focus:ring-indigo-600"
                    placeholder={t.leadCapture.namePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="lead-email">
                    {t.leadCapture.emailLabel}
                  </label>
                  <Input
                    id="lead-email"
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={`h-11 border-slate-200 focus:ring-indigo-600 ${errors.email ? "border-red-500" : ""}`}
                    placeholder={t.leadCapture.emailPlaceholder}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2">{t.leadCapture.errorInvalid}</p>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t.leadCapture.submit}
                </Button>

                <p className="text-xs text-slate-400 text-center">
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
