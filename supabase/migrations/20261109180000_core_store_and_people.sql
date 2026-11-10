-- Natural Oil independent demo: core catalog, customer, order, and people schema.
-- Apply only to a project you control. Never expose a Supabase service-role key in the browser.

create extension if not exists pgcrypto with schema extensions;

create type public.account_role as enum ('customer', 'employee', 'admin');
create type public.order_status as enum ('confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled');
create type public.attendance_status as enum ('present', 'absent', 'leave', 'half_day');
create type public.payroll_status as enum ('draft', 'ready', 'paid');
create type public.subscription_status as enum ('active', 'paused', 'cancelled');
create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.account_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  ingredients text,
  usage_notes text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size_label text not null,
  price_inr numeric(10,2) not null check (price_inr >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size_label)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, variant_id)
);

create table public.wishlist_items (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'confirmed',
  subtotal_inr numeric(10,2) not null check (subtotal_inr >= 0),
  delivery_fee_inr numeric(10,2) not null default 0 check (delivery_fee_inr >= 0),
  total_inr numeric(10,2) not null check (total_inr >= 0),
  shipping_address jsonb not null,
  estimated_delivery date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_snapshot text not null,
  size_snapshot text not null,
  unit_price_inr numeric(10,2) not null check (unit_price_inr >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total_inr numeric(12,2) generated always as (unit_price_inr * quantity) stored
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete restrict,
  employee_code text not null unique,
  job_title text not null,
  hired_on date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete restrict,
  work_date date not null,
  status public.attendance_status not null,
  check_in timestamptz,
  check_out timestamptz,
  note text,
  recorded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out is null or check_in is null or check_out > check_in),
  unique (employee_id, work_date)
);

create table public.salary_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete restrict,
  pay_period date not null check (extract(day from pay_period) = 1),
  base_salary_inr numeric(10,2) not null check (base_salary_inr >= 0),
  allowances_inr numeric(10,2) not null default 0 check (allowances_inr >= 0),
  deductions_inr numeric(10,2) not null default 0 check (deductions_inr >= 0),
  net_salary_inr numeric(10,2) generated always as (base_salary_inr + allowances_inr - deductions_inr) stored,
  status public.payroll_status not null default 'draft',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, pay_period),
  check (base_salary_inr + allowances_inr >= deductions_inr)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null default 1 check (quantity between 1 and 99),
  interval_days integer not null check (interval_days in (15, 30, 45, 60, 90)),
  status public.subscription_status not null default 'active',
  next_delivery date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null check (points <> 0),
  reason text not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.qr_batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text not null unique,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  manufactured_on date not null,
  best_before date,
  sourcing_note text,
  documentation_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  check (best_before is null or best_before >= manufactured_on)
);

create table public.inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  reorder_level integer not null default 0 check (reorder_level >= 0),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status public.ticket_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_active_idx on public.products(category_id, is_active);
create index variants_product_active_idx on public.product_variants(product_id, is_active);
create index cart_profile_idx on public.cart_items(profile_id);
create index addresses_profile_idx on public.addresses(profile_id);
create index orders_profile_created_idx on public.orders(profile_id, created_at desc);
create index orders_status_created_idx on public.orders(status, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index employees_active_idx on public.employees(is_active);
create index attendance_employee_date_idx on public.attendance_records(employee_id, work_date desc);
create index salary_employee_period_idx on public.salary_records(employee_id, pay_period desc);
create index subscriptions_profile_status_idx on public.subscriptions(profile_id, status);
create index loyalty_profile_created_idx on public.loyalty_transactions(profile_id, created_at desc);
create index support_profile_created_idx on public.support_tickets(profile_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.phone,
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.create_customer_profile();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.employees enable row level security;
alter table public.attendance_records enable row level security;
alter table public.salary_records enable row level security;
alter table public.subscriptions enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.qr_batches enable row level security;
alter table public.inventory enable row level security;
alter table public.support_tickets enable row level security;

create policy "profiles_select_self_or_admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles_update_self_or_admin" on public.profiles
  for update to authenticated using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));

create policy "categories_public_read_active" on public.categories
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "categories_admin_manage" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "products_public_read_active" on public.products
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "products_admin_manage" on public.products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "variants_public_read_active" on public.product_variants
  for select to anon, authenticated using (
    (is_active and exists (
      select 1 from public.products p where p.id = product_id and p.is_active
    )) or (select public.is_admin())
  );
create policy "variants_admin_manage" on public.product_variants
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "addresses_owner_manage" on public.addresses
  for all to authenticated using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));
create policy "cart_owner_manage" on public.cart_items
  for all to authenticated using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));
create policy "wishlist_owner_manage" on public.wishlist_items
  for all to authenticated using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "orders_owner_or_admin_read" on public.orders
  for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "order_items_owner_or_admin_read" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.profile_id = (select auth.uid()) or (select public.is_admin()))
    )
  );

create policy "employees_self_or_admin_read" on public.employees
  for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "employees_admin_manage" on public.employees
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "attendance_self_or_admin_read" on public.attendance_records
  for select to authenticated using (
    (select public.is_admin()) or exists (
      select 1 from public.employees e where e.id = employee_id and e.profile_id = (select auth.uid())
    )
  );
create policy "attendance_admin_manage" on public.attendance_records
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "salary_self_or_admin_read" on public.salary_records
  for select to authenticated using (
    (select public.is_admin()) or exists (
      select 1 from public.employees e where e.id = employee_id and e.profile_id = (select auth.uid())
    )
  );
create policy "salary_admin_manage" on public.salary_records
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "subscriptions_owner_manage" on public.subscriptions
  for all to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()))
  with check (profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "loyalty_owner_or_admin_read" on public.loyalty_transactions
  for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "qr_batches_public_read_published" on public.qr_batches
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "qr_batches_admin_manage" on public.qr_batches
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "inventory_admin_only" on public.inventory
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "support_owner_read" on public.support_tickets
  for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "support_owner_create" on public.support_tickets
  for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "support_admin_manage" on public.support_tickets
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant select on public.categories, public.products, public.product_variants, public.qr_batches to anon, authenticated;
grant select on public.profiles, public.orders, public.order_items, public.employees,
  public.attendance_records, public.salary_records, public.loyalty_transactions,
  public.inventory, public.support_tickets, public.subscriptions to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses, public.cart_items,
  public.wishlist_items, public.subscriptions to authenticated;
grant insert, update, delete on public.categories, public.products, public.product_variants,
  public.employees, public.attendance_records, public.salary_records, public.qr_batches,
  public.inventory, public.support_tickets to authenticated;
grant insert on public.support_tickets to authenticated;

comment on table public.employees is 'Restricted HR records. Use fictional data in the demo until authentication and admin access are configured.';
comment on table public.salary_records is 'Confidential compensation records. Only the employee owner and authorized admins may read rows.';
comment on table public.orders is 'Create and price orders through the trusted backend so clients cannot set their own totals.';
comment on table public.inventory is 'Internal stock counts; do not expose raw quantities on the public storefront.';
