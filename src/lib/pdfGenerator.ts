import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { encodeOrderIdBase256 } from "./security";
import { formatCurrency } from "./utils";
import type { Order } from "@/src/types";

/**
 * Loads a public image URL as a Data URL for jsPDF embedding
 */
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } catch {
    return null;
  }
}

/**
 * Programmatically generates and downloads a vector PDF invoice for an Order
 * using jsPDF and jspdf-autotable with official app logo header & background watermark.
 */
export async function generateOrderInvoicePDF(order: Order): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const itemsSubtotal = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const deliveryFee = order.deliveryFee ?? order.shippingFee ?? Math.max(0, order.total - itemsSubtotal);
    const token = encodeOrderIdBase256(order.id);
    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Color Palette
    const darkInkColor: [number, number, number] = [34, 34, 34]; // #222222 (--ink)
    const rauschColor: [number, number, number] = [255, 56, 92]; // #FF385C (--rausch)
    const mutedTextColor: [number, number, number] = [107, 114, 128]; // #6B7280
    const lightBgColor: [number, number, number] = [249, 250, 251]; // #F9FAFB

    // Load Logo Image Data URL once
    const logoDataUrl = await loadImageAsDataUrl("/favicon.png");

    // 0. Render Background Watermark Logo in Center of Page
    if (logoDataUrl) {
      try {
        const watermarkGState = new (doc as unknown as { GState: new (opts: { opacity: number }) => unknown }).GState({ opacity: 0.06 });
        doc.setGState(watermarkGState);
        // Center watermark: A4 width 210mm x height 297mm
        doc.addImage(logoDataUrl, "PNG", 60, 100, 90, 90);
        // Reset GState opacity to 1.0 for main content
        const resetGState = new (doc as unknown as { GState: new (opts: { opacity: number }) => unknown }).GState({ opacity: 1.0 });
        doc.setGState(resetGState);
      } catch {
        // Fallback watermark if GState is unsupported
      }
    }

    // 1. Header & Brand Logo Mark (/favicon.png)
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", 14, 12, 11, 11);
    } else {
      // Fallback logo mark if image fails to load
      doc.setFillColor(...rauschColor);
      doc.roundedRect(14, 12, 11, 11, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("K", 18, 19.5);
    }

    // 2. Official Wordmark ("Island" + "Connects")
    const brandX = 28;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);

    // "Island" in darkInk
    doc.setTextColor(...darkInkColor);
    doc.text("Island", brandX, 18);

    // "Connects" in rauschColor
    const islandWidth = doc.getTextWidth("Island ");
    doc.setTextColor(...rauschColor);
    doc.text("Connects", brandX + islandWidth, 18);

    // Tagline / Subtitle
    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("Pacific Tourism & Local Artisan Marketplace", brandX, 23);

    // Invoice Header Meta Right-Aligned (X: 196)
    doc.setTextColor(...darkInkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("TAX INVOICE", 196, 18, { align: "right" });

    doc.setFontSize(9.5);
    doc.text(`Order #${order.id}`, 196, 23, { align: "right" });

    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Date: ${formattedDate}`, 196, 28, { align: "right" });
    doc.text(`Status: ${order.status.toUpperCase()}`, 196, 33, { align: "right" });

    // Header Divider Line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.line(14, 38, 196, 38);

    // 3. Customer & Supplier Information Box (2 Columns)
    const boxY = 42;
    const boxHeight = 36;

    doc.setFillColor(...lightBgColor);
    doc.setDrawColor(243, 244, 246);

    // Left Box: Billed & Shipped To (X: 14 to 100, Width: 86)
    doc.roundedRect(14, boxY, 86, boxHeight, 3, 3, "FD");

    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("BILLED & SHIPPED TO", 18, boxY + 6);

    doc.setTextColor(...darkInkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(order.shippingAddress.fullName, 18, boxY + 12);

    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`${order.shippingAddress.street}`, 18, boxY + 17);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`, 18, boxY + 22);
    doc.text(`${order.shippingAddress.country}`, 18, boxY + 27);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 18, boxY + 32);

    // Right Box: Platform & Supplier (X: 106 to 196, Width: 90)
    doc.setFillColor(...lightBgColor);
    doc.roundedRect(106, boxY, 90, boxHeight, 3, 3, "FD");

    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("PLATFORM & SUPPLIER", 110, boxY + 6);

    doc.setTextColor(...darkInkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("IslandConnects Platform Co.", 110, boxY + 12);

    doc.setTextColor(...mutedTextColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("Bairiki, South Tarawa, Republic of Kiribati", 110, boxY + 17);
    doc.text("Support: billing@islandconnects.com", 110, boxY + 22);

    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text(`Ref: ${token}`, 110, boxY + 30);

    // 4. Itemized Product Table (jspdf-autotable)
    const tableBody = order.items.map((item) => [
      item.productName,
      formatCurrency(item.price, order.currency),
      item.quantity.toString(),
      formatCurrency(item.price * item.quantity, order.currency),
    ]);

    autoTable(doc, {
      startY: boxY + boxHeight + 8,
      head: [["Item Description", "Unit Price", "Qty", "Total"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [55, 65, 81],
        fontStyle: "bold",
        fontSize: 8.5,
      },
      bodyStyles: {
        textColor: [31, 41, 55],
        fontSize: 8.5,
      },
      columnStyles: {
        0: { cellWidth: 85, halign: "left" },
        1: { cellWidth: 30, halign: "right" },
        2: { cellWidth: 20, halign: "right" },
        3: { cellWidth: 47, halign: "right", fontStyle: "bold" },
      },
      margin: { left: 14, right: 14 },
    });

    // @ts-expect-error - autotable attaches lastAutoTable to doc
    const finalY = (doc.lastAutoTable?.finalY as number) || 140;

    // 5. Totals Summary Breakdown (Right Aligned)
    const summaryX = 120;
    let currentY = finalY + 8;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedTextColor);

    // Subtotal
    doc.text("Subtotal", summaryX, currentY);
    doc.text(formatCurrency(itemsSubtotal, order.currency), 196, currentY, { align: "right" });
    currentY += 5.5;

    // Delivery Fee
    doc.text("Delivery Fee", summaryX, currentY);
    doc.text(
      deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee, order.currency),
      196,
      currentY,
      { align: "right" }
    );
    currentY += 5.5;

    // Line Divider
    doc.setDrawColor(34, 34, 34);
    doc.setLineWidth(0.8);
    doc.line(summaryX, currentY, 196, currentY);
    currentY += 7;

    // Grand Total
    doc.setFontSize(11.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkInkColor);
    doc.text("Grand Total", summaryX, currentY);
    doc.text(formatCurrency(order.total, order.currency), 196, currentY, { align: "right" });

    // 6. Footer Notes
    const footerY = Math.max(currentY + 22, 260);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkInkColor);
    doc.text("Payment & Tax Information", 14, footerY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedTextColor);
    doc.text(
      `Status: ${order.status === "cancelled" ? "Cancelled / Refunded" : "Paid in Full"} | Prices include applicable Pacific trade taxes and merchant fees.`,
      14,
      footerY + 4.5
    );

    // Page Footer Line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.line(14, footerY + 9, 196, footerY + 9);

    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Mauri & Thank you for supporting I-Kiribati artisans and island commerce! — IslandConnects Platform",
      105,
      footerY + 14,
      { align: "center" }
    );

    // 7. Direct File Save Download
    const fileName = `IslandConnects_Invoice_${order.id}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("Failed to generate PDF invoice:", err);
    throw err;
  }
}
