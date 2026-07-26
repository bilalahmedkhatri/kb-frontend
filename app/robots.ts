import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/vendor/",
        "/account/",
        "/checkout/",
        "/cart/",
        "/forgot-password/",
        "/reset-password/",
      ],
    },
    sitemap: "https://islandconnects.com/sitemap.xml",
  };
}
