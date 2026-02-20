import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { useSEO } from '@/app/hooks/use-seo';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { useLocalizedPosts } from '@/app/hooks/use-localized-post';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, Sparkles, ChevronDown, X, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SITE_ORIGIN } from '@/lib/urls';
import { blogPostPath } from '@/app/config/routes';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const INITIAL_VISIBLE_POSTS = 6;

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  useSEO({
    title: t.blog.seoTitle,
    description: t.blog.seoDescription,
    keywords: t.blog.seoKeywords,
    ogType: 'website',
    canonicalUrl: `${SITE_ORIGIN}/blog`,
  });

  useEffect(() => {
    CmsService.getPosts().then(data => {
      setPosts(data.filter(Boolean).filter(p => p.status === 'published'));
    });
  }, []);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts by tag
  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) => p.tags?.includes(activeTag));
  }, [posts, activeTag]);

  // Localize titles / excerpts / content to active language
  const localizedPosts = useLocalizedPosts(filteredPosts);

  const featuredPost = localizedPosts[0];
  const remainingPosts = localizedPosts.slice(1);

  const visiblePosts = isExpanded ? remainingPosts : remainingPosts.slice(0, INITIAL_VISIBLE_POSTS);
  const hasMoreToUnfold = remainingPosts.length > INITIAL_VISIBLE_POSTS;

  const modalPost = useMemo(
    () => localizedPosts.find((post) => post.slug === selectedSlug) || null,
    [localizedPosts, selectedSlug]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postFromUrl = params.get('post');
    if (postFromUrl) {
      setSelectedSlug(postFromUrl);
    }
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeArticleModal();
      }
    };

    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [selectedSlug]);

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

  const unfoldLabel =
    language === 'cz'
      ? 'Rozbalit další články'
      : language === 'de'
        ? 'Weitere Artikel aufklappen'
        : 'Unfold more articles';
  const foldLabel =
    language === 'cz'
      ? 'Sbalit zpět'
      : language === 'de'
        ? 'Weniger anzeigen'
        : 'Show less';

  const midCta = {
    cz: {
      title: 'Zajímá vás, jak na tom váš tým doopravdy je?',
      desc: 'Získejte jasný obraz o angažovanosti a spokojenosti vašeho týmu — rychle, anonymně a bez zbytečné administrativy.',
      cta: 'Zjistit více',
    },
    en: {
      title: 'Curious how your team really feels?',
      desc: 'Get a clear picture of your team\'s engagement and satisfaction — quickly, anonymously, and without the admin overhead.',
      cta: 'Learn more',
    },
    de: {
      title: 'Neugierig, wie sich Ihr Team wirklich fühlt?',
      desc: 'Erhalten Sie ein klares Bild über das Engagement und die Zufriedenheit Ihres Teams — schnell, anonym und ohne Verwaltungsaufwand.',
      cta: 'Mehr erfahren',
    },
  };
  const cta = midCta[language] || midCta.en;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page header */}
          <div className="text-center mb-14 space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-brand-text-primary tracking-tight"
            >
              {t.blog.pageTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-brand-text-secondary max-w-xl mx-auto leading-relaxed"
            >
              {t.blog.pageSubtitle}
            </motion.p>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap justify-center gap-2 mb-14"
            >
              <button
                onClick={() => setActiveTag(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTag === null
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 border border-brand-border'
                }`}
              >
                {language === 'cz' ? 'Vše' : language === 'de' ? 'Alle' : 'All'}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTag === tag
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 border border-brand-border'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}

          {/* Featured post — hero style */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-14"
            >
              <button
                type="button"
                onClick={() => openArticleModal(featuredPost.slug)}
                className="group block w-full text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0520] via-[#1a0a42] to-[#25115d] border border-white/10 shadow-[0_30px_80px_-50px_rgba(34,14,87,0.8)]"
              >
                <div className="pointer-events-none absolute -right-24 top-[-40%] h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
                <div className="flex flex-col lg:flex-row relative z-10">
                  <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden relative">
                    {featuredPost.coverImage && (
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0520]/40 lg:block hidden" />
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-brand-accent text-xs font-bold uppercase tracking-wider">
                        {featuredPost.tags[0] || t.blog.defaultTag}
                      </span>
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {estimateReadingTime(featuredPost.content)} {readLabel}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {featuredPost.author.avatar && (
                          <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-8 h-8 rounded-full border-2 border-white/20" />
                        )}
                        <div>
                          <span className="text-xs text-white/70 font-medium block">{featuredPost.author.name}</span>
                          <span className="text-[11px] text-white/40">{format(new Date(featuredPost.publishedAt), 'd. MMM yyyy', { locale })}</span>
                        </div>
                      </div>
                      <span className="text-white/50 group-hover:text-brand-accent transition-colors text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        {language === 'cz' ? 'Unfold článek' : language === 'de' ? 'Artikel entfalten' : 'Unfold article'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Post grid with mid-page CTA */}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post, idx) => (
              <Fragment key={post.id}>
                {/* Insert editorial CTA after 3rd post */}
                {idx === 3 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <div className="relative overflow-hidden rounded-xl bg-brand-background-secondary border border-brand-border p-8 md:p-10 my-2">
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 shrink-0">
                          <BookOpen className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mb-1.5">{cta.title}</h3>
                          <p className="text-sm text-brand-text-secondary leading-relaxed">{cta.desc}</p>
                        </div>
                        <Button onClick={openBooking} variant="outline" size="lg" className="shrink-0 h-11 px-7 text-sm border-brand-primary/20 hover:bg-brand-primary hover:text-white hover:border-brand-primary">
                          {cta.cta}
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <button
                    type="button"
                    onClick={() => openArticleModal(post.slug)}
                    className="group w-full text-left flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary relative">
                      {post.coverImage && (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-brand-primary text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                          {post.tags[0] || t.blog.defaultTag}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col">
                      <h2 className="text-lg font-bold text-brand-text-primary mb-2.5 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-brand-text-secondary text-[13px] leading-relaxed mb-5 line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/60">
                        <div className="flex items-center gap-2">
                          {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />}
                          <span className="text-xs text-brand-text-muted font-medium">{post.author.name}</span>
                        </div>
                        <span className="text-[11px] text-brand-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {estimateReadingTime(post.content)} {readLabel}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              </Fragment>
            ))}
          </div>

          {hasMoreToUnfold && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-brand-border bg-white text-sm font-semibold text-brand-text-primary hover:border-brand-primary/35 hover:text-brand-primary transition-colors"
              >
                {isExpanded ? foldLabel : unfoldLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {modalPost && (
          <BlogQuickViewModal
            post={modalPost}
            onClose={closeArticleModal}
            openFullLabel={language === 'cz' ? 'Otevřít celou stránku' : language === 'de' ? 'Vollseite öffnen' : 'Open full page'}
            closeLabel={language === 'cz' ? 'Zavřít' : language === 'de' ? 'Schließen' : 'Close'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BlogQuickViewModal({
  post,
  onClose,
  openFullLabel,
  closeLabel,
}: {
  post: BlogPost;
  onClose: () => void;
  openFullLabel: string;
  closeLabel: string;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [post.slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9999] p-3 sm:p-6 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#090312]/72 backdrop-blur-md" />

      <motion.div
        key={post.slug}
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1220px] h-[min(92vh,950px)] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_45px_120px_-45px_rgba(42,18,85,0.85)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#12072b] to-transparent pointer-events-none z-20" />
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-brand-accent/20 blur-3xl z-0" />

        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-3">
          <div className="min-w-0 rounded-full bg-black/40 text-white px-3.5 py-1.5 text-xs backdrop-blur-md border border-white/15">
            <span className="block truncate font-medium">{post.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={blogPostPath(post.slug)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white text-brand-text-primary text-xs font-semibold border border-brand-border hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {openFullLabel}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-brand-text-primary border border-brand-border hover:border-brand-primary/40 hover:text-brand-primary transition-colors"
              aria-label={closeLabel}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-brand-primary/25 border-t-brand-primary animate-spin" />
              <p className="text-sm text-brand-text-muted">Loading article…</p>
            </div>
          </div>
        )}

        <iframe
          title={post.title}
          src={`${blogPostPath(post.slug)}?embed=1`}
          className="relative z-10 w-full h-full border-0"
          onLoad={() => setLoading(false)}
        />
      </motion.div>
    </motion.div>
  );
}
