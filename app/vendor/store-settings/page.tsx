"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/atoms/Button";
import { useAuthStore } from "@/src/store/authStore";
import { HiCheckCircle, HiBuildingStorefront, HiBanknotes, HiXCircle } from "react-icons/hi2";
import { vendorsApi } from "@/src/lib/api/vendors";

export default function VendorStoreSettingsPage() {
  const { user } = useAuthStore();
  const [storeName, setStoreName] = useState("");
  const [island, setIsland] = useState("");
  const [bio, setBio] = useState("");
  const [bankAccount, setBankAccount] = useState("ANZ Kiribati: ");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMsg(message);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    vendorsApi.getMyProfile()
      .then((profile) => {
        setStoreName(profile.business_name || "");
        setBio(profile.business_description || "");
        setIsland(profile.business_address || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await vendorsApi.updateMyProfile({
        business_name: storeName,
        business_description: bio,
        business_address: island,
      });
      showToast("Storefront settings updated successfully!");
    } catch (err: any) {
      showToast(err?.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-lg font-bold text-ink">Storefront Customization & Payouts</h2>
        <p className="text-xs text-gray-500">Update public store details, artisan story, and bank transfer payout info.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <span className="text-sm text-gray-400">Loading store settings...</span>
        </div>
      ) : (
      <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <HiBuildingStorefront className="h-6 w-6 text-[#FF385C]" />
          <h3 className="text-base font-bold text-ink">Store Branding</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
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

        <div className="pt-2 flex justify-start">
          <Button type="submit" isLoading={saving}>
            {saving ? "Saving Changes..." : "Save Store Settings"}
          </Button>
        </div>
      </form>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5 ${toastType === "error" ? "bg-red-600" : "bg-[#222222]"}`}>
          {toastType === "error"
            ? <HiXCircle className="h-5 w-5 text-white" />
            : <HiCheckCircle className="h-5 w-5 text-green-400" />
          }
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
