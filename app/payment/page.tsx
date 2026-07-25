"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function PaymentPage() {
  return (
    <InfoLayout
      title="Payment Methods & ANZ Bank Transfer"
      subtitle="How payments work for bookings and craft purchases in Kiribati."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-2">ANZ Bank Transfer (Recommended)</h2>
          <p className="mb-4">
            For local island transactions, we support direct ANZ Kiribati bank transfers. Detailed account credentials and payment reference IDs are generated during checkout.
          </p>
          <div className="rounded-xl bg-white p-4 border border-blue-200 text-xs font-mono">
            <p><strong>Bank Name:</strong> ANZ Bank (Kiribati) Ltd</p>
            <p><strong>Account Name:</strong> Island Connects Marketplace</p>
            <p><strong>Currency:</strong> AUD (Australian Dollar)</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Credit / Debit Cards</h2>
          <p>
            We accept Visa and MasterCard online. All prices are billed in Australian Dollars (AUD).
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
