import React from 'react';
import { AlertTriangle, Binary } from 'lucide-react';

// A strict, technical summary box
export const ExecutiveSummary = ({ points }: { points: string[] }) => {
  return (
    <div className="my-12 border-l-4 border-brand-primary pl-6 py-2 bg-brand-background-secondary rounded-r-lg">
      <h3 className="text-brand-primary font-mono text-xs uppercase tracking-widest mb-4 font-bold">
        // Executive Summary
      </h3>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="text-brand-text-secondary text-lg leading-relaxed font-medium">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Highlights critical system failures
export const SystemAlert = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="my-8 p-6 bg-red-50 border border-red-100 rounded-lg relative overflow-hidden">
      <div className="flex items-center gap-3 mb-3 text-red-600">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-mono text-xs uppercase tracking-widest font-bold">{title}</span>
      </div>
      <div className="text-brand-text-secondary leading-relaxed relative z-10">
        {children}
      </div>
    </div>
  );
};

// Highlights a key insight or truth
export const KeyConcept = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="my-8 p-6 bg-brand-background-secondary border border-brand-border rounded-lg">
      <div className="flex items-center gap-3 mb-3 text-brand-primary">
        <Binary className="w-5 h-5" />
        <span className="font-mono text-xs uppercase tracking-widest font-bold">{title}</span>
      </div>
      <div className="text-brand-primary text-lg font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// A step in a protocol
export const ProtocolStep = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => {
  return (
    <div className="flex gap-6 my-8 py-4 border-t border-brand-border group hover:bg-brand-background-secondary transition-colors p-4 -mx-4 rounded-lg">
      <div className="font-mono text-brand-text-muted text-sm pt-1">
        {number}
      </div>
      <div>
        <h4 className="text-brand-primary font-bold text-lg mb-2 group-hover:text-brand-accent transition-colors flex items-center gap-2">
          {title}
        </h4>
        <div className="text-brand-text-secondary leading-relaxed max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

// A quote, but formatted as a data point
export const DataPoint = ({ value, label }: { value: string, label: string }) => {
    return (
        <div className="my-12 flex flex-col md:flex-row items-baseline gap-4 border-b border-brand-border pb-6">
            <span className="text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">{value}</span>
            <span className="text-brand-text-muted font-mono text-xs uppercase tracking-wider">{label}</span>
        </div>
    )
}
