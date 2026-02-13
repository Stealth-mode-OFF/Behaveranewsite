import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { Check, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { trackBookingCalendarLoaded } from '@/lib/analytics';

const SCHEDULER_EMBED_URL = 'https://behavera.pipedrive.com/scheduler/GX27Q8iw/konzultace-jak-ziskat-jasna-data-o-svem-tymu-30-minutes';

// Skeleton shimmer for loading state
function CalendarSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-6">
      {/* Pulsing logo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center mb-5"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.div>
      {/* Shimmer bars */}
      <div className="w-full max-w-[280px] space-y-3">
        {[100, 70, 85, 60].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-full overflow-hidden"
            style={{ width: `${w}%`, margin: '0 auto' }}
          >
            <div className="h-full bg-gradient-to-r from-brand-background-muted via-brand-border/40 to-brand-background-muted bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full" />
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-text-muted mt-4 animate-pulse">Loading calendar…</p>
    </div>
  );
}

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useModal();
  const { language } = useLanguage();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  // Preload iframe only after modal opens (not on first render)
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  const handleClose = useCallback(() => {
    closeBooking();
    setTimeout(() => {
      setIsIframeLoaded(false);
      setShouldLoadIframe(false);
    }, 400);
  }, [closeBooking]);

  useEffect(() => {
    if (isBookingOpen) {
      setIsIframeLoaded(false);
      // Slight delay to let modal animation start, then load iframe
      const timer = setTimeout(() => setShouldLoadIframe(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isBookingOpen]);

  const copy = {
    cz: {
      title: 'Domluvte si ukázku',
      subtitle: '30 minut, které změní váš pohled na tým.',
      benefits: [
        'Živá ukázka na reálných datech',
        'Personalizováno pro váš obor',
        'Žádný závazek, žádný hard-sell',
      ],
      meta: '30 min · Video hovor · Zdarma',
      trust: ['GDPR ready', 'Bez kreditní karty'],
    },
    en: {
      title: 'Book a Demo',
      subtitle: '30 minutes that will change how you see your team.',
      benefits: [
        'Live demo on real data',
        'Personalized for your industry',
        'No strings attached, no hard-sell',
      ],
      meta: '30 min · Video call · Free',
      trust: ['GDPR ready', 'No credit card'],
    },
    de: {
      title: 'Demo buchen',
      subtitle: '30 Minuten, die Ihren Blick auf Ihr Team verändern.',
      benefits: [
        'Live-Demo mit echten Daten',
        'Personalisiert für Ihre Branche',
        'Keine Verpflichtung, kein Hard-Sell',
      ],
      meta: '30 Min · Videoanruf · Kostenlos',
      trust: ['DSGVO ready', 'Keine Kreditkarte'],
    },
  };

  const c = copy[language] || copy.en;

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[960px] p-0 overflow-hidden border-0 max-h-[100dvh] sm:max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">{c.title}</DialogTitle>
        <DialogDescription className="sr-only">{c.subtitle}</DialogDescription>

        <div className="flex flex-col lg:flex-row min-h-0 flex-1">

          {/* ─── LEFT: VALUE PANEL (hidden on mobile to keep focus on calendar) ─── */}
          <div className="hidden lg:flex lg:w-[300px] shrink-0 flex-col bg-brand-primary text-white p-8 relative overflow-hidden">
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-medium text-white/80 mb-5">
                  <Clock className="w-3 h-3" />
                  {c.meta}
                </div>
                <h2 className="text-xl font-bold tracking-tight leading-tight mb-2">
                  {c.title}
                </h2>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  {c.subtitle}
                </p>
              </div>

              {/* Benefits — simple checklist */}
              <ul className="space-y-3 mb-8">
                {c.benefits.map((text, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[13px] text-white/80">
                    <Check className="w-3.5 h-3.5 text-brand-accent shrink-0" strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {c.trust.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-white/50"
                  >
                    {badge}{idx < c.trust.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CALENDAR EMBED ─── */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile-only compact header */}
            <div className="lg:hidden px-5 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-text-primary leading-tight">{c.title}</h2>
                  <p className="text-[12px] text-brand-text-muted">{c.meta}</p>
                </div>
              </div>
              {/* Mobile trust strip */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {c.trust.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-background-secondary border border-brand-border rounded-full text-[10px] text-brand-text-muted font-medium"
                  >
                    <Check className="w-2.5 h-2.5 text-brand-primary" strokeWidth={3} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Calendar iframe container */}
            <div className="relative flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] bg-white overflow-hidden">
              <AnimatePresence>
                {!isIframeLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    <CalendarSkeleton />
                  </motion.div>
                )}
              </AnimatePresence>

              {shouldLoadIframe && (
                <iframe
                  src={SCHEDULER_EMBED_URL}
                  title={c.title}
                  className="w-full h-full absolute inset-0 border-0"
                  style={{ minHeight: '540px' }}
                  loading="eager"
                  onLoad={() => { setIsIframeLoaded(true); trackBookingCalendarLoaded(); }}
                />
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
