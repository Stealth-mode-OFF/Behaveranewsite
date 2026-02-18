import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { useModal } from '@/app/ModalContext';
import { useLocalizedPost, useLocalizedPosts } from '@/app/hooks/useLocalizedPost';
import { Button } from '@/app/components/ui/button';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  // Localize post fields to active language
  const localizedPost = useLocalizedPost(post);

  useEffect(() => {
    if (slug) {
      CmsService.getPostBySlug(slug).then(data => {
        setPost(data || null);
        setLoading(false);
      });
    }
    CmsService.getPosts().then(data => {
      setAllPosts(data.filter(Boolean).filter(p => p.status === 'published'));
    });
  }, [slug]);

  // Related posts: same tag, different post, max 3
  const relatedRaw = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(p => p.id !== post.id && p.tags?.some(tag => post.tags?.includes(tag)))
      .slice(0, 3);
  }, [post, allPosts]);

  const relatedPosts = useLocalizedPosts(relatedRaw);

  const relatedLabel = language === 'cz' ? 'Další články k tématu' : language === 'de' ? 'Weitere Artikel zum Thema' : 'Related articles';

  // Dynamic SEO based on post
  useSEO({
    title: localizedPost?.title || t.blog.title,
    description: localizedPost?.excerpt || t.blog.seoDescription,
    keywords: post?.tags?.join(', ') || t.blog.seoKeywords,
    ogType: 'article',
  });

  const ctaCopy = {
    cz: {
      title: 'Zajímá vás, jak tohle téma řešit ve vašem týmu?',
      desc: 'Získejte jasný přehled o náladě, motivaci a spokojenosti vašich lidí — jednoduše a anonymně.',
      cta: 'Zjistit více',
    },
    en: {
      title: 'Want to explore this topic with your team?',
      desc: 'Get a clear picture of your team\'s mood, motivation and satisfaction — simply and anonymously.',
      cta: 'Learn more',
    },
    de: {
      title: 'Möchten Sie dieses Thema in Ihrem Team vertiefen?',
      desc: 'Erhalten Sie ein klares Bild von Stimmung, Motivation und Zufriedenheit Ihres Teams — einfach und anonym.',
      cta: 'Mehr erfahren',
    },
  };
  const cta = ctaCopy[language] || ctaCopy.en;

  if (loading) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.loading}</div>;
  if (!post || !localizedPost) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.notFound}</div>;

  const readingTime = estimateReadingTime(localizedPost.content);

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4">
          {/* Back navigation */}
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-brand-text-muted hover:text-brand-primary mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            {t.blog.backToList}
          </Link>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-[11px] font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
              <span className="text-brand-text-muted text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} {readLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-brand-text-primary mb-5 leading-[1.2] tracking-tight">
              {localizedPost.title}
            </h1>
            <p className="text-lg text-brand-text-secondary leading-relaxed mb-7">
              {localizedPost.excerpt}
            </p>
            <div className="flex items-center gap-3 pb-7 border-b border-brand-border/60">
              {post.author.avatar && (
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              )}
              <div>
                <div className="text-sm font-semibold text-brand-text-primary">{post.author.name}</div>
                <div className="text-xs text-brand-text-muted">
                  {post.author.role} · {format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale })}
                </div>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden shadow-lg mb-10 aspect-[2/1]">
              <img src={post.coverImage} alt={localizedPost.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article body */}
          <div 
            className="prose prose-lg prose-violet mx-auto max-w-none text-brand-text-secondary leading-[1.8]
              prose-headings:text-brand-text-primary prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:mb-5 prose-p:leading-[1.75]
              prose-blockquote:border-l-brand-primary prose-blockquote:bg-brand-primary/[0.03] prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-brand-text-secondary
              prose-li:marker:text-brand-primary
              prose-a:text-brand-primary prose-a:underline-offset-2
              prose-strong:text-brand-text-primary prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(localizedPost.content) }}
          />

          {/* Bottom CTA — subtle editorial style */}
          <div className="mt-14 rounded-xl bg-brand-background-secondary border border-brand-border p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 shrink-0">
                <BookOpen className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-1.5">{cta.title}</h3>
                <p className="text-sm text-brand-text-secondary leading-relaxed">{cta.desc}</p>
              </div>
              <Button onClick={openBooking} variant="outline" size="lg" className="shrink-0 h-11 px-7 text-sm border-brand-primary/20 hover:bg-brand-primary hover:text-white hover:border-brand-primary">
                {cta.cta}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 mt-16">
            <h2 className="text-xl font-bold text-brand-text-primary mb-7">{relatedLabel}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map(rp => (
                <Link 
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary">
                    {rp.coverImage && (
                      <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider mb-1.5">{rp.tags[0]}</span>
                    <h3 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug mb-2">{rp.title}</h3>
                    <span className="text-[11px] text-brand-text-muted mt-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {estimateReadingTime(rp.content)} {readLabel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
