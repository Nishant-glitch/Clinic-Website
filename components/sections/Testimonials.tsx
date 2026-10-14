"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from "lucide-react";
import { placeholderTestimonials } from "@/lib/data/placeholder";
import {
  Container,
  Card,
  SectionHeading,
  Badge,
  IconButton,
} from "@/components/ui";
import { MotionReveal } from "@/components/ui/MotionReveal";

import "swiper/css";
import "swiper/css/pagination";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Testimonials() {
  const isMounted = React.useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Verified Patient Feedback"
            title="What Patients Say About Our Care"
            subtitle="Genuine patient feedback reflecting our dedication to clear medical explanations and attentive consultations."
          />
        </MotionReveal>

        <div className="mt-12 relative">
          {isMounted ? (
            <>
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1.5 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                pagination={{
                  clickable: true,
                  bulletClass:
                    "inline-block w-2.5 h-2.5 rounded-full bg-md-outline/30 mx-1 cursor-pointer transition-all",
                  bulletActiveClass: "!w-6 !bg-md-primary",
                }}
                onBeforeInit={(swiper) => {
                  if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                className="pb-14"
              >
                {placeholderTestimonials.map((t) => (
                  <SwiperSlide key={t.id} className="h-auto">
                    <Card
                      variant="container"
                      className="flex flex-col justify-between h-full p-6 sm:p-7 relative select-none"
                    >
                      <Quote
                        className="absolute top-6 right-6 h-8 w-8 text-md-outline/15 pointer-events-none"
                        aria-hidden="true"
                      />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                            ))}
                          </div>
                          {t.treatment && (
                            <Badge variant="secondary" size="sm">
                              {t.treatment}
                            </Badge>
                          )}
                        </div>

                        <p className="body-md text-md-on-background/90 leading-relaxed italic">
                          &ldquo;{t.review}&rdquo;
                        </p>
                      </div>

                      <div className="pt-6 mt-4 border-t border-md-outline/10 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-md-on-background">
                            {t.patientName}
                          </p>
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            <span>Verified Consultation</span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Accessible Navigation Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <IconButton
                  ref={prevRef}
                  variant="tonal"
                  aria-label="Previous patient testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </IconButton>
                <IconButton
                  ref={nextRef}
                  variant="tonal"
                  aria-label="Next patient testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </IconButton>
              </div>
            </>
          ) : (
            /* SSR Static Prerender Grid for SEO and Instant First Paint */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderTestimonials.slice(0, 3).map((t) => (
                <Card
                  key={t.id}
                  variant="container"
                  className="flex flex-col justify-between h-full p-6 sm:p-7 relative select-none"
                >
                  <Quote
                    className="absolute top-6 right-6 h-8 w-8 text-md-outline/15 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      {t.treatment && (
                        <Badge variant="secondary" size="sm">
                          {t.treatment}
                        </Badge>
                      )}
                    </div>

                    <p className="body-md text-md-on-background/90 leading-relaxed italic">
                      &ldquo;{t.review}&rdquo;
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-md-outline/10 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-md-on-background">
                        {t.patientName}
                      </p>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        <span>Verified Consultation</span>
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
