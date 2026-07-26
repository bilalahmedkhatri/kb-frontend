import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/src/components/organisms/Header";
import { Footer } from "@/src/components/organisms/Footer";
import { CartDrawer } from "@/src/components/organisms/CartDrawer";
import { WhatsAppInquireButton } from "@/src/components/atoms/WhatsAppInquireButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://islandconnects.com"),
  title: {
    default: "Island Connects — Kiribati Stays, Handicrafts & Experiences",
    template: "%s | Island Connects",
  },
  description:
    "Explore the authentic beauty of Kiribati Islands. Book homestays, shop handmade pandanus crafts, and experience local artisan workshops.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Island Connects — Kiribati Stays, Handicrafts & Experiences",
    description: "Explore the authentic beauty of Kiribati Islands. Book homestays, shop handmade pandanus crafts, and experience local artisan workshops.",
    url: "https://islandconnects.com",
    siteName: "Island Connects",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Island Connects - Kiribati Stays, Handicrafts & Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Island Connects — Kiribati Stays, Handicrafts & Experiences",
    description: "Explore the authentic beauty of Kiribati Islands. Book homestays, shop handmade pandanus crafts, and experience local artisan workshops.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full font-sans antialiased">
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppInquireButton variant="floating" />
        </Providers>
      </body>
    </html>
  );
}
