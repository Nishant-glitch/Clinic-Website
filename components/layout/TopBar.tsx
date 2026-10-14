import * as React from "react";
import { Clock, Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export function TopBar() {
  return (
    <div className="hidden md:block w-full bg-md-primary text-md-on-primary text-xs py-2 px-4 md:px-6 border-b border-md-on-primary/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 opacity-90">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{siteConfig.timings.days}: {siteConfig.timings.morning} &amp; {siteConfig.timings.evening}</span>
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{siteConfig.address.city}, {siteConfig.address.state}</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Call: {siteConfig.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{siteConfig.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
