import React from "react";
import { Sparkles, Target, Layers } from "lucide-react";
import { getBehaveraItem } from "../content/behaveraContent";

const about = getBehaveraItem("/about");

const highlights = [
  {
    title: "Od roku 2018",
    desc: "Budujeme gamifikované assessmenty, které odhalují reálný potenciál lidí v praxi.",
    icon: Target
  },
  {
    title: "Data místo dojmů",
    desc: "Psychologie, AI technologie a HR know-how v jednom systému pro rychlé rozhodování.",
    icon: Layers
  },
  {
    title: "Praktická podpora lídrů",
    desc: "Jasné signály, které šetří čas i peníze a pomáhají tým skutečně vést.",
    icon: Sparkles
  }
];

export function AboutSection() {
  if (!about) return null;

  const paragraphs = about.content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;

  return (
    <section className="section-spacing bg-brand-background-primary border-b border-brand-border" id="about">
      <div className="container-default">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-background-secondary text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-brand-border">
              O nás
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-6">
              {lead || about.title}
            </h2>
            <div className="space-y-4 text-lg text-brand-text-secondary leading-relaxed">
              {rest.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-brand-background-secondary border border-brand-border rounded-2xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-accent mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
