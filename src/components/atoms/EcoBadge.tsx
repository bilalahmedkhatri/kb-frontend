"use client";

import React from "react";
import { HiSparkles, HiShieldCheck, HiSun, HiGlobeAmericas } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

export type BadgeType = "eco" | "certified" | "solar" | "fairtrade" | "handmade";

interface EcoBadgeProps {
  type: BadgeType;
  label?: string;
  className?: string;
}

const badgeConfig: Record<BadgeType, { defaultLabel: string; icon: React.ReactNode; bgClass: string; textClass: string }> = {
  eco: {
    defaultLabel: "100% Local Fiber",
    icon: <HiSparkles className="h-3.5 w-3.5 text-emerald-600" />,
    bgClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-800",
  },
  certified: {
    defaultLabel: "Verified Island Artisan",
    icon: <HiShieldCheck className="h-3.5 w-3.5 text-teal-600" />,
    bgClass: "bg-teal-50 border-teal-200",
    textClass: "text-teal-800",
  },
  solar: {
    defaultLabel: "Solar Powered",
    icon: <HiSun className="h-3.5 w-3.5 text-amber-600" />,
    bgClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-800",
  },
  fairtrade: {
    defaultLabel: "Direct Fair-Trade",
    icon: <HiGlobeAmericas className="h-3.5 w-3.5 text-cyan-600" />,
    bgClass: "bg-cyan-50 border-cyan-200",
    textClass: "text-cyan-800",
  },
  handmade: {
    defaultLabel: "Handcrafted in Kiribati",
    icon: <HiSparkles className="h-3.5 w-3.5 text-rose-600" />,
    bgClass: "bg-rose-50 border-rose-200",
    textClass: "text-rose-800",
  },
};

export function EcoBadge({ type, label, className }: EcoBadgeProps) {
  const config = badgeConfig[type] || badgeConfig.eco;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-2xs transition-all hover:scale-105",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      {config.icon}
      <span>{displayLabel}</span>
    </span>
  );
}
