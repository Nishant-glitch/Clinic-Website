import * as React from "react";
import Image from "next/image";
import { Calendar, Phone, Star, ShieldCheck, Clock } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import {
  ButtonLink,
  Badge,
  Container,
  BlurShapes,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function Hero() {
  return (
    <section className="pt-4 pb-8 md:pt-8 md:pb-12">
      <Container>
        <div className="relative rounded-[24px] md:rounded-[48px] bg-md-surface-container overflow-hidden px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16 border border-md-outline/10 shadow-sm">
          {/* Layered Organic Blur Shapes */}
          <BlurShapes variant="hero" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <MotionReveal delay={0.1}>
                <Badge variant="primary" size="md" icon={<ShieldCheck className="h-4 w-4" />}>
                  Trusted OPD &amp; Family Medical Care
                </Badge>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <h1 className="display-lg font-extrabold text-md-on-background tracking-tight">
                  Caring for Your Health,{" "}
                  <span className="text-md-primary block mt-1">
                    Every Single Day.
                  </span>
                </h1>
              </MotionReveal>

              <MotionReveal delay={0.3}>
                <p className="body-lg text-md-on-surface-variant max-w-xl leading-relaxed">
                  Personalized consultations, accurate diagnosis, and chronic disease
                  management under senior physician{" "}
                  <strong className="text-md-on-background font-semibold">
                    {siteConfig.doctor.name}
                  </strong>
                  . Request your visit online for a zero-wait arrival.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.4}>
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <ButtonLink
                    href="/appointment"
                    variant="filled"
                    size="lg"
                    leftIcon={<Calendar className="h-5 w-5" aria-hidden="true" />}
                  >
                    Book Appointment
                  </ButtonLink>
                  <ButtonLink
                    href={`tel:${siteConfig.phone}`}
                    variant="outlined"
                    size="lg"
                    leftIcon={<Phone className="h-5 w-5" aria-hidden="true" />}
                  >
                    Call Now
                  </ButtonLink>
                </div>
              </MotionReveal>

              {/* 3 Mini Stats */}
              <MotionReveal delay={0.5} className="w-full">
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-md-outline/15 max-w-lg">
                  <div>
                    <p className="headline-md font-bold text-md-primary">14+</p>
                    <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                      Years Experience
                    </p>
                  </div>
                  <div>
                    <p className="headline-md font-bold text-md-on-background">18k+</p>
                    <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                      Patients Treated
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="headline-md font-bold text-md-on-background">4.9</p>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-md-on-surface-variant font-medium mt-0.5">
                      380+ Reviews
                    </p>
                  </div>
                </div>
              </MotionReveal>
            </div>

            {/* Right Visual Image + Floating Badge */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <MotionReveal delay={0.3} className="relative w-full max-w-md">
                <div className="relative aspect-[4/5] w-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/40 dark:border-white/10 bg-md-surface-container-low">
                  <Image
                    src={siteConfig.doctor.photoUrl}
                    alt={`${siteConfig.doctor.name} - Senior Physician at ${siteConfig.name}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 420px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Doctor credential tag on image bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-bold text-base leading-tight drop-shadow-md">
                      {siteConfig.doctor.name}
                    </p>
                    <p className="text-xs text-white/90 drop-shadow-sm">
                      {siteConfig.doctor.qualification} • {siteConfig.doctor.specialization}
                    </p>
                  </div>
                </div>

                {/* Floating Glass Card */}
                <div className="absolute -top-4 -left-4 sm:-left-6 p-3.5 sm:p-4 rounded-2xl bg-md-surface-container/90 backdrop-blur-md shadow-lg border border-white/30 dark:border-white/10 max-w-[210px] select-none">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      OPD Open
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-md-on-background flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-md-primary flex-shrink-0" />
                    <span>10 AM – 9 PM</span>
                  </p>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">
                    Prior request saves waiting
                  </p>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
