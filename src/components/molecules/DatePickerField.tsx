"use client";

import { HiCalendarDays } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DatePickerField({ label, value, onChange, className }: DatePickerFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-[#222222]">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#717171]">
          <HiCalendarDays className="h-5 w-5" />
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[#DDDDDD] bg-white py-2.5 pl-10 pr-4 text-sm text-[#222222] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
        />
      </div>
    </div>
  );
}
