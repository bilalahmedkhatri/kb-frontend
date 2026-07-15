"use client";

import { useState } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { AccountLayout } from "@/src/components/templates/AccountLayout";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiPlus, HiMapPin, HiPhone, HiCheckCircle } from "react-icons/hi2";

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

export default function AccountPage() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.location || "");
  const [location, setLocation] = useState(user?.location || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({ name, location });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city) return;
    setAddresses((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, ...newAddress },
    ]);
    setNewAddress({ fullName: "", street: "", city: "", state: "", zip: "", country: "", phone: "" });
    setShowAddressForm(false);
  };

  return (
    <AccountLayout activeTab="profile">
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-4 text-lg font-bold text-[#222222]">Profile Information</h2>
          <div className="flex flex-col gap-4 rounded-xl border border-[#DDDDDD] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<HiPhone className="h-4 w-4" />} />
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} leftIcon={<HiMapPin className="h-4 w-4" />} />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} isLoading={saving}>
                Save Changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <HiCheckCircle className="h-4 w-4" />
                  Changes saved
                </span>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#222222]">Saved Addresses</h2>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiPlus className="h-4 w-4" />}
              onClick={() => setShowAddressForm(true)}
            >
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
                <p className="text-sm text-[#717171]">
                  {addr.city}, {addr.state} {addr.zip}
                </p>
                <p className="text-sm text-[#717171]">{addr.country}</p>
                {addr.phone && <p className="mt-1 text-xs text-[#717171]">{addr.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}
