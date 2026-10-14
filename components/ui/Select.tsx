import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options = [], error, helperText, id, required, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1">
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1"
        >
          {label}
          {required && <span className="text-md-error">*</span>}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full h-14 px-4 pr-10 text-sm bg-md-surface-container-low rounded-t-[12px] rounded-b-none appearance-none cursor-pointer",
              "border-b-2 border-md-outline/60 transition-all duration-200 ease-md",
              "text-md-on-background",
              "focus:outline-none focus:bg-md-surface-container focus:border-b-md-primary",
              error && "border-b-md-error focus:border-b-md-error bg-md-error-container/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-md-surface-container text-md-on-background py-2">
                  {opt.label}
                </option>
              ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-md-on-surface-variant"
            aria-hidden="true"
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

Select.displayName = "Select";
