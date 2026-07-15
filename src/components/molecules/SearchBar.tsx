"use client";

import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search...", className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#717171]">
        <HiMagnifyingGlass className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#DDDDDD] bg-white py-3 pl-11 pr-11 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#717171] hover:text-[#222222]"
          aria-label="Clear search"
        >
          <HiXMark className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
