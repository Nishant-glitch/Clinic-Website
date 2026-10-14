import * as React from "react";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import { getGalleryImages } from "@/lib/data";
import {
  Container,
  SectionHeading,
  ButtonLink,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

export async function GalleryPreview() {
  const images = (await getGalleryImages()).slice(0, 6);

  return (
    <section className="py-12 md:py-20 bg-md-surface-container-low">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Virtual Clinic Tour"
            title="Clean, Modern &amp; Hygienic Facility"
            subtitle="Take a look inside our reception, consultation chamber, and sanitized examination room."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {images.map((img, idx) => (
            <MotionReveal key={img.id} delay={idx * 0.1}>
              <div className="group relative rounded-[24px] overflow-hidden bg-md-surface-container shadow-sm border border-md-outline/10 aspect-[4/3]">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover object-center transition-transform duration-500 ease-md group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Caption Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm tracking-tight drop-shadow-md">
                      {img.title}
                    </p>
                    <span className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  {img.caption && (
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink
            href="/gallery"
            variant="tonal"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            View Complete Clinic Gallery
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
