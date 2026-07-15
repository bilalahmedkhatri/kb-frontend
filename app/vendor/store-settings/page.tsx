"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { VendorLayout } from "@/src/components/templates/VendorLayout";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { HiCheckCircle } from "react-icons/hi2";

export default function StoreSettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [storeName, setStoreName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [verified, setVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateProfile({ name: storeName, bio, location });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <VendorLayout activeTab="settings">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[#222222]">Store Settings</h2>

        <div className="flex flex-col gap-4 rounded-xl border border-[#DDDDDD] p-6">
          <Input
            label="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#222222]">Store Bio</label>
            <textarea
              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your store..."
            />
          </div>
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Tarawa, Kiribati"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#222222]">Banner Image</label>
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-[#DDDDDD] bg-[#F7F7F7]">
              <span className="text-sm text-[#717171]">Upload Banner</span>
            </div>
          </div>

          <Checkbox
            id="verified"
            label="Request verification badge"
            checked={verified}
            onChange={setVerified}
          />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} isLoading={saving}>
              Save Settings
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <HiCheckCircle className="h-4 w-4" />
                Settings saved
              </span>
            )}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
