import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { ArrowRight, Download, Check, BookOpen, Users, Sparkles, Shield } from 'lucide-react';
import { useLanguage } from '@/app/contexts/language-context';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useForm } from 'react-hook-form';
import { submitLead } from '@/app/utils/lead';
import { validationRules, autocompleteAttributes } from '@/app/utils/validation';
import { trackLeadPopupTriggered, trackLeadPopupDismissed, trackLeadSubmitted, trackEbookDownload } from '@/lib/analytics';

/**
 * LeadPopup — Premium unified design using Dialog primitive
 *
 * Triggers:
 * 1. Exit intent (mouse leaves viewport top) - PRIMARY
 * 2. 60 seconds on page without interaction - FALLBACK (mobile)
 * 3. 70% scroll depth - FALLBACK (mobile)
 */
export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { t, language } = useLanguage();
  const { pathname } = useLocation();
  type LeadPopupFormData = { email: string; marketingConsent: boolean };
  const { register, handleSubmit, formState: { errors } } = useForm<LeadPopupFormData>({
    defaultValues: { marketingConsent: false }
  });
  const [error, setError] = useState<string | null>(null);

  /* ─── Suppress on sales-critical pages ─── */
  const SUPPRESSED_ROUTES = ['/start', '/signup', '/admin'];
  const isSuppressed = SUPPRESSED_ROUTES.some(r => pathname.startsWith(r));

  const isMobile = typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  /* Minimum seconds on page before any trigger is allowed */
  const MIN_TIME_ON_PAGE_MS = 45_000;
  const [canTrigger, setCanTrigger] = useState(false);

  const triggerPopup = useCallback((trigger: 'exit_intent' | 'timeout' | 'scroll_depth' = 'exit_intent') => {
    if (hasTriggered || isSuppressed) return;
    const hasSeen = sessionStorage.getItem('leadPopupSeen');
    if (hasSeen) return;
    setIsOpen(true);
    setHasTriggered(true);
    trackLeadPopupTriggered(trigger);
  }, [hasTriggered]);

  /* Gate: enable triggers only after MIN_TIME_ON_PAGE_MS */
  useEffect(() => {
    const gateTimer = setTimeout(() => setCanTrigger(true), MIN_TIME_ON_PAGE_MS);
    return () => clearTimeout(gateTimer);
  }, []);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('leadPopupSeen');
    if (hasSeen) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (isMobile || !canTrigger) return;
      if (e.clientY <= 5 && e.relatedTarget === null) {
        triggerPopup('exit_intent');
      }
    };

    const timeoutTimer = setTimeout(() => {
      if (isMobile) triggerPopup('timeout');
    }, 120_000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && isMobile && canTrigger && !hasTriggered) {
        triggerPopup('scroll_depth');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered, isMobile, canTrigger, triggerPopup]);

  const closePopup = () => {
    setIsOpen(false);
    setHasTriggered(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
    trackLeadPopupDismissed();
  };

  const downloadEbook = () => {
    const link = document.createElement('a');
    link.href = '/ebooks/lide-odchazeji-z-dobrych-firem.pdf';
    const fileNames: Record<string, string> = {
      cz: 'Lidé odcházejí i z dobrých firem.pdf',
      en: 'People Leave Good Companies Too.pdf',
      de: 'Menschen verlassen auch gute Firmen.pdf',
    };
    link.download = fileNames[language] || fileNames.en;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = async (data: LeadPopupFormData) => {
    setError(null);
    setIsSubmitting(true);
    submitLead({ email: data.email, source: "exit-intent-popup", marketingConsent: data.marketingConsent });
    trackLeadSubmitted('exit-intent-popup');
    setTimeout(() => {
      downloadEbook();
      trackEbookDownload('Lidé odcházejí i z dobrých firem', 'auto');
    }, 100);
    setIsSubmitting(false);
    setIsSuccess(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closePopup(); }}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">
          {t.leadPopup?.title || "Stáhněte si zdarma e-book"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t.leadPopup?.subtitle || "Zjistěte, proč lidé odcházejí i z dobrých firem."}
        </DialogDescription>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* ─── SUCCESS STATE ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-9"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-8 h-8" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-text-primary mb-1.5 tracking-tight">
                  {t.leadPopup?.successTitle || "Stahování začalo!"}
                </h3>
                <p className="text-sm text-brand-text-muted mb-6">
                  {t.leadPopup?.successMessage || "Pokud se stahování nespustilo, klikněte níže:"}
                </p>

                <Button
                  type="button"
                  onClick={() => { downloadEbook(); trackEbookDownload('Lidé odcházejí i z dobrých firem', 'manual'); }}
                  className="w-full h-[52px] text-[15px] rounded-xl"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  {t.leadPopup?.downloadButton || "Stáhnout PDF"}
                </Button>

                <p className="text-[12px] text-brand-text-muted mt-3 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-brand-accent" />
                  {t.leadPopup?.downloadNote || "PDF · 4.3 MB"}
                </p>
              </div>
            </motion.div>
          ) : (
            /* ─── FORM STATE ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
            >
              {/* Top accent gradient — matches BookingModal */}
              <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

              <div className="p-7 sm:p-9">
                {/* Header with icon — unified pattern */}
                <div className="flex items-start gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0 shadow-md shadow-brand-primary/15">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="pr-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full mb-2">
                      <Sparkles className="w-2.5 h-2.5 text-brand-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                        {t.leadPopup?.badge || "Nová studie 2026"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight leading-tight mb-1">
                      {t.leadPopup?.title || "Stáhněte si zdarma e-book"}
                    </h2>
                    <p className="text-sm text-brand-text-muted leading-relaxed">
                      {t.leadPopup?.subtitle || "Zjistěte, proč lidé odcházejí i z dobrých firem."}
                    </p>
                  </div>
                </div>

                {/* E-book preview card */}
                <div className="flex items-center gap-3.5 p-3.5 bg-gradient-to-r from-brand-background-secondary to-brand-background-secondary/50 rounded-xl border border-brand-border/40 mb-5">
                  <div className="flex-shrink-0 w-11 h-14 bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-brand-text-primary leading-snug truncate">
                      {t.leadPopup?.ebookTitle || "Lidé odcházejí i z dobrých firem"}
                    </p>
                    <p className="text-[11px] text-brand-text-muted mt-0.5">PDF • 4.3 MB</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  <div>
                    <label className="text-[13px] font-medium text-brand-text-secondary mb-1.5 block">
                      {t.leadPopup?.inputLabel || "Váš e-mail"}
                    </label>
                    <Input
                      type="email"
                      autoComplete={autocompleteAttributes.email}
                      placeholder={t.leadPopup?.emailPlaceholder || "Váš pracovní e-mail"}
                      className={`h-11 rounded-xl bg-brand-background-secondary border-brand-border focus:bg-white transition-colors ${errors.email ? 'border-brand-error/40 bg-brand-error/5' : ''}`}
                      {...register("email", validationRules.email)}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                  )}

                  {error && (
                    <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="shrink-0">⚠</span>
                      {error}
                    </p>
                  )}

                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
                      {...register("marketingConsent")}
                    />
                    <span className="text-[12px] text-brand-text-muted leading-relaxed group-hover:text-brand-text-secondary transition-colors">
                      {t.leadPopup?.marketingConsent || "Souhlasím se zasíláním občasných tipů a novinek. Odhlásit se můžete kdykoliv."}
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-[52px] text-[15px] font-semibold rounded-xl mt-1"
                    size="lg"
                  >
                    {t.leadPopup?.cta || "Stáhnout e-book zdarma"}
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </form>

                {/* Trust strip — unified pattern */}
                <div className="mt-5 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-text-muted">
                    <Shield className="w-3 h-3 text-brand-primary/60" />
                    {t.leadPopup?.noSpam || "Žádný spam. Respektujeme vaše soukromí."}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[12px] text-brand-text-muted">
                    <Users className="w-3.5 h-3.5 text-brand-accent" />
                    <span>
                      {t.leadPopup?.socialProofPre || "Již stáhlo"}{' '}
                      <span className="font-semibold text-brand-text-secondary">
                        {t.leadPopup?.socialProofCount || "500+"}
                      </span>{' '}
                      {t.leadPopup?.socialProofPost || "lídrů"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
