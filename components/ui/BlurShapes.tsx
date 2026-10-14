import * as React from "react";
import { cn } from "@/lib/utils";

export interface BlurShapesProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "hero" | "subtle" | "accent";
}

export function BlurShapes({ variant = "hero", className, ...props }: BlurShapesProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none -z-10",
        className
      )}
      {...props}
    >
      {variant === "hero" && (
        <>
          <div className="absolute -top-24 -left-20 h-72 w-72 md:h-96 md:w-96 rounded-full bg-md-primary/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 h-80 w-80 md:h-[28rem] md:w-[28rem] rounded-full bg-md-secondary-container/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 md:h-80 md:w-80 rounded-full bg-md-tertiary/15 blur-3xl" />
        </>
      )}

      {variant === "subtle" && (
        <>
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-md-primary/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-md-secondary-container/20 blur-3xl" />
        </>
      )}

      {variant === "accent" && (
        <>
          <div className="absolute -top-16 right-1/4 h-80 w-80 rounded-full bg-md-primary/25 blur-3xl" />
          <div className="absolute -bottom-16 left-1/4 h-72 w-72 rounded-full bg-md-tertiary/20 blur-3xl" />
        </>
      )}
    </div>
  );
}
