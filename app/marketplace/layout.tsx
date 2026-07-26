import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handmade Kiribati Handicrafts Marketplace",
  description: "Shop authentic Kiribati crafts directly from outer island weavers and artisans. Handwoven pandanus baskets, shell necklaces, and traditional fine mats.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
