import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to frequently asked questions about booking stays, shipping handicrafts, payments, and artisan payouts on Island Connects Kiribati.",
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
