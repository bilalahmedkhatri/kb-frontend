"use client";

import { HiMinus, HiPlus } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, className }: QuantityStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] transition-colors hover:border-[#222222] disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <HiMinus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[2ch] text-center text-sm font-semibold text-[#222222]">{value}</span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDDDDD] text-[#222222] transition-colors hover:border-[#222222] disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <HiPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
