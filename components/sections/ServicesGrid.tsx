import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Bandage,
  FileHeart,
  ArrowRight,
} from "lucide-react";
import { getServices } from "@/lib/data";
import {
  Container,
  Card,
  SectionHeading,
  ButtonLink,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

// Dynamic icon mapper for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Bandage,
  FileHeart,
};

export async function ServicesGrid() {
  const services = await getServices();

  return (
    <section id="services-preview" className="py-12 md:py-20">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Clinical Specializations"
            title="Comprehensive Medical Services"
            subtitle="Evidence-based diagnostics, compassionate patient care, and personalized chronic disease management."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => {
            const IconComponent = (service.icon && iconMap[service.icon]) || Stethoscope;

            return (
              <MotionReveal key={service.id} delay={index * 0.1}>
                <Card
                  variant="container"
                  interactive
                  className="flex flex-col justify-between h-full group"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center transition-colors group-hover:bg-md-primary group-hover:text-md-on-primary">
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div>
                      <h3 className="title-lg font-bold text-md-on-background group-hover:text-md-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="body-md text-md-on-surface-variant mt-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>

                    {service.symptoms && service.symptoms.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {service.symptoms.slice(0, 2).map((symptom, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-md-surface-container-low text-md-on-surface-variant font-medium"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-md-outline/10">
                    <Link
                      href={`/services#${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-md-primary group-hover:underline"
                    >
                      <span>Learn more about care</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink
            href="/services"
            variant="tonal"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Explore All 6 Clinical Services
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
