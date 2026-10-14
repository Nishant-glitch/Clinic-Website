import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "error" | "outline";
}

// TODO: In Step 3 (Frontend), implement MD3 badges/chips with icon support.
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variant === "primary" && "bg-primary-container text-on-primary-container",
          variant === "secondary" && "bg-secondary-container text-on-secondary-container",
          variant === "success" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
          variant === "error" && "bg-error-container text-on-error-container",
          variant === "outline" && "border border-outline-variant text-on-surface-variant",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
