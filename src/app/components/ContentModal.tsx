import React from "react";
import { X, Clock, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentItem } from "../content/behaveraContent";

interface ContentModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const renderParagraphs = (content: string) => {
  return content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p key={index}>{line}</p>
    ));
};

export function ContentModal({ item, isOpen, onClose }: ContentModalProps) {
  if (!item) return null;

  const readTime = Math.max(2, Math.round(item.wordCount / 180));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-primary/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-brand-border overflow-hidden relative my-8 flex flex-col max-h-[90vh]"
            >
              <button
                onClick={onClose}
                aria-label="Zavřít"
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-brand-background-secondary rounded-full text-brand-text-muted hover:text-brand-text-primary transition-colors backdrop-blur-md shadow-sm border border-brand-border"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto custom-scrollbar">
                <div className="px-8 pt-12 pb-8 md:px-12 md:pt-16 border-b border-brand-border bg-brand-background-secondary/60">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-brand-text-secondary font-bold tracking-wider text-xs uppercase bg-brand-background-muted px-2 py-1 rounded-full border border-brand-border">
                      {item.category}
                    </span>
                    <span className="text-brand-text-muted text-xs">•</span>
                    <span className="text-brand-text-muted text-xs font-mono uppercase tracking-wide">
                      {item.title}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-6 leading-tight">
                    {item.title}
                  </h2>

                  <p className="text-lg text-brand-text-secondary leading-relaxed font-light mb-6">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-brand-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime} min čtení
                    </div>
                    <div className="flex items-center gap-2">
                      <Link className="w-3.5 h-3.5" />
                      {item.url.replace("https://", "")}
                    </div>
                  </div>
                </div>

                <div className="px-8 py-10 md:px-12 md:py-12 bg-white">
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-text-primary prose-p:text-brand-text-secondary prose-li:text-brand-text-secondary prose-strong:text-brand-text-primary">
                    {renderParagraphs(item.content)}
                  </div>
                </div>

                <div className="bg-brand-background-secondary px-8 py-8 md:px-12 border-t border-brand-border text-center">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent-hover font-bold transition-colors"
                  >
                    Zavřít
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
