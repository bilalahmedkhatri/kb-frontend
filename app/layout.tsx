import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/src/components/organisms/Header";
import { Footer } from "@/src/components/organisms/Footer";
import { CartDrawer } from "@/src/components/organisms/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kiribati Islands — Discover, Shop, Stay",
  description:
    "Explore the beauty of Kiribati. Book authentic homestays, shop handmade crafts, and read cultural guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
