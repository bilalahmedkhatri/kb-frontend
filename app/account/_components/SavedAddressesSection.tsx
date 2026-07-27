"use client";

import { useState } from "react";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { HiMapPin, HiPlus } from "react-icons/hi2";
import { Toast, ToastData } from "./AccountToast";

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

export function SavedAddressesSection({ defaultName }: { defaultName?: string }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "a-1",
      fullName: defaultName || "John Smith",
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

  const [addingAddress, setAddingAddress] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city) {
      showToast("Street and city are required", "error");
      return;
    }
    setAddingAddress(true);
    // Simulate backend response delay
    await new Promise((r) => setTimeout(r, 850));
    setAddresses((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, ...newAddress },
    ]);
    setNewAddress({ fullName: "", street: "", city: "", state: "", zip: "", country: "", phone: "" });
    setAddingAddress(false);
    setShowAddressForm(false);
    showToast("Address added successfully");
  };

  return (
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
        <div className="mb-4 rounded-xl border border-[#DDDDDD] p-4 bg-white">
          <div className="mb-3 grid gap-3 md:grid-cols-2">
            <Input
              label="Full Name"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="ZIP Code"
              value={newAddress.zip}
              onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              disabled={addingAddress}
            />
            <Input
              label="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              disabled={addingAddress}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddAddress} isLoading={addingAddress}>
              {addingAddress ? "Saving Address..." : "Save Address"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(false)} disabled={addingAddress}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showAddressForm && (
        <div className="rounded-xl border border-dashed border-[#DDDDDD] p-8 text-center bg-white">
          <HiMapPin className="mx-auto mb-2 h-8 w-8 text-[#DDDDDD]" />
          <p className="text-sm text-[#717171]">No saved addresses yet</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-[#DDDDDD] p-4 bg-white">
            <p className="mb-1 text-sm font-semibold text-[#222222]">{addr.fullName}</p>
            <p className="text-sm text-[#717171]">{addr.street}</p>
            <p className="text-sm text-[#717171]">{addr.city}, {addr.state} {addr.zip}</p>
            <p className="text-sm text-[#717171]">{addr.country}</p>
            {addr.phone && <p className="mt-1 text-xs text-[#717171]">{addr.phone}</p>}
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
