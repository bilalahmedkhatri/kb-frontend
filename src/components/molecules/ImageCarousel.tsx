"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number, e?: React.SyntheticEvent) => {
      if (e) e.stopPropagation();
      if (!images || images.length === 0) return;
      if (index < 0) setActiveIndex(images.length - 1);
      else if (index >= images.length) setActiveIndex(0);
      else setActiveIndex(index);
    },
    [images]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50) goTo(activeIndex + 1);
      else if (diff < -50) goTo(activeIndex - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-[#F7F7F7]", className)}>
        <span className="text-xs text-[#717171]">No image</span>
      </div>
    );
  }

  return (
    <div
      className={cn("group relative h-full w-full overflow-hidden bg-[#F7F7F7]", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${alt} image carousel`}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          priority={i === 0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-opacity duration-300",
            i === activeIndex ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
          )}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => goTo(activeIndex - 1, e)}
            className="absolute left-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xs text-[#222222] opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => goTo(activeIndex + 1, e)}
            className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xs text-[#222222] opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => goTo(i, e)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
