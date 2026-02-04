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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8 flex flex-col max-h-[90vh]"
            >
              <button
                onClick={onClose}
                aria-label="Zavřít"
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors backdrop-blur-md shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto custom-scrollbar">
                <div className="px-8 pt-12 pb-8 md:px-12 md:pt-16 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-brand-primary font-bold tracking-wider text-xs uppercase bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-500 text-xs font-mono uppercase tracking-wide">
                      {item.title}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                    {item.title}
                  </h2>

                  <p className="text-lg text-slate-600 leading-relaxed font-light mb-6">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-500 uppercase tracking-widest">
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
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900">
                    {renderParagraphs(item.content)}
                  </div>
                </div>

                <div className="bg-slate-50 px-8 py-8 md:px-12 border-t border-slate-200 text-center">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-brand-primary hover:text-indigo-700 font-bold transition-colors"
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
