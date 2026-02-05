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
  Monitor, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Shield,
  Clock,
  Users,
  Sparkles,
  Play
} from 'lucide-react';

/**
 * DemoAccessModal - Gated Demo Access
 * 
 * UX Strategy:
 * 1. Show clear value proposition (what they'll see in demo)
 * 2. Collect work email + phone (higher quality leads)
 * 3. On success: reveal credentials + direct link to app
 * 4. Offer upsell to consultation for guided tour
 * 
 * Key UX decisions:
 * - Work email validation (no gmail/yahoo)
 * - Phone required (sales follow-up)
 * - Immediate gratification (credentials shown instantly)
 * - Clear "no spam" promise to reduce friction
 */

type ModalView = 'form' | 'success';

interface FormData {
  email: string;
  phone: string;
  company?: string;
}

// Demo credentials - in production, these could be fetched from backend
const DEMO_CREDENTIALS = {
  url: 'https://app.behavera.com',
  email: 'pulsedemo@behavera.com',
  password: 'showdemo'
};

export function DemoAccessModal() {
  const { demoRequestOpen, closeDemoRequest, openBooking } = useModal();
  const { t, language } = useLanguage();
  const [view, setView] = useState<ModalView>('form');
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
      setError(result.error || copy.errors.generic);
      return;
    }

    setView('success');
  };

  const copy = t.demoAccess || {
    // Form view
    badge: "Plný přístup k demo",
    title: "Vyzkoušejte Echo Pulse",
    titleHighlight: "na reálných datech",
    subtitle: "Projděte si dashboard, který vidí naši klienti. Žádné omezení, žádný časový limit.",
    
    features: [
      { icon: "monitor", text: "Kompletní demo prostředí" },
      { icon: "clock", text: "Neomezený přístup" },
      { icon: "users", text: "Reálná firemní data" },
    ],
    
    emailLabel: "Pracovní email",
    emailPlaceholder: "jan.novak@firma.cz",
    phoneLabel: "Telefon",
    phonePlaceholder: "+420 777 888 999",
    companyLabel: "Název firmy (volitelné)",
    companyPlaceholder: "Vaše firma s.r.o.",
    
    submitCta: "Získat přístup",
    submitting: "Odesílám...",
    
    noSpam: "Žádný spam. Údaje použijeme pouze pro ověření.",
    
    errors: {
      workEmailRequired: "Prosím zadejte pracovní email (ne gmail, yahoo...)",
      phoneRequired: "Telefon je povinný",
      generic: "Něco se pokazilo. Zkuste to prosím znovu."
    },
    
    // Success view
    successTitle: "Váš přístup je připraven!",
    successSubtitle: "Použijte tyto údaje pro přihlášení do demo prostředí:",
    
    credentials: {
      urlLabel: "Demo aplikace",
      emailLabel: "Přihlašovací email",
      passwordLabel: "Heslo"
    },
    
    copyButton: "Kopírovat",
    copied: "Zkopírováno!",
    openDemo: "Otevřít demo aplikaci",
    
    upsellTitle: "Chcete průvodce?",
    upsellText: "Rezervujte si 30min konzultaci a ukážeme vám, co Echo Pulse odhalí ve vaší firmě.",
    upsellCta: "Rezervovat konzultaci"
  };

  const featureIcons: Record<string, React.ReactNode> = {
    monitor: <Monitor className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
  };

  return (
    <Dialog open={demoRequestOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-white border-brand-border max-h-[100dvh] sm:max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Demo Access</DialogTitle>
        <DialogDescription className="sr-only">Get access to Echo Pulse demo</DialogDescription>

        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8 overflow-y-auto"
            >
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  {copy.badge}
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-text-primary mb-2">
                  {copy.title}{' '}
                  <span className="text-brand-primary">{copy.titleHighlight}</span>
                </h2>
                <p className="text-sm sm:text-base text-brand-text-secondary">
                  {copy.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                {copy.features.map((feature: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <div className="w-6 h-6 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center">
                      {featureIcons[feature.icon] || <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    {feature.text}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  label={copy.emailLabel}
                  error={errors.email?.message}
                  helperText={copy.noSpam}
                  required
                >
                  <Input
                    type="email"
                    autoComplete={autocompleteAttributes.email}
                    placeholder={copy.emailPlaceholder}
                    {...register("email", validationRules.workEmail)}
                  />
                </FormField>

                <FormField
                  label={copy.phoneLabel}
                  error={errors.phone?.message}
                  required
                >
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

                <FormField
                  label={copy.companyLabel}
                  error={errors.company?.message}
                >
                  <Input
                    type="text"
                    autoComplete={autocompleteAttributes.company}
                    placeholder={copy.companyPlaceholder}
                    {...register("company", validationRules.company)}
                  />
                </FormField>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || view === 'success'}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      {copy.submitting}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {copy.submitCta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust note */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-brand-text-muted">
                <Shield className="w-4 h-4" />
                {copy.noSpam}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-8 overflow-y-auto"
            >
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                  {copy.successTitle}
                </h2>
                <p className="text-brand-text-secondary">
                  {copy.successSubtitle}
                </p>
              </div>

              {/* Credentials Card */}
              <div className="bg-brand-background-secondary border border-brand-border rounded-xl p-5 space-y-4 mb-6">
                {/* URL */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-brand-text-muted uppercase tracking-wide mb-1">
                      {copy.credentials.urlLabel}
                    </div>
                    <div className="font-mono text-sm text-brand-primary font-medium">
                      {DEMO_CREDENTIALS.url}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DEMO_CREDENTIALS.url, 'url')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-text-muted hover:text-brand-primary hover:bg-white rounded-lg transition-colors"
                  >
                    {copiedField === 'url' ? <CheckCircle2 className="w-3 h-3 text-brand-success" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'url' ? copy.copied : copy.copyButton}
                  </button>
                </div>

                <div className="border-t border-brand-border" />

                {/* Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-brand-text-muted uppercase tracking-wide mb-1">
                      {copy.credentials.emailLabel}
                    </div>
                    <div className="font-mono text-sm text-brand-text-primary font-medium">
                      {DEMO_CREDENTIALS.email}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DEMO_CREDENTIALS.email, 'email')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-text-muted hover:text-brand-primary hover:bg-white rounded-lg transition-colors"
                  >
                    {copiedField === 'email' ? <CheckCircle2 className="w-3 h-3 text-brand-success" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'email' ? copy.copied : copy.copyButton}
                  </button>
                </div>

                <div className="border-t border-brand-border" />

                {/* Password */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-brand-text-muted uppercase tracking-wide mb-1">
                      {copy.credentials.passwordLabel}
                    </div>
                    <div className="font-mono text-sm text-brand-text-primary font-medium">
                      {DEMO_CREDENTIALS.password}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(DEMO_CREDENTIALS.password, 'password')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-text-muted hover:text-brand-primary hover:bg-white rounded-lg transition-colors"
                  >
                    {copiedField === 'password' ? <CheckCircle2 className="w-3 h-3 text-brand-success" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'password' ? copy.copied : copy.copyButton}
                  </button>
                </div>
              </div>

              {/* Open Demo Button */}
              <Button
                onClick={() => window.open(DEMO_CREDENTIALS.url, '_blank')}
                className="w-full mb-6"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {copy.openDemo}
              </Button>

              {/* Upsell to Consultation */}
              <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-5">
                <h3 className="font-bold text-brand-text-primary mb-1">
                  {copy.upsellTitle}
                </h3>
                <p className="text-sm text-brand-text-secondary mb-4">
                  {copy.upsellText}
                </p>
                <Button
                  onClick={handleBookConsultation}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {copy.upsellCta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
