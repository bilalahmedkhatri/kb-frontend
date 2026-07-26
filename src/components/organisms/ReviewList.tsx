import { cn } from "@/src/lib/utils";
import { ReviewCard } from "@/src/components/molecules/ReviewCard";
import { Spinner } from "@/src/components/atoms/Spinner";
import { Rating } from "@/src/components/atoms/Rating";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import type { Review } from "@/src/types";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  className?: string;
}

export function ReviewList({ reviews, isLoading, className }: ReviewListProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <HiChatBubbleLeftRight className="mb-3 h-12 w-12 text-[#DDDDDD]" />
        <p className="text-base font-medium text-[#717171]">No reviews yet</p>
        <p className="text-sm text-[#717171]">Be the first to share your experience.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center gap-3 rounded-xl bg-[#F7F7F7] p-4">
        <span className="text-3xl font-bold text-[#222222]">{averageRating.toFixed(1)}</span>
        <div className="flex flex-col gap-1">
          <Rating value={averageRating} count={reviews.length} size="md" />
          <span className="text-xs text-[#717171]">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
