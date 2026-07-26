"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/atoms/Button";
import { QuantityStepper } from "@/src/components/molecules/QuantityStepper";
import { formatCurrency } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import {
  HiTrash,
  HiShoppingCart,
  HiArrowRight,
} from "react-icons/hi2";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center justify-center py-20 text-center">
        <HiShoppingCart className="mb-4 h-16 w-16 text-[#717171]" />
        <h1 className="mb-2 text-2xl font-bold text-[#222222]">Your Cart is Empty</h1>
        <p className="mb-6 text-sm text-[#717171]">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <div className="flex gap-3">
          <Link href="/marketplace">
            <Button>Browse Products</Button>
          </Link>
          <Link href="/stays">
            <Button variant="outline">Explore Stays</Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal();

  return (
    <div className="container-app py-8">
      <h1 className="mb-8 text-2xl font-bold text-[#222222]">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-[#DDDDDD] p-4 transition-shadow hover:shadow-sm"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#F7F7F7]">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={item.type === "product" ? `/product/${item.id}` : `/stay/${item.id}`}
                    className="text-sm font-semibold text-[#222222] hover:underline"
                  >
                    {item.name}
                  </Link>
                  {item.vendorName && (
                    <p className="text-xs text-[#717171]">{item.vendorName}</p>
                  )}
                  <p className="mt-1 text-sm font-bold text-[#222222]">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.id, q)}
                    min={1}
                    max={99}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-sm text-[#717171] transition-colors hover:text-red-500"
                  >
                    <HiTrash className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-[#DDDDDD] p-6">
            <h2 className="mb-4 text-lg font-bold text-[#222222]">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#717171]">Subtotal</span>
                <span className="font-medium text-[#222222]">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717171]">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <hr className="border-[#DDDDDD]" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-[#222222]">Total</span>
                <span className="font-bold text-[#222222]">{formatCurrency(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full">
                Proceed to Checkout <HiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
