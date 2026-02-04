import React from "react";
import { motion } from "framer-motion";

const questions = [
  "Jak se dnes cítíte v práci?",
  "Máte dostatek času na dokončení svých úkolů?",
  "Cítíte podporu od svého nadřízeného?",
];

export function QuestionnairePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-brand-border rounded-lg shadow-sm"
    >
      <div className="p-6 md:p-8 border-b border-brand-border">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-text-muted uppercase tracking-widest">
          <span>Question 2 of 6</span>
          <span>Pulse preview</span>
        </div>
        <div className="mt-3 h-2 w-full bg-brand-background-secondary rounded-full overflow-hidden">
          <div className="h-full w-[33%] bg-brand-primary" />
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {questions.map((question) => (
          <div key={question} className="bg-brand-background-secondary border border-brand-border rounded-lg p-5">
            <p className="text-brand-text-primary font-medium mb-4">{question}</p>
            <div className="grid grid-cols-5 gap-2 text-xs text-brand-text-muted">
              {[1, 2, 3, 4, 5].map((value) => (
                <div
                  key={value}
                  className="h-10 rounded-md border border-brand-border bg-white flex items-center justify-center font-semibold text-brand-text-secondary"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-8 py-4 border-t border-brand-border text-center text-xs text-brand-text-muted">
        Powered by Echo Pulse
      </div>
    </motion.div>
  );
}
