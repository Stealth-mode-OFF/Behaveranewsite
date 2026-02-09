import React from "react";
import { ShieldCheck, FileText, Lock, Server, Eye, Users, CheckCircle2, Globe, Database } from "lucide-react";
import { getBehaveraItem } from "@/app/content/behaveraContent";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/app/components/ui/accordion";

const privacy = getBehaveraItem("/privacy-policy");
const terms = getBehaveraItem("/terms");

const renderParagraphs = (content?: string, fallback = "Content coming soon.") => {
  if (!content) {
    return <p>{fallback}</p>;
  }

  return content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => <p key={index}>{line}</p>);
};

export function TrustCenter() {
  const { t } = useLanguage();
  const copy = t.trustCenter || {};
  const guarantees = copy.guarantees || [];

  return (
    <section className="section-spacing bg-gradient-to-b from-white to-brand-background-secondary" id="legal">
      <div className="container-default max-w-[1120px] mx-auto">
        
        {/* Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            {copy.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary tracking-tight mb-5">
            {copy.title}
          </h2>
          <p className="text-lg text-brand-text-secondary leading-relaxed">
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Trust Guarantee Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {guarantees.map((g: { icon: string; title: string; desc: string; detail: string }, idx: number) => {
            const iconMap: Record<string, React.ElementType> = {
              server: Server,
              eye: Eye,
              lock: Lock,
              users: Users,
              globe: Globe,
              database: Database,
            };
            const IconComp = iconMap[g.icon] || ShieldCheck;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative bg-white rounded-2xl border border-brand-border p-6 md:p-8 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-brand-text-primary mb-1.5 tracking-tight">{g.title}</h3>
                    <p className="text-[15px] text-brand-text-body leading-relaxed mb-3">{g.desc}</p>
                    <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50/60 rounded-lg px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{g.detail}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16 py-6 px-8 rounded-2xl bg-white border border-brand-border"
        >
          {(copy.complianceBadges || []).map((badge: { label: string; sub: string }, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/5 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-text-primary">{badge.label}</div>
                <div className="text-xs text-brand-text-muted">{badge.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Legal Documents Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text-muted mb-6 text-center">
            {copy.legalDocsTitle || "Legal Documents"}
          </h3>
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="privacy" className="border-b border-brand-border last:border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold text-brand-text-primary hover:text-brand-primary hover:no-underline py-5 px-6 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-text-muted" />
                    {privacy?.title || copy.privacyFallbackTitle}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-brand-text-body px-6 pb-6 leading-relaxed space-y-4">
                  {renderParagraphs(privacy?.content, copy.contentFallback)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="terms" className="border-b border-brand-border last:border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold text-brand-text-primary hover:text-brand-primary hover:no-underline py-5 px-6 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-text-muted" />
                    {terms?.title || copy.termsFallbackTitle}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-brand-text-body px-6 pb-6 leading-relaxed space-y-4">
                  {renderParagraphs(terms?.content, copy.contentFallback)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* DPO Contact */}
          <div className="text-center mt-8">
            <p className="text-sm text-brand-text-muted">
              {copy.dpoLabel}{" "}
              <a href="mailto:gdpr@behavera.com" className="text-brand-primary font-semibold hover:underline">
                gdpr@behavera.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
