"use client";

import React from "react";
import {
  HiSparkles,
  HiShoppingBag,
  HiScissors,
  HiCube,
  HiGlobeAmericas,
  HiHome,
  HiBuildingStorefront,
  HiAcademicCap,
  HiSun,
  HiBookOpen,
  HiMap,
  HiTag,
  HiSquares2X2,
} from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

interface CategoryIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HiSparkles,
  HiShoppingBag,
  HiScissors,
  HiCube,
  HiGlobeAmericas,
  HiHome,
  HiBuildingStorefront,
  HiAcademicCap,
  HiSun,
  HiBookOpen,
  HiMap,
  HiSquares2X2,
};

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const IconComponent = iconMap[name] || HiTag;
  return <IconComponent className={cn("h-5 w-5", className)} />;
}
