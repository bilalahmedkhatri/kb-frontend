"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function AboutPage() {
  return (
    <InfoLayout
      title="About Island Connects"
      subtitle="Empowering local Kiribati communities through sustainable eco-tourism, cultural preservation, and fair-trade artisanal commerce."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Our Mission</h2>
          <p>
            Kiribati is a peaceful Pacific nation comprised of 33 coral atolls. Island Connects (`islandconnects.com`) was created to bridge remote island artisans, homestays, and culture guides directly with global travelers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Preserving Kiribati Heritage</h2>
          <p>
            From ancient pandanus weaving techniques passed down through generations to traditional maneaba community gatherings, we celebrate and protect the rich Pacific heritage of Kiribati.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
