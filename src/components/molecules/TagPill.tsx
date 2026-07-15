"use client";

import { cn } from "@/src/lib/utils";

interface TagPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagPill({ label, active, onClick, className }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-[#F7F7F7] text-[#222222] border border-[#DDDDDD]"
          : "bg-white text-[#717171] border border-transparent hover:border-[#DDDDDD]",
        className
      )}
    >
      {label}
    </button>
  );
}
