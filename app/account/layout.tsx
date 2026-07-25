"use client";

import { usePathname } from "next/navigation";
import { AccountLayout } from "@/src/components/templates/AccountLayout";

export default function AccountRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments.length >= 2 ? segments[1] : "profile";

  return <AccountLayout activeTab={activeTab}>{children}</AccountLayout>;
}
