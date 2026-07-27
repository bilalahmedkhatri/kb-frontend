This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Status (as of 2026-07-28)

**Kiribati Islands Platform — `islandconnects.com`** — a tourism + handicraft marketplace for Kiribati, built by a solo developer for a local client. Currently in **Phase A: Showpiece** — polishing 5-6 pages against a mock API before wiring the real FastAPI backend.

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind v4 + Radix UI + Zustand + React Query. Atomic-design component system (`src/components/`), 24 routes, mock API (`src/lib/api.ts`).
- **Backend:** FastAPI + SQLModel + PostgreSQL (in `../kb-back-adm`). Scaffolded with auth + a generic `items` module; real domain models (products, stays, guides, vendors, orders, bookings, reviews) built in Phase C.
- **Stack decision:** Next.js + FastAPI + PostgreSQL, custom build (not WordPress). Payment: manual + ANZ Get bank transfer (no live gateway).

---

## 🛠️ Multi-Role Architecture & Backend Integration Guide

The platform supports 3 distinct user roles (`customer`, `vendor`, `admin`) with strict role-based routing and workspace layouts:

### 1. Customer Workspace (`/account/*`)
- **Route Shell**: `AccountLayout.tsx`
- **User Roles**: `customer`, `vendor`, `admin`
- **Pages**:
  - `/account`: SSR Page Shell + 6 CSR Sections (Profile, Emergency Contact, Regional Preferences, Security, Payment Methods, Saved Addresses) with button spinners.
  - `/account/orders`: Customer Order history with search & filter tabs.
  - `/account/orders/[id]`: Secure Order Details page with Base256 URL token, `OrderStatusStepper`, delivery fee, and `jsPDF` invoice download.
  - `/account/bookings`: Customer Stays & Experiences booking inquiries.
  - `/account/saved`: Saved products and stays wishlist.
  - `/account/reviews`: Product & stay reviews.
  - `/account/messages`: Direct messaging.

### 2. Vendor Workspace (`/vendor/*`)
- **Route Shell**: `VendorLayout.tsx`
- **User Roles**: `vendor`, `admin`
- **Pages**:
  - `/vendor/dashboard`: Sales overview, total sales metrics, order count, sales chart, recent incoming orders.
  - `/vendor/products`: Vendor product catalog management, stock editor, status badges (`Active`, `Pending Approval`, `Rejected`), and **"Add New Product"** modal form.
  - `/vendor/orders`: Vendor order fulfillment table with status selector dropdown (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`).
  - `/vendor/store-settings`: Vendor storefront setup (store name, bio, island location, banner image, payout info).

### 3. Admin Workspace (`/admin/*`)
- **Route Shell**: `AdminLayout.tsx`
- **User Roles**: `admin`
- **Pages**:
  - `/admin/dashboard`: Executive summary, platform-wide metrics (Total Users, Products, Stays, Orders), recent vendor registrations.
  - `/admin/products`: Product Moderation Queue with **Approve** (`status="active"`) and **Reject** (`status="rejected"`) controls for newly submitted vendor listings.
  - `/admin/vendors`: Merchant account management & **"Verified Artisan"** badge toggle.
  - `/admin/settings`: Platform monetization settings (commission %, payout schedules, platform moderation rules).

---

## 🔒 Security & Programmatic PDF Invoicing

- **Base256 Token Security**: [src/lib/security.ts](file:///d:/usman/kb-frontend/src/lib/security.ts)
  - `encodeOrderIdBase256("ORD-2024-001")` ➔ `"ord_b256_4f52442d323032342d303031"`
  - `decodeOrderIdBase256("ord_b256_...")` ➔ `"ORD-2024-001"`
- **Programmatic PDF Invoicing**: [src/lib/pdfGenerator.ts](file:///d:/usman/kb-frontend/src/lib/pdfGenerator.ts)
  - Powered by `jsPDF` (`4.2.1`) and `jspdf-autotable` (`5.0.8`).
  - Embeds `/favicon.png` brand logo mark, official wordmark (*"Island"* in `#222222`, *"Connects"* in `#FF385C`), 6% opacity background logo watermark, and 14mm calibrated margins. Saves directly as `IslandConnects_Invoice_${order.id}.pdf`.

#### FastAPI Endpoint Contracts (Phase C):
- `GET /api/v1/orders/{token_or_id}`: Verifies JWT token and user ownership before returning `Order` model payload.
- `PATCH /api/v1/vendor/orders/{id}/status`: Updates order fulfillment status (`pending` ➔ `confirmed` ➔ `shipped` ➔ `delivered`).
- `PATCH /api/v1/admin/products/{id}/moderate`: Updates product moderation status (`active` | `rejected`).

---

## Planning & Design Documents

Read these in order to understand the why, the architecture, and the scope:

1. **`DESIGN.md`** — design system spec (Airbnb/Etsy/CultureTrip patterns, color tokens, responsive behavior).
2. **`instructions/ecommerce-architecture-spec.md`** — architecture spec (24 routes, component boundaries, role system, data-flow patterns).
3. **`instructions/Platform Development and Growth Plan (1).pdf`** — the client-facing 4-phase plan.
4. **`.gstack/projects/kb-frontend/`** (local, not committed) — the reviewed plan docs:
   - `office-hours-design-2026-07-15.md` — office-hours design doc (4-phase sequence, payment flow, open questions)
   - `plan-eng-review-2026-07-15.md` — engineering review (12 locked architecture decisions)
   - `ceo-plans/2026-07-15-kiribati-platform.md` — CEO plan (scope mode, accepted expansions, hour ceilings)
   - `plan-ceo-review-findings-2026-07-15.md` — 11-section review findings + TODOS list

## Getting Started

First, run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
