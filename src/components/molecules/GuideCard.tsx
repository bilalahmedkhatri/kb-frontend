import Link from "next/link";
import { HiClock, HiUser } from "react-icons/hi2";
import { cn, truncate } from "@/src/lib/utils";
import type { Guide } from "@/src/types";

interface GuideCardProps {
  guide: Guide;
  variant?: "featured" | "default";
  className?: string;
}

export function GuideCard({ guide, variant = "default", className }: GuideCardProps) {
  return (
    <Link
      href={`/guide/${guide.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-[#F7F7F7]",
        variant === "featured" ? "min-h-[240px]" : "min-h-[170px]",
        className
      )}
    >
      <img
        src={guide.image || "/placeholder.svg"}
        alt={guide.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#222222] backdrop-blur-sm">
        {guide.topic}
      </span>
      <div className="relative z-10 mt-auto flex flex-col gap-1 p-3 text-white">
        <h3 className="text-sm font-bold leading-tight">{guide.title}</h3>
        {variant === "default" && (
          <p className="text-xs text-white/80">{truncate(guide.excerpt, 80)}</p>
        )}
        {variant === "featured" && (
          <p className="text-xs text-white/80">{truncate(guide.excerpt, 120)}</p>
        )}
        <div className="flex items-center gap-3 text-[10px] text-white/70">
          <span className="flex items-center gap-1">
            <HiUser className="h-3 w-3" />
            {guide.authorName}
          </span>
          <span className="flex items-center gap-1">
            <HiClock className="h-3 w-3" />
            {guide.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
