import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { useModal } from '@/app/ModalContext';
import { useLocalizedPost } from '@/app/hooks/useLocalizedPost';
import { Button } from '@/app/components/ui/button';

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

  // Localize post fields to active language
  const localizedPost = useLocalizedPost(post);

  useEffect(() => {
    if (slug) {
      CmsService.getPostBySlug(slug).then(data => {
        setPost(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  // Dynamic SEO based on post
  useSEO({
    title: localizedPost?.title || t.blog.title,
    description: localizedPost?.excerpt || t.blog.seoDescription,
    keywords: post?.tags?.join(', ') || t.blog.seoKeywords,
    ogType: 'article',
  });

  const ctaCopy = {
    cz: {
      badge: 'Echo Pulse',
      title: 'Chcete vědět, jak se váš tým cítí?',
      desc: 'Zjistěte to za 3 minuty — anonymně, bez bias, s okamžitými výsledky a doporučeními.',
      cta: 'Domluvit ukázku',
    },
    en: {
      badge: 'Echo Pulse',
      title: 'Want to know how your team feels?',
      desc: 'Find out in 3 minutes — anonymous, unbiased, with instant results and recommendations.',
      cta: 'Book a demo',
    },
    de: {
      badge: 'Echo Pulse',
      title: 'Möchten Sie wissen, wie sich Ihr Team fühlt?',
      desc: 'Finden Sie es in 3 Minuten heraus — anonym, unvoreingenommen, mit sofortigen Ergebnissen.',
      cta: 'Demo buchen',
    },
  };
  const cta = ctaCopy[language] || ctaCopy.en;

  if (loading) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.loading}</div>;
  if (!post || !localizedPost) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.notFound}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-brand-text-muted hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.blog.backToList}
          </Link>

          <header className="mb-12 text-center">
             <div className="flex items-center justify-center gap-2 mb-6">
                {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 leading-tight">
              {localizedPost.title}
            </h1>
            <p className="text-xl md:text-2xl text-brand-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
              {localizedPost.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                    {post.author.avatar && (
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    )}
                    <div className="text-left">
                        <div className="text-sm font-bold text-brand-text-primary">{post.author.name}</div>
                        <div className="text-xs text-brand-text-muted">{post.author.role}</div>
                    </div>
                </div>
                <div className="h-8 w-px bg-brand-border mx-2" />
                <div className="text-sm text-brand-text-muted">
                    {format(new Date(post.publishedAt), 'MMMM d, yyyy', { locale })}
                </div>
            </div>
          </header>

          <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 aspect-[21/9]">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            )}
          </div>

          <div 
            className="prose prose-lg prose-violet mx-auto max-w-none text-brand-text-secondary"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(localizedPost.content) }}
          />

          {/* Bottom CTA — premium style */}
          <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a14] to-[#1a1540] border border-white/10 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-brand-accent" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">{cta.badge}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{cta.title}</h3>
              <p className="text-white/60 text-sm md:text-base mb-8 max-w-lg mx-auto">{cta.desc}</p>
              <Button onClick={openBooking} size="lg" className="h-12 px-8 text-[15px]">
                {cta.cta}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
          
        </article>
      </main>
      <Footer />
    </div>
  );
}
