"use client";

import { usePathname } from "next/navigation";
import { VendorLayout } from "@/src/components/templates/VendorLayout";

export default function VendorRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  let activeTab = "dashboard";
  if (pathname.includes("/vendor/products")) {
    activeTab = "products";
  } else if (pathname.includes("/vendor/orders")) {
    activeTab = "orders";
  } else if (pathname.includes("/vendor/store-settings")) {
    activeTab = "store-settings";
  }

  return <VendorLayout activeTab={activeTab}>{children}</VendorLayout>;
}
