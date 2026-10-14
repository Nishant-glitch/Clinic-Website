import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), complete mobile sticky bottom navigation bar with Call, WhatsApp, and Quick Book action triggers.
export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-outline-variant/30 bg-surface/95 px-4 backdrop-blur-lg md:hidden">
      <a
        href={`tel:${siteConfig.phone}`}
        className="flex flex-col items-center justify-center text-xs text-on-surface hover:text-primary"
      >
        <span>Call</span>
      </a>
      <a
        href={`https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-xs text-emerald-600 font-medium"
      >
        <span>WhatsApp</span>
      </a>
      <Link
        href="/appointment"
        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow"
      >
        Book Request
      </Link>
    </nav>
  );
}
