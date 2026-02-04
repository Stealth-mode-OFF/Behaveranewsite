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

  const visibleItems = filteredItems.filter(Boolean).filter((item) => item?.title).slice(0, visibleCount);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(9);
  };

  return (
    <section className="section-spacing bg-brand-background-primary border-t border-brand-border" id="resources">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
              Kompletní knihovna Behavera
            </h2>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              Všechny blogy, případové studie, produktové stránky i právní dokumenty z jednoho zdroje. Vyberte si
              kategorii a otevřete detail.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-text-muted bg-brand-background-secondary px-3 py-2 rounded-full border border-brand-border">
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
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-text-muted border-brand-border hover:border-brand-border-strong hover:text-brand-text-primary"
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
                className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl border border-brand-border hover:border-brand-border-strong transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-brand-background-secondary text-brand-text-secondary text-xs font-bold rounded-full border border-brand-border uppercase tracking-wider">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-brand-text-muted text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{readTime} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-brand-text-primary mb-3 group-hover:text-brand-accent transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-brand-text-secondary text-sm leading-relaxed mb-6 line-clamp-4">
                    {item.excerpt}
                  </p>

                  <div className="text-xs text-brand-text-muted font-mono uppercase tracking-wider mt-auto">
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
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest bg-brand-primary text-white rounded-full hover:bg-brand-primary-hover transition-colors"
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
