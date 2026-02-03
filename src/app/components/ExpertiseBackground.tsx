import React from "react";
import { motion } from "framer-motion";
import { Brain, Database, ShieldCheck } from "lucide-react";

export function ExpertiseBackground() {
  return (
    <section className="py-24 bg-brand-background-secondary text-brand-text-primary relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30" 
           style={{ backgroundImage: 'radial-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: The Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-mono font-medium tracking-widest text-brand-primary uppercase bg-brand-primary/5 rounded border border-brand-primary/20">
               <ShieldCheck className="w-3 h-3" />
               Expertíza
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight text-brand-text-primary">
              Není to jen software. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-violet-400">
                Je to digitalizovaná zkušenost.
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-brand-text-secondary font-light leading-relaxed">
              <p>
                Echo Pulse není výsledek hackathonu. Je to destilát <strong>10+ let praxe</strong> s behaviorální psychologií a daty z českých firem.
              </p>
              <p>
                Za metodikou stojí <strong>Igor Kubíček</strong> (psychologie týmů) a <strong>Dušan Švancara</strong> (architektura systému). 
                Spojili jsme hlubokou znalost lidského chování se schopností oddělit v datech signál od šumu.
              </p>
              <p className="text-brand-text-primary font-medium border-l-2 border-brand-primary pl-4">
                Výsledek? Nástroj, který se neptá "jak se máte", ale měří skutečnou dynamiku týmu.
              </p>
            </div>
          </motion.div>

          {/* Right Column: The Proof Points */}
          <div className="grid gap-6">
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-brand-border p-8 rounded-2xl flex gap-6 items-start hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
             >
                <div className="w-12 h-12 rounded-xl bg-brand-background-muted flex items-center justify-center shrink-0 text-brand-primary">
                   <Brain className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-brand-text-primary mb-2">Psychologie, ne dojmy</h3>
                   <p className="text-brand-text-secondary leading-relaxed text-sm">
                      Náš model nestojí na domněnkách. Vychází z ověřených behaviorálních studií adaptovaných na české pracovní prostředí.
                   </p>
                </div>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-brand-border p-8 rounded-2xl flex gap-6 items-start hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
             >
                <div className="w-12 h-12 rounded-xl bg-brand-background-muted flex items-center justify-center shrink-0 text-brand-primary">
                   <Database className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-brand-text-primary mb-2">Signál vs. Šum</h3>
                   <p className="text-brand-text-secondary leading-relaxed text-sm">
                      Algoritmy, které ignorují výkyvy nálad a hledají skutečné trendy. Víme, kdy jde o špatný den a kdy o systémový problém.
                   </p>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
