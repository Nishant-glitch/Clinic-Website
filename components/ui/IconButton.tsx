import * as React from "react";
import { cn } from "@/lib/utils";

export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  "aria-label": string;
}

const iconButtonVariants: Record<IconButtonVariant, string> = {
  standard: "text-md-on-surface-variant hover:bg-md-primary/10 active:scale-95",
  filled: "bg-md-primary text-md-on-primary shadow-sm hover:opacity-90 active:scale-95",
  tonal: "bg-md-secondary-container text-md-on-secondary-container hover:opacity-90 active:scale-95",
  outlined: "border border-md-outline/60 text-md-primary hover:bg-md-primary/10 active:scale-95",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "standard", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full cursor-pointer",
          "transition-all duration-200 ease-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          iconButtonVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
