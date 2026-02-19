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
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

/** Estimate reading time from HTML content */
function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

  const readLabel = language === 'cz' ? 'min čtení' : language === 'de' ? 'Min. Lesezeit' : 'min read';

  useSEO({
    title: t.blog.seoTitle,
    description: t.blog.seoDescription,
    keywords: t.blog.seoKeywords,
    ogType: 'website',
  });

  useEffect(() => {
    CmsService.getPosts().then(data => {
      setPosts(data.filter(Boolean).filter(p => p.status === 'published'));
    });
  }, []);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts by tag
  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter(p => p.tags?.includes(activeTag));
  }, [posts, activeTag]);

  // Localize titles / excerpts / content to active language
  const localizedPosts = useLocalizedPosts(filteredPosts);

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
              {allTags.map(tag => (
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
              <Link 
                to={`/blog/${featuredPost.slug}`}
                className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0520] to-[#1e0a4e] border border-white/10"
              >
                <div className="flex flex-col lg:flex-row">
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
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
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
                      <span className="text-white/40 group-hover:text-brand-accent transition-colors text-sm flex items-center gap-1.5">
                        {language === 'cz' ? 'Číst článek' : language === 'de' ? 'Artikel lesen' : 'Read article'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Post grid with mid-page CTA */}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post, idx) => (
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
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary relative">
                      {post.coverImage && (
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
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
                            <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
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
                  </Link>
                </motion.div>
              </Fragment>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
