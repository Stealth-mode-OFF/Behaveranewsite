import React from "react";
import { cn } from "./utils";

interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "error" | "success";
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  badgeVariant = "default",
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const badgeColors = {
    default: "bg-brand-primary/5 text-brand-primary border-brand-primary/10",
    error: "bg-brand-error/5 text-brand-error border-brand-error/10",
    success: "bg-brand-success/5 text-brand-success border-brand-success/10",
  };

  return (
    <div
      className={cn(
        "max-w-3xl mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border",
            badgeColors[badgeVariant]
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4 leading-tight">
        {title}
        {titleHighlight && (
          <span className="text-brand-primary"> {titleHighlight}</span>
        )}
      </h2>

      {subtitle && (
        <p className="text-lg text-brand-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
