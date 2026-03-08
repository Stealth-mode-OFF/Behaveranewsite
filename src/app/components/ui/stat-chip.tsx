import { cn } from "./utils";
import type { LucideIcon } from "lucide-react";
import { chipTokens } from "@/app/design/tokens";

/**
 * StatChip — lightweight proof pill, NOT a dominant element.
 *
 * Rules:
 * - Natural height via py-1.5 (no h-* + py-* combo that inflates)
 * - Caption typography, no large fonts
 * - Subtle background, thin border, no heavy shadows
 * - Must never compete with core KPIs (50 000+ / 80%+ / 2 min)
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
      data-testid="proof-chip"
      className={cn(
        chipTokens.sm,
        "bg-brand-background-secondary/60 border border-brand-border/40",
        "transition-colors hover:bg-brand-background-secondary",
        "max-w-[calc(100vw-2rem)] sm:max-w-none",
        className,
      )}
    >
      <Icon className="w-3 h-3 text-brand-primary/50 shrink-0" />
      <span className="text-caption font-semibold text-brand-text-primary whitespace-nowrap">
        {metric}
      </span>
      <span className="text-caption text-brand-text-muted truncate">
        {label} — <span className="font-medium">{company}</span>
      </span>
    </div>
  );
}
