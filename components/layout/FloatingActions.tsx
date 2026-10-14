"use client";

import * as React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { FAB } from "@/components/ui";

export function FloatingActions() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div
      aria-label="Quick contact actions"
      className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end pointer-events-auto select-none"
    >
      {/* Call FAB */}
      <a
        href={`tel:${siteConfig.phone}`}
        aria-label={`Call clinic directly at ${siteConfig.phoneDisplay}`}
        className="group relative flex items-center"
      >
        <span className="hidden md:block absolute right-16 px-3 py-1.5 rounded-full bg-md-surface-container text-xs font-medium text-md-on-background shadow-md border border-md-outline/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Call Clinic
        </span>
        <FAB variant="call" aria-label="Call clinic">
          <Phone className="h-6 w-6" aria-hidden="true" />
        </FAB>
      </a>

      {/* WhatsApp FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with clinic on WhatsApp"
        className="group relative flex items-center"
      >
        <span className="hidden md:block absolute right-16 px-3 py-1.5 rounded-full bg-md-surface-container text-xs font-medium text-md-on-background shadow-md border border-md-outline/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          WhatsApp Us
        </span>
        <FAB variant="whatsapp" aria-label="Chat on WhatsApp">
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </FAB>
      </a>
    </div>
  );
}
