import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, required, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1">
        <label
          htmlFor={textareaId}
          className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1"
        >
          {label}
          {required && <span className="text-md-error">*</span>}
        </label>
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full px-4 py-3 text-sm bg-md-surface-container-low rounded-t-[12px] rounded-b-none",
              "border-b-2 border-md-outline/60 transition-all duration-200 ease-md",
              "text-md-on-background placeholder:text-md-on-surface-variant/50 resize-y min-h-[96px]",
              "focus:outline-none focus:bg-md-surface-container focus:border-b-md-primary",
              error && "border-b-md-error focus:border-b-md-error bg-md-error-container/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span id={errorId} className="text-xs text-md-error mt-0.5" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-xs text-md-on-surface-variant/80 mt-0.5">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
