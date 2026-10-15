import * as React from "react";
import type { Metadata } from "next";
import {
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  CalendarCheck2,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import {
  Container,
  Card,
  PageHero,
  Badge,
} from "@/components/ui";
import { AppointmentForm } from "@/components/forms/AppointmentForm";

export const metadata: Metadata = {
  title: `Book an Appointment | ${siteConfig.name}`,
  description: `Schedule your outpatient consultation with Dr. Rajiv Sharma at Family Care Clinic in Andheri West. Quick 1-minute request with priority front-desk callback.`,
  alternates: {
    canonical: `${siteConfig.url}/appointment`,
  },
  openGraph: {
    title: `Schedule Clinic Visit | ${siteConfig.name}`,
    description: `Book consultation slots for General OPD, Diabetes, Pediatrics, or preventive health. Near-zero waiting times.`,
    url: `${siteConfig.url}/appointment`,
  },
};

interface AppointmentPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function AppointmentPage({ searchParams }: AppointmentPageProps) {
  const { service } = await searchParams;

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* 1. Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "Appointment" }]}
        eyebrow="Zero Waiting Queue"
        title="Request Your Consultation Slot"
        subtitle="Submit your preferred date and time. Our receptionist will call your number within 15–30 minutes to confirm your scheduled doctor consultation."
      />

      {/* 2. Form & Clinic Info (2 Columns) */}
      <section className="py-2">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form inside a large Card (Form first on mobile) */}
            <div className="lg:col-span-7 order-1">
              <Card variant="container" className="p-6 sm:p-8 md:p-10 border border-md-outline/10 shadow-sm">
                <div className="flex items-center gap-3 pb-6 border-b border-md-outline/10 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                    <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="headline-sm font-bold text-md-on-background">
                      Patient Details &amp; Preferred Timing
                    </h2>
                    <p className="text-xs text-md-on-surface-variant">
                      Takes under 60 seconds • No immediate payment needed
                    </p>
                  </div>
                </div>

                <AppointmentForm preselectedService={service} />
              </Card>
            </div>

            {/* Right Column: Info Card (Below form on mobile) */}
            <div className="lg:col-span-5 order-2 space-y-6">
              {/* What Happens Next Card */}
              <Card variant="container" className="p-6 md:p-7 space-y-4 border border-md-outline/10">
                <Badge variant="primary" size="sm">
                  Transparent Process
                </Badge>
                <h3 className="font-bold text-base text-md-on-background">
                  What Happens After You Submit?
                </h3>

                <div className="space-y-3.5 text-xs text-md-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-md-primary text-md-on-primary font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-md-on-background">Front Desk Callback</p>
                      <p className="mt-0.5">Our clinic staff reviews doctor availability and rings you within 15–30 minutes to lock your consultation slot.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-md-primary text-md-on-primary font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-md-on-background">Slot Confirmation</p>
                      <p className="mt-0.5">You receive clinic directions and timing details on WhatsApp for a smooth arrival.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-md-primary text-md-on-primary font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-md-on-background">Visit With Zero Queue</p>
                      <p className="mt-0.5">Arrive at your scheduled time and consult Dr. Sharma without waiting in crowded lines.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Clinic Timings & Location Card */}
              <Card variant="container" className="p-6 md:p-7 space-y-4 border border-md-outline/10 bg-md-surface-container-low">
                <h3 className="font-bold text-base text-md-on-background flex items-center gap-2">
                  <Clock className="h-4 w-4 text-md-primary" />
                  <span>OPD Consultation Timings</span>
                </h3>

                <div className="text-xs space-y-2 text-md-on-surface-variant border-b border-md-outline/10 pb-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-md-on-background">{siteConfig.timings.days}</span>
                    <span>{siteConfig.timings.morning} &amp; {siteConfig.timings.evening}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-md-on-background">Sunday</span>
                    <span>{siteConfig.timings.sunday}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                    {siteConfig.timings.isOpenToday}
                  </p>
                </div>

                {/* Contact & Location info */}
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-md-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-md-on-background">{siteConfig.address.fullAddress}</p>
                      <p className="text-md-on-surface-variant mt-0.5">{siteConfig.address.landmark}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-md-primary flex-shrink-0" />
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="font-semibold text-md-primary hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-call text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Reception</span>
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-whatsapp text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>

                <div className="pt-2 text-[11px] text-md-on-surface-variant/80 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Compliant with DPDP Act 2023. We never share your phone number.</span>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
