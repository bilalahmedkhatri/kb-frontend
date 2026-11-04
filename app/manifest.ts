import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Island Connects - Kiribati Stays, Handicrafts & Experiences",
    short_name: "Island Connects",
    description:
      "Explore authentic Kiribati. Book atoll homestays, shop handmade pandanus crafts, and connect directly with local master artisans.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FF385C",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

