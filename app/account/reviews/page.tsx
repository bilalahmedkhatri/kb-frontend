"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/src/store/authStore";
import { ReviewCard } from "@/src/components/molecules/ReviewCard";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useUserReviews } from "@/src/hooks";
import { cn } from "@/src/lib/utils";
import { HiChatBubbleLeftRight, HiShoppingBag, HiStar, HiPencilSquare, HiTrash } from "react-icons/hi2";

const TABS = [
  { key: "given", label: "Given Reviews" },
  { key: "pending", label: "Pending Reviews" },
];

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"given" | "pending">("given");

  const userReviewsQuery = useUserReviews(user?.id, Boolean(user));
  const reviews = userReviewsQuery.data?.reviews ?? [];
  const toReviewItems = userReviewsQuery.data?.toReviewItems ?? [];

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-ink">My Reviews</h2>

      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-ink text-white"
                : "bg-gray-100 text-gray-500 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {userReviewsQuery.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : userReviewsQuery.isError ? (
        <ErrorState
          title="Could not load your reviews"
          description="We couldn't retrieve your review data right now. Please try again."
          onRetry={() => void userReviewsQuery.refetch()}
        />
      ) : activeTab === "given" ? (
        reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16">
            <HiChatBubbleLeftRight className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-base font-medium text-gray-500">No reviews submitted</p>
            <p className="text-sm text-gray-500">You haven&apos;t written any reviews yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="group relative">
                <ReviewCard review={review} />
                <div className="absolute right-4 top-4 hidden gap-1 group-hover:flex">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-ink">
                    <HiPencilSquare className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-red-500">
                    <HiTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : toReviewItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16">
          <HiShoppingBag className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-base font-medium text-gray-500">Nothing to review</p>
          <p className="text-sm text-gray-500">All your purchased items have been reviewed.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {toReviewItems.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-gray-300 p-4"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={64}
                height={64}
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{product.name}</p>
                <p className="text-xs text-gray-500">{product.vendorName}</p>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar key={i} className="h-3.5 w-3.5 text-gray-300" />
                  ))}
                </div>
              </div>
              <Button size="sm" variant="outline" leftIcon={<HiPencilSquare className="h-3.5 w-3.5" />}>
                Write a Review
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
