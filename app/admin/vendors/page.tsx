"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";
import { HiBuildingStorefront, HiEye, HiNoSymbol } from "react-icons/hi2";
import type { Product, User } from "@/src/types";

interface VendorWithCount extends User {
  productCount: number;
  suspended: boolean;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getVendor("v-1"),
      api.getVendorProducts("v-1"),
    ]).then(() => {
      const vendorList: User[] = [
        { id: "v-1", email: "maria@tebwa.shop", name: "Maria Tebwa", avatar: "", role: "vendor", bio: "Traditional jewelry artisan from Tarawa", location: "Tarawa", createdAt: "2024-01-15" },
        { id: "v-2", email: "tione@karanga.art", name: "Tione Karanga", avatar: "", role: "vendor", bio: "Wood carving master with 20 years experience", location: "Kiritimati", createdAt: "2024-02-20" },
        { id: "v-3", email: "nei@reraweaves.fi", name: "Nei Reraweaves", avatar: "", role: "vendor", bio: "Specializing in traditional Kiribati textiles", location: "Abaiang", createdAt: "2024-03-10" },
        { id: "v-4", email: "tabwai@pottery.ki", name: "Tabwai Pottery", avatar: "", role: "vendor", bio: "Handcrafted pottery using traditional techniques", location: "Beru", createdAt: "2024-04-05" },
        { id: "v-5", email: "anere@homestay.ki", name: "Anere Homestays", avatar: "", role: "vendor", bio: "Family-run homestays across the islands", location: "Tarawa", createdAt: "2023-11-01" },
        { id: "v-6", email: "bwere@ecolodge.ki", name: "Bwere Eco Retreats", avatar: "", role: "vendor", bio: "Sustainable eco-lodges with ocean views", location: "Kiritimati", createdAt: "2023-10-15" },
        { id: "v-7", email: "riki@shellcraft.ki", name: "Riki Shellcraft", avatar: "", role: "vendor", bio: "Beautiful shell jewelry and ornaments", location: "Abemama", createdAt: "2024-05-01" },
        { id: "v-8", email: "teuro@weaves.ki", name: "Teuro Weaves", avatar: "", role: "vendor", bio: "Pandanus weaving artisan collective", location: "Makin", createdAt: "2024-06-01" },
      ];

      Promise.all(
        vendorList.map((v) => api.getVendorProducts(v.id))
      ).then((productArrays) => {
        setVendors(
          vendorList.map((v, i) => ({
            ...v,
            productCount: productArrays[i].length,
            suspended: false,
          }))
        );
        setLoading(false);
      });
    });
  }, []);

  const toggleSuspend = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, suspended: !v.suspended } : v))
    );
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#222222]">Vendor Management</h1>

      {vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiBuildingStorefront className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">No vendors found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                vendor.suspended
                  ? "border-red-200 bg-red-50"
                  : "border-[#DDDDDD]"
              )}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#222222]">{vendor.name}</h3>
                  <p className="text-xs text-[#717171]">{vendor.email}</p>
                  {vendor.location && (
                    <p className="text-xs text-[#717171]">{vendor.location}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline">{vendor.productCount} products</Badge>
                  {vendor.suspended && <Badge variant="error">Suspended</Badge>}
                </div>
              </div>

              {vendor.bio && (
                <p className="mb-3 text-xs text-[#717171]">{vendor.bio}</p>
              )}

              <p className="mb-3 text-xs text-[#717171]">
                Since {vendor.createdAt}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={`/vendor/${vendor.id}`}
                  className="flex items-center gap-1 rounded-lg bg-[#F7F7F7] px-3 py-1.5 text-xs font-medium text-[#222222] transition-colors hover:bg-[#DDDDDD]"
                >
                  <HiEye className="h-3.5 w-3.5" />
                  View Store
                </Link>
                <button
                  onClick={() => toggleSuspend(vendor.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    vendor.suspended
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  )}
                >
                  <HiNoSymbol className="h-3.5 w-3.5" />
                  {vendor.suspended ? "Unsuspend" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
