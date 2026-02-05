import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useModal } from "../ModalContext";
import { motion } from "framer-motion";

export function CTA() {
  const { t } = useLanguage();
  const { openBooking } = useModal();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="container-default max-w-[1120px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 sm:p-12 md:p-16 lg:p-24 text-center rounded-3xl overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary to-[#4C1D95] animate-gradient-shift -z-10" />
          
          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/5 blur-2xl"
          />
          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-brand-accent/10 blur-2xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/5 blur-xl"
          />
          
          {/* Sparkle decorations */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-16 hidden lg:block"
          >
            <Sparkles className="w-6 h-6 text-white/20" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-20 hidden lg:block"
          >
            <Sparkles className="w-8 h-8 text-brand-accent/30" />
          </motion.div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.015em] text-white mb-8 md:mb-10 leading-[1.1]"
            >
              {t.cta.title}
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-10 md:mt-14"
            >
              <Button 
                onClick={openBooking}
                variant="inverse"
                size="lg"
                className="w-full sm:w-auto btn-shine"
              >
                <Calendar className="mr-2 w-4 h-4" />
                {t.cta.primary}
              </Button>
              <Button 
                variant="outline"
                onClick={openBooking}
                size="lg"
                className="w-full sm:w-auto border-white/30 hover:border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                {t.cta.secondary}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-white/60 text-[11px] font-bold font-mono uppercase tracking-[0.15em]"
            >
              {t.cta.note}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
