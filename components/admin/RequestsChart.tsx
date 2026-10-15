"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  label: string;
  count: number;
}

interface RequestsChartProps {
  data: DataPoint[];
  title?: string;
  className?: string;
}

export function RequestsChart({
  data,
  title = "Appointment Requests (Last 14 Days)",
  className,
}: RequestsChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.count), 5);

  return (
    <div
      className={cn(
        "rounded-2xl border border-outline-variant/60 bg-surface p-5 shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-on-surface">{title}</h3>
          <p className="text-xs text-on-surface-variant">Daily volume of online consultation requests</p>
        </div>
        {hoveredIdx !== null && (
          <div className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container animate-in fade-in duration-100">
            {data[hoveredIdx].label}: {data[hoveredIdx].count} request{data[hoveredIdx].count === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="relative pt-6 pb-2">
        {/* Subtle horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 opacity-20">
          <div className="border-b border-outline" />
          <div className="border-b border-outline" />
          <div className="border-b border-outline" />
        </div>

        {/* Bars Container */}
        <div className="relative flex items-end justify-between gap-1 sm:gap-2 h-44 px-2">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.count / maxVal) * 100, 6);
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center group cursor-pointer relative h-full justify-end"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={cn(
                    "w-full max-w-[28px] rounded-t-lg transition-all duration-200",
                    isHovered
                      ? "bg-primary scale-x-110 shadow-md"
                      : "bg-primary-container hover:bg-primary/70"
                  )}
                />

                {/* Date Label */}
                <span
                  className={cn(
                    "mt-2 text-[10px] sm:text-[11px] truncate w-full text-center font-medium transition-colors",
                    isHovered ? "text-primary font-bold" : "text-on-surface-variant"
                  )}
                >
                  {item.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
