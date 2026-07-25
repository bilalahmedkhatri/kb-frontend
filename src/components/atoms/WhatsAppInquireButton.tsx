"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/src/lib/utils";

interface WhatsAppInquireButtonProps {
  phoneNumber?: string;
  itemTitle?: string;
  itemType?: "stay" | "handicraft" | "experience";
  variant?: "floating" | "inline";
  className?: string;
}

export function WhatsAppInquireButton({
  phoneNumber = "+68673000000",
  itemTitle = "Kiribati Listing",
  itemType = "stay",
  variant = "floating",
  className,
}: WhatsAppInquireButtonProps) {
  const message = encodeURIComponent(
    `Hello Island Connects! I'm inquiring about booking/purchasing: ${itemTitle} (${itemType}).`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;

  if (variant === "inline") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-md active:scale-98",
          className
        )}
      >
        <FaWhatsapp className="h-5 w-5" />
        <span>Inquire via WhatsApp</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Quick WhatsApp Inquiry"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-emerald-600 focus:outline-hidden focus:ring-4 focus:ring-emerald-300 active:scale-95",
        className
      )}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}
