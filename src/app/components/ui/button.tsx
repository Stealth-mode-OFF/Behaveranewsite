import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md hover:shadow-lg transition-all duration-300 border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-[1.5px] border-brand-primary text-brand-primary bg-transparent hover:bg-brand-secondary/50",
        secondary:
          "bg-brand-secondary text-brand-primary hover:bg-brand-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Updated to use CSS variables for height and padding
        default: "h-[var(--button-height)] px-[var(--button-padding-x)] py-2", 
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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
