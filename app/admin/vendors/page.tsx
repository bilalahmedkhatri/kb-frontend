"use client";

import { useState } from "react";
import { AdminLayout } from "@/src/components/templates/AdminLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { HiBuildingStorefront, HiCheckBadge, HiCheckCircle } from "react-icons/hi2";

interface VendorEntry {
  id: string;
  name: string;
  email: string;
  island: string;
  verified: boolean;
  productsCount: number;
  joinedDate: string;
}

const mockVendors: VendorEntry[] = [
  { id: "v-1", name: "Maria Tebwa Artisans", email: "maria@tebwa.shop", island: "Tarawa", verified: true, productsCount: 12, joinedDate: "2024-01-15" },
  { id: "v-2", name: "Tione Karanga Carvings", email: "tione@karanga.art", island: "Kiritimati", verified: true, productsCount: 8, joinedDate: "2024-02-20" },
  { id: "v-3", name: "Nei Rera Weavers", email: "nei@reraweaves.fi", island: "Abaiang", verified: false, productsCount: 5, joinedDate: "2024-03-10" },
  { id: "v-4", name: "Tabwai Shell Pottery", email: "tabwai@pottery.ki", island: "Beru", verified: false, productsCount: 3, joinedDate: "2024-04-05" },
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorEntry[]>(mockVendors);
  const [isLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleVerification = (id: string, currentStatus: boolean, name: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verified: !currentStatus } : v))
    );
    const newStatus = !currentStatus ? "Verified Badge Granted" : "Verification Badge Revoked";
    setToastMsg(`${name}: ${newStatus}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AdminLayout activeTab="vendors">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <HiBuildingStorefront className="h-5 w-5 text-red-600" />
            Vendor Accounts & Verification Badges
          </h2>
          <p className="text-xs text-gray-500">Manage merchant store registrations, locations, and artisan verification status.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : isError ? (
            <ErrorState
              variant="compact"
              title="Could not load vendor accounts"
              description="We encountered an issue retrieving the list of registered artisan vendors."
              onRetry={() => setIsError(false)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <th className="p-3 font-semibold">Vendor Name</th>
                    <th className="p-3 font-semibold">Contact Email</th>
                    <th className="p-3 font-semibold">Island Location</th>
                    <th className="p-3 font-semibold">Catalog</th>
                    <th className="p-3 font-semibold">Verification Badge</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-ink flex items-center gap-2">
                        {vendor.name}
                        {vendor.verified && <HiCheckBadge className="h-4 w-4 text-blue-500" title="Verified Artisan Store" />}
                      </td>
                      <td className="p-3 text-gray-600">{vendor.email}</td>
                      <td className="p-3 text-gray-600 font-medium">{vendor.island}</td>
                      <td className="p-3 text-gray-600">{vendor.productsCount} items</td>
                      <td className="p-3">
                        <Badge variant={vendor.verified ? "success" : "default"}>
                          {vendor.verified ? "Verified Artisan" : "Standard Store"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={vendor.verified ? "outline" : "primary"}
                          className="text-xs py-1 px-3"
                          onClick={() => toggleVerification(vendor.id, vendor.verified, vendor.name)}
                        >
                          {vendor.verified ? "Revoke Verification" : "Grant Verified Badge"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

