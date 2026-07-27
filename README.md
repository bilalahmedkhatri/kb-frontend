This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Status (as of 2026-07-27)

**Kiribati Islands Platform - `islandconnects.com`** - a tourism + handicraft marketplace for Kiribati, built by a solo developer for a local client. Currently in **Phase A: Showpiece** - polishing 5-6 pages against a mock API before wiring the real FastAPI backend.

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind v4 + Radix UI + Zustand + React Query. Atomic-design component system (`src/components/`), 24 routes, mock API (`src/lib/api.ts`).
- **Backend:** FastAPI + SQLModel + PostgreSQL (in `../kb-back-adm`). Scaffolded with auth + a generic `items` module; real domain models (products, stays, guides, vendors, orders, bookings, reviews) built in Phase C.
- **Stack decision:** Next.js + FastAPI + PostgreSQL, custom build (not WordPress). Payment: manual + ANZ Get bank transfer (no live gateway).

---

## 🛠️ Architecture & Backend Integration Guide

### 1. Account Page (`/account`) - SSR Shell + CSR Modular Sections
The Account dashboard page ([app/account/page.tsx](file:///d:/usman/kb-frontend/app/account/page.tsx)) uses a **Server Component (SSR)** shell assembling 6 isolated **Client Components (CSR)** under `app/account/_components/`:
- **`ProfileSection.tsx`**: Personal info, avatar, name, bio. Async button spinner (`savingProfile`).
- **`EmergencyContactSection.tsx`**: Island travel emergency contact info. Async button spinner (`savingEmergency`).
- **`RegionalPreferencesSection.tsx`**: Currency, language, timezone dropdowns. Async spinner (`savingPreferences`).
- **`SecuritySection.tsx`**: Password change (`savingPassword`), 2FA toggle, active sessions (`loggingOutDevices`).
- **`PaymentMethodsSection.tsx`**: Credit cards list, add card form (`addingCard`), default card toggle (`settingDefaultId`).
- **`SavedAddressesSection.tsx`**: Delivery address management (`addingAddress`).

### 2. Order Details Page (`/account/orders/[id]`) & Programmatic PDF Invoicing
Order URLs use **Base256 Token Encoding** rather than raw sequential IDs to prevent IDOR scanning vulnerabilities.

- **Route Location**: [app/account/orders/[id]/page.tsx](file:///d:/usman/kb-frontend/app/account/orders/[id]/page.tsx)
- **Base256 Token Security**: [src/lib/security.ts](file:///d:/usman/kb-frontend/src/lib/security.ts)
  - `encodeOrderIdBase256("ORD-2024-001")` ➔ `"ord_b256_4f52442d323032342d303031"`
  - `decodeOrderIdBase256("ord_b256_...")` ➔ `"ORD-2024-001"`
- **Programmatic PDF Generation**: [src/lib/pdfGenerator.ts](file:///d:/usman/kb-frontend/src/lib/pdfGenerator.ts)
  - Built with `jsPDF` (`4.2.1`) and `jspdf-autotable` (`5.0.8`).
  - Generates vector PDF document in memory and saves directly as `IslandConnects_Invoice_${order.id}.pdf` with **zero `window.print()` or browser popups**.
- **App Router Boundaries**:
  - `loading.tsx`: Skeleton loader during order fetch.
  - `not-found.tsx`: Clean 404 / Unauthorized order card if token is invalid or user ownership check fails (`order.userId !== currentUser.id`).
  - `error.tsx`: Runtime error boundary.

#### FastAPI Endpoint Expectations (Phase C):
- **`GET /api/v1/orders/{token_or_id}`**:
  - Decodes Base256 token and verifies JWT auth user ownership.
  - Returns `Order` payload: `{ id, userId, items: [...], total, currency, status, shippingAddress, deliveryFee, createdAt, updatedAt }`.

---

## Planning & Design Documents

Read these in order to understand the why, the architecture, and the scope:

1. **`DESIGN.md`** - design system spec (Airbnb/Etsy/CultureTrip patterns, color tokens, responsive behavior).
2. **`instructions/ecommerce-architecture-spec.md`** - architecture spec (24 routes, component boundaries, role system, data-flow patterns).
3. **`instructions/Platform Development and Growth Plan (1).pdf`** - the client-facing 4-phase plan.
4. **`.gstack/projects/kb-frontend/`** (local, not committed) - the reviewed plan docs:
   - `office-hours-design-2026-07-15.md` - office-hours design doc (4-phase sequence, payment flow, open questions)
   - `plan-eng-review-2026-07-15.md` - engineering review (12 locked architecture decisions)
   - `ceo-plans/2026-07-15-kiribati-platform.md` - CEO plan (scope mode, accepted expansions, hour ceilings)
   - `plan-ceo-review-findings-2026-07-15.md` - 11-section review findings + TODOS list

**Locked decisions:** 12 architecture decisions (see eng-review doc), payment = manual + ANZ Get, domain = `islandconnects.com`, AUD-only at MVP, cursor pagination, R2 for images, delete `items` module in Phase C.

## Getting Started

First, run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
