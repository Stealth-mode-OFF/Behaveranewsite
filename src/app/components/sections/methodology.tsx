import React from 'react';
import { useLanguage } from '@/app/LanguageContext';
import { Brain, Scale, Target, FlaskConical, BarChart3, Sparkles, BookOpen, Users, Zap, Shield, MessageCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function MethodologySection() {
  const { t } = useLanguage();

  const theories = [
    {
      icon: Scale,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Brain,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Target,
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const features = [
    { icon: MessageCircle },
    { icon: FlaskConical },
    { icon: BarChart3 },
    { icon: Sparkles },
  ];

  return (
    <section id="methodology" className="section-spacing bg-brand-primary text-white border-y border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-default max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-full border border-white/20 mb-10 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4 text-brand-accent" />
            <span className="font-mono text-[11px] font-bold text-white tracking-[0.15em] uppercase">
              {t.methodology?.badge || "Vědecký základ"}
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.015em] mb-6 md:mb-8 leading-[1.1]"
          >
            {t.methodology?.title || "Postaveno na vědě, ne na dojmech"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-brand-text-inverse-secondary leading-[1.7] font-medium"
          >
            {t.methodology?.subtitle || "Echo Pulse vychází z desetiletí výzkumu v organizační psychologii. Žádné vymyšlené metriky - pouze ověřené modely, které předpovídají výkon a stabilitu týmů."}
          </motion.p>
        </div>

        {/* Scientific Foundations */}
        <div className="mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm font-semibold text-brand-accent uppercase tracking-widest mb-12"
          >
            {t.methodology?.scienceHeader || "Tři pilíře naší metodologie"}
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(t.methodology?.theories || []).map((theory: any, index: number) => {
              if (!theory?.title) return null;
              const config = theories[index];
              const Icon = config?.icon || Scale;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Theory Icon */}
                  <div className={`w-14 h-14 rounded-xl ${config?.bgColor || 'bg-white/10'} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-r ${config?.color || 'from-white to-white'} bg-clip-text text-white`} />
                  </div>
                  
                  <h4 className="text-xl font-bold mb-2 text-white">{theory.title}</h4>
                  <p className="text-sm text-brand-accent font-medium mb-4">{theory.authors}</p>
                  <p className="text-brand-text-inverse-secondary leading-relaxed text-[15px] mb-4">
                    {theory.desc}
                  </p>
                  
                  {/* Key Points */}
                  {theory.points && (
                    <ul className="space-y-2 mt-4 pt-4 border-t border-white/10">
                      {theory.points.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-brand-text-inverse-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-6"
              >
                {t.methodology?.howItWorks?.title || "Jak Echo Pulse aplikuje vědu do praxe"}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-brand-text-inverse-secondary leading-relaxed mb-8"
              >
                {t.methodology?.howItWorks?.desc || "Otázky v Echo Pulse nejsou náhodně generované. Každá je navržena psychometrickým týmem tak, aby měřila konkrétní faktory z ověřených modelů - a AI analýza pak rozpozná vzorce, které by člověk přehlédl."}
              </motion.p>
              
              <div className="space-y-4">
                {(t.methodology?.howItWorks?.features || []).map((feature: any, index: number) => {
                  const FeatureIcon = features[index]?.icon || Zap;
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center shrink-0">
                        <FeatureIcon className="w-5 h-5 text-brand-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{feature?.title}</h4>
                        <p className="text-sm text-brand-text-inverse-secondary">{feature?.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Topics Grid */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h4 className="text-lg font-semibold mb-4 text-center">
                {t.methodology?.topicsTitle || "7 měřených oblastí"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(t.methodology?.topics || [
                  "Tlak a stres",
                  "Pracovní zátěž", 
                  "Nástroje a podpora",
                  "Finanční ohodnocení",
                  "Benefity",
                  "Uznání",
                  "Růst a rozvoj"
                ]).map((topic: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/90 bg-white/5 px-3 py-2 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-brand-accent" />
                    {topic}
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-accent">91%</div>
                  <div className="text-xs text-brand-text-inverse-secondary">{t.methodology?.stats?.responseRate || "response rate"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-accent">3 min</div>
                  <div className="text-xs text-brand-text-inverse-secondary">{t.methodology?.stats?.completion || "na vyplnění"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-accent">50k+</div>
                  <div className="text-xs text-brand-text-inverse-secondary">{t.methodology?.stats?.tested || "otestovaných"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Research Citations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-brand-text-inverse-secondary/70 max-w-3xl mx-auto leading-relaxed">
            <Shield className="w-4 h-4 inline-block mr-2 opacity-50" />
            {t.methodology?.citation || "Metodologie vychází z recenzovaného výzkumu publikovaného v Journal of Applied Psychology, Journal of Organizational Behavior a American Psychologist. Více než 2000 citací v akademické literatuře."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
