import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/src/lib/api";
import { JsonLd } from "@/src/components/atoms/JsonLd";
import StayDetailClient from "./StayDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const stay = await api.getStay(id);

  if (!stay) {
    return {
      title: "Stay Not Found",
    };
  }

  return {
    title: `${stay.name} | Island Connects Stays`,
    description: `${stay.description.slice(0, 150)}... Book local island stays and eco-lodges in ${stay.location}, Kiribati.`,
    openGraph: {
      title: `${stay.name} | Island Connects Stays`,
      description: `${stay.description.slice(0, 150)}...`,
      images: [
        {
          url: stay.images[0] || "/og-image.png",
          alt: stay.name,
        },
      ],
    },
  };
}

export default async function StayDetailPage({ params }: Props) {
  const { id } = await params;
  const stay = await api.getStay(id);

  if (!stay) {
    notFound();
  }

  const [reviews, allStays] = await Promise.all([
    api.getReviews(stay.id, "stay"),
    api.getStays({ pageSize: 20 }),
  ]);

  const relatedStays = allStays.data
    .filter((st) => st.id !== stay.id && st.type === stay.type)
    .slice(0, 8);

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": stay.name,
    "image": stay.images,
    "description": stay.description,
    "telephone": "+68621025",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": stay.location,
      "addressRegion": stay.island,
      "addressCountry": "KI",
    },
    "priceRange": `${stay.pricePerNight} AUD`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": stay.rating,
      "reviewCount": stay.reviewCount || 1,
    },
  };

  return (
    <>
      <JsonLd data={lodgingSchema} />
      <StayDetailClient
        stay={stay}
        reviews={reviews}
        relatedStays={relatedStays}
      />
    </>
  );
}
