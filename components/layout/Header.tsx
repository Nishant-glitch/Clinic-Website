import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), complete sticky header with quick phone/WhatsApp CTA, mobile menu drawer, and Book Appointment popup trigger.
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/appointment"
            className="rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-on-primary shadow-sm hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </header>
  );
}
