import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { submitLead } from '../utils/lead';

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('leadPopupSeen');
    if (hasSeen) return;

    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 8000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 40 && !hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasOpened]);

  const closePopup = () => {
    setIsOpen(false);
    setHasOpened(true);
    sessionStorage.setItem('leadPopupSeen', 'true');
  };

  const onSubmit = async (data: any) => {
    setError(null);
    const result = await submitLead({
      email: data.email,
      source: "lead-popup"
    });

    if (!result.ok) {
      setError(result.error || "Odeslání se nepodařilo.");
      return;
    }

    setIsSuccess(true);
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-black/5 rounded-full text-brand-text-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side - Image */}
            <div className="hidden md:block w-2/5 relative">
              <img 
                src="https://images.unsplash.com/photo-1766866763822-985dbc6f3405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1vZGVybiUyMG9mZmljZSUyMGFyY2hpdGVjdHVyZSUyMGJyaWdodHxlbnwxfHx8fDE3NzAxMjI1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Office Context" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-primary/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-serif italic text-lg opacity-90 leading-relaxed">
                  "{t.leadPopup.quote}"
                </p>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative flex flex-col justify-center bg-white">
                 {isSuccess ? (
                    <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-brand-accent/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-accent/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-primary mb-3 tracking-tight">{t.leadPopup.successTitle}</h3>
                        <p className="text-brand-text-secondary font-medium text-base max-w-xs mx-auto">
                            {t.leadPopup.successMessage}
                        </p>
                    </div>
                 ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-4">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                                    {t.leadPopup.badge}
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-brand-primary mb-4 tracking-tight leading-[1.15]">
                                {t.leadPopup.title}
                            </h3>
                            <p className="text-brand-text-secondary leading-relaxed font-medium text-base md:text-lg opacity-90">
                                {t.leadPopup.subtitle}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-brand-primary uppercase tracking-wide ml-1">
                                    {t.leadPopup.inputLabel}
                                </label>
                                <Input 
                                    type="email" 
                                    placeholder={t.leadPopup.emailPlaceholder}
                                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                    className={`h-12 bg-brand-background-secondary border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm placeholder:text-brand-text-muted/50 text-brand-text-primary shadow-sm rounded-lg ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                />
                            </div>
                            {error && (
                              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {error}
                              </div>
                            )}
                            <Button className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all rounded-lg group">
                                {t.leadPopup.cta} 
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-brand-border/30 flex items-center justify-center gap-6">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-brand-background-secondary border border-white ring-1 ring-brand-primary/10" />
                                ))}
                            </div>
                            <p className="text-xs text-brand-text-muted font-medium">
                                {t.leadPopup.socialProofPre} <span className="text-brand-primary font-bold">{t.leadPopup.socialProofCount}</span> {t.leadPopup.socialProofPost}
                            </p>
                        </div>
                    </div>
                 )}
              </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}