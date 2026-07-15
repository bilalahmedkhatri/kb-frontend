"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rating } from "@/src/components/atoms/Rating";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { BookingModal } from "@/src/components/organisms/BookingModal";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { cn, formatCurrency, formatDate } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useUIStore } from "@/src/store/uiStore";
import {
  HiCheck,
  HiMapPin,
  HiUserGroup,
  HiHome,
  HiCalendarDays,
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
            <Skeleton variant="rectangular" className="aspect-[3/2] w-full rounded-xl" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-16 w-16 rounded-lg" />
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-[3/2] overflow-hidden rounded-xl bg-[#F7F7F7]">
            <img
              src={stay.images[selectedImage] || "/placeholder.svg"}
              alt={stay.name}
              className="h-full w-full object-cover"
            />
          </div>
          {stay.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {stay.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    i === selectedImage ? "border-[#222222]" : "border-transparent"
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

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="capitalize">{stay.type}</Badge>
            <Badge variant="outline">{stay.status}</Badge>
          </div>

          <h1 className="text-2xl font-bold text-[#222222] lg:text-3xl">{stay.name}</h1>

          <div className="flex items-center gap-2 text-sm text-[#717171]">
            <HiMapPin className="h-4 w-4" />
            <span>{stay.location}, {stay.island}</span>
          </div>

          <div className="flex items-center gap-2">
            <Rating value={stay.rating} count={stay.reviewCount} size="md" />
          </div>

          <div className="text-3xl font-bold text-[#222222]">
            {formatCurrency(stay.pricePerNight)}{" "}
            <span className="text-base font-normal text-[#717171]">/ night</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-[#717171]">
            <span className="flex items-center gap-1">
              <HiHome className="h-4 w-4" /> {stay.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <HiUserGroup className="h-4 w-4" /> Up to {stay.maxGuests} guests
            </span>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#222222]">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {stay.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-sm text-[#717171]">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="leading-relaxed text-[#717171]">{stay.description}</p>

          <div className="flex flex-col gap-4 rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="text-sm font-semibold text-[#222222]">Book this stay</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#717171]">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#717171]">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || undefined}
                  className="w-full rounded-lg border border-[#DDDDDD] px-3 py-2 text-sm focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#717171]">Guests</label>
              <QuantityStepper value={guests} onChange={setGuests} min={1} max={stay.maxGuests} />
            </div>
            <Button onClick={handleRequestBooking} className="w-full">
              Request to Book
            </Button>
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
            title={`Similar ${stay.type}s`}
            viewAllHref="/search?tab=stays"
          />
        </div>
      )}

      {stay && <BookingModal stay={stay} />}
    </div>
  );
}
