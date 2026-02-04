import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "../utils/lead";

type LeadFormData = {
  name?: string;
  email: string;
};

export function LeadCaptureSection() {
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
      setError(result.error || "Odeslání se nepodařilo.");
    }
  };

  return (
    <section className="section-spacing bg-white border-t border-slate-200" id="lead-capture">
      <div className="container-default">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6 border border-slate-200">
              E-book zdarma
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Získejte praktický přehled, jak řídit tým podle signálů.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Pošleme vám e-book s konkrétními tipy, jak rychle odhalit, co a proč ve firmě nefunguje. Bez spamu.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            {isSuccess ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">E-book je na cestě.</h3>
                <p className="text-slate-600">Zkontrolujte prosím e-mailovou schránku.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="lead-name">
                    Jméno (volitelné)
                  </label>
                  <Input
                    id="lead-name"
                    {...register("name")}
                    className="h-11 border-slate-200 focus:ring-indigo-600"
                    placeholder="Vaše jméno"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="lead-email">
                    Pracovní e-mail
                  </label>
                  <Input
                    id="lead-email"
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={`h-11 border-slate-200 focus:ring-indigo-600 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2">Zadejte prosím platný e-mail.</p>
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
                  Chci e-book
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  Odesláním souhlasíte se zpracováním kontaktních údajů pro doručení e-booku.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
