"use client";

import { InfoLayout } from "@/src/components/templates/InfoLayout";

export default function CancellationsPage() {
  return (
    <InfoLayout
      title="Cancellations & Refund Policy"
      subtitle="Clear, fair policies designed for remote island accommodation bookings and handmade craft orders."
    >
      <div className="flex flex-col gap-6 text-sm text-[var(--gray-700)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Homestay & Eco-Lodge Bookings</h2>
          <p>
            Cancellations made 48 hours or more prior to the scheduled check-in date receive a 100% full refund minus bank processing fees. Cancellations within 48 hours are subject to a 1-night stay fee to support local island hosts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Artisan Workshop Experiences</h2>
          <p>
            Workshops can be rescheduled or cancelled up to 24 hours in advance at no cost.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Handicraft Orders</h2>
          <p>
            Due to the custom handmade nature of woven pandanus mats and carvings, orders can only be cancelled prior to dispatch. Damaged shipments are eligible for replacement or full refund.
          </p>
        </section>
      </div>
    </InfoLayout>
  );
}
