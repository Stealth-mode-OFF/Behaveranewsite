import { useCallback, useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { Input } from '@/app/components/ui/input';
import { PhoneInput } from '@/app/components/ui/phone-input';
import { Button } from '@/app/components/ui/button';
import { submitLead } from '@/app/utils/lead';
import { WORK_EMAIL_PATTERN } from '@/app/utils/validation';
import { trackLeadSubmitted, trackLeadFailed } from '@/lib/analytics';
import { BEHAVERA_APP_BASE_URL } from '@/lib/urls';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Loader2, Mail, Phone, Shield, Clock, Check,
  CheckCircle2, Sparkles, Play, AlertCircle
} from 'lucide-react';

/* ─── Demo credentials per language ─── */
const DEMO_CREDS: Record<string, { login: string; password: string }> = {
  cz: { login: 'pulsedemocs@behavera.com', password: 'showdemo' },
  en: { login: 'pulsedemo@behavera.com', password: 'showdemo' },
  de: { login: 'pulsedemo@behavera.com', password: 'showdemo' },
};

/* ─── Copy ─── */
const copy = {
  cz: {
    formTitle: 'Vyzkoušejte si demo sami',
    formSubtitle: 'Vyplňte firemní e-mail a telefon — demo se spustí okamžitě.',
    emailLabel: 'Firemní e-mail',
    emailPlaceholder: 'jan@firma.cz',
    emailError: 'Zadejte firemní e-mail (ne gmail, seznam…)',
    phoneLabel: 'Telefon',
    phoneError: 'Zadejte platné telefonní číslo',
    submit: 'Spustit demo',
    submitting: 'Ukládám…',
    trust: ['Bez kreditky', 'GDPR ready', '2 min a jste uvnitř'],
    errorGeneric: 'Něco se pokazilo. Zkuste to znovu.',
    successTitle: 'Vše připraveno!',
    successSubtitle: 'Klikněte níže a prohlédněte si demo dashboard.',
    credLabel: 'Přihlašovací údaje',
    openApp: 'Otevřít demo dashboard',
    openAppHint: 'Přihlašovací údaje se vyplní automaticky.',
    orBookDemo: 'Chci raději osobní demo',
  },
  en: {
    formTitle: 'Try the demo yourself',
    formSubtitle: 'Enter your work email and phone — the demo launches instantly.',
    emailLabel: 'Work email',
    emailPlaceholder: 'john@company.com',
    emailError: 'Enter a work email (not gmail, yahoo…)',
    phoneLabel: 'Phone',
    phoneError: 'Enter a valid phone number',
    submit: 'Launch demo',
    submitting: 'Saving…',
    trust: ['No credit card', 'GDPR ready', '2 min to get inside'],
    errorGeneric: 'Something went wrong. Please try again.',
    successTitle: 'All set!',
    successSubtitle: 'Click below to explore the demo dashboard.',
    credLabel: 'Login credentials',
    openApp: 'Open demo dashboard',
    openAppHint: 'Login credentials will be pre-filled.',
    orBookDemo: "I'd rather book a personal demo",
  },
  de: {
    formTitle: 'Testen Sie die Demo selbst',
    formSubtitle: 'Geben Sie Ihre geschäftliche E-Mail und Telefonnummer ein — die Demo startet sofort.',
    emailLabel: 'Geschäftliche E-Mail',
    emailPlaceholder: 'max@firma.de',
    emailError: 'Geben Sie eine geschäftliche E-Mail ein (nicht gmail, yahoo…)',
    phoneLabel: 'Telefon',
    phoneError: 'Geben Sie eine gültige Telefonnummer ein',
    submit: 'Demo starten',
    submitting: 'Wird gespeichert…',
    trust: ['Keine Kreditkarte', 'DSGVO-konform', '2 Min bis zum Zugang'],
    errorGeneric: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    successTitle: 'Alles bereit!',
    successSubtitle: 'Klicken Sie unten, um das Demo-Dashboard zu erkunden.',
    credLabel: 'Anmeldedaten',
    openApp: 'Demo-Dashboard öffnen',
    openAppHint: 'Anmeldedaten werden automatisch ausgefüllt.',
    orBookDemo: 'Ich möchte lieber eine persönliche Demo',
  },
};

/* ─── Starburst rays for success animation ─── */
function SuccessStarburst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 2] }}
          transition={{ duration: 1.2, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 w-1 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-success/30"
          style={{ rotate: `${i * 45}deg`, transformOrigin: 'center' }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */

export function DemoAccessModal() {
  const { isDemoOpen, closeDemo, openBooking } = useModal();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  const c = copy[language] || copy.en;
  const creds = DEMO_CREDS[language] || DEMO_CREDS.en;

  // Focus email on open
  useEffect(() => {
    if (isDemoOpen && status === 'idle') {
      const t = setTimeout(() => emailRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isDemoOpen, status]);

  // Reset on close
  const handleClose = useCallback(() => {
    closeDemo();
    setTimeout(() => {
      setEmail('');
      setPhone('');
      setEmailError('');
      setPhoneError('');
      setStatus('idle');
      setErrorMsg('');
    }, 400);
  }, [closeDemo]);

  const validate = (): boolean => {
    let ok = true;
    if (!email || !WORK_EMAIL_PATTERN.test(email)) {
      setEmailError(c.emailError);
      ok = false;
    } else {
      setEmailError('');
    }
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 6) {
      setPhoneError(c.phoneError);
      ok = false;
    } else {
      setPhoneError('');
    }
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const result = await submitLead({
        email,
        phone,
        source: 'self_service_demo',
      });

      if (result.ok) {
        setStatus('success');
        trackLeadSubmitted('self_service_demo');
      } else {
        setStatus('error');
        setErrorMsg(result.error || c.errorGeneric);
        trackLeadFailed('self_service_demo');
      }
    } catch {
      setStatus('error');
      setErrorMsg(c.errorGeneric);
      trackLeadFailed('self_service_demo');
    }
  };

  const handleOpenApp = () => {
    const demoUrl = `${BEHAVERA_APP_BASE_URL}/login?email=${encodeURIComponent(creds.login)}&demo=true`;
    window.open(demoUrl, '_blank', 'noopener,noreferrer');
  };

  const switchToBooking = () => {
    handleClose();
    setTimeout(() => openBooking('demo_modal_switch'), 500);
  };

  return (
    <Dialog open={isDemoOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">{c.formTitle}</DialogTitle>
        <DialogDescription className="sr-only">{c.formSubtitle}</DialogDescription>

        {/* Top gradient accent strip — brand identity */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            /* ═══════════ FORM STEP ═══════════ */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Subtle radial glow behind header */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[180px] bg-brand-primary/[0.04] rounded-full blur-[80px] pointer-events-none" />

              <div className="relative px-6 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7">
                {/* Header */}
                <div className="text-center mb-7">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20 mb-5"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-2">
                    {c.formTitle}
                  </h2>
                  <p className="text-sm text-brand-text-muted leading-relaxed max-w-sm mx-auto">
                    {c.formSubtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="demo-email" className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-primary mb-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-primary/70" />
                      {c.emailLabel} <span className="text-brand-error text-[11px]">*</span>
                    </label>
                    <Input
                      ref={emailRef}
                      id="demo-email"
                      type="email"
                      autoComplete="email"
                      placeholder={c.emailPlaceholder}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                      aria-invalid={!!emailError}
                      className={emailError ? 'border-red-400 ring-2 ring-red-100' : ''}
                    />
                    <AnimatePresence>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1 mt-1.5 text-xs text-brand-error"
                        >
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="demo-phone" className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-primary mb-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-primary/70" />
                      {c.phoneLabel} <span className="text-brand-error text-[11px]">*</span>
                    </label>
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      defaultCountry={language === 'de' ? 'DE' : 'CZ'}
                      error={!!phoneError}
                    />
                    <AnimatePresence>
                      {phoneError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1 mt-1.5 text-xs text-brand-error"
                        >
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {phoneError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all mt-1"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {c.submitting}
                      </>
                    ) : (
                      <>
                        {c.submit}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust line */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-brand-border">
                  {c.trust.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-brand-text-muted font-medium">
                      {idx === 0 && <Shield className="w-3 h-3 text-brand-primary/50" />}
                      {idx === 1 && <Check className="w-3 h-3 text-brand-success/60" />}
                      {idx === 2 && <Clock className="w-3 h-3 text-brand-accent/60" />}
                      {item}
                    </div>
                  ))}
                </div>

                {/* Alt CTA */}
                <button
                  type="button"
                  onClick={switchToBooking}
                  className="block w-full text-center text-[13px] text-brand-text-muted/70 hover:text-brand-primary transition-colors mt-3 pb-1"
                >
                  {c.orBookDemo} →
                </button>
              </div>
            </motion.div>
          ) : (
            /* ═══════════ SUCCESS STEP ═══════════ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative px-6 pt-8 pb-7 sm:px-8 sm:pt-10 sm:pb-8 text-center"
            >
              {/* Starburst celebration */}
              <SuccessStarburst />

              {/* Success icon */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-success/10 mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
                >
                  <CheckCircle2 className="w-8 h-8 text-brand-success" />
                </motion.div>
                {/* Ring pulse */}
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute inset-0 rounded-full border-2 border-brand-success/30"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-2">
                {c.successTitle}
              </h2>
              <p className="text-sm text-brand-text-muted mb-7 max-w-sm mx-auto leading-relaxed">
                {c.successSubtitle}
              </p>

              {/* Credential card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-brand-background-secondary to-brand-background-muted rounded-xl border border-brand-border p-5 mb-6 text-left"
              >
                <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.08em] mb-3">
                  {c.credLabel}
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 bg-white/80 rounded-lg px-3 py-2.5 border border-brand-border/60">
                    <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                    <span className="text-[13px] font-mono text-brand-text-primary select-all">{creds.login}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/80 rounded-lg px-3 py-2.5 border border-brand-border/60">
                    <Shield className="w-4 h-4 text-brand-primary shrink-0" />
                    <span className="text-[13px] font-mono text-brand-text-primary select-all">{creds.password}</span>
                  </div>
                </div>
              </motion.div>

              <p className="text-[11px] text-brand-text-muted mb-4">{c.openAppHint}</p>

              <Button
                onClick={handleOpenApp}
                size="lg"
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {c.openApp}
              </Button>

              <button
                type="button"
                onClick={switchToBooking}
                className="block w-full text-center text-[13px] text-brand-text-muted/70 hover:text-brand-primary transition-colors mt-4"
              >
                {c.orBookDemo} →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
