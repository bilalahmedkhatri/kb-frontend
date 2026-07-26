import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Island Connects Blog",
  description: "Read stories, local cultural insights, and travel guides from the atolls of Kiribati. Explore the authentic South Pacific.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
