import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { Monitor, Calendar, ArrowRight } from 'lucide-react';

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo, openBooking } = useModal();
  const { t } = useLanguage();

  const handleSelfServeDemo = () => {
    closeVideo();
    setTimeout(() => openBooking(), 100);
  };

  const handleConsultation = () => {
    closeVideo();
    setTimeout(() => openBooking(), 100);
  };

  const copy = t.demoChoiceModal || {
    title: "Jak chcete poznat Echo Pulse?",
    selfServe: {
      title: "Projít si demo sám",
      desc: "Přístup k demo aplikaci s reálnými daty, bez čekání.",
      cta: "Získat přístup",
    },
    guided: {
      title: "Konzultace s expertem",
      desc: "20min video hovor — ukázka šitá na míru vašemu oboru.",
      cta: "Vybrat termín",
      recommended: "Doporučujeme",
    },
  };

  return (
    <Dialog open={isVideoOpen} onOpenChange={closeVideo}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Choose Demo Option</DialogTitle>
        <DialogDescription className="sr-only">Choose how you want to experience Echo Pulse</DialogDescription>

        <div className="p-7 sm:p-9">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-6">
            {copy.title}
          </h2>

          <div className="space-y-3">
            {/* Option 1 — Self-serve */}
            <button
              onClick={handleSelfServeDemo}
              className="group w-full text-left flex items-start gap-4 p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 hover:bg-[#FDFBFF] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                <Monitor className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-brand-text-primary mb-0.5">
                  {copy.selfServe.title}
                </h3>
                <p className="text-[13px] text-brand-text-muted leading-relaxed">
                  {copy.selfServe.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary mt-3 shrink-0 transition-colors" />
            </button>

            {/* Option 2 — Guided (recommended) */}
            <button
              onClick={handleConsultation}
              className="group w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 border-brand-primary/20 bg-[#FDFBFF] hover:border-brand-primary/40 transition-all relative"
            >
              {/* Recommended tag */}
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-brand-primary text-white text-[10px] font-semibold rounded-full tracking-wide uppercase">
                {copy.guided.recommended}
              </span>

              <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-brand-text-primary mb-0.5">
                  {copy.guided.title}
                </h3>
                <p className="text-[13px] text-brand-text-muted leading-relaxed">
                  {copy.guided.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary mt-3 shrink-0 transition-colors" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
