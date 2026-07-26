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
      // Future Phase C: Add custom CDN hostname (e.g. cdn.islandconnects.com / Cloudflare R2 bucket)
    ],
  },
};

export default nextConfig;
