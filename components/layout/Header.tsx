"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, Stethoscope } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { ButtonLink } from "@/components/ui";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-md-background/90 backdrop-blur-md border-b border-md-outline/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary rounded-xl p-1"
        >
          <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-md-primary text-md-on-primary flex items-center justify-center shadow-sm">
            <Stethoscope className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg text-md-on-background tracking-tight leading-tight">
              {siteConfig.name}
            </span>
            <span className="text-[11px] md:text-xs text-md-primary font-medium">
              {siteConfig.doctor.name} • {siteConfig.doctor.qualification}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-md",
                  isActive
                    ? "bg-md-secondary-container text-md-on-secondary-container font-semibold"
                    : "text-md-on-surface-variant hover:text-md-on-background hover:bg-md-surface-container"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={`tel:${siteConfig.phone}`}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-md-on-surface-variant hover:text-md-primary transition-colors py-2 px-3 rounded-full hover:bg-md-surface-container"
            aria-label={`Call clinic at ${siteConfig.phoneDisplay}`}
          >
            <Phone className="h-4 w-4 text-md-primary" aria-hidden="true" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>

          <ButtonLink
            href="/appointment"
            variant="filled"
            size="md"
            leftIcon={<Calendar className="h-4 w-4" aria-hidden="true" />}
          >
            Book Appointment
          </ButtonLink>
        </div>

        {/* Mobile Nav Trigger */}
        <MobileNav />
      </div>
    </header>
  );
}
