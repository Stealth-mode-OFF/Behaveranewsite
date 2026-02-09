import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { useModal } from '@/app/ModalContext';
import { useLanguage } from '@/app/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Calendar, ArrowRight, Copy, Check, ExternalLink, Sparkles, Zap, Users } from 'lucide-react';

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo, openBooking } = useModal();
  const { t, language } = useLanguage();
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    cz: {
      title: "Váš přístup je připraven",
      subtitle: "Použijte tyto údaje pro přístup do demo aplikace:",
      login: "Login",
      password: "Heslo",
      openApp: "Otevřít aplikaci",
      copied: "Zkopírováno!",
      tip: "Login automaticky zkopírován do schránky",
      guidedUpsell: "Chcete průvodce? Rezervujte si 30 min konzultaci →",
    },
    en: {
      title: "Your access is ready",
      subtitle: "Use these credentials to access the demo app:",
      login: "Login",
      password: "Password",
      openApp: "Open app",
      copied: "Copied!",
      tip: "Login auto-copied to clipboard",
      guidedUpsell: "Want a guided tour? Book a 30 min consultation →",
    },
    de: {
      title: "Ihr Zugang ist bereit",
      subtitle: "Verwenden Sie diese Daten für den Zugang zur Demo-App:",
      login: "Login",
      password: "Passwort",
      openApp: "App öffnen",
      copied: "Kopiert!",
      tip: "Login automatisch in Zwischenablage kopiert",
      guidedUpsell: "Geführte Tour? Buchen Sie eine 30-Min-Beratung →",
    },
  };
  const cred = credentialsCopy[language] || credentialsCopy.en;

  return (
    <Dialog open={isVideoOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Choose Demo Option</DialogTitle>
        <DialogDescription className="sr-only">Choose how you want to experience Echo Pulse</DialogDescription>

        <AnimatePresence mode="wait">
          {showCredentials ? (
            /* ─── Credentials View ─── */
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-9"
            >
              {/* Success header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-7 h-7" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight mb-1.5">
                  {cred.title}
                </h2>
                <p className="text-[14px] text-brand-text-muted">
                  {cred.subtitle}
                </p>
              </div>

              {/* Credential cards */}
              <div className="bg-gradient-to-b from-brand-background-secondary to-white border border-brand-border rounded-2xl divide-y divide-brand-border mb-5 overflow-hidden">
                {[
                  { label: cred.login, value: 'pulsedemo@behavera.com', field: 'login' },
                  { label: cred.password, value: 'showdemo', field: 'password' },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between px-5 py-4 group">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.08em] mb-1">
                        {item.label}
                      </div>
                      <div className="text-[15px] font-mono font-semibold text-brand-text-primary truncate">
                        {item.value}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary bg-white hover:bg-brand-primary/5 border border-brand-border hover:border-brand-primary/20 rounded-lg transition-all shrink-0 ml-3"
                    >
                      {copiedField === item.field ? (
                        <><Check className="w-3.5 h-3.5 text-brand-success" /><span className="text-brand-success">{cred.copied}</span></>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" />Copy</>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Open app button */}
              <a
                href="https://app.behavera.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  navigator.clipboard.writeText('pulsedemo@behavera.com');
                  setCopiedField('login');
                }}
                className="w-full flex items-center justify-center gap-2.5 h-[52px] rounded-xl bg-gradient-to-r from-brand-primary to-[#3b1899] text-white font-semibold text-[15px] hover:shadow-lg hover:shadow-brand-primary/25 transition-all cursor-pointer active:translate-y-[1px] no-underline"
              >
                {cred.openApp}
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-center text-[12px] text-brand-text-muted mt-3 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-accent" />
                {cred.tip}
              </p>

              {/* Upsell to guided */}
              <div className="mt-5 pt-5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleConsultation();
                  }}
                  className="w-full text-[13px] font-semibold text-brand-primary hover:text-brand-primary-hover text-center transition-colors"
                >
                  {cred.guidedUpsell}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ─── Choice View ─── */
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-7 sm:p-9"
            >
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary tracking-tight">
                  {copy.title}
                </h2>
              </div>

              <div className="space-y-3">
                {/* Option 1 — Guided consultation (RECOMMENDED — placed first for conversion) */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeVideo();
                    setTimeout(() => openBooking(), 100);
                  }}
                  className="group w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 border-brand-primary/20 bg-gradient-to-br from-[#FDFBFF] to-[#F5F0FF] hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/5 transition-all relative overflow-hidden"
                >
                  {/* Recommended badge */}
                  <span className="absolute -top-px right-5 px-3 py-1 bg-gradient-to-r from-brand-primary to-[#3b1899] text-white text-[10px] font-bold rounded-b-lg tracking-wider uppercase shadow-sm">
                    {copy.guided.recommended}
                  </span>

                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-[#3b1899] text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-primary/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-[15px] font-bold text-brand-text-primary mb-1">
                      {copy.guided.title}
                    </h3>
                    <p className="text-[13px] text-brand-text-muted leading-relaxed">
                      {copy.guided.desc}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-brand-primary">
                      {copy.guided.cta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-brand-border" />
                  <span className="text-[11px] text-brand-text-muted font-medium uppercase tracking-wider">
                    {language === 'cz' ? 'nebo' : language === 'de' ? 'oder' : 'or'}
                  </span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>

                {/* Option 2 — Self-serve */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCredentials(true);
                  }}
                  className="group w-full text-left flex items-start gap-4 p-5 rounded-2xl border border-brand-border hover:border-brand-primary/25 hover:bg-[#FDFBFF] transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-background-muted text-brand-primary flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-[15px] font-bold text-brand-text-primary mb-1">
                      {copy.selfServe.title}
                    </h3>
                    <p className="text-[13px] text-brand-text-muted leading-relaxed">
                      {copy.selfServe.desc}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-brand-text-secondary group-hover:text-brand-primary transition-colors">
                      {copy.selfServe.cta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Social proof strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-6 flex items-center justify-center gap-2 text-[12px] text-brand-text-muted"
              >
                <Users className="w-3.5 h-3.5 text-brand-accent" />
                <span>{language === 'cz' ? '250+ týmů důvěřuje Echo Pulse' : language === 'de' ? '250+ Teams vertrauen Echo Pulse' : '250+ teams trust Echo Pulse'}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
