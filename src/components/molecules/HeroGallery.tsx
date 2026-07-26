"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { HiPhoto, HiChevronLeft, HiChevronRight, HiXMark } from "react-icons/hi2";

interface HeroGalleryProps {
  images: string[];
  alt: string;
}

export function HeroGallery({ images, alt }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const goTo = useCallback((index: number) => {
    if (index < 0) setActiveIndex(images.length - 1);
    else if (index >= images.length) setActiveIndex(0);
    else setActiveIndex(index);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, activeIndex, goTo]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-[var(--gray-100)] border border-[var(--gray-200)]">
        <span className="text-xs text-[var(--gray-500)]">No images available</span>
      </div>
    );
  }

  // Airbnb display image array filler up to 5 images for grid representation
  const displayImages = [...images];
  while (displayImages.length < 5) {
    displayImages.push(displayImages[displayImages.length % images.length]);
  }

  return (
    <>
      {/* Desktop Airbnb 5-Photo Mosaic Grid */}
      <div className="relative hidden md:block overflow-hidden rounded-2xl border border-[var(--gray-200)] shadow-xs">
        <div className="grid grid-cols-4 gap-2 aspect-[2/1] bg-black/5">
          {/* Main Hero Photo (Left 2 cols) */}
          <div
            onClick={() => { setActiveIndex(0); setLightboxOpen(true); }}
            className="col-span-2 relative cursor-pointer overflow-hidden group"
          >
            <Image
              src={displayImages[0]}
              alt={`${alt} main`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* 4 Grid Photos (Right 2 cols) */}
          <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
            {displayImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                onClick={() => { setActiveIndex(idx + 1); setLightboxOpen(true); }}
                className="relative cursor-pointer overflow-hidden group h-full"
              >
                <Image
                  src={img}
                  alt={`${alt} view ${idx + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Show All Photos Button (Bottom Right) */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-md border border-[var(--gray-300)] transition-transform hover:scale-105 active:scale-95"
        >
          <HiPhoto className="h-4 w-4 text-[var(--ink)]" />
          <span>Show all {images.length} photos</span>
        </button>
      </div>

      {/* Mobile Single Photo Carousel */}
      <div className="relative block md:hidden aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--gray-100)]">
        <Image
          src={images[activeIndex]}
          alt={`${alt} ${activeIndex + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onClick={() => setLightboxOpen(true)}
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Fullscreen Airbnb Lightbox Gallery Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative flex h-full w-full max-w-5xl flex-col items-center justify-between py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex w-full items-center justify-between px-4 text-white">
              <span className="text-sm font-semibold">
                {activeIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close photo gallery"
                className="rounded-full p-2 text-white hover:bg-white/20 transition-colors"
              >
                <HiXMark className="h-7 w-7" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative flex flex-1 items-center justify-center w-full h-[78vh] my-4">
              <Image
                src={images[activeIndex]}
                alt={`${alt} ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="rounded-xl object-contain shadow-2xl"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex - 1)}
                    className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-black"
                    aria-label="Previous photo"
                  >
                    <HiChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex + 1)}
                    className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-black"
                    aria-label="Next photo"
                  >
                    <HiChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      i === activeIndex ? "border-white scale-105 opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                    )}
                  >
                    <Image src={img} alt={`${alt} thumb ${i + 1}`} width={56} height={56} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

