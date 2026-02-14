import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { Check, Clock, Video, Calendar, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { trackBookingCalendarLoaded } from '@/lib/analytics';

// Calendly embed with clean inline params
const SCHEDULER_EMBED_URL = 'https://calendly.com/josef-hofman-behavera?hide_landing_page_details=1&hide_gdpr_banner=1&hide_event_type_details=1&background_color=ffffff&text_color=1C1237&primary_color=2D1B69';

// Skeleton shimmer for loading state
function CalendarSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-6">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20 flex items-center justify-center mb-5"
      >
        <Calendar className="w-7 h-7 text-white" />
      </motion.div>
      <div className="w-full max-w-[260px] space-y-3">
        {[100, 65, 85, 55].map((w, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full overflow-hidden"
            style={{ width: `${w}%`, margin: '0 auto' }}
          >
            <div className="h-full bg-gradient-to-r from-brand-background-muted via-brand-border/40 to-brand-background-muted bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full" />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-brand-text-muted mt-5 animate-pulse font-medium">Loading calendar…</p>
    </div>
  );
}

export function BookingModal() {
  const { isBookingOpen, closeBooking, openDemo } = useModal();
  const { language } = useLanguage();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
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
      const timer = setTimeout(() => setShouldLoadIframe(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isBookingOpen]);

  const switchToDemo = () => {
    handleClose();
    setTimeout(() => openDemo('booking_modal_switch'), 500);
  };

  const copy = {
    cz: {
      title: 'Domluvte si ukázku',
      subtitle: '30 minut, které změní váš pohled na tým.',
      benefits: [
        { icon: Video, text: 'Živá ukázka na reálných datech' },
        { icon: Sparkles, text: 'Personalizováno pro váš obor' },
        { icon: Shield, text: 'Žádný závazek, žádný hard-sell' },
      ],
      meta: '30 min · Video hovor · Zdarma',
      trust: ['GDPR ready', 'Bez kreditní karty'],
      switchCta: 'Nebo si to vyzkoušejte sám →',
    },
    en: {
      title: 'Book a Demo',
      subtitle: '30 minutes that will change how you see your team.',
      benefits: [
        { icon: Video, text: 'Live demo on real data' },
        { icon: Sparkles, text: 'Personalized for your industry' },
        { icon: Shield, text: 'No strings attached, no hard-sell' },
      ],
      meta: '30 min · Video call · Free',
      trust: ['GDPR ready', 'No credit card'],
      switchCta: 'Or try it yourself →',
    },
    de: {
      title: 'Demo buchen',
      subtitle: '30 Minuten, die Ihren Blick auf Ihr Team verändern.',
      benefits: [
        { icon: Video, text: 'Live-Demo mit echten Daten' },
        { icon: Sparkles, text: 'Personalisiert für Ihre Branche' },
        { icon: Shield, text: 'Keine Verpflichtung, kein Hard-Sell' },
      ],
      meta: '30 Min · Videoanruf · Kostenlos',
      trust: ['DSGVO ready', 'Keine Kreditkarte'],
      switchCta: 'Oder testen Sie es selbst →',
    },
  };

  const c = copy[language] || copy.en;

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[960px] p-0 overflow-hidden border-0 max-h-[100dvh] sm:max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">{c.title}</DialogTitle>
        <DialogDescription className="sr-only">{c.subtitle}</DialogDescription>

        <div className="flex flex-col lg:flex-row min-h-0 flex-1">

          {/* ─── LEFT: VALUE PANEL (hidden on mobile) ─── */}
          <div className="hidden lg:flex lg:w-[320px] shrink-0 flex-col bg-gradient-to-b from-brand-primary via-[#1a0a3e] to-[#0d0520] text-white p-8 relative overflow-hidden">
            {/* Subtle grid bg */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            {/* Glow orb for depth */}
            <div className="absolute -bottom-20 -left-20 w-[200px] h-[200px] bg-brand-accent/15 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[11px] font-medium text-white/80 mb-5 border border-white/10">
                  <Clock className="w-3 h-3" />
                  {c.meta}
                </div>
                <h2 className="text-2xl font-bold tracking-tight leading-tight mb-3">
                  {c.title}
                </h2>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  {c.subtitle}
                </p>
              </div>

              {/* Benefits — icon + text */}
              <ul className="space-y-4 mb-8">
                {c.benefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                      <item.icon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <span className="text-[13px] text-white/80 leading-relaxed pt-1">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Switch CTA */}
              <button
                type="button"
                onClick={switchToDemo}
                className="text-[13px] text-white/50 hover:text-white/80 transition-colors text-left mb-4"
              >
                {c.switchCta}
              </button>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {c.trust.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-[11px] text-white/50 font-medium"
                  >
                    <Check className="w-3 h-3 text-brand-accent/60" strokeWidth={2.5} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CALENDAR EMBED ─── */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile-only compact header */}
            <div className="lg:hidden px-5 pt-5 pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-md shadow-brand-primary/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-brand-text-primary leading-tight">{c.title}</h2>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">{c.meta}</p>
                </div>
              </div>
              {/* Mobile trust strip */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {c.trust.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-background-secondary border border-brand-border rounded-full text-[10px] text-brand-text-muted font-medium"
                  >
                    <Check className="w-2.5 h-2.5 text-brand-primary" strokeWidth={3} />
                    {badge}
                  </span>
                ))}
              </div>
              {/* Mobile switch */}
              <button
                type="button"
                onClick={switchToDemo}
                className="text-[11px] text-brand-text-muted/70 hover:text-brand-primary transition-colors mt-2.5"
              >
                {c.switchCta}
              </button>
            </div>

            {/* Calendar iframe container */}
            <div className="relative flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] bg-white overflow-hidden rounded-bl-none rounded-br-none lg:rounded-br-2xl">
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
                <div className="w-full h-full absolute inset-0 overflow-hidden">
                  <iframe
                    src={SCHEDULER_EMBED_URL}
                    title={c.title}
                    className="w-full border-0"
                    style={{ minHeight: '640px', height: 'calc(100% + 80px)' }}
                    allow="payment"
                    loading="eager"
                    onLoad={() => { setIsIframeLoaded(true); trackBookingCalendarLoaded(); }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
