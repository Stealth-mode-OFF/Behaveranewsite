import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Sparkles, Shield, Mail } from 'lucide-react';
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
          
          {/* Modal Card - Premium Design */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-brand-background-secondary rounded-full text-brand-text-muted hover:text-brand-text-primary transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient top accent */}
            <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

            {/* Content */}
            <div className="p-8 md:p-10">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                    {t.leadPopup.successTitle}
                  </h3>
                  <p className="text-brand-text-secondary">
                    {t.leadPopup.successMessage}
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, delay: 0.1 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 text-brand-primary rounded-2xl mb-5"
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-3 leading-tight"
                    >
                      {t.leadPopup.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-brand-text-secondary leading-relaxed"
                    >
                      {t.leadPopup.subtitle}
                    </motion.p>
                  </div>

                  <motion.form 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    onSubmit={handleSubmit(onSubmit)} 
                    className="space-y-4"
                  >
                    {/* Email Input - clean design */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">
                        <Mail className="w-5 h-5" />
                      </div>
                      <Input 
                        type="email"
                        name="email"
                        autoComplete={autocompleteAttributes.email}
                        placeholder={t.leadPopup.emailPlaceholder}
                        className={`h-14 pl-12 pr-4 rounded-xl text-base ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                        {...register("email", validationRules.email)}
                      />
                    </div>
                    
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full h-14 text-base font-semibold rounded-xl group"
                      size="lg"
                    >
                      {t.leadPopup.cta}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.form>

                  {/* Trust indicators */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-6 pt-6 border-t border-brand-border/50"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-brand-text-muted mb-3">
                      <Shield className="w-4 h-4" />
                      <span>Žádný spam. Pouze hodnotný obsah.</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-brand-text-muted">{t.leadPopup.socialProofPre}</span>
                      <span className="font-bold text-brand-primary">{t.leadPopup.socialProofCount}</span>
                      <span className="text-brand-text-muted">{t.leadPopup.socialProofPost}</span>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
