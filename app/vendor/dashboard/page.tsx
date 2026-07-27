"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/store/authStore";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import {
  HiBuildingStorefront,
  HiClipboardDocumentList,
  HiCube,
  HiChatBubbleLeftRight,
  HiPlus,
  HiCalendar,
  HiUser,
  HiMapPin,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

type TimeRange = "7d" | "30d" | "quarter";

interface ChartPointData {
  label: string;
  sublabel: string;
  value: number;
  heightPct: number;
  showLabel?: boolean;
}

// Generate 30 consecutive daily points for 30d view
const generate30Days = (): ChartPointData[] => {
  const points: ChartPointData[] = [];
  const startDate = new Date(2026, 6, 1); // July 1, 2026
  for (let i = 1; i <= 30; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + (i - 1));
    const dayName = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const baseVal = 800 + Math.sin(i * 0.7) * 450 + (i * 45);
    const value = Math.round(baseVal);
    const heightPct = Math.min(98, Math.max(25, Math.round((value / 2500) * 100)));
    const showLabel = i === 1 || i % 5 === 0 || i === 30;
    points.push({
      label: `Day ${i}`,
      sublabel: dayName,
      value,
      heightPct,
      showLabel,
    });
  }
  return points;
};

// Generate 90 consecutive daily points for Quarterly (Q3) view
const generateQuarterDays = (): ChartPointData[] => {
  const points: ChartPointData[] = [];
  const startDate = new Date(2026, 4, 1); // May 1, 2026
  for (let i = 1; i <= 90; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + (i - 1));
    const dayName = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const baseVal = 600 + Math.sin(i * 0.4) * 500 + (i * 28);
    const value = Math.round(baseVal);
    const heightPct = Math.min(98, Math.max(20, Math.round((value / 3200) * 100)));
    // Show x-axis label every 15 days for a clean 90-day layout
    const showLabel = i === 1 || i % 15 === 0 || i === 90;
    points.push({
      label: `Day ${i}`,
      sublabel: dayName,
      value,
      heightPct,
      showLabel,
    });
  }
  return points;
};

const timeRangeData: Record<TimeRange, { label: string; totalSales: string; totalOrders: string; chart: ChartPointData[] }> = {
  "7d": {
    label: "Last 7 Days (Every Single Day)",
    totalSales: "$12,450",
    totalOrders: "48",
    chart: [
      { label: "Day 1", sublabel: "Mon Jul 21", value: 1250, heightPct: 55, showLabel: true },
      { label: "Day 2", sublabel: "Tue Jul 22", value: 890, heightPct: 40, showLabel: true },
      { label: "Day 3", sublabel: "Wed Jul 23", value: 1620, heightPct: 70, showLabel: true },
      { label: "Day 4", sublabel: "Thu Jul 24", value: 1100, heightPct: 50, showLabel: true },
      { label: "Day 5", sublabel: "Fri Jul 25", value: 2150, heightPct: 88, showLabel: true },
      { label: "Day 6", sublabel: "Sat Jul 26", value: 1850, heightPct: 75, showLabel: true },
      { label: "Day 7", sublabel: "Sun Jul 27", value: 2450, heightPct: 98, showLabel: true },
    ],
  },
  "30d": {
    label: "Last 30 Days (Every Single Day)",
    totalSales: "$38,200",
    totalOrders: "142",
    chart: generate30Days(),
  },
  quarter: {
    label: "This Quarter Q3 (Every Single Day - 90 Days)",
    totalSales: "$94,500",
    totalOrders: "380",
    chart: generateQuarterDays(),
  },
};

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function VendorDashboardPage() {
  const { user } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getOrders().then((data) => {
      setRecentOrders(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const activeRangeData = timeRangeData[timeRange];
  const chartPoints = activeRangeData.chart;

  // SVG Area Chart calculations
  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 35;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartUsableWidth = svgWidth - paddingX * 2;
  const chartUsableHeight = svgHeight - paddingTop - paddingBottom;

  const points = chartPoints.map((pt, idx) => {
    const x =
      chartPoints.length > 1
        ? paddingX + (idx / (chartPoints.length - 1)) * chartUsableWidth
        : svgWidth / 2;
    const y = svgHeight - paddingBottom - (pt.heightPct / 100) * chartUsableHeight;
    return { x, y, data: pt };
  });

  // Construct SVG Path Strings
  const strokePath = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaPath = `${strokePath} L ${points[points.length - 1].x} ${
    svgHeight - paddingBottom
  } L ${points[0].x} ${svgHeight - paddingBottom} Z`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">
            Welcome back, {user?.name?.split(" ")[0] || "Vendor"}
          </h2>
          <p className="text-xs text-gray-500">Overview of your storefront performance, orders, and daily sales analytics.</p>
        </div>

        <div className="flex gap-2">
          <Link href="/vendor/products">
            <Button size="sm" leftIcon={<HiPlus className="h-4 w-4" />}>
              Add Product
            </Button>
          </Link>
          <Link href="/vendor/store-settings">
            <Button variant="outline" size="sm">
              Store Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiBuildingStorefront className="h-5 w-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Total Sales</span>
            </div>
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-gray-500">
              {activeRangeData.label}
            </span>
          </div>
          <span className="text-2xl font-bold text-ink">{activeRangeData.totalSales}</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiClipboardDocumentList className="h-5 w-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Total Orders</span>
            </div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-gray-600">
              {activeRangeData.label}
            </span>
          </div>
          <span className="text-2xl font-bold text-ink">{activeRangeData.totalOrders}</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <HiCube className="h-5 w-5 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Active Products</span>
          </div>
          <span className="text-2xl font-bold text-ink">18</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <HiChatBubbleLeftRight className="h-5 w-5 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Pending Reviews</span>
          </div>
          <span className="text-2xl font-bold text-ink">3</span>
        </div>
      </div>

      {/* Day-Wise Sales Overview Area Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <HiCalendar className="h-4 w-4 text-[#FF385C]" />
              Daily Sales Performance Area Chart
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Every single day revenue trendline across <span className="font-semibold text-ink">{activeRangeData.label}</span>
            </p>
          </div>

          {/* Time Range Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-1">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days (Month)" },
              { id: "quarter", label: "Quarter (90 Days)" },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => { setTimeRange(tag.id as TimeRange); setHoveredIndex(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === tag.id
                    ? "bg-[#FF385C] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-200/70 hover:text-ink"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Area Chart Component */}
        <div className="relative w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area Fill Gradient */}
              <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF385C" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#FF385C" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FF385C" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0.25, 0.5, 0.75, 1].map((pct, i) => {
              const gridY = paddingTop + (1 - pct) * chartUsableHeight;
              return (
                <line
                  key={i}
                  x1={paddingX}
                  y1={gridY}
                  x2={svgWidth - paddingX}
                  y2={gridY}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Filled Area */}
            <path d={areaPath} fill="url(#salesAreaGradient)" />

            {/* Top Stroke Line */}
            <path
              d={strokePath}
              fill="none"
              stroke="#FF385C"
              strokeWidth={chartPoints.length > 50 ? "2.5" : "3.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points & Hover States for Every Single Day */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g key={idx} className="cursor-pointer">
                  {/* Vertical Guide Line on Hover */}
                  {isHovered && (
                    <line
                      x1={p.x}
                      y1={paddingTop}
                      x2={p.x}
                      y2={svgHeight - paddingBottom}
                      stroke="#FF385C"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Hit Target for Hover */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={chartPoints.length > 30 ? "5" : "8"}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Main Point Circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? "5" : chartPoints.length > 50 ? "1.8" : chartPoints.length > 20 ? "2.5" : "4"}
                    fill="#FF385C"
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? "2" : "1"}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="transition-all duration-150"
                  />

                  {/* Hover Tooltip/Value Label */}
                  {isHovered && (
                    <g>
                      <rect
                        x={p.x - 35}
                        y={p.y - 30}
                        width="70"
                        height="22"
                        rx="4"
                        fill="#222222"
                      />
                      <text
                        x={p.x}
                        y={p.y - 15}
                        textAnchor="middle"
                        className="fill-white text-[10px] font-bold"
                      >
                        ${p.data.value.toLocaleString()}
                      </text>
                    </g>
                  )}

                  {/* X-Axis Date Labels */}
                  {p.data.showLabel && (
                    <g>
                      <text
                        x={p.x}
                        y={svgHeight - paddingBottom + 16}
                        textAnchor="middle"
                        className="fill-gray-800 text-[10px] font-bold"
                      >
                        {p.data.label}
                      </text>
                      <text
                        x={p.x}
                        y={svgHeight - paddingBottom + 27}
                        textAnchor="middle"
                        className="fill-gray-400 text-[9px]"
                      >
                        {p.data.sublabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Enhanced Recent Incoming Orders Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-ink">Recent Incoming Orders</h3>
            <p className="text-xs text-gray-500">Orders requiring fulfillment or shipment tracking.</p>
          </div>
          <Link href="/vendor/orders" className="text-xs font-semibold text-[#FF385C] hover:underline">
            View All Orders →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="p-3 font-semibold">Order ID</th>
                  <th className="p-3 font-semibold">Customer Name</th>
                  <th className="p-3 font-semibold">Shipping Island</th>
                  <th className="p-3 font-semibold">Items</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-ink">{order.id.toUpperCase()}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 font-semibold text-ink">
                        <HiUser className="h-4 w-4 text-gray-400" />
                        {order.shippingAddress?.fullName || "John Smith"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <HiMapPin className="h-3.5 w-3.5 text-[#FF385C]" />
                        {order.shippingAddress?.city || "Tarawa"}, {order.shippingAddress?.country || "Kiribati"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{order.items.length} item(s)</td>
                    <td className="p-3 font-bold text-ink">{formatCurrency(order.total, order.currency)}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant[order.status] || "default"} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
