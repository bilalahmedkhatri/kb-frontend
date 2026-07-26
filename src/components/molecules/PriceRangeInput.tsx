"use client";

import { cn } from "@/src/lib/utils";

interface PriceRangeInputProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function PriceRangeInput({ min, max, value, onChange, className }: PriceRangeInputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-[#222222]">Price range</span>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-[#717171]">Min</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-[#717171]">
              $
            </span>
            <input
              type="number"
              value={value[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= min && v <= value[1]) onChange([v, value[1]]);
              }}
              min={min}
              max={value[1]}
              className="w-full rounded-lg border border-[#DDDDDD] bg-white py-2 pl-7 pr-3 text-sm text-[#222222] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
            />
          </div>
        </div>
        <span className="mt-5 text-[#717171]">—</span>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-[#717171]">Max</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-[#717171]">
              $
            </span>
            <input
              type="number"
              value={value[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= value[0] && v <= max) onChange([value[0], v]);
              }}
              min={value[0]}
              max={max}
              className="w-full rounded-lg border border-[#DDDDDD] bg-white py-2 pl-7 pr-3 text-sm text-[#222222] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
