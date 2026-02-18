import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Clock, BookOpen, ChevronUp, Share2, Linkedin, Twitter, Link2, Check, ChevronRight, List } from 'lucide-react';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { useModal } from '@/app/ModalContext';
import { useLocalizedPost, useLocalizedPosts } from '@/app/hooks/useLocalizedPost';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Extract h2 headings from HTML for table of contents */
function extractHeadings(html: string): { text: string; id: string }[] {
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: { text: string; id: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (text) {
      const id = text.toLowerCase().replace(/[^a-z0-9á-žÁ-Ž]+/gi, '-').replace(/^-|-$/g, '');
      headings.push({ text, id });
    }
  }
  return headings;
}

/** Inject IDs into h2 tags for scroll targeting */
function injectHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9á-žÁ-Ž]+/gi, '-').replace(/^-|-$/g, '');
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
}

/** Reading progress bar */
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/** Scroll to top button */
function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Share buttons */
function ShareButtons({ title, compact = false }: { title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass = compact
    ? 'w-9 h-9 rounded-full flex items-center justify-center transition-all'
    : 'w-10 h-10 rounded-full flex items-center justify-center transition-all';

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
      <button onClick={shareLinkedIn} className={`${btnClass} bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white`} title="LinkedIn">
        <Linkedin className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
      <button onClick={shareTwitter} className={`${btnClass} bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white`} title="Twitter / X">
        <Twitter className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
      <button onClick={copyLink} className={`${btnClass} ${copied ? 'bg-green-500 text-white' : 'bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white'}`} title="Copy link">
        {copied ? <Check className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} /> : <Link2 className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      </button>
    </div>
  );
}

/** JSON-LD structured data for article */
function ArticleJsonLd({ post, readingTime }: { post: BlogPost & { title: string; excerpt: string }; readingTime: number }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Behavera',
      logo: { '@type': 'ImageObject', url: 'https://behavera.com/logo.png' },
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '',
    wordCount: post.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** Loading skeleton for blog post */
function BlogPostSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 animate-pulse">
          <div className="h-4 bg-brand-background-secondary rounded w-24 mb-10" />
          <div className="space-y-4 mb-10">
            <div className="flex gap-3">
              <div className="h-5 bg-brand-background-secondary rounded-full w-20" />
              <div className="h-5 bg-brand-background-secondary rounded w-16" />
            </div>
            <div className="h-10 bg-brand-background-secondary rounded w-full" />
            <div className="h-10 bg-brand-background-secondary rounded w-3/4" />
            <div className="h-5 bg-brand-background-secondary rounded w-full mt-4" />
            <div className="h-5 bg-brand-background-secondary rounded w-2/3" />
          </div>
          <div className="aspect-[2/1] bg-brand-background-secondary rounded-xl mb-10" />
          <div className="space-y-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-4 bg-brand-background-secondary rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;
  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  const i18n = {
    cz: {
      toc: 'Obsah článku',
      share: 'Sdílet',
      relatedLabel: 'Další články k tématu',
      readNext: 'Pokračujte ve čtení',
    },
    en: {
      toc: 'Table of Contents',
      share: 'Share',
      relatedLabel: 'Related articles',
      readNext: 'Continue reading',
    },
    de: {
      toc: 'Inhaltsverzeichnis',
      share: 'Teilen',
      relatedLabel: 'Weitere Artikel zum Thema',
      readNext: 'Weiterlesen',
    },
  };
  const ui = i18n[language] || i18n.en;

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

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Related posts: same tag, different post, max 3
  const relatedRaw = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(p => p.id !== post.id && p.tags?.some(tag => post.tags?.includes(tag)))
      .slice(0, 3);
  }, [post, allPosts]);

  const relatedPosts = useLocalizedPosts(relatedRaw);

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

  if (loading) return <BlogPostSkeleton />;
  if (!post || !localizedPost) return (
    <div className="min-h-screen bg-brand-background-primary flex flex-col items-center justify-center gap-4">
      <p className="text-brand-text-secondary text-lg">{t.blog.notFound}</p>
      <Link to="/blog" className="text-brand-primary font-medium hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> {t.blog.backToList}
      </Link>
    </div>
  );

  const readingTime = estimateReadingTime(localizedPost.content);
  const headings = extractHeadings(localizedPost.content);
  const processedContent = injectHeadingIds(sanitizeHtml(localizedPost.content));

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <ReadingProgressBar />
      <ArticleJsonLd post={localizedPost} readingTime={readingTime} />
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-[13px] text-brand-text-muted mb-8 gap-1.5">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-brand-primary transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-text-secondary truncate max-w-[200px]">{localizedPost.title}</span>
          </nav>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-[11px] font-bold uppercase tracking-wider hover:bg-brand-primary/10 transition-colors"
                >
                  {tag}
                </Link>
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
            <div className="flex items-center justify-between pb-7 border-b border-brand-border/60">
              <div className="flex items-center gap-3">
                {post.author.avatar && (
                  <img src={post.author.avatar} alt={post.author.name} loading="lazy" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                )}
                <div>
                  <div className="text-sm font-semibold text-brand-text-primary">{post.author.name}</div>
                  <div className="text-xs text-brand-text-muted">
                    {post.author.role} · {format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale })}
                  </div>
                </div>
              </div>
              <ShareButtons title={localizedPost.title} compact />
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden shadow-lg mb-10 aspect-[2/1]">
              <img src={post.coverImage} alt={localizedPost.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Table of Contents */}
          {headings.length >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10 rounded-xl bg-brand-background-secondary/50 border border-brand-border/60 overflow-hidden"
            >
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-brand-text-primary hover:bg-brand-background-secondary/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <List className="w-4 h-4 text-brand-primary" />
                  {ui.toc}
                </span>
                <ChevronUp className={`w-4 h-4 text-brand-text-muted transition-transform ${tocOpen ? '' : 'rotate-180'}`} />
              </button>
              <AnimatePresence>
                {tocOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <nav className="px-6 pb-5">
                      <ol className="space-y-1.5">
                        {headings.map((h, i) => (
                          <li key={h.id}>
                            <a
                              href={`#${h.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                              className="flex items-start gap-3 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors py-1"
                            >
                              <span className="text-brand-primary/40 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                              <span className="leading-snug">{h.text}</span>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Article body */}
          <div 
            className="prose prose-lg prose-violet mx-auto max-w-none text-brand-text-secondary leading-[1.8]
              prose-headings:text-brand-text-primary prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:mb-5 prose-p:leading-[1.75]
              prose-blockquote:border-l-brand-primary prose-blockquote:bg-brand-primary/[0.03] prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-brand-text-secondary
              prose-li:marker:text-brand-primary
              prose-a:text-brand-primary prose-a:underline-offset-2
              prose-strong:text-brand-text-primary prose-strong:font-semibold
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Share bar after article */}
          <div className="mt-10 pt-7 border-t border-brand-border/60 flex items-center justify-between">
            <span className="text-sm font-medium text-brand-text-muted">{ui.share}</span>
            <ShareButtons title={localizedPost.title} />
          </div>

          {/* Bottom CTA — strong gradient style */}
          <div className="mt-14 rounded-2xl bg-gradient-to-br from-[#0d0520] to-[#1e0a4e] border border-white/10 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,58,237,0.2),transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 shrink-0">
                <BookOpen className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1.5">{cta.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{cta.desc}</p>
              </div>
              <Button onClick={openBooking} size="lg" className="shrink-0 h-12 px-8 text-sm bg-white text-brand-primary hover:bg-white/90 font-semibold shadow-lg">
                {cta.cta}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 mt-16">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-bold text-brand-text-primary">{ui.relatedLabel}</h2>
              <Link to="/blog" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                {t.blog.backToList}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map(rp => (
                <Link 
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary">
                    {rp.coverImage && (
                      <img src={rp.coverImage} alt={rp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider mb-1.5">{rp.tags[0]}</span>
                    <h3 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug mb-3">{rp.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-border/40">
                      <span className="text-[11px] text-brand-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {estimateReadingTime(rp.content)} {readLabel}
                      </span>
                      <span className="text-[11px] text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        {ui.readNext} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
