import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of Island Connects Kiribati. Learn how we handle your personal information and direct communication.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
