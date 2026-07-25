"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/src/components/organisms/Hero";
import { CategoryTabBar } from "@/src/components/organisms/CategoryTabBar";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { IslandExplorer } from "@/src/components/organisms/IslandExplorer";
import { ArtisanStoryClip } from "@/src/components/molecules/ArtisanStoryClip";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { Button } from "@/src/components/atoms/Button";
import { api } from "@/src/lib/api";
import type { Category, Product, Stay, Guide } from "@/src/types";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredStays, setFeaturedStays] = useState<Stay[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [cats, prods, staysRes, guidesRes] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts(),
          api.getFeaturedStays(),
          api.getFeaturedGuides(),
        ]);
        if (isSubscribed) {
          setCategories(cats);
          setFeaturedProducts(prods);
          setFeaturedStays(staysRes);
          setFeaturedGuides(guidesRes);
        }
      } catch {
        if (isSubscribed) {
          setError("Unable to load island listings. Please check connection and retry.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleTripSearch = (query: { where: string; checkIn: string; checkOut: string; guests: number }) => {
    const params = new URLSearchParams();
    if (query.where) params.set("q", query.where);
    if (query.checkIn) params.set("checkIn", query.checkIn);
    if (query.checkOut) params.set("checkOut", query.checkOut);
    if (query.guests > 1) params.set("guests", String(query.guests));
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="relative">
      <Hero onSearch={handleTripSearch} />

      <div className="container-app py-8">
        {loading ? (
          <Skeleton variant="rectangular" className="h-24 w-full rounded-2xl" />
        ) : (
          <CategoryTabBar
            categories={categories}
            onCategoryChange={(slug) => {
              window.location.href = `/category/${slug}`;
            }}
          />
        )}
      </div>

      {/* Interactive Atoll Island Explorer */}
      <IslandExplorer />

      <div className="container-app flex flex-col gap-14 py-12">
        {error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center my-6">
            <h3 className="text-lg font-bold text-rose-900 mb-2">Couldn't Load Island Content</h3>
            <p className="text-sm text-rose-700 max-w-md mb-4">{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        ) : loading ? (
          <>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-44 w-[200px] shrink-0 rounded-2xl" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <FeaturedRail
              items={featuredProducts}
              type="product"
              title="Authentic Kiribati Handicrafts"
              viewAllHref="/marketplace"
            />

            {/* Artisan Story Spotlight Clip */}
            <section className="my-2">
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--babu)]">Master Artisan Heritage</h3>
                <h2 className="text-2xl font-black text-[var(--ink)]">Meet Kiribati Craftswomen</h2>
              </div>
              <ArtisanStoryClip
                artisanName="Teberia Aritiera"
                artisanRole="Master Pandanus Leaf Weaver"
                islandOrigin="Kiritimati (Christmas Island)"
                craftName="Woven Pandanus Fine Mat & Shell Baskets"
                quote="Every woven strand holds the breeze of our outer island reefs and the story of our elders."
              />
            </section>

            <FeaturedRail
              items={featuredStays}
              type="stay"
              title="Authentic Island Stays & Eco-Lodges"
              viewAllHref="/stays"
            />

            {featuredGuides.length > 0 && (
              <section className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--rausch)]">Cultural Magazine</h3>
                  <h2 className="text-2xl font-black text-[var(--ink)]">Kiribati Island Guides</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {featuredGuides.map((guide) => (
                    <a
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl bg-[var(--gray-100)] border border-[var(--gray-200)] shadow-xs transition-all hover:shadow-lg"
                    >
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--ink)] shadow-xs">
                        {guide.topic}
                      </span>
                      <div className="relative z-10 mt-auto flex flex-col gap-1.5 p-5 text-white">
                        <h3 className="text-base font-bold leading-tight group-hover:text-amber-300 transition-colors">{guide.title}</h3>
                        <p className="text-xs text-white/80 line-clamp-2">{guide.excerpt}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
