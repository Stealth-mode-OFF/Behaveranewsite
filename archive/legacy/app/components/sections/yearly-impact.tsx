import React from "react";
import { 
  Hourglass, 
  BrainCircuit, 
  BatteryCharging 
} from "lucide-react";
import { motion } from "framer-motion";

interface ImpactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const ImpactCard = ({ icon, title, description, delay }: ImpactCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="group relative bg-white rounded-2xl p-8 border border-brand-border shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 flex flex-col items-start text-left h-full overflow-hidden"
  >
    {/* Hover Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-background-secondary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10 p-3 rounded-xl bg-brand-background-secondary text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    
    <h3 className="relative z-10 text-h3 text-brand-text-primary mb-4 group-hover:text-brand-primary transition-colors">
      {title}
    </h3>
    
    <p className="relative z-10 text-body text-brand-text-secondary leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export const YearlyImpactSection = () => {
  const impacts = [
    {
      icon: <Hourglass size={32} />,
      title: "Stovky ušetřených hodin v náboru",
      description: "Odchod klíčového člověka bolí. Hledání náhrady, onboarding a zaučení stojí stovky hodin manažerského času. Echo Pulse identifikuje riziko výpovědi včas, abyste si talenty udrželi, místo abyste neustále hledali nové."
    },
    {
      icon: <BrainCircuit size={32} />,
      title: "Konec domýšlení a manažerské úzkosti",
      description: "Už žádné „dusno“ v kanceláři, kterému nerozumíte. Odstraňujeme stres z nevědomosti a domněnek. Díky jasným datům víte přesně, co tým trápí, a můžete to řešit dřív, než se špatná nálada změní v toxicitu."
    },
    {
      icon: <BatteryCharging size={32} />,
      title: "Reaktivace lidí, co byli jen „do počtu“",
      description: "Quiet quitting (tichý odchod) zabíjí produktivitu. Pomůžeme vám znovu zapojit členy týmu, kteří jedou na setrvačnost. Když lidé cítí, že na jejich hlase záleží, vrací se jim energie a chuť tvořit hodnoty."
    }
  ];

  return (
    <section className="section-spacing bg-white relative">
       {/* Background Decor */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-background-secondary/50 rounded-full blur-3xl -z-10" />

      <div className="container-default">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-h2 text-brand-text-primary mb-6 font-bold tracking-tight"
          >
            Jak za rok poznáte, že Echo Pulse funguje?
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-brand-text-secondary leading-relaxed"
          >
            Návratnost investice (ROI) nepočítáme jen v penězích, ale v ušetřeném čase, 
            psychickém klidu a energii celého týmu.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {impacts.map((impact, index) => (
            <ImpactCard 
              key={index}
              icon={impact.icon}
              title={impact.title}
              description={impact.description}
              delay={index * 0.1 + 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
