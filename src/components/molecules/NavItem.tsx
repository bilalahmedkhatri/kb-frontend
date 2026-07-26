"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface NavItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function NavItem({ label, href, isActive, icon, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
        isActive
          ? "font-semibold text-[#222222] underline underline-offset-4"
          : "font-medium text-[#717171] hover:text-[#222222]"
      )}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {label}
    </Link>
  );
}
