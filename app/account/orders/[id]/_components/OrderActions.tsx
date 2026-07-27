"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { Button } from "@/src/components/atoms/Button";
import { generateOrderInvoicePDF } from "@/src/lib/pdfGenerator";
import {
  HiArrowPath,
  HiArrowDownTray,
  HiCheckCircle,
  HiXMark,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

export function OrderActions({ order }: { order: Order }) {
  const { addItem } = useCartStore();
  const [reordering, setReordering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReorder = async () => {
    setReordering(true);
    await new Promise((r) => setTimeout(r, 600));
    order.items.forEach((item) =>
      addItem({
        id: item.productId,
        type: "product",
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.productImage,
      })
    );
    setReordering(false);
    showToast(`Added ${order.items.length} item(s) to cart`);
  };

  const handleDownloadInvoicePDF = async () => {
    setDownloading(true);
    try {
      generateOrderInvoicePDF(order);
      showToast(`Downloaded IslandConnects_Invoice_${order.id}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      showToast("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleReorder}
          isLoading={reordering}
          leftIcon={<HiArrowPath className="h-4 w-4" />}
        >
          {reordering ? "Adding to Cart..." : "Reorder All Items"}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadInvoicePDF}
          isLoading={downloading}
          leftIcon={<HiArrowDownTray className="h-4 w-4" />}
        >
          Download PDF Invoice
        </Button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-200">
          <HiCheckCircle className="h-5 w-5 text-green-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/60 hover:text-white">
            <HiXMark className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
