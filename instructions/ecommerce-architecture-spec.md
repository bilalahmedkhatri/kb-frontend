# E-Commerce Platform — Technical Architecture Specification

Stack assumed: **Next.js (App Router) + TypeScript + Tailwind CSS + React Query (server-state/caching) + Zustand (client-state) + Radix UI primitives**. Examples below are written for this stack but the component boundaries hold for any React-based build. Where relevant, examples reference the Stay / Shop / Explore domains from your platform (hotels = "stays," handicrafts = "products," vendors = "artisans/hosts").

---

## 1. Page Structure & Quantity

**24 pages/routes** cover the complete flow. Grouped by function:

### 1.1 Public / discovery (7)
| # | Route | Purpose | Core functionality |
|---|---|---|---|
| 1 | `/` | Homepage | Hero search, featured categories, curated product/stay rails, editorial teaser |
| 2 | `/search` | Search results | Full-text query results across products + stays, spelling suggestions |
| 3 | `/category/[slug]` | Category / listing page | Filtered grid for one category (e.g. "Jewelry"), sidebar filters, sort, pagination |
| 4 | `/product/[id]` | Product detail | Gallery, variant selector, price, add-to-cart, reviews, related items |
| 5 | `/stay/[id]` | Stay detail | Gallery, calendar availability, guest stepper, "reserve/inquire" flow |
| 6 | `/guides` | Editorial index | Culture-Trip-style tag-filtered story grid |
| 7 | `/guides/[slug]` | Story detail | Long-form article, related stories, embedded listings |

### 1.2 Transaction flow (5)
| # | Route | Purpose | Core functionality |
|---|---|---|---|
| 8 | `/cart` | Cart | Line items, quantity edit, promo code, subtotal, saved-for-later |
| 9 | `/checkout` | Checkout | Shipping/contact info, payment method select, order summary (multi-step) |
| 10 | `/checkout/confirmation` | Order confirmation | Order number, receipt summary, next-steps messaging |
| 11 | `/booking/[id]/confirmation` | Booking confirmation | Inquiry sent state, host response expectations |
| 12 | `/wishlist` | Saved items | Cross-session saved products/stays, quick add-to-cart |

### 1.3 Authentication (4)
| # | Route | Purpose |
|---|---|---|
| 13 | `/login` | Session start for any role |
| 14 | `/signup` | Account creation, role selection (customer vs. apply-as-vendor) |
| 15 | `/forgot-password` | Reset request |
| 16 | `/reset-password/[token]` | New password submission |

### 1.4 Customer account (4)
| # | Route | Purpose |
|---|---|---|
| 17 | `/account` | Profile info, saved addresses, payment methods |
| 18 | `/account/orders` | Order history list |
| 19 | `/account/orders/[id]` | Single order detail, tracking, reorder, review prompt |
| 20 | `/account/reviews` | Reviews the customer has submitted / is eligible to submit |

### 1.5 Vendor workspace (4) — auth-gated, `role=vendor`
| # | Route | Purpose |
|---|---|---|
| 21 | `/vendor/dashboard` | Sales summary, pending-approval alerts, quick actions |
| 22 | `/vendor/products` | Product list + create/edit form (modal or `/vendor/products/[id]/edit`), stock management |
| 23 | `/vendor/orders` | Incoming orders, fulfillment status updates |
| 24 | `/vendor/store-settings` | Storefront customization: banner, bio, verification status |

> Admin moderation (approve/reject listings) reuses `/vendor/products` and `/vendor/orders` patterns under an `/admin/*` route group with elevated permissions rather than a separate design — see §4.3.

---

## 2. Component Architecture

### 2.1 Directory structure (atomic design + colocated logic)

```
/src
  /components
    /atoms          # smallest, style-only building blocks
      Button.tsx
      Input.tsx
      Badge.tsx
      Rating.tsx
      Spinner.tsx
      Avatar.tsx
      Checkbox.tsx
      IconButton.tsx
      Skeleton.tsx
    /molecules      # atoms composed with light logic
      ProductCard.tsx
      StayCard.tsx
      SearchBar.tsx
      NavItem.tsx
      QuantityStepper.tsx
      PriceRangeInput.tsx
      TagPill.tsx
      SortSelect.tsx
      DatePickerField.tsx
    /organisms      # feature-level, composed of molecules + state
      Header.tsx
      Footer.tsx
      ProductGrid.tsx
      FilterSidebar.tsx
      ReviewList.tsx
      BookingModal.tsx
      CartDrawer.tsx
      CategoryTabBar.tsx
    /templates      # page skeletons: layout only, content passed as children/slots
      MarketplaceLayout.tsx
      AccountLayout.tsx
      VendorLayout.tsx
      CheckoutLayout.tsx
  /app              # Next.js route segments (pages), each imports templates + organisms
    /product/[id]/page.tsx
    /vendor/dashboard/page.tsx
    ...
  /hooks
    useCart.ts
    useProductFilters.ts
    useInfiniteProducts.ts
    useAuth.ts
    useMediaQuery.ts
    useDebounce.ts
  /lib
    api.ts          # fetch wrappers
    queryClient.ts
    permissions.ts
  /store
    cartStore.ts     # Zustand
    filterStore.ts
    uiStore.ts       # modals, drawers, toasts
  /types
    product.ts
    order.ts
    user.ts
```

**Rule enforced by this structure:** a component is written once at its correct layer and every page imports it — no page defines its own inline button, card, or filter markup. Layer boundaries are one-directional: atoms never import molecules; templates never contain business logic, only slots.

### 2.2 Example component interfaces (props contracts)

```ts
// atoms/Button.tsx
type ButtonProps = {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
};

// molecules/ProductCard.tsx
type ProductCardProps = {
  product: Product;               // shared type, see §3
  variant?: 'grid' | 'list';      // reused for both view modes, no duplicate card
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
};

// organisms/ProductGrid.tsx
type ProductGridProps = {
  products: Product[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onLoadMore?: () => void;        // wired to infinite scroll hook
  emptyState?: React.ReactNode;   // slot, so grid is reusable for products, stays, or orders
};

// organisms/FilterSidebar.tsx
type FilterSidebarProps = {
  categories: FilterOption[];
  priceRange: [number, number];
  onChange: (filters: ActiveFilters) => void;
  layout?: 'sidebar' | 'bottom-sheet'; // same component drives desktop sidebar and mobile sheet
};
```

Every component that varies visually (Button, Badge, ProductCard, TagPill) takes a `variant` prop mapped through a single `cva()` (class-variance-authority) style map colocated in the component file — one file is the single source of truth for that component's every visual state, so a new variant is one line, not a new component.

### 2.3 Reusable hooks & utilities

| Hook / util | Responsibility |
|---|---|
| `useCart()` | Read/write cart line items (wraps `cartStore`), exposes `add`, `remove`, `updateQty`, `subtotal` |
| `useProductFilters()` | Reads/writes active filters (wraps `filterStore`), returns query-string-serializable state so filters are shareable/bookmarkable URLs |
| `useInfiniteProducts(params)` | Wraps React Query's `useInfiniteQuery`, returns `products, isLoading, fetchNextPage, hasMore` — used by product grid, stay grid, and vendor's own product list identically |
| `useAuth()` | Current user, role, `login/logout`, `hasPermission(action)` |
| `useMediaQuery(breakpoint)` | Boolean for current breakpoint match, backs all responsive branching (e.g., sidebar vs. bottom sheet) |
| `useDebounce(value, ms)` | Used by search input and price-range fields to avoid firing a request per keystroke |
| `formatCurrency(amount, currency)` | Single formatting utility — never inline `$${price}` in a component |
| `permissions.ts` | Pure functions: `canEditProduct(user, product)`, `canViewVendorDashboard(user)` — imported by both UI conditionals and API route guards, so the rule is defined once and enforced on both sides |

---

## 3. Product Data Management

### 3.1 Single-request loading strategy

- Each listing page issues **one** network request per state change (filters, sort, page), via a typed API endpoint (e.g. `GET /api/products?category=jewelry&sort=price-asc&cursor=...`) — filters, sort, and pagination are query parameters on the same endpoint, not separate calls.
- React Query caches by a **query key that encodes every parameter**: `['products', { category, sort, priceRange, cursor }]`. Navigating back to an identical filter state (e.g. via browser back button) reads from cache instantly instead of refetching.
- `staleTime` of ~60s on product lists (inventory/price can drift) and `Infinity` for largely-static data like category metadata.
- Product detail pages prefetch on hover/viewport-intersection from the grid (`queryClient.prefetchQuery`) so the detail page frequently renders from warm cache.

```ts
type Product = {
  id: string; name: string; price: number; currency: string;
  images: string[]; category: string; vendorId: string; vendorName: string;
  rating: number; reviewCount: number; stock: number; status: 'active'|'pending'|'rejected';
};
```

### 3.2 View management

- **Grid vs. list** is a single boolean/enum in `filterStore` (`viewMode`), read by `ProductGrid` and passed to `ProductCard` as the `variant` prop — one card component renders both layouts via CSS, not two components.
- **Filtering & sorting**: `filterStore` holds `{ categories: string[], priceRange: [number,number], sort: SortKey }`; every change updates the URL query string (via `useProductFilters`) so filtered views are shareable and back/forward-navigable.
- **Pagination strategy**: cursor-based (not offset) for stability under concurrent inventory changes. Desktop defaults to page-numbered pagination for catalog browsing (predictable, revisitable); mobile category feeds default to **infinite scroll** via `useInfiniteProducts` + an `IntersectionObserver` sentinel — matching how people actually scroll on a phone versus tap page numbers.
- Skeleton loading states (`atoms/Skeleton.tsx`) render immediately on filter change so the grid never flashes blank.

### 3.3 Selection, cart, and inventory sync

- **Cart state** lives in `cartStore` (Zustand, persisted to `localStorage` for guests, synced to server on login): `{ items: CartItem[], addItem, removeItem, updateQty }`.
- **Optimistic updates**: adding to cart updates local state immediately; a background mutation confirms against live stock. If the server rejects (out of stock), a toast reverts the optimistic change and flags the specific line item — no full-cart reload needed.
- **Inventory sync**: product `stock` is revalidated (`refetchOnWindowFocus` + short `staleTime`) at cart and checkout so a vendor's stock change while a customer is deciding is caught before payment, not after.
- Selecting product variants (size/color) is local component state in `ProductDetail`, lifted to cart only on "Add to cart," keeping variant-selection UI stateless and reusable across product types.

---

## 4. User Role Architecture

### 4.1 Roles

| Role | Description |
|---|---|
| **Guest** | Unauthenticated; can browse, search, add to cart (local only) |
| **Customer** | Authenticated buyer; cart persists, can purchase, review, wishlist, track orders |
| **Vendor** | Authenticated seller; everything Customer has, plus product/inventory/order-fulfillment management scoped to their own store |
| **Admin** | Platform owner; moderation queue, approve/reject listings, full visibility across vendors |

### 4.2 Vendor workflow

`/vendor/dashboard` → sales summary + pending items → `/vendor/products` (create/edit/stock) → new listing saved as `status: 'pending'` → appears in Admin moderation queue → on approval, `status: 'active'`, now visible in public grids → `/vendor/orders` for fulfillment status updates → `/vendor/store-settings` for storefront branding (banner image, bio, verification badge).

### 4.3 Customer workflow

Browse (`/`, `/category`, `/search`) → product/stay detail → cart or booking inquiry → checkout → confirmation → `/account/orders` for tracking → post-delivery prompt to leave a review (`/account/reviews`) → `/wishlist` persists across sessions for saved-but-undecided items.

### 4.4 Auth, authorization, and route protection

- **Session**: JWT (access + refresh token) or framework session cookie; `useAuth()` exposes `{ user, role, isLoading }` client-side.
- **Route protection**: Next.js middleware (`middleware.ts`) inspects the route prefix against a role map before rendering:

```ts
const routeRoleMap: Record<string, Role[]> = {
  '/vendor': ['vendor', 'admin'],
  '/admin': ['admin'],
  '/account': ['customer', 'vendor', 'admin'],
};
// unauthenticated or wrong-role → redirect to /login or /403
```

- **API-level authorization mirrors the client check** (`permissions.ts` functions imported on both sides) — client-side role checks only drive UI, they are never the sole gate; every mutating API route re-validates `canEditProduct(user, product)` etc. server-side.
- **UI adaptation by role**: `Header` renders a "Become a vendor" CTA for customers, a "Vendor dashboard" link for vendors, and a "Moderation" link for admins — driven by one `navItemsForRole(role)` function, not three duplicated header variants.

---

## 5. Container & Responsive Design System

### 5.1 Breakpoints

| Name | Width | Layout behavior |
|---|---|---|
| `sm` (mobile) | < 640px | 1–2 col grids, bottom-sheet filters, hamburger nav, full-screen modals |
| `md` (tablet) | 640–1024px | 2–3 col grids, sidebar filters collapse to a toggleable drawer |
| `lg` (desktop) | 1024–1440px | 3–4 col grids, persistent sidebar, full nav bar |
| `xl` (wide) | > 1440px | Content stays capped at max-width; extra space becomes margin, not stretched cards |

### 5.2 Container strategy

```css
.container { max-width: 1120px; margin-inline: auto; padding-inline: 24px; }
```
A single `<Container>` component wraps every page's content region; no page hardcodes its own max-width. Full-bleed sections (hero banners) intentionally break out of `<Container>` by wrapping only their inner content, keeping the rule explicit rather than accidental.

Grids use CSS Grid with `repeat(auto-fill, minmax(240px, 1fr))` for the wide breakpoint so cards reflow by available space rather than a hardcoded column count breaking at odd viewport widths, with explicit column-count overrides at `sm`/`md`/`lg` for predictable rhythm on the common device sizes.

### 5.3 Mobile-specific interaction patterns

- **Filters**: `FilterSidebar` renders as a persistent column at `lg`+, and as a `BottomSheet` (Radix Dialog + slide-up transform) triggered by a "Filters" button at `sm`/`md` — same filter-state logic, two presentation shells, chosen by `useMediaQuery`.
- **Navigation**: hamburger menu at `sm` opens a full-screen `MobileNav` overlay; the same `navItemsForRole()` data drives both the desktop header links and the mobile overlay list.
- **Swipe gestures**: product image galleries use touch-swipe (via a lightweight carousel lib) on `sm`/`md`; desktop shows a filmstrip of thumbnails instead — one `Gallery` component switches interaction mode by breakpoint, not two components.
- **Booking/checkout modals**: become full-screen sheets under `sm` (matching the pattern already used in the platform's booking modal) rather than a centered dialog that would crowd a small viewport.

### 5.4 Image optimization & performance

- All images served through a responsive image component (Next/Image or equivalent) with `srcset` generation, WebP/AVIF fallback, and explicit `width`/`height` to prevent layout shift.
- **Lazy loading** by default for any image below the fold; hero/first-grid-row images are eagerly loaded with `priority` to protect LCP.
- Product grid uses skeleton placeholders sized to the final card aspect ratio (no CLS on load).
- Infinite scroll batches fetch 20–24 items per page to bound payload size on mobile data connections; images use lower-resolution variants at `sm` breakpoints via responsive `srcset`.

### 5.5 Accessibility

- All interactive atoms (`Button`, `Input`, `Checkbox`) built on Radix primitives for correct ARIA roles, keyboard operability, and focus management out of the box.
- Visible focus outline preserved (never `outline: none` without a replacement focus style) across every component and breakpoint.
- Color contrast checked against the platform's token palette (§ visual system from prior spec) at WCAG AA minimum for text/background pairs.
- Bottom sheets and mobile nav trap focus while open and restore focus to the trigger element on close.
- Form fields (checkout, product creation) always paired with a `<label>` and inline error text tied via `aria-describedby`, not color alone.

---

## 6. Summary of enforced principles

1. **One file, one component, every context** — atoms/molecules/organisms are written once and imported everywhere; variants are props, never copies.
2. **One data-fetching pattern** — a single parameterized endpoint + React Query cache key per resource type, reused by grids, infinite scroll, and prefetch.
3. **One permission source** — `permissions.ts` functions drive both UI conditionals and API guards, so a rule is never defined twice (and never drifts).
4. **One responsive contract** — `useMediaQuery` + shared breakpoint tokens decide *presentation shell* (sidebar vs. sheet, dialog vs. full-screen) while the underlying component and state stay identical.
