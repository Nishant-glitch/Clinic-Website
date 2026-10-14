import * as React from "react";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  eyebrowVariant?: "secondary" | "primary" | "tertiary";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  eyebrowVariant = "secondary",
  className,
  ...props
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCentered ? "items-center text-center" : "items-start text-left",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <Badge variant={eyebrowVariant} size="sm">
          {eyebrow}
        </Badge>
      )}
      <h2 className="headline-md sm:headline-lg font-bold tracking-tight text-md-on-background">
        {title}
      </h2>
      {subtitle && (
        <p className="body-md sm:body-lg text-md-on-surface-variant max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
