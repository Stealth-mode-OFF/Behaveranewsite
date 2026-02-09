import React from "react";
import { motion } from "framer-motion";
import { Link2, Radio, Rocket, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { cn } from "@/app/components/ui/utils";

/**
 * How It Works V2 - Horizontal Stepper Design
 * 
 * Features:
 * - Horizontal progress line connecting steps
 * - Numbered step indicators
 * - Clean, minimal Apple-style aesthetic
 * - Animated on scroll
 */
export function HowItWorksV2() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: Link2,
      title: t.howItWorks?.steps?.step1?.title || "Connect",
      desc: t.howItWorks?.steps?.step1?.desc || "Integrate with your existing tools in minutes.",
      color: "from-violet-500 to-purple-500",
    },
    {
      number: "02",
      icon: Radio,
      title: t.howItWorks?.steps?.step2?.title || "Collect",
      desc: t.howItWorks?.steps?.step2?.desc || "Continuous pulse surveys gather real-time feedback.",
      color: "from-brand-primary to-violet-500",
    },
    {
      number: "03",
      icon: Rocket,
      title: t.howItWorks?.steps?.step3?.title || "Act",
      desc: t.howItWorks?.steps?.step3?.desc || "Get actionable insights and prevent attrition.",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section className="section-spacing bg-white border-t border-brand-border" id="how-it-works">
      <div className="container-default max-w-[1000px] mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-primary/5 rounded-full border border-brand-primary/10 mb-8">
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {t.howItWorks?.badge || "How It Works"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text-primary tracking-tight mb-6">
            {t.howItWorks?.title || "Simple to start,"}
            <span className="block bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent mt-2">
              {t.howItWorks?.titleHighlight || "powerful to scale"}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed">
            {t.howItWorks?.subtitle || "Three steps to transform how you understand your team."}
          </p>
        </motion.div>

        {/* Horizontal Stepper */}
        <div className="relative">
          {/* Connection Line - Desktop only */}
          <div className="hidden md:block absolute top-[60px] left-[calc(16.67%+30px)] right-[calc(16.67%+30px)] h-[2px] bg-gradient-to-r from-brand-border via-brand-primary/30 to-brand-border" />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <StepCard step={step} isLast={index === steps.length - 1} />
                
                {/* Mobile arrow indicator */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-4 md:hidden">
                    <ArrowRight className="w-5 h-5 text-brand-text-muted rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

type StepCardProps = {
  step: {
    number: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
    color: string;
  };
  isLast: boolean;
};

function StepCard({ step, isLast }: StepCardProps) {
  const Icon = step.icon;
  
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Step Number Circle */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className={cn(
          "w-[120px] h-[120px] rounded-full flex items-center justify-center",
          "bg-gradient-to-br p-[2px]",
          step.color
        )}>
          {/* Inner white circle */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden group-hover:bg-brand-background-secondary transition-colors">
            {/* Icon */}
            <Icon className={cn(
              "w-8 h-8 text-brand-primary transition-transform duration-300",
              "group-hover:scale-110"
            )} />
            
            {/* Subtle gradient overlay on hover */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
              "bg-gradient-to-br",
              step.color
            )} />
          </div>
        </div>
        
        {/* Step number badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-brand-border rounded-full shadow-sm">
          <span className="text-[11px] font-mono font-bold text-brand-text-muted tracking-widest">
            {step.number}
          </span>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-brand-text-primary mb-3 group-hover:text-brand-primary transition-colors">
        {step.title}
      </h3>
      <p className="text-brand-text-secondary leading-relaxed max-w-xs">
        {step.desc}
      </p>

    </div>
  );
}
