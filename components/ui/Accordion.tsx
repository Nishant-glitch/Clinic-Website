"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const contentId = `accordion-content-${item.id}`;
        const buttonId = `accordion-button-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-[20px] transition-all duration-300 ease-md border border-md-outline/10",
              isOpen
                ? "bg-md-surface-container shadow-sm border-md-primary/20"
                : "bg-md-surface-container-low hover:bg-md-surface-container"
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between text-left p-5 md:p-6 cursor-pointer select-none font-medium text-md-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary rounded-[20px]"
              >
                <span className="text-sm md:text-base pr-4 font-semibold leading-snug">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full bg-md-secondary-container/50 flex items-center justify-center transition-transform duration-300 ease-md",
                    isOpen && "rotate-180 bg-md-primary text-md-on-primary"
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={contentId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-300 ease-md px-5 md:px-6",
                isOpen
                  ? "grid-rows-[1fr] opacity-100 pb-5 md:pb-6"
                  : "grid-rows-[0fr] opacity-0 pb-0 invisible"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-xs md:text-sm text-md-on-surface-variant leading-relaxed pt-1 border-t border-md-outline/10">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
