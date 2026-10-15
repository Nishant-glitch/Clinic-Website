"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { useBooking } from "@/components/booking";

export interface ServiceMobileStickyBarProps {
  serviceTitle: string;
  duration?: string;
}

export function ServiceMobileStickyBar({
  serviceTitle,
  duration,
}: ServiceMobileStickyBarProps) {
  const { openBooking } = useBooking();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-md-surface-container/95 backdrop-blur-md px-4 py-3 border-t border-md-outline/15 shadow-lg flex items-center justify-between gap-3 safe-area-pb">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-md-on-background truncate">
          {serviceTitle}
        </p>
        <p className="text-[11px] text-md-primary font-medium">
          {duration ? `${duration} • ` : ""}Zero Waiting Queue
        </p>
      </div>

      <Button
        type="button"
        variant="filled"
        size="sm"
        onClick={() => openBooking({ service: serviceTitle })}
        leftIcon={<Calendar className="h-3.5 w-3.5" />}
        className="flex-shrink-0"
      >
        Book Now
      </Button>
    </div>
  );
}
