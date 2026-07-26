"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { Spinner } from "@/src/components/atoms/Spinner";
import { OrderStatusStepper } from "@/src/components/molecules/OrderStatusStepper";
import { OrderItemRow } from "@/src/components/molecules/OrderItemRow";
import { OrderSummaryCard } from "@/src/components/molecules/OrderSummaryCard";
import { ShippingAddressCard } from "@/src/components/molecules/ShippingAddressCard";
import { api } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import {
  HiChevronLeft,
  HiShoppingCart,
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

    let cancelled = false;
    async function fetchOrder() {
      try {
        const data = await api.getOrder(orderId);
        if (!cancelled) {
          setOrder(data || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchOrder();

    return () => {
      cancelled = true;
    };
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
        <p className="text-sm text-gray-500">Please sign in.</p>
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
        <p className="text-base font-medium text-gray-500">Order not found</p>
        <Link href="/account/orders" className="mt-4">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline"
      >
        <HiChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
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
        <OrderStatusStepper currentStatus={order.status} />

        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink">Items</h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <OrderItemRow key={item.productId} item={item} currency={order.currency} />
            ))}
          </div>
        </section>

        <ShippingAddressCard address={order.shippingAddress} />

        <OrderSummaryCard
          subtotal={order.total}
          total={order.total}
          currency={order.currency}
        />

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
