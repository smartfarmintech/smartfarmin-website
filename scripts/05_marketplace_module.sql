-- =====================================================================
-- Rythu360 :: 05 :: Marketplace Module
--   Sellers, catalog, inventory, carts, orders, returns, reviews.
--   Built on auth.users / public.user_profiles.
-- =====================================================================

-- ---------- enums (idempotent) ---------------------------------------
do $$ begin create type public.seller_status as enum
  ('pending','active','suspended','closed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.seller_type as enum
  ('farmer','fpo','dealer','company','individual'); exception when duplicate_object then null; end $$;

do $$ begin create type public.product_status as enum
  ('draft','active','out_of_stock','discontinued','archived'); exception when duplicate_object then null; end $$;

do $$ begin create type public.product_condition as enum
  ('new','used','refurbished'); exception when duplicate_object then null; end $$;

do $$ begin create type public.stock_movement_type as enum
  ('purchase','sale','return','adjustment','damage','transfer_in','transfer_out','initial'); exception when duplicate_object then null; end $$;

do $$ begin create type public.order_status as enum
  ('pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned'); exception when duplicate_object then null; end $$;

do $$ begin create type public.payment_status as enum
  ('unpaid','pending','paid','partially_refunded','refunded','failed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.payment_method as enum
  ('cod','upi','card','netbanking','wallet','emi','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.order_item_status as enum
  ('pending','confirmed','shipped','delivered','cancelled','returned'); exception when duplicate_object then null; end $$;

do $$ begin create type public.return_status as enum
  ('requested','approved','rejected','picked_up','received','completed','cancelled'); exception when duplicate_object then null; end $$;

do $$ begin create type public.return_reason as enum
  ('damaged','defective','wrong_item','not_as_described','no_longer_needed','quality_issue','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.refund_status as enum
  ('pending','processing','completed','failed','cancelled'); exception when duplicate_object then null; end $$;

do $$ begin create type public.refund_method as enum
  ('original','bank_transfer','upi','wallet','store_credit'); exception when duplicate_object then null; end $$;

do $$ begin create type public.review_status as enum
  ('pending','published','rejected','hidden'); exception when duplicate_object then null; end $$;

do $$ begin create type public.discount_type as enum
  ('percentage','fixed_amount','free_shipping','bogo'); exception when duplicate_object then null; end $$;

do $$ begin create type public.offer_scope as enum
  ('product','category','brand','seller','order'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- SELLER_PROFILES  (1:1 with a user)
-- =====================================================================
create table if not exists public.seller_profiles (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  farmer_id          uuid references public.farmers(id) on delete set null,
  village_id         uuid references public.villages(id) on delete set null,
  business_name      text not null,
  slug               text,
  seller_type        public.seller_type not null default 'individual',
  seller_status      public.seller_status not null default 'pending',
  gstin              text,
  pan_number         text,
  bank_account_last4 char(4),
  ifsc_code          text,
  contact_email      text,
  contact_phone      text,
  logo_url           text,
  description        text,
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  is_verified        boolean not null default false,
  verified_at        timestamptz,
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint seller_profiles_user_unique unique (user_id),
  constraint seller_profiles_slug_unique unique (slug),
  constraint seller_profiles_gstin_unique unique (gstin),
  constraint seller_profiles_pan_chk check (pan_number is null or pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  constraint seller_profiles_ifsc_chk check (ifsc_code is null or ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  constraint seller_profiles_rating_chk check (rating_avg between 0 and 5)
);
comment on table public.seller_profiles is 'Marketplace seller accounts (1:1 with a user).';

-- =====================================================================
-- BRANDS  (admin/reference; public read)
-- =====================================================================
create table if not exists public.brands (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null,
  logo_url     text,
  description  text,
  website_url  text,
  is_active    boolean not null default true,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  created_by   uuid,
  updated_by   uuid,
  constraint brands_name_unique unique (name),
  constraint brands_slug_unique unique (slug)
);
comment on table public.brands is 'Product brands (reference data, public read).';

-- =====================================================================
-- CATEGORIES  (self-referential hierarchy; public read)
-- =====================================================================
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid references public.categories(id) on delete set null,
  name         text not null,
  slug         text not null,
  description  text,
  icon_url     text,
  image_url    text,
  display_order integer not null default 0,
  is_active    boolean not null default true,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  created_by   uuid,
  updated_by   uuid,
  constraint categories_slug_unique unique (slug),
  constraint categories_no_self_parent check (parent_id is null or parent_id <> id)
);
comment on table public.categories is 'Hierarchical product categories (public read).';

-- =====================================================================
-- PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  seller_id        uuid not null references public.seller_profiles(id) on delete cascade,
  category_id      uuid references public.categories(id) on delete set null,
  brand_id         uuid references public.brands(id) on delete set null,
  name             text not null,
  slug             text,
  sku              text,
  description      text,
  short_description text,
  product_status   public.product_status not null default 'draft',
  product_condition public.product_condition not null default 'new',
  price            numeric(12,2) not null,
  compare_at_price numeric(12,2),
  cost_price       numeric(12,2),
  currency         char(3) not null default 'INR',
  tax_rate         numeric(5,2) not null default 0,
  unit             text,
  weight_grams     numeric(12,2),
  is_featured      boolean not null default false,
  rating_avg       numeric(3,2) not null default 0,
  rating_count     integer not null default 0,
  tags             text[] not null default '{}',
  status           public.record_status not null default 'active',
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz,
  created_by       uuid,
  updated_by       uuid,
  constraint products_seller_sku_unique unique (seller_id, sku),
  constraint products_slug_unique unique (slug),
  constraint products_price_chk check (price >= 0),
  constraint products_compare_chk check (compare_at_price is null or compare_at_price >= 0),
  constraint products_tax_chk check (tax_rate between 0 and 100),
  constraint products_rating_chk check (rating_avg between 0 and 5)
);
comment on table public.products is 'Marketplace product listings owned by sellers.';

-- =====================================================================
-- PRODUCT_IMAGES
-- =====================================================================
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  alt_text      text,
  display_order integer not null default 0,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint product_images_order_chk check (display_order >= 0)
);
comment on table public.product_images is 'Images for a product listing.';

-- =====================================================================
-- INVENTORY  (1:1 with product)
-- =====================================================================
create table if not exists public.inventory (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references public.products(id) on delete cascade,
  seller_id          uuid not null references public.seller_profiles(id) on delete cascade,
  quantity_available integer not null default 0,
  quantity_reserved  integer not null default 0,
  reorder_level      integer not null default 0,
  warehouse_location text,
  last_restocked_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint inventory_product_unique unique (product_id),
  constraint inventory_qty_avail_chk check (quantity_available >= 0),
  constraint inventory_qty_reserved_chk check (quantity_reserved >= 0),
  constraint inventory_reorder_chk check (reorder_level >= 0)
);
comment on table public.inventory is 'Stock levels per product (1:1).';

-- =====================================================================
-- STOCK_MOVEMENTS  (append-only ledger)
-- =====================================================================
create table if not exists public.stock_movements (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  seller_id      uuid not null references public.seller_profiles(id) on delete cascade,
  movement_type  public.stock_movement_type not null,
  quantity_delta integer not null,
  quantity_after integer,
  reference_type text,
  reference_id   uuid,
  notes          text,
  created_at     timestamptz not null default now(),
  created_by     uuid
);
comment on table public.stock_movements is 'Immutable ledger of inventory changes.';

-- =====================================================================
-- WISHLIST  (per user, references products)
-- =====================================================================
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint wishlist_user_product_unique unique (user_id, product_id)
);
comment on table public.wishlist is 'Per-user saved/wishlisted products.';

-- =====================================================================
-- CART  (1:1 with user)
-- =====================================================================
create table if not exists public.cart (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  coupon_id   uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint cart_user_unique unique (user_id)
);
comment on table public.cart is 'Shopping cart (1:1 with user).';

-- =====================================================================
-- CART_ITEMS
-- =====================================================================
create table if not exists public.cart_items (
  id           uuid primary key default gen_random_uuid(),
  cart_id      uuid not null references public.cart(id) on delete cascade,
  product_id   uuid not null references public.products(id) on delete cascade,
  quantity     integer not null default 1,
  unit_price   numeric(12,2) not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint cart_items_cart_product_unique unique (cart_id, product_id),
  constraint cart_items_qty_chk check (quantity > 0),
  constraint cart_items_price_chk check (unit_price >= 0)
);
comment on table public.cart_items is 'Line items within a shopping cart.';

-- =====================================================================
-- ORDERS
-- =====================================================================
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null,
  buyer_id           uuid not null references auth.users(id) on delete restrict,
  seller_id          uuid references public.seller_profiles(id) on delete set null,
  order_status       public.order_status not null default 'pending',
  payment_status     public.payment_status not null default 'unpaid',
  payment_method     public.payment_method,
  coupon_id          uuid,
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
  constraint orders_number_unique unique (order_number),
  constraint orders_subtotal_chk check (subtotal >= 0),
  constraint orders_discount_chk check (discount_amount >= 0),
  constraint orders_total_chk check (total_amount >= 0)
);
comment on table public.orders is 'Customer orders (header).';

-- =====================================================================
-- ORDER_ITEMS
-- =====================================================================
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  seller_id        uuid references public.seller_profiles(id) on delete set null,
  product_name     text not null,
  sku              text,
  quantity         integer not null,
  unit_price       numeric(12,2) not null,
  discount_amount  numeric(12,2) not null default 0,
  tax_amount       numeric(12,2) not null default 0,
  line_total       numeric(14,2) not null,
  item_status      public.order_item_status not null default 'pending',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint order_items_qty_chk check (quantity > 0),
  constraint order_items_price_chk check (unit_price >= 0),
  constraint order_items_total_chk check (line_total >= 0)
);
comment on table public.order_items is 'Line items within an order (price snapshot).';

-- =====================================================================
-- RETURNS
-- =====================================================================
create table if not exists public.returns (
  id             uuid primary key default gen_random_uuid(),
  return_number  text not null,
  order_id       uuid not null references public.orders(id) on delete cascade,
  order_item_id  uuid references public.order_items(id) on delete set null,
  buyer_id       uuid not null references auth.users(id) on delete cascade,
  seller_id      uuid references public.seller_profiles(id) on delete set null,
  return_status  public.return_status not null default 'requested',
  reason         public.return_reason not null,
  quantity       integer not null default 1,
  comments       text,
  requested_at   timestamptz not null default now(),
  resolved_at    timestamptz,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint returns_number_unique unique (return_number),
  constraint returns_qty_chk check (quantity > 0)
);
comment on table public.returns is 'Return requests against orders/items.';

-- =====================================================================
-- REFUNDS
-- =====================================================================
create table if not exists public.refunds (
  id             uuid primary key default gen_random_uuid(),
  refund_number  text not null,
  order_id       uuid not null references public.orders(id) on delete cascade,
  return_id      uuid references public.returns(id) on delete set null,
  buyer_id       uuid not null references auth.users(id) on delete cascade,
  refund_status  public.refund_status not null default 'pending',
  refund_method  public.refund_method not null default 'original',
  amount         numeric(14,2) not null,
  currency       char(3) not null default 'INR',
  transaction_ref text,
  processed_at   timestamptz,
  notes          text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint refunds_number_unique unique (refund_number),
  constraint refunds_amount_chk check (amount >= 0)
);
comment on table public.refunds is 'Refunds issued against orders/returns.';

-- =====================================================================
-- REVIEWS  (textual product reviews)
-- =====================================================================
create table if not exists public.reviews (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid not null references public.products(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  order_item_id     uuid references public.order_items(id) on delete set null,
  rating            smallint not null,
  title             text,
  body              text,
  review_status     public.review_status not null default 'pending',
  is_verified_purchase boolean not null default false,
  helpful_count     integer not null default 0,
  seller_response   text,
  responded_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  created_by        uuid,
  updated_by        uuid,
  constraint reviews_user_product_unique unique (product_id, user_id),
  constraint reviews_rating_chk check (rating between 1 and 5)
);
comment on table public.reviews is 'Textual product reviews (one per user/product).';

-- =====================================================================
-- RATINGS  (lightweight star ratings, e.g. seller or product)
-- =====================================================================
create table if not exists public.ratings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_id   uuid references public.products(id) on delete cascade,
  seller_id    uuid references public.seller_profiles(id) on delete cascade,
  rating       smallint not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint ratings_rating_chk check (rating between 1 and 5),
  constraint ratings_target_chk check (product_id is not null or seller_id is not null),
  constraint ratings_user_product_unique unique (user_id, product_id),
  constraint ratings_user_seller_unique unique (user_id, seller_id)
);
comment on table public.ratings is 'Lightweight star ratings for products or sellers.';

-- =====================================================================
-- OFFERS  (promotions on products/categories/brands/sellers)
-- =====================================================================
create table if not exists public.offers (
  id             uuid primary key default gen_random_uuid(),
  seller_id      uuid references public.seller_profiles(id) on delete cascade,
  title          text not null,
  description    text,
  offer_scope    public.offer_scope not null default 'product',
  discount_type  public.discount_type not null default 'percentage',
  discount_value numeric(12,2) not null,
  product_id     uuid references public.products(id) on delete cascade,
  category_id    uuid references public.categories(id) on delete cascade,
  brand_id       uuid references public.brands(id) on delete cascade,
  min_order_value numeric(12,2),
  max_discount   numeric(12,2),
  starts_at      timestamptz,
  ends_at        timestamptz,
  is_active      boolean not null default true,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint offers_value_chk check (discount_value >= 0),
  constraint offers_dates_chk check (ends_at is null or starts_at is null or ends_at >= starts_at)
);
comment on table public.offers is 'Promotional offers scoped to product/category/brand/seller.';

-- =====================================================================
-- COUPONS  (discount codes)
-- =====================================================================
create table if not exists public.coupons (
  id                uuid primary key default gen_random_uuid(),
  seller_id         uuid references public.seller_profiles(id) on delete cascade,
  code              text not null,
  description       text,
  discount_type     public.discount_type not null default 'percentage',
  discount_value    numeric(12,2) not null,
  min_order_value   numeric(12,2),
  max_discount      numeric(12,2),
  usage_limit       integer,
  usage_count       integer not null default 0,
  per_user_limit    integer,
  starts_at         timestamptz,
  ends_at           timestamptz,
  is_active         boolean not null default true,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  created_by        uuid,
  updated_by        uuid,
  constraint coupons_code_unique unique (code),
  constraint coupons_value_chk check (discount_value >= 0),
  constraint coupons_usage_chk check (usage_limit is null or usage_limit >= 0),
  constraint coupons_dates_chk check (ends_at is null or starts_at is null or ends_at >= starts_at)
);
comment on table public.coupons is 'Discount coupon codes.';

-- ---- deferred FKs referencing coupons -------------------------------
alter table public.cart
  drop constraint if exists cart_coupon_fk,
  add constraint cart_coupon_fk foreign key (coupon_id) references public.coupons(id) on delete set null;
alter table public.orders
  drop constraint if exists orders_coupon_fk,
  add constraint orders_coupon_fk foreign key (coupon_id) references public.coupons(id) on delete set null;

-- =====================================================================
-- Ownership helper functions (security definer to avoid RLS recursion)
-- =====================================================================
create or replace function public.owns_seller(p_seller_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.seller_profiles s
    where s.id = p_seller_id and s.user_id = auth.uid()
  );
$$;

create or replace function public.owns_product(p_product_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.products p
    join public.seller_profiles s on s.id = p.seller_id
    where p.id = p_product_id and s.user_id = auth.uid()
  );
$$;

create or replace function public.owns_cart(p_cart_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.cart c
    where c.id = p_cart_id and c.user_id = auth.uid()
  );
$$;

create or replace function public.owns_order(p_order_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.orders o
    where o.id = p_order_id and o.buyer_id = auth.uid()
  );
$$;

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_seller_profiles_user   on public.seller_profiles(user_id);
create index if not exists idx_seller_profiles_status  on public.seller_profiles(seller_status) where deleted_at is null;
create index if not exists idx_categories_parent       on public.categories(parent_id);
create index if not exists idx_products_seller         on public.products(seller_id);
create index if not exists idx_products_category        on public.products(category_id);
create index if not exists idx_products_brand           on public.products(brand_id);
create index if not exists idx_products_status          on public.products(product_status) where deleted_at is null;
create index if not exists idx_products_featured        on public.products(is_featured) where is_featured and deleted_at is null;
create index if not exists idx_products_tags            on public.products using gin(tags);
create index if not exists idx_product_images_product   on public.product_images(product_id);
create index if not exists idx_inventory_product        on public.inventory(product_id);
create index if not exists idx_inventory_seller         on public.inventory(seller_id);
create index if not exists idx_stock_movements_product  on public.stock_movements(product_id);
create index if not exists idx_stock_movements_seller   on public.stock_movements(seller_id);
create index if not exists idx_stock_movements_created  on public.stock_movements(created_at desc);
create index if not exists idx_wishlist_user            on public.wishlist(user_id);
create index if not exists idx_wishlist_product         on public.wishlist(product_id);
create index if not exists idx_cart_user               on public.cart(user_id);
create index if not exists idx_cart_items_cart          on public.cart_items(cart_id);
create index if not exists idx_cart_items_product       on public.cart_items(product_id);
create index if not exists idx_orders_buyer            on public.orders(buyer_id);
create index if not exists idx_orders_seller           on public.orders(seller_id);
create index if not exists idx_orders_status           on public.orders(order_status) where deleted_at is null;
create index if not exists idx_orders_placed           on public.orders(placed_at desc);
create index if not exists idx_order_items_order        on public.order_items(order_id);
create index if not exists idx_order_items_product      on public.order_items(product_id);
create index if not exists idx_order_items_seller       on public.order_items(seller_id);
create index if not exists idx_returns_order           on public.returns(order_id);
create index if not exists idx_returns_buyer           on public.returns(buyer_id);
create index if not exists idx_returns_seller          on public.returns(seller_id);
create index if not exists idx_refunds_order           on public.refunds(order_id);
create index if not exists idx_refunds_buyer           on public.refunds(buyer_id);
create index if not exists idx_reviews_product          on public.reviews(product_id);
create index if not exists idx_reviews_user             on public.reviews(user_id);
create index if not exists idx_reviews_status           on public.reviews(review_status) where deleted_at is null;
create index if not exists idx_ratings_product          on public.ratings(product_id);
create index if not exists idx_ratings_seller           on public.ratings(seller_id);
create index if not exists idx_ratings_user             on public.ratings(user_id);
create index if not exists idx_offers_seller            on public.offers(seller_id);
create index if not exists idx_offers_product           on public.offers(product_id);
create index if not exists idx_offers_active            on public.offers(is_active) where deleted_at is null;
create index if not exists idx_coupons_seller           on public.coupons(seller_id);
create index if not exists idx_coupons_active           on public.coupons(is_active) where deleted_at is null;

-- =====================================================================
-- Triggers: updated_at + audit + soft-delete
-- =====================================================================
do $$
declare
  t text;
  updated_at_tables text[] := array[
    'seller_profiles','brands','categories','products','product_images','inventory',
    'wishlist','cart','cart_items','orders','order_items','returns','refunds',
    'reviews','ratings','offers','coupons'
  ];
  audit_tables text[] := array[
    'seller_profiles','brands','categories','products','orders','order_items',
    'returns','refunds','reviews','offers','coupons'
  ];
  softdel_tables text[] := array[
    'seller_profiles','brands','categories','products','orders',
    'returns','refunds','reviews','offers','coupons'
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
    'seller_profiles','brands','categories','products','product_images','inventory',
    'stock_movements','wishlist','cart','cart_items','orders','order_items',
    'returns','refunds','reviews','ratings','offers','coupons'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- ---- public catalog: read for all authenticated, write for admin ----
do $$
declare t text;
begin
  foreach t in array array['brands','categories'] loop
    execute format('drop policy if exists "%1$s_read" on public.%1$s;', t);
    execute format('create policy "%1$s_read" on public.%1$s for select to authenticated using (true);', t);
    execute format('drop policy if exists "%1$s_admin_write" on public.%1$s;', t);
    execute format('create policy "%1$s_admin_write" on public.%1$s for all to authenticated
      using (public.is_platform_admin()) with check (public.is_platform_admin());', t);
  end loop;
end $$;

-- seller_profiles: public read; owner or admin write
drop policy if exists "seller_profiles_read" on public.seller_profiles;
create policy "seller_profiles_read" on public.seller_profiles
  for select to authenticated using (true);
drop policy if exists "seller_profiles_owner_write" on public.seller_profiles;
create policy "seller_profiles_owner_write" on public.seller_profiles
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- products: public read of active; seller owns writes
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products
  for select to authenticated
  using (product_status = 'active' or public.owns_seller(seller_id) or public.is_platform_admin());
drop policy if exists "products_seller_write" on public.products;
create policy "products_seller_write" on public.products
  for all to authenticated
  using (public.owns_seller(seller_id) or public.is_platform_admin())
  with check (public.owns_seller(seller_id) or public.is_platform_admin());

-- product_images: public read; seller owns writes
drop policy if exists "product_images_read" on public.product_images;
create policy "product_images_read" on public.product_images
  for select to authenticated using (true);
drop policy if exists "product_images_seller_write" on public.product_images;
create policy "product_images_seller_write" on public.product_images
  for all to authenticated
  using (public.owns_product(product_id) or public.is_platform_admin())
  with check (public.owns_product(product_id) or public.is_platform_admin());

-- inventory + stock_movements: seller-only
do $$
declare t text;
begin
  foreach t in array array['inventory','stock_movements'] loop
    execute format('drop policy if exists "%1$s_seller_all" on public.%1$s;', t);
    execute format('create policy "%1$s_seller_all" on public.%1$s for all to authenticated
      using (public.owns_seller(seller_id) or public.is_platform_admin())
      with check (public.owns_seller(seller_id) or public.is_platform_admin());', t);
  end loop;
end $$;

-- wishlist: buyer-owned
drop policy if exists "wishlist_own_all" on public.wishlist;
create policy "wishlist_own_all" on public.wishlist
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- cart: buyer-owned
drop policy if exists "cart_own_all" on public.cart;
create policy "cart_own_all" on public.cart
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- cart_items: via cart ownership
drop policy if exists "cart_items_own_all" on public.cart_items;
create policy "cart_items_own_all" on public.cart_items
  for all to authenticated
  using (public.owns_cart(cart_id) or public.is_platform_admin())
  with check (public.owns_cart(cart_id) or public.is_platform_admin());

-- orders: buyer sees own; seller sees their orders; admin all
drop policy if exists "orders_access" on public.orders;
create policy "orders_access" on public.orders
  for all to authenticated
  using (buyer_id = auth.uid() or public.owns_seller(seller_id) or public.is_platform_admin())
  with check (buyer_id = auth.uid() or public.is_platform_admin());

-- order_items: via order ownership or seller of the line
drop policy if exists "order_items_access" on public.order_items;
create policy "order_items_access" on public.order_items
  for all to authenticated
  using (public.owns_order(order_id) or public.owns_seller(seller_id) or public.is_platform_admin())
  with check (public.owns_order(order_id) or public.is_platform_admin());

-- returns: buyer-owned (seller read via their seller_id)
drop policy if exists "returns_access" on public.returns;
create policy "returns_access" on public.returns
  for all to authenticated
  using (buyer_id = auth.uid() or public.owns_seller(seller_id) or public.is_platform_admin())
  with check (buyer_id = auth.uid() or public.is_platform_admin());

-- refunds: buyer-owned (+admin)
drop policy if exists "refunds_access" on public.refunds;
create policy "refunds_access" on public.refunds
  for all to authenticated
  using (buyer_id = auth.uid() or public.is_platform_admin())
  with check (buyer_id = auth.uid() or public.is_platform_admin());

-- reviews: public read of published; author writes own
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews
  for select to authenticated
  using (review_status = 'published' or user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "reviews_author_write" on public.reviews;
create policy "reviews_author_write" on public.reviews
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- ratings: public read; author writes own
drop policy if exists "ratings_read" on public.ratings;
create policy "ratings_read" on public.ratings
  for select to authenticated using (true);
drop policy if exists "ratings_author_write" on public.ratings;
create policy "ratings_author_write" on public.ratings
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- offers: public read of active; seller (or admin for platform-wide) writes
drop policy if exists "offers_read" on public.offers;
create policy "offers_read" on public.offers
  for select to authenticated
  using (is_active or public.owns_seller(seller_id) or public.is_platform_admin());
drop policy if exists "offers_write" on public.offers;
create policy "offers_write" on public.offers
  for all to authenticated
  using ((seller_id is not null and public.owns_seller(seller_id)) or public.is_platform_admin())
  with check ((seller_id is not null and public.owns_seller(seller_id)) or public.is_platform_admin());

-- coupons: public read of active; seller (or admin) writes
drop policy if exists "coupons_read" on public.coupons;
create policy "coupons_read" on public.coupons
  for select to authenticated
  using (is_active or public.owns_seller(seller_id) or public.is_platform_admin());
drop policy if exists "coupons_write" on public.coupons;
create policy "coupons_write" on public.coupons
  for all to authenticated
  using ((seller_id is not null and public.owns_seller(seller_id)) or public.is_platform_admin())
  with check ((seller_id is not null and public.owns_seller(seller_id)) or public.is_platform_admin());

-- =====================================================================
-- Views (security_invoker so RLS of the querying user applies)
-- =====================================================================
create or replace view public.v_product_catalog
with (security_invoker = true) as
select
  p.id            as product_id,
  p.name,
  p.slug,
  p.price,
  p.compare_at_price,
  p.currency,
  p.product_status,
  p.rating_avg,
  p.rating_count,
  s.id            as seller_id,
  s.business_name as seller_name,
  c.id            as category_id,
  c.name          as category_name,
  b.id            as brand_id,
  b.name          as brand_name,
  coalesce(i.quantity_available, 0) as quantity_available,
  (select pi.image_url from public.product_images pi
     where pi.product_id = p.id order by pi.is_primary desc, pi.display_order asc limit 1) as primary_image_url
from public.products p
left join public.seller_profiles s on s.id = p.seller_id
left join public.categories c on c.id = p.category_id
left join public.brands b on b.id = p.brand_id
left join public.inventory i on i.product_id = p.id
where p.deleted_at is null;
comment on view public.v_product_catalog is 'Denormalized product catalog for browsing.';

create or replace view public.v_order_summary
with (security_invoker = true) as
select
  o.id            as order_id,
  o.order_number,
  o.buyer_id,
  o.seller_id,
  o.order_status,
  o.payment_status,
  o.total_amount,
  o.currency,
  o.placed_at,
  count(oi.id)    as item_count,
  coalesce(sum(oi.quantity), 0) as total_quantity
from public.orders o
left join public.order_items oi on oi.order_id = o.id
where o.deleted_at is null
group by o.id;
comment on view public.v_order_summary is 'Per-order rollup of item counts and totals.';

create or replace view public.v_cart_detail
with (security_invoker = true) as
select
  ci.id           as cart_item_id,
  c.id            as cart_id,
  c.user_id,
  ci.product_id,
  p.name          as product_name,
  ci.quantity,
  ci.unit_price,
  (ci.quantity * ci.unit_price) as line_total,
  coalesce(i.quantity_available, 0) as quantity_available
from public.cart c
join public.cart_items ci on ci.cart_id = c.id
left join public.products p on p.id = ci.product_id
left join public.inventory i on i.product_id = ci.product_id;
comment on view public.v_cart_detail is 'Cart line items with product and stock info.';
