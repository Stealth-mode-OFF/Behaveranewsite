import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';

interface TechItem {
  name: string;
  icon: string;
  url: string;
  category: 'frontend' | 'backend' | 'infra' | 'ai';
}

const techStack: TechItem[] = [
  { name: 'React', icon: '⚛️', url: 'https://react.dev', category: 'frontend' },
  { name: 'TypeScript', icon: '🔷', url: 'https://typescriptlang.org', category: 'frontend' },
  { name: 'Tailwind CSS', icon: '🎨', url: 'https://tailwindcss.com', category: 'frontend' },
  { name: 'Vite', icon: '⚡', url: 'https://vitejs.dev', category: 'frontend' },
  { name: 'Supabase', icon: '🔐', url: 'https://supabase.com', category: 'backend' },
  { name: 'PostgreSQL', icon: '🐘', url: 'https://postgresql.org', category: 'backend' },
  { name: 'Vercel', icon: '▲', url: 'https://vercel.com', category: 'infra' },
  { name: 'OpenAI', icon: '🤖', url: 'https://openai.com', category: 'ai' },
];

const translations = {
  cz: {
    title: 'Postaveno na',
    subtitle: 'Moderní stack pro rychlost, bezpečnost a škálovatelnost.',
  },
  en: {
    title: 'Built with',
    subtitle: 'Modern stack for speed, security, and scalability.',
  },
  de: {
    title: 'Entwickelt mit',
    subtitle: 'Moderner Stack für Geschwindigkeit, Sicherheit und Skalierbarkeit.',
  },
};

export function BuiltWithSection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <section className="py-12 md:py-16 bg-brand-background-primary border-t border-brand-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-brand-text-secondary mb-1">
            {t.title}
          </h3>
          <p className="text-sm text-brand-text-muted">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {techStack.map((tech, index) => (
            <motion.a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex items-center gap-2 px-4 py-2.5 bg-brand-background-secondary/60 hover:bg-brand-background-tertiary border border-brand-border/30 hover:border-brand-primary/40 rounded-xl transition-all duration-200"
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {tech.icon}
              </span>
              <span className="text-sm font-medium text-brand-text-secondary group-hover:text-brand-text-primary transition-colors">
                {tech.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
