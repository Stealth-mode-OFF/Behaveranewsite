import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { CaseStudy } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/LanguageContext';
import { useSEO } from '@/app/hooks/useSEO';

export function CaseStudyPage() {
  const { slug } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const seoTitle = study?.title || 'Case Study';
  const seoDescription = study?.challenge || 'Customer story from Echo Pulse.';

  useSEO({
    title: seoTitle,
    description: seoDescription,
    ogType: 'article',
  });

  useEffect(() => {
    if (slug) {
      CmsService.getCaseStudyBySlug(slug).then(data => {
        setStudy(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.caseStudies.loading}</div>;
  if (!study) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.caseStudies.notFound}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <article>
            {/* Hero Section */}
            <div className="bg-brand-primary text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary mix-blend-multiply opacity-90 z-10" />
                {study.coverImage && (
                    <img src={study.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="container mx-auto px-4 max-w-6xl relative z-20">
                     <Link to="/case-studies" className="inline-flex items-center text-sm font-medium text-white hover:text-white/90 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.caseStudies.backToList}
                    </Link>
                    <div className="max-w-4xl">
                        <div className="text-brand-accent font-bold uppercase tracking-widest mb-4">
                            {study.clientName}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {language === 'cz' && study.title_cz ? study.title_cz : study.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-16 relative z-30">
                <div className="bg-white rounded-3xl shadow-xl border border-brand-border p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Metrics Sidebar */}
                        <div className="md:col-span-1 space-y-8 border-b md:border-b-0 md:border-r border-brand-border pb-8 md:pb-0 md:pr-8">
                             <div>
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-4">{t.caseStudies.resultsLabel}</h3>
                                <div className="space-y-6">
                                    {(language === 'cz' && study.results_cz ? study.results_cz : study.results).map((res, i) => (
                                        <div key={i}>
                                            <div className="text-4xl font-bold text-brand-primary mb-1">{res.value}</div>
                                            <div className="text-sm text-brand-text-secondary">{res.label}</div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             <div>
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">{t.caseStudies.industryLabel}</h3>
                                <div className="text-lg font-medium text-brand-text-primary">{language === 'cz' && study.industry_cz ? study.industry_cz : study.industry}</div>
                             </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-4">{t.caseStudies.challengeTitle}</h2>
                                <p className="text-lg text-brand-text-secondary leading-relaxed">
                                    {language === 'cz' && study.challenge_cz ? study.challenge_cz : study.challenge}
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-4">{t.caseStudies.solutionTitle}</h2>
                                <p className="text-lg text-brand-text-secondary leading-relaxed">
                                    {language === 'cz' && study.solution_cz ? study.solution_cz : study.solution}
                                </p>
                            </div>

                            <div 
                                className="case-study-content prose prose-lg prose-violet max-w-none text-brand-text-secondary border-t border-brand-border pt-8"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(language === 'cz' && study.content_cz ? study.content_cz : study.content) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
