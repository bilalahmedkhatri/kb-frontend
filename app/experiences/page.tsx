import React from "react";
import Link from "next/link";
import { Header } from "@/src/components/organisms/Header";
import { Footer } from "@/src/components/organisms/Footer";
import { EcoBadge } from "@/src/components/atoms/EcoBadge";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";
import { HiMapPin, HiClock, HiUserGroup, HiStar, HiSparkles } from "react-icons/hi2";

export const metadata = {
  title: "Cultural Experiences & Artisan Workshops | Island Connects Kiribati",
  description: "Book immersive traditional weaving workshops, lagoon eco-tours, and cultural masterclasses with local Kiribati hosts.",
};

const EXPERIENCES = [
  {
    id: "weaving-masterclass",
    title: "Traditional Kiribati Pandanus Weaving Masterclass",
    host: "Teberia Aritiera & Island Weaver Guild",
    location: "Kiritimati (Christmas Island)",
    duration: "3 Hours",
    groupSize: "Up to 6 guests",
    rating: 4.95,
    reviewsCount: 24,
    price: 85,
    currency: "AUD",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    badgeType: "handmade" as const,
    badgeLabel: "Authentic Masterclass",
    description: "Learn ancient Pacific leaf boiling, drying, dye tinting, and hand-weaving techniques directly from master Kiribati craftswomen.",
  },
  {
    id: "lagoon-fishing-tour",
    title: "Kiribati Lagoon Outrigger Canoe Eco-Tour & Fishing",
    host: "Captain Kaboua & South Tarawa Guides",
    location: "South Tarawa Lagoon",
    duration: "Half Day (4h)",
    groupSize: "Up to 4 guests",
    rating: 4.98,
    reviewsCount: 39,
    price: 120,
    currency: "AUD",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    badgeType: "eco" as const,
    badgeLabel: "Zero-Emission Canoe",
    description: "Sail traditional wooden outrigger canoes across turquoise atoll waters, learn sustainable handline fishing, and enjoy fresh ocean coconut broth.",
  },
  {
    id: "coconut-carving-workshop",
    title: "Coconut Shell Carving & Artisan Jewelry Crafting",
    host: "Barekiau & Kiribati Artisan Cooperative",
    location: "Abemama Atoll",
    duration: "2.5 Hours",
    groupSize: "Up to 8 guests",
    rating: 4.89,
    reviewsCount: 18,
    price: 65,
    currency: "AUD",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
    badgeType: "fairtrade" as const,
    badgeLabel: "Direct Fair-Trade",
    description: "Transform natural polished coconut shells and seashell fragments into custom wearable jewelry souvenirs under expert artisan guidance.",
  },
  {
    id: "maneaba-cultural-night",
    title: "Traditional Maneaba Feast & Kiribati Cultural Dance",
    host: "Tabiteuea Community Elders",
    location: "Tabiteuea North",
    duration: "Evening (3h)",
    groupSize: "Open Group",
    rating: 5.0,
    reviewsCount: 42,
    price: 75,
    currency: "AUD",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    badgeType: "certified" as const,
    badgeLabel: "Community Hosted",
    description: "Experience authentic Kiribati hospitality inside a grand thatched Maneaba hall with traditional standing dances, chanting, and earth-oven feast.",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Page Hero */}
        <section className="relative bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 py-16 text-white overflow-hidden">
          <div className="container-app relative z-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold backdrop-blur-md text-emerald-300 mb-4">
                <HiSparkles className="h-4 w-4" /> Eco-Tourism & Cultural Immersion
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                Immersive Kiribati Workshops & Eco-Tours
              </h1>
              <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed mb-6">
                Connect directly with local Kiribati artisans and island guides. Learn ancient weaving crafts, sail outrigger canoes, and experience traditional maneaba hospitality.
              </p>
              <div className="flex flex-wrap gap-2">
                <EcoBadge type="certified" label="100% Locally Guided" />
                <EcoBadge type="eco" label="Sustainable Eco-Tourism" />
                <EcoBadge type="fairtrade" label="Direct Community Income" />
              </div>
            </div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-12">
          <div className="container-app">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--ink)]">Bookable Cultural Experiences</h2>
                <p className="text-sm text-[var(--gray-500)] mt-1">Select an experience to inquire and reserve dates directly with island hosts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  className="group flex flex-col rounded-3xl border border-[var(--gray-300)] bg-white overflow-hidden shadow-md transition-all hover:shadow-xl hover:border-[var(--ink)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <EcoBadge type={exp.badgeType} label={exp.badgeLabel} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[var(--gray-500)] mb-2">
                        <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                          <HiMapPin className="h-4 w-4 text-[var(--rausch)]" /> {exp.location}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <HiStar className="h-4 w-4 fill-amber-400" /> {exp.rating} ({exp.reviewsCount})
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[var(--ink)] group-hover:text-[var(--rausch)] transition-colors mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-[var(--gray-500)] mb-3">Host: <strong>{exp.host}</strong></p>
                      <p className="text-sm text-[var(--gray-700)] leading-relaxed mb-6">
                        {exp.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[var(--gray-700)] border-t border-[var(--gray-200)] pt-4 mb-5">
                        <span className="flex items-center gap-1">
                          <HiClock className="h-4 w-4 text-[var(--gray-500)]" /> {exp.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiUserGroup className="h-4 w-4 text-[var(--gray-500)]" /> {exp.groupSize}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[var(--gray-500)]">From</span>
                          <p className="text-xl font-black text-[var(--ink)]">${exp.price} <span className="text-xs font-medium text-[var(--gray-500)]">{exp.currency} / guest</span></p>
                        </div>

                        <WhatsAppInquireButton
                          variant="inline"
                          itemTitle={exp.title}
                          itemType="experience"
                          className="py-2.5 px-4 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
