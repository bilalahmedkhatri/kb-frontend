"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiPhone, HiMapPin, HiCamera, HiTrash } from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

export function ProfileSection() {
  const { user, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      showToast("First name is required", "error");
      return;
    }
    setSavingProfile(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 900));
    updateProfile({ name: `${firstName} ${lastName}`.trim() || firstName, location, bio });
    setSavingProfile(false);
    showToast("Profile changes saved successfully");
  };

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Personal Information</h2>
      <div className="flex flex-col gap-6 rounded-xl border border-[#DDDDDD] p-6 bg-white">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF385C] text-white shadow-sm hover:bg-[#E31C5F]">
              <HiCamera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#222222]">{user?.name || "User"}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" leftIcon={<HiTrash className="h-3.5 w-3.5" />}>
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input 
            label="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            disabled={savingProfile}
          />
          <Input 
            label="Last Name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            disabled={savingProfile}
          />
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={savingProfile}
          />
          <Input 
            label="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            leftIcon={<HiPhone className="h-4 w-4" />} 
            disabled={savingProfile}
          />
          <Input 
            label="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            leftIcon={<HiMapPin className="h-4 w-4" />} 
            className="md:col-span-2" 
            disabled={savingProfile}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#222222]">Bio / About</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            disabled={savingProfile}
            className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] disabled:bg-[#F7F7F7] disabled:opacity-60"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSaveProfile} isLoading={savingProfile}>
            {savingProfile ? "Saving Profile..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
