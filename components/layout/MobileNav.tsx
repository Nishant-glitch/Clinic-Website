"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Calendar, Clock, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Button, IconButton } from "@/components/ui";
import { useBooking } from "@/components/booking";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact Us" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Simple focus trap
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div className="md:hidden">
      {/* Trigger Button */}
      <IconButton
        variant="standard"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6 text-md-on-background" />
      </IconButton>

      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-in Sheet */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation"
        onKeyDown={handleTabKey}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[82vw] max-w-sm bg-md-surface-container rounded-l-[28px] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto",
          "transition-transform duration-300 ease-md border-l border-md-outline/10",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-md-outline/15">
            <div>
              <p className="font-bold text-base text-md-primary tracking-tight">
                {siteConfig.shortName}
              </p>
              <p className="text-xs text-md-on-surface-variant">
                {siteConfig.doctor.name}
              </p>
            </div>
            <IconButton
              ref={closeButtonRef}
              variant="standard"
              aria-label="Close navigation"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5 text-md-on-background" />
            </IconButton>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 py-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ease-md",
                    isActive
                      ? "bg-md-secondary-container text-md-on-secondary-container font-semibold"
                      : "text-md-on-surface-variant hover:bg-md-primary/10 hover:text-md-on-background active:scale-98"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & CTAs */}
        <div className="pt-6 border-t border-md-outline/15 space-y-4">
          <Button
            type="button"
            variant="filled"
            size="md"
            onClick={() => {
              setIsOpen(false);
              openBooking();
            }}
            className="w-full justify-center"
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            Book Appointment
          </Button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-full bg-whatsapp text-white text-sm font-medium hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="space-y-1.5 pt-2 text-xs text-md-on-surface-variant">
            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-md-primary" />
              <span>{siteConfig.timings.isOpenToday}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-md-primary" />
              <a href={`tel:${siteConfig.phone}`} className="hover:underline">
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-md-primary" />
              <span>{siteConfig.address.landmark}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
