"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import {
  HiCalendarDays,
  HiMapPin,
  HiChatBubbleLeft,
  HiDocumentArrowDown,
  HiXCircle,
  HiXMark,
  HiCheckCircle,
  HiPhone,
  HiEnvelope,
  HiShieldExclamation,
  HiHome,
} from "react-icons/hi2";
import { cn, formatDate, formatCurrency } from "@/src/lib/utils";

interface BookingItem {
  id: string;
  stayId: string;
  stayName: string;
  hostName: string;
  hostPhone: string;
  hostEmail: string;
  location: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: "upcoming" | "completed" | "cancelled";
  refundStatus?: "full" | "partial" | "none";
}

const MOCK_BOOKINGS: BookingItem[] = [
  { id: "b-1", stayId: "s-1", stayName: "Tebwa Beach Homestay", hostName: "Anere Homestays", hostPhone: "+686 750 1234", hostEmail: "anere@homestays.ki", location: "Bikenibeu, Tarawa", image: "https://picsum.photos/seed/stay1/400/300", checkIn: "2026-08-15", checkOut: "2026-08-20", guests: 2, total: 425, status: "upcoming" },
  { id: "b-2", stayId: "s-2", stayName: "Eco Lagoon Retreat", hostName: "Bwere Eco Retreats", hostPhone: "+686 750 5678", hostEmail: "bookings@bwere.ki", location: "London, Kiritimati", image: "https://picsum.photos/seed/stay2/400/300", checkIn: "2026-09-01", checkOut: "2026-09-07", guests: 4, total: 1050, status: "upcoming" },
  { id: "b-3", stayId: "s-3", stayName: "Oceanview Villa", hostName: "Anere Homestays", hostPhone: "+686 750 1234", hostEmail: "anere@homestays.ki", location: "Bairiki, Tarawa", image: "https://picsum.photos/seed/stay3/400/300", checkIn: "2026-03-10", checkOut: "2026-03-15", guests: 6, total: 1000, status: "completed" },
  { id: "b-4", stayId: "s-5", stayName: "Anere Family Homestay", hostName: "Anere Homestays", hostPhone: "+686 750 1234", hostEmail: "anere@homestays.ki", location: "Buota, Tarawa", image: "https://picsum.photos/seed/stay5/400/300", checkIn: "2026-01-05", checkOut: "2026-01-08", guests: 2, total: 135, status: "completed" },
  { id: "b-5", stayId: "s-9", stayName: "Bird Island Eco Lodge", hostName: "Bwere Eco Retreats", hostPhone: "+686 750 5678", hostEmail: "bookings@bwere.ki", location: "Tebunginako, Abaiang", image: "https://picsum.photos/seed/stay9/400/300", checkIn: "2026-04-20", checkOut: "2026-04-23", guests: 3, total: 390, status: "cancelled", refundStatus: "partial" },
  { id: "b-6", stayId: "s-4", stayName: "Palm Grove Guesthouse", hostName: "Bwere Eco Retreats", hostPhone: "+686 750 5678", hostEmail: "bookings@bwere.ki", location: "Tabwakea, Kiritimati", image: "https://picsum.photos/seed/stay4/400/300", checkIn: "2026-05-01", checkOut: "2026-05-05", guests: 2, total: 240, status: "cancelled", refundStatus: "none" },
];

const TABS = [
  { key: "upcoming", label: "Upcoming Stays" },
  { key: "completed", label: "Completed Stays" },
  { key: "cancelled", label: "Canceled Stays" },
];

const HOUSE_RULES = [
  "Check-in after 2:00 PM, check-out before 11:00 AM",
  "No smoking indoors",
  "Respect quiet hours after 10:00 PM",
  "Remove shoes before entering",
  "No unregistered guests overnight",
];

function VoucherModal({
  booking,
  onClose,
}: {
  booking: BookingItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#222222]">Booking Voucher</h3>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222]">
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-[#F7F7F7] p-4">
          <div className="mb-3 flex items-center gap-3">
            <img src={booking.image} alt={booking.stayName} className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <h4 className="text-base font-bold text-[#222222]">{booking.stayName}</h4>
              <div className="flex items-center gap-1 text-xs text-[#717171]">
                <HiMapPin className="h-3 w-3" />
                {booking.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-[#717171]">Check-in</span>
              <p className="font-semibold text-[#222222]">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <span className="text-xs text-[#717171]">Check-out</span>
              <p className="font-semibold text-[#222222]">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <span className="text-xs text-[#717171]">Guests</span>
              <p className="font-semibold text-[#222222]">{booking.guests}</p>
            </div>
            <div>
              <span className="text-xs text-[#717171]">Total</span>
              <p className="font-semibold text-[#222222]">{formatCurrency(booking.total, "USD")}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold text-[#222222]">Host Contact</h4>
          <div className="flex items-center gap-3 text-sm text-[#717171]">
            <HiPhone className="h-4 w-4 text-[#FF385C]" />
            {booking.hostPhone}
          </div>
          <div className="flex items-center gap-3 text-sm text-[#717171]">
            <HiEnvelope className="h-4 w-4 text-[#FF385C]" />
            {booking.hostEmail}
          </div>
          <div className="flex items-center gap-3 text-sm text-[#717171]">
            <HiMapPin className="h-4 w-4 text-[#FF385C]" />
            <a href={`https://maps.google.com/?q=${encodeURIComponent(booking.location)}`} target="_blank" rel="noopener noreferrer" className="text-[#FF385C] hover:underline">
              Get Directions (Google Maps)
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#222222]">House Rules</h4>
          <ul className="space-y-1.5">
            {HOUSE_RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#717171]">
                <HiHome className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#FF385C]" />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-2 border-t border-[#DDDDDD] pt-4">
          <Button size="sm" className="flex-1" onClick={() => window.print()}>
            Print Voucher
          </Button>
        </div>
      </div>
    </div>
  );
}

function CancelModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: BookingItem;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const refundPercent =
    booking.status === "cancelled"
      ? 0
      : new Date(booking.checkIn).getTime() - Date.now() > 7 * 24 * 60 * 60 * 1000
        ? 100
        : 50;
  const refundAmount = (booking.total * refundPercent) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#222222]">Cancel Booking</h3>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222]">
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-[#717171]">
          Are you sure you want to cancel your stay at <span className="font-semibold text-[#222222]">{booking.stayName}</span>?
        </p>

        <div className="mb-6 rounded-xl bg-amber-50 p-4">
          <div className="mb-2 flex items-start gap-2">
            <HiShieldExclamation className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Cancellation Policy</p>
              <p className="text-xs text-amber-700">
                {refundPercent >= 100
                  ? "Free cancellation — full refund available"
                  : refundPercent >= 50
                    ? "Partial refund — 50% of total will be returned"
                    : "No refund available for this booking"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-amber-200 pt-3 text-sm">
            <span className="text-amber-800">Total paid</span>
            <span className="font-semibold text-amber-800">{formatCurrency(booking.total, "USD")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-amber-800">Refund amount</span>
            <span className="font-semibold text-green-700">{formatCurrency(refundAmount, "USD")}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            Yes, Cancel Booking
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Keep Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [voucherBooking, setVoucherBooking] = useState<BookingItem | null>(null);
  const [cancelBooking, setCancelBooking] = useState<BookingItem | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>(MOCK_BOOKINGS);

  const filtered = bookings.filter((b) => b.status === activeTab);

  const handleCancelConfirm = () => {
    if (!cancelBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelBooking.id
          ? { ...b, status: "cancelled" as const, refundStatus: "partial" as const }
          : b
      )
    );
    setCancelBooking(null);
  };

  return (
    <>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiCalendarDays className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">No {activeTab} stays</p>
          <p className="text-sm text-[#717171]">
            {activeTab === "upcoming"
              ? "Book a stay to see it here."
              : activeTab === "completed"
              ? "Your completed trips will appear here."
              : "No canceled bookings."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col overflow-hidden rounded-xl border border-[#DDDDDD] md:flex-row"
            >
              <div className="relative h-48 w-full flex-shrink-0 md:h-auto md:w-56">
                <img
                  src={booking.image}
                  alt={booking.stayName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2">
                  <Badge
                    variant={
                      booking.status === "upcoming" ? "success" :
                      booking.status === "completed" ? "primary" : "error"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase()}{booking.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div>
                  <div className="mb-1 flex items-start justify-between">
                    <Link href={`/stay/${booking.stayId}`} className="text-base font-bold text-[#222222] hover:underline">
                      {booking.stayName}
                    </Link>
                    <span className="text-sm font-bold text-[#222222]">{formatCurrency(booking.total, "USD")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#717171]">
                    <HiMapPin className="h-3 w-3" />
                    {booking.location}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[#717171]">
                    <span>{formatDate(booking.checkIn)} &ndash; {formatDate(booking.checkOut)}</span>
                    <span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#717171]">Hosted by {booking.hostName}</p>
                  {booking.status === "cancelled" && booking.refundStatus && (
                    <Badge variant="warning" className="mt-2">
                      Refund: {booking.refundStatus === "full" ? "Full" : booking.refundStatus === "partial" ? "Partial" : "None"}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<HiDocumentArrowDown className="h-3.5 w-3.5" />}
                    onClick={() => setVoucherBooking(booking)}
                  >
                    View Voucher
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<HiChatBubbleLeft className="h-3.5 w-3.5" />}>
                    Contact Host
                  </Button>
                  {booking.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<HiXCircle className="h-3.5 w-3.5" />}
                      onClick={() => setCancelBooking(booking)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  {booking.status === "completed" && (
                    <Button size="sm" variant="ghost" leftIcon={<HiCalendarDays className="h-3.5 w-3.5" />}>
                      Rebook
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" leftIcon={<HiMapPin className="h-3.5 w-3.5" />}>
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {voucherBooking && <VoucherModal booking={voucherBooking} onClose={() => setVoucherBooking(null)} />}
      {cancelBooking && <CancelModal booking={cancelBooking} onClose={() => setCancelBooking(null)} onConfirm={handleCancelConfirm} />}
    </>
  );
}