"use client";

import Link from "next/link";
import { HiHeart, HiShoppingCart } from "react-icons/hi2";
import { cn, formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/atoms/Badge";
import { IconButton } from "@/src/components/atoms/IconButton";
import { Button } from "@/src/components/atoms/Button";
import { ImageCarousel } from "@/src/components/molecules/ImageCarousel";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useCartStore } from "@/src/store/cartStore";
import type { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
  className?: string;
  /** next/image sizes hint — defaults to grid context; pass a narrow value for rail context */
  sizes?: string;
}

export function ProductCard({ product, onAddToCart, className, sizes }: ProductCardProps) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      addItem({
        id: product.id,
        type: "product",
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || "",
        vendorName: product.vendorName,
      });
    }
  };

  return (
    <div className={cn("group relative flex w-full flex-col gap-1", className)}>
      <div className="relative w-full aspect-[1/1] overflow-hidden rounded-lg bg-[#F7F7F7]">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={product.name} />
        <ImageCarousel images={product.images} alt={product.name} sizes={sizes} />
        <IconButton
          label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1 bg-white/80 hover:bg-white"
          onClick={() => toggleItem(product.id)}
        >
          <HiHeart className={cn("h-3 w-3", wishlisted ? "fill-[#FF385C] text-[#FF385C]" : "text-[#222222]")} />
        </IconButton>
        <Badge variant="primary" className="absolute left-1 top-1">
          {product.category}
        </Badge>
      </div>
      <div className="flex flex-col gap-0">
        <Link href={`/product/${product.id}`} className="text-[10px] font-semibold text-[#222222] leading-tight hover:underline line-clamp-2">
          {product.name}
        </Link>
        <span className="text-[10px] text-[#717171]">{product.vendorName} • {product.origin}</span>
        <span className="text-[10px] font-semibold text-[#222222]">
          {formatCurrency(product.price)} • <span className="text-[#FF385C]">★</span> {product.rating.toFixed(1)} ({product.reviewCount})
        </span>
      </div>
      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={handleAddToCart} leftIcon={<HiShoppingCart className="h-3 w-3" />}>
        Cart
      </Button>
    </div>
  );
}
