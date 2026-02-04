import React, { useMemo, useState } from "react";
import { Clock, Filter } from "lucide-react";
import { behaveraContent, ContentItem } from "../content/behaveraContent";
import { ContentModal } from "./ContentModal";
import { cn } from "./ui/utils";

const CATEGORY_ORDER = [
  "Blog",
  "Případové studie",
  "Produkty",
  "Řešení",
  "AI readiness",
  "O nás",
  "Podmínky",
  "Soukromí",
  "Demo",
  "Tagy",
  "Ostatní"
];

const DEFAULT_CATEGORY = "Blog";

export function ContentLibrary() {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(behaveraContent.map((item) => item.category)));
    const ordered = CATEGORY_ORDER.filter((cat) => unique.includes(cat));
    const rest = unique.filter((cat) => !CATEGORY_ORDER.includes(cat));
    return ["Vše", ...ordered, ...rest];
  }, []);

  const filteredItems = useMemo(() => {
    const items = activeCategory === "Vše"
      ? behaveraContent
      : behaveraContent.filter((item) => item.category === activeCategory);
    return items;
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(9);
  };

  return (
    <section className="section-spacing bg-white border-t border-slate-200" id="resources">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Kompletní knihovna Behavera
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Všechny blogy, případové studie, produktové stránky i právní dokumenty z jednoho zdroje. Vyberte si
              kategorii a otevřete detail.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-2 rounded-full border border-slate-200">
            <Filter className="w-4 h-4" />
            {filteredItems.length} záznamů
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full border transition-colors",
                activeCategory === category
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => {
            const readTime = Math.max(2, Math.round(item.wordCount / 180));
            return (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{readTime} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-4">
                    {item.excerpt}
                  </p>

                  <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-auto">
                    {item.url.replace("https://", "")}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visibleCount < filteredItems.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              Zobrazit další
            </button>
          </div>
        )}
      </div>

      <ContentModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
