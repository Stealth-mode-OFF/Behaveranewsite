import React from "react";
import { motion } from "framer-motion";
import { Brain, Database, ShieldCheck } from "lucide-react";

export function ExpertiseBackground() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: The Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-mono font-medium tracking-widest text-indigo-300 uppercase bg-indigo-900/30 rounded border border-indigo-800">
               <ShieldCheck className="w-3 h-3" />
               Expertíza
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
              Není to jen software. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">
                Je to digitalizovaná zkušenost.
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
              <p>
                Echo Pulse není výsledek hackathonu. Je to destilát <strong>10+ let praxe</strong> s behaviorální psychologií a daty z českých firem.
              </p>
              <p>
                Za metodikou stojí <strong>Igor Kubíček</strong> (psychologie týmů) a <strong>Dušan Švancara</strong> (architektura systému). 
                Spojili jsme hlubokou znalost lidského chování se schopností oddělit v datech signál od šumu.
              </p>
              <p className="text-white font-medium border-l-2 border-indigo-500 pl-4">
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
                className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex gap-6 items-start hover:bg-slate-800 transition-colors"
             >
                <div className="w-12 h-12 rounded-xl bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-400">
                   <Brain className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">Psychologie, ne dojmy</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">
                      Náš model nestojí na domněnkách. Vychází z ověřených behaviorálních studií adaptovaných na české pracovní prostředí.
                   </p>
                </div>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex gap-6 items-start hover:bg-slate-800 transition-colors"
             >
                <div className="w-12 h-12 rounded-xl bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-400">
                   <Database className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">Signál vs. Šum</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">
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
