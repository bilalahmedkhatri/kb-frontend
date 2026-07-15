import { HiStar } from "react-icons/hi2";
import { cn, formatDate } from "@/src/lib/utils";
import { Avatar } from "@/src/components/atoms/Avatar";
import type { Review } from "@/src/types";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-[#DDDDDD] p-4", className)}>
      <div className="flex items-center gap-3">
        <Avatar src={review.userAvatar} name={review.userName} size="md" />
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-semibold text-[#222222]">{review.userName}</span>
          <span className="text-xs text-[#717171]">{formatDate(review.createdAt)}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <HiStar
              key={i}
              className={cn("h-4 w-4", i < review.rating ? "text-[#FF385C]" : "text-[#DDDDDD]")}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-[#222222]">{review.title}</h4>
        <p className="text-sm leading-relaxed text-[#717171]">{review.comment}</p>
      </div>
    </div>
  );
}
