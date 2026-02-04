import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 tracking-[0.01em]",
  {
    variants: {
      variant: {
        // PRIMARY: System command - authoritative decision
        default: 
          "bg-[var(--button-primary-bg)] text-white border border-[var(--button-primary-border)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-bg-hover)] hover:shadow-[var(--button-shadow-hover)] active:shadow-[var(--button-shadow-active)] active:translate-y-[1px]",
        
        // SECONDARY: Contextual interaction - intelligent alternative
        outline:
          "border border-[var(--button-secondary-border)] text-brand-primary bg-[var(--button-secondary-bg)] hover:border-[var(--button-secondary-border-hover)] hover:bg-brand-primary/[0.04] active:bg-brand-primary/[0.08]",
        
        // TERTIARY: Silent utility - low-hierarchy action
        ghost: 
          "text-brand-primary hover:bg-[var(--button-ghost-bg-hover)] active:bg-brand-primary/[0.12]",
        
        // INVERSE: For dark backgrounds (purple sections)
        inverse:
          "bg-white text-brand-primary border border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-white/95 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12)] active:translate-y-[1px]",
        
        // DESTRUCTIVE: System warning action
        destructive:
          "bg-brand-error text-white border border-red-700/20 hover:bg-red-700 shadow-[var(--button-shadow)]",
        
        // LINK: Inline text action
        link: 
          "text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-hover",
      },
      size: {
        default: "h-[var(--button-height)] px-[var(--button-padding-x)] text-[15px] font-semibold",
        sm: "h-[var(--button-height-sm)] px-5 text-[14px] font-semibold",
        lg: "h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] text-base font-semibold",
        icon: "h-[var(--button-height)] w-[var(--button-height)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        // Apply component tokens
        "rounded-[var(--button-radius)] font-[var(--button-font-weight)]" 
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
