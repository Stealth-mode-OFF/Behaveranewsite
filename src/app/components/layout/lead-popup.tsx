import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Download, FileText, Check, BookOpen, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '@/app/LanguageContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useForm } from 'react-hook-form';
import { submitLead } from '@/app/utils/lead';
import { validationRules, autocompleteAttributes } from '@/app/utils/validation';

/**
 * LeadPopup with Exit-Intent Detection
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
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState<string | null>(null);

  const isMobile = typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const triggerPopup = useCallback(() => {
    if (hasTriggered) return;
    const hasSeen = sessionStorage.getItem('leadPopupSeen');
    if (hasSeen) return;
    setIsOpen(true);
    setHasTriggered(true);
  }, [hasTriggered]);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('leadPopupSeen');
    if (hasSeen) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (isMobile) return;
      if (e.clientY <= 5 && e.relatedTarget === null) {
        triggerPopup();
      }
    };

    const timeoutTimer = setTimeout(() => {
      if (isMobile) triggerPopup();
    }, 60000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && isMobile && !hasTriggered) {
        triggerPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered, isMobile, triggerPopup]);

  const closePopup = () => {
    setIsOpen(false);
    setHasTriggered(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
  };

  // Trigger file download
  const downloadEbook = () => {
    const link = document.createElement('a');
    link.href = '/ebooks/lide-odchazeji-z-dobrych-firem.pdf';
    link.download = 'Lidé odcházejí i z dobrých firem.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);
    
    // Submit lead (don't block on it)
    submitLead({ email: data.email, source: "exit-intent-popup" });
    
    // Immediately trigger download
    setTimeout(() => {
      downloadEbook();
    }, 100);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-[#0D0118]/40 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-[0_25px_60px_-12px_rgba(13,1,24,0.3)] overflow-hidden"
          >
            {/* Top accent gradient */}
            <div className="h-1 bg-gradient-to-r from-brand-primary via-brand-primary-hover to-brand-primary/60" />

            {/* Close */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-1.5 hover:bg-black/5 rounded-full text-brand-text-muted hover:text-brand-text-primary transition-colors"
              aria-label={t.leadPopup?.close || "Close"}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 sm:p-8">
              {isSuccess ? (
                /* Success state */
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-14 h-14 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-5"
                  >
                    <Check className="w-7 h-7" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-brand-text-primary mb-1.5">
                    {t.leadPopup?.successTitle || "Stahování začalo!"}
                  </h3>
                  <p className="text-[14px] text-brand-text-muted mb-6">
                    {t.leadPopup?.successMessage || "Pokud se stahování nespustilo, klikněte níže:"}
                  </p>

                  <button
                    type="button"
                    onClick={downloadEbook}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl transition-all text-[14px] shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
                  >
                    <Download className="w-4 h-4" />
                    {t.leadPopup?.downloadButton || "Stáhnout PDF"}
                  </button>

                  <p className="text-xs text-brand-text-muted mt-3 flex items-center justify-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    {t.leadPopup?.downloadNote || "PDF · 4.3 MB"}
                  </p>
                </div>
              ) : (
                /* Form state */
                <>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/5 border border-brand-primary/10 rounded-full mb-4">
                    <Sparkles className="w-3 h-3 text-brand-primary" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
                      {t.leadPopup?.badge || "Nová studie 2026"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-[22px] font-bold text-brand-text-primary leading-tight mb-2 pr-6">
                    {t.leadPopup?.title || "Stáhněte si zdarma e-book"}
                  </h3>
                  <p className="text-[14px] text-brand-text-muted leading-relaxed mb-5">
                    {t.leadPopup?.subtitle || "Zjistěte, proč lidé odcházejí i z dobrých firem."}
                  </p>

                  {/* E-book preview card */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-xl border border-slate-100 mb-5">
                    <div className="flex-shrink-0 w-11 h-14 bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-lg flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-brand-text-primary leading-snug truncate">
                        {t.leadPopup?.title || "E-book"}
                      </p>
                      <p className="text-[11px] text-brand-text-muted mt-0.5">PDF • 4.3 MB</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                      <label className="text-[13px] font-medium text-brand-text-secondary mb-1.5 block">
                        {t.leadPopup?.inputLabel || "Kam máme e-book poslat?"}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        autoComplete={autocompleteAttributes.email}
                        placeholder={t.leadPopup?.emailPlaceholder || "Váš pracovní e-mail"}
                        className={`h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors ${errors.email ? 'border-red-300 bg-red-50/30' : ''}`}
                        {...register("email", validationRules.email)}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}

                    {error && (
                      <p className="text-[13px] text-red-600 bg-red-50 rounded-lg px-3.5 py-2">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full h-12 text-[14px] font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
                      size="lg"
                    >
                      {t.leadPopup?.cta || "Stáhnout e-book zdarma"}
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </form>

                  {/* Social proof */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-center gap-2 text-[13px] text-brand-text-muted">
                      <Users className="w-3.5 h-3.5 text-brand-text-muted/60" />
                      <span>
                        {t.leadPopup?.socialProofPre || "Již stáhlo"}{' '}
                        <span className="font-semibold text-brand-text-secondary">
                          {t.leadPopup?.socialProofCount || "500+"}
                        </span>{' '}
                        {t.leadPopup?.socialProofPost || "lídrů"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
