import React from 'react';
import { useLanguage } from '@/app/LanguageContext';
import { MessageCircle, Clock, TrendingUp, Lightbulb, Users, Target, Shield, Heart, Zap, DollarSign, Gift, Award, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function MethodologySection() {
  const { t } = useLanguage();
  const m = t.methodology;

  const steps = [
    { icon: MessageCircle, color: 'bg-blue-500' },
    { icon: TrendingUp, color: 'bg-purple-500' },
    { icon: Lightbulb, color: 'bg-amber-500' },
  ];

  const topicIcons = [Heart, Zap, Target, DollarSign, Gift, Award, Rocket];

  return (
    <section id="methodology" className="section-spacing bg-brand-primary text-white border-y border-white/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-default max-w-[1200px] mx-auto relative z-10">
        
        {/* Hero Section - WHY IT WORKS */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4 text-brand-accent" />
            <span className="font-mono text-[11px] font-bold text-white tracking-[0.15em] uppercase">
              {m?.badge || "Proč to funguje"}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] mb-8 leading-[1.1]"
          >
            {m?.title || "Ptáme se na to, co skutečně ovlivňuje výkon"}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-text-inverse-secondary leading-[1.7] font-medium"
          >
            {m?.subtitle || "Nečekáme na exit interview. Každý měsíc zjistíme, co lidi drží ve firmě — a co je tichá blíží k odchodu."}
          </motion.p>
        </div>

        {/* The Core Insight */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-12 border border-white/20 mb-20"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              {m?.insightTitle || "Člověk neodchází kvůli jedné věci"}
            </h3>
            <p className="text-lg text-brand-text-inverse-secondary leading-relaxed mb-8">
              {m?.insightDesc || "Odchod je vždy kombinace faktorů: přetížení + pocit nedoceněnosti + nejasný růst. Proto neměříme „spokojenost" jedním číslem. Sledujeme 7 klíčových oblastí, které věda prokázala jako prediktory výkonu a fluktuace."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-accent">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {m?.proofPoints?.[0] || "50 000+ lidí otestováno"}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {m?.proofPoints?.[1] || "91% response rate"}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {m?.proofPoints?.[2] || "Vědecky ověřeno"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* HOW IT WORKS - 3 Steps */}
        <div className="mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm font-semibold text-brand-accent uppercase tracking-widest mb-4"
          >
            {m?.howItWorksLabel || "Jak to funguje"}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-2xl md:text-3xl font-bold mb-12 max-w-2xl mx-auto"
          >
            {m?.howItWorksTitle || "3 minuty měsíčně, které vám ušetří statisíce"}
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(m?.steps || [
              { num: "1", title: "Krátký chat", desc: "Zaměstnanec dostane 5 otázek v chatovém formátu. Trvá 3 minuty, vyplní to 91 % lidí." },
              { num: "2", title: "AI analýza", desc: "Systém hledá vzorce napříč odpověďmi. Vidíme, co HR manuálně neodhalí." },
              { num: "3", title: "Jasná akce", desc: "Manažer dostane konkrétní doporučení. Žádné 50stránkové reporty." }
            ]).map((step: any, index: number) => {
              const StepIcon = steps[index]?.icon || MessageCircle;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl ${steps[index]?.color || 'bg-brand-accent'} flex items-center justify-center`}>
                      <StepIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-5xl font-bold text-white/10">{step.num || index + 1}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">{step.title}</h4>
                  <p className="text-brand-text-inverse-secondary leading-relaxed">{step.desc}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-white/20" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* WHAT WE MEASURE - 7 Areas */}
        <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-2xl md:text-3xl font-bold mb-4"
          >
            {m?.topicsTitle || "7 oblastí, které rozhodují o setrvání"}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-brand-text-inverse-secondary mb-10 max-w-2xl mx-auto"
          >
            {m?.topicsSubtitle || "Každá oblast má přímý vliv na to, jestli člověk zůstane a podá výkon — nebo tiše vyhoří."}
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {(m?.topics || [
              { name: "Tlak", why: "Příliš = vyhoření" },
              { name: "Zátěž", why: "Nerovnováha = frustrace" },
              { name: "Podpora", why: "Chybí = beznaděj" },
              { name: "Peníze", why: "Neférovost = demotivace" },
              { name: "Benefity", why: "Prázdné = nedocenění" },
              { name: "Uznání", why: "Žádné = proč se snažit" },
              { name: "Růst", why: "Stagnace = odchod" }
            ]).map((topic: any, i: number) => {
              const TopicIcon = topicIcons[i] || Target;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 hover:border-brand-accent/50 transition-all text-center"
                >
                  <TopicIcon className="w-6 h-6 mx-auto mb-3 text-brand-accent" />
                  <div className="font-semibold text-white text-sm mb-1">{topic.name || topic}</div>
                  {topic.why && (
                    <div className="text-xs text-brand-text-inverse-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      {topic.why}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SCIENTIFIC BACKING - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-accent/10 to-purple-500/10 rounded-2xl p-8 md:p-10 border border-brand-accent/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-accent" />
                {m?.scienceTitle || "Podloženo vědou, ne módními trendy"}
              </h3>
              <p className="text-brand-text-inverse-secondary leading-relaxed">
                {m?.scienceDesc || "Echo Pulse vychází z výzkumů, které mají tisíce citací v akademické literatuře: Job Demands-Resources model (co vyčerpává vs. co nabíjí), Self-Determination Theory (vnitřní motivace) a Equity Theory (spravedlnost odměňování). Nejsou to buzzwordy — jsou to modely, které předpovídají chování."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              {(m?.scienceTags || ["JD-R Model", "SDT", "Equity Theory"]).map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center"
        >
          <div>
            <div className="text-4xl font-bold text-brand-accent mb-1">91%</div>
            <div className="text-sm text-brand-text-inverse-secondary">{m?.stats?.responseRate || "lidí vyplní"}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-accent mb-1">3 min</div>
            <div className="text-sm text-brand-text-inverse-secondary">{m?.stats?.completion || "měsíčně stačí"}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-accent mb-1">50k+</div>
            <div className="text-sm text-brand-text-inverse-secondary">{m?.stats?.tested || "otestovaných"}</div>
          </div>
        </motion.div>

        {/* Citation */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-xs text-brand-text-inverse-secondary/60 max-w-3xl mx-auto"
        >
          {m?.citation || "Metodologie založena na Bakker & Demerouti (2001), Deci & Ryan (1985), Adams (1963). Publikováno v Journal of Applied Psychology, Journal of Organizational Behavior."}
        </motion.p>
      </div>
    </section>
  );
}
