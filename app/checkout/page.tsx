"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutLayout } from "@/src/components/templates/CheckoutLayout";
import { Button } from "@/src/components/atoms/Button";
import { Input } from "@/src/components/atoms/Input";
import { cn, formatCurrency } from "@/src/lib/utils";
import { useCartStore } from "@/src/store/cartStore";
import type { Address } from "@/src/types";

const steps = ["Shipping", "Payment", "Review"];

const paymentMethods = [
  { value: "credit-card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank-transfer", label: "Bank Transfer" },
];

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
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
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
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#222222]">Payment Method</h2>
          <p className="text-sm text-[#717171]">Select a payment method (mock)</p>
          <div className="flex flex-col gap-3">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                  paymentMethod === method.value
                    ? "border-[#222222] bg-[#F7F7F7]"
                    : "border-[#DDDDDD] hover:border-[#222222]"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 accent-[#222222]"
                />
                <span className="text-sm font-medium text-[#222222]">{method.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
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
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
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
