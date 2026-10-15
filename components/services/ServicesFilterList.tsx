"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Bandage,
  FileHeart,
  ArrowRight,
  Calendar,
  Check,
} from "lucide-react";
import type { Service } from "@/lib/types";
import {
  Card,
  Badge,
  Button,
  ButtonLink,
} from "@/components/ui";
import { useBooking } from "@/components/booking";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Bandage,
  FileHeart,
};

const categories = [
  "All",
  "General OPD",
  "Chronic Disease",
  "Pediatrics",
  "Preventive",
  "Procedures",
  "Diagnostics",
];

export function ServicesFilterList({ initialServices }: { initialServices: Service<string>[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const { openBooking } = useBooking();

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      router.push("/services", { scroll: false });
    } else {
      router.push(`/services?category=${encodeURIComponent(category)}`, { scroll: false });
    }
  };

  const filteredServices = React.useMemo(() => {
    if (activeCategory === "All") return initialServices;
    return initialServices.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [initialServices, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {categories.map((cat) => {
          const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ease-md cursor-pointer ${
                isSelected
                  ? "bg-md-primary text-md-on-primary shadow-sm scale-105"
                  : "bg-md-surface-container text-md-on-surface-variant hover:bg-md-surface-container-high border border-md-outline/10"
              }`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const IconComponent = (service.icon && iconMap[service.icon]) || Stethoscope;

          return (
            <Card
              key={service.id}
              variant="container"
              interactive
              className="p-0 overflow-hidden flex flex-col justify-between group h-full border border-md-outline/10"
            >
              <div>
                {/* Service Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-md-surface-container-low">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-md-surface-container">
                      <IconComponent className="h-10 w-10 text-md-primary/40" />
                    </div>
                  )}
                  {service.category && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="sm" className="backdrop-blur-md shadow-xs">
                        {service.category}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-md-primary/10 text-md-primary flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h2 className="font-bold text-base text-md-on-background line-clamp-1">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-xs text-md-on-surface-variant line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Symptoms previews */}
                  {service.symptoms && service.symptoms.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {service.symptoms.slice(0, 3).map((sym) => (
                        <span
                          key={sym}
                          className="px-2.5 py-0.5 rounded-full bg-md-surface-container-low text-[11px] font-medium text-md-on-surface-variant border border-md-outline/10"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-md-outline/10 mt-4 flex items-center gap-2">
                <ButtonLink
                  href={`/services/${service.slug}`}
                  variant="outlined"
                  size="sm"
                  className="flex-1 justify-center"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  View Details
                </ButtonLink>

                <Button
                  type="button"
                  variant="filled"
                  size="sm"
                  onClick={() => openBooking({ service: service.title })}
                  className="flex-1 justify-center"
                  leftIcon={<Calendar className="h-3.5 w-3.5" />}
                >
                  Book Slot
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-md-surface-container rounded-3xl p-8 space-y-3">
          <p className="font-bold text-base text-md-on-background">No services found in this category.</p>
          <p className="text-xs text-md-on-surface-variant">Try selecting &apos;All&apos; to view all outpatient specializations.</p>
          <Button variant="tonal" size="md" onClick={() => handleCategoryChange("All")}>
            Show All Services
          </Button>
        </div>
      )}
    </div>
  );
}
