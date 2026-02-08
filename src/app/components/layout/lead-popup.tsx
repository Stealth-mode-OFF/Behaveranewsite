import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Download, FileText, Check } from 'lucide-react';
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

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);
    const result = await submitLead({ email: data.email, source: "exit-intent-popup" });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Odeslání se nepodařilo.");
      return;
    }
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
            className="absolute inset-0 bg-[#0D0118]/30 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,1,24,0.25)] overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={closePopup}
              className="absolute top-3.5 right-3.5 z-10 p-1.5 hover:bg-black/5 rounded-full text-brand-text-muted hover:text-brand-text-primary transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 sm:p-8">
              {isSuccess ? (
                /* Success state */
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-text-primary mb-1">
                    {t.leadPopup.successTitle}
                  </h3>
                  <p className="text-[14px] text-brand-text-muted mb-6">
                    {t.leadPopup.successMessage}
                  </p>

                  <a
                    href="/ebooks/lide-odchazeji-z-dobrych-firem.pdf"
                    download
                    className="inline-flex items-center justify-center gap-2 w-full h-11 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg transition-colors text-[14px]"
                  >
                    <Download className="w-4 h-4" />
                    {t.leadPopup.downloadButton}
                  </a>

                  <p className="text-xs text-brand-text-muted mt-3 flex items-center justify-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    {t.leadPopup.downloadNote}
                  </p>
                </div>
              ) : (
                /* Form state */
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-text-primary mb-1.5 pr-6">
                    {t.leadPopup.title}
                  </h3>
                  <p className="text-[14px] text-brand-text-muted leading-relaxed mb-5">
                    {t.leadPopup.subtitle}
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Input
                      type="email"
                      name="email"
                      autoComplete={autocompleteAttributes.email}
                      placeholder={t.leadPopup.emailPlaceholder}
                      className={`h-11 ${errors.email ? 'border-red-300' : ''}`}
                      {...register("email", validationRules.email)}
                    />

                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}

                    {error && (
                      <p className="text-[13px] text-red-600 bg-red-50 rounded-lg px-3.5 py-2">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full h-11 text-[14px] font-semibold"
                      size="lg"
                    >
                      {t.leadPopup.cta}
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </form>

                  <p className="mt-4 text-center text-xs text-brand-text-muted">
                    Žádný spam. Pouze hodnotný obsah.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
