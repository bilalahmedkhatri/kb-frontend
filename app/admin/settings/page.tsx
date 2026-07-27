"use client";

import { useState } from "react";
import { AdminLayout } from "@/src/components/templates/AdminLayout";
import { Button } from "@/src/components/atoms/Button";
import { HiCheckCircle, HiBanknotes, HiShieldCheck } from "react-icons/hi2";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState("8.5");
  const [payoutSchedule, setPayoutSchedule] = useState("weekly");
  const [minPayoutAmount, setMinPayoutAmount] = useState("50");
  const [requireListingApproval, setRequireListingApproval] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setToastMsg("Platform settings saved successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-bold text-ink">Platform Settings & Monetization Rules</h2>
          <p className="text-xs text-gray-500">Configure marketplace commission rates, vendor payout rules, and listing moderation behavior.</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <HiBanknotes className="h-6 w-6 text-green-600" />
            <h3 className="text-base font-bold text-ink">Monetization & Commission</h3>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Platform Take Rate Commission (%)</label>
            <input
              type="number"
              step="0.1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">Percentage commission retained by IslandConnects on each order sale.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Vendor Payout Frequency</label>
              <select
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none bg-white"
              >
                <option value="weekly">Weekly (Every Monday)</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Minimum Payout Threshold (AUD)</label>
              <input
                type="number"
                value={minPayoutAmount}
                onChange={(e) => setMinPayoutAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 pt-2">
            <HiShieldCheck className="h-6 w-6 text-red-600" />
            <h3 className="text-base font-bold text-ink">Listing Moderation Rules</h3>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div>
              <p className="text-sm font-bold text-ink">Require Admin Approval for New Product Listings</p>
              <p className="text-xs text-gray-500">When enabled, newly created vendor products remain in 'Pending' state until approved by an Admin.</p>
            </div>
            <input
              type="checkbox"
              checked={requireListingApproval}
              onChange={(e) => setRequireListingApproval(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={saving} className="bg-red-600 hover:bg-red-700">
              {saving ? "Saving Settings..." : "Save Platform Settings"}
            </Button>
          </div>
        </form>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5">
            <HiCheckCircle className="h-5 w-5 text-green-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
