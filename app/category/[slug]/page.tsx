import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/src/lib/api";
import { JsonLd } from "@/src/components/atoms/JsonLd";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await api.getCategories("product");
  const category = cats.find((c) => c.slug === slug);

  const titleName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${titleName} Handicrafts & Products | Island Connects`,
    description: `Browse authentic Kiribati ${titleName.toLowerCase()} handcrafted by island artisans. Direct fair-trade support for Kiribati outer atoll weavers and crafters.`,
    openGraph: {
      title: `${titleName} Handicrafts & Products | Island Connects`,
      description: `Browse authentic Kiribati ${titleName.toLowerCase()} handcrafted by island artisans.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [allCategories, initialProducts] = await Promise.all([
    api.getCategories("product"),
    api.getProducts({
      page: 1,
      pageSize: 12,
      filters: { categories: [slug], sort: "newest" },
    }),
  ]);

  const category = allCategories.find((c) => c.slug === slug) || null;

  if (!category) {
    notFound();
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.name} Handicrafts`,
    "description": `Handcrafted ${category.name} from Kiribati artisans`,
    "itemListElement": initialProducts.data.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "url": `https://islandconnects.com/product/${product.id}`,
        "image": product.images[0],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": product.price,
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <CategoryClient
        slug={slug}
        category={category}
        allCategories={allCategories}
        initialProducts={initialProducts}
      />
    </>
  );
}
