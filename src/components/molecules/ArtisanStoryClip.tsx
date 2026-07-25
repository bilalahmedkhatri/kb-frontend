"use client";

import React, { useState } from "react";
import { HiPlay, HiXMark, HiSparkles, HiCheckCircle } from "react-icons/hi2";
import { Avatar } from "@/src/components/atoms/Avatar";
import { EcoBadge } from "@/src/components/atoms/EcoBadge";

interface ArtisanStoryClipProps {
  artisanName: string;
  artisanAvatar?: string;
  artisanRole?: string;
  islandOrigin: string;
  craftName: string;
  quote?: string;
  videoPoster?: string;
  videoUrl?: string;
}

export function ArtisanStoryClip({
  artisanName = "Teberia Aritiera",
  artisanAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  artisanRole = "Master Pandanus Weaver",
  islandOrigin = "Kiritimati (Christmas Island)",
  craftName = "Traditional Kiribati Woven Fine Mat",
  quote = "Each strand of natural pandanus fiber represents our ancestors' connection to the ocean and ocean reef winds.",
  videoPoster = "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
  videoUrl,
}: ArtisanStoryClipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Visual Story Trigger Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--gray-300)] bg-linear-to-br from-emerald-900 to-teal-950 text-white shadow-md transition-all hover:shadow-xl hover:scale-[1.01]"
      >
        <img
          src={videoPoster}
          alt={craftName}
          className="h-48 w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <EcoBadge type="handmade" label="Artisan Story Clip" />
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
              <HiSparkles className="h-3.5 w-3.5 text-amber-300" /> Watch Story
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--rausch)] text-white shadow-lg transition-transform group-hover:scale-110">
              <HiPlay className="h-6 w-6 ml-0.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-200">{artisanRole} · {islandOrigin}</p>
              <h4 className="text-base font-bold text-white leading-snug">{artisanName}: "{craftName}"</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Story Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--gray-200)] px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar src={artisanAvatar} name={artisanName} size="md" />
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-1.5">
                    {artisanName} <HiCheckCircle className="h-4 w-4 text-[var(--babu)]" />
                  </h3>
                  <p className="text-xs text-[var(--gray-500)]">{artisanRole} · {islandOrigin}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--ink)]"
              >
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            {/* Video Container / Preview */}
            <div className="relative aspect-video w-full bg-black">
              {videoUrl ? (
                <video src={videoUrl} controls autoPlay className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-full w-full">
                  <img src={videoPoster} alt={craftName} className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 text-center text-white">
                    <HiSparkles className="h-12 w-12 text-amber-400 mb-2 animate-bounce" />
                    <h4 className="text-xl font-black mb-1">Authentic Kiribati Craftsmanship</h4>
                    <p className="text-sm text-gray-200 max-w-md italic">"{quote}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Quote & Info */}
            <div className="bg-[var(--gray-50)] p-6 border-t border-[var(--gray-200)]">
              <div className="flex flex-wrap gap-2 mb-3">
                <EcoBadge type="handmade" />
                <EcoBadge type="certified" />
                <EcoBadge type="fairtrade" />
              </div>
              <p className="text-sm text-[var(--gray-700)] leading-relaxed">
                By purchasing handicrafts directly through <strong className="text-[var(--ink)]">Island Connects</strong>, 100% of fair-trade artisan proceeds directly support remote Kiribati island families and preserve ancient weaving heritage.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
