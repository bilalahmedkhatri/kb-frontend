"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/atoms/Button";
import { formatCurrency } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import { HiCheckCircle } from "react-icons/hi2";

export default function OrderConfirmationPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setOrderNumber(`KB-${Date.now().toString(36).toUpperCase()}`);
    clearCart();
  }, [clearCart]);

  return (
    <div className="container-app flex flex-col items-center justify-center py-20 text-center">
      <HiCheckCircle className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold text-[#222222]">Order Confirmed!</h1>
      <p className="mb-2 text-sm text-[#717171]">
        Thank you for your purchase. Your order has been placed.
      </p>
      {orderNumber && (
        <p className="mb-8 text-sm text-[#717171]">
          Order number: <span className="font-semibold text-[#222222]">{orderNumber}</span>
        </p>
      )}

      {items.length > 0 && (
        <div className="mb-8 w-full max-w-md rounded-xl border border-[#DDDDDD] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Items</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#222222]">{item.name}</p>
                  <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-[#222222]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-3 border-[#DDDDDD]" />
          <div className="flex justify-between text-base">
            <span className="font-semibold text-[#222222]">Total</span>
            <span className="font-bold text-[#222222]">{formatCurrency(subtotal())}</span>
          </div>
        </div>
      )}

      <Link href="/">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
