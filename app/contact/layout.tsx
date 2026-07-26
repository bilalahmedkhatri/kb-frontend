import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Island Connects team. Contact us for inquiries about bookings, handicrafts, or partnerships.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
