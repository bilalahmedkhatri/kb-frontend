import type { MetadataRoute } from "next";
import { products } from "@/src/data/products";
import { stays } from "@/src/data/stays";
import { guides } from "@/src/data/guides";
import { categories } from "@/src/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://islandconnects.com";

  // Static routes
  const staticRoutes = [
    "",
    "/marketplace",
    "/stays",
    "/experiences",
    "/guides",
    "/fair-trade",
    "/blog",
    "/contact",
    "/faqs",
    "/privacy",
    "/cancellations",
    "/careers",
    "/map",
    "/login",
    "/signup",
    "/forgot-password",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/marketplace" || route === "/stays" || route === "/experiences") 
      ? "weekly" as const 
      : "monthly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/login") || route.startsWith("/signup") ? 0.3 : 0.7,
  }));

  // Dynamic product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic stay routes
  const stayRoutes = stays.map((stay) => ({
    url: `${baseUrl}/stay/${stay.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic guide routes
  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...stayRoutes,
    ...guideRoutes,
    ...categoryRoutes,
  ];
}
