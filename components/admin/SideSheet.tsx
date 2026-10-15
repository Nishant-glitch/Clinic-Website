"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
}

export function SideSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  size = "md",
}: SideSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Esc key closes
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass =
    size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel: Fullscreen sheet on mobile (<768px), side sheet on desktop */}
      <div
        ref={sheetRef}
        className={cn(
          "relative flex h-full w-full flex-col bg-surface border-l border-outline-variant shadow-2xl z-10 transition-transform duration-300 ease-out",
          // Mobile: bottom-to-top sheet or full screen
          "inset-x-0 bottom-0 top-12 rounded-t-[28px] md:top-0 md:rounded-t-none md:rounded-l-[28px]",
          maxWidthClass,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/60 px-6 py-5">
          <div className="space-y-0.5">
            {title && (
              <h2 className="text-lg font-bold text-on-surface">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xs text-on-surface-variant">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="border-t border-outline-variant/60 bg-surface-container-low px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
