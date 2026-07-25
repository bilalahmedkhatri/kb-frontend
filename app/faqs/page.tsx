"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

const FAQS = [
  {
    q: "How does booking a stay or workshop work on Island Connects?",
    a: "Island Connects uses an inquiry-based reservation system tailored for Kiribati island connectivity. Submit your desired dates and guests, and our hosts confirm via WhatsApp or direct email before bank transfer processing.",
  },
  {
    q: "How are handicrafts shipped internationally?",
    a: "Artisans package items locally in South Tarawa or Kiritimati. Shipments are sent via Kiribati Post / DHL express international airfreight directly to your address.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support manual ANZ Get bank transfers, direct local island transfer, and major credit cards.",
  },
  {
    q: "How much of my purchase goes directly to the local artisan?",
    a: "100% of fair-trade handicraft proceeds minus standard platform processing commission go directly to the Kiribati artisan cooperative.",
  },
];

export default function FAQsPage() {
  return (
    <InfoLayout
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about traveling to Kiribati, purchasing authentic crafts, and platform policies."
    >
      <div className="flex flex-col gap-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="rounded-2xl border border-[var(--gray-200)] p-5 bg-[var(--gray-50)]">
            <h3 className="text-base font-bold text-[var(--ink)] mb-2">Q: {faq.q}</h3>
            <p className="text-sm text-[var(--gray-700)] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </InfoLayout>
  );
}
