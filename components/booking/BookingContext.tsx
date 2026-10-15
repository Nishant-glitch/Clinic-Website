"use client";

import * as React from "react";

interface BookingOptions {
  service?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  preselectedService?: string;
  openBooking: (options?: BookingOptions) => void;
  closeBooking: () => void;
}

const BookingContext = React.createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [preselectedService, setPreselectedService] = React.useState<string | undefined>(undefined);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const openBooking = React.useCallback((options?: BookingOptions) => {
    // Record current active element to restore focus on close
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
    setPreselectedService(options?.service);
    setIsOpen(true);
  }, []);

  const closeBooking = React.useCallback(() => {
    setIsOpen(false);
    // Restore focus back to trigger
    if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        preselectedService,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
