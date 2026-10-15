"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  );
  const [prevControlled, setPrevControlled] = React.useState(controlledValue);

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const isUserTyping = React.useRef(false);

  if (controlledValue !== prevControlled) {
    setPrevControlled(controlledValue);
    setInternalValue(controlledValue !== undefined ? controlledValue : defaultValue);
  }

  React.useEffect(() => {
    if (!isUserTyping.current) return;

    const handler = setTimeout(() => {
      isUserTyping.current = false;
      onChangeRef.current(internalValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs]);

  const handleClear = () => {
    isUserTyping.current = false;
    setInternalValue("");
    onChangeRef.current("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true;
    setInternalValue(e.target.value);
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-on-surface-variant pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full rounded-full bg-surface-container-high border border-transparent px-9 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
