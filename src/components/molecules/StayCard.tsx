import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/atoms/Badge";
import { HiCheckBadge } from "react-icons/hi2";
import { GiPalmTree } from "react-icons/gi";
import type { Stay } from "@/src/types";

interface StayCardProps {
  stay: Stay;
  className?: string;
  /** next/image sizes hint - defaults to grid context; pass a narrow value for rail context */
  sizes?: string;
}

export function StayCard({
  stay,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: StayCardProps) {
  const hasEco = stay.ecoCredentials && (
    stay.ecoCredentials.solarPowerPercent ||
    stay.ecoCredentials.rainwaterCollection ||
    stay.ecoCredentials.lagoonAccess
  );

  return (
    <Link href={`/stay/${stay.id}`} className={cn("group flex w-full flex-col gap-1", className)}>
      <div className="relative w-full aspect-[1/1] overflow-hidden rounded-lg bg-[var(--gray-100)]">
        <Image
          src={stay.images[0] || "/placeholder.svg"}
          alt={stay.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge variant="primary" className="absolute left-1 top-1 capitalize">
          {stay.type.replace("-", " ")}
        </Badge>
        {hasEco && (
          <span className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-emerald-600/90 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
            <GiPalmTree className="h-3 w-3" /> Eco
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-[10px] font-semibold text-[var(--ink)] leading-tight line-clamp-1 group-hover:underline">
          {stay.name}
        </h3>
        <span className="text-[10px] text-[var(--gray-500)] flex items-center gap-0.5">
          {stay.location}
          {stay.hostVerified && (
            <HiCheckBadge className="h-3 w-3 text-[var(--babu)] shrink-0 inline-block" />
          )}
        </span>
        <span className="text-[10px] font-semibold text-[var(--ink)]">
          {formatCurrency(stay.pricePerNight)}/night · <span className="text-[var(--rausch)]">★</span> {stay.rating.toFixed(1)} ({stay.reviewCount})
        </span>
      </div>
    </Link>
  );
}

