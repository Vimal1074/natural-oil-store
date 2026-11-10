# Database schema overview

The initial Supabase migration is [`20261109180000_core_store_and_people.sql`](../supabase/migrations/20261109180000_core_store_and_people.sql). It is prepared locally and has not been applied to a Supabase project.

## Main table groups

| Area | Tables | Access plan |
|---|---|---|
| Customer accounts | `profiles`, `addresses` | Customers can read their own profile and manage their own addresses. Role changes are reserved for a trusted admin path. |
| Catalog | `categories`, `products`, `product_variants` | Anonymous visitors can read active catalog items. Admins manage the catalog. |
| Shopping | `cart_items`, `wishlist_items`, `orders`, `order_items` | Carts and wishlists belong to the signed-in customer. Customers can read their own orders. A trusted backend creates priced orders. |
| Employee workspace | `employees`, `attendance_records`, `salary_records` | Employees can read their own HR records. Admins manage staff, attendance, and payroll. Salary data is not public. |
| Customer programs | `subscriptions`, `loyalty_transactions`, `qr_batches`, `support_tickets` | Users can manage their subscriptions and read their own reward history and support tickets. Published batch records are publicly readable. |
| Operations | `inventory` | Raw stock counts are admin-only; a backend can expose a safe availability result to customers. |

## Security notes

- Row Level Security is enabled for every table in the migration.
- New Supabase Auth users receive a customer profile. Employee and admin roles must be assigned through a trusted administrative process; users cannot promote themselves through profile updates.
- Order totals should be calculated by FastAPI or another trusted server from current variant prices. The browser must not submit the authoritative total.
- The current `/employee` page is still a fictional prototype. Do not place real salary or attendance data in it until authentication and role-based access are connected and reviewed.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and any AI provider key on the server only. Never commit real credentials to the repository.
