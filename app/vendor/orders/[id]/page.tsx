"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { decodeOrderIdBase256 } from "@/src/lib/security";
import { generateOrderInvoicePDF } from "@/src/lib/pdfGenerator";
import { useOrder } from "@/src/hooks";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { OrderStatusStepper } from "@/src/components/molecules/OrderStatusStepper";
import {
  HiArrowLeft,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiArrowDownTray,
  HiCheckCircle,
  HiTruck,
  HiShieldCheck,
  HiBanknotes,
  HiSparkles,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "default" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function VendorOrderDetailsPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const decodedId = decodeOrderIdBase256(rawId) || rawId;

  const orderQuery = useOrder(decodedId, Boolean(decodedId));
  const order = orderQuery.data;
  const [status, setStatus] = useState<Order["status"]>(order?.status ?? "pending");
  const [trackingNumber, setTrackingNumber] = useState("KIR-SHIP-9042");
  const [savingTracking, setSavingTracking] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (orderQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (orderQuery.isError) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-bold text-ink">Could not load order</h2>
        <p className="mt-2 text-sm text-gray-500">The requested order payload could not be loaded.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void orderQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-bold text-ink">Order Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">The requested vendor order payload could not be located.</p>
        <Link href="/vendor/orders" className="mt-4 inline-block">
          <Button variant="outline">Back to Incoming Orders</Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: Order["status"]) => {
    setStatus(newStatus);
    triggerToast(`Fulfillment status updated to ${newStatus.toUpperCase()}`);
  };

  const handleSaveTracking = () => {
    setSavingTracking(true);
    setTimeout(() => {
      setSavingTracking(false);
      triggerToast(`Tracking Number #${trackingNumber} updated successfully!`);
    }, 600);
  };

  const handleDownloadInvoice = () => {
    generateOrderInvoicePDF(order);
    triggerToast("Official Order PDF Invoice downloaded!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink">
                Order #{order.id.toUpperCase()}
              </h2>
              <Badge variant={statusVariants[status]} className="capitalize">
                {status}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDownloadInvoice}
          variant="outline"
          size="sm"
          leftIcon={<HiArrowDownTray className="h-4 w-4 text-rausch" />}
        >
          Download Invoice PDF
        </Button>
      </div>

      {/* Fulfillment Status Stepper */}
      {status !== "cancelled" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <HiSparkles className="h-4 w-4 text-rausch" />
            Fulfillment Progress Stepper
          </h3>
          <OrderStatusStepper currentStatus={status} />
        </div>
      )}

      {/* Grid Layout: Customer Info & Status Controls */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Contact Details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <HiUser className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-ink">Customer Contact</h3>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div>
              <span className="text-gray-400 block">Full Name</span>
              <span className="font-bold text-ink text-sm">{order.shippingAddress.fullName}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <HiEnvelope className="h-4 w-4 text-gray-400" />
              <span>{order.shippingAddress.fullName.toLowerCase().replace(" ", ".")}@example.com</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <HiPhone className="h-4 w-4 text-green-600" />
              <span className="font-semibold">+686 7301-9284</span>
            </div>

            <a
              href="https://wa.me/68673019284"
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
            >
              <HiChatBubbleLeftRight className="h-4 w-4 text-green-600" />
              WhatsApp Customer Contact
            </a>
          </div>
        </div>

        {/* Island Shipping Address & Freight Notes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <HiMapPin className="h-5 w-5 text-rausch" />
            <h3 className="text-sm font-bold text-ink">Island Delivery Address</h3>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-ink">{order.shippingAddress.street}</span>
            <span className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
            <span className="text-gray-500">{order.shippingAddress.country} • {order.shippingAddress.zip}</span>

            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900">
              <strong className="block text-amber-950 font-bold mb-0.5">Cargo Dock Delivery Note:</strong>
              Deliver package to Betio Port Freight Warehouse for inter-island vessel transport.
            </div>
          </div>
        </div>

        {/* Fulfillment Control & Tracking Editor */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <HiTruck className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold text-ink">Fulfillment Controls</h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-gray-700">Update Order Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as Order["status"])}
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs font-bold text-ink focus:border-ink focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">Tracking / Waybill #</label>
              <div className="flex gap-2">
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="KIR-SHIP-XXXX"
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono text-ink focus:border-ink focus:outline-none"
                />
                <Button size="xs" onClick={handleSaveTracking} isLoading={savingTracking}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Order Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-ink border-b border-gray-100 pb-2">Purchased Items Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <th className="p-3 font-semibold">Item Details</th>
                <th className="p-3 font-semibold">SKU</th>
                <th className="p-3 font-semibold">Unit Price</th>
                <th className="p-3 font-semibold">Quantity</th>
                <th className="p-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage || "/favicon.png"} alt={item.productName} className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                      <div>
                        <span className="font-bold text-ink block">{item.productName}</span>
                        <span className="text-xs text-gray-400">Handcrafted Kiribati Artisan Product</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs font-mono text-gray-500">KB-8291</td>
                  <td className="p-3 font-semibold text-ink">{formatCurrency(item.price, order.currency)}</td>
                  <td className="p-3 text-gray-700 font-semibold">{item.quantity}</td>
                  <td className="p-3 font-bold text-ink text-right">{formatCurrency(item.price * item.quantity, order.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Financial Summary & Payout */}
          <div className="mt-6 flex flex-col items-end border-t border-gray-200 pt-4 text-sm">
            <div className="flex w-full max-w-xs justify-between py-1 text-gray-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.items.reduce((sum, i) => sum + i.price * i.quantity, 0), order.currency)}</span>
            </div>
            <div className="flex w-full max-w-xs justify-between py-1 text-gray-600">
              <span>Inter-Island Delivery Fee:</span>
              <span>{formatCurrency(order.deliveryFee ?? 0, order.currency)}</span>
            </div>
            <div className="flex w-full max-w-xs justify-between py-1 text-gray-600">
              <span>Inter-Island Shipping Fee:</span>
              <span>{formatCurrency(order.shippingFee ?? 0, order.currency)}</span>
            </div>
          <div className="flex w-full max-w-xs justify-between border-t border-gray-200 pt-2 text-base font-extrabold text-ink">
            <span>Vendor Payout Total:</span>
            <span className="text-rausch">{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5">
          <HiCheckCircle className="h-5 w-5 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
