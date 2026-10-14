import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, required, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1"
        >
          {label}
          {required && <span className="text-md-error">*</span>}
        </label>
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full h-14 px-4 pt-1 text-sm bg-md-surface-container-low rounded-t-[12px] rounded-b-none",
              "border-b-2 border-md-outline/60 transition-all duration-200 ease-md",
              "text-md-on-background placeholder:text-md-on-surface-variant/50",
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

Input.displayName = "Input";
