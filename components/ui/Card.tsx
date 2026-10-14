import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  variant?: "container" | "low" | "outlined";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, variant = "container", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] p-6 shadow-sm border border-md-outline/10",
          "transition-all duration-300 ease-md",
          variant === "container" && "bg-md-surface-container",
          variant === "low" && "bg-md-surface-container-low",
          variant === "outlined" && "bg-transparent border-2 border-md-outline/30",
          interactive &&
            "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary",
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
