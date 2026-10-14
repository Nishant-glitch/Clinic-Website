import * as React from "react";
import { cn } from "@/lib/utils";

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "surface" | "secondary" | "whatsapp";
  size?: "default" | "small" | "large";
}

// TODO: In Step 3 (Frontend), implement MD3 Floating Action Button with icon animation and speed dial menu.
export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl shadow-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          size === "small" && "h-10 w-10 p-2 rounded-xl",
          size === "default" && "h-14 w-14 p-3.5 rounded-2xl",
          size === "large" && "h-16 w-16 p-4 rounded-3xl",
          variant === "primary" && "bg-primary-container text-on-primary-container hover:shadow-xl",
          variant === "surface" && "bg-surface-container-high text-primary hover:shadow-xl",
          variant === "secondary" && "bg-secondary-container text-on-secondary-container hover:shadow-xl",
          variant === "whatsapp" && "bg-whatsapp text-white hover:opacity-90",
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
