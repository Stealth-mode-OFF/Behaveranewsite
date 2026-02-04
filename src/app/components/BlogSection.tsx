import React, { useState } from 'react';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { ArticleModal } from './ArticleModal';
import { articles, Article } from './BlogData';

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section className="section-spacing bg-brand-background-primary border-t border-brand-border relative overflow-hidden" id="blog">
      
      <div className="container-default relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-text-primary">
              Expertní vhled
            </h2>
            <p className="text-lg text-brand-text-secondary max-w-xl leading-relaxed">
              Strategické analýzy a metodiky pro moderní řízení firemní kultury. Žádná vata, jen data a praxe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl border border-brand-border hover:border-brand-accent/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm"
            >
              <div className="p-8 flex flex-col flex-grow">
                
                <div className="flex items-center justify-between mb-6">
                   <span className="px-3 py-1 bg-brand-background-secondary text-brand-text-secondary text-xs font-bold rounded-full border border-brand-border uppercase tracking-wider">
                      {article.category}
                   </span>
                   <div className="flex items-center gap-1.5 text-brand-text-muted text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                   </div>
                </div>

                <h3 className="text-xl font-bold text-brand-text-primary mb-4 group-hover:text-brand-accent transition-colors leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-brand-text-secondary text-base leading-relaxed mb-8 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-brand-text-primary text-sm font-bold mt-auto group-hover:gap-2 transition-all group-hover:text-brand-accent">
                  Číst článek <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ArticleModal 
        article={selectedArticle} 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </section>
  );
}
