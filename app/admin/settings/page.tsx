"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiCurrencyDollar, HiCheck, HiArrowLeft, HiCog6Tooth } from "react-icons/hi2";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState<number>(12);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sampleBookingAmount = 100;
  const platformRevenue = (sampleBookingAmount * commissionRate) / 100;
  const vendorPayout = sampleBookingAmount - platformRevenue;

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gray-500)] hover:text-[var(--ink)] mb-2">
            <HiArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
            <HiCog6Tooth className="h-6 w-6 text-[var(--rausch)]" /> Platform Settings & Monetization
          </h1>
          <p className="text-xs text-[var(--gray-500)]">Configure global commission rates and platform monetization rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <form onSubmit={handleSave} className="rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Global Booking Commission Rate</h2>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--gray-700)] mb-1">
                Commission Rate Percentage (%)
              </label>
              <div className="relative flex items-center">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="pr-8"
                />
                <span className="absolute right-3 text-sm font-bold text-[var(--gray-500)]">%</span>
              </div>
              <p className="mt-1.5 text-xs text-[var(--gray-500)]">
                This percentage is deducted from all stay bookings, handicraft sales, and artisan experience reservations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" type="submit">
                Save Platform Settings
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <HiCheck className="h-4 w-4" /> Commission settings updated!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Live Projection Box */}
        <div className="md:col-span-5">
          <div className="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--babu)] mb-3 flex items-center gap-1">
              <HiCurrencyDollar className="h-4 w-4" /> Live Revenue Split Projection
            </h3>
            
            <p className="text-xs text-[var(--gray-700)] mb-4">
              Below is an example breakdown for a <strong>${sampleBookingAmount} AUD</strong> reservation or craft sale:
            </p>

            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 border border-[var(--gray-200)]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--gray-500)] font-medium">Customer Paid:</span>
                <span className="font-bold text-[var(--ink)]">${sampleBookingAmount}.00 AUD</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--rausch)] font-bold border-t border-[var(--gray-100)] pt-2">
                <span>Platform Owner Cut ({commissionRate}%):</span>
                <span>+${platformRevenue.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between items-center text-xs text-emerald-700 font-bold border-t border-[var(--gray-100)] pt-2">
                <span>Vendor / Host Payout:</span>
                <span>${vendorPayout.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
