"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { formatCurrency } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { HiCheckCircle, HiMapPin } from "react-icons/hi2";
import type { Stay } from "@/src/types";

export default function BookingConfirmationPage() {
  const params = useParams();
  const stayId = typeof params.id === "string" ? params.id : "";

  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    setReferenceNumber(`KBB-${Date.now().toString(36).toUpperCase()}`);
    async function load() {
      try {
        const data = await api.getStay(stayId);
        setStay(data || null);
      } catch {
        setStay(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [stayId]);

  if (loading) {
    return (
      <div className="container-app flex flex-col items-center justify-center py-20">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-4 h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="container-app flex flex-col items-center justify-center py-20">
      <HiCheckCircle className="mb-4 h-20 w-20 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold text-[#222222]">Inquiry Sent!</h1>
      <p className="mb-2 max-w-md text-center text-sm text-[#717171]">
        Your inquiry has been sent to the host. You will receive a response
        within 24 hours.
      </p>
      {referenceNumber && (
        <p className="mb-8 text-sm text-[#717171]">
          Reference:{" "}
          <span className="font-semibold text-[#222222]">{referenceNumber}</span>
        </p>
      )}

      {stay && (
        <div className="mb-8 w-full max-w-md rounded-xl border border-[#DDDDDD] p-4">
          <div className="flex items-center gap-3">
            <Image
              src={stay.images[0] || "/placeholder.svg"}
              alt={stay.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-[#222222]">{stay.name}</p>
              <div className="flex items-center gap-1 text-xs text-[#717171]">
                <HiMapPin className="h-3 w-3" />
                <span>{stay.location}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="primary" className="capitalize text-[10px]">
                  {stay.type}
                </Badge>
                <span className="text-xs font-medium text-[#222222]">
                  {formatCurrency(stay.pricePerNight)} / night
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Link href="/category/homestays">
        <Button>Back to Stays</Button>
      </Link>
    </div>
  );
}
