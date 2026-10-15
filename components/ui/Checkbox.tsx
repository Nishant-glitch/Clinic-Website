import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, required, checked, onChange, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-3 cursor-pointer select-none group py-1",
            label && "min-h-[44px]",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              id={checkboxId}
              type="checkbox"
              ref={ref}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "h-5 w-5 rounded-[4px] border-2 transition-all duration-200 ease-md flex items-center justify-center",
                "border-md-outline/70 bg-transparent group-hover:border-md-primary",
                "peer-checked:border-md-primary peer-checked:bg-md-primary",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-md-primary peer-focus-visible:ring-offset-2",
                error && "border-md-error"
              )}
            >
              <Check className="h-3.5 w-3.5 text-md-on-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {label && (
            <span className="text-xs text-md-on-surface-variant leading-relaxed">
              {label}
              {required && <span className="text-md-error ml-1">*</span>}
            </span>
          )}
        </label>
        {error && (
          <span id={errorId} className="text-xs text-md-error pl-8" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
