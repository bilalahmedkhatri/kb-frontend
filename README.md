This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Status (as of 2026-07-15)

**Kiribati Islands Platform — `islandconnects.com`** — a tourism + handicraft marketplace for Kiribati, built by a solo developer for a local client. Currently in **Phase A: Showpiece** — polishing 5-6 pages against a mock API before wiring the real FastAPI backend.

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind v4 + Radix UI + Zustand + React Query. Atomic-design component system (`src/components/`), 24 routes, mock API (`src/lib/api.ts`).
- **Backend:** FastAPI + SQLModel + PostgreSQL (in `../kb-back-adm`). Scaffolded with auth + a generic `items` module; real domain models (products, stays, guides, vendors, orders, bookings, reviews) built in Phase C.
- **Stack decision:** Next.js + FastAPI + PostgreSQL, custom build (not WordPress). Payment: manual + ANZ Get bank transfer (no live gateway).

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

**Locked decisions:** 12 architecture decisions (see eng-review doc), payment = manual + ANZ Get, domain = `islandconnects.com`, AUD-only at MVP, cursor pagination, R2 for images, delete `items` module in Phase C.

**Accepted scope expansions:** WhatsApp-click-to-inquire, handicraft story clip (vendor video), `guides` module as reusable tourism CMS. See CEO plan for full detail.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
