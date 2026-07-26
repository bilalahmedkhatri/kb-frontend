"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/src/components/atoms/Badge";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { formatDate } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { HiClock, HiUser } from "react-icons/hi2";
import type { Guide } from "@/src/types";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [guide, setGuide] = useState<Guide | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const g = await api.getGuide(slug);
        if (!g) return;
        setGuide(g);

        const all = await api.getGuides({ pageSize: 20 });
        setRelatedGuides(
          all.data.filter((guide) => guide.topic === g.topic && guide.slug !== slug).slice(0, 4)
        );
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading || !guide) {
    return (
      <div className="container-app py-8">
        <Skeleton variant="rectangular" className="h-72 w-full rounded-xl" />
        <div className="mx-auto mt-8 max-w-3xl">
          <Skeleton className="mb-4 h-10 w-3/4" />
          <Skeleton className="mb-2 h-4 w-1/3" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const contentParagraphs = guide.content.split("\n").filter(Boolean);

  return (
    <div className="container-app py-8">
      <div className="relative mb-8 h-72 overflow-hidden rounded-xl md:h-96">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Badge variant="primary">{guide.topic}</Badge>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight text-[#222222] md:text-4xl">
          {guide.title}
        </h1>

        <div className="mb-8 flex items-center gap-4 text-sm text-[#717171]">
          <span className="flex items-center gap-1.5">
            <HiUser className="h-4 w-4" />
            {guide.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <HiClock className="h-4 w-4" />
            {guide.readTime} min read
          </span>
          <span>{formatDate(guide.publishedAt)}</span>
        </div>

        <div className="flex flex-col gap-5 text-base leading-relaxed text-[#717171]">
          {contentParagraphs.length > 0 ? (
            contentParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p>{guide.content}</p>
          )}
        </div>

        <div className="mt-12 rounded-xl border border-[#DDDDDD] p-6">
          <div className="flex items-center gap-4">
            <Avatar name={guide.authorName} size="lg" />
            <div>
              <h3 className="text-sm font-semibold text-[#222222]">{guide.authorName}</h3>
              <p className="text-sm text-[#717171]">Author</p>
            </div>
          </div>
        </div>
      </article>

      {relatedGuides.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-[#222222]">
            More {guide.topic} Guides
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedGuides.map((related) => (
              <a
                key={related.id}
                href={`/guides/${related.slug}`}
                className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl bg-[#F7F7F7]"
              >
                <Image
                  src={related.image}
                  alt={related.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#222222] backdrop-blur-sm">
                  {related.topic}
                </span>
                <div className="relative z-10 mt-auto p-4 text-white">
                  <h3 className="text-base font-bold leading-tight">{related.title}</h3>
                  <p className="mt-1 text-xs text-white/70">{related.readTime} min read</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
