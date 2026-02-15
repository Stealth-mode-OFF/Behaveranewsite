import { useState, type ElementType } from "react";
import { ShieldCheck, FileText, Lock, Server, Eye, Users, CheckCircle2, Globe, Database, ChevronDown } from "lucide-react";
import { getBehaveraItem } from "@/app/content";
import { useLanguage } from "@/app/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [sectionOpen, setSectionOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showLegalDocs, setShowLegalDocs] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const iconMap: Record<string, ElementType> = {
    server: Server,
    eye: Eye,
    lock: Lock,
    users: Users,
    globe: Globe,
    database: Database,
  };

  return (
    <section className="section-spacing bg-white" id="legal">
      <div className="container-default">
        
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            {copy.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary tracking-tight mb-4">
            {copy.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {copy.titleHighlight}
            </span>
          </h2>
          <p className="text-lg text-brand-text-secondary leading-relaxed">
            {copy.subtitle}
          </p>

          {/* Show/Hide details toggle — defaults to collapsed */}
          <button
            onClick={() => setSectionOpen(!sectionOpen)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-brand-border hover:border-brand-primary/20 hover:shadow-sm transition-all cursor-pointer group"
          >
            <Lock className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
            <span className="text-sm font-semibold text-brand-text-secondary group-hover:text-brand-primary transition-colors">
              {sectionOpen
                ? (copy.collapseLabel || "Skrýt detaily")
                : (copy.expandLabel || "Zobrazit detaily zabezpečení")}
            </span>
            <motion.div
              animate={{ rotate: sectionOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
            </motion.div>
          </button>
        </motion.div>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {sectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >

        {/* Compliance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10 py-5 px-6 rounded-2xl bg-white border border-brand-border"
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

        {/* Guarantee Cards - Compact with Expand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {guarantees.map((g: { icon: string; title: string; desc: string; detail: string }, idx: number) => {
            const IconComp = iconMap[g.icon] || ShieldCheck;
            const isExpanded = expandedCard === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
              >
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : idx)}
                  className="w-full text-left bg-white rounded-2xl border border-brand-border p-5 hover:shadow-md hover:border-brand-primary/15 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-brand-text-primary tracking-tight">{g.title}</h3>
                      <p className="text-sm text-brand-text-body leading-relaxed line-clamp-1">{g.desc}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-7 h-7 rounded-full bg-brand-background-secondary flex items-center justify-center shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-brand-text-muted" />
                    </motion.div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-brand-border/50">
                          <p className="text-sm text-brand-text-body leading-relaxed mb-3">{g.desc}</p>
                          <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50/60 rounded-lg px-3 py-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{g.detail}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Legal Documents - Collapsed by Default */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <button
            onClick={() => setShowLegalDocs(!showLegalDocs)}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white border border-brand-border hover:border-brand-primary/20 hover:shadow-sm transition-all cursor-pointer group"
          >
            <FileText className="w-4 h-4 text-brand-text-muted" />
            <span className="text-sm font-semibold text-brand-text-secondary group-hover:text-brand-primary transition-colors">
              {copy.legalDocsTitle || "Legal Documents"}
            </span>
            <motion.div
              animate={{ rotate: showLegalDocs ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-brand-text-muted" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showLegalDocs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* Privacy Policy */}
                  <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === 'privacy' ? null : 'privacy')}
                      className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-brand-background-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-sm font-semibold text-brand-text-primary">
                          {privacy?.title || copy.privacyFallbackTitle}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedDoc === 'privacy' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-brand-text-muted" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedDoc === 'privacy' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-sm text-brand-text-body leading-relaxed space-y-3 border-t border-brand-border/50 pt-4 max-h-[400px] overflow-y-auto">
                            {renderParagraphs(privacy?.content, copy.contentFallback)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Terms */}
                  <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === 'terms' ? null : 'terms')}
                      className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-brand-background-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-brand-text-muted" />
                        <span className="text-sm font-semibold text-brand-text-primary">
                          {terms?.title || copy.termsFallbackTitle}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedDoc === 'terms' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-brand-text-muted" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedDoc === 'terms' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-sm text-brand-text-body leading-relaxed space-y-3 border-t border-brand-border/50 pt-4 max-h-[400px] overflow-y-auto">
                            {renderParagraphs(terms?.content, copy.contentFallback)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DPO Contact */}
          <div className="text-center mt-6">
            <p className="text-sm text-brand-text-muted">
              {copy.dpoLabel}{" "}
              <a href="mailto:gdpr@behavera.com" className="text-brand-primary font-semibold hover:underline">
                gdpr@behavera.com
              </a>
            </p>
          </div>
        </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
