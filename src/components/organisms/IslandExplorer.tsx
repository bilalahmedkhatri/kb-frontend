"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HiMapPin, HiHome, HiShoppingBag, HiBookOpen } from "react-icons/hi2";
import { GiPolarStar } from "react-icons/gi";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

interface IslandData {
  id: string;
  name: string;
  group: string;
  image: string;
  description: string;
  staysCount: number;
  craftsCount: number;
  guidesCount: number;
  highlights: string[];
}

const KIRIBATI_ISLANDS: IslandData[] = [
  {
    id: "tarawa",
    name: "South Tarawa",
    group: "Gilbert Islands",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "The vibrant capital lagoon atoll with rich WWII history, lagoon eco-lodges, and bustling local markets.",
    staysCount: 14,
    craftsCount: 28,
    guidesCount: 6,
    highlights: ["Red Beach Heritage", "Bairiki Craft Fair", "Lagoon Sunset Kayaking"],
  },
  {
    id: "kiritimati",
    name: "Kiritimati (Christmas Island)",
    group: "Line Islands",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "World-famous saltwater fly fishing, pristine bird sanctuaries, and master pandanus weavers.",
    staysCount: 8,
    craftsCount: 19,
    guidesCount: 4,
    highlights: ["Bonefishing Capital", "Wildlife Sanctuary", "Master Weaver Guild"],
  },
  {
    id: "abemama",
    name: "Abemama Atoll",
    group: "Central Gilberts",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
    description: "Serene traditional island life, coconut fiber crafts, and Robert Louis Stevenson historic retreat.",
    staysCount: 5,
    craftsCount: 12,
    guidesCount: 3,
    highlights: ["Royal Residence Ruins", "Coconut Shell Artisans", "Secluded Beach Stays"],
  },
  {
    id: "tabiteuea",
    name: "Tabiteuea North",
    group: "Southern Gilberts",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    description: "Largest lagoon atoll in Kiribati famous for giant maneaba community houses and woven canoes.",
    staysCount: 4,
    craftsCount: 15,
    guidesCount: 2,
    highlights: ["Historic Maneaba Halls", "Outrigger Canoe Building", "Traditional Chants"],
  },
];

export function IslandExplorer() {
  const [selectedIsland, setSelectedIsland] = useState<IslandData>(KIRIBATI_ISLANDS[0]);

  return (
    <section className="py-12 bg-linear-to-b from-[var(--gray-50)] to-white border-y border-[var(--gray-200)]">
      <div className="container-app">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--ink)] tracking-tight">
              Explore Kiribati Archipelago
            </h2>
            <p className="text-sm text-[var(--gray-500)] mt-1">
              Discover unique stays, authentic island crafts, and stories tailored by atoll location.
            </p>
          </div>

          {/* Island Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {KIRIBATI_ISLANDS.map((island) => (
              <button
                key={island.id}
                onClick={() => setSelectedIsland(island)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all shadow-2xs",
                  selectedIsland.id === island.id
                    ? "bg-[var(--ink)] text-white shadow-md scale-105"
                    : "bg-white text-[var(--gray-700)] border border-[var(--gray-300)] hover:border-[var(--ink)]"
                )}
              >
                <HiMapPin className={selectedIsland.id === island.id ? "text-[var(--rausch)]" : "text-[var(--gray-500)]"} />
                {island.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Island Highlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch rounded-3xl border border-[var(--gray-300)] bg-white overflow-hidden shadow-lg">
          <div className="lg:col-span-6 relative min-h-[300px] overflow-hidden">
            <Image
              src={selectedIsland.image}
              alt={selectedIsland.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                {selectedIsland.group}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-3">{selectedIsland.name}</h3>
              <p className="text-sm text-[var(--gray-700)] leading-relaxed mb-6">
                {selectedIsland.description}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-[var(--gray-500)] uppercase tracking-wider mb-2.5">
                  Island Experience Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIsland.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-[var(--gray-100)] border border-[var(--gray-200)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                    >
                      <GiPolarStar className="inline-block mr-1 h-3 w-3 text-amber-500" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Counts & Actions */}
            <div className="border-t border-[var(--gray-200)] pt-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-[var(--rausch)]">
                    <HiHome className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-base font-black text-[var(--ink)]">{selectedIsland.staysCount}</span>
                    <p className="text-[11px] text-[var(--gray-500)] font-medium">Stays</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-[var(--babu)]">
                    <HiShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-base font-black text-[var(--ink)]">{selectedIsland.craftsCount}</span>
                    <p className="text-[11px] text-[var(--gray-500)] font-medium">Crafts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <HiBookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-base font-black text-[var(--ink)]">{selectedIsland.guidesCount}</span>
                    <p className="text-[11px] text-[var(--gray-500)] font-medium">Guides</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/search?island=${selectedIsland.id}`}
                  className="flex-1 text-center rounded-xl bg-[var(--rausch)] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[var(--rausch-dark)] hover:shadow-lg"
                >
                  Explore {selectedIsland.name} Stays & Crafts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
