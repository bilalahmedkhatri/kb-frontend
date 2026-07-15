import { cn } from "@/src/lib/utils";
import { HiStar } from "react-icons/hi2";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function Rating({ value, count, size = "sm", showCount = true, className }: RatingProps) {
  const sizeClass = { sm: "text-sm", md: "text-base", lg: "text-lg" }[size];
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <HiStar className={cn("text-[#FF385C]", sizeClass)} />
      <span className={cn("font-semibold text-[#222222]", size === "sm" ? "text-sm" : "text-base")}>
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-sm text-[#717171]">({count})</span>
      )}
    </div>
  );
}
