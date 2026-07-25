"use client";

import { usePathname } from "next/navigation";
import { VendorLayout } from "@/src/components/templates/VendorLayout";

export default function VendorRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() || "dashboard";
  const activeTab = segment === "store-settings" ? "settings" : segment;

  return <VendorLayout activeTab={activeTab}>{children}</VendorLayout>;
}
