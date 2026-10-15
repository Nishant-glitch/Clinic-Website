"use client";

import * as React from "react";
import { X, CalendarCheck2 } from "lucide-react";
import { useBooking } from "./BookingContext";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { IconButton } from "@/components/ui/IconButton";

export function BookingModal() {
  const { isOpen, closeBooking, preselectedService } = useBooking();
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Esc key listener & Body scroll lock
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeBooking();
      } else if (e.key === "Tab" && modalRef.current) {
        // Focus trap
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on the dialog container
    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector<HTMLElement>("input, button");
      firstInput?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, closeBooking]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={closeBooking}
      />

      {/* Modal Dialog Sheet */}
      <div
        ref={modalRef}
        className="relative z-10 w-full sm:max-w-2xl bg-md-surface-container rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-md-outline/15 max-h-[90vh] overflow-y-auto flex flex-col transition-all duration-300 ease-md"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-md-surface-container/95 backdrop-blur-md px-6 py-4 border-b border-md-outline/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
              <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-base sm:text-lg font-bold text-md-on-background">
                Book Clinic Consultation
              </h2>
              <p className="text-xs text-md-on-surface-variant">
                Dr. Sharma&apos;s Family Care Clinic • Zero Waiting Queue
              </p>
            </div>
          </div>

          <IconButton
            variant="standard"
            aria-label="Close appointment popup"
            onClick={closeBooking}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-6">
          <AppointmentForm
            compact
            preselectedService={preselectedService}
            onCancel={closeBooking}
          />
        </div>
      </div>
    </div>
  );
}
