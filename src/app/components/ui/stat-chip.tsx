import { cn } from "./utils";
import type { LucideIcon } from "lucide-react";

/**
 * StatChip — supporting proof metric, NOT a dominant element.
 *
 * Rules:
 * - Fixed height (h-8), compact padding, caption typography
 * - Subtle background, no thick borders, no large shadows
 * - Bold number but NOT huge — must never compete with core KPIs
 *   (50,000+ / 80%+ / 2 min in StatsBar)
 *
 * Usage: proof chips below logo marquee (+37%, +25%, 60%)
 */
interface StatChipProps {
  icon: LucideIcon;
  metric: string;
  label: string;
  company: string;
  className?: string;
}

export function StatChip({ icon: Icon, metric, label, company, className }: StatChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-8 px-3 rounded-lg",
        "bg-brand-background-secondary/60 border border-brand-border/50",
        "transition-colors hover:bg-brand-background-secondary",
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5 text-brand-primary/60 shrink-0" />
      <span className="text-caption font-bold text-brand-text-primary whitespace-nowrap">
        {metric}
      </span>
      <span className="text-caption text-brand-text-muted truncate">
        {label} — <span className="font-medium">{company}</span>
      </span>
    </div>
  );
}
