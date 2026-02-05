import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useModal } from '@/app/ModalContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Target,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';

/**
 * BookingModal - Premium Consultation Scheduler
 * 
 * Design principles:
 * - Premium, enterprise-grade look
 * - Trust-building social proof
 * - Clear value proposition
 * - Seamless Pipedrive scheduler integration
 */

// Pipedrive Scheduler - Demo booking
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

  // Reset iframe state when modal opens
  useEffect(() => {
    if (isBookingOpen) {
      setIsIframeLoaded(false);
    }
  }, [isBookingOpen]);

  const copy = t.bookingModal || {
    badge: "Osobní konzultace",
    title: "20 minut, které",
    titleHighlight: "změní váš pohled na data",
    subtitle: "Video hovor s naším konzultantem. Ukážeme vám, jak Echo Pulse funguje s reálnými firemními daty.",
    
    benefits: [
      { icon: "target", text: "Personalizovaná ukázka pro váš obor" },
      { icon: "users", text: "Odpovědi na všechny vaše dotazy" },
      { icon: "shield", text: "Žádné závazky, žádný hard-sell" },
    ],
    
    duration: "20 minut",
    format: "Google Meet / Zoom",
    
    cta: "Vybrat termín",
    
    calendarTitle: "Vyberte si volný termín",
    calendarSubtitle: "Načítám kalendář...",
    back: "Zpět",
    
    socialProof: "150+ firem už využívá Echo Pulse"
  };

  const benefitIcons: Record<string, React.ReactNode> = {
    target: <Target className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className={`${view === 'calendar' ? 'sm:max-w-[900px] sm:max-h-[90vh]' : 'sm:max-w-[560px]'} p-0 overflow-hidden bg-white border-0 shadow-2xl transition-all duration-300`}>
        <DialogTitle className="sr-only">Rezervovat konzultaci</DialogTitle>
        <DialogDescription className="sr-only">Naplánujte si konzultaci s naším týmem</DialogDescription>

        <AnimatePresence mode="wait">
          {view === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {/* Premium Gradient Header */}
              <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary to-[#4C1D95] p-8 pb-10 text-white overflow-hidden">
                {/* Animated background elements */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-2xl"
                />
                
                <div className="relative z-10">
                  {/* Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {copy.badge}
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl md:text-3xl font-bold mb-3 leading-tight"
                  >
                    {copy.title}{' '}
                    <span className="text-brand-accent">{copy.titleHighlight}</span>
                  </motion.h2>
                  
                  {/* Subtitle */}
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-base max-w-md leading-relaxed"
                  >
                    {copy.subtitle}
                  </motion.p>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 pt-6">
                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  {copy.benefits.map((benefit: { icon: string; text: string }, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + idx * 0.08 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-background-secondary to-white rounded-xl border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-sm transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 text-brand-primary flex items-center justify-center shrink-0">
                        {benefitIcons[benefit.icon] || <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <span className="text-brand-text-primary font-medium">
                        {benefit.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Meeting Details Pills */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-background-secondary rounded-full text-sm">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    <span className="text-brand-text-secondary font-medium">{copy.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-background-secondary rounded-full text-sm">
                    <Video className="w-4 h-4 text-brand-primary" />
                    <span className="text-brand-text-secondary font-medium">{copy.format}</span>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Button
                    onClick={() => setView('calendar')}
                    size="lg"
                    className="w-full h-14 text-base font-semibold btn-shine group"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {copy.cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {/* Social Proof */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="mt-6 text-center text-sm text-brand-text-muted flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-success" />
                  {copy.socialProof}
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {/* Calendar Header */}
              <div className="p-4 border-b border-brand-border bg-brand-background-secondary/30 flex items-center justify-between">
                <button
                  onClick={() => setView('info')}
                  className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-background-secondary"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  {copy.back}
                </button>
                <h3 className="font-semibold text-brand-text-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  {copy.calendarTitle}
                </h3>
                <div className="w-20" /> {/* Spacer for centering */}
              </div>

              {/* Calendar Embed */}
              <div className="relative min-h-[550px] bg-white">
                {/* Loading State */}
                <AnimatePresence>
                  {!isIframeLoaded && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-white z-10"
                    >
                      <div className="text-center">
                        <div className="w-10 h-10 border-3 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-brand-text-muted font-medium">{copy.calendarSubtitle}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Pipedrive Scheduler Embed */}
                <iframe
                  src={SCHEDULER_EMBED_URL}
                  title="Naplánovat konzultaci"
                  className="w-full h-[600px] border-0"
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
