import * as React from "react";
import { Star, ShieldCheck, Award, Clock, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Container } from "@/components/ui";

const trustBadges = [
  {
    icon: Award,
    title: "Certified MD Physician",
    desc: "MCI Registered • 14+ Yrs Exp",
  },
  {
    icon: Sparkles,
    title: "100% Sanitized Facility",
    desc: "Strict daily sterilisation protocol",
  },
  {
    icon: Clock,
    title: "Prioritized Callback",
    desc: "Confirmed slots minimize wait time",
  },
  {
    icon: ShieldCheck,
    title: "Ethical Healthcare",
    desc: "Zero unnecessary diagnostic tests",
  },
];

export function TrustStrip() {
  return (
    <section className="py-6">
      <Container>
        <div className="rounded-[24px] bg-md-surface-container-low p-6 md:p-8 border border-md-outline/10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
            {/* Rating Box */}
            <div className="flex items-center gap-3.5 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-md-outline/15 pr-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                ★ 4.9
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-md-on-background mt-0.5">
                  {siteConfig.rating.count}+ Verified Patients
                </p>
                <p className="text-[11px] text-md-on-surface-variant">
                  {siteConfig.rating.platform}
                </p>
              </div>
            </div>

            {/* 4 Trust Badges */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-md-on-background leading-snug">
                        {badge.title}
                      </p>
                      <p className="text-[11px] text-md-on-surface-variant leading-tight mt-0.5">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
