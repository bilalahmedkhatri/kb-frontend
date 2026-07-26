"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { Badge } from "@/src/components/atoms/Badge";
import {
  HiPhone,
  HiMapPin,
  HiCheckCircle,
  HiCamera,
  HiTrash,
  HiShieldExclamation,
  HiDevicePhoneMobile,
  HiArrowRightOnRectangle,
  HiPlus,
  HiCreditCard,
  HiGlobeAlt,
  HiClock,
  HiCurrencyDollar,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiXMark,
} from "react-icons/hi2";

interface SavedAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
}

const MOCK_SESSIONS: ActiveSession[] = [
  { id: "sess-1", device: "Chrome on Windows", location: "Sydney, Australia", lastActive: "Active now" },
  { id: "sess-2", device: "Safari on iPhone", location: "Sydney, Australia", lastActive: "2 hours ago" },
];

const MOCK_CARDS: SavedCard[] = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: "card-2", brand: "Mastercard", last4: "8888", expiry: "06/27", isDefault: false },
];

function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg">
      <HiCheckCircle className={type === "success" ? "h-5 w-5 text-green-400" : "h-5 w-5 text-red-400"} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <HiXMark className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { user, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");

  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC+12 / Tarawa");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "a-1",
      fullName: user?.name || "John Smith",
      street: "123 Main St",
      city: "Sydney",
      state: "NSW",
      zip: "2000",
      country: "Australia",
      phone: "+6125550101",
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const [showCardForm, setShowCardForm] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>(MOCK_CARDS);

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      showToast("First name is required", "error");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({ name: `${firstName} ${lastName}`.trim() || firstName, location, bio });
    setSaving(false);
    showToast("Profile changes saved successfully");
  };

  const handleSaveEmergency = () => {
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      showToast("Contact name and phone are required", "error");
      return;
    }
    showToast("Emergency contact saved");
  };

  const handleSavePreferences = () => {
    showToast("Preferences saved");
  };

  const handleSavePassword = () => {
    if (!currentPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
    showToast("Password updated successfully");
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city) {
      showToast("Street and city are required", "error");
      return;
    }
    setAddresses((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, ...newAddress },
    ]);
    setNewAddress({ fullName: "", street: "", city: "", state: "", zip: "", country: "", phone: "" });
    setShowAddressForm(false);
    showToast("Address added");
  };

  const handleSetDefaultCard = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
    showToast("Default payment method updated");
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Personal Information</h2>
          <div className="flex flex-col gap-6 rounded-xl border border-[#DDDDDD] p-6">
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
                  <Button size="sm" variant="outline" leftIcon={<HiCamera className="h-3.5 w-3.5" />}>
                    Change Photo
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<HiTrash className="h-3.5 w-3.5" />}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<HiPhone className="h-4 w-4" />} />
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} leftIcon={<HiMapPin className="h-4 w-4" />} className="md:col-span-2" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#222222]">Bio / About</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                placeholder="Tell us a little about yourself..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSaveProfile} isLoading={saving}>Save Changes</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Emergency Contact</h2>
          <div className="rounded-xl border border-[#DDDDDD] p-6">
            <p className="mb-4 text-sm text-[#717171]">
              Essential for island travel and activity bookings. Your emergency contact will be notified if needed.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Contact Name" placeholder="Next of Kin, Spouse, Guide..." value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
              <Input label="Relationship" placeholder="e.g. Spouse, Parent, Guide" value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} />
              <Input label="Emergency Phone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} leftIcon={<HiPhone className="h-4 w-4" />} />
              <Input label="Emergency Email" type="email" value={emergencyEmail} onChange={(e) => setEmergencyEmail(e.target.value)} />
            </div>
            <div className="mt-4">
              <Button size="sm" onClick={handleSaveEmergency}>Save Emergency Contact</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Regional & Account Preferences</h2>
          <div className="rounded-xl border border-[#DDDDDD] p-6">
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
                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
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
                  className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                >
                  <option>UTC+12 / Tarawa</option>
                  <option>UTC+13 / Kiritimati</option>
                  <option>UTC+14 / Kiritimati (Summer)</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm" onClick={handleSavePreferences}>Save Preferences</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Security & Authentication</h2>
          <div className="flex flex-col gap-6 rounded-xl border border-[#DDDDDD] p-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#222222]">Change Password</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Current Password", value: currentPassword, set: setCurrentPassword, show: showCurrentPw, toggle: () => setShowCurrentPw(!showCurrentPw) },
                  { label: "New Password", value: newPassword, set: setNewPassword, show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                  { label: "Confirm New Password", value: confirmPassword, set: setConfirmPassword, show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw) },
                ].map((field) => (
                  <div key={field.label} className="relative">
                    <Input
                      label={field.label}
                      type={field.show ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      leftIcon={<HiLockClosed className="h-4 w-4" />}
                    />
                    <button
                      onClick={field.toggle}
                      className="absolute right-3 top-9 text-[#717171] hover:text-[#222222]"
                    >
                      {field.show ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Button size="sm" onClick={handleSavePassword}>Update Password</Button>
                {passwordSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <HiCheckCircle className="h-4 w-4" />
                    Password updated
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-[#DDDDDD] pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <HiShieldExclamation className="mt-0.5 h-5 w-5 text-[#FF385C]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#222222]">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-[#717171]">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={twoFAEnabled}
                    onChange={() => setTwoFAEnabled(!twoFAEnabled)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-[#DDDDDD] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#FF385C] peer-checked:after:translate-x-full" />
                </label>
              </div>
              {twoFAEnabled && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">Set up via SMS</Button>
                  <Button size="sm" variant="outline">Set up via Authenticator App</Button>
                </div>
              )}
            </div>

            <div className="border-t border-[#DDDDDD] pt-6">
              <h3 className="mb-3 text-sm font-semibold text-[#222222]">Active Sessions</h3>
              <div className="flex flex-col gap-3">
                {MOCK_SESSIONS.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <HiDevicePhoneMobile className="h-5 w-5 text-[#717171]" />
                      <div>
                        <p className="text-sm font-medium text-[#222222]">{session.device}</p>
                        <p className="text-xs text-[#717171]">{session.location} &middot; {session.lastActive}</p>
                      </div>
                    </div>
                    <Badge variant={session.lastActive === "Active now" ? "success" : "default"}>
                      {session.lastActive === "Active now" ? "Active" : "Idle"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Button size="sm" variant="destructive" leftIcon={<HiArrowRightOnRectangle className="h-4 w-4" />}>
                  Log Out All Devices
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Saved Payment Methods</h2>
          <div className="flex flex-col gap-4 rounded-xl border border-[#DDDDDD] p-6">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center gap-3">
                  <HiCreditCard className="h-5 w-5 text-[#717171]" />
                  <div>
                    <p className="text-sm font-medium text-[#222222]">{card.brand} &bull;&bull;&bull;&bull; {card.last4}</p>
                    <p className="text-xs text-[#717171]">Expires {card.expiry}</p>
                  </div>
                  {card.isDefault && <Badge variant="primary" className="ml-2">Default</Badge>}
                </div>
                {!card.isDefault && (
                  <button onClick={() => handleSetDefaultCard(card.id)} className="text-xs font-medium text-[#FF385C] hover:underline">
                    Set as Default
                  </button>
                )}
              </div>
            ))}
            <div>
              {showCardForm ? (
                <div className="mb-4 rounded-lg border border-[#DDDDDD] p-4">
                  <div className="mb-3 grid gap-3 md:grid-cols-2">
                    <Input label="Card Number" placeholder="1234 5678 9012 3456" className="md:col-span-2" />
                    <Input label="Expiry Date" placeholder="MM/YY" />
                    <Input label="CVC" placeholder="123" />
                    <Input label="Cardholder Name" placeholder="John Smith" className="md:col-span-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Add Card</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowCardForm(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setShowCardForm(true)}>
                  Add Payment Method
                </Button>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#222222]">Saved Addresses</h2>
            <Button variant="outline" size="sm" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setShowAddressForm(true)}>
              Add Address
            </Button>
          </div>
          {showAddressForm && (
            <div className="mb-4 rounded-xl border border-[#DDDDDD] p-4">
              <div className="mb-3 grid gap-3 md:grid-cols-2">
                <Input label="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                <Input label="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                <Input label="ZIP Code" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
                <Input label="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                <Input label="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAddress}>Save Address</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
          {addresses.length === 0 && !showAddressForm && (
            <div className="rounded-xl border border-dashed border-[#DDDDDD] p-8 text-center">
              <HiMapPin className="mx-auto mb-2 h-8 w-8 text-[#DDDDDD]" />
              <p className="text-sm text-[#717171]">No saved addresses yet</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-xl border border-[#DDDDDD] p-4">
                <p className="mb-1 text-sm font-semibold text-[#222222]">{addr.fullName}</p>
                <p className="text-sm text-[#717171]">{addr.street}</p>
                <p className="text-sm text-[#717171]">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-[#717171]">{addr.country}</p>
                {addr.phone && <p className="mt-1 text-xs text-[#717171]">{addr.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}