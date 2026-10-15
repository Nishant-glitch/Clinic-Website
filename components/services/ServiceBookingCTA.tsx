"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { useBooking } from "@/components/booking";

export function ServiceBookingCTA({
  serviceTitle,
  size = "lg",
  variant = "filled",
}: {
  serviceTitle: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "tonal" | "outlined";
}) {
  const { openBooking } = useBooking();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => openBooking({ service: serviceTitle })}
      leftIcon={<Calendar className="h-4 w-4" />}
    >
      Book Consultation for This Service
    </Button>
  );
}
