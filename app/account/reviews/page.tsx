"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { ReviewCard } from "@/src/components/molecules/ReviewCard";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";
import { HiChatBubbleLeftRight, HiShoppingBag, HiStar, HiPencilSquare, HiTrash } from "react-icons/hi2";
import type { Review, Product } from "@/src/types";

const TABS = [
  { key: "given", label: "Given Reviews" },
  { key: "pending", label: "Pending Reviews" },
];

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"given" | "pending">("given");
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

  return (
    <>
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
      ) : activeTab === "given" ? (
        reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiChatBubbleLeftRight className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No reviews submitted</p>
            <p className="text-sm text-[#717171]">You haven&apos;t written any reviews yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="group relative">
                <ReviewCard review={review} />
                <div className="absolute right-4 top-4 hidden gap-1 group-hover:flex">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#717171] shadow-sm hover:text-[#222222]">
                    <HiPencilSquare className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#717171] shadow-sm hover:text-red-500">
                    <HiTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
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
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar key={i} className="h-3.5 w-3.5 text-[#DDDDDD]" />
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