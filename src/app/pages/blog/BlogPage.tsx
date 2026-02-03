import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    CmsService.getPosts().then(data => {
      setPosts(data.filter(p => p.status === 'published'));
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary">
              Insights & Analysis
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto">
              Deep dives into organizational psychology, leadership data, and the future of work.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
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
                    {post.tags[0] || 'Insight'}
                  </div>
                  <h2 className="text-xl font-bold text-brand-text-primary mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-brand-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      {post.author.avatar && (
                        <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-xs text-brand-text-muted font-medium">
                        {post.author.name} • {format(new Date(post.publishedAt), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
