"use client";

import * as React from "react";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Container, Button } from "@/components/ui";
import { useBooking } from "@/components/booking";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function CTABanner() {
  const { openBooking } = useBooking();

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <section className="py-8 md:py-14">
      <Container>
        <MotionReveal>
          <div className="relative rounded-[24px] md:rounded-[48px] bg-md-primary text-md-on-primary overflow-hidden p-8 sm:p-12 md:p-16 text-center shadow-xl">
            {/* Decorative Organic Shapes */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none -z-0">
              <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-md-tertiary/25 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                Fast &amp; Convenient Medical Access
              </span>

              <h2 className="display-lg font-extrabold tracking-tight text-white">
                Prioritize Your Health with Trusted Care Today
              </h2>

              <p className="body-md sm:body-lg text-white/90 max-w-xl mx-auto leading-relaxed">
                Take the first step toward lasting wellness. Submit a 60-second appointment
                request, and our clinic desk will coordinate your seamless visit.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button
                  type="button"
                  variant="filled"
                  size="lg"
                  onClick={() => openBooking()}
                  className="bg-white text-md-primary hover:bg-white/95 shadow-md"
                  leftIcon={<Calendar className="h-5 w-5" aria-hidden="true" />}
                >
                  Book Appointment Now
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-whatsapp text-white font-semibold text-base shadow-md hover:opacity-95 active:scale-95 transition-all duration-200 ease-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              <p className="text-xs text-white/80 pt-2 flex items-center justify-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>Prefer direct phone call? Call {siteConfig.phoneDisplay}</span>
              </p>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
