"use client";

import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[#222222]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#717171]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              leftIcon && "pl-10",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
