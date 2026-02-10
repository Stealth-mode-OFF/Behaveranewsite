import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { Check, Clock, Video, Shield, Users, Sparkles, Star } from 'lucide-react';
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
        { icon: Video, text: 'Živá ukázka na reálných datech' },
        { icon: Users, text: 'Personalizováno pro váš obor' },
        { icon: Shield, text: 'Žádný závazek, žádný hard-sell' },
      ],
      meta: '30 min · Video hovor · Zdarma',
      social: {
        stat: '50+',
        label: 'firem už používá Behavera',
      },
      testimonial: {
        quote: '"Konečně vidíme, co se v týmu opravdu děje."',
        author: 'HR Director',
        company: 'Enterprise klient',
      },
      trust: ['GDPR & SOC 2', 'Bez kreditní karty', '30denní trial'],
    },
    en: {
      title: 'Book a Demo',
      subtitle: '30 minutes that will change how you see your team.',
      benefits: [
        { icon: Video, text: 'Live demo on real data' },
        { icon: Users, text: 'Personalized for your industry' },
        { icon: Shield, text: 'No strings attached, no hard-sell' },
      ],
      meta: '30 min · Video call · Free',
      social: {
        stat: '50+',
        label: 'companies already use Behavera',
      },
      testimonial: {
        quote: '"Finally, we see what\'s really happening in our team."',
        author: 'HR Director',
        company: 'Enterprise client',
      },
      trust: ['GDPR & SOC 2', 'No credit card', '30-day trial'],
    },
    de: {
      title: 'Demo buchen',
      subtitle: '30 Minuten, die Ihren Blick auf Ihr Team verändern.',
      benefits: [
        { icon: Video, text: 'Live-Demo mit echten Daten' },
        { icon: Users, text: 'Personalisiert für Ihre Branche' },
        { icon: Shield, text: 'Keine Verpflichtung, kein Hard-Sell' },
      ],
      meta: '30 Min · Videoanruf · Kostenlos',
      social: {
        stat: '50+',
        label: 'Unternehmen nutzen bereits Behavera',
      },
      testimonial: {
        quote: '"Endlich sehen wir, was in unserem Team wirklich passiert."',
        author: 'HR-Direktor',
        company: 'Enterprise-Kunde',
      },
      trust: ['DSGVO & SOC 2', 'Keine Kreditkarte', '30-Tage-Test'],
    },
  };

  const c = copy[language] || copy.en;

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1040px] p-0 overflow-hidden border-0 max-h-[100dvh] sm:max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">{c.title}</DialogTitle>
        <DialogDescription className="sr-only">{c.subtitle}</DialogDescription>

        <div className="flex flex-col lg:flex-row min-h-0 flex-1">

          {/* ─── LEFT: VALUE PANEL (hidden on mobile to keep focus on calendar) ─── */}
          <div className="hidden lg:flex lg:w-[340px] xl:w-[380px] shrink-0 flex-col bg-gradient-to-br from-brand-primary via-[#1e0a4e] to-[#0d0520] text-white p-8 xl:p-10 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-accent/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-5">
                  <Clock className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-[12px] font-semibold text-white/90">{c.meta}</span>
                </div>
                <h2 className="text-2xl xl:text-[28px] font-bold tracking-tight leading-[1.15] mb-3">
                  {c.title}
                </h2>
                <p className="text-[14px] text-white/70 leading-relaxed">
                  {c.subtitle}
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-4 mb-8">
                {c.benefits.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <span className="text-[14px] text-white/85 leading-snug pt-1">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Social Proof */}
              <div className="space-y-5">
                {/* Stat */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-brand-accent tracking-tight">{c.social.stat}</div>
                  <p className="text-[13px] text-white/60 leading-snug">{c.social.label}</p>
                </div>

                {/* Testimonial */}
                <div className="bg-white/[0.06] backdrop-blur-sm rounded-xl p-4 border border-white/[0.08]">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                  <p className="text-[13px] text-white/80 leading-relaxed italic mb-2.5">
                    {c.testimonial.quote}
                  </p>
                  <p className="text-[11px] text-white/50">
                    — {c.testimonial.author}, {c.testimonial.company}
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2">
                  {c.trust.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-[11px] text-white/60"
                    >
                      <Check className="w-3 h-3 text-brand-accent" strokeWidth={2.5} />
                      {badge}
                    </span>
                  ))}
                </div>
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
