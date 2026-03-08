import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import { ArrowRight, Clock, BookOpen, Search, X, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { BlogReaderModal } from '@/app/components/blog-reader-modal';
import { BlogReaderPage } from '@/app/components/blog-reader-page';
import { getResponsiveImageProps } from '@/lib/image-helpers';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  const i18n = {
    cz: {
      all: 'Vše',
      readArticle: 'Číst článek',
      search: 'Hledat články…',
      noResults: 'Žádné články neodpovídají vašemu hledání.',
      clearFilters: 'Zobrazit vše',
      articlesCount: (n: number) => `${n} ${n === 1 ? 'článek' : n < 5 ? 'články' : 'článků'}`,
    },
    en: {
      all: 'All',
      readArticle: 'Read article',
      search: 'Search articles…',
      noResults: 'No articles match your search.',
      clearFilters: 'Show all',
      articlesCount: (n: number) => `${n} article${n !== 1 ? 's' : ''}`,
    },
    de: {
      all: 'Alle',
      readArticle: 'Artikel lesen',
      search: 'Artikel suchen…',
      noResults: 'Keine Artikel gefunden.',
      clearFilters: 'Alle anzeigen',
      articlesCount: (n: number) => `${n} Artikel`,
    },
  };
  const ui = i18n[language] || i18n.en;

  useSEO({
    title: t.blog.seoTitle,
    description: t.blog.seoDescription,
    keywords: t.blog.seoKeywords,
    ogType: 'website',
  });

  useEffect(() => {
    CmsService.getPosts().then(data => {
      setPosts(data.filter(Boolean).filter(p => p.status === 'published'));
      setLoading(false);
    });
  }, []);

  // Extract unique tags with counts
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach(p => p.tags?.forEach(tag => tagMap.set(tag, (tagMap.get(tag) || 0) + 1)));
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // Filter posts by tag and search query
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.title_cz && p.title_cz.toLowerCase().includes(q)) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.excerpt_cz && p.excerpt_cz.toLowerCase().includes(q)) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeTag, searchQuery]);

  // Localize titles / excerpts / content to active language
  const localizedPosts = useLocalizedPosts(filteredPosts);

  if (slug && loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background-primary">
        <Header />
        <main className="flex-1 pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="py-20 text-center text-brand-text-muted">Načítám článek…</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (slug && posts.length > 0) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background-primary">
        <Header />
        <main className="flex-1 pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <BlogReaderPage slug={slug} allPosts={posts} onBack={() => navigate('/blog')} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredPost = localizedPosts[0];
  const remainingPosts = localizedPosts.slice(1);

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
          <div className="text-center mb-10 space-y-4">
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

          {/* Search + Tag filters bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-12"
          >
            {/* Search bar */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={ui.search}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-brand-border bg-white text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tag pills */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTag === null
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 border border-brand-border'
                  }`}
                >
                  {ui.all}
                </button>
                {allTags.map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeTag === tag
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 border border-brand-border'
                    }`}
                  >
                    {tag}
                    <span className="ml-1.5 text-[11px] opacity-60">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Results count */}
            {!loading && (activeTag || searchQuery) && (
              <div className="text-center mt-4 text-sm text-brand-text-muted">
                {ui.articlesCount(localizedPosts.length)}
                {(activeTag || searchQuery) && (
                  <button
                    onClick={() => { setActiveTag(null); setSearchQuery(''); }}
                    className="ml-2 text-brand-primary hover:underline"
                  >
                    {ui.clearFilters}
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Featured post — hero style */}
          {!loading && featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-14"
            >
              <button
                onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0520] to-[#1e0a4e] border border-white/10 w-full text-left cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden relative">
                    {featuredPost.coverImage && (
                      <img
                        {...getResponsiveImageProps(featuredPost.coverImage, {
                          widths: [640, 960, 1280, 1600],
                          sizes: '(max-width: 1024px) 100vw, 50vw',
                        })}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
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
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {featuredPost.author.avatar && (
                          <img
                            {...getResponsiveImageProps(featuredPost.author.avatar, {
                              widths: [64, 96],
                              sizes: '32px',
                            })}
                            alt={featuredPost.author.name}
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div>
                          <span className="text-xs text-white/70 font-medium block">{featuredPost.author.name}</span>
                          <span className="text-[11px] text-white/40">{format(new Date(featuredPost.publishedAt), 'd. MMM yyyy', { locale })}</span>
                        </div>
                      </div>
                      <span className="text-white/40 group-hover:text-brand-accent transition-colors text-sm flex items-center gap-1.5">
                        {ui.readArticle}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && localizedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/5 mb-5">
                <Search className="w-7 h-7 text-brand-primary/40" />
              </div>
              <p className="text-brand-text-secondary text-lg mb-4">{ui.noResults}</p>
              <button
                onClick={() => { setActiveTag(null); setSearchQuery(''); }}
                className="text-brand-primary font-medium hover:underline"
              >
                {ui.clearFilters}
              </button>
            </motion.div>
          )}

          {/* Post grid with mid-page CTA */}
          {!loading && remainingPosts.length > 0 && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post, idx) => (
                <Fragment key={post.id}>
                  {/* Insert editorial CTA after 3rd post */}
                  {idx === 3 && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary/5 via-brand-background-secondary to-brand-primary/5 border border-brand-primary/10 p-8 md:p-10 my-2">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--brand-primary-rgb,124,58,237),0.06),transparent_70%)]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/10 shrink-0">
                            <Sparkles className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mb-1.5">{cta.title}</h3>
                            <p className="text-sm text-brand-text-secondary leading-relaxed">{cta.desc}</p>
                          </div>
                          <Button onClick={openBooking} size="lg" className="shrink-0 h-12 px-8 text-sm bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/30 transition-all">
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
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 text-left w-full cursor-pointer"
                    >
                    <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary relative">
                      {post.coverImage && (
                        <img
                          {...getResponsiveImageProps(post.coverImage, {
                            widths: [480, 720, 960, 1200],
                            sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
                          })}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
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
                      <p className="text-brand-text-secondary text-[13px] leading-relaxed mb-5 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/60">
                        <div className="flex items-center gap-2">
                          {post.author.avatar && (
                            <img
                              {...getResponsiveImageProps(post.author.avatar, {
                                widths: [48, 72],
                                sizes: '24px',
                              })}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          <span className="text-xs text-brand-text-muted font-medium">
                            {post.author.name}
                          </span>
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
          )}
        </div>
      </main>
      <Footer />

      {/* Blog reader modal overlay (kept for future use) */}
      <AnimatePresence>
        {false && slug && posts.length > 0 && (
          <BlogReaderModal
            slug={slug}
            allPosts={posts}
            onClose={() => navigate('/blog')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
