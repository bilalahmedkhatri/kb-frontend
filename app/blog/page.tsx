"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";

export default function BlogPage() {
  return (
    <InfoLayout
      title="Blog & Articles"
      subtitle="Stories, travel tips, and cultural insights from the Kiribati archipelago."
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-[var(--gray-200)] p-6 bg-[var(--gray-50)]">
          <h2 className="text-xl font-bold text-[var(--ink)] mb-2">Explore Our Cultural Magazine</h2>
          <p className="text-sm text-[var(--gray-700)] mb-4">
            Read in-depth feature stories on Kiribati history, lagoon bonefishing, maneaba etiquette, and artisan weaver spotlights in our Guides section.
          </p>
          <Link href="/guides">
            <Button variant="primary">Browse All Cultural Guides →</Button>
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}
