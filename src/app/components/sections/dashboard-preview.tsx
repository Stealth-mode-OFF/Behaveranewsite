import { useEffect, useRef } from "react";
import { Eye, Zap, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";
import { motion, useInView } from "framer-motion";
import { DeviceFrame } from "@/app/components/ui/device-frame";
import { FeatureGrid } from "@/app/components/ui/snap-carousel";

/**
 * Dashboard Preview — Real Dashboard Video
 * 
 * Features:
 * - Actual screen recording of the Behavera dashboard
 * - MacBook Pro device frame
 * - Auto-plays on scroll (muted, looping)
 * - Feature grid below
 */
export function DashboardPreview() {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Pick video + poster per language (EN/DE share the English recording)
  const videoSrc = language === "cz" ? "/dashboard-demo.mp4" : "/dashboard-demo-en.mp4";
  const posterSrc = language === "cz" ? "/dashboard-demo-poster.webp" : "/dashboard-demo-en-poster.webp";

  // Auto-play when in view
  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — that's fine, user can see poster
      });
    }
  }, [isInView]);

  const icons = [Eye, ShieldAlert, Zap];

  type DashboardFeature = { title?: string; desc?: string };
  const rawFeatures: DashboardFeature[] = Array.isArray(t.dashboard?.features) ? t.dashboard.features : [];

  const features = rawFeatures
    .filter(Boolean)
    .map((feature, index) => {
      const Icon = icons[index] ?? Eye;
      return {
        icon: <Icon className="w-6 h-6" />,
        title: feature.title ?? "",
        description: feature.desc ?? "",
      };
    })
    .filter((feature) => feature.title);

  return (
    <section className="section-spacing bg-white relative overflow-hidden" id="preview">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
      
      <div className="container-default relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              {t.dashboard?.badge}
            </div>
            <h2 className="text-h2 text-brand-text-primary">
              {t.dashboard?.title}
              <span className="block bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent mt-3">{t.dashboard?.titleHighlight}</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-left md:text-right mt-8 md:mt-0"
          >
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              {t.dashboard?.subtitle}
            </p>
          </motion.div>
        </div>

        {/* MacBook Pro Video */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <DeviceFrame type="macbook" className="w-full max-w-[500px] sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px] xl:max-w-[1100px] mx-auto">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSrc}
              className="w-full h-auto block"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </DeviceFrame>
        </motion.div>

        {/* Feature Grid */}
        {features.length > 0 && (
          <FeatureGrid features={features} />
        )}

      </div>
    </section>
  );
}
