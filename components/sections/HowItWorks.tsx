import * as React from "react";
import { getHowItWorks } from "@/lib/data";
import {
  Container,
  Card,
  SectionHeading,
  Badge,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

export async function HowItWorks() {
  const steps = await getHowItWorks();

  return (
    <section className="py-12 md:py-20">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Zero Waiting Queue"
            title="How Booking Your Visit Works"
            subtitle="Skip crowded waiting room queues with our simple 3-step appointment callback process."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative">
          {steps.map((item, index) => {
            return (
              <MotionReveal key={item.step} delay={index * 0.15}>
                <Card
                  variant="container"
                  interactive
                  className="flex flex-col justify-between h-full group relative overflow-hidden"
                >
                  {/* Subtle Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-md-primary/40 to-md-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Numbered Badge with Glow */}
                      <div className="h-12 w-12 rounded-2xl bg-md-primary text-md-on-primary flex items-center justify-center font-bold text-lg shadow-md transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-md-primary/25">
                        0{item.step}
                      </div>

                      <Badge variant="secondary" size="sm">
                        {item.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="title-lg font-bold text-md-on-background group-hover:text-md-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="body-md text-md-on-surface-variant mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
