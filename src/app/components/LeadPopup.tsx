import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Gift } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FormField } from './ui/form-field';
import { useForm } from 'react-hook-form';
import { submitLead } from '../utils/lead';
import { validationRules, autocompleteAttributes } from '../utils/validation';

/**
 * LeadPopup with Exit-Intent Detection
 * 
 * Triggers:
 * 1. Exit intent (mouse leaves viewport top) - PRIMARY
 * 2. 60 seconds on page without interaction - FALLBACK
 * 3. 70% scroll depth - FALLBACK
 * 
 * Does NOT trigger:
 * - If already shown this session
 * - If user is on mobile (no exit intent possible)
 */
export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState<string | null>(null);

  // Check if mobile device
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

    // EXIT INTENT: Mouse leaves top of viewport (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (isMobile) return;
      
      // Only trigger when mouse leaves through the TOP of the page
      // This indicates intent to close tab or navigate away
      if (e.clientY <= 5 && e.relatedTarget === null) {
        triggerPopup();
      }
    };

    // FALLBACK 1: Time-based (60 seconds)
    const timeoutTimer = setTimeout(() => {
      if (isMobile) {
        // On mobile, use time-based trigger since exit intent doesn't work
        triggerPopup();
      }
    }, 60000); // 60 seconds

    // FALLBACK 2: Deep scroll (70% of page)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70) {
        // Only use scroll as trigger on mobile
        if (isMobile && !hasTriggered) {
          triggerPopup();
        }
      }
    };

    // Add listeners
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
    
    const result = await submitLead({
      email: data.email,
      source: "exit-intent-popup"
    });
    
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Odeslání se nepodařilo.");
      return;
    }

    setIsSuccess(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
    
    setTimeout(() => {
      closePopup();
    }, 3000);
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
            className="absolute inset-0 bg-brand-primary/30 backdrop-blur-sm"
          />
          
          {/* Modal Card - Simplified, focused on value */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-brand-background-secondary rounded-full text-brand-text-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8 md:p-10">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                    {t.leadPopup.successTitle}
                  </h3>
                  <p className="text-brand-text-secondary">
                    {t.leadPopup.successMessage}
                  </p>
                </div>
              ) : (
                <>
                  {/* Exit-intent specific header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl mb-5">
                      <Gift className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-3 leading-tight">
                      {t.leadPopup.title}
                    </h3>
                    <p className="text-brand-text-secondary leading-relaxed max-w-sm mx-auto">
                      {t.leadPopup.subtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      error={errors.email?.message}
                      helperText="Bez spamu. Pouze hodnotný obsah."
                      required
                    >
                      <Input 
                        type="email"
                        name="email"
                        autoComplete={autocompleteAttributes.email}
                        placeholder={t.leadPopup.emailPlaceholder}
                        {...register("email", validationRules.email)}
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
                      className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg group disabled:opacity-50"
                    >
                      {t.leadPopup.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>

                  {/* Social proof */}
                  <div className="mt-6 pt-6 border-t border-brand-border flex items-center justify-center gap-3 text-sm text-brand-text-muted">
                    <span>{t.leadPopup.socialProofPre}</span>
                    <span className="font-bold text-brand-primary">{t.leadPopup.socialProofCount}</span>
                    <span>{t.leadPopup.socialProofPost}</span>
                  </div>
                  
                  {/* No spam promise */}
                  <p className="text-center text-xs text-brand-text-muted mt-4">
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
