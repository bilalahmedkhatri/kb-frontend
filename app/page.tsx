"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/src/components/organisms/Hero";
import { CategoryTabBar } from "@/src/components/organisms/CategoryTabBar";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { api } from "@/src/lib/api";
import type { Category, Product, Stay, Guide } from "@/src/types";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredStays, setFeaturedStays] = useState<Stay[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods, staysRes, guidesRes] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts(),
          api.getFeaturedStays(),
          api.getFeaturedGuides(),
        ]);
        setCategories(cats);
        setFeaturedProducts(prods);
        setFeaturedStays(staysRes);
        setFeaturedGuides(guidesRes);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
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
    <div>
      <Hero onSearch={handleTripSearch} />

      <div className="container-app py-8">
        {loading ? (
          <Skeleton variant="rectangular" className="h-24 w-full" />
        ) : (
          <CategoryTabBar
            categories={categories}
            onCategoryChange={(slug) => {
              window.location.href = `/category/${slug}`;
            }}
          />
        )}
      </div>

      <div className="container-app flex flex-col gap-12 pb-16">
        {loading ? (
          <>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-44 w-[160px] shrink-0" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-44 w-[160px] shrink-0" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-64" />
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-44 w-[160px] shrink-0" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <FeaturedRail
              items={featuredProducts}
              type="product"
              title="Handcrafted Products"
              viewAllHref="/marketplace"
            />
            <FeaturedRail
              items={featuredStays}
              type="stay"
              title="Authentic Stays"
              viewAllHref="/stays"
            />
            {featuredGuides.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[#222222]">Explore Kiribati</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {featuredGuides.map((guide) => (
                    <a
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-xl bg-[#F7F7F7]"
                    >
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-[#F7F7F7] px-3 py-1 text-xs font-medium text-[#222222]">
                        {guide.topic}
                      </span>
                      <div className="relative z-10 mt-auto flex flex-col gap-1.5 p-4 text-white">
                        <h3 className="text-base font-bold leading-tight">{guide.title}</h3>
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
