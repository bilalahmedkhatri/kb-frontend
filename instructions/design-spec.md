# Kiribati Islands Platform — Design Specification

Companion document to `index.html` (working prototype). This maps every selection
component to the reference site it's modeled on, defines the Airbnb-mapped visual
system, and covers responsive behavior.

## 1. Which reference site drives which component

| Component | Reference site | Why that source |
|---|---|---|
| Top search bar (Where / Check-in–out / Who, pill-shaped, click-to-expand dropdowns) | **Airbnb** | Airbnb's three-segment pill is the standard for "one search bar, three linked decisions" — it keeps location, dates, and party size visible at once without a full-page detour, which matches your booking-inquiry use case. |
| Date range picker (click start date, click end date, range highlights) | **Airbnb** | Airbnb's calendar avoids a "from/to" pair of separate text fields; a single connected calendar communicates the *stay* as one span, which is more legible for a lodging product than two date inputs. |
| Guest counter (stepper +/-, split Adults/Children) | **Airbnb** | Numeric steppers avoid free-text guest entry errors and match how Airbnb (and most booking flows) captures occupancy for pricing/capacity checks. |
| Category tab bar (icon + label, underline on active, horizontal scroll on mobile) | **Airbnb** | This is Airbnb's homepage category rail pattern, repurposed here as the primary top-level navigation between Stays / Marketplace / Guides — it lets one destination hold three different content types without three separate top nav items. |
| Marketplace sidebar filters (category checkboxes, price min/max, vendor rating, sort dropdown) | **Etsy** | Etsy's search-results page is the strongest model for a multi-vendor product catalog: persistent left-rail filters + a sortable grid is what shoppers already expect from a handmade-goods marketplace, which is exactly what Phase 3 (Vendor Portal / Product Catalog) describes. |
| Product cards (image-forward, vendor name as secondary line, star rating, price) | **Etsy** | Etsy foregrounds the maker/shop name under the product image because trust in the *seller* matters as much as the item — directly relevant for local-artisan credibility. |
| Editorial/guides grid (asymmetric feature + smaller tiles, topic-tag filter pills, dark image-overlay captions) | **Culture Trip** | Culture Trip's magazine layout is built for browsing stories rather than transacting — an asymmetric grid with one larger "feature" tile signals editorial priority, and topic pills (Culture / Food / Adventure / History) are Culture Trip's exact filtering idiom for guides content, which maps to Phase 2's "Island Guides and Cultural Stories." |
| Booking inquiry flow (multi-step modal: dates & guests → contact details → review & send) | **Airbnb** | Airbnb's reservation flow breaks a commitment into small, reversible steps with a visible progress indicator. Since this platform uses manual/inquiry-based booking (no live payment capture per the agreement), the same step structure is reused but the final screen sends an *inquiry* rather than charging a card. |

## 2. Visual system — mapped to Airbnb's design language

All colors, type, and spacing below are used exclusively across the whole app, including the Etsy- and Culture-Trip-inspired sections, so the *interaction patterns* are borrowed but the *skin* stays 100% Airbnb.

**Color tokens**
- `--rausch: #FF385C` — primary accent (Airbnb's signature red/pink). Used for primary buttons, active price emphasis, editorial tag highlight.
- `--rausch-dark: #E31C5F` — hover/pressed state for primary actions.
- `--babu: #00A699` — secondary teal, used sparingly (e.g., a "verified vendor" note), matching Airbnb's restrained use of a second accent.
- `--ink: #222222` — primary text and the active/selected state for tabs and pills.
- `--gray-700 / --gray-500 / --gray-300` — secondary text, meta text, disabled states.
- `--gray-200 / --gray-100 / --gray-50` — borders and low-emphasis surfaces (card backgrounds, filter panel, footer band).
- `--white #FFFFFF` — primary background, matching Airbnb's clean canvas.

**Typography**
- Airbnb's actual typeface (Airbnb Cereal) is proprietary and not licensable for arbitrary use, so the spec substitutes **Inter**, a geometric grotesk with the same qualities Airbnb's brief calls for: humanist sans, high x-height, distinct weight steps (400/500/600/700/800), and strong legibility at small sizes. This is noted directly in the CSS as a documented substitution.
- Headings: 800 weight, tight letter-spacing (-0.02em), sizes stepping 22px → 16px → 14px depending on hierarchy.
- Body/meta: 400–600 weight, 12–14px, `--gray-500` for de-emphasis — mirrors Airbnb's practice of pairing a bold title line with a quiet gray subtitle line on every card.

**Spacing & shape**
- Generous whitespace: 24px page gutters, 20–32px gaps between grid items, 32–64px section padding.
- Rounded corners: 8px (inputs/small controls), 12–16px (cards, modal), full pill radius (999px) for the search bar, category-free buttons, and filter tags — directly mirroring Airbnb's pill-shaped controls.
- Cards use a 1:1 or 4:5 image ratio, subtle 1px hairline + soft shadow rather than heavy borders, consistent with Airbnb's card elevation (`shadow-card` for resting, `shadow-elevated`/`shadow-modal` for overlays).

**Buttons & inputs**
- Primary button: solid `--rausch`, white text, 700 weight, 8px radius, darkens on hover — Airbnb's exact CTA treatment.
- Secondary/outline button: white fill, 1px `--ink` border, gray-50 hover fill.
- Inputs: 1px `--gray-300` border, 8px radius, dark focus outline for accessibility (visible keyboard focus, per WCAG-minded default).

## 3. Responsive behavior

- **Desktop (>980px):** four-column stay grid, three-column shop grid with a fixed 220px filter sidebar, three-column asymmetric editorial grid with one tall feature tile.
- **Tablet (640–980px):** grids collapse to two columns; the Etsy-style sidebar drops above the product grid conceptually (implementation keeps it stacked at full width in this breakpoint) so filters stay reachable without a drawer.
- **Mobile (<640px):** the Airbnb pill search bar collapses into a single rounded "Where to?" button (Airbnb's own mobile pattern — expanding a full pill on a narrow screen would overflow), category bar becomes a horizontally swipeable strip, all content grids drop to two columns, and the booking modal expands to a full-screen sheet rather than a centered dialog, matching how Airbnb turns modals into full-screen flows on small viewports.
- Every interactive control (dropdowns, steppers, tag pills, modal buttons) is reachable and operable at all three breakpoints with touch-sized (~40px) targets.

## 4. Why this combination is usable, not just decorative

- Three different content types (bookable stays, purchasable goods, readable stories) each get the selection pattern their *category of decision* is best served by: a **linked search bar** for date/occupancy-bound decisions, **persistent filters** for attribute-narrowing a catalog, and **topic tags over a visual grid** for open-ended browsing. Reusing one pattern for all three would either overload the stories section with unnecessary filters or under-serve the marketplace with no way to narrow by price/category.
- Keeping color, type, and shape identical across all three sections means a visitor never has to re-learn "what a button looks like" when they move from booking a room to buying a handicraft to reading a guide — the *skin* stays constant even though the *interaction shape* changes per task.
