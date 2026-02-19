import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { CaseStudy } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useLanguage } from '@/app/language-context';
import { useSEO } from '@/app/hooks/use-seo';
import { SITE_ORIGIN } from '@/lib/urls';
import { motion } from 'framer-motion';

/** Resolve a localized field with fallback */
function loc<T>(language: string, cz: T | undefined, en: T): T {
  return language === 'cz' && cz ? cz : en;
}

export function CaseStudyPage() {
  const { slug } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const seoTitle = study
    ? loc(language, study.title_cz, study.title)
    : 'Case Study';
  const seoDescription = study
    ? loc(language, study.challenge_cz, study.challenge)
    : 'Customer story from Behavera.';

  useSEO({
    title: seoTitle,
    description: seoDescription,
    ogType: 'article',
    canonicalUrl: slug ? `${SITE_ORIGIN}/case-studies/${slug}` : undefined,
  });

  // Schema.org Article structured data
  const schemaJson = useMemo(() => {
    if (!study) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: loc(language, study.title_cz, study.title),
      description: loc(language, study.challenge_cz, study.challenge),
      image: study.coverImage || undefined,
      datePublished: study.publishedAt,
      publisher: {
        '@type': 'Organization',
        name: 'Behavera',
        url: SITE_ORIGIN,
      },
      about: {
        '@type': 'Organization',
        name: study.clientName,
      },
      url: `${SITE_ORIGIN}/case-studies/${study.slug}`,
    };
  }, [study, language]);

  useEffect(() => {
    if (schemaJson) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-case-study', '');
      script.textContent = JSON.stringify(schemaJson);
      document.head.appendChild(script);
      return () => { script.remove(); };
    }
  }, [schemaJson]);

  useEffect(() => {
    if (slug) {
      CmsService.getCaseStudyBySlug(slug)
        .then(data => {
          setStudy(data || null);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background-primary">
        <Header />
        <div className="flex-1 animate-pulse">
          {/* Hero skeleton */}
          <div className="bg-brand-primary/80 h-[300px] md:h-[400px]" />
          {/* Content skeleton */}
          <div className="container mx-auto px-4 max-w-6xl -mt-16 relative z-30">
            <div className="bg-white rounded-3xl shadow-xl border border-brand-border p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <div className="h-4 w-20 bg-brand-border rounded" />
                  <div className="h-10 w-24 bg-brand-border rounded" />
                  <div className="h-4 w-16 bg-brand-border rounded" />
                  <div className="h-10 w-24 bg-brand-border rounded" />
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="h-6 w-48 bg-brand-border rounded" />
                  <div className="h-24 w-full bg-brand-border rounded" />
                  <div className="h-6 w-48 bg-brand-border rounded" />
                  <div className="h-24 w-full bg-brand-border rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background-primary">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Building2 className="w-16 h-16 text-brand-border mx-auto" />
            <h1 className="text-2xl font-bold text-brand-text-primary">{t.caseStudies.notFound}</h1>
            <Link to="/case-studies" className="inline-flex items-center text-brand-primary font-medium hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t.caseStudies.backToList}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = loc(language, study.title_cz, study.title);
  const challenge = loc(language, study.challenge_cz, study.challenge);
  const solution = loc(language, study.solution_cz, study.solution);
  const content = loc(language, study.content_cz, study.content);
  const industry = loc(language, study.industry_cz, study.industry);
  const results = loc(language, study.results_cz, study.results);

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <article>
            {/* Hero Section */}
            <div className="bg-brand-primary text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-brand-primary/40 to-brand-primary/80 z-10" />
                {study.coverImage && (
                    <img
                      src={study.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="container mx-auto px-4 max-w-6xl relative z-20"
                >
                     <Link to="/case-studies" className="inline-flex items-center text-sm font-medium text-white hover:text-white/90 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.caseStudies.backToList}
                    </Link>
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-brand-accent font-bold uppercase tracking-widest">
                              {study.clientName}
                          </span>
                          {study.employeeCount && (
                            <span className="inline-flex items-center gap-1 text-xs text-white/70 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20">
                              <Building2 className="w-3 h-3" /> {study.employeeCount}
                            </span>
                          )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {title}
                        </h1>
                    </div>
                </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="container mx-auto px-4 max-w-6xl -mt-16 relative z-30"
            >
                <div className="bg-white rounded-3xl shadow-xl border border-brand-border p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Metrics Sidebar */}
                        <div className="md:col-span-1 space-y-8 border-b md:border-b-0 md:border-r border-brand-border pb-8 md:pb-0 md:pr-8">
                             <div>
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-4">{t.caseStudies.resultsLabel}</h3>
                                <div className="space-y-6">
                                    {results.map((res, i) => (
                                        <div key={i}>
                                            <div className="text-4xl font-bold text-brand-primary mb-1">{res.value}</div>
                                            <div className="text-sm text-brand-text-secondary">{res.label}</div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             <div>
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">{t.caseStudies.industryLabel}</h3>
                                <div className="text-lg font-medium text-brand-text-primary">{industry}</div>
                             </div>
                             {study.tags && study.tags.length > 0 && (
                               <div className="flex flex-wrap gap-2">
                                 {study.tags.map((tag, i) => (
                                   <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-background-secondary text-brand-text-secondary border border-brand-border/30">
                                     {tag}
                                   </span>
                                 ))}
                               </div>
                             )}
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-4">{t.caseStudies.challengeTitle}</h2>
                                <p className="text-lg text-brand-text-secondary leading-relaxed">
                                    {challenge}
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-4">{t.caseStudies.solutionTitle}</h2>
                                <p className="text-lg text-brand-text-secondary leading-relaxed">
                                    {solution}
                                </p>
                            </div>

                            <div 
                                className="case-study-content prose prose-lg prose-violet max-w-none text-brand-text-secondary border-t border-brand-border pt-8"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
