"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function FairTradePage() {
  return (
    <InfoLayout
      title="100% Artisan Fair-Trade Commitment"
      subtitle="Ensuring direct, ethical financial returns for Pacific island craftswomen and families."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section className="rounded-2xl bg-teal-50 border border-teal-200 p-6">
          <h2 className="text-lg font-bold text-teal-950 mb-2">Direct Island Impact</h2>
          <p>
            Traditional craft making in Kiribati—such as pandanus leaf mats, coconut shell carvings, and seashell necklaces—is the primary source of income for women in remote outer islands.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Transparent Pricing</h2>
          <p>
            Island Connects guarantees that 100% of the artisan's asking price goes straight to the weaver or creator. Platform operations are sustained through a small, owner-configured commission fee set via our admin dashboard.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
