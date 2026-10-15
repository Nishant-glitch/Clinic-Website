import * as React from "react";
import { Container } from "./Container";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { BlurShapes } from "./BlurShapes";
import { Badge } from "./Badge";
import { MotionReveal } from "./MotionReveal";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  eyebrow,
  className = "",
  children,
}: PageHeroProps) {
  return (
    <section className={`pt-4 pb-8 md:pt-6 md:pb-12 ${className}`}>
      <Container>
        <div className="relative rounded-[28px] md:rounded-[48px] bg-md-surface-container overflow-hidden px-6 py-10 md:px-12 md:py-14 border border-md-outline/10 shadow-sm">
          {/* Decorative blur shapes */}
          <BlurShapes />

          <div className="relative z-10 max-w-3xl space-y-4">
            <Breadcrumb items={breadcrumbs} />

            <MotionReveal delay={0.1}>
              {eyebrow && (
                <div className="pt-2">
                  <Badge variant="secondary" size="md">
                    {eyebrow}
                  </Badge>
                </div>
              )}

              <h1 className="display-sm md:display-md font-bold text-md-on-background mt-3 tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="body-lg text-md-on-surface-variant max-w-2xl mt-3 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {children && <div className="pt-4">{children}</div>}
            </MotionReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
