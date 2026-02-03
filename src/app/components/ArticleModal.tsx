import React from 'react';
import { X, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from './BlogData';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!article) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-brand-border overflow-hidden relative my-8 flex flex-col max-h-[90vh]"
            >
              
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Zavřít článek"
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-brand-background-secondary rounded-full text-brand-text-muted hover:text-brand-primary transition-colors backdrop-blur-md shadow-sm border border-brand-border"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto custom-scrollbar">
                  
                  {/* Article Header */}
                  <div className="px-8 pt-12 pb-8 md:px-12 md:pt-16 border-b border-brand-border bg-brand-background-secondary/50">
                      <div className="flex items-center gap-3 mb-6">
                          <span className="text-brand-primary font-bold tracking-wider text-xs uppercase bg-brand-background-muted px-2 py-1 rounded-full border border-brand-border">
                              {article.category}
                          </span>
                          <span className="text-brand-text-muted text-xs">•</span>
                          <span className="text-brand-text-muted text-xs font-mono uppercase tracking-wide">
                              {article.role}
                          </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6 leading-tight">
                          {article.title}
                      </h2>
                      
                      <p className="text-lg text-brand-text-secondary leading-relaxed font-light mb-6">
                          {article.excerpt}
                      </p>

                      <div className="flex items-center gap-6 text-xs font-mono text-brand-text-muted uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime} Čtení
                          </div>
                          <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5" />
                              Echo Pulse Team
                          </div>
                      </div>
                  </div>

                  {/* Article Body */}
                  <div className="px-8 py-10 md:px-12 md:py-12 bg-white">
                      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-primary prose-p:text-brand-text-secondary prose-li:text-brand-text-secondary prose-strong:text-brand-primary prose-blockquote:border-l-brand-primary prose-blockquote:bg-brand-background-secondary prose-blockquote:py-2 prose-blockquote:px-4">
                          {article.content}
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-brand-background-secondary px-8 py-8 md:px-12 border-t border-brand-border text-center">
                       <p className="text-brand-text-muted text-sm mb-4">
                           Líbil se vám tento briefing?
                       </p>
                       <button 
                        onClick={onClose}
                        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover font-bold transition-colors"
                       >
                           Zavřít článek
                       </button>
                  </div>

              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
