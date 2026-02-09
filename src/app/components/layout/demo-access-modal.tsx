import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { PhoneInput, phoneValidationRules } from '@/app/components/ui/phone-input';
import { useForm, Controller } from 'react-hook-form';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { submitLead } from '@/app/utils/lead';
import { validationRules, autocompleteAttributes } from '@/app/utils/validation';
import {
  Lock,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Users,
  Check,
  Sparkles,
  Star,
} from 'lucide-react';

interface FormData {
  email: string;
  phone: string;
  company?: string;
}

const DEMO_CREDENTIALS = {
  url: 'https://app.behavera.com',
  email: 'pulsedemo@behavera.com',
  password: 'showdemo'
};

export function DemoAccessModal() {
  const { demoRequestOpen, closeDemoRequest, openBooking } = useModal();
  const { t } = useLanguage();
  const [view, setView] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>();

  const handleClose = () => {
    closeDemoRequest();
    setTimeout(() => {
      setView('form');
      setError(null);
      reset();
    }, 300);
  };

  const handleBookConsultation = () => {
    handleClose();
    setTimeout(() => openBooking(), 100);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsSubmitting(true);
    const result = await submitLead({
      email: data.email,
      phone: data.phone,
      company: data.company,
      source: "demo-access-modal"
    });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Něco se pokazilo. Zkuste to znovu.");
      return;
    }
    setView('success');
  };

  const copy = t.demoAccess || {
    title: "Vyzkoušejte Echo Pulse",
    subtitle: "Zadejte údaje a získejte okamžitý přístup k demo aplikaci.",
    emailLabel: "Pracovní email",
    emailPlaceholder: "jan.novak@firma.cz",
    phoneLabel: "Telefon",
    phonePlaceholder: "+420 777 888 999",
    companyLabel: "Firma (volitelné)",
    companyPlaceholder: "Vaše firma s.r.o.",
    submitCta: "Získat přístup",
    submitting: "Odesílám...",
    noSpam: "Žádný spam. Údaje použijeme pouze pro ověření.",
    successTitle: "Váš přístup je připraven",
    successSubtitle: "Přihlašovací údaje do demo prostředí:",
    credentials: {
      urlLabel: "URL",
      emailLabel: "Email",
      passwordLabel: "Heslo"
    },
    copyButton: "Kopírovat",
    copied: "Zkopírováno",
    openDemo: "Otevřít demo",
    upsellTitle: "Chcete průvodce?",
    upsellText: "Rezervujte si 30min konzultaci — ukážeme vám, co Echo Pulse odhalí ve vaší firmě.",
    upsellCta: "Rezervovat konzultaci"
  };

  return (
    <Dialog open={demoRequestOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 max-h-[100dvh] sm:max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Demo Access</DialogTitle>
        <DialogDescription className="sr-only">Get access to Echo Pulse demo</DialogDescription>

        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
            >
              {/* Gradient top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />
              
              <div className="p-7 sm:p-9">
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0 shadow-md shadow-brand-primary/15">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight leading-tight mb-1">
                      {copy.title}
                    </h2>
                    <p className="text-[14px] text-brand-text-muted leading-relaxed">
                      {copy.subtitle}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  <FormField label={copy.emailLabel} error={errors.email?.message} required>
                    <Input
                      type="email"
                      autoComplete={autocompleteAttributes.email}
                      placeholder={copy.emailPlaceholder}
                      className="h-11"
                      {...register("email", validationRules.workEmail)}
                    />
                  </FormField>

                  <FormField label={copy.phoneLabel} error={errors.phone?.message} required>
                    <Controller
                      name="phone"
                      control={control}
                      rules={phoneValidationRules}
                      render={({ field, fieldState }) => (
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          defaultCountry="CZ"
                        />
                      )}
                    />
                  </FormField>

                  <FormField label={copy.companyLabel} error={errors.company?.message}>
                    <Input
                      type="text"
                      autoComplete={autocompleteAttributes.company}
                      placeholder={copy.companyPlaceholder}
                      className="h-11"
                      {...register("company", validationRules.company)}
                    />
                  </FormField>

                  {error && (
                    <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="shrink-0">⚠</span>
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[52px] mt-2 text-[15px]"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                        {copy.submitting}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        {copy.submitCta}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust strip */}
                <div className="mt-5 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-text-muted">
                    <Shield className="w-3 h-3 text-brand-primary/60" />
                    {copy.noSpam}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['GDPR', 'SOC 2', 'ISO 27001'].map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-background-secondary border border-brand-border rounded-full text-[10px] text-brand-text-muted font-medium"
                      >
                        <Check className="w-2.5 h-2.5 text-brand-primary" strokeWidth={3} />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-7 sm:p-9 overflow-y-auto"
            >
              {/* Success header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary mb-1.5">
                  {copy.successTitle}
                </h2>
                <p className="text-[14px] text-brand-text-muted">
                  {copy.successSubtitle}
                </p>
              </div>

              {/* Credentials — premium card */}
              <div className="bg-gradient-to-b from-brand-background-secondary to-white border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border mb-5">
                {[
                  { label: copy.credentials.urlLabel, value: DEMO_CREDENTIALS.url, field: 'url', accent: true },
                  { label: copy.credentials.emailLabel, value: DEMO_CREDENTIALS.email, field: 'email', accent: false },
                  { label: copy.credentials.passwordLabel, value: DEMO_CREDENTIALS.password, field: 'password', accent: false },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.08em] mb-0.5">
                        {item.label}
                      </div>
                      <div className={`text-[14px] font-mono font-semibold truncate ${item.accent ? 'text-brand-primary' : 'text-brand-text-primary'}`}>
                        {item.value}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-brand-text-muted hover:text-brand-primary bg-white hover:bg-brand-primary/5 border border-brand-border hover:border-brand-primary/20 rounded-lg transition-all shrink-0 ml-3"
                    >
                      {copiedField === item.field ? (
                        <><CheckCircle2 className="w-3 h-3 text-brand-success" /><span className="text-brand-success">{copy.copied}</span></>
                      ) : (
                        <><Copy className="w-3 h-3" />{copy.copyButton}</>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Open app CTA */}
              <Button
                onClick={() => window.open(DEMO_CREDENTIALS.url, '_blank')}
                className="w-full h-[52px] mb-2 text-[15px]"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                {copy.openDemo}
              </Button>

              {/* Upsell — consultation */}
              <div className="mt-5 bg-gradient-to-br from-[#FDFBFF] to-[#F5F0FF] border border-brand-primary/10 rounded-2xl p-5 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-brand-accent" />
                  <p className="text-[13px] font-semibold text-brand-text-primary">
                    {copy.upsellTitle}
                  </p>
                </div>
                <p className="text-[13px] text-brand-text-muted mb-3 leading-relaxed">
                  {copy.upsellText}
                </p>
                <button
                  onClick={handleBookConsultation}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
                >
                  {copy.upsellCta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
