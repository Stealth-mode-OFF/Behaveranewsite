import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { sanitizeHtml } from '@/lib/sanitize';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { format } from 'date-fns';
import { cs, de, enUS } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const locale = language === 'cz' ? cs : language === 'de' ? de : enUS;

  useEffect(() => {
    if (slug) {
      CmsService.getPostBySlug(slug).then(data => {
        setPost(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  // Dynamic SEO based on post
  useSEO({
    title: post?.title || t.blog.title,
    description: post?.excerpt || t.blog.seoDescription,
    keywords: post?.tags?.join(', ') || t.blog.seoKeywords,
    ogType: 'article',
  });

  if (loading) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.loading}</div>;
  if (!post) return <div className="min-h-screen bg-brand-background-primary flex items-center justify-center">{t.blog.notFound}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-brand-text-muted hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.blog.backToList}
          </Link>

          <header className="mb-12 text-center">
             <div className="flex items-center justify-center gap-2 mb-6">
                {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-brand-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                    {post.author.avatar && (
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    )}
                    <div className="text-left">
                        <div className="text-sm font-bold text-brand-text-primary">{post.author.name}</div>
                        <div className="text-xs text-brand-text-muted">{post.author.role}</div>
                    </div>
                </div>
                <div className="h-8 w-px bg-brand-border mx-2" />
                <div className="text-sm text-brand-text-muted">
                    {format(new Date(post.publishedAt), 'MMMM d, yyyy', { locale })}
                </div>
            </div>
          </header>

          <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 aspect-[21/9]">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            )}
          </div>

          <div 
            className="prose prose-lg prose-violet mx-auto max-w-none text-brand-text-secondary"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
          
        </article>
      </main>
      <Footer />
    </div>
  );
};
