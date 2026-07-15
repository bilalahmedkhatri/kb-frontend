import { cn } from "@/src/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseClass = "animate-pulse bg-[#EBEBEB]";
  const variantClass = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  }[variant];

  return <div className={cn(baseClass, variantClass, className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton variant="card" className="aspect-square w-full" />
      <Skeleton className="h-2.5 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="h-2.5 w-1/3" />
    </div>
  );
}

export function StayCardSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton variant="card" className="aspect-square w-full" />
      <Skeleton className="h-2.5 w-2/3" />
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="h-2.5 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
