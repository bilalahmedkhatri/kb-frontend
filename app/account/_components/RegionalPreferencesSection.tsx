"use client";

import { useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { HiGlobeAlt, HiClock, HiCurrencyDollar } from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

export function RegionalPreferencesSection() {
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC+12 / Tarawa");
  
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 800));
    setSavingPreferences(false);
    showToast("Preferences saved");
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Regional & Account Preferences</h2>
      <div className="rounded-xl border border-[#DDDDDD] p-6 bg-white">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#222222]">
              <HiCurrencyDollar className="h-4 w-4 text-[#FF385C]" />
              Preferred Currency
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#DDDDDD] bg-[#F7F7F7] px-4 py-2.5 text-sm text-[#222222]">
              <span className="font-medium">USD ($)</span>
              <Badge variant="outline" className="ml-auto">Default</Badge>
            </div>
            <p className="mt-1 text-xs text-[#717171]">Locked to USD for all transactions</p>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#222222]">
              <HiGlobeAlt className="h-4 w-4 text-[#FF385C]" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={savingPreferences}
              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] disabled:bg-[#F7F7F7] disabled:opacity-60"
            >
              <option>English</option>
              <option>Kiribati (Gilbertese)</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#222222]">
              <HiClock className="h-4 w-4 text-[#FF385C]" />
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={savingPreferences}
              className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] disabled:bg-[#F7F7F7] disabled:opacity-60"
            >
              <option>UTC+12 / Tarawa</option>
              <option>UTC+13 / Kiritimati</option>
              <option>UTC+14 / Kiritimati (Summer)</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" onClick={handleSavePreferences} isLoading={savingPreferences}>
            {savingPreferences ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
