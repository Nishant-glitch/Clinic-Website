import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-low/60",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant mb-3.5 shadow-2xs">
        {icon || <Inbox className="h-7 w-7 stroke-[1.5]" />}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-on-surface">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-xs sm:text-sm text-on-surface-variant max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
