"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import {
  HiChevronLeft,
  HiShoppingCart,
  HiMapPin,
  HiArrowPath,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const statusSteps: Order["status"][] = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    const rawId = params?.id;
    if (!rawId) return;
    const orderId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const data = await api.getOrder(orderId);
        setOrder(data || null);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params]);

  const handleReorder = () => {
    if (!order) return;
    setReordering(true);
    order.items.forEach((item) => {
      addItem({
        id: item.productId,
        type: "product",
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.productImage,
      });
    });
    setTimeout(() => {
      setReordering(false);
      router.push("/cart");
    }, 500);
  };

  if (!user) {
    return (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#717171]">Please sign in.</p>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-base font-medium text-[#717171]">Order not found</p>
        <Link href="/account/orders" className="mt-4">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#222222] hover:underline"
      >
        <HiChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">Order #{order.id}</h1>
          <p className="text-sm text-[#717171]">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Button
            size="sm"
            onClick={handleReorder}
            disabled={reordering}
          >
            <HiArrowPath className="mr-1.5 h-4 w-4" />
            {reordering ? "Adding..." : "Reorder All"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {currentStepIndex >= 0 && (
          <div className="flex items-center justify-between rounded-xl border border-[#DDDDDD] p-4">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStepIndex;
              const isLast = i < statusSteps.length - 1;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      isActive ? "bg-[#FF385C] text-white" : "bg-[#DDDDDD] text-[#717171]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium capitalize ${
                      isActive ? "text-[#222222]" : "text-[#717171]"
                    }`}
                  >
                    {step}
                  </span>
                  {isLast && (
                    <div
                      className={`ml-2 h-0.5 w-8 ${
                        i < currentStepIndex ? "bg-[#FF385C]" : "bg-[#DDDDDD]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Items</h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border border-[#DDDDDD] p-4"
              >
                <Image
                  src={item.productImage || "/placeholder.svg"}
                  alt={item.productName}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#222222]">{item.productName}</p>
                  <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-[#222222]">
                  {formatCurrency(item.price * item.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#DDDDDD] p-4">
          <div className="flex items-start gap-3">
            <HiMapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#717171]" />
            <div>
              <h3 className="mb-1 text-sm font-semibold text-[#222222]">Shipping Address</h3>
              <p className="text-sm text-[#717171]">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-[#717171]">{order.shippingAddress.street}</p>
              <p className="text-sm text-[#717171]">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="text-sm text-[#717171]">{order.shippingAddress.country}</p>
              <p className="text-sm text-[#717171]">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#DDDDDD] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Order Summary</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-[#717171]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#717171]">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t border-[#DDDDDD] pt-2 text-sm font-bold text-[#222222]">
              <span>Total</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <Button
            leftIcon={<HiShoppingCart className="h-4 w-4" />}
            isLoading={reordering}
            onClick={handleReorder}
          >
            Reorder
          </Button>
          <Link href="/account/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
