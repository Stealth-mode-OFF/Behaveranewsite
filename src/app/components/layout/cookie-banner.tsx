import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, Settings2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/app/contexts/language-context';
import { trackCookieConsent } from '@/lib/analytics';

/**
 * CookieBanner - GDPR-compliant cookie consent
 * 
 * Features:
 * - Persists choice in localStorage (no repeat asking)
 * - Minimal/expanded mode
 * - Links to privacy policy
 * - Supports 3 languages
 */

const COOKIE_CONSENT_KEY = 'behavera_cookie_consent';
const COOKIE_CONSENT_VERSION = '1'; // Bump this to re-ask users

type ConsentState = {
  version: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const translations = {
  cz: {
    title: 'Cookies & soukromí',
    description: 'Používáme cookies pro zajištění základní funkčnosti webu a analýzu návštěvnosti. Marketingové cookies nepoužíváme.',
    essentialLabel: 'Nezbytné cookies',
    essentialDesc: 'Nutné pro fungování webu (nelze vypnout)',
    analyticsLabel: 'Analytické cookies',
    analyticsDesc: 'Pomáhají nám zlepšovat web (anonymní)',
    acceptAll: 'Přijmout vše',
    acceptEssential: 'Jen nezbytné',
    settings: 'Nastavení',
    save: 'Uložit volbu',
    privacyLink: 'Zásady ochrany osobních údajů',
  },
  en: {
    title: 'Cookies & Privacy',
    description: 'We use cookies to ensure basic website functionality and analyze traffic. We do not use marketing cookies.',
    essentialLabel: 'Essential cookies',
    essentialDesc: 'Required for website functionality (cannot be disabled)',
    analyticsLabel: 'Analytics cookies',
    analyticsDesc: 'Help us improve the website (anonymous)',
    acceptAll: 'Accept all',
    acceptEssential: 'Essential only',
    settings: 'Settings',
    save: 'Save preferences',
    privacyLink: 'Privacy Policy',
  },
  de: {
    title: 'Cookies & Datenschutz',
    description: 'Wir verwenden Cookies für die grundlegende Website-Funktionalität und Verkehrsanalyse. Wir verwenden keine Marketing-Cookies.',
    essentialLabel: 'Notwendige Cookies',
    essentialDesc: 'Erforderlich für die Website-Funktionalität (kann nicht deaktiviert werden)',
    analyticsLabel: 'Analyse-Cookies',
    analyticsDesc: 'Helfen uns, die Website zu verbessern (anonym)',
    acceptAll: 'Alle akzeptieren',
    acceptEssential: 'Nur notwendige',
    settings: 'Einstellungen',
    save: 'Auswahl speichern',
    privacyLink: 'Datenschutzerklärung',
  },
};

export function CookieBanner() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const t = translations[language] || translations.en;

  useEffect(() => {
    // Check if user has already consented
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const consent: ConsentState = JSON.parse(stored);
        // Only skip if same version
        if (consent.version === COOKIE_CONSENT_VERSION) {
          return; // User already consented, don't show banner
        }
      } catch {
        // Invalid stored data, show banner
      }
    }
    // Show banner after small delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = (analytics: boolean) => {
    const consent: ConsentState = {
      version: COOKIE_CONSENT_VERSION,
      essential: true, // Always true
      analytics,
      marketing: false, // We don't use marketing cookies
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setIsVisible(false);

    // Track the consent choice (fires unconditionally since this IS the consent)
    trackCookieConsent(
      analytics ? 'accept_all' : 'essential_only',
      analytics
    );
  };

  const handleAcceptAll = () => saveConsent(true);
  const handleAcceptEssential = () => saveConsent(false);
  const handleSaveSettings = () => {
    saveConsent(analyticsEnabled);
    trackCookieConsent('custom', analyticsEnabled);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
        >
          <div className="container-default max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden">
              {/* Main content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Cookie className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-text-primary mb-1">{t.title}</h3>
                    <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
                      {t.description}{' '}
                      <Link to="/terms" className="text-brand-primary hover:underline font-medium">
                        {t.privacyLink}
                      </Link>
                    </p>

                    {/* Settings panel */}
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 mb-4 pt-4 border-t border-brand-border">
                            {/* Essential cookies - always on */}
                            <div className="flex items-center justify-between p-3 bg-brand-background-secondary rounded-lg">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-brand-success" />
                                  <span className="font-medium text-sm text-brand-text-primary">{t.essentialLabel}</span>
                                </div>
                                <p className="text-xs text-brand-text-muted mt-0.5">{t.essentialDesc}</p>
                              </div>
                              <div className="w-10 h-6 bg-brand-success/20 rounded-full flex items-center justify-end px-1">
                                <div className="w-4 h-4 bg-brand-success rounded-full" />
                              </div>
                            </div>

                            {/* Analytics cookies - toggleable */}
                            <div className="flex items-center justify-between p-3 bg-brand-background-secondary rounded-lg">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Settings2 className="w-4 h-4 text-brand-primary" />
                                  <span className="font-medium text-sm text-brand-text-primary">{t.analyticsLabel}</span>
                                </div>
                                <p className="text-xs text-brand-text-muted mt-0.5">{t.analyticsDesc}</p>
                              </div>
                              <button
                                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                                  analyticsEnabled ? 'bg-brand-primary justify-end' : 'bg-brand-border justify-start'
                                }`}
                              >
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {!showSettings ? (
                        <>
                          <Button onClick={handleAcceptAll} size="sm" className="h-9">
                            {t.acceptAll}
                          </Button>
                          <Button onClick={handleAcceptEssential} variant="outline" size="sm" className="h-9">
                            {t.acceptEssential}
                          </Button>
                          <button
                            onClick={() => setShowSettings(true)}
                            className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors font-medium px-2"
                          >
                            {t.settings}
                          </button>
                        </>
                      ) : (
                        <>
                          <Button onClick={handleSaveSettings} size="sm" className="h-9">
                            {t.save}
                          </Button>
                          <button
                            onClick={() => setShowSettings(false)}
                            className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors font-medium px-2"
                          >
                            ← {t.acceptAll}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Close button - accepts essential only */}
                  <button
                    onClick={handleAcceptEssential}
                    className="w-8 h-8 rounded-lg hover:bg-brand-background-secondary flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
