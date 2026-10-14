import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

// TODO: In Step 3 (Frontend), implement styled dropdown menu / MD3 exposed dropdown.
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options = [], children, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-outline px-4 py-2.5 text-sm bg-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50",
            error && "border-error focus:border-error focus:ring-error",
            className
          )}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
