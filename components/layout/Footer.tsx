import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { placeholderServices } from "@/lib/data/placeholder";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-md-surface-container text-md-on-surface-variant pt-16 pb-24 md:pb-12 border-t border-md-outline/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Col 1: About & Doctor */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-md-primary text-md-on-primary flex items-center justify-center">
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-lg text-md-on-background tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-md-on-surface-variant/90">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-md-on-surface-variant">
              <p className="font-semibold text-md-on-background">
                {siteConfig.doctor.name}
              </p>
              <p>{siteConfig.doctor.qualification}</p>
              <p className="text-[11px] text-md-primary mt-0.5">
                Reg: {siteConfig.doctor.registrationNumber}
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-sm text-md-on-background uppercase tracking-wider mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-md-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-md-primary transition-colors">
                  About the Clinic
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-md-primary transition-colors">
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-md-primary transition-colors">
                  Photo Gallery &amp; Tour
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-md-primary transition-colors font-medium text-md-primary">
                  Request an Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-md-primary transition-colors">
                  Contact &amp; Directions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-md-primary transition-colors text-xs opacity-80">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="font-semibold text-sm text-md-on-background uppercase tracking-wider mb-4">
              Medical Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              {placeholderServices.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <Link
                    href={`/services#${srv.slug}`}
                    className="hover:text-md-primary transition-colors"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-xs text-md-primary font-medium hover:underline mt-1"
                >
                  <span>View All Services</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & OPD Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-md-on-background uppercase tracking-wider mb-4">
              OPD Timings &amp; Visit
            </h3>
            <div className="space-y-2.5 text-xs text-md-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-md-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-md-on-background">{siteConfig.timings.days}</p>
                  <p>{siteConfig.timings.morning}</p>
                  <p>{siteConfig.timings.evening}</p>
                  <p className="text-[11px] text-md-tertiary mt-1">
                    Sunday: {siteConfig.timings.sunday}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="h-4 w-4 text-md-primary flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address.fullAddress}</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="h-4 w-4 text-md-primary flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-md-primary font-medium text-md-on-background">
                  {siteConfig.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-md-primary flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-md-primary">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-md-outline/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-md-on-surface-variant/80">
          <p>
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Compliant with India DPDP Act 2023</span>
            </span>
            <Link href="/privacy" className="hover:underline">
              Privacy &amp; Patient Rights
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
