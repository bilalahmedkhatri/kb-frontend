"use client";

import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = "md", variant = "default", children, ...props }, ref) => {
    const sizeClass = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }[size];
    const variantClass = {
      default: "bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222]",
      outline: "border border-[#DDDDDD] hover:border-[#222222] text-[#222222]",
      ghost: "hover:bg-[#F7F7F7] text-[#222222]",
    }[variant];

    return (
      <button
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          sizeClass,
          variantClass,
          className
        )}
        ref={ref}
        aria-label={label}
        title={label}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
