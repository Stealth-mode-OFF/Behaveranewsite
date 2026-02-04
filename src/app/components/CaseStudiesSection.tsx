import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { behaveraContent, ContentItem } from "../content/behaveraContent";
import { ContentModal } from "./ContentModal";

export function CaseStudiesSection() {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const caseStudies = useMemo(() => {
    return behaveraContent
      .filter(Boolean)
      .filter((item) => item?.title)
      .filter((item) => item.category === "Případové studie")
      .slice(0, 3);
  }, []);

  if (caseStudies.length === 0) return null;

  return (
    <section className="section-spacing bg-slate-50 border-t border-slate-200" id="case-studies">
      <div className="container-default">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Případové studie
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Konkrétní příběhy firem, které díky Behaveře získaly jasnější signály a rychlejší rozhodování.
            </p>
          </div>
          <a
            href="#resources"
            className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
          >
            Zobrazit všechny →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {item.title}
              </span>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                {item.excerpt}
              </p>
              <div className="flex items-center text-sm font-bold text-brand-primary group-hover:text-indigo-700">
                Číst případovou studii
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <ContentModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
