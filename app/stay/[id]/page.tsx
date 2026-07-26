"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { ReviewList } from "@/src/components/organisms/ReviewList";
import { BookingModal } from "@/src/components/organisms/BookingModal";
import { FeaturedRail } from "@/src/components/organisms/FeaturedRail";
import { HeroGallery } from "@/src/components/molecules/HeroGallery";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { formatCurrency } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { useUIStore } from "@/src/store/uiStore";
import {
  HiCheck,
  HiMapPin,
  HiShieldCheck,
  HiHeart,
  HiShare,
  HiArrowPath,
  HiCheckBadge,
} from "react-icons/hi2";
import { GiPolarStar } from "react-icons/gi";
import type { Stay, Review } from "@/src/types";

export default function StayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { openBookingModal } = useUIStore();

  const [stay, setStay] = useState<Stay | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedStays, setRelatedStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Calculate nights difference for price breakdown
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const nights = calculateNights();
  const baseTotal = stay ? stay.pricePerNight * nights : 0;

  if (loading || !stay) {
    return (
      <div className="container-app py-8">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton variant="rectangular" className="aspect-[2/1] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton variant="rectangular" className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* 1. Airbnb Header Title & Meta Actions */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight">{stay.name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[var(--ink)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 font-bold">
              ★ {stay.rating.toFixed(1)} <span className="underline font-normal text-[var(--gray-700)]">({stay.reviewCount} reviews)</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 underline text-[var(--gray-700)]">
              <HiMapPin className="h-4 w-4 text-[var(--rausch)]" /> {stay.location}, {stay.island} Atoll, Kiribati
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-[var(--gray-100)] underline font-medium">
              <HiShare className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-[var(--gray-100)] underline font-medium">
              <HiHeart className="h-4 w-4 text-[var(--rausch)]" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* 2. Airbnb 5-Photo Mosaic Gallery */}
      <div className="mb-10">
        <HeroGallery images={stay.images} alt={stay.name} />
      </div>

      {/* 3. Main 2-Column Split Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Main Content (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Host & Accommodation Summary */}
          <div className="flex items-center justify-between border-b border-[var(--gray-200)] pb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">
                Entire {stay.type} hosted by Kiribati Island Host
              </h2>
              <p className="text-xs text-[var(--gray-500)] mt-1 font-medium">
                Up to {stay.maxGuests} guests · {stay.bedrooms} bedroom(s) · Private Atoll Lagoon Access
              </p>
            </div>
            <Avatar name={stay.name} size="lg" />
          </div>

          {/* Highlights & Eco Credentials */}
          <div className="flex flex-col gap-4 border-b border-[var(--gray-200)] pb-6">
            <div className="flex items-start gap-3">
              <GiPolarStar className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">100% Eco-Certified Lodge</h3>
                <p className="text-xs text-[var(--gray-500)]">Powered by solar energy and local fresh coconut spring water.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="h-6 w-6 text-[var(--babu)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Verified Atoll Homestay</h3>
                <p className="text-xs text-[var(--gray-500)]">Direct fair-trade payout to local Kiribati island families.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiArrowPath className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Free Cancellation</h3>
                <p className="text-xs text-[var(--gray-500)]">Cancel up to 48 hours before check-in for a full refund.</p>
              </div>
            </div>
          </div>

          {/* AirCover Guarantee */}
          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-5 flex flex-col gap-2">
            <span className="text-base font-black tracking-tight text-[var(--rausch)] flex items-center gap-1">
              <HiCheckBadge className="h-5 w-5" /> Island Cover Protection
            </span>
            <p className="text-xs text-rose-950 leading-relaxed">
              Every booking includes free protection from host cancellations, listing inaccuracies, and check-in assistance via our WhatsApp support desk.
            </p>
          </div>

          {/* Description */}
          <div className="border-b border-[var(--gray-200)] pb-6">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-3">About this stay</h3>
            <p className="leading-relaxed text-sm text-[var(--gray-700)] whitespace-pre-line">{stay.description}</p>
          </div>

          {/* Amenities Grid */}
          <div className="border-b border-[var(--gray-200)] pb-6">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-4">What this stay offers</h3>
            <div className="grid grid-cols-2 gap-3">
              {stay.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2.5 text-xs text-[var(--gray-700)] font-medium">
                  <HiCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Floating Reservation Card (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-[var(--gray-300)] bg-white p-6 shadow-xl">
            {/* Card Price Header */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-black text-[var(--ink)]">{formatCurrency(stay.pricePerNight)}</span>
                <span className="text-xs font-semibold text-[var(--gray-500)]"> / night</span>
              </div>
              <span className="text-xs font-bold text-[var(--ink)] flex items-center gap-1">
                ★ {stay.rating.toFixed(1)} · <span className="underline text-[var(--gray-500)]">{stay.reviewCount} reviews</span>
              </span>
            </div>

            {/* Airbnb Single Bordered Date & Guest Inputs Box */}
            <div className="rounded-xl border border-[var(--gray-300)] overflow-hidden mb-4 bg-white">
              <div className="grid grid-cols-2 border-b border-[var(--gray-300)]">
                <div className="p-2.5 border-r border-[var(--gray-300)]">
                  <label className="block text-[10px] font-bold uppercase text-[var(--ink)]">CHECK-IN</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-semibold text-[var(--ink)] bg-transparent focus:outline-hidden"
                  />
                </div>
                <div className="p-2.5">
                  <label className="block text-[10px] font-bold uppercase text-[var(--ink)]">CHECKOUT</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || undefined}
                    className="w-full text-xs font-semibold text-[var(--ink)] bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="p-2.5">
                <label className="block text-[10px] font-bold uppercase text-[var(--ink)]">GUESTS</label>
                <div className="mt-1">
                  <QuantityStepper value={guests} onChange={setGuests} min={1} max={stay.maxGuests} />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 mb-4">
              <Button
                onClick={handleRequestBooking}
                className="w-full py-3.5 text-sm font-bold bg-[var(--rausch)] hover:bg-[var(--rausch-dark)] text-white shadow-md rounded-xl"
              >
                Reserve Stay Inquiry
              </Button>

              <WhatsAppInquireButton
                variant="inline"
                itemTitle={stay.name}
                itemType="stay"
                className="w-full py-3 text-xs"
              />
            </div>

            <p className="text-center text-xs text-[var(--gray-500)] mb-4">You won&apos;t be charged yet</p>

            {/* Price Calculation Breakdown */}
            <div className="flex flex-col gap-2 text-xs text-[var(--gray-700)] border-t border-[var(--gray-200)] pt-4">
              <div className="flex justify-between">
                <span>{formatCurrency(stay.pricePerNight)} x {nights} night(s)</span>
                <span>{formatCurrency(baseTotal)} AUD</span>
              </div>
              <div className="flex justify-between">
                <span>Island Eco & Clean Energy Fee</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-extrabold text-[var(--ink)] text-sm border-t border-[var(--gray-200)] pt-3 mt-1">
                <span>Total AUD</span>
                <span>{formatCurrency(baseTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 border-t border-[var(--gray-200)] pt-12">
        <ReviewList reviews={reviews} />
      </div>

      {/* Similar Stays Rail */}
      {relatedStays.length > 0 && (
        <div className="mt-16">
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
