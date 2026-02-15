import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { CaseStudy } from '@/lib/types';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';

export function CaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const { language } = useLanguage();

  const texts = {
    cz: {
      pageTitle: 'Případové studie',
      pageSubtitle: 'Reálné výsledky od firem, které s Echo Pulse proměnily svou kulturu a retenci.',
      readCta: 'Číst případovku',
    },
    en: {
      pageTitle: 'Success Stories',
      pageSubtitle: 'Real results from companies using Echo Pulse to transform their culture and retention.',
      readCta: 'Read Case Study',
    },
    de: {
      pageTitle: 'Erfolgsgeschichten',
      pageSubtitle: 'Echte Ergebnisse von Unternehmen, die mit Echo Pulse ihre Kultur und Mitarbeiterbindung transformiert haben.',
      readCta: 'Fallstudie lesen',
    },
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  useSEO({
    title: t.pageTitle,
    description: t.pageSubtitle,
    ogType: 'website',
  });

  useEffect(() => {
    CmsService.getCaseStudies().then(data => {
      setStudies(data.filter(Boolean).filter(s => s.status === 'published'));
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
              {t.pageSubtitle}
            </p>
          </div>

          <div className="grid gap-8">
            {studies.map((study) => (
              <Link 
                key={study.id} 
                to={`/case-studies/${study.slug}`}
                className="group relative bg-white rounded-3xl overflow-hidden border border-brand-border/50 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row min-h-[400px]"
              >
                <div className="md:w-1/2 relative overflow-hidden">
                   {study.coverImage && (
                    <img 
                      src={study.coverImage} 
                      alt={language === 'cz' && study.title_cz ? study.title_cz : study.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                   <div className="mb-6">
                        <div className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-2">
                            {study.clientName}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 group-hover:text-brand-primary transition-colors">
                            {language === 'cz' && study.title_cz ? study.title_cz : study.title}
                        </h2>
                        <p className="text-brand-text-secondary text-lg leading-relaxed mb-8">
                            {language === 'cz' && study.challenge_cz ? study.challenge_cz : study.challenge}
                        </p>
                   </div>

                   <div className="grid grid-cols-2 gap-6 mb-8 border-t border-brand-border/50 pt-8">
                        {(language === 'cz' && study.results_cz ? study.results_cz : study.results).slice(0, 2).map((res, idx) => (
                            <div key={idx}>
                                <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">{res.value}</div>
                                <div className="text-sm text-brand-text-muted font-medium uppercase tracking-wide">{res.label}</div>
                            </div>
                        ))}
                   </div>
                   
                   <div className="flex items-center text-brand-primary font-bold group-hover:translate-x-2 transition-transform mt-auto">
                        {t.readCta} <ArrowRight className="ml-2 w-5 h-5" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
