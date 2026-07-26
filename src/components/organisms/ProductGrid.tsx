import { cn } from "@/src/lib/utils";
import { ProductCard } from "@/src/components/molecules/ProductCard";
import { ProductCardSkeleton } from "@/src/components/atoms/Skeleton";
import { Pagination } from "@/src/components/atoms/Pagination";
import { HiInboxArrowDown } from "react-icons/hi2";
import type { Product } from "@/src/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  emptyMessage = "No products found",
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HiInboxArrowDown className="mb-3 h-12 w-12 text-[#DDDDDD]" />
        <p className="text-base font-medium text-[#717171]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && onPageChange && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
