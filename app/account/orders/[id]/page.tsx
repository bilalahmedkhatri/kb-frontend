import Link from "next/link";
import { notFound } from "next/navigation";
import { orders } from "@/src/data/orders";
import { decodeOrderIdBase256 } from "@/src/lib/security";
import { Badge } from "@/src/components/atoms/Badge";
import { OrderItemRow } from "@/src/components/molecules/OrderItemRow";
import { OrderSummaryCard } from "@/src/components/molecules/OrderSummaryCard";
import { ShippingAddressCard } from "@/src/components/molecules/ShippingAddressCard";
import { OrderStatusStepper } from "@/src/components/molecules/OrderStatusStepper";
import { OrderActions } from "./_components/OrderActions";
import { formatDate } from "@/src/lib/utils";
import { HiArrowLeft, HiCalendar, HiTruck, HiXCircle } from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "default" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id: token } = await params;
  
  // Decode Base256 URL token
  const rawOrderId = decodeOrderIdBase256(token);
  
  // Find order matching ID
  const order = orders.find((o) => o.id === rawOrderId || o.id === token);

  // Security check: If order not found or unauthorized, trigger Next.js notFound()
  if (!order || (order.userId !== "u-1" && order.userId !== "user-1")) {
    notFound();
  }

  // Calculate items subtotal and delivery fee
  const itemsSubtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = order.deliveryFee ?? order.shippingFee ?? Math.max(0, order.total - itemsSubtotal);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-ink transition-colors w-fit"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to Order History
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-ink">Order #{order.id}</h1>
              <Badge variant={statusVariants[order.status] || "default"} className="capitalize">
                {order.status}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <HiCalendar className="h-4 w-4 text-gray-400" />
                Placed on {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          <OrderActions order={order} />
        </div>
      </div>

      {/* Shipment Progress Stepper (Conditional: Hide if Cancelled) */}
      {order.status !== "cancelled" ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
            <HiTruck className="h-5 w-5 text-gray-500" />
            Shipment Progress
          </h2>
          <OrderStatusStepper currentStatus={order.status} className="border-0 p-0 shadow-none" />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm">
          <HiXCircle className="h-6 w-6 text-red-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold">Order Cancelled</h3>
            <p className="text-xs text-red-600">
              This order has been cancelled and will not be processed or shipped. If you have questions, please reach out to customer support.
            </p>
          </div>
        </div>
      )}

      {/* Ordered Items Table / List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-ink">
          Order Items ({order.items.length})
        </h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="py-3 first:pt-0 last:pb-0">
              <OrderItemRow item={item} currency={order.currency} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Shipping Address & Order Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipping Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-ink">Shipping Address</h2>
          <ShippingAddressCard address={order.shippingAddress} className="border-0 p-0 shadow-none" />
        </div>

        {/* Order Payment Summary with Delivery Fee */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-ink">Order Summary</h2>
          <OrderSummaryCard
            subtotal={itemsSubtotal}
            deliveryFee={deliveryFee}
            total={order.total}
            currency={order.currency}
            className="border-0 p-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
