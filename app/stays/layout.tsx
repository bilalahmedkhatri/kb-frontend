import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiribati Island Stays & Eco-Lodges",
  description: "Book authentic eco-lodges, homestays, and guesthouses in the Kiribati islands. Experience traditional South Pacific hospitality first hand.",
};

export default function StaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
