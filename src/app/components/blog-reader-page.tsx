import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml, extractHeadingsFromHtml } from '@/lib/sanitize';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { useLocalizedPost, useLocalizedPosts } from '@/app/hooks/use-localized-post';
import { getResponsiveImageProps } from '@/lib/image-helpers';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  List,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

/* ─── helpers ─── */

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function scrollToHeading(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;
  heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── types ─── */

interface BlogReaderPageProps {
  slug: string;
  allPosts: BlogPost[];
  onBack: () => void;
}

function SidebarArticleCard({
  post,
  readLabel,
  isActive,
  onClick,
}: {
  post: BlogPost & { title: string; excerpt: string; content: string };
  readLabel: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 transition-all duration-200 group ${
        isActive
          ? 'bg-brand-primary/8 border border-brand-primary/20 shadow-sm'
          : 'hover:bg-brand-background-secondary border border-transparent'
      }`}
    >
      <div className="flex gap-3">
        {post.coverImage && (
          <img
            {...getResponsiveImageProps(post.coverImage, {
              widths: [160, 240, 320],
              sizes: '64px',
            })}
            alt=""
            className="w-16 h-12 rounded-lg object-cover shrink-0"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-[13px] font-semibold leading-snug line-clamp-2 mb-1 transition-colors ${
              isActive
                ? 'text-brand-primary'
                : 'text-brand-text-primary group-hover:text-brand-primary'
            }`}
          >
            {post.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-brand-text-muted">
            {post.tags?.[0] && (
              <span className="text-brand-primary/70 font-medium uppercase tracking-wider">
                {post.tags[0]}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {estimateReadingTime(post.content)} {readLabel}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function BlogReaderPage({ slug, allPosts, onBack }: BlogReaderPageProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  const contentRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'related' | 'all'>('related');

  const currentPost = useMemo(
    () => allPosts.find((p) => p.slug === slug) || null,
    [allPosts, slug],
  );

  const localizedPost = useLocalizedPost(currentPost);

  const relatedRaw = useMemo(() => {
    if (!currentPost) return [];
    return allPosts
      .filter((p) => p.id !== currentPost.id && p.tags?.some((tag) => currentPost.tags?.includes(tag)))
      .slice(0, 6);
  }, [currentPost, allPosts]);

  const relatedPosts = useLocalizedPosts(relatedRaw);

  const otherPosts = useLocalizedPosts(
    useMemo(() => allPosts.filter((p) => p.slug !== slug), [allPosts, slug]),
  );

  const sanitizedContent = useMemo(() => {
    if (!localizedPost) return '';
    return sanitizeHtml(localizedPost.content);
  }, [localizedPost]);

  const headings = useMemo(() => extractHeadingsFromHtml(sanitizedContent), [sanitizedContent]);

  const currentIndex = useMemo(
    () => allPosts.findIndex((p) => p.slug === slug),
    [allPosts, slug],
  );
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const switchArticle = useCallback(
    (newSlug: string) => {
      navigate(`/blog/${newSlug}`, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveHeadingId('');
    },
    [navigate],
  );

  useEffect(() => {
    if (!headings.length || !contentRef.current) return;

    const container = contentRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0.1, 0.5],
      },
    );

    headings.forEach((h) => {
      const el = container.querySelector(`#${CSS.escape(h.id)}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, sanitizedContent, slug]);

  const i18n = {
    cz: {
      relatedTab: 'Doporučené',
      allTab: 'Všechny články',
      toc: 'Obsah',
      prev: 'Předchozí',
      next: 'Další',
      notFound: 'Článek nebyl nalezen.',
      backToList: 'Zpět na články',
    },
    en: {
      relatedTab: 'Suggested',
      allTab: 'All articles',
      toc: 'Contents',
      prev: 'Previous',
      next: 'Next',
      notFound: 'Article not found.',
      backToList: 'Back to articles',
    },
    de: {
      relatedTab: 'Empfohlen',
      allTab: 'Alle Artikel',
      toc: 'Inhalt',
      prev: 'Vorherige',
      next: 'Nächste',
      notFound: 'Artikel nicht gefunden.',
      backToList: 'Zurück zu Artikeln',
    },
  };
  const ui = i18n[language] || i18n.en;

  if (!currentPost || !localizedPost) {
    return (
      <div className="py-16">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-brand-border/50">
          <p className="text-brand-text-secondary mb-4">{ui.notFound}</p>
          <Button onClick={onBack} variant="outline">
            {ui.backToList}
          </Button>
        </div>
      </div>
    );
  }

  const readingTime = estimateReadingTime(localizedPost.content);

  return (
    <div className="bg-white rounded-2xl border border-brand-border/60 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-brand-border/60 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-xs text-brand-text-muted hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {ui.backToList}
          </Link>
          {currentPost.tags?.map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-brand-primary/6 text-brand-primary text-[11px] font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          <span className="text-brand-text-muted text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} {readLabel}
          </span>
          <span className="hidden md:inline text-brand-text-muted text-xs">
            · {localizedPost.author?.name}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => prevPost && switchArticle(prevPost.slug)}
            disabled={!prevPost}
            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={ui.prev}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-brand-text-muted tabular-nums">
            {currentIndex + 1}/{allPosts.length}
          </span>
          <button
            onClick={() => nextPost && switchArticle(nextPost.slug)}
            disabled={!nextPost}
            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={ui.next}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div ref={contentRef} className="flex-1">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12 py-8 md:py-10">
            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 leading-[1.15] tracking-tight">
                {localizedPost.title}
              </h1>
              <p className="text-brand-text-secondary text-[15px] leading-relaxed mb-6">
                {localizedPost.excerpt}
              </p>
              <div className="flex items-center gap-3 pb-6 border-b border-brand-border/50">
                {currentPost.author?.avatar && (
                  <img
                    src={currentPost.author.avatar}
                    alt={currentPost.author.name}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  />
                )}
                <div>
                  <div className="text-sm font-semibold text-brand-text-primary">
                    {currentPost.author?.name}
                  </div>
                  <div className="text-xs text-brand-text-muted">
                    {currentPost.author?.role} ·{' '}
                    {format(new Date(currentPost.publishedAt), 'd. MMMM yyyy', { locale })}
                  </div>
                </div>
              </div>
            </header>

            {currentPost.coverImage && (
              <div className="rounded-xl overflow-hidden shadow-md mb-8 aspect-[2/1]">
                <img
                  src={currentPost.coverImage}
                  alt={localizedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {headings.length > 0 && (
              <details className="lg:hidden mb-6 bg-brand-background-secondary/50 border border-brand-border/50 rounded-xl p-4">
                <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-brand-text-primary">
                  <List className="w-4 h-4 text-brand-primary" />
                  {ui.toc}
                </summary>
                <nav className="mt-3">
                  <ul className="space-y-1">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <button
                          type="button"
                          onClick={() => scrollToHeading(h.id)}
                          className={`w-full text-left text-sm rounded-md px-2 py-1.5 transition-colors ${
                            activeHeadingId === h.id
                              ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                              : 'text-brand-text-secondary hover:bg-brand-background-secondary'
                          } ${h.level === 3 ? 'pl-5' : ''}`}
                        >
                          {h.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            )}

            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <div className="mt-12 rounded-2xl border border-brand-primary/15 bg-gradient-to-br from-brand-primary/4 to-brand-background-secondary p-7 md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/12 text-brand-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-1">
                    {t.blog.endDemoTitle}
                  </h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    {t.blog.endDemoDesc}
                  </p>
                </div>
                <Button
                  onClick={() => openBooking('blog_page_end')}
                  size="lg"
                  className="shrink-0 h-11 px-7"
                >
                  {t.blog.endDemoCta}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border/50 sm:hidden">
              <button
                onClick={() => prevPost && switchArticle(prevPost.slug)}
                disabled={!prevPost}
                className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {ui.prev}
              </button>
              <button
                onClick={() => nextPost && switchArticle(nextPost.slug)}
                disabled={!nextPost}
                className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                {ui.next}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden lg:flex w-[340px] xl:w-[380px] flex-col border-l border-brand-border/60 bg-brand-background-secondary/30 shrink-0">
          <div className="flex border-b border-brand-border/60 shrink-0">
            <button
              onClick={() => setSidebarTab('related')}
              className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                sidebarTab === 'related'
                  ? 'text-brand-primary border-b-2 border-brand-primary bg-white'
                  : 'text-brand-text-muted hover:text-brand-text-primary'
              }`}
            >
              {ui.relatedTab}
            </button>
            <button
              onClick={() => setSidebarTab('all')}
              className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                sidebarTab === 'all'
                  ? 'text-brand-primary border-b-2 border-brand-primary bg-white'
                  : 'text-brand-text-muted hover:text-brand-text-primary'
              }`}
            >
              {ui.allTab}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {sidebarTab === 'related' ? (
              <>
                {headings.length > 0 && (
                  <div className="mb-4 bg-white rounded-xl border border-brand-border/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <List className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-text-primary uppercase tracking-wider">
                        {ui.toc}
                      </span>
                    </div>
                    <nav>
                      <ul className="space-y-0.5">
                        {headings.map((h) => (
                          <li key={h.id}>
                            <button
                              type="button"
                              onClick={() => scrollToHeading(h.id)}
                              className={`w-full text-left text-[12.5px] rounded-md px-2 py-1.5 transition-colors leading-snug ${
                                activeHeadingId === h.id
                                  ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                  : 'text-brand-text-secondary hover:bg-brand-background-secondary'
                              } ${h.level === 3 ? 'pl-5' : ''}`}
                            >
                              {h.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
                {relatedPosts.length === 0 ? (
                  <div className="text-xs text-brand-text-muted px-2">—</div>
                ) : (
                  relatedPosts.map((post) => (
                    <SidebarArticleCard
                      key={post.id}
                      post={post}
                      readLabel={readLabel}
                      isActive={post.slug === slug}
                      onClick={() => switchArticle(post.slug)}
                    />
                  ))
                )}
              </>
            ) : (
              otherPosts.map((post) => (
                <SidebarArticleCard
                  key={post.id}
                  post={post}
                  readLabel={readLabel}
                  isActive={post.slug === slug}
                  onClick={() => switchArticle(post.slug)}
                />
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
