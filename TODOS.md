# TODOS — Design debt & build tasks

Tracked from the `/plan-design-review` pass on 2026-07-15 (overall design score 5/10 → 8/10).
Decisions written into `DESIGN.md` (brand wordmark, hero spec, token wiring mandate,
interaction-state table). These tasks implement that spec in code.

## Phase A (Showpiece) — P1, blocks a polished launch

- [ ] **T1 (P1, human: ~3-4h / CC: ~30min)** — design-system — Wire DESIGN.md color tokens as CSS variables and refactor components off hardcoded hex
  - Surfaced by: Pass 5 (Design System Alignment) — code hardcodes `#DDDDDD`/`#222222` instead of `--rausch`/`--ink` tokens; the design system in DESIGN.md is not actually applied.
  - Files: `app/globals.css`, `src/components/**`
  - Verify: grep for `\[#` arbitrary hex classNames returns zero in `src/components`; `var(--rausch)` resolves in devtools.

- [ ] **T2 (P1, human: ~2h / CC: ~20min)** — homepage — Build full-bleed Kiribati hero image + headline + search overlay (desktop + mobile)
  - Surfaced by: Pass 1/3/4 — hero had no imagery or brand narrative; client's core ask is "represent the beauty of his region."
  - Files: `app/page.tsx`, `src/components/molecules/TripSearch.tsx`
  - Verify: homepage above-the-fold shows a full-bleed Kiribati photo + "Island Connects" wordmark + headline + search pill; on 375px the hero is full-height with a "Where to?" button.

## Lower priority

- [ ] **T4 (P3, human: ~10min / CC: ~2min)** — brand — Fix header wordmark to "Island Connects"
  - Surfaced by: Pass 5 / D1 decision — header currently reads "Kiribati", mismatches domain `islandconnects.com`.
  - Files: `src/components/organisms/Header.tsx`

- [ ] **T5 (P2, human: ~15min / CC: ~15min)** — imagery — Replace `picsum.photos` category icons with real licensed Kiribati photos
  - Surfaced by: Pass 6 — category tab icons use picsum placeholders.
  - Blocked by: asset-delivery gate (client must supply licensed Kiribati photos — see office-hours plan Phase A).

## Skipped (spec only)

- **T3 (error + empty states)** — user chose to skip tracking, but the full loading/empty/error/success/partial table is specified in `DESIGN.md` §7. Implement before launch; a failed fetch MUST render a recoverable error UI, not a blank page.
