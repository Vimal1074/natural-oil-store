# Development progress

## Current milestone: Supabase API integration scaffold

- [x] Confirmed Node.js and npm are available.
- [x] Added a React + Vite application entry point and Tailwind CSS integration.
- [x] Built a responsive Natural Oil concept storefront with original logo artwork.
- [x] Added the product catalog with search, categories, sorting, saved items, pack details, and product comparison.
- [x] Added customer prototypes for product guidance, sample batch lookup, delivery estimates, subscriptions, rewards, and order tracking.
- [x] Fixed the delivery checker layout so it has readable width on desktop and mobile.
- [x] Moved employee attendance, salary, and business analytics to a separate `/employee` portal.
- [x] Researched grocery and commerce UX examples; notes are in `docs/ux-research.md`.
- [x] Drafted a Supabase migration for customer catalog, orders, employee attendance, payroll, subscriptions, rewards, QR batches, inventory, and support tickets.
- [x] Added a FastAPI health endpoint and local run instructions.
- [x] Added public catalog read routes and employee profile, attendance, and payroll read routes.
- [x] Forwarded the signed-in user's Supabase access token so database row-level security remains active for employee data.
- [x] Added a credential template and ignored local backend secrets.
- [x] Made the API load local settings from `backend/.env` on startup.
- [x] Prepared an idempotent demo catalog seed for seven categories and ten products.
- [x] Connected the customer storefront to the FastAPI product catalog, with the existing local reference catalog as an offline fallback.
- [x] Made the demo shopping bag open as a drawer with item quantities and removal controls.
- [x] Made the product guide's Ask action more visible and added a comparison response for sesame and groundnut.
- [x] Rebranded the customer storefront and API as Natural Oil, removed outbound reference links, and made price status visible.
- [x] Added a checkout preview with contact and delivery fields; it does not save personal details or place orders.
- [x] Connected Supabase pack variants to the storefront; the cart preview calculates a clearly labeled demo subtotal.
- [x] Applied the core migration to the user's Supabase project (user confirmed success in the dashboard).
- [x] Applied `supabase/seed_demo_catalog.sql`; the API returns seven categories and ten products.
- [ ] Connect the employee portal to authenticated employee API routes after sign-in is implemented.
- [ ] Add and configure Supabase authentication, then connect operations and authorized data.
- [ ] Replace all demo business and HR values with authorized data only after access controls are implemented.

## Notes

- Natural Oil is an independent demonstration concept. The custom mark and CSS bottle artwork are original.
- Supabase, authentication, checkout, and persistence are still planned. Employee and dashboard controls currently update local demo state only.
- The schema migration and demo catalog seed have been applied to the user's development Supabase project.
- Supabase credentials remain in the user's local `backend/.env`; they are not stored in the repository.
- The customer storefront reads product records and pack prices from the API when available. Coconut Oil prices were supplied by the owner; every other pack price is a random demo example and must be replaced before real sales.
- The shopping bag is still browser-only demo state; checkout and payments are not connected. The product guide uses local sample responses and is not backed by a live AI model.
- The `/employee` route is a presentation prototype, not a secure staff login. Do not use it for real employee or payroll information until authentication and role-based access are implemented.
- Product price notes: `docs/catalog-pricing-notes.md`.
- Schema notes: `docs/database-schema.md`.
