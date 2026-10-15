"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FilterChips({
  options,
  selectedId,
  onChange,
  className,
}: FilterChipsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none border",
              isSelected
                ? "bg-primary text-on-primary border-primary shadow-2xs font-semibold"
                : "bg-surface-container border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            )}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[11px] font-bold leading-tight",
                  isSelected
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-variant text-on-surface-variant"
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
