import * as React from "react";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <div className="py-8 space-y-10 animate-pulse">
      <Container>
        {/* Banner Skeleton */}
        <div className="h-64 rounded-[32px] md:rounded-[48px] bg-md-surface-container/60 border border-md-outline/10 flex flex-col justify-center px-8 md:px-12 space-y-4">
          <div className="h-4 w-28 rounded-full bg-md-surface-container-high" />
          <div className="h-10 w-2/3 max-w-md rounded-2xl bg-md-surface-container-high" />
          <div className="h-4 w-1/2 max-w-sm rounded-full bg-md-surface-container-high" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 rounded-[24px] bg-md-surface-container/40 border border-md-outline/10 p-6 space-y-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-md-surface-container-high" />
              <div className="h-5 w-3/4 rounded-xl bg-md-surface-container-high" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded-full bg-md-surface-container-high" />
                <div className="h-3 w-4/5 rounded-full bg-md-surface-container-high" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
