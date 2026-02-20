import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml, extractHeadingsFromHtml, type BlogHeading } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  List,
  Target,
  Download,
} from 'lucide-react';
import { useSEO } from '@/app/hooks/use-seo';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { useLocalizedPost, useLocalizedPosts } from '@/app/hooks/use-localized-post';
import { Button } from '@/app/components/ui/button';
import {
  trackBlogCtaClick,
  trackBlogCtaView,
  trackBlogDepth,
  trackBlogTocClick,
} from '@/lib/analytics';
import { SITE_ORIGIN } from '@/lib/urls';
import { ROUTES, blogPostPath } from '@/app/config/routes';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function splitContentForMidLead(html: string, headings: BlogHeading[]) {
  const h2s = headings.filter((h) => h.level === 2);
  const targetId = h2s[1]?.id || headings[1]?.id;
  if (!targetId) {
    return { before: html, after: '', showMidLead: false };
  }

  const idIndex = html.indexOf(`id="${targetId}"`);
  if (idIndex < 0) {
    return { before: html, after: '', showMidLead: false };
  }

  const tagStart = html.lastIndexOf('<', idIndex);
  if (tagStart < 0) {
    return { before: html, after: '', showMidLead: false };
  }

  return {
    before: html.slice(0, tagStart),
    after: html.slice(tagStart),
    showMidLead: true,
  };
}

function scrollToHeading(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;

  const y = heading.getBoundingClientRect().top + window.scrollY - 110;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [articleProgress, setArticleProgress] = useState(0);
  const { t, language } = useLanguage();
  const { openBooking, openSignup } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  const articleRef = useRef<HTMLElement | null>(null);
  const midLeadRef = useRef<HTMLDivElement | null>(null);
  const endDemoRef = useRef<HTMLDivElement | null>(null);
  const railLeadRef = useRef<HTMLDivElement | null>(null);
  const depthMilestones = useRef<Set<number>>(new Set());
  const ctaViewsFired = useRef<Set<string>>(new Set());

  const localizedPost = useLocalizedPost(post);

  useEffect(() => {
    if (slug) {
      CmsService.getPostBySlug(slug).then((data) => {
        setPost(data || null);
        setLoading(false);
      });
    }
    CmsService.getPosts().then((data) => {
      setAllPosts(data.filter(Boolean).filter((p) => p.status === 'published'));
    });
  }, [slug]);

  const relatedRaw = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter((p) => p.id !== post.id && p.tags?.some((tag) => post.tags?.includes(tag)))
      .slice(0, 3);
  }, [post, allPosts]);

  const relatedPosts = useLocalizedPosts(relatedRaw);

  useSEO({
    title: localizedPost?.title || t.blog.title,
    description: localizedPost?.excerpt || t.blog.seoDescription,
    keywords: post?.tags?.join(', ') || t.blog.seoKeywords,
    ogType: 'article',
    ogImage: post?.coverImage,
    canonicalUrl: slug ? `${SITE_ORIGIN}/blog/${slug}` : `${SITE_ORIGIN}/blog`,
  });

  const sanitizedContent = useMemo(() => {
    if (!localizedPost) return '';
    return sanitizeHtml(localizedPost.content);
  }, [localizedPost]);

  const headings = useMemo(() => extractHeadingsFromHtml(sanitizedContent), [sanitizedContent]);

  const segmentedContent = useMemo(() => {
    return splitContentForMidLead(sanitizedContent, headings);
  }, [sanitizedContent, headings]);

  useEffect(() => {
    depthMilestones.current.clear();
    ctaViewsFired.current.clear();
    setArticleProgress(0);
    setActiveHeadingId('');
  }, [slug]);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, sanitizedContent]);

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug;
    const updateProgress = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const rect = el.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = el.offsetHeight;
      const viewportOffset = window.scrollY + window.innerHeight * 0.3;
      const raw = ((viewportOffset - articleTop) / articleHeight) * 100;
      const bounded = Math.max(0, Math.min(100, raw));
      setArticleProgress(bounded);

      const milestones: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (bounded >= milestone && !depthMilestones.current.has(milestone)) {
          depthMilestones.current.add(milestone);
          trackBlogDepth(currentSlug, milestone);
        }
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [slug, sanitizedContent]);

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug; // narrow for TS

    const ctas: Array<{
      key: string;
      ref: RefObject<HTMLDivElement>;
      type: 'lead' | 'demo';
      position: 'mid' | 'end' | 'rail';
    }> = [
      { key: 'mid-lead', ref: midLeadRef, type: 'lead', position: 'mid' },
      { key: 'end-demo', ref: endDemoRef, type: 'demo', position: 'end' },
      { key: 'rail-lead', ref: railLeadRef, type: 'lead', position: 'rail' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = (entry.target as HTMLElement).dataset.ctaKey;
          if (!key) return;
          const cta = ctas.find((item) => item.key === key);
          if (!cta || ctaViewsFired.current.has(key)) return;

          ctaViewsFired.current.add(key);
          trackBlogCtaView(cta.type, currentSlug, cta.position);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.4 }
    );

    ctas.forEach((cta) => {
      if (cta.ref.current) {
        cta.ref.current.dataset.ctaKey = cta.key;
        observer.observe(cta.ref.current);
      }
    });

    return () => observer.disconnect();
  }, [slug, segmentedContent.showMidLead]);

  if (loading) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.loading}</div>;
  if (!post || !localizedPost) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.notFound}</div>;

  const readingTime = estimateReadingTime(localizedPost.content);

  const handleLeadClick = (position: 'mid' | 'rail') => {
    if (!slug) return;
    trackBlogCtaClick('lead', slug, position);
    openSignup(`blog_${position}_lead`);
  };

  const handleDemoClick = () => {
    if (!slug) return;
    trackBlogCtaClick('demo', slug, 'end');
    openBooking('blog_end_demo');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link to={ROUTES.blog} className="inline-flex items-center text-sm font-medium text-brand-text-muted hover:text-brand-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
              {t.blog.backToList}
            </Link>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 xl:gap-14 items-start">
            <article ref={articleRef} className="max-w-3xl" aria-label={localizedPost.title}>
              <header className="mb-10">
                <div className="flex items-center flex-wrap gap-3 mb-5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/6 text-brand-primary text-[11px] font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  <span className="text-brand-text-muted text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime} {readLabel}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-brand-text-primary mb-5 leading-[1.15] tracking-tight">
                  {localizedPost.title}
                </h1>

                <p className="blog-article-lead mb-7">{localizedPost.excerpt}</p>

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

              {post.coverImage && (
                <div className="rounded-xl overflow-hidden shadow-lg mb-10 aspect-[2/1]">
                  <img src={post.coverImage} alt={localizedPost.title} className="w-full h-full object-cover" />
                </div>
              )}

              {headings.length > 0 && (
                <details className="lg:hidden mb-6 bg-white border border-brand-border rounded-xl p-4" open>
                  <summary className="cursor-pointer flex items-center justify-between text-sm font-semibold text-brand-text-primary">
                    <span className="inline-flex items-center gap-2">
                      <List className="w-4 h-4 text-brand-primary" />
                      {t.blog.tocTitle}
                    </span>
                  </summary>
                  <nav className="mt-3">
                    <ul className="space-y-1.5">
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <button
                            type="button"
                            onClick={() => {
                              trackBlogTocClick(slug || 'unknown', heading.id);
                              scrollToHeading(heading.id);
                            }}
                            className={`w-full text-left text-sm rounded-md px-2 py-1.5 transition-colors ${
                              activeHeadingId === heading.id
                                ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                : 'text-brand-text-secondary hover:bg-brand-background-secondary'
                            } ${heading.level === 3 ? 'pl-5' : ''}`}
                          >
                            {heading.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
              )}

              <div
                className="blog-article-content"
                dangerouslySetInnerHTML={{ __html: segmentedContent.before }}
              />

              {segmentedContent.showMidLead && (
                <div ref={midLeadRef} className="my-10 rounded-2xl border border-brand-border bg-white p-6 md:p-7 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-[0.14em] text-brand-text-muted font-semibold mb-2">{t.blog.midLeadLabel}</div>
                      <h3 className="text-lg font-bold text-brand-text-primary mb-2 leading-snug">{t.blog.midLeadTitle}</h3>
                      <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">{t.blog.midLeadDesc}</p>
                      <Button onClick={() => handleLeadClick('mid')} variant="outline" className="h-10 border-brand-primary/25 hover:bg-brand-primary hover:text-white hover:border-brand-primary">
                        {t.blog.midLeadCta}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {segmentedContent.after && (
                <div
                  className="blog-article-content"
                  dangerouslySetInnerHTML={{ __html: segmentedContent.after }}
                />
              )}

              <div ref={endDemoRef} className="mt-14 rounded-2xl border border-brand-border bg-brand-background-secondary p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/12 text-brand-primary flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-xs uppercase tracking-[0.14em] text-brand-text-muted font-semibold mb-2">{t.blog.endDemoLabel}</div>
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-1.5">{t.blog.endDemoTitle}</h3>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">{t.blog.endDemoDesc}</p>
                  </div>
                  <Button onClick={handleDemoClick} size="lg" className="shrink-0 h-11 px-7">
                    {t.blog.endDemoCta}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block sticky top-28">
              <div className="space-y-4">
                <div className="bg-white border border-brand-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <List className="w-4 h-4 text-brand-primary" />
                    <h2 className="text-sm font-semibold text-brand-text-primary">{t.blog.tocTitle}</h2>
                  </div>
                  {headings.length > 0 ? (
                    <nav aria-label={t.blog.tocTitle}>
                      <ul className="space-y-1.5">
                        {headings.map((heading) => (
                          <li key={heading.id}>
                            <button
                              type="button"
                              onClick={() => {
                                trackBlogTocClick(slug || 'unknown', heading.id);
                                scrollToHeading(heading.id);
                              }}
                              className={`w-full text-left text-sm rounded-md px-2 py-1.5 transition-colors ${
                                activeHeadingId === heading.id
                                  ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                  : 'text-brand-text-secondary hover:bg-brand-background-secondary'
                              } ${heading.level === 3 ? 'pl-5' : ''}`}
                            >
                              {heading.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ) : (
                    <p className="text-sm text-brand-text-muted">{t.blog.tocEmpty}</p>
                  )}
                </div>

                <div className="bg-white border border-brand-border rounded-2xl p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-brand-text-secondary font-medium">{t.blog.progressLabel}</span>
                    <span className="text-brand-text-primary font-semibold">{Math.round(articleProgress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-background-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-150"
                      style={{ width: `${articleProgress}%` }}
                    />
                  </div>
                </div>

                <div ref={railLeadRef} className="bg-white border border-brand-border rounded-2xl p-4">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-brand-text-muted font-semibold mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                    {t.blog.railLeadLabel}
                  </div>
                  <h3 className="text-sm font-semibold text-brand-text-primary leading-snug mb-2">{t.blog.railLeadTitle}</h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed mb-3">{t.blog.railLeadDesc}</p>
                  <Button onClick={() => handleLeadClick('rail')} variant="outline" className="w-full h-9 text-xs border-brand-primary/25 hover:bg-brand-primary hover:text-white hover:border-brand-primary">
                    {t.blog.railLeadCta}
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 mt-16">
            <h2 className="text-xl font-bold text-brand-text-primary mb-7">
              {t.blog.relatedLabel}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={blogPostPath(rp.slug)}
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
