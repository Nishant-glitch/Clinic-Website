"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Check,
} from "lucide-react";
import type { GalleryImage, GalleryCategory } from "@/lib/types";
import { IconButton } from "@/components/ui";

const categories: { label: string; value: GalleryCategory | "all" }[] = [
  { label: "All Photos", value: "all" },
  { label: "Clinic Spaces", value: "clinic" },
  { label: "Treatments & Procedures", value: "treatments" },
  { label: "Community & Events", value: "events" },
  { label: "Clinical Team", value: "team" },
];

export function GalleryLightboxView({ images }: { images: GalleryImage<string>[] }) {
  const [selectedCategory, setSelectedCategory] = React.useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const touchStartXRef = React.useRef<number | null>(null);
  const lightboxRef = React.useRef<HTMLDivElement>(null);

  const filteredImages = React.useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const handlePrev = React.useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
  }, [lightboxIndex, filteredImages.length]);

  const handleNext = React.useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, filteredImages.length]);

  const handleClose = React.useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation & body scroll lock
  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex, handleClose, handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-md-primary text-md-on-primary shadow-sm scale-105"
                  : "bg-md-surface-container text-md-on-surface-variant hover:bg-md-surface-container-high border border-md-outline/10"
              }`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Image Grid: 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setLightboxIndex(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxIndex(index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View photo: ${img.title}`}
            className="group relative aspect-[4/3] rounded-2xl md:rounded-[24px] overflow-hidden bg-md-surface-container cursor-pointer border border-md-outline/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary transition-all duration-200 hover:shadow-md"
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 ease-md group-hover:scale-105"
            />
            {/* Hover Caption Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 p-3 sm:p-4 flex flex-col justify-end text-white">
              <span className="text-xs font-bold line-clamp-1">{img.title}</span>
              {img.caption && (
                <span className="text-[11px] text-white/80 line-clamp-2 mt-0.5">
                  {img.caption}
                </span>
              )}
            </div>

            <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-16 bg-md-surface-container rounded-3xl p-8 space-y-3">
          <p className="font-bold text-base text-md-on-background">No photos found in this category.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="text-xs text-md-primary font-semibold hover:underline"
          >
            Show All Photos
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeImage && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo lightbox: ${activeImage.title}`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar with Counter and Close */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                {lightboxIndex + 1} of {filteredImages.length}
              </span>
              <span className="text-xs text-white/70 capitalize hidden sm:inline">
                {activeImage.category}
              </span>
            </div>

            <IconButton
              variant="standard"
              aria-label="Close photo preview (Esc)"
              onClick={handleClose}
              className="text-white hover:bg-white/15"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </div>

          {/* Central Image Viewport */}
          <div className="relative flex-1 w-full max-h-[78vh] flex items-center justify-center my-auto">
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 z-20 h-11 w-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Photo */}
            <div className="relative w-full h-full max-w-4xl max-h-[70vh]">
              <Image
                src={activeImage.url}
                alt={activeImage.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 z-20 h-11 w-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="text-center text-white max-w-2xl mx-auto space-y-1 z-10 px-4 pb-2">
            <h3 className="font-bold text-sm sm:text-base">{activeImage.title}</h3>
            {activeImage.caption && (
              <p className="text-xs text-white/80 leading-relaxed">
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
