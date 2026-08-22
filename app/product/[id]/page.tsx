import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/src/lib/api";
import { JsonLd } from "@/src/components/atoms/JsonLd";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await api.getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Island Connects Marketplace`,
    description: `${product.description.slice(0, 150)}... Handcrafted in ${product.origin}, Kiribati by local artisans.`,
    openGraph: {
      title: `${product.name} | Island Connects Marketplace`,
      description: `${product.description.slice(0, 150)}...`,
      images: [
        {
          url: product.images[0] || "/og-image.png",
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await api.getProduct(id);

  if (!product) {
    notFound();
  }

  let reviewsError = false;
  let relatedError = false;

  const [reviews, relatedRes, vendor] = await Promise.all([
    api.getReviews(product.id, "product").catch((err) => {
      console.error(`Failed to load reviews for product ${product.id}:`, err);
      reviewsError = true;
      return [];
    }),
    api.getProducts({
      pageSize: 8,
      filters: { categories: [product.category] },
    }).catch((err) => {
      console.error(`Failed to load related products for category ${product.category}:`, err);
      relatedError = true;
      return { data: [], total: 0, page: 1, totalPages: 1, hasMore: false };
    }),
    api.getVendor(product.vendorId).catch((err) => {
      console.error(`Failed to load vendor ${product.vendorId}:`, err);
      return null;
    }),
  ]);

  const relatedProducts = relatedRes.data.filter((p) => p.id !== product.id);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://islandconnects.com/product/${product.id}`,
      "priceCurrency": "AUD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    "brand": {
      "@type": "Brand",
      "name": "Island Connects",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1,
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient
        product={product}
        reviews={reviews}
        reviewsError={reviewsError}
        relatedProducts={relatedProducts}
        relatedError={relatedError}
        vendor={vendor}
      />
    </>
  );
}

