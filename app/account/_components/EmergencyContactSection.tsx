"use client";

import { useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiPhone } from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

export function EmergencyContactSection() {
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  
  const [savingEmergency, setSavingEmergency] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveEmergency = async () => {
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      showToast("Contact name and phone are required", "error");
      return;
    }
    setSavingEmergency(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 850));
    setSavingEmergency(false);
    showToast("Emergency contact saved");
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Emergency Contact</h2>
      <div className="rounded-xl border border-[#DDDDDD] p-6 bg-white">
        <p className="mb-4 text-sm text-[#717171]">
          Essential for island travel and activity bookings. Your emergency contact will be notified if needed.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input 
            label="Contact Name" 
            placeholder="Next of Kin, Spouse, Guide..." 
            value={emergencyName} 
            onChange={(e) => setEmergencyName(e.target.value)} 
            disabled={savingEmergency}
          />
          <Input 
            label="Relationship" 
            placeholder="e.g. Spouse, Parent, Guide" 
            value={emergencyRelation} 
            onChange={(e) => setEmergencyRelation(e.target.value)} 
            disabled={savingEmergency}
          />
          <Input 
            label="Emergency Phone" 
            value={emergencyPhone} 
            onChange={(e) => setEmergencyPhone(e.target.value)} 
            leftIcon={<HiPhone className="h-4 w-4" />} 
            disabled={savingEmergency}
          />
          <Input 
            label="Emergency Email" 
            type="email" 
            value={emergencyEmail} 
            onChange={(e) => setEmergencyEmail(e.target.value)} 
            disabled={savingEmergency}
          />
        </div>
        <div className="mt-4">
          <Button size="sm" onClick={handleSaveEmergency} isLoading={savingEmergency}>
            {savingEmergency ? "Saving..." : "Save Emergency Contact"}
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
