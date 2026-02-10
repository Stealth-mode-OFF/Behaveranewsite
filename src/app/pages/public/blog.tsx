import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { useModal } from '@/app/ModalContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { openBooking } = useModal();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

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

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const midCta = {
    cz: {
      badge: 'Vyzkoušejte Echo Pulse',
      title: 'Přestaňte hádat. Začněte vědět.',
      desc: 'Zjistěte, jak se váš tým doopravdy cítí — za 3 minuty, anonymně, s okamžitými výsledky.',
      cta: 'Domluvit ukázku',
    },
    en: {
      badge: 'Try Echo Pulse',
      title: 'Stop guessing. Start knowing.',
      desc: 'Discover how your team truly feels — in 3 minutes, anonymously, with instant results.',
      cta: 'Book a demo',
    },
    de: {
      badge: 'Echo Pulse testen',
      title: 'Hören Sie auf zu raten. Fangen Sie an zu wissen.',
      desc: 'Erfahren Sie, wie sich Ihr Team wirklich fühlt — in 3 Minuten, anonym, mit sofortigen Ergebnissen.',
      cta: 'Demo buchen',
    },
  };
  const cta = midCta[language] || midCta.en;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page header */}
          <div className="text-center mb-12 space-y-4">
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
              className="text-xl text-brand-text-secondary max-w-2xl mx-auto"
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
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              <button
                onClick={() => setActiveTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTag === null
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                    : 'bg-brand-background-secondary text-brand-text-secondary hover:bg-brand-primary/5 hover:text-brand-primary border border-brand-border'
                }`}
              >
                {language === 'cz' ? 'Vše' : language === 'de' ? 'Alle' : 'All'}
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTag === tag
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                      : 'bg-brand-background-secondary text-brand-text-secondary hover:bg-brand-primary/5 hover:text-brand-primary border border-brand-border'
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
              className="mb-12"
            >
              <Link 
                to={`/blog/${featuredPost.slug}`}
                className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0520] to-[#1e0a4e] border border-white/10"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden">
                    {featuredPost.coverImage && (
                      <img 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
                      />
                    )}
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-brand-accent text-xs font-bold uppercase tracking-wider">
                        {featuredPost.tags[0] || t.blog.defaultTag}
                      </span>
                      <span className="text-white/40 text-xs">
                        {format(new Date(featuredPost.publishedAt), 'MMM d, yyyy', { locale })}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      {featuredPost.author.avatar && (
                        <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-8 h-8 rounded-full border-2 border-white/20" />
                      )}
                      <span className="text-xs text-white/50 font-medium">
                        {featuredPost.author.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Post grid with mid-page CTA */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post, idx) => (
              <React.Fragment key={post.id}>
                {/* Insert CTA after 3rd post */}
                {idx === 3 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-brand-primary/5 border border-brand-primary/10 p-8 md:p-12">
                      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className="flex-1 text-center md:text-left">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/15 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-brand-primary" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">{cta.badge}</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-brand-text-primary mb-2">{cta.title}</h3>
                          <p className="text-sm text-brand-text-secondary">{cta.desc}</p>
                        </div>
                        <Button onClick={openBooking} size="lg" className="shrink-0 h-12 px-8 text-[15px]">
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
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-brand-background-secondary">
                      {post.coverImage && (
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-brand-primary uppercase tracking-wider">
                        {post.tags[0] || t.blog.defaultTag}
                      </div>
                      <h2 className="text-xl font-bold text-brand-text-primary mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-brand-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border">
                        <div className="flex items-center gap-2">
                          {post.author.avatar && (
                            <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                          )}
                          <span className="text-xs text-brand-text-muted font-medium">
                            {post.author.name} • {format(new Date(post.publishedAt), 'MMM d', { locale })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
