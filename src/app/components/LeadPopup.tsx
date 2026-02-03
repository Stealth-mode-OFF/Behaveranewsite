import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const { t } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 15000);

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

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900 z-50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[51] pointer-events-none p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full pointer-events-auto overflow-hidden relative flex">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="hidden md:flex w-2/5 bg-indigo-600 text-white p-8 flex-col justify-between relative overflow-hidden">
                   <div className="absolute inset-0 bg-slate-800 opacity-50 rotate-12 scale-150 origin-bottom-left" />
                   <div className="relative z-10">
                        <div className="inline-block px-2 py-1 bg-white/20 rounded text-caption font-bold uppercase tracking-wider mb-4 bg-[rgba(241,234,234,0.2)] text-[rgb(255,255,255)]">{t.leadPopup.badge}</div>
                        <h3 className="text-h2 font-bold">2026</h3>
                        <p className="opacity-90 text-body text-[rgb(255,255,255)]">Retention Report</p>
                   </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 relative flex flex-col justify-center">
                 {isSuccess ? (
                    <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{t.leadPopup.successTitle}</h3>
                        <p className="text-slate-500 font-medium">{t.leadPopup.successMessage}</p>
                    </div>
                 ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
                                {t.leadPopup.title}
                            </h3>
                            <p className="text-slate-700 leading-relaxed font-medium text-lg">
                                {t.leadPopup.subtitle}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input 
                                type="email" 
                                placeholder={t.leadPopup.emailPlaceholder}
                                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                className={`h-12 bg-white border-slate-300 focus:border-slate-800 focus:ring-0 transition-all text-base placeholder:text-slate-400 text-slate-900 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                            <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base shadow-lg shadow-slate-900/10 transition-all">
                                {t.leadPopup.cta} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                        <p className="text-xs text-center text-slate-400 mt-6 font-medium">
                            We respect your inbox. Unsubscribe in one click.
                        </p>
                    </div>
                 )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
