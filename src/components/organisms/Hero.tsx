"use client";

import { useState } from "react";
import Image from "next/image";
import { TripSearch } from "@/src/components/molecules/TripSearch";
import { Button } from "@/src/components/atoms/Button";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

interface HeroProps {
  onSearch?: (query: { where: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (query: { where: string; checkIn: string; checkOut: string; guests: number }) => {
    setShowMobileSearch(false);
    onSearch?.(query);
  };

  return (
    <section className="relative min-h-[60vh] overflow-hidden sm:min-h-[80vh] md:min-h-[85vh]">
      {/* TODO(asset-gate): replace with licensed Kiribati photography per office-hours Phase A gate */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/kiribati-hero/1600/900"
          alt="Kiribati lagoon at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40 sm:via-black/20" />
      </div>

      <div className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center sm:min-h-[80vh] md:min-h-[85vh]">
        <h1 className="max-w-4xl text-[clamp(32px,5vw,56px)] font-extrabold leading-tight text-white">
          Discover Kiribati — islands, stays &amp; handmade heritage
        </h1>

        <div className="hidden w-full max-w-3xl sm:block">
          <TripSearch onSearch={handleSearch} />
        </div>

        <div className="sm:hidden">
          {showMobileSearch ? (
            <div className="fixed inset-0 z-50 flex flex-col bg-white">
              <div className="flex items-center justify-between border-b border-[#DDDDDD] px-4 py-3">
                <span className="text-base font-semibold text-[#222222]">Search stays</span>
                <button
  type="button"
  onClick={() => setShowMobileSearch(false)}
  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDDDDD] bg-white text-sm font-medium text-[#222222] transition-colors hover:bg-[#F7F7F7]"
>
  <HiXMark className="h-4 w-4" />
</button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-6">
                <TripSearch onSearch={handleSearch} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMobileSearch(true)}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-lg shadow-black/20 transition-shadow hover:shadow-xl"
            >
              <HiMagnifyingGlass className="h-5 w-5 text-[#FF385C]" />
              <span className="text-sm font-medium text-[#222222]">Where to?</span>
            </button>
          )}
        </div>

        <a href="/stays">
          <Button variant="primary" size="lg">
            Explore stays
          </Button>
        </a>
      </div>
    </section>
  );
}
