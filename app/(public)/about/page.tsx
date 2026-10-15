import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Clock,
  HeartHandshake,
  FileCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import {
  getClinicStory,
  getMissionVision,
  getDoctorProfile,
  getClinicStats,
  getClinicValues,
  getClinicFacilities,
} from "@/lib/data";
import {
  Container,
  Card,
  SectionHeading,
  Badge,
  PageHero,
  MotionReveal,
} from "@/components/ui";
import { CTABanner } from "@/components/sections/CTABanner";
import { AboutDoctorBookingCTA } from "./AboutDoctorBookingCTA";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}, our 15+ years of clinical heritage in Andheri West, Dr. Rajiv Sharma's qualifications, and our patient-first healthcare philosophy.`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About ${siteConfig.name} | Family Physician in Andheri West`,
    description: `Discover our clinic's history, mission, sterile infrastructure, and evidence-based outpatient consultations by Dr. Rajiv Sharma.`,
    url: `${siteConfig.url}/about`,
    images: [{ url: siteConfig.doctor.photoUrl, width: 1000, height: 1000, alt: "Dr. Rajiv Sharma" }],
  },
};

const valueIconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  HeartHandshake,
  FileCheck,
  Sparkles,
};

export default async function AboutPage() {
  const [story, missionVision, doctor, stats, values, facilities] = await Promise.all([
    getClinicStory(),
    getMissionVision(),
    getDoctorProfile(),
    getClinicStats(),
    getClinicValues(),
    getClinicFacilities(),
  ]);

  return (
    <div className="space-y-12 md:space-y-20 pb-8">
      {/* 1. Page Hero */}
      <PageHero
        breadcrumbs={[{ label: "About Us" }]}
        eyebrow="Our Heritage & Philosophy"
        title="Restoring the Heart of Family Medicine"
        subtitle="Founded in 2011 to provide Mumbai families with unrushed consultations, honest diagnostic advice, and compassionate care."
      />

      {/* 2. Clinic Story */}
      <section className="py-4">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <MotionReveal>
                <Badge variant="primary" size="md">
                  Our Founding Story
                </Badge>
                <h2 className="headline-lg md:display-sm font-bold text-md-on-background mt-3 tracking-tight">
                  {story.title}
                </h2>
                <p className="body-lg text-md-primary font-medium mt-1">
                  {story.subtitle}
                </p>
              </MotionReveal>

              <div className="space-y-4 body-md text-md-on-surface-variant leading-relaxed">
                {story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {story.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-md-on-surface-variant font-medium">
                    <CheckCircle2 className="h-4 w-4 text-md-primary flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <MotionReveal delay={0.2}>
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl border border-md-outline/15 bg-md-surface-container">
                  <Image
                    src={story.image}
                    alt="Dr. Sharma examining patient"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1">
                    <p className="font-bold text-sm">Over 15 Years of Community Trust</p>
                    <p className="text-white/80">Dr. Rajiv Sharma during an outpatient consultation.</p>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-4">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MotionReveal delay={0.1}>
              <Card variant="container" className="h-full p-8 md:p-10 space-y-4 border border-md-outline/10">
                <div className="h-12 w-12 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="headline-md font-bold text-md-on-background">
                  {missionVision.mission.title}
                </h3>
                <p className="body-md text-md-on-surface-variant leading-relaxed">
                  {missionVision.mission.description}
                </p>
                <ul className="space-y-2 pt-2 text-xs text-md-on-surface-variant">
                  {missionVision.mission.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-md-primary mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <Card variant="container" className="h-full p-8 md:p-10 space-y-4 border border-md-outline/10">
                <div className="h-12 w-12 rounded-2xl bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="headline-md font-bold text-md-on-background">
                  {missionVision.vision.title}
                </h3>
                <p className="body-md text-md-on-surface-variant leading-relaxed">
                  {missionVision.vision.description}
                </p>
                <ul className="space-y-2 pt-2 text-xs text-md-on-surface-variant">
                  {missionVision.vision.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-md-secondary mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* 4. Doctor Full Profile */}
      <section className="py-4">
        <Container>
          <div className="rounded-[32px] md:rounded-[48px] bg-md-surface-container p-6 sm:p-10 md:p-14 border border-md-outline/10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Doctor Photo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/60 dark:border-white/10 bg-md-surface-container-low">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-4 right-4 px-4 py-2 rounded-2xl bg-md-surface-container/95 backdrop-blur-md shadow-lg border border-md-outline/15 text-xs font-semibold text-md-on-background flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>{doctor.registrationNumber}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="md" icon={<Award className="h-4 w-4" />}>
                    Chief Medical Consultant
                  </Badge>
                  <Badge variant="secondary" size="md">
                    {doctor.experienceYears}+ Years Clinical Experience
                  </Badge>
                </div>

                <div>
                  <h2 className="headline-lg md:display-sm font-bold text-md-on-background">
                    {doctor.name}
                  </h2>
                  <p className="text-sm font-semibold text-md-primary mt-1">
                    {doctor.role}
                  </p>
                </div>

                {/* Qualifications List */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-md-on-background uppercase tracking-wider">
                    Educational Qualifications
                  </p>
                  <ul className="space-y-1 text-xs text-md-on-surface-variant">
                    {doctor.qualifications.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-md-primary flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specializations Chips */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-md-on-background uppercase tracking-wider">
                    Core Clinical Specializations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" size="sm">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio Paragraphs */}
                <div className="space-y-2 text-xs md:text-sm text-md-on-surface-variant leading-relaxed pt-1">
                  {doctor.bio.map((b, idx) => (
                    <p key={idx}>{b}</p>
                  ))}
                </div>

                {/* OPD Schedule Box */}
                <div className="p-4 rounded-2xl bg-md-surface-container-low border border-md-outline/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-md-on-background">
                    <Clock className="h-4 w-4 text-md-primary" />
                    <span>Weekly Consultation Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-md-on-surface-variant">
                    {doctor.opdSchedule.map((s, idx) => (
                      <div key={idx} className="border-l-2 border-md-primary/40 pl-2.5">
                        <span className="font-semibold text-md-on-background">{s.day}:</span>{" "}
                        <span>{s.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-2">
                  <AboutDoctorBookingCTA doctorName={doctor.name} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Stats Row */}
      <section className="py-4">
        <Container>
          <div className="rounded-[28px] md:rounded-[36px] bg-md-surface-container-low p-6 md:p-10 border border-md-outline/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="display-sm md:display-md font-extrabold text-md-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-md-on-background">
                    {stat.label}
                  </p>
                  <p className="text-xs text-md-on-surface-variant">
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Values */}
      <section className="py-4">
        <Container>
          <SectionHeading
            eyebrow="Our Guiding Principles"
            title="Values That Guide Every Consultation"
            subtitle="We adhere to unwavering clinical ethics, compassionate listening, and evidence-based standards."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {values.map((v) => {
              const IconComp = valueIconMap[v.iconName] || ShieldCheck;
              return (
                <Card key={v.id} variant="container" interactive className="p-6 space-y-3">
                  <div className="h-11 w-11 rounded-xl bg-md-primary/10 text-md-primary flex items-center justify-center">
                    <IconComp className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-base text-md-on-background">
                    {v.title}
                  </h3>
                  <p className="text-xs text-md-on-surface-variant leading-relaxed">
                    {v.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 7. Facilities */}
      <section className="py-4">
        <Container>
          <SectionHeading
            eyebrow="Clinic Infrastructure"
            title="Modern, Sterile & Calming Spaces"
            subtitle="Designed for clinical safety, patient hygiene, and peaceful recovery."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {facilities.map((fac) => (
              <Card key={fac.id} variant="container" interactive className="p-0 overflow-hidden group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-md-surface-container-low">
                  <Image
                    src={fac.image}
                    alt={fac.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-sm text-md-on-background">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-md-on-surface-variant leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. CTA Banner */}
      <CTABanner />
    </div>
  );
}
