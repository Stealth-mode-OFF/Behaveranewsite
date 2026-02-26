import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml, extractHeadingsFromHtml, type BlogHeading } from '@/lib/sanitize';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { useLocalizedPost, useLocalizedPosts } from '@/app/hooks/use-localized-post';
import { getResponsiveImageProps } from '@/lib/image-helpers';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronRight,
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

function scrollToHeading(id: string, container: HTMLElement | null) {
  if (!container) return;
  const heading = container.querySelector(`#${CSS.escape(id)}`);
  if (!heading) return;
  heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── types ─── */

interface BlogReaderModalProps {
  slug: string;
  allPosts: BlogPost[];
  onClose: () => void;
}

/* ─── sidebar card ─── */

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
            src={post.coverImage}
            alt=""
            className="w-16 h-12 rounded-lg object-cover shrink-0"
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

/* ─── main modal ─── */

export function BlogReaderModal({ slug, allPosts, onClose }: BlogReaderModalProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  const contentRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'related' | 'all'>('related');

  // Find current post
  const currentPost = useMemo(
    () => allPosts.find((p) => p.slug === slug) || null,
    [allPosts, slug],
  );

  const localizedPost = useLocalizedPost(currentPost);

  // Related posts (same tags)
  const relatedRaw = useMemo(() => {
    if (!currentPost) return [];
    return allPosts
      .filter((p) => p.id !== currentPost.id && p.tags?.some((tag) => currentPost.tags?.includes(tag)))
      .slice(0, 6);
  }, [currentPost, allPosts]);

  const relatedPosts = useLocalizedPosts(relatedRaw);

  // All other posts (excluding current)
  const otherPosts = useLocalizedPosts(
    useMemo(() => allPosts.filter((p) => p.slug !== slug), [allPosts, slug]),
  );

  // Sanitize content & extract headings
  const sanitizedContent = useMemo(() => {
    if (!localizedPost) return '';
    return sanitizeHtml(localizedPost.content);
  }, [localizedPost]);

  const headings = useMemo(() => extractHeadingsFromHtml(sanitizedContent), [sanitizedContent]);

  // Next/prev navigation
  const currentIndex = useMemo(
    () => allPosts.findIndex((p) => p.slug === slug),
    [allPosts, slug],
  );
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Switch article (navigate within modal)
  const switchArticle = useCallback(
    (newSlug: string) => {
      navigate(`/blog/${newSlug}`, { replace: true });
      // Scroll content to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      setActiveHeadingId('');
    },
    [navigate],
  );

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Heading intersection observer
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
        root: container,
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

  // i18n labels
  const i18n = {
    cz: {
      close: 'Zavřít',
      relatedTab: 'Doporučené',
      allTab: 'Všechny články',
      suggestedTitle: 'Doporučené články',
      allArticlesTitle: 'Další články',
      toc: 'Obsah',
      prev: 'Předchozí',
      next: 'Další',
      bookDemo: 'Domluvit demo',
      readArticle: 'Číst článek',
      notFound: 'Článek nebyl nalezen.',
      backToList: 'Zpět na články',
    },
    en: {
      close: 'Close',
      relatedTab: 'Suggested',
      allTab: 'All articles',
      suggestedTitle: 'Suggested articles',
      allArticlesTitle: 'More articles',
      toc: 'Contents',
      prev: 'Previous',
      next: 'Next',
      bookDemo: 'Book a demo',
      readArticle: 'Read article',
      notFound: 'Article not found.',
      backToList: 'Back to articles',
    },
    de: {
      close: 'Schließen',
      relatedTab: 'Empfohlen',
      allTab: 'Alle Artikel',
      suggestedTitle: 'Empfohlene Artikel',
      allArticlesTitle: 'Weitere Artikel',
      toc: 'Inhalt',
      prev: 'Vorherige',
      next: 'Nächste',
      bookDemo: 'Demo buchen',
      readArticle: 'Artikel lesen',
      notFound: 'Artikel nicht gefunden.',
      backToList: 'Zurück zu Artikeln',
    },
  };
  const ui = i18n[language] || i18n.en;

  if (!currentPost || !localizedPost) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0D0118]/50 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <div className="bg-white rounded-2xl p-10 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <p className="text-brand-text-secondary mb-4">{ui.notFound}</p>
          <Button onClick={onClose} variant="outline">
            {ui.backToList}
          </Button>
        </div>
      </motion.div>
    );
  }

  const readingTime = estimateReadingTime(localizedPost.content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0D0118]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8 bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(13,1,24,0.4)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-brand-border/60 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
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
          <div className="flex items-center gap-2">
            {/* Prev/next nav */}
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
            <div className="w-px h-5 bg-brand-border/60 hidden sm:block" />
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 text-brand-text-muted hover:bg-black/10 hover:text-brand-text-primary transition-all"
              title={ui.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Article content — scrollable */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto scroll-smooth"
          >
            <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12 py-8 md:py-10">
              {/* Article header */}
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
                      {...getResponsiveImageProps(currentPost.author.avatar, {
                        widths: [72, 96],
                        sizes: '36px',
                      })}
                      alt={currentPost.author.name}
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                      loading="lazy"
                      decoding="async"
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

              {/* Cover image */}
              {currentPost.coverImage && (
                <div className="rounded-xl overflow-hidden shadow-md mb-8 aspect-[2/1]">
                  <img
                    {...getResponsiveImageProps(currentPost.coverImage, {
                      widths: [720, 960, 1280],
                      sizes: '(max-width: 1024px) 100vw, 900px',
                    })}
                    alt={localizedPost.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              {/* Mobile table of contents */}
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
                            onClick={() => scrollToHeading(h.id, contentRef.current)}
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

              {/* Article content */}
              <div
                className="blog-article-content"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* End CTA */}
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
                    onClick={() => openBooking('blog_modal_end')}
                    size="lg"
                    className="shrink-0 h-11 px-7"
                  >
                    {t.blog.endDemoCta}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Mobile next/prev */}
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

          {/* Right sidebar — desktop only */}
          <aside className="hidden lg:flex w-[340px] xl:w-[380px] flex-col border-l border-brand-border/60 bg-brand-background-secondary/30 shrink-0">
            {/* Sidebar tabs */}
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

            {/* Sidebar content — scrollable */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
              {sidebarTab === 'related' ? (
                <>
                  {/* Table of contents */}
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
                                onClick={() => scrollToHeading(h.id, contentRef.current)}
                                className={`w-full text-left text-[12.5px] rounded-md px-2 py-1.5 transition-colors leading-snug ${
                                  activeHeadingId === h.id
                                    ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                    : 'text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-text-primary'
                                } ${h.level === 3 ? 'pl-4' : ''}`}
                              >
                                {h.text}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  )}

                  {/* Related articles */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider px-1 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-primary/60" />
                      {ui.suggestedTitle}
                    </h3>
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map((rp) => (
                        <SidebarArticleCard
                          key={rp.id}
                          post={rp}
                          readLabel={readLabel}
                          isActive={rp.slug === slug}
                          onClick={() => switchArticle(rp.slug)}
                        />
                      ))
                    ) : (
                      // Fallback: show some other posts when no tag matches
                      otherPosts.slice(0, 5).map((op) => (
                        <SidebarArticleCard
                          key={op.id}
                          post={op}
                          readLabel={readLabel}
                          isActive={op.slug === slug}
                          onClick={() => switchArticle(op.slug)}
                        />
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider px-1 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-brand-primary/60" />
                    {ui.allArticlesTitle}
                  </h3>
                  {otherPosts.map((op) => (
                    <SidebarArticleCard
                      key={op.id}
                      post={op}
                      readLabel={readLabel}
                      isActive={op.slug === slug}
                      onClick={() => switchArticle(op.slug)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="shrink-0 p-4 border-t border-brand-border/60">
              <Button
                onClick={() => openBooking('blog_sidebar_cta')}
                className="w-full h-10 text-xs bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                {ui.bookDemo}
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}
