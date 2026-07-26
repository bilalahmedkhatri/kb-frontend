"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Input } from "@/src/components/atoms/Input";
import { Pagination } from "@/src/components/atoms/Pagination";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, generateId } from "@/src/lib/utils";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiXMark,
  HiCheck,
  HiCube,
} from "react-icons/hi2";
import type { Product } from "@/src/types";

const statusVariant: Record<string, "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  rejected: "error",
};

const PAGE_SIZE = 10;

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  images: string[];
}

const emptyForm: ProductForm = {
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  images: [],
};

export default function VendorProductsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getVendorProducts(user.id).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [user]);

  const handleAdd = () => {
    if (!form.name || !form.price || !form.stock) return;
    const newProduct: Product = {
      id: generateId(),
      name: form.name,
      price: parseFloat(form.price),
      currency: "AUD",
      images: form.images.length > 0 ? form.images : ["https://picsum.photos/seed/placeholder/400/400"],
      category: form.category || "General",
      vendorId: user?.id || "",
      vendorName: user?.name || "",
      rating: 0,
      reviewCount: 0,
      stock: parseInt(form.stock),
      status: "pending",
      description: form.description,
      origin: "",
      material: "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (!user) return null;

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#222222]">Products</h2>
          <Button
            size="sm"
            leftIcon={showForm ? <HiXMark className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
            onClick={() => { setShowForm(!showForm); setForm(emptyForm); }}
          >
            {showForm ? "Cancel" : "Add Product"}
          </Button>
        </div>

        {showForm && (
          <div className="rounded-xl border border-[#DDDDDD] p-4">
            <div className="mb-3 grid gap-3 md:grid-cols-2">
              <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Price (AUD)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <Input label="Image URL" value={form.images[0] || ""} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
            <div className="mt-2">
              <label className="mb-1.5 block text-sm font-medium text-[#222222]">Description</label>
              <textarea
                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <Button size="sm" className="mt-3" leftIcon={<HiCheck className="h-4 w-4" />} onClick={handleAdd}>
              Save Product
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiCube className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No products yet</p>
            <p className="text-sm text-[#717171]">Add your first product to start selling.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DDDDDD] text-[#717171]">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product) => (
                    <tr key={product.id} className="border-b border-[#DDDDDD]">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                          />
                          <span className="font-medium text-[#222222]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-[#222222]">{formatCurrency(product.price, product.currency)}</td>
                      <td className="py-3 text-[#717171]">{product.stock}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[product.status]}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg p-1.5 text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]">
                            <HiPencilSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg p-1.5 text-[#717171] hover:bg-[#F7F7F7] hover:text-red-500"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
  );
}
