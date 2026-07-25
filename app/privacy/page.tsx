"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function PrivacyPage() {
  return (
    <InfoLayout
      title="Privacy Policy"
      subtitle="How Island Connects protects and manages your personal information."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">1. Data Collection</h2>
          <p>
            We collect personal details necessary to facilitate accommodation bookings, handicraft delivery, and WhatsApp inquiry communications. This includes your name, email, phone number, and delivery address.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">2. Data Sharing</h2>
          <p>
            Your contact information is shared solely with the relevant Kiribati homestay host or artisan seller to fulfill your request. We never sell your personal data to third parties.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
