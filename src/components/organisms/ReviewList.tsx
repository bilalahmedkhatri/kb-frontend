import { cn } from "@/src/lib/utils";
import { ReviewCard } from "@/src/components/molecules/ReviewCard";
import { Spinner } from "@/src/components/atoms/Spinner";
import { Rating } from "@/src/components/atoms/Rating";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import type { Review, ReviewCategoryRatings } from "@/src/types";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  /** Show 4-axis category breakdown bars (cleanliness, location, hospitality, value) */
  showCategoryBreakdown?: boolean;
  className?: string;
}

const categoryLabels: { key: keyof ReviewCategoryRatings; label: string }[] = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "location", label: "Location" },
  { key: "hospitality", label: "Hospitality" },
  { key: "value", label: "Value" },
];

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs font-medium text-[var(--gray-700)] shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--gray-200)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--ink)] transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[var(--ink)] w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export function ReviewList({ reviews, isLoading, isError, onRetry, showCategoryBreakdown = false, className }: ReviewListProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Compute category averages from reviews that have categoryRatings
  const categoryAverages = (() => {
    if (!showCategoryBreakdown) return null;
    const withRatings = reviews.filter((r) => r.categoryRatings);
    if (withRatings.length === 0) return null;

    const totals: Record<string, { sum: number; count: number }> = {};
    for (const r of withRatings) {
      for (const { key } of categoryLabels) {
        const val = r.categoryRatings?.[key];
        if (val != null) {
          if (!totals[key]) totals[key] = { sum: 0, count: 0 };
          totals[key].sum += val;
          totals[key].count += 1;
        }
      }
    }

    return categoryLabels
      .filter(({ key }) => totals[key]?.count > 0)
      .map(({ key, label }) => ({
        label,
        value: totals[key].sum / totals[key].count,
      }));
  })();

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("py-6", className)}>
        <ErrorState
          variant="compact"
          title="Could not load reviews"
          description="We were unable to retrieve customer feedback for this item."
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <HiChatBubbleLeftRight className="mb-3 h-12 w-12 text-[var(--gray-300)]" />
        <p className="text-base font-medium text-[var(--gray-500)]">No reviews yet</p>
        <p className="text-sm text-[var(--gray-500)]">Be the first to share your experience.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Overall Rating Summary + Category Bars */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--gray-50)] p-4 shrink-0">
          <span className="text-3xl font-bold text-[var(--ink)]">{averageRating.toFixed(1)}</span>
          <div className="flex flex-col gap-1">
            <Rating value={averageRating} count={reviews.length} size="md" />
            <span className="text-xs text-[var(--gray-500)]">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {categoryAverages && categoryAverages.length > 0 && (
          <div className="flex-1 flex flex-col gap-2.5 py-1">
            {categoryAverages.map((cat) => (
              <RatingBar key={cat.label} label={cat.label} value={cat.value} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
