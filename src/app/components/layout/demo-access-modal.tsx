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
  CheckCircle2, Sparkles, Play, AlertCircle, Copy, ExternalLink, X
} from 'lucide-react';

/* \u2500\u2500\u2500 Demo credentials per language \u2500\u2500\u2500 */
const DEMO_CREDS: Record<string, { login: string; password: string }> = {
  cz: { login: 'pulsedemocs@behavera.com', password: 'showdemo' },
  en: { login: 'pulsedemo@behavera.com', password: 'showdemo' },
  de: { login: 'pulsedemo@behavera.com', password: 'showdemo' },
};

/* \u2500\u2500\u2500 Copy \u2500\u2500\u2500 */
const copy = {
  cz: {
    formTitle: 'Vyzkou\u0161ejte si demo sami',
    formSubtitle: 'Vypl\u0148te firemn\u00ed e-mail a telefon \u2014 demo se spust\u00ed okam\u017eit\u011b.',
    emailLabel: 'Firemn\u00ed e-mail',
    emailPlaceholder: 'jan@firma.cz',
    emailError: 'Zadejte firemn\u00ed e-mail (ne gmail, seznam\u2026)',
    phoneLabel: 'Telefon',
    phoneError: 'Zadejte platn\u00e9 telefonn\u00ed \u010d\u00edslo',
    submit: 'Spustit demo',
    submitting: 'Ukl\u00e1d\u00e1m\u2026',
    trust: ['Bez kreditky', 'GDPR ready', '2 min a jste uvnit\u0159'],
    errorGeneric: 'N\u011bco se pokazilo. Zkuste to znovu.',
    credLabel: 'P\u0159ihla\u0161ovac\u00ed \u00fadaje',
    credLogin: 'Login',
    credPass: 'Heslo',
    copied: 'Zkop\u00edrov\u00e1no!',
    openNewTab: 'Otev\u0159\u00edt v nov\u00e9m okn\u011b',
    orBookDemo: 'Chci rad\u011bji osobn\u00ed demo',
    loading: 'Na\u010d\u00edt\u00e1n\u00ed\u2026',
  },
  en: {
    formTitle: 'Try the demo yourself',
    formSubtitle: 'Enter your work email and phone \u2014 the demo launches instantly.',
    emailLabel: 'Work email',
    emailPlaceholder: 'john@company.com',
    emailError: 'Enter a work email (not gmail, yahoo\u2026)',
    phoneLabel: 'Phone',
    phoneError: 'Enter a valid phone number',
    submit: 'Launch demo',
    submitting: 'Saving\u2026',
    trust: ['No credit card', 'GDPR ready', '2 min to get inside'],
    errorGeneric: 'Something went wrong. Please try again.',
    credLabel: 'Login credentials',
    credLogin: 'Login',
    credPass: 'Password',
    copied: 'Copied!',
    openNewTab: 'Open in new tab',
    orBookDemo: "I'd rather book a personal demo",
    loading: 'Loading\u2026',
  },
  de: {
    formTitle: 'Testen Sie die Demo selbst',
    formSubtitle: 'Geben Sie Ihre gesch\u00e4ftliche E-Mail und Telefonnummer ein \u2014 die Demo startet sofort.',
    emailLabel: 'Gesch\u00e4ftliche E-Mail',
    emailPlaceholder: 'max@firma.de',
    emailError: 'Geben Sie eine gesch\u00e4ftliche E-Mail ein (nicht gmail, yahoo\u2026)',
    phoneLabel: 'Telefon',
    phoneError: 'Geben Sie eine g\u00fcltige Telefonnummer ein',
    submit: 'Demo starten',
    submitting: 'Wird gespeichert\u2026',
    trust: ['Keine Kreditkarte', 'DSGVO-konform', '2 Min bis zum Zugang'],
    errorGeneric: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    credLabel: 'Anmeldedaten',
    credLogin: 'Login',
    credPass: 'Passwort',
    copied: 'Kopiert!',
    openNewTab: 'In neuem Tab \u00f6ffnen',
    orBookDemo: 'Ich m\u00f6chte lieber eine pers\u00f6nliche Demo',
    loading: 'Wird geladen\u2026',
  },
};

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

export function DemoAccessModal() {
  const { isDemoOpen, closeDemo, openBooking } = useModal();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const c = copy[language] || copy.en;
  const creds = DEMO_CREDS[language] || DEMO_CREDS.en;
  const demoUrl = `${BEHAVERA_APP_BASE_URL}/login`;

  // Focus email on open
  useEffect(() => {
    if (isDemoOpen && status === 'idle') {
      const t = setTimeout(() => emailRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isDemoOpen, status]);

  // Lock body scroll when embed is shown
  useEffect(() => {
    if (isDemoOpen && status === 'success') {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
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
      setCopiedField(null);
      setIframeLoaded(false);
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

    // Show the demo immediately — lead capture runs in background
    setTimeout(() => {
      setStatus('success');
      trackLeadSubmitted('self_service_demo');
    }, 600);

    // Fire-and-forget: capture the lead but don't block the demo
    submitLead({
      email,
      phone,
      source: 'self_service_demo',
    }).catch(() => {
      trackLeadFailed('self_service_demo');
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const switchToBooking = () => {
    handleClose();
    setTimeout(() => openBooking('demo_modal_switch'), 500);
  };

  /* \u2550\u2550\u2550 FORM DIALOG (before lead capture) \u2550\u2550\u2550 */
  if (status !== 'success') {
    return (
      <Dialog open={isDemoOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0">
          <DialogTitle className="sr-only">{c.formTitle}</DialogTitle>
          <DialogDescription className="sr-only">{c.formSubtitle}</DialogDescription>

          <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
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
                <div>
                  <label htmlFor="demo-email" className="flex items-center gap-1.5 text-sm font-semibold text-brand-text-primary mb-1.5">
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
                    className={emailError ? 'border-brand-error ring-2 ring-brand-error/10' : ''}
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

                <div>
                  <label htmlFor="demo-phone" className="flex items-center gap-1.5 text-sm font-semibold text-brand-text-primary mb-1.5">
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

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-error/5 border border-brand-error/20 text-sm text-brand-error"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

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

              <button
                type="button"
                onClick={switchToBooking}
                className="block w-full text-center text-[13px] text-brand-text-muted/70 hover:text-brand-primary transition-colors mt-3 pb-1 cursor-pointer"
              >
                {c.orBookDemo} \u2192
              </button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  /* \u2550\u2550\u2550 FULL-SCREEN EMBED (after lead capture) \u2550\u2550\u2550 */
  if (!isDemoOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[560px] h-[min(92vh,920px)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary shrink-0" />

        {/* Credential bar */}
        <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-brand-background-secondary to-brand-background-muted border-b border-brand-border/60">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.1em]">
              {c.credLabel}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-brand-text-muted hover:text-brand-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {c.openNewTab}
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Login field */}
            <button
              onClick={() => copyToClipboard(creds.login, 'login')}
              className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-brand-border/60 hover:border-brand-primary/30 transition-colors group cursor-pointer text-left"
            >
              <Mail className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="text-[12px] font-mono text-brand-text-primary select-all truncate flex-1">{creds.login}</span>
              {copiedField === 'login' ? (
                <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-brand-text-muted group-hover:text-brand-primary shrink-0 transition-colors" />
              )}
            </button>
            {/* Password field */}
            <button
              onClick={() => copyToClipboard(creds.password, 'pass')}
              className="sm:w-[160px] flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-brand-border/60 hover:border-brand-primary/30 transition-colors group cursor-pointer text-left"
            >
              <Shield className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="text-[12px] font-mono text-brand-text-primary select-all flex-1">{creds.password}</span>
              {copiedField === 'pass' ? (
                <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-brand-text-muted group-hover:text-brand-primary shrink-0 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Floating close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg border border-brand-border/40 flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Loading spinner */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10 mt-[100px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
              <span className="text-sm text-brand-text-muted">{c.loading}</span>
            </div>
          </div>
        )}

        {/* Embedded app */}
        <iframe
          src={demoUrl}
          className="w-full flex-1 border-0"
          onLoad={() => setIframeLoaded(true)}
          allow="clipboard-write"
          title="Echo Pulse Demo"
        />

        {/* Bottom: book demo alternative */}
        <div className="shrink-0 px-4 py-2.5 border-t border-brand-border/40 bg-white flex items-center justify-center">
          <button
            type="button"
            onClick={switchToBooking}
            className="text-[12px] text-brand-text-muted/70 hover:text-brand-primary transition-colors cursor-pointer"
          >
            {c.orBookDemo} \u2192
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
