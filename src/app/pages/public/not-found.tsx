import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/contexts/language-context';

const translations = {
  cz: {
    title: '404',
    subtitle: 'Stránka nenalezena',
    description: 'Omlouváme se, ale stránka kterou hledáte neexistuje nebo byla přesunuta.',
    homeButton: 'Zpět na hlavní stránku',
    backButton: 'Zpět',
  },
  en: {
    title: '404',
    subtitle: 'Page not found',
    description: "Sorry, the page you're looking for doesn't exist or has been moved.",
    homeButton: 'Back to homepage',
    backButton: 'Go back',
  },
  de: {
    title: '404',
    subtitle: 'Seite nicht gefunden',
    description: 'Entschuldigung, die gesuchte Seite existiert nicht oder wurde verschoben.',
    homeButton: 'Zurück zur Startseite',
    backButton: 'Zurück',
  },
};

export function NotFoundPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background-primary via-brand-background-secondary to-brand-primary/5 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <span className="text-[180px] md:text-[220px] font-bold text-brand-primary/10 leading-none select-none">
            {t.title}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-brand-primary/40" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Text */}
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-4">
          {t.subtitle}
        </h1>
        <p className="text-brand-text-secondary mb-8 max-w-md mx-auto">
          {t.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-border text-brand-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all duration-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backButton}
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white hover:bg-brand-primary-hover transition-all duration-300 font-medium shadow-lg shadow-brand-primary/20"
          >
            <Home className="w-4 h-4" />
            {t.homeButton}
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl -z-10" />
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
