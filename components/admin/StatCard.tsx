import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className,
}: StatCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "relative rounded-2xl bg-surface-container border border-outline-variant/60 p-5 shadow-xs transition-all duration-200",
        isClickable &&
          "cursor-pointer hover:border-primary/40 hover:shadow-md hover:bg-surface-container-high active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-on-surface">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-2xs">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-outline-variant/30 text-xs">
          {trend && (
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-on-surface-variant truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
