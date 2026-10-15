"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface ToastProps {
  toast?: ToastMessage | null;
  message?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ toast, message, type = "info", onClose, duration = 4000 }: ToastProps) {
  const activeToast = React.useMemo(() => {
    return toast || (message ? { id: "toast-direct", type, message } : null);
  }, [toast, message, type]);

  React.useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [activeToast, onClose, duration]);

  if (!activeToast) return null;

  const isSuccess = activeToast.type === "success";
  const isError = activeToast.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] px-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md",
          isSuccess && "bg-md-surface-container border-emerald-500/30 text-md-on-background",
          isError && "bg-md-error-container border-md-error/30 text-md-on-error-container",
          !isSuccess && !isError && "bg-md-surface-container text-md-on-background border-md-outline/20"
        )}
      >
        <div className="flex items-center gap-3">
          {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />}
          {isError && <AlertCircle className="h-5 w-5 text-md-error flex-shrink-0" />}
          <p className="text-sm font-medium leading-tight">{activeToast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="h-8 w-8 min-h-[32px] min-w-[32px] rounded-full hover:bg-black/5 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
