import type { Metadata } from "next";
import { InfoLayout } from "@/src/components/templates/InfoLayout";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/atoms/Button";

export const metadata: Metadata = {
  title: "Island Blog — Stories & Culture from Kiribati | Island Connects",
  description: "Explore articles, travel guides, culture, and artisan stories from across Kiribati.",
};
import { HiClock, HiArrowRight } from "react-icons/hi2";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  readTime: string;
  date: string;
  image: string;
}

const featuredArticle: Article = {
  id: "feat-1",
  slug: "bonefishing-kiritimati",
  title: "Lagoon Bonefishing & Outer Atoll Conservation on Kiritimati Island",
  excerpt:
    "How local fly-fishing guides on Kiritimati (Christmas Island) combine world-class saltwater angling with sustainable reef conservation and community-run eco-lodges.",
  category: "Eco-Travel & Conservation",
  author: {
    name: "Teken Tokatake",
    role: "Senior Island Guide",
  },
  readTime: "6 min read",
  date: "July 24, 2026",
  image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
};

const articles: Article[] = [
  {
    id: "art-1",
    slug: "maneaba-etiquette",
    title: "Sacred Spaces: Maneaba Architecture & Village Etiquette",
    excerpt: "The traditional Maneaba is the heart of Kiribati village governance and storytelling. Here is what conscious visitors should know before entering.",
    category: "Island Culture",
    author: { name: "Nei Kairiti", role: "Cultural Historian" },
    readTime: "4 min read",
    date: "July 18, 2026",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art-2",
    slug: "pandanus-weaving-secrets",
    title: "The Golden Leaf: How Kiribati Craftswomen Process Pandanus",
    excerpt: "From salt-water boiling to sun-bleaching on lagoon beaches, discover the multi-week preparation behind every woven fine mat and basket.",
    category: "Artisan Craft",
    author: { name: "Teberia Aritiera", role: "Master Weaver" },
    readTime: "5 min read",
    date: "July 12, 2026",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art-3",
    slug: "tarawa-ww2-heritage",
    title: "Echoes of the Pacific: Exploring Betio's Historic WWII Sites",
    excerpt: "A respectful historical guide to the preserved coastal defenses, peace memorials, and guided walking tours across South Tarawa.",
    category: "History & Heritage",
    author: { name: "Ioteba Bwene", role: "Heritage Guide" },
    readTime: "7 min read",
    date: "July 05, 2026",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art-4",
    slug: "gilbert-islands-canoe",
    title: "Sailing with the Wind: The Design of Kiribati Outrigger Canoes",
    excerpt: "Why the traditional Pacific outrigger remains one of the fastest and most elegant vessels ever engineered by island navigators.",
    category: "Maritime Traditions",
    author: { name: "Teken Tokatake", role: "Senior Island Guide" },
    readTime: "5 min read",
    date: "June 28, 2026",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <InfoLayout
      title="Kiribati Cultural Magazine & Blog"
      subtitle="Authentic island stories, traveler guides, and heritage spotlights curated by local Kiribati authors and master craftswomen."
    >
      <div className="flex flex-col gap-10">
        {/* Featured Article Hero Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-[var(--gray-200)] bg-[var(--gray-50)] shadow-xs transition-all hover:shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[var(--rausch)] px-3 py-1 text-xs font-bold text-white shadow-xs">
                Featured Spotlight
              </span>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--babu)]">
                  <span>{featuredArticle.category}</span>
                  <span>•</span>
                  <span>{featuredArticle.date}</span>
                </div>
                <h2 className="mb-3 text-xl font-bold text-[var(--ink)] sm:text-2xl group-hover:text-[var(--rausch)] transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="mb-6 text-sm text-[var(--gray-700)] leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--gray-200)] pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-white">
                    {featuredArticle.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--ink)]">{featuredArticle.author.name}</p>
                    <p className="text-[11px] text-[var(--gray-500)]">{featuredArticle.author.role}</p>
                  </div>
                </div>
                <Link href={`/guides/${featuredArticle.slug}`}>
                  <Button variant="primary" size="sm" rightIcon={<HiArrowRight className="h-4 w-4" />}>
                    Read Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles Grid */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-[var(--ink)]">Recent Island Stories & Guides</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {articles.map((art) => (
              <div
                key={art.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[var(--ink)] shadow-xs">
                    {art.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-[var(--gray-500)]">
                      <span className="flex items-center gap-1">
                        <HiClock className="h-3.5 w-3.5" />
                        {art.readTime}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[var(--ink)] group-hover:text-[var(--rausch)] transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="mb-4 text-xs text-[var(--gray-700)] leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--gray-200)] pt-3 mt-auto">
                    <span className="text-xs font-semibold text-[var(--ink)]">
                      By {art.author.name}
                    </span>
                    <Link
                      href={`/guides/${art.slug}`}
                      className="flex items-center gap-1 text-xs font-bold text-[var(--rausch)] transition-colors hover:text-[#E31C5F]"
                    >
                      Read
                      <HiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer Banner */}
        <div className="rounded-2xl bg-[var(--ink)] p-8 text-center text-white">
          <h3 className="mb-2 text-xl font-bold">Have a Kiribati Story to Share?</h3>
          <p className="mx-auto mb-6 max-w-md text-xs text-white/80 leading-relaxed">
            We actively commission articles and cultural essays from Kiribati historians, lagoon guides, and local residents.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="md">
              Pitch a Story to Island Connects
            </Button>
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}
