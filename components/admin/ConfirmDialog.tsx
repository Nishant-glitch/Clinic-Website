"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

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

  // Lock scroll
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Surface */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-3xl bg-surface-container-high border border-outline-variant p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isDestructive
                ? "bg-rose-100 text-rose-700"
                : "bg-primary-container text-on-primary-container"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1.5">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-bold text-on-surface"
            >
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="text"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="filled"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className={
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500"
                : ""
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
