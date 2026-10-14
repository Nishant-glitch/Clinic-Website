import * as React from "react";
import { cn } from "@/lib/utils";

export type FABVariant = "tertiary" | "primary" | "whatsapp" | "call";

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FABVariant;
  "aria-label": string;
}

const fabVariantStyles: Record<FABVariant, string> = {
  tertiary: "bg-md-tertiary text-white hover:opacity-95",
  primary: "bg-md-primary text-md-on-primary hover:opacity-95",
  whatsapp: "bg-whatsapp text-white hover:opacity-95 shadow-whatsapp/30",
  call: "bg-call text-white hover:opacity-95 shadow-call/30",
};

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, variant = "tertiary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl cursor-pointer select-none",
          "shadow-md hover:shadow-xl active:scale-95",
          "transition-all duration-300 ease-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-md-primary",
          fabVariantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FAB.displayName = "FAB";
