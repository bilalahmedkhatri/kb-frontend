# Kiribati Islands Platform - Design Specification

Companion document to `index.html` (working prototype). This maps every selection
component to the reference site it's modeled on, defines the Airbnb-mapped visual
system, and covers responsive behavior.

## 1. Which reference site drives which component

| Component | Reference site | Why that source |
|---|---|---|
| Top search bar (Where / Check-in–out / Who, pill-shaped, click-to-expand dropdowns) | **Airbnb** | Airbnb's three-segment pill is the standard for "one search bar, three linked decisions" - it keeps location, dates, and party size visible at once without a full-page detour, which matches your booking-inquiry use case. |
| Date range picker (click start date, click end date, range highlights) | **Airbnb** | Airbnb's calendar avoids a "from/to" pair of separate text fields; a single connected calendar communicates the *stay* as one span, which is more legible for a lodging product than two date inputs. |
| Guest counter (stepper +/-, split Adults/Children) | **Airbnb** | Numeric steppers avoid free-text guest entry errors and match how Airbnb (and most booking flows) captures occupancy for pricing/capacity checks. |
| Category tab bar (icon + label, underline on active, horizontal scroll on mobile) | **Airbnb** | This is Airbnb's homepage category rail pattern, repurposed here as the primary top-level navigation between Stays / Marketplace / Guides - it lets one destination hold three different content types without three separate top nav items. |
| Marketplace sidebar filters (category checkboxes, price min/max, vendor rating, sort dropdown) | **Etsy** | Etsy's search-results page is the strongest model for a multi-vendor product catalog: persistent left-rail filters + a sortable grid is what shoppers already expect from a handmade-goods marketplace, which is exactly what Phase 3 (Vendor Portal / Product Catalog) describes. |
| Product cards (image-forward, vendor name as secondary line, star rating, price) | **Etsy** | Etsy foregrounds the maker/shop name under the product image because trust in the *seller* matters as much as the item - directly relevant for local-artisan credibility. |
| Editorial/guides grid (asymmetric feature + smaller tiles, topic-tag filter pills, dark image-overlay captions) | **Culture Trip** | Culture Trip's magazine layout is built for browsing stories rather than transacting - an asymmetric grid with one larger "feature" tile signals editorial priority, and topic pills (Culture / Food / Adventure / History) are Culture Trip's exact filtering idiom for guides content, which maps to Phase 2's "Island Guides and Cultural Stories." |
| Booking inquiry flow (multi-step modal: dates & guests → contact details → review & send) | **Airbnb** | Airbnb's reservation flow breaks a commitment into small, reversible steps with a visible progress indicator. Since this platform uses manual/inquiry-based booking (no live payment capture per the agreement), the same step structure is reused but the final screen sends an *inquiry* rather than charging a card. |

## 2. Visual system - mapped to Airbnb's design language

All colors, type, and spacing below are used exclusively across the whole app, including the Etsy- and Culture-Trip-inspired sections, so the *interaction patterns* are borrowed but the *skin* stays 100% Airbnb.

**Color tokens** - these MUST be defined as CSS custom properties in `app/globals.css` (`:root`) and consumed via Tailwind theme tokens (`bg-rausch`, `text-ink`, `border-line`, etc.) or `var(--rausch)`. Do NOT hardcode hex in component classNames (the current build uses `border-[#DDDDDD]` / `text-[#222222]` inline - that is a violation of this system and must be refactored). The hex values below are the single source of truth; every component references them through the token layer.
- `--rausch: #FF385C` - primary accent (Airbnb's signature red/pink). Used for primary buttons, active price emphasis, editorial tag highlight.
- `--rausch-dark: #E31C5F` - hover/pressed state for primary actions.
- `--babu: #00A699` - secondary teal, used sparingly (e.g., a "verified vendor" note), matching Airbnb's restrained use of a second accent.
- `--ink: #222222` - primary text and the active/selected state for tabs and pills.
- `--gray-700 / --gray-500 / --gray-300` - secondary text, meta text, disabled states.
- `--gray-200 / --gray-100 / --gray-50` - borders and low-emphasis surfaces (card backgrounds, filter panel, footer band).
- `--white #FFFFFF` - primary background, matching Airbnb's clean canvas.

**Typography**
- Airbnb's actual typeface (Airbnb Cereal) is proprietary and not licensable for arbitrary use, so the spec substitutes **Inter**, a geometric grotesk with the same qualities Airbnb's brief calls for: humanist sans, high x-height, distinct weight steps (400/500/600/700/800), and strong legibility at small sizes. This is noted directly in the CSS as a documented substitution.
- Headings: 800 weight, tight letter-spacing (-0.02em), sizes stepping 22px → 16px → 14px depending on hierarchy.
- Body/meta: 400–600 weight, 12–14px, `--gray-500` for de-emphasis - mirrors Airbnb's practice of pairing a bold title line with a quiet gray subtitle line on every card.

**Spacing & shape**
- Generous whitespace: 24px page gutters, 20–32px gaps between grid items, 32–64px section padding.
- Rounded corners: 8px (inputs/small controls), 12–16px (cards, modal), full pill radius (999px) for the search bar, category-free buttons, and filter tags - directly mirroring Airbnb's pill-shaped controls.
- Cards use a 1:1 or 4:5 image ratio, subtle 1px hairline + soft shadow rather than heavy borders, consistent with Airbnb's card elevation (`shadow-card` for resting, `shadow-elevated`/`shadow-modal` for overlays).

**Buttons & inputs**
- Primary button: solid `--rausch`, white text, 700 weight, 8px radius, darkens on hover - Airbnb's exact CTA treatment.
- Secondary/outline button: white fill, 1px `--ink` border, gray-50 hover fill.
- Inputs: 1px `--gray-300` border, 8px radius, dark focus outline for accessibility (visible keyboard focus, per WCAG-minded default).

## 3. Responsive behavior

- **Desktop (>980px):** four-column stay grid, three-column shop grid with a fixed 220px filter sidebar, three-column asymmetric editorial grid with one tall feature tile.
- **Tablet (640–980px):** grids collapse to two columns; the Etsy-style sidebar drops above the product grid conceptually (implementation keeps it stacked at full width in this breakpoint) so filters stay reachable without a drawer.
- **Mobile (<640px):** the Airbnb pill search bar collapses into a single rounded "Where to?" button (Airbnb's own mobile pattern - expanding a full pill on a narrow screen would overflow), category bar becomes a horizontally swipeable strip, all content grids drop to two columns, and the booking modal expands to a full-screen sheet rather than a centered dialog, matching how Airbnb turns modals into full-screen flows on small viewports.
- Every interactive control (dropdowns, steppers, tag pills, modal buttons) is reachable and operable at all three breakpoints with touch-sized (~40px) targets.

## 4. Why this combination is usable, not just decorative

- Three different content types (bookable stays, purchasable goods, readable stories) each get the selection pattern their *category of decision* is best served by: a **linked search bar** for date/occupancy-bound decisions, **persistent filters** for attribute-narrowing a catalog, and **topic tags over a visual grid** for open-ended browsing. Reusing one pattern for all three would either overload the stories section with unnecessary filters or under-serve the marketplace with no way to narrow by price/category.
- Keeping color, type, and shape identical across all three sections means a visitor never has to re-learn "what a button looks like" when they move from booking a room to buying a handicraft to reading a guide - the *skin* stays constant even though the *interaction shape* changes per task.

## 5. Brand & wordmark

- The product is **"Island Connects"** - this MUST match the domain `islandconnects.com` and the CEO plan naming. The header wordmark reads "Island Connects" (rausch `#FF385C`, bold). Do NOT use "Kiribati" as the standalone wordmark (the country name is the locale, not the brand).
- Where a locale cue helps, append it as a quiet subtitle: "Island Connects · Kiribati" is acceptable on the homepage hero only.

## 6. Homepage hero (above the fold)

The hero is the single most important emotional moment for a tourism site - it must show the region's beauty, not a blank utility panel.

- **Desktop:** Full-bleed photograph of a Kiribati atoll/lagoon at golden hour (edge-to-edge, no inset/rounded frame). Dark gradient scrim (top + bottom) for text legibility. Brand wordmark "Island Connects" top-left (in the header, white over image). One bold headline over the image (white, 800-weight, ~clamp 32–56px): e.g. *"Discover Kiribati - islands, stays & handmade heritage."* The `TripSearch` pill overlays centered/lower-third on the image (white, soft shadow). One rausch CTA "Explore stays" alongside. No cards, no 3-column grid, no purple/blue gradient.
- **Mobile (<640px):** Same hero image with a stronger gradient scrim; headline scales down; `TripSearch` collapses to a rounded "Where to?" button (Airbnb mobile pattern) that expands the full pill on tap. Hero is full viewport height (`min-h-[100svh]` or `aspect` fallback), not a short white band.
- **Imagery source:** real licensed Kiribati photos (not stock/picsum) - see the asset-delivery gate in the office-hours plan. Category tab icons currently use `picsum.photos` placeholders and MUST be replaced with real Kiribati category images before launch.

## 7. Interaction states (required for every data-bearing UI)

The current build silently swallows errors (`catch {}` on the homepage) and renders nothing on empty (`FeaturedRail` returns `null`). That is not acceptable - every state below must be specified and built.

| Feature            | Loading                                  | Empty                                              | Error                                            | Success              | Partial                    |
|--------------------|------------------------------------------|----------------------------------------------------|--------------------------------------------------|----------------------|----------------------------|
| Homepage rails     | Skeleton rail (already built)             | Warm "Nothing here yet" + primary action (browse all / add first listing) | "We couldn't load this. Retry" + retry button; never a blank page | n/a                  | Show loaded rails, skip failed ones with a quiet inline note |
| Search results     | Skeleton grid                            | "No results for '<q>'. Try another island or date." + reset filters | "Search failed. Retry" + retry                  | n/a                  | n/a                        |
| Product/Stay cards | Shimmer image + grey lines               | n/a                                                | n/a                                              | n/a                  | Image fails → neutral placeholder tile, text still shows |
| Booking inquiry    | Button spinner, disabled                 | n/a                                                | Inline field errors + top-level "Couldn't send - check and retry" | Confirmation toast + "We'll WhatsApp you" note | n/a                        |
| Cart / Wishlist    | Skeleton                                 | "Your cart is empty" + "Explore stays" CTA         | "Couldn't sync cart" + retry                     | n/a                  | Merge-on-login partial state shown briefly |

- **Error state rule:** a failed fetch MUST render a visible, recoverable error UI with a retry action. Silently failing to a blank/empty screen is a bug, not a state.
- **Empty state rule:** empty is a feature - warmth + one primary action + context about why it's empty.

## 8. Typography note

Inter is the documented substitute for Airbnb Cereal (proprietary). It is an acceptable real typeface for this build; the substitution is intentional and noted in CSS. (Note: some design-review guidance discourages Inter as a "default stack" - we keep it deliberately because it is the closest licensed match to the Airbnb reference and is explicitly documented here.)
