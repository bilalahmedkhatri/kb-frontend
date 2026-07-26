import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Fair-Trade Commitment",
  description: "Learn how Island Connects ensures direct AUD payments and fair financial returns for local master weavers and families in Kiribati's outer atolls.",
};

export default function FairTradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
