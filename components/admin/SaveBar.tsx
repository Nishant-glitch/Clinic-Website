"use client";

import * as React from "react";
import { AlertCircle, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SaveBarProps {
  hasChanges: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  isSaving?: boolean;
  message?: string;
  className?: string;
}

export function SaveBar({
  hasChanges,
  onSave,
  onDiscard,
  isSaving = false,
  message = "You have unsaved changes",
  className,
}: SaveBarProps) {
  // Warn on leaving with unsaved changes
  React.useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  if (!hasChanges) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 inset-x-4 z-40 mx-auto max-w-4xl rounded-2xl bg-on-surface border border-outline-variant/30 p-4 shadow-2xl text-surface transition-all duration-300 animate-in slide-in-from-bottom-5",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-950 font-bold shrink-0">
            <AlertCircle className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{message}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
            className="text-surface hover:bg-surface/10"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="filled"
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            className="bg-primary-container text-on-primary-container hover:bg-primary-container/90"
            leftIcon={<Check className="h-3.5 w-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
