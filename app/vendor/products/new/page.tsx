"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/atoms/Button";
import { ProductCard } from "@/src/components/molecules/ProductCard";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiChevronRight,
  HiChevronLeft,
  HiPhoto,
  HiInformationCircle,
  HiCurrencyDollar,
  HiTruck,
  HiEye,
  HiTrash,
  HiSparkles,
} from "react-icons/hi2";
import type { Product } from "@/src/types";

const ARTISAN_PRESETS = [
  { label: "Woven Pandanus Mat", url: "/favicon.png" },
  { label: "Kiribati Shell Necklace", url: "/favicon.png" },
  { label: "Artisan Coconut Fiber Basket", url: "/favicon.png" },
  { label: "Shark Tooth Sword Replica", url: "/favicon.png" },
];

export default function VendorAddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Details
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Handicrafts");
  const [origin, setOrigin] = useState("Tarawa");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("Pandanus Leaf & Coconut Fiber");

  // Step 2: Media
  const [images, setImages] = useState<string[]>(["/favicon.png"]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Step 3: Pricing & Inventory
  const [price, setPrice] = useState("65.00");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("12");
  const [sku, setSKU] = useState(`KB-${Math.floor(1000 + Math.random() * 9000)}`);

  // Step 4: Shipping
  const [weight, setWeight] = useState("0.85");
  const [dimensions, setDimensions] = useState("30 x 20 x 10 cm");
  const [isFragile, setIsFragile] = useState(false);

  const addPresetImage = (url: string, label: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
    setSelectedPreset(label);
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const currentPreviewProduct: Product = {
    id: `preview-${Date.now()}`,
    name: name || "Authentic Kiribati Handicraft",
    price: parseFloat(price) || 65,
    currency: "AUD",
    images: images.length > 0 ? images : ["/favicon.png"],
    category: category || "Handicrafts",
    vendorId: "v-1",
    vendorName: "Tebwa Artisans Cooperative",
    rating: 5.0,
    reviewCount: 0,
    stock: parseInt(stock) || 10,
    status: "pending",
    description: description || "Hand-crafted by local Kiribati island weavers using sustainable natural fibers.",
    origin: origin || "Tarawa",
    material: material || "Pandanus Leaf",
    createdAt: new Date().toISOString(),
  };

  const handleFinalSubmit = (isDraft: boolean) => {
    router.push("/vendor/products");
  };

  const stepsList = [
    { num: 1, label: "Basic Details", icon: HiInformationCircle },
    { num: 2, label: "Media & Photos", icon: HiPhoto },
    { num: 3, label: "Pricing & Stock", icon: HiCurrencyDollar },
    { num: 4, label: "Shipping", icon: HiTruck },
    { num: 5, label: "Preview & Submit", icon: HiEye },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stepper Tabs */}
      <div className="grid grid-cols-5 gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs">
        {stepsList.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${isActive
                ? "bg-[#FF385C] text-white shadow-sm"
                : isDone
                  ? "bg-red-50 text-[#FF385C] font-semibold"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              <div className="flex items-center gap-1.5">
                {isDone ? <HiCheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                <span className="text-xs font-bold">Step {s.num}</span>
              </div>
              <span className="text-xs hidden sm:block truncate max-w-[100px]">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm min-h-[380px]">
        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-ink border-b border-gray-100 pb-2">Step 1: Product Information & Craft Story</h3>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Product Title *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fine Hand-Woven Pandanus Floor Mat"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none bg-white"
                >
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Jewelry">Jewelry & Shells</option>
                  <option value="Woodwork">Woodwork & Carvings</option>
                  <option value="Apparel">Traditional Apparel</option>
                  <option value="Souvenirs">Souvenirs</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Island Origin *</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none bg-white"
                >
                  <option value="Tarawa">Tarawa Atoll</option>
                  <option value="Kiritimati">Kiritimati (Christmas Island)</option>
                  <option value="Abaiang">Abaiang Atoll</option>
                  <option value="Tabiteuea">Tabiteuea Island</option>
                  <option value="Outer Atolls">Outer Islands Cooperative</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Craft Story & Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share the artisan technique, cultural heritage, and story behind this item..."
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Primary Natural Materials</label>
              <input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Bleached Pandanus Leaf, Sea Shells, Fiber"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: MEDIA GALLERY */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-ink border-b border-gray-100 pb-2">Step 2: Product Media & Gallery</h3>

            {/* Artisan Presets Quick Selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Quick Test Image Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ARTISAN_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addPresetImage(preset.url, preset.label)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all ${selectedPreset === preset.label
                      ? "border-[#FF385C] bg-red-50/50 text-[#FF385C]"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-700"
                      }`}
                  >
                    <HiPhoto className="h-7 w-7 text-gray-400" />
                    <span className="text-xs font-semibold leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Drag Drop Area */}
            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors bg-gray-50/50">
              <HiPhoto className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-ink">Drag and drop product images, or browse</p>
              <p className="text-xs text-gray-400 mt-0.5">Supports PNG, JPG, WEBP up to 5MB</p>
            </div>

            {/* Selected Images List */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-700">Selected Gallery Images ({images.length})</label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative h-24 w-24 rounded-xl border border-gray-200 bg-gray-100 overflow-hidden shadow-xs">
                    <img src={img} alt="preview" className="h-full w-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#FF385C] py-0.5 text-center text-[10px] font-bold text-white">
                        Main Cover
                      </span>
                    )}
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiTrash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING & STOCK */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-ink border-b border-gray-100 pb-2">Step 3: Pricing & Inventory Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Regular Price (AUD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="65.00"
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Discount Sale Price (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="55.00"
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Initial Stock Units *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="12"
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">SKU / Item Reference Code</label>
                <input
                  value={sku}
                  onChange={(e) => setSKU(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SHIPPING ATTRIBUTES */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-ink border-b border-gray-100 pb-2">Step 4: Inter-Island Freight & Package Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Item Weight (kg)</label>
                <input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.85 kg"
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Dimensions (L x W x H)</label>
                <input
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="30 x 20 x 10 cm"
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="h-4 w-4 rounded-md text-[#FF385C] focus:ring-[#FF385C]"
                />
                <div>
                  <span className="block text-xs font-bold text-amber-900">Fragile Inter-Island Cargo Handling</span>
                  <span className="block text-[11px] text-amber-700">
                    Check if this item requires bubble wrapping and special protection during boat freight between islands.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: PREVIEW & SUBMIT */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-ink border-b border-gray-100 pb-2">Step 5: Live Marketplace Card Preview & Submission</h3>
              <p className="text-xs text-gray-500 mt-1">Review how your listing will appear to buyers on the Kiribati Marketplace.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 items-start">
              <div className="w-full max-w-xs mx-auto sm:mx-0 border border-gray-200 rounded-xl p-3 shadow-md bg-white">
                <ProductCard product={currentPreviewProduct} />
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5 text-xs">
                <h5 className="font-bold text-ink border-b border-gray-200 pb-2">Listing Summary</h5>
                <div className="flex justify-between"><span className="text-gray-500">Category:</span> <span className="font-semibold text-ink">{category}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Island Origin:</span> <span className="font-semibold text-ink">{origin}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Stock Units:</span> <span className="font-semibold text-ink">{stock} units</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Price:</span> <span className="font-bold text-[#FF385C]">${price} AUD</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Fragile Freight:</span> <span className="font-semibold text-ink">{isFragile ? "Yes (Protected)" : "Standard"}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer Controls */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep((s) => (s > 1 ? (s - 1) as any : 1))}
          disabled={step === 1}
          leftIcon={<HiChevronLeft className="h-4 w-4" />}
        >
          Previous Step
        </Button>

        <div className="flex items-center gap-3">
          {step < 5 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => (s < 5 ? (s + 1) as any : 5))}
              rightIcon={<HiChevronRight className="h-4 w-4" />}
            >
              Next Step
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFinalSubmit(true)}
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleFinalSubmit(false)}
              >
                Submit for Moderation
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
