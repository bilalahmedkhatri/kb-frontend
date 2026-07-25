"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rating } from "@/src/components/atoms/Rating";
import { Badge } from "@/src/components/atoms/Badge";
import { EcoBadge } from "@/src/components/atoms/EcoBadge";
import { Button } from "@/src/components/atoms/Button";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { BookingModal } from "@/src/components/organisms/BookingModal";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { cn, formatCurrency } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useUIStore } from "@/src/store/uiStore";
import {
  HiCheck,
  HiMapPin,
  HiUserGroup,
  HiHome,
  HiShieldCheck,
} from "react-icons/hi2";
import type { Stay, Review } from "@/src/types";

export default function StayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { openBookingModal } = useUIStore();

  const [stay, setStay] = useState<Stay | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedStays, setRelatedStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const s = await api.getStay(id);
        if (!s) return;
        setStay(s);

        const [revs, allStays] = await Promise.all([
          api.getReviews(id, "stay"),
          api.getStays({ pageSize: 20 }),
        ]);

        setReviews(revs);
        setRelatedStays(allStays.data.filter((st) => st.id !== id && st.type === s.type).slice(0, 8));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleRequestBooking = () => {
    if (stay) openBookingModal(stay.id);
  };

  if (loading || !stay) {
    return (
      <div className="container-app py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Skeleton variant="rectangular" className="aspect-[3/2] w-full rounded-2xl" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-16 w-16 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="aspect-[3/2] overflow-hidden rounded-3xl bg-[var(--gray-100)] border border-[var(--gray-200)] shadow-xs">
            <img
              src={stay.images[selectedImage] || "/placeholder.svg"}
              alt={stay.name}
              className="h-full w-full object-cover transition-all duration-300"
            />
          </div>
          {stay.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {stay.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                    i === selectedImage ? "border-[var(--rausch)] scale-105 shadow-xs" : "border-transparent opacity-75 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`${stay.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="capitalize">{stay.type}</Badge>
            <EcoBadge type="solar" />
            <EcoBadge type="certified" label="Verified Island Host" />
          </div>

          <h1 className="text-2xl font-black text-[var(--ink)] lg:text-3xl tracking-tight">{stay.name}</h1>

          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <HiMapPin className="h-4 w-4 text-[var(--rausch)]" />
            <span>{stay.location}, {stay.island} Atoll</span>
          </div>

          <div className="flex items-center gap-2">
            <Rating value={stay.rating} count={stay.reviewCount} size="md" />
          </div>

          <div className="text-3xl font-black text-[var(--ink)]">
            {formatCurrency(stay.pricePerNight)}{" "}
            <span className="text-xs font-medium text-[var(--gray-500)]">/ night (Inquiry Booking)</span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-[var(--gray-700)] bg-[var(--gray-50)] p-4 rounded-2xl border border-[var(--gray-200)]">
            <span className="flex items-center gap-1.5">
              <HiHome className="h-4 w-4 text-[var(--babu)]" /> {stay.bedrooms} Bed(s)
            </span>
            <span className="flex items-center gap-1.5">
              <HiUserGroup className="h-4 w-4 text-[var(--rausch)]" /> Up to {stay.maxGuests} Guests
            </span>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Stay Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {stay.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-xs text-[var(--gray-700)] font-medium">
                  <HiCheck className="h-4 w-4 text-emerald-600" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="leading-relaxed text-sm text-[var(--gray-700)]">{stay.description}</p>

          {/* Booking Card */}
          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--gray-300)] bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--ink)]">Reserve Stay Inquiry</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <HiShieldCheck className="h-3.5 w-3.5" /> Instant Host WhatsApp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--gray-700)]">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-[var(--gray-300)] px-3 py-2 text-xs focus:border-[var(--ink)] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--gray-700)]">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || undefined}
                  className="w-full rounded-xl border border-[var(--gray-300)] px-3 py-2 text-xs focus:border-[var(--ink)] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--gray-700)]">Guests</label>
              <QuantityStepper value={guests} onChange={setGuests} min={1} max={stay.maxGuests} />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleRequestBooking} variant="primary" className="w-full py-3 font-bold">
                Request to Book Stay
              </Button>

              <WhatsAppInquireButton
                variant="inline"
                itemTitle={stay.name}
                itemType="stay"
                className="w-full py-3 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ReviewList reviews={reviews} />
      </div>

      {relatedStays.length > 0 && (
        <div className="mt-12">
          <FeaturedRail
            items={relatedStays}
            type="stay"
            title={`Similar Kiribati ${stay.type}s`}
            viewAllHref="/search?tab=stays"
          />
        </div>
      )}

      {stay && <BookingModal stay={stay} />}
    </div>
  );
}
