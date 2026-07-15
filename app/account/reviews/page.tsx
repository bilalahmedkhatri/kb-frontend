"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { AccountLayout } from "@/src/components/templates/AccountLayout";
import { ReviewCard } from "@/src/components/molecules/ReviewCard";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";
import { HiChatBubbleLeftRight, HiShoppingBag } from "react-icons/hi2";
import type { Review, Order, Product } from "@/src/types";

const TABS = [
  { key: "submitted", label: "Submitted" },
  { key: "toreview", label: "To Review" },
];

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"submitted" | "toreview">("submitted");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toReviewItems, setToReviewItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      api.getOrders(user.id),
      api.getProducts({ pageSize: 50 }),
    ]).then(([userOrders, allProducts]) => {
      const allReviews: Review[] = [];
      const reviewedIds = new Set<string>();

      const fetchedReviews = Promise.all(
        [...new Set(allProducts.data.map((p) => p.id))].map((pid) =>
          api.getReviews(pid, "product")
        )
      );

      fetchedReviews.then((reviewArrays) => {
        const flat = reviewArrays.flat();
        const userReviews = flat.filter((r) => r.userId === user.id);
        setReviews(userReviews);
        userReviews.forEach((r) => reviewedIds.add(r.targetId));

        const purchasedProductIds = new Set(
          userOrders.flatMap((o) => o.items.map((i) => i.productId))
        );

        const unreviewed = allProducts.data.filter(
          (p) => purchasedProductIds.has(p.id) && !reviewedIds.has(p.id)
        );
        setToReviewItems(unreviewed);
        setLoading(false);
      });
    });
  }, [user]);

  if (!user) {
    return (
      <AccountLayout activeTab="reviews">
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#717171]">Please sign in to view your reviews.</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="reviews">
      <h2 className="mb-4 text-lg font-bold text-[#222222]">My Reviews</h2>

      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-[#222222] text-white"
                : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : activeTab === "submitted" ? (
        reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiChatBubbleLeftRight className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No reviews submitted</p>
            <p className="text-sm text-[#717171]">You haven&apos;t written any reviews yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )
      ) : toReviewItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiShoppingBag className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">Nothing to review</p>
          <p className="text-sm text-[#717171]">All your purchased items have been reviewed.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {toReviewItems.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-[#DDDDDD] p-4"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#222222]">{product.name}</p>
                <p className="text-xs text-[#717171]">{product.vendorName}</p>
              </div>
              <span className="text-xs text-[#FF385C]">Write a Review</span>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
