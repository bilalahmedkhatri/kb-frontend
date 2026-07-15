"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { ProductCard } from "@/src/components/molecules/ProductCard";
import { StayCard } from "@/src/components/molecules/StayCard";
import { ProductGridSkeleton, StayCardSkeleton } from "@/src/components/atoms/Skeleton";
import { Button } from "@/src/components/atoms/Button";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { api } from "@/src/lib/api";
import { HiHeart } from "react-icons/hi2";
import type { Product, Stay } from "@/src/types";

type Tab = "products" | "stays";

export default function WishlistPage() {
  const { items: wishlistedIds } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (wishlistedIds.length === 0) {
          setProducts([]);
          setStays([]);
          setLoading(false);
          return;
        }
        const [allProducts, allStays] = await Promise.all([
          api.getProducts({ pageSize: 100 }),
          api.getStays({ pageSize: 100 }),
        ]);
        setProducts(allProducts.data.filter((p) => wishlistedIds.includes(p.id)));
        setStays(allStays.data.filter((s) => wishlistedIds.includes(s.id)));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [wishlistedIds]);

  const isEmpty = wishlistedIds.length === 0;
  const tabProducts = activeTab === "products" ? products : [];
  const tabStays = activeTab === "stays" ? stays : [];

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#222222]">Wishlist</h1>
        <p className="mt-1 text-sm text-[#717171]">
          {wishlistedIds.length} saved item{wishlistedIds.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20">
          <HiHeart className="mb-4 h-20 w-20 text-[#DDDDDD]" />
          <h2 className="mb-2 text-xl font-bold text-[#222222]">Your wishlist is empty</h2>
          <p className="mb-6 text-sm text-[#717171]">
            Save items you love to your wishlist
          </p>
          <Link href="/search">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-2 border-b border-[#DDDDDD]">
            {(["products", "stays"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-[#222222] text-[#222222]"
                    : "text-[#717171] hover:text-[#222222]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            activeTab === "stays" ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <StayCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProductGridSkeleton count={4} />
            )
          ) : activeTab === "products" && tabProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-base font-medium text-[#717171]">
                No products in your wishlist
              </p>
              <Link href="/search?tab=products" className="mt-2 text-sm text-[#FF385C] hover:underline">
                Browse Products
              </Link>
            </div>
          ) : activeTab === "stays" && tabStays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-base font-medium text-[#717171]">
                No stays in your wishlist
              </p>
              <Link href="/search?tab=stays" className="mt-2 text-sm text-[#FF385C] hover:underline">
                Browse Stays
              </Link>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                activeTab === "stays"
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {activeTab === "products"
                ? tabProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : tabStays.map((stay) => (
                    <StayCard key={stay.id} stay={stay} />
                  ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
