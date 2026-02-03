import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../translations';
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'cz', label: 'Čeština', flag: '🇨🇿' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguageIndex = languages.findIndex(l => l.code === language);
  const currentLanguage = languages[currentLanguageIndex !== -1 ? currentLanguageIndex : 0];

  const toggleLanguage = () => {
    const nextIndex = (currentLanguageIndex + 1) % languages.length;
    setLanguage(languages[nextIndex].code);
  };

  return (
    <Button 
      variant="ghost" 
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
      title={`Switch language (Current: ${currentLanguage.label})`}
    >
        <span className="text-2xl leading-none filter drop-shadow-sm">{currentLanguage.flag}</span>
    </Button>
  );
}
