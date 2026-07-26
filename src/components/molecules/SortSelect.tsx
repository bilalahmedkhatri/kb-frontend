"use client";

import { HiChevronDown } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export function SortSelect({ value, onChange, options, className }: SortSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="whitespace-nowrap text-sm text-[#717171]">Sort by:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-[#DDDDDD] bg-white py-2 pl-3 pr-9 text-sm text-[#222222] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#222222]">
          <HiChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
