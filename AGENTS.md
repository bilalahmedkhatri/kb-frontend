# Kiribati Islands Platform (`islandconnects.com`) - AI Agent Coding & Architecture Rules

This document defines the mandatory architectural principles, design system tokens, atomic component rules, interaction-state requirements, and future component creation protocols for the Kiribati Islands Platform (`islandconnects.com`). Every AI agent working in this repository MUST adhere to these rules without exception.

---

## 0. Next.js 16 & Modern Stack Mandates

- **Next.js 16 App Router**: This version has breaking changes - APIs, conventions, and file structure differ from older Next.js versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing code and heed all deprecation notices.
- **React 19 & Tailwind CSS v4**: Use React 19 standards and Tailwind CSS v4 conventions. Do not use legacy v3 utility syntax where v4 differs.
- **Core Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI primitives, Zustand (`src/store/`), React Query (`@tanstack/react-query`), TypeScript.

---

## 1. Locked Architectural Decisions (Non-Negotiable)

The following 12 architectural decisions are locked and MUST NOT be modified or violated by any AI agent:

| # | Domain Area | Locked Decision |
|---|---|---|
| 1 | **Stack** | Next.js 16 (App Router) + FastAPI + SQLModel + PostgreSQL (`../kb-back-adm`). Custom build (never WordPress or monolithic CMS). |
| 2 | **Domain** | Primary brand and domain is `islandconnects.com`. "Island Connects" is the wordmark ("Kiribati" is the locale subtitle, never the standalone brand wordmark). |
| 3 | **Payment Model** | Manual inquiry-based booking + ANZ Get bank transfer. There is NO live payment gateway or instant card capture at MVP. |
| 4 | **Currency** | AUD-only at MVP. |
| 5 | **Pagination** | Cursor-based pagination for catalog stability under concurrent inventory changes. Mobile category feeds use **infinite scroll** via IntersectionObserver. |
| 6 | **Image Storage** | Cloudflare R2 for all image assets. |
| 7 | **Roles & Auth** | Explicit 4-role system: **Guest** (unauthenticated), **Customer** (buyer), **Vendor** (seller/artisan), and **Admin** (platform moderator). |
| 8 | **Backend Modules** | Delete generic `items` scaffold in Phase C; use domain models (products, stays, guides, vendors, orders, bookings, reviews). |
| 9 | **Atomic Design** | Strict separation of `src/components/` into `atoms`, `molecules`, `organisms`, and `templates`. |
| 10 | **Route Count** | Exactly 24 core routes across Discovery (7), Transaction (5), Auth (4), Customer Account (4), and Vendor Workspace (4), plus `/admin/*` moderation. |
| 11 | **Responsive Contract** | One component, one state, responsive presentation shells (e.g. sidebar at desktop, slide-up BottomSheet at mobile). |
| 12 | **Scope Expansions** | Accepted core features include WhatsApp-click-to-inquire, artisan story clips (vendor video), and the `guides` tourism editorial CMS. |

---

## 2. Design System & Visual Token Mandates

### 2.1 Mapped References
- **Airbnb**: Search bar (pill-shaped `TripSearch`), date range picker, guest stepper, category tab bar (`CategoryTabBar`), inquiry modal flow.
- **Etsy**: Marketplace sidebar filters (`FilterSidebar`), product cards with artisan/shop trust foregrounded.
- **Culture Trip**: Editorial/guides grid (asymmetric feature tile + tag pills + dark image-overlay captions).

### 2.2 Strict Token Mandate (ZERO HARDCODED HEX RULE)
- All styles MUST use CSS variables defined in `app/globals.css` (`:root`) via Tailwind theme tokens (`bg-rausch`, `text-ink`, `border-line`, etc.) or `var(--token)`.
- **NEVER use arbitrary inline hex colors** (e.g., `[#DDDDDD]`, `[#222222]`, `[#FF385C]`) in component `className` attributes. Any inline hex color is considered a lint/rule violation and must be refactored immediately.
- **Color Tokens**:
  - `--rausch: #FF385C` - Primary accent (primary CTAs, active price/tag emphasis).
  - `--rausch-dark: #E31C5F` - Primary button hover/pressed state.
  - `--babu: #00A699` - Secondary teal accent (verified vendor badge, trust cues).
  - `--ink: #222222` - Primary text, active/selected tabs and pills.
  - Neutral scale: `--gray-700`, `--gray-500`, `--gray-300`, `--gray-200`, `--gray-100`, `--gray-50`, `--white`.
- **Typography**: Inter is the documented typeface substitution for Airbnb Cereal. Headings use 800 weight with tight letter-spacing (`-0.02em`). Body/meta pair a bold title with a quiet `--gray-500` subtitle line.

---

## 3. Atomic Component Architecture & Design Patterns

### 3.1 Hierarchy & Boundaries
- `atoms/`: Style-only, single-purpose building blocks (`Button`, `Input`, `Badge`, `Rating`, `Spinner`, `Skeleton`, `WhatsAppInquireButton`).
- `molecules/`: Composed atoms with light domain display logic (`ProductCard`, `StayCard`, `TripSearch`, `ArtisanStoryClip`, `QuantityStepper`, `TagPill`).
- `organisms/`: Feature-level sections with state and event handlers (`Header`, `Footer`, `FilterSidebar`, `BookingModal`, `CartDrawer`, `CategoryTabBar`).
- `templates/`: Stateless page skeletons defining layout slots (`MarketplaceLayout`, `AccountLayout`, `VendorLayout`).

### 3.2 Core Architectural Principles
1. **One file, one component, every context**: Never create duplicate component files for different views. Variants must be driven by props (e.g., `variant="grid" | "list"` in `ProductCard`).
2. **One responsive contract**: Use `useMediaQuery` + breakpoint tokens (`sm`, `md`, `lg`, `xl`) to switch presentation shells (e.g., filter sidebar on desktop vs. full-screen sheet on mobile) while preserving identical state logic.
3. **One permission source**: Client-side UI adaptation (`navItemsForRole(role)`) and API guards must both derive from single permission helpers in `permissions.ts`. Never hardcode role checks in multiple places.

---

## 4. Mandatory Interaction States (Zero-Swallowed-Error Rule)

Every data-bearing component or page MUST explicitly implement all five interaction states. **Silently swallowing errors (`catch {}`) or returning `null` on error/empty is a critical bug.**

| State | Mandatory UI Requirement |
|---|---|
| **Loading** | Render skeleton placeholders (`atoms/Skeleton.tsx`) sized to the exact aspect ratio of the loaded content to prevent Cumulative Layout Shift (CLS). |
| **Empty** | Warm, user-friendly message explaining why it is empty + one clear primary action CTA (e.g. "Browse all stays" or "Add your first listing"). Never render a blank screen. |
| **Error** | Visible, recoverable error card with explanatory text and a clickable **"Retry"** button. Never fail to a blank page. |
| **Success** | Cleanly rendered content or confirmation toast/modal. |
| **Partial** | When an individual item or secondary rail fails, display loaded rails normally and show a quiet inline fallback note for the failed section. |

---

## 5. Single Data-Fetching Pattern & Phase C (FastAPI Backend Wiring)

### 5.1 State & Fetching Separation
- **Server State & Caching**: All server-side data fetching, caching, and background revalidation MUST use **React Query** (`@tanstack/react-query`) via dedicated custom hooks in `src/hooks/` (e.g., `useInfiniteProducts`, `useProductFilters`).
- **Client-Only State**: All local/ephemeral UI state (cart drawer, active filters, modal open states) MUST use **Zustand** (`src/store/`, e.g., `cartStore`, `filterStore`).
- **No Ad-Hoc Component Fetches**: NEVER write raw `fetch()` or `axios` calls directly inside UI component files. All API calls must be encapsulated within React Query hooks or `src/lib/api.ts`.

### 5.2 Phase C API Integration Protocol
- During Phase C, AI agents will replace mock functions in `src/lib/api.ts` with REST calls to the real **FastAPI** backend (`../kb-back-adm`).
- **Schema Verification**: Before modifying API calls or types, agents MUST inspect the live FastAPI OpenAPI schema (`http://localhost:8000/openapi.json`) or PostgreSQL schema using MCP tools (`postgres`, `fastapi-openapi`) to guarantee that frontend TypeScript interfaces in `src/types/index.ts` match backend SQLModel schemas 1-to-1.

---

## 6. Future Component Creation Protocol & Scaffolding Checklist

When creating or refactoring ANY future component or page, AI agents MUST follow this sequential checklist:

```markdown
### Component Scaffolding Checklist
- [ ] **1. Layer Placement**: Placed in the correct directory (`atoms`, `molecules`, `organisms`, or `templates`).
- [ ] **2. TypeScript Interface**: Exported prop interface with descriptive documentation; visual layouts use props (no cloned components).
- [ ] **3. Strict Token Check**: No inline `[#...]` arbitrary hex colors; colors use `--rausch`, `--ink`, `--babu`, or Tailwind semantic theme classes.
- [ ] **4. Radix UI & Accessibility**: Interactive controls built on Radix UI primitives; visible keyboard focus outline (`focus-visible`) preserved; form inputs paired with `<label>` and ARIA descriptions.
- [ ] **5. Mandatory Interaction States**: Async/data-bearing UI explicitly renders Skeleton (Loading), Warm CTA (Empty), and Recoverable Retry Card (Error) states.
- [ ] **6. Responsive Shells**: Verified behavior across Mobile (`sm`), Tablet (`md`), and Desktop (`lg`/`xl`) using responsive presentation shells.
```

### 6.1 Guidelines for Planned Future Modules
- **Stays & Booking Inquiry (`/stay/*`, `/booking/*`)**:
  - Keep booking inquiry multi-step modal sheet stateless regarding payment capture; final step sends an inquiry for manual ANZ Get bank transfer.
- **Vendor Portal & Marketplace (`/vendor/*`)**:
  - New product listings must default to `status: 'pending'` until reviewed by an admin.
  - Integrate `ArtisanStoryClip.tsx` for vendor video stories and `WhatsAppInquireButton.tsx` for instant direct inquiry.
- **Admin Moderation (`/admin/*`)**:
  - Reuse vendor product/order components with elevated permission flags from `permissions.ts`.
- **Island Guides CMS (`/guides/*`)**:
  - Maintain Culture-Trip asymmetric magazine layouts; use topic-tag pills (`TagPill.tsx`) for filtering cultural and travel stories.
