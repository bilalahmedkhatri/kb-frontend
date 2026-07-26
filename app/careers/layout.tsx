import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Island Connects",
  description: "Join our team in bridging Pacific island artisans with the global digital economy. Explore open positions in technology, operations, and cultural outreach.",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
