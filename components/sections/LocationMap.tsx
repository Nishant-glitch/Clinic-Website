import * as React from "react";
import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import {
  Container,
  Card,
  SectionHeading,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function LocationMap() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address.fullAddress
  )}`;

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <section id="location-map" className="py-12 md:py-20 bg-md-surface-container-low">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Clinic Location & Directions"
            title="Convenient Access in Andheri West"
            subtitle="Centrally located with easy access from metro stations, auto stands, and nearby parking."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-stretch">
          {/* Left: Contact Info & Timings Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <MotionReveal delay={0.1}>
              <Card variant="container" className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-md-on-background">Clinic Address</h3>
                    <p className="text-xs text-md-primary font-medium">{siteConfig.address.landmark}</p>
                  </div>
                </div>

                <p className="body-md text-md-on-surface-variant leading-relaxed">
                  {siteConfig.address.fullAddress}
                </p>

                <div className="pt-2">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-md-primary hover:underline"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </Card>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <Card variant="container" className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-md-on-background">Consultation OPD Hours</h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {siteConfig.timings.isOpenToday}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-md-on-surface-variant space-y-1 pt-1">
                  <p className="flex justify-between border-b border-md-outline/10 pb-1">
                    <span className="font-medium text-md-on-background">{siteConfig.timings.days}:</span>
                    <span>{siteConfig.timings.morning} &amp; {siteConfig.timings.evening}</span>
                  </p>
                  <p className="flex justify-between pt-1">
                    <span className="font-medium text-md-on-background">Sunday:</span>
                    <span>{siteConfig.timings.sunday}</span>
                  </p>
                </div>
              </Card>
            </MotionReveal>

            <MotionReveal delay={0.3}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-call text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call {siteConfig.phoneDisplay}</span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-whatsapp text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </MotionReveal>
          </div>

          {/* Right: Embedded Google Map iframe */}
          <div className="lg:col-span-7">
            <MotionReveal delay={0.2} className="h-full">
              <div className="w-full h-full min-h-[360px] md:min-h-[460px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-md-outline/15 bg-md-surface-container">
                <iframe
                  title="Google Maps Location of Dr. Sharma's Family Care Clinic"
                  src={siteConfig.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[360px] md:min-h-[460px]"
                />
              </div>
            </MotionReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
