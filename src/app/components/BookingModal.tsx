import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useModal } from '../ModalContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Target,
  Shield,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

/**
 * BookingModal - Consultation Scheduler
 * 
 * UX Strategy:
 * 1. Show value of consultation (what they'll get)
 * 2. Embed Cal.com or Pipedrive scheduler directly
 * 3. Make it feel premium and personalized
 * 
 * Integration options:
 * - Cal.com: Free, easy embed, good UX
 * - Pipedrive Scheduler: If you use Pipedrive CRM
 * 
 * Replace CAL_EMBED_URL with your actual Cal.com booking link
 */

// CONFIGURE: Replace with your actual Cal.com or Pipedrive booking URL
const CAL_EMBED_URL = 'https://cal.com/behavera/demo'; // Cal.com embed
// Alternative: Pipedrive Scheduler
// const PIPEDRIVE_EMBED_URL = 'https://scheduler.pipedrive.com/your-link';

type ViewMode = 'info' | 'calendar';

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useModal();
  const { t } = useLanguage();
  const [view, setView] = useState<ViewMode>('info');

  const handleClose = () => {
    closeBooking();
    setTimeout(() => setView('info'), 300);
  };

  const copy = t.bookingModal || {
    badge: "Osobní konzultace",
    title: "20 minut, které",
    titleHighlight: "změní váš pohled na data",
    subtitle: "Video hovor s naším konzultantem. Ukážeme vám, co Echo Pulse odhalí ve vaší firmě.",
    
    benefits: [
      { icon: "target", text: "Personalizovaná ukázka pro váš obor" },
      { icon: "users", text: "Odpovědi na všechny vaše dotazy" },
      { icon: "shield", text: "Žádné závazky, žádný hard-sell" },
    ],
    
    duration: "20 minut",
    format: "Video hovor (Google Meet / Zoom)",
    
    cta: "Vybrat termín",
    
    calendarTitle: "Vyberte si volný termín",
    calendarSubtitle: "Kalendář se načítá...",
    back: "Zpět"
  };

  const benefitIcons: Record<string, React.ReactNode> = {
    target: <Target className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    shield: <Shield className="w-4 h-4" />,
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={handleClose}>
      <DialogContent className={`${view === 'calendar' ? 'sm:max-w-[900px] sm:max-h-[90vh]' : 'sm:max-w-[520px]'} p-0 overflow-hidden bg-white border-brand-border transition-all duration-300`}>
        <DialogTitle className="sr-only">Book Consultation</DialogTitle>
        <DialogDescription className="sr-only">Schedule a consultation with our team</DialogDescription>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-brand-background-secondary rounded-full text-brand-text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {view === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
                  <Video className="w-4 h-4" />
                  {copy.badge}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-2">
                  {copy.title}{' '}
                  <span className="text-brand-primary">{copy.titleHighlight}</span>
                </h2>
                <p className="text-brand-text-secondary max-w-md mx-auto">
                  {copy.subtitle}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {copy.benefits.map((benefit: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-brand-background-secondary rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-brand-success/10 text-brand-success flex items-center justify-center shrink-0">
                      {benefitIcons[benefit.icon] || <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <span className="text-brand-text-primary font-medium">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Meeting Details */}
              <div className="flex items-center justify-center gap-6 mb-8 text-sm text-brand-text-secondary">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  {copy.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand-primary" />
                  {copy.format}
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setView('calendar')}
                className="w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-lg rounded-xl group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {copy.cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
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
              <div className="p-4 border-b border-brand-border flex items-center justify-between">
                <button
                  onClick={() => setView('info')}
                  className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  {copy.back}
                </button>
                <h3 className="font-semibold text-brand-text-primary">
                  {copy.calendarTitle}
                </h3>
                <div className="w-16" /> {/* Spacer for centering */}
              </div>

              {/* Calendar Embed */}
              <div className="relative min-h-[500px] bg-brand-background-secondary">
                {/* 
                  Cal.com Embed
                  Replace with your actual Cal.com embed URL
                  For Pipedrive, use their scheduler embed code instead
                */}
                <iframe
                  src={CAL_EMBED_URL}
                  title="Schedule a consultation"
                  className="w-full h-[600px] border-0"
                  loading="lazy"
                />
                
                {/* Loading placeholder - shows while iframe loads */}
                <div className="absolute inset-0 flex items-center justify-center bg-brand-background-secondary pointer-events-none opacity-0 transition-opacity">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-brand-text-muted">{copy.calendarSubtitle}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
