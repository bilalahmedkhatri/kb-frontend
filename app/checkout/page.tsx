"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckoutLayout } from "@/src/components/templates/CheckoutLayout";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { cn, formatCurrency } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import type { Address } from "@/src/types";

const steps = ["Shipping", "Payment", "Review"];

const paymentMethods = [
  {
    value: "card",
    label: "Credit / Debit Card or Mobile Wallet",
    description: "Visa, Mastercard, Amex, Apple Pay, Google Pay",
    badge: "Instant Processing • Zero Buyer Conversion Fees",
  },
  {
    value: "paypal",
    label: "PayPal / Pay in 4",
    description: "Pay securely using your PayPal balance, linked bank, or split payments.",
  },
  {
    value: "wise",
    label: "International Bank Transfer (Wise)",
    description: "Direct transfer with real exchange rates and minimal fees (Best for large orders).",
    badge: "Lowest Fee Option (~0.4%)",
  },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [shipping, setShipping] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Kiribati",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  const updateShipping = (field: keyof Address, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const isShippingValid = () => {
    return (
      shipping.fullName.trim() &&
      shipping.street.trim() &&
      shipping.city.trim() &&
      shipping.state.trim() &&
      shipping.zip.trim() &&
      shipping.phone.trim()
    );
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    // Simulate order creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearCart();
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center justify-center py-20">
        <p className="text-base font-medium text-[#717171]">Your cart is empty</p>
        <p className="mt-1 text-sm text-[#717171]">Add items to your cart before checking out.</p>
      </div>
    );
  }

  const total = subtotal();

  return (
    <CheckoutLayout currentStep={currentStep} steps={steps}>
      {currentStep === 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#222222]">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                value={shipping.fullName}
                onChange={(e) => updateShipping("fullName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                value={shipping.street}
                onChange={(e) => updateShipping("street", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <Input
              label="City"
              value={shipping.city}
              onChange={(e) => updateShipping("city", e.target.value)}
              placeholder="Tarawa"
            />
            <Input
              label="State"
              value={shipping.state}
              onChange={(e) => updateShipping("state", e.target.value)}
              placeholder="South Tarawa"
            />
            <Input
              label="ZIP Code"
              value={shipping.zip}
              onChange={(e) => updateShipping("zip", e.target.value)}
              placeholder="00200"
            />
            <Input
              label="Phone"
              type="tel"
              value={shipping.phone}
              onChange={(e) => updateShipping("phone", e.target.value)}
              placeholder="+686 7XX XXX"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setCurrentStep(1)} disabled={!isShippingValid()}>
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="mx-auto w-full max-w-xl">
          <h2 className="mb-1 text-xl font-bold text-[#222222]">Select Payment Method</h2>
          <p className="mb-6 text-sm text-[#717171]">
            All transactions are encrypted and processed securely in <strong className="text-[#222222]">USD ($)</strong>.
          </p>
          <div className="flex flex-col gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all",
                  paymentMethod === method.value
                    ? "border-[#FF385C] bg-[#FFF0F3]"
                    : "border-[#DDDDDD] hover:border-[#222222]"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-0.5 h-4 w-4 accent-[#FF385C]"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#222222]">{method.label}</p>
                    <span className="shrink-0 text-xs font-bold tracking-wide text-[#717171]">
                      {method.value === "card" && "VISA MC Pay"}
                      {method.value === "paypal" && "PayPal"}
                      {method.value === "wise" && "Wise"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#717171]">{method.description}</p>
                  {"badge" in method && method.badge && (
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                        method.value === "card"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      )}
                    >
                      {method.badge}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[#DDDDDD] pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              Back
            </Button>
            <Button onClick={() => setCurrentStep(2)}>
              Review Order
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#222222]">Review Your Order</h2>

          <div className="rounded-xl border border-[#DDDDDD] p-4">
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
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#222222]">{item.name}</p>
                    <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#222222]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#222222]">Shipping Address</h3>
            <div className="space-y-1 text-sm text-[#717171]">
              <p>{shipping.fullName}</p>
              <p>{shipping.street}</p>
              <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
              <p>{shipping.country}</p>
              <p>{shipping.phone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#222222]">Payment</h3>
            <p className="text-sm text-[#717171] capitalize">
              {paymentMethods.find((m) => m.value === paymentMethod)?.label}
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#717171]">Subtotal</span>
              <span className="font-medium text-[#222222]">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#717171]">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <hr className="border-[#DDDDDD]" />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-[#222222]">Total</span>
              <span className="font-bold text-[#222222]">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button onClick={handlePlaceOrder} isLoading={submitting}>
              Place Order
            </Button>
          </div>
        </div>
      )}
    </CheckoutLayout>
  );
}
