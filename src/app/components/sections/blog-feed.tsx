import { Fragment, useEffect, useMemo, useState } from 'react';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { format, type Locale } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, ChevronDown, X, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { useLocalizedPosts } from '@/app/hooks/use-localized-post';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const INITIAL_VISIBLE = 4;

const translations = {
  cz: {
    badge: 'Blog',
    title: 'Články a',
    highlight: 'insighty',
    subtitle: 'Články o řízení lidí, leadershipu a tom, co ve firmách skutečně funguje.',
    showMore: 'Zobrazit více článků',
    showLess: 'Zobrazit méně',
    readLabel: 'min čtení',
    defaultTag: 'Článek',
    openArticle: 'Číst článek',
  },
  en: {
    badge: 'Blog',
    title: 'Articles &',
    highlight: 'Insights',
    subtitle: 'Articles on people management, leadership, and what actually works in teams.',
    showMore: 'Show more articles',
    showLess: 'Show less',
    readLabel: 'min read',
    defaultTag: 'Article',
    openArticle: 'Read article',
  },
  de: {
    badge: 'Blog',
    title: 'Artikel &',
    highlight: 'Einblicke',
    subtitle: 'Artikel über People Management, Leadership und was in Teams wirklich funktioniert.',
    showMore: 'Mehr Artikel anzeigen',
    showLess: 'Weniger anzeigen',
    readLabel: 'Min. Lesezeit',
    defaultTag: 'Artikel',
    openArticle: 'Artikel lesen',
  },
};

export function BlogFeedSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { language } = useLanguage();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const text = translations[language] || translations.en;

  useEffect(() => {
    CmsService.getPosts().then((data) => {
      setPosts(data.filter(Boolean).filter((p) => p.status === 'published'));
    });
  }, []);

  // Open modal from URL ?post=slug
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('post');
    if (slug) setSelectedSlug(slug);
  }, []);

  // Sync modal with browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get('post'));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Lock body scroll & handle Escape when modal open
  useEffect(() => {
    if (!selectedSlug) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeArticleModal();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [selectedSlug]);

  const localizedPosts = useLocalizedPosts(posts);

  const visiblePosts = isExpanded ? localizedPosts : localizedPosts.slice(0, INITIAL_VISIBLE);
  const hasMore = localizedPosts.length > INITIAL_VISIBLE;

  const selectedPost = useMemo(
    () => localizedPosts.find((p) => p.slug === selectedSlug) || null,
    [localizedPosts, selectedSlug]
  );

  const openArticleModal = (slug: string) => {
    setSelectedSlug(slug);
    const next = new URL(window.location.href);
    next.searchParams.set('post', slug);
    window.history.pushState({}, '', next.toString());
  };

  const closeArticleModal = () => {
    setSelectedSlug(null);
    const next = new URL(window.location.href);
    next.searchParams.delete('post');
    window.history.replaceState({}, '', next.toString());
  };

  if (localizedPosts.length === 0) return null;

  return (
    <section id="blog" className="section-spacing bg-brand-background-primary">
      <div className="container-default max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/[0.04] px-3 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-brand-primary">
                {text.badge}
              </span>
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-text-primary tracking-tight mb-4"
          >
            {text.title}{' '}
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              {text.highlight}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-brand-text-secondary max-w-xl mx-auto leading-relaxed"
          >
            {text.subtitle}
          </motion.p>
        </div>

        {/* Post Grid — 2 columns */}
        <div className="grid gap-6 md:grid-cols-2">
          {visiblePosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: Math.min(idx * 0.08, 0.3) }}
            >
              <button
                type="button"
                onClick={() => openArticleModal(post.slug)}
                className="group w-full text-left flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary relative">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-brand-primary text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                      {post.tags?.[0] || text.defaultTag}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <h3 className="text-lg font-bold text-brand-text-primary mb-2.5 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-brand-text-secondary text-[13px] leading-relaxed mb-5 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/60">
                    <div className="flex items-center gap-2">
                      {post.author?.avatar && (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-xs text-brand-text-muted font-medium">
                        {post.author?.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {estimateReadingTime(post.content)} {text.readLabel}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Show More / Less */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-brand-border bg-white text-sm font-semibold text-brand-text-primary hover:border-brand-primary/35 hover:text-brand-primary transition-colors"
            >
              {isExpanded ? text.showLess : text.showMore}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Article Popup Modal */}
      <AnimatePresence>
        {selectedPost && (
          <BlogArticleModal
            post={selectedPost}
            onClose={closeArticleModal}
            locale={locale}
            readLabel={text.readLabel}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Blog Article Modal ── */

function BlogArticleModal({
  post,
  onClose,
  locale,
  readLabel,
}: {
  post: BlogPost;
  onClose: () => void;
  locale: Locale;
  readLabel: string;
}) {
  const html = useMemo(() => sanitizeHtml(post.content), [post.content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] p-3 sm:p-6 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#090312]/72 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1080px] h-[min(92vh,940px)] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_45px_120px_-45px_rgba(42,18,85,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand-accent/20 blur-3xl z-0" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-brand-text-primary border border-brand-border hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 h-full overflow-y-auto p-6 md:p-8 lg:p-10">
          <div className="max-w-3xl mx-auto">
            {/* Tags + reading time */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-brand-primary/6 text-brand-primary text-[11px] font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
              <span className="text-brand-text-muted text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {estimateReadingTime(post.content)} {readLabel}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-4xl font-bold text-brand-text-primary mb-5 leading-tight">
              {post.title}
            </h3>

            {/* Author */}
            <div className="flex items-center gap-3 mb-6">
              {post.author?.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full"
                />
              )}
              <div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  {post.author?.name}
                </div>
                <div className="text-xs text-brand-text-muted">
                  {format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale })}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="rounded-xl overflow-hidden shadow-md mb-8 aspect-[2/1]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
