import Link from "next/link";
import { HiMapPin } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Badge } from "@/src/components/atoms/Badge";
import type { User } from "@/src/types";

interface VendorCardProps {
  vendor: User;
  productCount?: number;
  className?: string;
}

export function VendorCard({ vendor, productCount, className }: VendorCardProps) {
  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className={cn(
        "flex items-start gap-4 rounded-xl border border-[#DDDDDD] p-4 transition-colors hover:border-[#222222]",
        className
      )}
    >
      <Avatar src={vendor.avatar} name={vendor.name} size="lg" />
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-[#222222]">{vendor.name}</h3>
        {vendor.bio && <p className="text-sm text-[#717171]">{vendor.bio}</p>}
        {vendor.location && (
          <div className="flex items-center gap-1 text-sm text-[#717171]">
            <HiMapPin className="h-3.5 w-3.5" />
            <span>{vendor.location}</span>
          </div>
        )}
      </div>
      {productCount !== undefined && (
        <Badge variant="outline" className="shrink-0">
          {productCount} products
        </Badge>
      )}
    </Link>
  );
}
