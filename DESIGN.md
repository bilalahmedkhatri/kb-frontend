# Kiribati Islands Platform — Design Specification (`Island Connects`)

Companion design specification for **Island Connects (`islandconnects.com`)**. This document maps every UI component to its reference design site, defines the Airbnb-mapped visual token system, documents responsive behaviors, interaction states, and lists the complete 41-route application structure.

---

## 1. Which reference site drives which component

| Component | Reference site | Why that source |
|---|---|---|
| Top search bar (Where / Check-in–out / Who, pill-shaped, click-to-expand dropdowns) | **Airbnb** | Airbnb's three-segment pill is the standard for "one search bar, three linked decisions" — it keeps location, dates, and party size visible at once without a full-page detour, matching your booking-inquiry use case. |
| Date range picker (click start date, click end date, range highlights) | **Airbnb** | Airbnb's calendar avoids a "from/to" pair of separate text fields; a single connected calendar communicates the *stay* as one span, which is more legible for a lodging product than two date inputs. |
| Guest counter (stepper +/-, split Adults/Children) | **Airbnb** | Numeric steppers avoid free-text guest entry errors and match how Airbnb (and most booking flows) captures occupancy for pricing/capacity checks. |
| Category tab bar (icon + label, underline on active, horizontal scroll on mobile) | **Airbnb** | Airbnb's homepage category rail pattern, repurposed as primary top-level navigation between Stays / Marketplace / Experiences / Guides — lets one destination hold multiple content types cleanly. |
| Marketplace sidebar filters (category checkboxes, price min/max, vendor rating, sort dropdown) | **Etsy** | Etsy's search-results page is the strongest model for a multi-vendor product catalog: persistent left-rail filters + a sortable grid for handmade craft items. |
| Product cards (image-forward, vendor name as secondary line, star rating, price) | **Etsy** | Etsy foregrounds the maker/shop name under the product image because trust in the *seller* matters as much as the item — directly relevant for local-artisan credibility. |
| Editorial/guides grid (asymmetric feature + smaller tiles, topic-tag filter pills, dark image-overlay captions) | **Culture Trip** | Culture Trip's magazine layout is built for browsing stories rather than transacting — asymmetric grid with tall feature tiles and topic pills (Culture / Food / History). |
| Cultural Experiences & Workshop Grid (`/experiences`) | **Airbnb Experiences & Viator** | 16:9 widescreen cards featuring duration, group size, local host identity, and direct WhatsApp inquiry CTA for workshop reservations (e.g. Pandanus Weaving, Canoe Fishing). |
| Artisan Story Clips (`ArtisanStoryClip`) | **TikTok / Instagram Story Shorts** | Interactive video modal preview card showcasing master Kiribati craftswomen hand-weaving crafts with provenance quotes and eco-badges. |
| Atoll Island Explorer (`IslandExplorer`) | **Airbnb Destination Pills / Maps** | Interactive island selector (South Tarawa, Kiritimati, Abemama, Tabiteuea North) featuring atoll highlights and stay/craft/guide counts. |
| Informational Help Center (`InfoLayout`) | **Stripe / Airbnb Help Center** | Reusable 11-route help center layout with persistent sidebar navigation and hero header card (`/about`, `/contact`, `/faqs`, `/privacy`, `/terms`, etc.). |
| Admin Monetization & Commission Panel (`/admin/settings`) | **Shopify Admin Settings** | Configurable global booking & sales commission percentage input with live revenue split projection calculator. |
| Booking inquiry flow (multi-step modal: dates & guests → contact details → review & send) | **Airbnb** | Reservation flow breaking commitment into small, reversible steps with a visible progress indicator and WhatsApp quick inquiry option. |

---

## 2. Visual system — mapped to Airbnb's design language

All colors, type, and spacing are used exclusively across the whole app, ensuring interaction patterns are borrowed from various sources while the *skin* stays 100% Airbnb.

**Color tokens** — defined as CSS custom properties in `app/globals.css` (`:root`) and Tailwind inline themes:
- `--rausch: #FF385C` — primary accent (Airbnb's signature red/pink). Used for primary buttons, active tab underlines, price emphasis.
- `--rausch-dark: #E31C5F` — hover/pressed state for primary actions.
- `--babu: #00A699` — secondary teal accent, used for verified artisan notes, explorer highlights, and community badges.
- `--ink: #222222` — primary text, active/selected state for tabs, titles, and high-emphasis labels.
- `--gray-700: #484848` / `--gray-500: #717171` / `--gray-300: #DDDDDD` — secondary body text, meta text, hairline borders, disabled states.
- `--gray-200: #EBEBEB` / `--gray-100: #F7F7F7` / `--gray-50: #FAFAFA` — low-emphasis surfaces, card hover states, filter panels, footer background.
- `--white: #FFFFFF` — primary canvas background.

**EcoBadge System (`EcoBadge.tsx`)**
- `eco`: 100% Local Fiber (Emerald theme)
- `certified`: Verified Island Artisan (Teal theme)
- `solar`: Solar Powered Lodge (Amber theme)
- `fairtrade`: Direct Fair-Trade (Cyan theme)
- `handmade`: Handcrafted in Kiribati (Rose theme)

**WhatsApp Quick Action (`WhatsAppInquireButton.tsx`)**
- Floating bottom-right action button (`fixed bottom-6 right-6`) and inline button variants designed for low-bandwidth island traveler inquiries.

**Typography**
- **Inter** is the documented substitute for Airbnb Cereal (proprietary). Humanist sans, distinct weight steps (400/500/600/700/800/900).
- Headings: 800-900 weight, tight letter-spacing (-0.02em).
- Body/meta: 400–600 weight, `--gray-500` for subtitles.

**Spacing & shape**
- Whitespace: 24px page gutters (`container-app`), 16–32px grid gaps, 32–64px section padding.
- Rounded corners: 8px (small inputs), 12–16px (cards), 24–32px (large hero panels, island explorer), full pill radius (999px) for search bar and category tags.

---

## 3. Responsive behavior

- **Desktop (>980px):** 4-column stay grid, 3-column marketplace shop grid with a fixed filter sidebar, 2-column experience grid, 12-column island explorer highlight layout, 3:9 column split for `InfoLayout` help center pages.
- **Tablet (640–980px):** Grids collapse to 2 columns; filter sidebar stacks full-width above the product grid.
- **Mobile (<640px):** `TripSearch` pill collapses to a rounded "Where to?" button; category tab bar becomes a horizontally swipeable strip with hidden scrollbars; booking modal expands to full-screen sheet drawer; floating WhatsApp button remains accessible.

---

## 4. Brand & wordmark

- The official product title is **"Island Connects"** — matching domain `islandconnects.com`.
- Header logo renders **Island Connects** (`text-[var(--rausch)]`, 900 font weight).
- Top Navigation Links: `Home`, `Stays`, `Marketplace`, `Experiences`, `Guides`.
- Footer includes official social media icons: **Facebook**, **X (Twitter)**, **Instagram**, and **WhatsApp**.

---

## 5. Homepage hero (above the fold)

- **Desktop:** Full-bleed photograph of a Kiribati lagoon at golden hour with dark gradient scrim. Header wordmark "Island Connects" top-left. Bold headline *"Discover Kiribati — islands, stays & handmade heritage."* Centered `TripSearch` pill overlay with "Explore stays" CTA.
- **Mobile (<640px):** Viewport-height hero (`min-h-[100svh]`); `TripSearch` collapses to rounded "Where to?" button that expands on tap.

---

## 6. Interaction states

| Feature | Loading | Empty | Error | Success / Partial |
|---|---|---|---|---|
| Homepage rails | Skeleton rail | "Nothing here yet" + CTA | "Couldn't load island content. Retry" + Retry button | Loaded rails rendered cleanly |
| Search results | Skeleton grid | "No results for '<q>'. Try another island or date." | "Search failed. Retry" button | Filtered card results |
| Experiences grid | Skeleton cards | "No workshops available for selected dates." | "Couldn't load workshops. Retry" | Experience cards with WhatsApp CTA |
| Admin Settings | Form spinner | n/a | Validation error toast | "Commission settings updated!" toast + live revenue split projection |
| Info Pages | Skeleton text | n/a | 404 Not Found fallback | Rendered markdown/React article layout |

---

## 7. Complete 41-Route Platform Directory

```
Route (app)
┌ ○ /                              (Homepage)
├ ○ /_not-found                    (404 Page)
├ ○ /about                         (About Us)
├ ○ /account                       (User Profile Overview)
├ ○ /account/bookings              (User Bookings History)
├ ○ /account/messages              (User Host Messages)
├ ○ /account/orders                (User Orders History)
├ ƒ /account/orders/[id]           (Order Details)
├ ○ /account/reviews               (User Reviews)
├ ○ /account/saved                 (Saved Listings)
├ ○ /admin/dashboard               (Admin Platform Overview)
├ ○ /admin/products                (Admin Product Moderation)
├ ○ /admin/settings                (Admin Monetization & Commission Settings)
├ ○ /admin/vendors                 (Admin Vendor Management)
├ ○ /blog                          (Blog & Article Directory)
├ ƒ /booking/[id]/confirmation     (Stay Inquiry Confirmation)
├ ○ /cancellations                 (Cancellations Policy)
├ ○ /careers                       (Careers & Community Roles)
├ ○ /cart                          (Cart Page)
├ ƒ /category/[slug]               (Category Filtered View)
├ ○ /checkout                      (Checkout Page - ANZ Transfer)
├ ○ /checkout/confirmation         (Order Confirmation Page)
├ ○ /contact                       (Contact & Support)
├ ○ /experiences                   (Cultural Experiences & Workshops)
├ ○ /fair-trade                    (Artisan Fair-Trade Commitment)
├ ○ /faqs                          (Frequently Asked Questions)
├ ○ /forgot-password               (Password Reset Request)
├ ○ /guides                        (Cultural Magazine & Stories)
├ ƒ /guides/[slug]                 (Guide Article View)
├ ○ /login                         (User / Vendor Login)
├ ○ /map                           (Archipelago Directory & Island Map)
├ ○ /marketplace                   (Handicraft Marketplace)
├ ○ /payment                       (Payment & Bank Transfer Info)
├ ○ /privacy                       (Privacy Policy)
├ ƒ /product/[id]                  (Handicraft Product Detail View)
├ ƒ /reset-password/[token]        (Password Reset Action)
├ ○ /search                        (Global Search Results)
├ ○ /signup                        (User / Vendor Registration)
├ ƒ /stay/[id]                     (Accommodation Detail View)
├ ○ /stays                         (Stays & Homestays Catalog)
├ ○ /terms                         (Terms of Service)
├ ○ /vendor/dashboard              (Vendor Store Overview)
├ ○ /vendor/orders                 (Vendor Order Management)
├ ○ /vendor/products               (Vendor Product Catalog Management)
├ ○ /vendor/store-settings         (Vendor Shop Profile Settings)
└ ○ /wishlist                      (User Wishlist)
```
