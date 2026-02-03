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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8 flex flex-col max-h-[90vh]"
            >
              
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Zavřít článek"
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors backdrop-blur-md shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto custom-scrollbar">
                  
                  {/* Article Header */}
                  <div className="px-8 pt-12 pb-8 md:px-12 md:pt-16 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-6">
                          <span className="text-brand-primary font-bold tracking-wider text-xs uppercase bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                              {article.category}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-500 text-xs font-mono uppercase tracking-wide">
                              {article.role}
                          </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                          {article.title}
                      </h2>
                      
                      <p className="text-lg text-slate-600 leading-relaxed font-light mb-6">
                          {article.excerpt}
                      </p>

                      <div className="flex items-center gap-6 text-xs font-mono text-slate-500 uppercase tracking-widest">
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
                      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-blockquote:border-l-brand-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4">
                          {article.content}
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 px-8 py-8 md:px-12 border-t border-slate-200 text-center">
                       <p className="text-slate-500 text-sm mb-4">
                           Líbil se vám tento briefing?
                       </p>
                       <button 
                        onClick={onClose}
                        className="inline-flex items-center gap-2 text-brand-primary hover:text-indigo-700 font-bold transition-colors"
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
