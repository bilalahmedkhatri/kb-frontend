import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/src/lib/api";
import { JsonLd } from "@/src/components/atoms/JsonLd";
import GuideDetailClient from "./GuideDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await api.getGuide(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: `${guide.title} | Island Connects Guides`,
    description: `${guide.excerpt} Learn about Kiribati culture, food, history, and adventure.`,
    openGraph: {
      title: `${guide.title} | Island Connects Guides`,
      description: guide.excerpt,
      images: [
        {
          url: guide.image || "/og-image.png",
          alt: guide.title,
        },
      ],
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await api.getGuide(slug);

  if (!guide) {
    notFound();
  }

  const all = await api.getGuides({ pageSize: 20 });
  const relatedGuides = all.data
    .filter((g) => g.topic === guide.topic && g.slug !== slug)
    .slice(0, 4);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "image": [guide.image],
    "datePublished": guide.publishedAt,
    "dateModified": guide.publishedAt,
    "author": {
      "@type": "Person",
      "name": guide.authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Island Connects",
      "logo": {
        "@type": "ImageObject",
        "url": "https://islandconnects.com/favicon.png",
      },
    },
    "description": guide.excerpt,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <GuideDetailClient
        guide={guide}
        relatedGuides={relatedGuides}
      />
    </>
  );
}
