"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { stays } from "@/src/data/stays";
import { products } from "@/src/data/products";
import { guides } from "@/src/data/guides";
import { formatCurrency, cn } from "@/src/lib/utils";
import {
  HiHeart,
  HiHome,
  HiShoppingBag,
  HiBookOpen,
  HiTrash,
  HiStar,
  HiClock,
} from "react-icons/hi2";

const TABS = [
  { key: "stays", label: "Saved Stays", icon: HiHome },
  { key: "products", label: "Saved Products", icon: HiShoppingBag },
  { key: "guides", label: "Saved Guides", icon: HiBookOpen },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<"stays" | "products" | "guides">("stays");
  const [savedStayIds, setSavedStayIds] = useState<string[]>(["s-1", "s-2", "s-3"]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["p-1", "p-5", "p-12"]);
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(["g-1", "g-3", "g-8"]);

  const savedStays = stays.filter((s) => savedStayIds.includes(s.id));
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));
  const savedGuideItems = guides.filter((g) => savedGuideIds.includes(g.id));

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Saved Items</h2>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-[#222222] text-white"
                  : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "stays" && (
        savedStays.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiHeart className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No saved stays</p>
            <p className="text-sm text-[#717171]">Browse stays and save your favorites here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedStays.map((stay) => (
              <div key={stay.id} className="group flex flex-col rounded-xl border border-[#DDDDDD] overflow-hidden">
                <div className="relative h-44">
                  <img src={stay.images[0]} alt={stay.name} className="h-full w-full object-cover" />
                  <button
                    onClick={() => setSavedStayIds((prev) => prev.filter((id) => id !== stay.id))}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#FF385C] hover:bg-white"
                  >
                    <HiHeart className="h-4 w-4" />
                  </button>
                  <div className="absolute left-2 bottom-2">
                    <Badge variant="primary">{stay.type}</Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <Link href={`/stay/${stay.id}`} className="text-sm font-bold text-[#222222] hover:underline">
                    {stay.name}
                  </Link>
                  <p className="text-xs text-[#717171]">{stay.location}, {stay.island}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-[#222222]">
                      {formatCurrency(stay.pricePerNight, stay.currency)} <span className="text-xs font-normal text-[#717171]">/ night</span>
                    </span>
                    <div className="flex items-center gap-0.5 text-xs text-[#717171]">
                      <HiStar className="h-3 w-3 text-[#FF385C]" />
                      {stay.rating} ({stay.reviewCount})
                    </div>
                  </div>
                  <Link href={`/stay/${stay.id}`} className="mt-2">
                    <Button size="sm" className="w-full">Book Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "products" && (
        savedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiHeart className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No saved products</p>
            <p className="text-sm text-[#717171]">Browse the marketplace and save items you love.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product) => (
              <div key={product.id} className="group flex flex-col rounded-xl border border-[#DDDDDD] overflow-hidden">
                <div className="relative h-44">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                  <button
                    onClick={() => setSavedProductIds((prev) => prev.filter((id) => id !== product.id))}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#FF385C] hover:bg-white"
                  >
                    <HiHeart className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <Link href={`/product/${product.id}`} className="text-sm font-bold text-[#222222] hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-xs text-[#717171]">{product.vendorName}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-[#222222]">{formatCurrency(product.price, product.currency)}</span>
                    <div className="flex items-center gap-0.5 text-xs text-[#717171]">
                      <HiStar className="h-3 w-3 text-[#FF385C]" />
                      {product.rating} ({product.reviewCount})
                    </div>
                  </div>
                  <Button size="sm" className="mt-2">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "guides" && (
        savedGuideItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiHeart className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No saved guides</p>
            <p className="text-sm text-[#717171]">Save cultural and travel guides for trip planning.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedGuideItems.map((guide) => (
              <div key={guide.id} className="flex items-center gap-4 rounded-xl border border-[#DDDDDD] p-4">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/guides/${guide.slug}`} className="text-sm font-bold text-[#222222] hover:underline">
                    {guide.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-[#717171] line-clamp-1">{guide.excerpt}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-[#717171]">
                    <span className="flex items-center gap-1">
                      <HiClock className="h-3 w-3" />
                      {guide.readTime} min read
                    </span>
                    <Badge variant="outline">{guide.topic}</Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSavedGuideIds((prev) => prev.filter((id) => id !== guide.id))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#717171] hover:bg-[#F7F7F7] hover:text-[#FF385C]"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}