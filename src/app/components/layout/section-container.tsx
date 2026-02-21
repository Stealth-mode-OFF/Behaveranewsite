import { cn } from "@/app/components/ui/utils";
import type { ReactNode, HTMLAttributes } from "react";

/**
 * Section — enforced vertical spacing wrapper.
 *
 * Rules:
 * - Only sm / md / lg spacing variants — NO custom padding
 * - Every homepage section MUST use this wrapper
 *
 * spacing="lg"  → section-spacing  (80→112→148 px)
 * spacing="md"  → section-spacing  (same as lg, default)
 * spacing="sm"  → section-spacing-compact (48→64 px)
 */
interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

export function Section({
  children,
  spacing = "md",
  className,
  ...props
}: SectionProps) {
  const spacingClass = spacing === "sm" ? "section-spacing-compact" : "section-spacing";

  return (
    <section className={cn(spacingClass, className)} {...props}>
      {children}
    </section>
  );
}

/**
 * Container — enforced max-width + horizontal padding.
 *
 * Rules:
 * - width="default" → 1200px (--section-max-width)
 * - width="narrow"  → 800px  (--section-max-width-narrow)
 * - width="wide"    → 1400px (--section-max-width-wide)
 * - Sections must NOT manually define max-width or horizontal padding
 */
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: "default" | "narrow" | "wide";
  className?: string;
}

export function Container({
  children,
  width = "default",
  className,
  ...props
}: ContainerProps) {
  const widthClass =
    width === "narrow"
      ? "container-narrow"
      : width === "wide"
        ? "container-wide"
        : "container-default";

  return (
    <div className={cn(widthClass, className)} {...props}>
      {children}
    </div>
  );
}
