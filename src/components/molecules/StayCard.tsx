import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/atoms/Badge";
import type { Stay } from "@/src/types";

interface StayCardProps {
  stay: Stay;
  className?: string;
}

export function StayCard({ stay, className }: StayCardProps) {
  return (
    <Link href={`/stay/${stay.id}`} className={cn("group flex flex-col gap-1", className)}>
      <div className="relative aspect-[1/1] overflow-hidden rounded-lg bg-[#F7F7F7]">
        <Image
          src={stay.images[0] || "/placeholder.svg"}
          alt={stay.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge variant="primary" className="absolute left-1 top-1 capitalize">
          {stay.type}
        </Badge>
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-[10px] font-semibold text-[#222222] leading-tight line-clamp-1 group-hover:underline">
          {stay.name}
        </h3>
        <span className="text-[10px] text-[#717171]">{stay.location}</span>
        <span className="text-[10px] font-semibold text-[#222222]">
          {formatCurrency(stay.pricePerNight)}/guest • <span className="text-[#FF385C]">★</span> {stay.rating.toFixed(1)} ({stay.reviewCount})
        </span>
      </div>
    </Link>
  );
}
