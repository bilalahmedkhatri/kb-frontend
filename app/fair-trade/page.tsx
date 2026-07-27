import type { Metadata } from "next";
import { InfoLayout } from "@/src/components/templates/InfoLayout";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";

export const metadata: Metadata = {
  title: "Fair Trade Commitment | Island Connects",
  description: "Ensuring direct, ethical financial returns for Kiribati island craftswomen, master weavers, and outer atoll families.",
};
import { HiShieldCheck, HiGlobeAmericas, HiCurrencyDollar } from "react-icons/hi2";
import { GiPolarStar } from "react-icons/gi";

export default function FairTradePage() {
  return (
    <InfoLayout
      title="100% Artisan Fair-Trade Commitment"
      subtitle="Ensuring direct, ethical financial returns for Pacific island craftswomen, master weavers, and outer atoll families."
    >
      <div className="flex flex-col gap-8 text-sm text-[var(--gray-700)] leading-relaxed">
        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
              <HiCurrencyDollar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">100% Direct to Weaver</h3>
            <p className="text-xs text-[var(--gray-700)]">
              Artisans receive 100% of their stated listing price. We never squeeze craftswomen on margins or take hidden deductions.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-[var(--rausch)]">
              <HiGlobeAmericas className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">14 Outer Atolls Served</h3>
            <p className="text-xs text-[var(--gray-700)]">
              From Abaiang to Kiritimati, our platform bridges remote Pacific islands directly to conscious travelers and global collectors.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <GiPolarStar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">Handmade Provenance</h3>
            <p className="text-xs text-[var(--gray-700)]">
              Every fine mat, basket, and shell carving is verified authentic, natural, and woven using traditional ancestral methods.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <HiShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">AUD Currency & Bank Direct</h3>
            <p className="text-xs text-[var(--gray-700)]">
              All transactions use AUD (Australian Dollar) via direct ANZ Kiribati bank transfer, eliminating currency loss for locals.
            </p>
          </div>
        </div>

        {/* Transparent Price Breakdown Section */}
        <section className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6 sm:p-8">
          <h2 className="mb-2 text-lg font-bold text-teal-950">How Our Transparent Pricing Works</h2>
          <p className="mb-6 text-xs text-teal-900 leading-relaxed">
            Unlike traditional export intermediaries who mark up Pacific crafts by 200–300%, Island Connects maintains complete pricing clarity between buyer and creator.
          </p>

          <div className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-teal-100 bg-teal-50 text-teal-950 font-bold">
                <tr>
                  <th className="p-3.5">Price Component</th>
                  <th className="p-3.5">Who Receives It</th>
                  <th className="p-3.5 text-right">Example ($120 AUD Woven Mat)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-50 text-[var(--ink)]">
                <tr>
                  <td className="p-3.5 font-semibold">Artisan Asking Price</td>
                  <td className="p-3.5 text-teal-800 font-medium">Teberia Aritiera (Master Weaver)</td>
                  <td className="p-3.5 text-right font-bold text-teal-800">$120.00 AUD (100%)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Platform Commission (e.g. 5%)</td>
                  <td className="p-3.5 text-[var(--gray-500)]">Island Connects (Server & Support)</td>
                  <td className="p-3.5 text-right text-[var(--gray-700)]">$6.00 AUD</td>
                </tr>
                <tr className="bg-teal-50/40 font-bold">
                  <td className="p-3.5">Total Traveler Checkout Price</td>
                  <td className="p-3.5">Combined Direct Transfer</td>
                  <td className="p-3.5 text-right text-[var(--ink)]">$126.00 AUD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Community Story Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[var(--ink)]">Why Outer Island Fair-Trade Matters</h2>
          <p>
            In the remote Gilbert and Line Islands, weaving fine pandanus mats (<em>kie n Kiribati</em>) is more than a cultural art form-it is often a family&apos;s primary source of cash income for school fees, solar lanterns, and inter-island transport.
          </p>
          <p>
            By booking through Island Connects, you ensure that every dollar directly empowers Kiribati craftswomen to pass on their ancestral weaving knowledge to the next generation without leaving their lagoon villages.
          </p>
        </section>

        {/* Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">Explore Authentically Handcrafted Items</h3>
            <p className="text-xs text-[var(--gray-700)]">
              Browse fine mats, seashell jewelry, and coconut wood carvings from our verified artisans.
            </p>
          </div>
          <Link href="/marketplace">
            <Button variant="primary" size="md" rightIcon={<GiPolarStar className="h-4 w-4" />}>
              Shop Fair-Trade Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </InfoLayout>
  );
}
