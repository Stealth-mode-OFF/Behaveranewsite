import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, Language } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  // Check localStorage first for user preference
  const saved = localStorage.getItem('preferredLanguage');
  if (saved && (saved === 'en' || saved === 'cz' || saved === 'de')) {
    return saved as Language;
  }
  
  // Detect from browser/system settings
  const browserLang =
    navigator.language ||
    (navigator as Navigator & { userLanguage?: string }).userLanguage ||
    'en';
  const langCode = browserLang.toLowerCase().split('-')[0];
  
  if (langCode === 'cs' || langCode === 'cz') return 'cz';
  if (langCode === 'de') return 'de';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cz');

  useEffect(() => {
    // Detect language on mount (client-side only)
    const detected = detectBrowserLanguage();
    setLanguageState(detected);
    document.documentElement.lang = detected === 'cz' ? 'cs' : detected;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang === 'cz' ? 'cs' : lang;
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback for independent component rendering (e.g. previews)
    return {
      language: 'cz' as Language,
      setLanguage: () => {},
      t: translations['cz'],
    };
  }
  return context;
}
