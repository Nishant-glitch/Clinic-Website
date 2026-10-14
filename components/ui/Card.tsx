import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "filled" | "outlined";
}

// TODO: In Step 3 (Frontend), style Material Design 3 cards with elevation layers and container styles.
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "elevated", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all",
          variant === "elevated" && "bg-surface-container-low shadow-sm hover:shadow-md",
          variant === "filled" && "bg-surface-container-highest",
          variant === "outlined" && "border border-outline-variant bg-surface",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
