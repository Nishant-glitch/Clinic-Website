import * as React from "react";
import {
  UserCheck,
  Clock,
  Sparkles,
  FileCheck,
  MessageCircle,
  Coins,
} from "lucide-react";
import { getWhyChooseUs } from "@/lib/data";
import {
  Container,
  Card,
  SectionHeading,
  Badge,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Clock,
  Sparkles,
  FileCheck,
  MessageCircle,
  Coins,
};

export async function WhyChooseUs() {
  const items = await getWhyChooseUs();

  return (
    <section className="py-12 md:py-20 bg-md-surface-container-low">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="The Patient Difference"
            title="Why Families Trust Dr. Sharma's Clinic"
            subtitle="Thoughtful clinical care built around ethics, zero unnecessary investigations, and punctuality."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.iconName] || Sparkles;

            return (
              <MotionReveal key={item.id} delay={index * 0.1}>
                <Card
                  variant="container"
                  interactive
                  className="flex flex-col justify-between h-full bg-md-surface-container/90"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-md-secondary-container text-md-on-secondary-container flex items-center justify-center">
                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <Badge variant="outline" size="sm">
                        {item.tag}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="title-lg font-bold text-md-on-background">
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
