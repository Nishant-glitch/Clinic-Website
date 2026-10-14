import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "secondary"
  | "primary"
  | "tertiary"
  | "outline"
  | "success"
  | "error";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  secondary: "bg-md-secondary-container text-md-on-secondary-container",
  primary: "bg-md-primary/15 text-md-primary font-semibold",
  tertiary: "bg-md-tertiary/15 text-md-tertiary font-semibold",
  outline: "border border-md-outline/40 text-md-on-surface-variant bg-transparent",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
  error: "bg-md-error-container text-md-on-error-container",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "secondary", size = "sm", icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide select-none transition-colors",
          size === "sm" && "px-3 py-1 text-xs",
          size === "md" && "px-4 py-1.5 text-sm",
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";
