import * as React from "react";
import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Navigation,
  MessageSquare,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { getFaqs } from "@/lib/data";
import {
  Container,
  Card,
  PageHero,
  Badge,
  SectionHeading,
  Accordion,
} from "@/components/ui";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: `Contact Us & Directions | ${siteConfig.name}`,
  description: `Get in touch with Dr. Sharma's Family Care Clinic in Andheri West, Mumbai. Call our front desk, send a message, or get directions on Google Maps.`,
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact ${siteConfig.name} | Andheri West, Mumbai`,
    description: `Clinic address, OPD consultation schedule, phone number, and online message desk.`,
    url: `${siteConfig.url}/contact`,
  },
};

export default async function ContactPage() {
  const allFaqs = await getFaqs();
  const contactFaqs = allFaqs.slice(0, 4).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address.fullAddress
  )}`;

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* 1. Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "Contact Us" }]}
        eyebrow="Reach Our Clinic"
        title="We Are Here to Help Your Family"
        subtitle="Have questions about consultation fees, reports, or directions? Contact our front desk directly or submit an inquiry below."
      />

      {/* 2. Three Quick Contact Cards */}
      <section className="py-2">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="p-6 rounded-[28px] bg-md-surface-container border border-md-outline/10 hover:border-md-primary/40 transition-all duration-200 hover:shadow-md group block space-y-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-call/10 text-call flex items-center justify-center transition-colors group-hover:bg-call group-hover:text-white">
                <Phone className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-md-on-surface-variant">Phone Consultation &amp; Inquiry</p>
                <p className="headline-sm font-bold text-md-on-background mt-1">
                  {siteConfig.phoneDisplay}
                </p>
                <p className="text-xs text-md-primary font-medium mt-1 group-hover:underline">
                  Click to Call Now →
                </p>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-[28px] bg-md-surface-container border border-md-outline/10 hover:border-whatsapp/40 transition-all duration-200 hover:shadow-md group block space-y-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center transition-colors group-hover:bg-whatsapp group-hover:text-white">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-md-on-surface-variant">WhatsApp Prescription Desk</p>
                <p className="headline-sm font-bold text-md-on-background mt-1">
                  {siteConfig.whatsappDisplay}
                </p>
                <p className="text-xs text-whatsapp font-medium mt-1 group-hover:underline">
                  Chat on WhatsApp →
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="p-6 rounded-[28px] bg-md-surface-container border border-md-outline/10 hover:border-md-primary/40 transition-all duration-200 hover:shadow-md group block space-y-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center transition-colors group-hover:bg-md-primary group-hover:text-md-on-primary">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-md-on-surface-variant">Administrative Email</p>
                <p className="headline-sm font-bold text-md-on-background mt-1 truncate">
                  {siteConfig.email}
                </p>
                <p className="text-xs text-md-primary font-medium mt-1 group-hover:underline">
                  Send an Email →
                </p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* 3. Form + Clinic Timings & Location (2 Columns) */}
      <section className="py-2">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7">
              <Card variant="container" className="p-6 sm:p-8 md:p-10 border border-md-outline/10 shadow-sm">
                <div className="flex items-center gap-3 pb-6 border-b border-md-outline/10 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="headline-sm font-bold text-md-on-background">
                      Send Us an Online Inquiry
                    </h2>
                    <p className="text-xs text-md-on-surface-variant">
                      Our front office reviews and responds within 24 hours
                    </p>
                  </div>
                </div>

                <ContactForm />
              </Card>
            </div>

            {/* Right: Address & Timings Table */}
            <div className="lg:col-span-5 space-y-6">
              <Card variant="container" className="p-6 md:p-8 space-y-5 border border-md-outline/10">
                <div className="space-y-1">
                  <Badge variant="primary" size="sm">
                    In-Person Consultations
                  </Badge>
                  <h3 className="font-bold text-base text-md-on-background pt-1">
                    Clinic Address &amp; Directions
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-md-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-md-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-md-on-background">{siteConfig.name}</p>
                      <p className="mt-1 leading-relaxed">{siteConfig.address.fullAddress}</p>
                      <p className="text-md-primary font-medium mt-1">Landmark: {siteConfig.address.landmark}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-md-primary text-md-on-primary text-xs font-semibold hover:opacity-95 transition-opacity"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </Card>

              {/* Timings Table Card */}
              <Card variant="container" className="p-6 md:p-8 space-y-4 border border-md-outline/10 bg-md-surface-container-low">
                <h3 className="font-bold text-base text-md-on-background flex items-center gap-2">
                  <Clock className="h-4 w-4 text-md-primary" />
                  <span>OPD Consultation Schedule</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-md-outline/10">
                    <span className="font-bold text-md-on-background">Monday – Friday</span>
                    <span className="text-md-on-surface-variant">9:00 AM – 1:00 PM &amp; 5:00 PM – 8:30 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-md-outline/10">
                    <span className="font-bold text-md-on-background">Saturday</span>
                    <span className="text-md-on-surface-variant">9:00 AM – 1:00 PM &amp; 5:00 PM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-md-outline/10">
                    <span className="font-bold text-md-on-background">Sunday</span>
                    <span className="text-md-on-surface-variant">10:00 AM – 1:00 PM (Emergency slots only)</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  {siteConfig.timings.isOpenToday}
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Full-Width Map Iframe */}
      <section className="py-2">
        <Container>
          <div className="rounded-[28px] md:rounded-[40px] overflow-hidden border border-md-outline/15 shadow-sm bg-md-surface-container min-h-[360px] md:min-h-[460px]">
            <iframe
              title="Google Maps Location of Dr. Sharma's Family Care Clinic"
              src={siteConfig.mapEmbedUrl}
              width="100%"
              height="460"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[360px] md:min-h-[460px]"
            />
          </div>
        </Container>
      </section>

      {/* 5. Small FAQ Section */}
      <section className="py-4">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <SectionHeading
              eyebrow="Helpful Information"
              title="Frequently Asked Questions"
              subtitle="Quick answers before visiting our Andheri West clinic."
              align="center"
            />

            <Accordion items={contactFaqs} />
          </div>
        </Container>
      </section>
    </div>
  );
}
