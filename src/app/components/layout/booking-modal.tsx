import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useModal } from '@/app/ModalContext';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';

const SCHEDULER_EMBED_URL = 'https://behavera.pipedrive.com/scheduler/GX27Q8iw/konzultace-jak-ziskat-jasna-data-o-svem-tymu-30-minutes';

type ViewMode = 'info' | 'calendar';

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useModal();
  const { t } = useLanguage();
  const [view, setView] = useState<ViewMode>('info');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const handleClose = () => {
    closeBooking();
    setTimeout(() => {
      setView('info');
      setIsIframeLoaded(false);
    }, 300);
  };

  useEffect(() => {
    if (isBookingOpen) setIsIframeLoaded(false);
  }, [isBookingOpen]);

  const copy = t.bookingModal || {
    title: "Domluvte si ukázku",
    subtitle: "30minutový video hovor. Ukážeme vám Echo Pulse na reálných datech — bez závazků.",
    benefits: [
      "Personalizovaná ukázka pro váš obor",
      "Odpovědi na všechny dotazy",
      "Žádný hard-sell",
    ],
    cta: "Vybrat termín",
    calendarTitle: "Vyberte termín",
    back: "Zpět",
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className={`${view === 'calendar' ? 'sm:max-w-[900px]' : 'sm:max-w-[440px]'} p-0 overflow-hidden border-0 transition-all duration-300 max-h-[100dvh] sm:max-h-[90vh] flex flex-col`}>
        <DialogTitle className="sr-only">Rezervovat konzultaci</DialogTitle>
        <DialogDescription className="sr-only">Naplánujte si konzultaci s naším týmem</DialogDescription>

        <AnimatePresence mode="wait">
          {view === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-7 sm:p-9"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-2">
                {copy.title}
              </h2>

              <p className="text-[14px] text-brand-text-muted leading-relaxed mb-6">
                {copy.subtitle}
              </p>

              <ul className="space-y-2.5 mb-7">
                {(copy.benefits || []).map((text: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[14px] text-brand-text-secondary">
                    <Check className="w-4 h-4 mt-0.5 text-brand-primary shrink-0" strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => setView('calendar')}
                size="lg"
                className="w-full h-12 text-[15px] font-semibold"
              >
                {copy.cta}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <p className="mt-4 text-center text-xs text-brand-text-muted">
                30 min · Google Meet / Zoom · Zdarma
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <div className="px-5 py-3.5 border-b border-brand-border/60 flex items-center gap-3">
                <button
                  onClick={() => setView('info')}
                  className="flex items-center gap-1.5 text-[13px] text-brand-text-muted hover:text-brand-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {copy.back}
                </button>
                <div className="flex-1 text-center">
                  <span className="text-[14px] font-semibold text-brand-text-primary">{copy.calendarTitle}</span>
                </div>
                <div className="w-14" />
              </div>

              <div className="relative min-h-[450px] sm:min-h-[550px] bg-white flex-1 overflow-hidden">
                <AnimatePresence>
                  {!isIframeLoaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-white z-10"
                    >
                      <div className="w-6 h-6 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <iframe
                  src={SCHEDULER_EMBED_URL}
                  title="Naplánovat konzultaci"
                  className="w-full h-[500px] sm:h-[600px] border-0"
                  loading="lazy"
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
