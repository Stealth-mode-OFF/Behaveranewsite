import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { Monitor, Calendar, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo, openBooking } = useModal();
  const { t, language } = useLanguage();
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSelfServeDemo = () => {
    setShowCredentials(true);
  };

  const handleConsultation = () => {
    closeVideo();
    setTimeout(() => openBooking(), 100);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleClose = () => {
    setShowCredentials(false);
    closeVideo();
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

  const credentialsCopy = {
    cz: { title: "Přihlašovací údaje", login: "Login", password: "Heslo", openApp: "Otevřít aplikaci", copied: "Zkopírováno!" },
    en: { title: "Login credentials", login: "Login", password: "Password", openApp: "Open app", copied: "Copied!" },
    de: { title: "Anmeldedaten", login: "Login", password: "Passwort", openApp: "App öffnen", copied: "Kopiert!" },
  };
  const cred = credentialsCopy[language] || credentialsCopy.en;

  return (
    <Dialog open={isVideoOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Choose Demo Option</DialogTitle>
        <DialogDescription className="sr-only">Choose how you want to experience Echo Pulse</DialogDescription>

        <div className="p-7 sm:p-9">
          {showCredentials ? (
            /* ─── Credentials View ─── */
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-2">
                {cred.title}
              </h2>
              <p className="text-[14px] text-brand-text-muted mb-6">
                {language === "cz" ? "Použijte tyto údaje pro přístup do demo aplikace:" : language === "de" ? "Verwenden Sie diese Daten für den Zugang zur Demo-App:" : "Use these credentials to access the demo app:"}
              </p>

              <div className="bg-[#FDFBFF] border border-brand-border rounded-xl p-5 mb-6 space-y-4">
                {/* Login */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-brand-text-muted uppercase tracking-wide mb-1">{cred.login}</p>
                    <p className="text-[15px] font-mono font-medium text-brand-text-primary truncate">pulsedemo@behavera.com</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('pulsedemo@behavera.com', 'login')}
                    className="p-2 rounded-lg hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-colors shrink-0"
                    title="Copy"
                  >
                    {copiedField === 'login' ? <Check className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-brand-text-muted uppercase tracking-wide mb-1">{cred.password}</p>
                    <p className="text-[15px] font-mono font-medium text-brand-text-primary">showdemo</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('showdemo', 'password')}
                    className="p-2 rounded-lg hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-colors shrink-0"
                    title="Copy"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Auto-copy login to clipboard
                  navigator.clipboard.writeText('pulsedemo@behavera.com');
                  setCopiedField('login');
                  // Open popup window on the right side
                  const width = 1000;
                  const height = 700;
                  const left = window.screenX + window.outerWidth - width - 50;
                  const top = window.screenY + 100;
                  window.open(
                    'https://app.behavera.com',
                    'behavera_demo',
                    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                  );
                }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-brand-primary text-white font-semibold text-[15px] hover:bg-brand-primary-hover transition-colors cursor-pointer"
              >
                {cred.openApp}
                <ExternalLink className="w-4 h-4" />
              </button>

              <p className="text-center text-[12px] text-brand-text-muted mt-3">
                {language === "cz" ? "💡 Login automaticky zkopírován do schránky" : language === "de" ? "💡 Login automatisch in Zwischenablage kopiert" : "💡 Login auto-copied to clipboard"}
              </p>
            </div>
          ) : (
            /* ─── Choice View ─── */
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-6">
                {copy.title}
              </h2>

              <div className="space-y-3">
                {/* Option 1 — Self-serve */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCredentials(true);
                  }}
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeVideo();
                    setTimeout(() => openBooking(), 100);
                  }}
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
