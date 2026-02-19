import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { CaseStudy } from '@/lib/types';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { ArrowRight, Building2, TrendingUp } from 'lucide-react';
import { useSEO } from '@/app/hooks/use-seo';
import { useLanguage } from '@/app/contexts/language-context';
import { SITE_ORIGIN } from '@/lib/urls';
import { motion } from 'framer-motion';

/** Resolve a localized field with fallback */
function loc<T>(language: string, cz: T | undefined, en: T): T {
  return language === 'cz' && cz ? cz : en;
}

export function CaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const texts = {
    cz: {
      pageTitle: 'Případové studie',
      pageSubtitle: 'Reálné výsledky od firem, které s Behavera proměnily svou kulturu a retenci.',
      readCta: 'Číst případovku',
      seoDescription: 'Případové studie zákazníků Behavera — konkrétní čísla a výsledky z reálných firem.',
      emptyTitle: 'Žádné případové studie',
      emptyDesc: 'Případové studie se připravují.',
    },
    en: {
      pageTitle: 'Success Stories',
      pageSubtitle: 'Real results from companies using Behavera to transform their culture and retention.',
      readCta: 'Read Case Study',
      seoDescription: 'Behavera customer case studies — real numbers and results from real companies.',
      emptyTitle: 'No case studies yet',
      emptyDesc: 'Case studies are being prepared.',
    },
    de: {
      pageTitle: 'Erfolgsgeschichten',
      pageSubtitle: 'Echte Ergebnisse von Unternehmen, die mit Behavera ihre Kultur und Mitarbeiterbindung transformiert haben.',
      readCta: 'Fallstudie lesen',
      seoDescription: 'Behavera Fallstudien — echte Zahlen und Ergebnisse von echten Unternehmen.',
      emptyTitle: 'Noch keine Fallstudien',
      emptyDesc: 'Fallstudien werden vorbereitet.',
    },
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  useSEO({
    title: t.pageTitle,
    description: t.seoDescription,
    ogType: 'website',
    canonicalUrl: `${SITE_ORIGIN}/case-studies`,
  });

  // Schema.org CollectionPage structured data
  const schemaJson = useMemo(() => {
    if (studies.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t.pageTitle,
      description: t.seoDescription,
      url: `${SITE_ORIGIN}/case-studies`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: studies.length,
        itemListElement: studies.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_ORIGIN}/case-studies/${s.slug}`,
          name: loc(language, s.title_cz, s.title),
        })),
      },
    };
  }, [studies, language, t]);

  useEffect(() => {
    if (schemaJson) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-case-studies', '');
      script.textContent = JSON.stringify(schemaJson);
      document.head.appendChild(script);
      return () => { script.remove(); };
    }
  }, [schemaJson]);

  useEffect(() => {
    CmsService.getCaseStudies()
      .then(data => {
        setStudies(data.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16 space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
              {t.pageSubtitle}
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-brand-border/50 flex flex-col md:flex-row min-h-[400px] overflow-hidden">
                  <div className="md:w-1/2 bg-brand-background-secondary min-h-[250px]" />
                  <div className="md:w-1/2 p-8 md:p-12 space-y-4">
                    <div className="h-4 w-32 bg-brand-border rounded" />
                    <div className="h-8 w-3/4 bg-brand-border rounded" />
                    <div className="h-20 w-full bg-brand-border rounded" />
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="h-12 bg-brand-border rounded" />
                      <div className="h-12 bg-brand-border rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && studies.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <TrendingUp className="w-16 h-16 text-brand-border mx-auto" />
              <h2 className="text-2xl font-bold text-brand-text-primary">{t.emptyTitle}</h2>
              <p className="text-brand-text-secondary">{t.emptyDesc}</p>
            </div>
          )}

          {/* Case study cards */}
          {!loading && studies.length > 0 && (
            <div className="grid gap-8">
              {studies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/case-studies/${study.slug}`}
                    className="group relative bg-white rounded-3xl overflow-hidden border border-brand-border/50 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row min-h-[400px]"
                  >
                    <div className="md:w-1/2 relative overflow-hidden min-h-[250px]">
                      {study.coverImage ? (
                        <img
                          src={study.coverImage}
                          alt={loc(language, study.title_cz, study.title)}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-accent/10 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-brand-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      {/* Industry badge */}
                      {study.industry && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-brand-text-primary border border-brand-border/30">
                          {loc(language, study.industry_cz, study.industry)}
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-brand-primary uppercase tracking-widest">
                            {study.clientName}
                          </span>
                          {study.employeeCount && (
                            <span className="inline-flex items-center gap-1 text-xs text-brand-text-muted bg-brand-background-secondary rounded-full px-2 py-0.5 border border-brand-border/30">
                              <Building2 className="w-3 h-3" /> {study.employeeCount}
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                          {loc(language, study.title_cz, study.title)}
                        </h2>
                        <p className="text-brand-text-secondary text-lg leading-relaxed mb-8 line-clamp-3">
                          {loc(language, study.challenge_cz, study.challenge)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-8 border-t border-brand-border/50 pt-8">
                        {(loc(language, study.results_cz, study.results)).slice(0, 2).map((res, idx) => (
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
