"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Rating } from "@/src/components/atoms/Rating";
import { Badge } from "@/src/components/atoms/Badge";
import { EcoBadge } from "@/src/components/atoms/EcoBadge";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { HeroGallery } from "@/src/components/molecules/HeroGallery";
import { formatCurrency } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useCartStore } from "@/src/store/cartStore";
import { HiShoppingCart, HiCheckCircle, HiMapPin, HiCube, HiShieldCheck } from "react-icons/hi2";
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

  if (loading || !product) {
    return (
      <div className="container-app py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton variant="rectangular" className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6 flex flex-col gap-3">
          <HeroGallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="primary">{product.category}</Badge>
            <EcoBadge type="handmade" />
            <EcoBadge type="fairtrade" />
          </div>

          <h1 className="text-2xl font-black text-[var(--ink)] lg:text-3xl tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-2">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
          </div>

          <div className="text-3xl font-black text-[var(--ink)]">
            {formatCurrency(product.price)} <span className="text-xs text-[var(--gray-500)] font-medium">AUD (Fair-Trade Direct)</span>
          </div>

          <p className="leading-relaxed text-[var(--gray-700)] text-sm">{product.description}</p>

          <div className="flex flex-col gap-2 text-xs font-medium text-[var(--gray-700)] bg-[var(--gray-50)] p-4 rounded-2xl border border-[var(--gray-200)]">
            <div className="flex items-center gap-2">
              <HiMapPin className="h-4 w-4 text-[var(--rausch)]" />
              <span><strong>Island Origin:</strong> {product.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCube className="h-4 w-4 text-[var(--babu)]" />
              <span><strong>Natural Material:</strong> {product.material}</span>
            </div>
          </div>

          {vendor && (
            <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--gray-500)] flex items-center gap-1">
                  <HiShieldCheck className="h-4 w-4 text-[var(--babu)]" /> Verified Kiribati Artisan
                </span>
              </div>
              <Link
                href={`/vendor/${vendor.id}`}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <Avatar src={vendor.avatar} name={vendor.name} size="md" />
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">{vendor.name}</p>
                  {vendor.location && (
                    <p className="text-xs text-[var(--gray-500)]">{vendor.location} Atoll Guild</p>
                  )}
                </div>
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-[var(--gray-200)] pt-4">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={product.stock} />
            <Button
              onClick={handleAddToCart}
              leftIcon={addedToCart ? <HiCheckCircle className="h-5 w-5" /> : <HiShoppingCart className="h-5 w-5" />}
              className="flex-1 py-3 font-bold"
              disabled={addedToCart}
            >
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </Button>
          </div>

          <WhatsAppInquireButton
            variant="inline"
            itemTitle={product.name}
            itemType="handicraft"
            className="w-full py-3"
          />

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-center">
              ⚠️ Only {product.stock} handcrafted items remaining in stock
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <ReviewList reviews={reviews} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
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
