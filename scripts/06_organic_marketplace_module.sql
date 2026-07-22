-- =====================================================================
-- AgreeConnect :: 06 :: Organic Marketplace Module
--   Certified-organic farms, certificates, catalog, orders, reviews.
--   Built on auth.users / farmers / villages / record_status /
--   is_platform_admin() and shared trigger functions.
-- =====================================================================

-- ---------- enums (idempotent) ---------------------------------------
do $$ begin create type public.organic_farm_status as enum
  ('pending','active','suspended','closed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_cert_type as enum
  ('ncop','pgs_india','usda_organic','eu_organic','india_organic','jaivik_bharat','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_cert_status as enum
  ('applied','under_review','certified','expired','revoked','rejected'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_product_status as enum
  ('draft','active','out_of_stock','discontinued','archived'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_order_status as enum
  ('pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_payment_status as enum
  ('unpaid','pending','paid','partially_refunded','refunded','failed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_order_item_status as enum
  ('pending','confirmed','shipped','delivered','cancelled','returned'); exception when duplicate_object then null; end $$;

do $$ begin create type public.organic_review_status as enum
  ('pending','published','rejected','hidden'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- ORGANIC_FARMS  (a certified-organic farm/seller, 1:1 with a user)
-- =====================================================================
create table if not exists public.organic_farms (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  farmer_id          uuid references public.farmers(id) on delete set null,
  village_id         uuid references public.villages(id) on delete set null,
  farm_name          text not null,
  slug               text,
  farm_status        public.organic_farm_status not null default 'pending',
  description        text,
  total_area_acres   numeric(10,2),
  organic_since       date,
  contact_email      text,
  contact_phone      text,
  logo_url           text,
  cover_image_url    text,
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  is_certified       boolean not null default false,
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint organic_farms_user_unique unique (user_id),
  constraint organic_farms_slug_unique unique (slug),
  constraint organic_farms_area_chk check (total_area_acres is null or total_area_acres >= 0),
  constraint organic_farms_rating_chk check (rating_avg between 0 and 5),
  constraint organic_farms_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint organic_farms_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.organic_farms is 'Certified-organic farms acting as marketplace sellers (1:1 with a user).';

-- =====================================================================
-- ORGANIC_CERTIFICATES  (certifications held by a farm)
-- =====================================================================
create table if not exists public.organic_certificates (
  id                 uuid primary key default gen_random_uuid(),
  farm_id            uuid not null references public.organic_farms(id) on delete cascade,
  cert_type          public.organic_cert_type not null default 'pgs_india',
  cert_status        public.organic_cert_status not null default 'applied',
  certificate_number text,
  issuing_body       text,
  scope              text,
  issued_on          date,
  valid_from         date,
  valid_until        date,
  document_url       text,
  is_verified        boolean not null default false,
  verified_at        timestamptz,
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint organic_certificates_number_unique unique (certificate_number),
  constraint organic_certificates_dates_chk check (valid_until is null or valid_from is null or valid_until >= valid_from)
);
comment on table public.organic_certificates is 'Organic certifications held by a farm.';

-- =====================================================================
-- ORGANIC_CATEGORIES  (self-referential hierarchy; public read)
-- =====================================================================
create table if not exists public.organic_categories (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references public.organic_categories(id) on delete set null,
  name          text not null,
  slug          text not null,
  description   text,
  icon_url      text,
  image_url     text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  created_by    uuid,
  updated_by    uuid,
  constraint organic_categories_slug_unique unique (slug),
  constraint organic_categories_no_self_parent check (parent_id is null or parent_id <> id)
);
comment on table public.organic_categories is 'Hierarchical organic product categories (public read).';

-- =====================================================================
-- ORGANIC_PRODUCTS  (owned by an organic farm)
-- =====================================================================
create table if not exists public.organic_products (
  id                 uuid primary key default gen_random_uuid(),
  farm_id            uuid not null references public.organic_farms(id) on delete cascade,
  category_id        uuid references public.organic_categories(id) on delete set null,
  certificate_id     uuid references public.organic_certificates(id) on delete set null,
  name               text not null,
  slug               text,
  sku                text,
  description        text,
  short_description  text,
  product_status     public.organic_product_status not null default 'draft',
  price              numeric(12,2) not null,
  compare_at_price   numeric(12,2),
  currency           char(3) not null default 'INR',
  unit               text,
  quantity_available integer not null default 0,
  tax_rate           numeric(5,2) not null default 0,
  harvest_date       date,
  best_before_date   date,
  is_seasonal        boolean not null default false,
  is_featured        boolean not null default false,
  image_url          text,
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  tags               text[] not null default '{}',
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint organic_products_farm_sku_unique unique (farm_id, sku),
  constraint organic_products_slug_unique unique (slug),
  constraint organic_products_price_chk check (price >= 0),
  constraint organic_products_compare_chk check (compare_at_price is null or compare_at_price >= 0),
  constraint organic_products_qty_chk check (quantity_available >= 0),
  constraint organic_products_tax_chk check (tax_rate between 0 and 100),
  constraint organic_products_rating_chk check (rating_avg between 0 and 5),
  constraint organic_products_bestbefore_chk check (best_before_date is null or harvest_date is null or best_before_date >= harvest_date)
);
comment on table public.organic_products is 'Organic product listings owned by organic farms.';

-- =====================================================================
-- ORGANIC_ORDERS
-- =====================================================================
create table if not exists public.organic_orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null,
  buyer_id           uuid not null references auth.users(id) on delete restrict,
  farm_id            uuid references public.organic_farms(id) on delete set null,
  order_status       public.organic_order_status not null default 'pending',
  payment_status     public.organic_payment_status not null default 'unpaid',
  subtotal           numeric(14,2) not null default 0,
  discount_amount    numeric(14,2) not null default 0,
  tax_amount         numeric(14,2) not null default 0,
  shipping_amount    numeric(14,2) not null default 0,
  total_amount       numeric(14,2) not null default 0,
  currency           char(3) not null default 'INR',
  shipping_address   jsonb,
  billing_address    jsonb,
  placed_at          timestamptz,
  delivered_at       timestamptz,
  cancelled_at       timestamptz,
  notes              text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint organic_orders_number_unique unique (order_number),
  constraint organic_orders_subtotal_chk check (subtotal >= 0),
  constraint organic_orders_discount_chk check (discount_amount >= 0),
  constraint organic_orders_total_chk check (total_amount >= 0)
);
comment on table public.organic_orders is 'Customer orders for organic products (header).';

-- =====================================================================
-- ORGANIC_ORDER_ITEMS
-- =====================================================================
create table if not exists public.organic_order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.organic_orders(id) on delete cascade,
  product_id       uuid references public.organic_products(id) on delete set null,
  farm_id          uuid references public.organic_farms(id) on delete set null,
  product_name     text not null,
  sku              text,
  quantity         integer not null,
  unit_price       numeric(12,2) not null,
  discount_amount  numeric(12,2) not null default 0,
  tax_amount       numeric(12,2) not null default 0,
  line_total       numeric(14,2) not null,
  item_status      public.organic_order_item_status not null default 'pending',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint organic_order_items_qty_chk check (quantity > 0),
  constraint organic_order_items_price_chk check (unit_price >= 0),
  constraint organic_order_items_total_chk check (line_total >= 0)
);
comment on table public.organic_order_items is 'Line items within an organic order (price snapshot).';

-- =====================================================================
-- ORGANIC_REVIEWS  (product reviews)
-- =====================================================================
create table if not exists public.organic_reviews (
  id                   uuid primary key default gen_random_uuid(),
  product_id           uuid not null references public.organic_products(id) on delete cascade,
  farm_id              uuid references public.organic_farms(id) on delete set null,
  user_id              uuid not null references auth.users(id) on delete cascade,
  order_item_id        uuid references public.organic_order_items(id) on delete set null,
  rating               smallint not null,
  title                text,
  body                 text,
  review_status        public.organic_review_status not null default 'pending',
  is_verified_purchase boolean not null default false,
  helpful_count        integer not null default 0,
  farm_response        text,
  responded_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  created_by           uuid,
  updated_by           uuid,
  constraint organic_reviews_user_product_unique unique (product_id, user_id),
  constraint organic_reviews_rating_chk check (rating between 1 and 5)
);
comment on table public.organic_reviews is 'Textual reviews for organic products (one per user/product).';

-- =====================================================================
-- Ownership helper functions (security definer to avoid RLS recursion)
-- =====================================================================
create or replace function public.owns_organic_farm(p_farm_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organic_farms f
    where f.id = p_farm_id and f.user_id = auth.uid()
  );
$$;

create or replace function public.owns_organic_product(p_product_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organic_products p
    join public.organic_farms f on f.id = p.farm_id
    where p.id = p_product_id and f.user_id = auth.uid()
  );
$$;

create or replace function public.owns_organic_order(p_order_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organic_orders o
    where o.id = p_order_id and o.buyer_id = auth.uid()
  );
$$;

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_organic_farms_user        on public.organic_farms(user_id);
create index if not exists idx_organic_farms_farmer      on public.organic_farms(farmer_id);
create index if not exists idx_organic_farms_village     on public.organic_farms(village_id);
create index if not exists idx_organic_farms_status      on public.organic_farms(farm_status) where deleted_at is null;
create index if not exists idx_organic_certificates_farm on public.organic_certificates(farm_id);
create index if not exists idx_organic_certificates_status on public.organic_certificates(cert_status) where deleted_at is null;
create index if not exists idx_organic_categories_parent on public.organic_categories(parent_id);
create index if not exists idx_organic_products_farm     on public.organic_products(farm_id);
create index if not exists idx_organic_products_category on public.organic_products(category_id);
create index if not exists idx_organic_products_cert     on public.organic_products(certificate_id);
create index if not exists idx_organic_products_status   on public.organic_products(product_status) where deleted_at is null;
create index if not exists idx_organic_products_featured on public.organic_products(is_featured) where is_featured and deleted_at is null;
create index if not exists idx_organic_products_tags     on public.organic_products using gin(tags);
create index if not exists idx_organic_orders_buyer      on public.organic_orders(buyer_id);
create index if not exists idx_organic_orders_farm       on public.organic_orders(farm_id);
create index if not exists idx_organic_orders_status     on public.organic_orders(order_status) where deleted_at is null;
create index if not exists idx_organic_orders_placed     on public.organic_orders(placed_at desc);
create index if not exists idx_organic_order_items_order on public.organic_order_items(order_id);
create index if not exists idx_organic_order_items_product on public.organic_order_items(product_id);
create index if not exists idx_organic_order_items_farm  on public.organic_order_items(farm_id);
create index if not exists idx_organic_reviews_product   on public.organic_reviews(product_id);
create index if not exists idx_organic_reviews_farm      on public.organic_reviews(farm_id);
create index if not exists idx_organic_reviews_user      on public.organic_reviews(user_id);
create index if not exists idx_organic_reviews_status    on public.organic_reviews(review_status) where deleted_at is null;

-- =====================================================================
-- Triggers: updated_at + audit + soft-delete
-- =====================================================================
do $$
declare
  t text;
  updated_at_tables text[] := array[
    'organic_farms','organic_certificates','organic_categories','organic_products',
    'organic_orders','organic_order_items','organic_reviews'
  ];
  audit_tables text[] := array[
    'organic_farms','organic_certificates','organic_categories','organic_products',
    'organic_orders','organic_reviews'
  ];
  softdel_tables text[] := array[
    'organic_farms','organic_certificates','organic_categories','organic_products',
    'organic_orders','organic_reviews'
  ];
begin
  foreach t in array updated_at_tables loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s;', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$s
      for each row execute function public.update_updated_at_column();', t);
  end loop;

  foreach t in array audit_tables loop
    execute format('drop trigger if exists trg_%1$s_audit on public.%1$s;', t);
    execute format('create trigger trg_%1$s_audit before insert or update on public.%1$s
      for each row execute function public.handle_audit_fields();', t);
  end loop;

  foreach t in array softdel_tables loop
    execute format('drop trigger if exists trg_%1$s_soft_delete on public.%1$s;', t);
    execute format('create trigger trg_%1$s_soft_delete before delete on public.%1$s
      for each row execute function public.handle_soft_delete();', t);
  end loop;
end $$;

-- =====================================================================
-- Row Level Security + policies
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'organic_farms','organic_certificates','organic_categories','organic_products',
    'organic_orders','organic_order_items','organic_reviews'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- organic_farms: public read; owner or admin write
drop policy if exists "organic_farms_read" on public.organic_farms;
create policy "organic_farms_read" on public.organic_farms
  for select to authenticated using (true);
drop policy if exists "organic_farms_owner_write" on public.organic_farms;
create policy "organic_farms_owner_write" on public.organic_farms
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- organic_certificates: public read; farm owner or admin write
drop policy if exists "organic_certificates_read" on public.organic_certificates;
create policy "organic_certificates_read" on public.organic_certificates
  for select to authenticated using (true);
drop policy if exists "organic_certificates_owner_write" on public.organic_certificates;
create policy "organic_certificates_owner_write" on public.organic_certificates
  for all to authenticated
  using (public.owns_organic_farm(farm_id) or public.is_platform_admin())
  with check (public.owns_organic_farm(farm_id) or public.is_platform_admin());

-- organic_categories: public read; admin write
drop policy if exists "organic_categories_read" on public.organic_categories;
create policy "organic_categories_read" on public.organic_categories
  for select to authenticated using (true);
drop policy if exists "organic_categories_admin_write" on public.organic_categories;
create policy "organic_categories_admin_write" on public.organic_categories
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- organic_products: public read of active; farm owns writes
drop policy if exists "organic_products_read" on public.organic_products;
create policy "organic_products_read" on public.organic_products
  for select to authenticated
  using (product_status = 'active' or public.owns_organic_farm(farm_id) or public.is_platform_admin());
drop policy if exists "organic_products_owner_write" on public.organic_products;
create policy "organic_products_owner_write" on public.organic_products
  for all to authenticated
  using (public.owns_organic_farm(farm_id) or public.is_platform_admin())
  with check (public.owns_organic_farm(farm_id) or public.is_platform_admin());

-- organic_orders: buyer sees own; farm sees their orders; admin all
drop policy if exists "organic_orders_access" on public.organic_orders;
create policy "organic_orders_access" on public.organic_orders
  for all to authenticated
  using (buyer_id = auth.uid() or public.owns_organic_farm(farm_id) or public.is_platform_admin())
  with check (buyer_id = auth.uid() or public.is_platform_admin());

-- organic_order_items: via order ownership or farm of the line
drop policy if exists "organic_order_items_access" on public.organic_order_items;
create policy "organic_order_items_access" on public.organic_order_items
  for all to authenticated
  using (public.owns_organic_order(order_id) or public.owns_organic_farm(farm_id) or public.is_platform_admin())
  with check (public.owns_organic_order(order_id) or public.is_platform_admin());

-- organic_reviews: public read of published; author writes own
drop policy if exists "organic_reviews_read" on public.organic_reviews;
create policy "organic_reviews_read" on public.organic_reviews
  for select to authenticated
  using (review_status = 'published' or user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "organic_reviews_author_write" on public.organic_reviews;
create policy "organic_reviews_author_write" on public.organic_reviews
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- =====================================================================
-- Views (security_invoker so RLS of the querying user applies)
-- =====================================================================
create or replace view public.v_organic_catalog
with (security_invoker = true) as
select
  p.id            as product_id,
  p.name,
  p.slug,
  p.price,
  p.compare_at_price,
  p.currency,
  p.unit,
  p.quantity_available,
  p.product_status,
  p.is_seasonal,
  p.harvest_date,
  p.best_before_date,
  p.rating_avg,
  p.rating_count,
  p.image_url,
  f.id            as farm_id,
  f.farm_name,
  f.is_certified  as farm_is_certified,
  c.id            as category_id,
  c.name          as category_name,
  cert.cert_type,
  cert.cert_status,
  cert.valid_until as cert_valid_until
from public.organic_products p
left join public.organic_farms f on f.id = p.farm_id
left join public.organic_categories c on c.id = p.category_id
left join public.organic_certificates cert on cert.id = p.certificate_id
where p.deleted_at is null;
comment on view public.v_organic_catalog is 'Denormalized organic product catalog with farm + certification info.';

create or replace view public.v_organic_order_summary
with (security_invoker = true) as
select
  o.id            as order_id,
  o.order_number,
  o.buyer_id,
  o.farm_id,
  o.order_status,
  o.payment_status,
  o.total_amount,
  o.currency,
  o.placed_at,
  count(oi.id)    as item_count,
  coalesce(sum(oi.quantity), 0) as total_quantity
from public.organic_orders o
left join public.organic_order_items oi on oi.order_id = o.id
where o.deleted_at is null
group by o.id;
comment on view public.v_organic_order_summary is 'Per-order rollup of item counts and totals for organic orders.';
