"use client";

import * as React from "react";
import Image from "next/image";
import { Award, Clock, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import {
  Container,
  Badge,
  Button,
} from "@/components/ui";
import { useBooking } from "@/components/booking";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function DoctorProfile() {
  const { doctor } = siteConfig;
  const { openBooking } = useBooking();

  const highlights = [
    "Expert in Type-2 Diabetes & Hypertension profiling",
    "Evidence-based treatment with minimal medication",
    "Post-consultation WhatsApp prescription support",
    "Over 18,000+ satisfied family consultations",
  ];

  return (
    <section className="py-12 md:py-20 bg-md-surface-container-low">
      <Container>
        <div className="rounded-[32px] md:rounded-[48px] bg-md-surface-container p-6 sm:p-10 md:p-14 border border-md-outline/10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Doctor Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <MotionReveal className="relative w-full max-w-sm">
                <div className="relative aspect-[4/5] w-full rounded-[28px] md:rounded-[36px] overflow-hidden shadow-xl border-4 border-white/50 dark:border-white/10 bg-md-surface-container-low">
                  <Image
                    src={doctor.photoUrl}
                    alt={`${doctor.name} - ${doctor.specialization}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating Registration Tag */}
                <div className="absolute -bottom-4 right-4 sm:right-6 px-4 py-2 rounded-2xl bg-md-surface-container/95 backdrop-blur-md shadow-lg border border-md-outline/15 text-xs font-semibold text-md-on-background flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Reg: {doctor.registrationNumber}</span>
                </div>
              </MotionReveal>
            </div>

            {/* Right: Doctor Biography & Credentials */}
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <MotionReveal>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="md" icon={<Award className="h-4 w-4" />}>
                    Senior Medical Consultant
                  </Badge>
                  <Badge variant="secondary" size="md">
                    {doctor.experience}
                  </Badge>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <h2 className="headline-lg md:display-sm font-bold text-md-on-background tracking-tight">
                  {doctor.name}
                </h2>
                <p className="text-sm font-medium text-md-primary mt-1">
                  {doctor.qualification} • {doctor.specialization}
                </p>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <p className="body-md text-md-on-surface-variant leading-relaxed">
                  {doctor.bio}
                </p>
              </MotionReveal>

              {/* Highlights List */}
              <MotionReveal delay={0.3} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-md-on-surface-variant font-medium">
                      <CheckCircle2 className="h-4 w-4 text-md-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </MotionReveal>

              {/* OPD Schedule Card */}
              <MotionReveal delay={0.4} className="w-full">
                <div className="p-4 rounded-2xl bg-md-surface-container-low border border-md-outline/15 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-md-primary flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-md-on-background">Consultation Hours</p>
                    <p className="text-md-on-surface-variant">{doctor.opdHours}</p>
                  </div>
                </div>
              </MotionReveal>

              {/* Action Button */}
              <MotionReveal delay={0.5} className="pt-2">
                <Button
                  type="button"
                  variant="filled"
                  size="lg"
                  onClick={() => openBooking()}
                  leftIcon={<Calendar className="h-5 w-5" aria-hidden="true" />}
                >
                  Book with Dr. Sharma
                </Button>
              </MotionReveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
