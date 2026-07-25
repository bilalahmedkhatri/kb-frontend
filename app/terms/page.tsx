"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function TermsPage() {
  return (
    <InfoLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing the use of Island Connects."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">1. Booking Agreement</h2>
          <p>
            By submitting an inquiry or reservation on Island Connects, you agree to abide by the individual host rules and cancellation terms set forth for each property or experience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">2. Marketplace Transactions</h2>
          <p>
            All products listed on the platform are handcrafted in Kiribati. Minor variations in texture, color, and size are a natural hallmark of authentic handmade goods.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
