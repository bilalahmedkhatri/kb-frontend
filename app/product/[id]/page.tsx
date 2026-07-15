"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Rating } from "@/src/components/atoms/Rating";
import { Badge } from "@/src/components/atoms/Badge";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { cn, formatCurrency, formatDate } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useCartStore } from "@/src/store/cartStore";
import { HiShoppingCart, HiCheckCircle, HiMapPin, HiCube } from "react-icons/hi2";
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const prod = await api.getProduct(id);
        if (!prod) return;
        setProduct(prod);
        setSelectedImage(0);

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
          <Skeleton variant="rectangular" className="aspect-square w-full rounded-xl" />
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-[#F7F7F7]">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    i === selectedImage ? "border-[#222222]" : "border-transparent"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="primary">{product.category}</Badge>
          </div>

          <h1 className="text-2xl font-bold text-[#222222] lg:text-3xl">{product.name}</h1>

          <div className="flex items-center gap-2">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
          </div>

          <div className="text-3xl font-bold text-[#222222]">
            {formatCurrency(product.price)}
          </div>

          <p className="leading-relaxed text-[#717171]">{product.description}</p>

          <div className="flex flex-col gap-2 text-sm text-[#717171]">
            <div className="flex items-center gap-2">
              <HiMapPin className="h-4 w-4" />
              <span>Origin: {product.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCube className="h-4 w-4" />
              <span>Material: {product.material}</span>
            </div>
          </div>

          {vendor && (
            <Link
              href={`/vendor/${vendor.id}`}
              className="flex items-center gap-3 rounded-xl border border-[#DDDDDD] p-4 transition-colors hover:border-[#222222]"
            >
              <Avatar src={vendor.avatar} name={vendor.name} size="md" />
              <div>
                <p className="text-sm font-semibold text-[#222222]">{vendor.name}</p>
                {vendor.location && (
                  <p className="text-xs text-[#717171]">{vendor.location}</p>
                )}
              </div>
            </Link>
          )}

          <div className="flex items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={product.stock} />
            <Button
              onClick={handleAddToCart}
              leftIcon={addedToCart ? <HiCheckCircle className="h-5 w-5" /> : <HiShoppingCart className="h-5 w-5" />}
              className="flex-1"
              disabled={addedToCart}
            >
              {addedToCart ? "Added!" : "Add to Cart"}
            </Button>
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-sm font-medium text-amber-600">Only {product.stock} left in stock</p>
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
            title="Related Products"
            viewAllHref={`/category/${product.category.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
}
