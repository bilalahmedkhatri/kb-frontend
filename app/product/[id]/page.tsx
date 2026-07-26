"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { HeroGallery } from "@/src/components/molecules/HeroGallery";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { formatCurrency } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useCartStore } from "@/src/store/cartStore";
import {
  HiShoppingCart,
  HiCheckCircle,
  HiMapPin,
  HiCube,
  HiShieldCheck,
  HiShare,
  HiHeart,
  HiCheckBadge,
  HiTruck,
} from "react-icons/hi2";
import { GiPolarStar } from "react-icons/gi";
import type { Product, Review, User } from "@/src/types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [vendor, setVendor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const prod = await api.getProduct(id);
        if (!prod) return;
        setProduct(prod);

        const [revs, related] = await Promise.all([
          api.getReviews(id, "product"),
          api.getProducts({
            pageSize: 8,
            filters: { categories: [prod.category] },
          }),
        ]);

        setReviews(revs);
        setRelatedProducts(related.data.filter((p) => p.id !== id));

        const vend = await api.getVendor(prod.vendorId);
        if (vend) setVendor(vend);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      type: "product",
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "",
      vendorName: product.vendorName,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const baseTotal = product ? product.price * quantity : 0;

  if (loading || !product) {
    return (
      <div className="container-app py-8">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton variant="rectangular" className="aspect-[2/1] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton variant="rectangular" className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* 1. Airbnb Header Title & Actions */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight">{product.name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[var(--ink)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 font-bold">
              ★ {product.rating.toFixed(1)} <span className="underline font-normal text-[var(--gray-700)]">({product.reviewCount} reviews)</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 underline text-[var(--gray-700)]">
              <HiMapPin className="h-4 w-4 text-[var(--rausch)]" /> Handcrafted in {product.origin}, Kiribati
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-[var(--gray-100)] underline font-medium">
              <HiShare className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-[var(--gray-100)] underline font-medium">
              <HiHeart className="h-4 w-4 text-[var(--rausch)]" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* 2. Airbnb 5-Photo Mosaic Gallery */}
      <div className="mb-10">
        <HeroGallery images={product.images} alt={product.name} />
      </div>

      {/* 3. Main 2-Column Split Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Main Content (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Creator & Guild Summary */}
          <div className="flex items-center justify-between border-b border-[var(--gray-200)] pb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">
                Handcrafted item created by {product.vendorName}
              </h2>
              <p className="text-xs text-[var(--gray-500)] mt-1 font-medium flex items-center gap-2">
                <span>Category: <strong>{product.category}</strong></span>
                <span>·</span>
                <span>Atoll Guild: <strong>{product.origin}</strong></span>
              </p>
            </div>
            {vendor && <Avatar src={vendor.avatar} name={vendor.name} size="lg" />}
          </div>

          {/* Highlights & Eco Credentials */}
          <div className="flex flex-col gap-4 border-b border-[var(--gray-200)] pb-6">
            <div className="flex items-start gap-3">
              <GiPolarStar className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">100% Authentic Island Fiber</h3>
                <p className="text-xs text-[var(--gray-500)]">Hand-harvested pandanus leaves and natural dyes from outer Kiribati atolls.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="h-6 w-6 text-[var(--babu)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Direct Fair-Trade Payout</h3>
                <p className="text-xs text-[var(--gray-500)]">100% of the asking price supports local Kiribati women craftswomen.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiTruck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">International Air Express Shipping</h3>
                <p className="text-xs text-[var(--gray-500)]">Packaged locally in Tarawa and shipped via Kiribati Post / DHL Express.</p>
              </div>
            </div>
          </div>

          {/* AirCover / Fair Trade Guarantee */}
          <div className="rounded-2xl bg-teal-50/80 border border-teal-200 p-5 flex flex-col gap-2">
            <span className="text-base font-black tracking-tight text-teal-950 flex items-center gap-1">
              <HiCheckBadge className="h-5 w-5 text-teal-700" /> Island Connects Authenticity Guarantee
            </span>
            <p className="text-xs text-teal-950 leading-relaxed">
              Every handicraft is verified for local island provenance, fair-trade artisan compensation, and safe international transit packaging.
            </p>
          </div>

          {/* Description */}
          <div className="border-b border-[var(--gray-200)] pb-6">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-3">About this craft</h3>
            <p className="leading-relaxed text-sm text-[var(--gray-700)] whitespace-pre-line">{product.description}</p>
          </div>

          {/* Item Specs */}
          <div className="border-b border-[var(--gray-200)] pb-6">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Specifications & Materials</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-[var(--gray-700)] bg-[var(--gray-50)] p-4 rounded-2xl border border-[var(--gray-200)]">
              <div className="flex items-center gap-2">
                <HiMapPin className="h-4 w-4 text-[var(--rausch)]" />
                <span><strong>Origin:</strong> {product.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCube className="h-4 w-4 text-[var(--babu)]" />
                <span><strong>Material:</strong> {product.material}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Floating Purchase Card (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-[var(--gray-300)] bg-white p-6 shadow-xl">
            {/* Card Price Header */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-black text-[var(--ink)]">{formatCurrency(product.price)}</span>
                <span className="text-xs font-semibold text-[var(--gray-500)]"> AUD</span>
              </div>
              <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1">
                ★ {product.rating.toFixed(1)} · <span className="underline text-[var(--gray-500)]">{product.reviewCount} reviews</span>
              </span>
            </div>

            {/* Quantity Stepper Input Box */}
            <div className="rounded-xl border border-[var(--gray-300)] p-3 mb-4 bg-white">
              <label className="block text-[10px] font-bold uppercase text-[var(--ink)] mb-1">QUANTITY</label>
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={product.stock} />
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 mb-4">
              <Button
                onClick={handleAddToCart}
                disabled={addedToCart}
                leftIcon={addedToCart ? <HiCheckCircle className="h-5 w-5" /> : <HiShoppingCart className="h-5 w-5" />}
                className="w-full py-3.5 text-sm font-bold bg-[var(--rausch)] hover:bg-[var(--rausch-dark)] text-white shadow-md rounded-xl"
              >
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>

              <WhatsAppInquireButton
                variant="inline"
                itemTitle={product.name}
                itemType="handicraft"
                className="w-full py-3 text-xs"
              />
            </div>

            {/* Price Calculation Breakdown */}
            <div className="flex flex-col gap-2 text-xs text-[var(--gray-700)] border-t border-[var(--gray-200)] pt-4">
              <div className="flex justify-between">
                <span>{formatCurrency(product.price)} x {quantity} item(s)</span>
                <span>{formatCurrency(baseTotal)} AUD</span>
              </div>
              <div className="flex justify-between">
                <span>Artisan Direct Fair-Trade Contribution</span>
                <span className="text-emerald-700 font-bold">100%</span>
              </div>
              <div className="flex justify-between font-extrabold text-[var(--ink)] text-sm border-t border-[var(--gray-200)] pt-3 mt-1">
                <span>Total AUD</span>
                <span>{formatCurrency(baseTotal)}</span>
              </div>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="mt-4 text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                ⚠️ Limited stock: Only {product.stock} left
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 border-t border-[var(--gray-200)] pt-12">
        <ReviewList reviews={reviews} />
      </div>

      {/* Related Products Rail */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <FeaturedRail
            items={relatedProducts}
            type="product"
            title="Related Authentic Handicrafts"
            viewAllHref={`/category/${product.category.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
}
