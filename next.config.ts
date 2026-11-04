import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Agar future mein Google ke digar subdomains (lh4, lh5, waghera) use hon to wildcard bhi laga sakte hain:
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      // Future Phase C: Add custom CDN hostname (e.g. cdn.islandconnects.com / Cloudflare R2 bucket)
    ],
  },
};

export default nextConfig;
