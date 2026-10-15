"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { useBooking } from "@/components/booking";

export function AboutDoctorBookingCTA({ doctorName }: { doctorName: string }) {
  const { openBooking } = useBooking();

  return (
    <Button
      type="button"
      variant="filled"
      size="lg"
      onClick={() => openBooking()}
      leftIcon={<Calendar className="h-5 w-5" aria-hidden="true" />}
    >
      Book Consultation with {doctorName}
    </Button>
  );
}
