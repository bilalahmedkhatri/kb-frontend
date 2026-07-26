import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Kiribati Islands Map",
  description: "Explore our interactive map of all atolls across the Gilbert, Line, and Phoenix groups of Kiribati. Locate eco-lodges, weavers, and local cultural guides.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
