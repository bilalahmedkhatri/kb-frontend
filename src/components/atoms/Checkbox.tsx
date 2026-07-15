"use client";

import { cn } from "@/src/lib/utils";
import { HiCheck } from "react-icons/hi2";

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
  className?: string;
}

export function Checkbox({ id, label, checked, onChange, count, className }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-3 py-1", className)}>
      <div
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-[#222222] bg-[#222222]"
            : "border-[#DDDDDD] bg-white hover:border-[#717171]"
        }`}
      >
        {checked && <HiCheck className="h-3.5 w-3.5 text-white" />}
      </div>
      <span className="flex-1 text-sm text-[#222222]">{label}</span>
      {count !== undefined && (
        <span className="text-sm text-[#717171]">({count})</span>
      )}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
