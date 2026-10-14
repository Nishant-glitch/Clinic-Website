import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

// TODO: In Step 3 (Frontend), complete footer with timings, address, Google Maps link, and India DPDP Act compliance privacy notes.
export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-low py-12 text-sm text-on-surface-variant">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-base text-on-surface">{siteConfig.name}</h3>
          <p className="mt-2 text-xs">{siteConfig.tagline}</p>
          <p className="mt-4 text-xs">Dr. In-Charge: {siteConfig.doctor.name}</p>
        </div>
        <div>
          <h4 className="font-semibold text-on-surface mb-2">Clinic Hours</h4>
          <p className="text-xs">{siteConfig.timings.days}</p>
          <p className="text-xs">{siteConfig.timings.morning}</p>
          <p className="text-xs">{siteConfig.timings.evening}</p>
        </div>
        <div>
          <h4 className="font-semibold text-on-surface mb-2">Contact & Visit</h4>
          <p className="text-xs">{siteConfig.address.fullAddress}</p>
          <p className="mt-2 text-xs">Call: {siteConfig.phoneDisplay}</p>
          <p className="text-xs">WhatsApp: {siteConfig.whatsappDisplay}</p>
        </div>
        <div>
          <h4 className="font-semibold text-on-surface mb-2">Quick Links</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
            <li><Link href="/appointment" className="hover:text-primary">Request Appointment</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy (DPDP 2023)</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 mt-8 pt-4 border-t border-outline-variant/20 text-center text-xs">
        <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
