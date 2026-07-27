"use client";

import { useState } from "react";
import { VendorLayout } from "@/src/components/templates/VendorLayout";
import { Button } from "@/src/components/atoms/Button";
import { useAuthStore } from "@/src/store/authStore";
import { HiCheckCircle, HiBuildingStorefront, HiBanknotes } from "react-icons/hi2";

export default function VendorStoreSettingsPage() {
  const { user } = useAuthStore();
  const [storeName, setStoreName] = useState("Tebwa Artisans & Weavers");
  const [island, setIsland] = useState("Tarawa");
  const [bio, setBio] = useState("Traditional I-Kiribati handicraft weaving cooperative empowering local women artisans.");
  const [bankAccount, setBankAccount] = useState("ANZ Kiribati: 1029384756");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setToastMsg("Storefront settings updated successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <VendorLayout activeTab="store-settings">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-bold text-ink">Storefront Customization & Payouts</h2>
          <p className="text-xs text-gray-500">Update public store details, artisan story, and bank transfer payout info.</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <HiBuildingStorefront className="h-6 w-6 text-[#FF385C]" />
            <h3 className="text-base font-bold text-ink">Store Branding</h3>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Store / Artisan Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Island Location</label>
            <input
              value={island}
              onChange={(e) => setIsland(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Artisan Story & Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 pt-2">
            <HiBanknotes className="h-6 w-6 text-green-600" />
            <h3 className="text-base font-bold text-ink">Payout Method</h3>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Bank Account / ANZ Details</label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">Direct AUD bank transfer details for weekly payout settlements.</p>
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={saving}>
              {saving ? "Saving Changes..." : "Save Store Settings"}
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
    </VendorLayout>
  );
}
