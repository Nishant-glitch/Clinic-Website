import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { getServices, getServiceBySlug, getRelatedServices } from "@/lib/data";
import {
  Container,
  Card,
  Badge,
  PageHero,
  Accordion,
  SectionHeading,
  MotionReveal,
} from "@/components/ui";
import { ServiceBookingCTA } from "@/components/services/ServiceBookingCTA";
import { ServiceMobileStickyBar } from "@/components/services/ServiceMobileStickyBar";
import { CTABanner } from "@/components/sections/CTABanner";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Service Not Found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${service.title} | ${siteConfig.name}`,
    description: service.shortDescription,
    alternates: {
      canonical: `${siteConfig.url}/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Dr. Sharma's Clinic Mumbai`,
      description: service.shortDescription,
      url: `${siteConfig.url}/services/${slug}`,
      images: service.image ? [{ url: service.image, alt: service.title }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(slug, 3);

  // MedicalProcedure or Service Schema JSON-LD
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.fullDescription,
    image: service.image,
    procedureType: "OutpatientProcedure",
    bodyLocation: "General",
    howPerformed: service.treatmentProcess?.map((p) => `${p.step}. ${p.title}: ${p.description}`).join("; "),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "500",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "MedicalClinic",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.fullAddress,
      },
    },
  };

  const faqAccordionItems = service.faqs?.map((f, idx) => ({
    id: `faq-${idx}`,
    question: f.question,
    answer: f.answer,
  })) || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <div className="space-y-12 md:space-y-20 pb-16">
        {/* 1. Page Hero */}
        <PageHero
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: service.title },
          ]}
          eyebrow={service.category || "Clinical Service"}
          title={service.title}
          subtitle={service.shortDescription}
        />

        {/* 2. Overview & Hero Image Card */}
        <section className="py-2">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Image Frame */}
              <div className="lg:col-span-6">
                <MotionReveal>
                  <div className="relative aspect-[16/10] w-full rounded-[32px] overflow-hidden shadow-xl border border-md-outline/15 bg-md-surface-container">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 550px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-md-surface-container">
                        <Stethoscope className="h-16 w-16 text-md-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
                        {service.category}
                      </span>
                      {service.duration && (
                        <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{service.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </MotionReveal>
              </div>

              {/* Overview Text & CTA */}
              <div className="lg:col-span-6 space-y-5">
                <MotionReveal delay={0.1}>
                  <Badge variant="primary" size="md">
                    Clinical Overview
                  </Badge>
                  <h2 className="headline-lg font-bold text-md-on-background mt-3 tracking-tight">
                    Attentive Care &amp; Dedicated Diagnosis
                  </h2>
                </MotionReveal>

                <p className="body-md md:body-lg text-md-on-surface-variant leading-relaxed">
                  {service.fullDescription}
                </p>

                {service.content && (
                  <p className="body-md text-md-on-surface-variant/90 leading-relaxed">
                    {service.content}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <ServiceBookingCTA serviceTitle={service.title} />
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-md-primary hover:underline px-2 py-1"
                  >
                    <span>Have urgent questions? Call Front Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Who It's For & Symptoms Addressed */}
        {service.symptoms && service.symptoms.length > 0 && (
          <section className="py-2">
            <Container>
              <div className="rounded-[28px] md:rounded-[36px] bg-md-surface-container p-6 sm:p-10 border border-md-outline/10">
                <div className="max-w-3xl space-y-3">
                  <Badge variant="secondary" size="md">
                    Target Indications
                  </Badge>
                  <h3 className="headline-md font-bold text-md-on-background">
                    Common Symptoms &amp; Who This Consultation Is For
                  </h3>
                  <p className="body-md text-md-on-surface-variant">
                    If you or your family members are experiencing any of the following clinical signs, an outpatient review is strongly recommended:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-6">
                  {service.symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-md-surface-container-low border border-md-outline/10 flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-md-primary flex-shrink-0" />
                      <span className="text-xs font-medium text-md-on-background">
                        {symptom}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* 4. Treatment Process (Numbered Steps) */}
        {service.treatmentProcess && service.treatmentProcess.length > 0 && (
          <section className="py-2">
            <Container>
              <SectionHeading
                eyebrow="Clinical Protocol"
                title="What to Expect During Your Visit"
                subtitle="A methodical, 4-step evaluation prioritizing accurate diagnosis, patient comfort, and zero unnecessary tests."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {service.treatmentProcess.map((proc) => (
                  <Card key={proc.step} variant="container" interactive className="p-6 space-y-4 relative">
                    <div className="h-10 w-10 rounded-2xl bg-md-primary text-md-on-primary font-bold text-sm flex items-center justify-center shadow-xs">
                      0{proc.step}
                    </div>
                    <h4 className="font-bold text-base text-md-on-background">
                      {proc.title}
                    </h4>
                    <p className="text-xs text-md-on-surface-variant leading-relaxed">
                      {proc.description}
                    </p>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* 5. Benefits & Duration / Expectations */}
        <section className="py-2">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Benefits */}
              <div className="lg:col-span-7">
                <Card variant="container" className="h-full p-6 sm:p-8 space-y-4 border border-md-outline/10">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-md-on-background">
                        Why Choose Our Clinic For This Care
                      </h3>
                      <p className="text-xs text-md-primary font-medium">Evidence-Based Clinical Integrity</p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-2 text-xs md:text-sm text-md-on-surface-variant">
                    {service.benefits?.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* What to expect & preparation */}
              <div className="lg:col-span-5">
                <Card variant="container" className="h-full p-6 sm:p-8 space-y-4 border border-md-outline/10 bg-md-surface-container-low">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-md-on-background">
                        Consultation Timing &amp; Notes
                      </h3>
                      <p className="text-xs text-md-secondary font-medium">Preparation Tips</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-md-on-surface-variant leading-relaxed">
                    <p>
                      <strong className="text-md-on-background">Typical Duration: </strong>
                      {service.duration || "20-25 Minutes"}
                    </p>
                    <p>
                      <strong className="text-md-on-background">What to Bring: </strong>
                      {service.whatToExpect || "Please bring any current prescription strips, previous lab records, and notes on onset timing."}
                    </p>
                    <p>
                      <strong className="text-md-on-background">Follow-Up Policy: </strong>
                      Routine review within 5 days for the same acute complaint is covered under your initial consultation.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. Service-Specific FAQs */}
        {faqAccordionItems.length > 0 && (
          <section className="py-2">
            <Container>
              <div className="max-w-3xl mx-auto space-y-8">
                <SectionHeading
                  eyebrow="Common Inquiries"
                  title={`Questions About ${service.title}`}
                  subtitle="Helpful answers regarding consultation procedures, fees, and recovery."
                  align="center"
                />

                <Accordion items={faqAccordionItems} />
              </div>
            </Container>
          </section>
        )}

        {/* 7. Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-2">
            <Container>
              <SectionHeading
                eyebrow="Explore Further"
                title="Other Clinical Specializations"
                subtitle="Complete outpatient care under one roof."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {relatedServices.map((rel) => (
                  <Card key={rel.id} variant="container" interactive className="p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary" size="sm">
                        {rel.category}
                      </Badge>
                      <h4 className="font-bold text-sm text-md-on-background">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-md-on-surface-variant line-clamp-2">
                        {rel.shortDescription}
                      </p>
                    </div>

                    <Link
                      href={`/services/${rel.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-md-primary hover:underline pt-2"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* 8. CTA Banner */}
        <CTABanner />

        {/* 9. Mobile Sticky Booking Bar */}
        <ServiceMobileStickyBar
          serviceTitle={service.title}
          duration={service.duration}
        />
      </div>
    </>
  );
}
