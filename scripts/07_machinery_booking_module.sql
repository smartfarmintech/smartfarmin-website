-- =====================================================================
-- Rythu360 :: 07 :: Machinery Booking Module
--   Farm machinery rental: catalog, operators, pricing, availability,
--   bookings, payments, maintenance, reviews, live GPS tracking.
--   Built on auth.users / farmers / villages / record_status /
--   is_platform_admin() and shared trigger functions.
-- =====================================================================

create extension if not exists btree_gist;

-- ---------- enums (idempotent) ---------------------------------------
do $$ begin create type public.machine_status as enum
  ('draft','active','booked','under_maintenance','inactive','retired'); exception when duplicate_object then null; end $$;

do $$ begin create type public.machine_ownership as enum
  ('individual','cooperative','custom_hiring_center','dealer','government'); exception when duplicate_object then null; end $$;

do $$ begin create type public.fuel_type as enum
  ('diesel','petrol','electric','cng','manual','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.operator_status as enum
  ('pending','active','suspended','inactive'); exception when duplicate_object then null; end $$;

do $$ begin create type public.operator_doc_type as enum
  ('driving_license','aadhaar','training_certificate','police_verification','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.doc_verification_status as enum
  ('pending','verified','rejected','expired'); exception when duplicate_object then null; end $$;

do $$ begin create type public.pricing_unit as enum
  ('per_hour','per_day','per_acre','per_km','flat'); exception when duplicate_object then null; end $$;

do $$ begin create type public.availability_status as enum
  ('available','blocked','booked','maintenance'); exception when duplicate_object then null; end $$;

do $$ begin create type public.booking_state as enum
  ('requested','confirmed','operator_assigned','in_progress','completed','cancelled','rejected','no_show'); exception when duplicate_object then null; end $$;

do $$ begin create type public.machinery_payment_status as enum
  ('unpaid','advance_paid','pending','paid','partially_refunded','refunded','failed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.machinery_payment_method as enum
  ('cash','upi','card','netbanking','wallet','bank_transfer','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.maintenance_type as enum
  ('routine','repair','inspection','breakdown','servicing'); exception when duplicate_object then null; end $$;

do $$ begin create type public.maintenance_status as enum
  ('scheduled','in_progress','completed','cancelled'); exception when duplicate_object then null; end $$;

do $$ begin create type public.review_publish_status as enum
  ('pending','published','rejected','hidden'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- MACHINERY_CATEGORIES  (self-referential hierarchy; public read)
-- =====================================================================
create table if not exists public.machinery_categories (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references public.machinery_categories(id) on delete set null,
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
  constraint machinery_categories_slug_unique unique (slug),
  constraint machinery_categories_no_self_parent check (parent_id is null or parent_id <> id)
);
comment on table public.machinery_categories is 'Hierarchical machinery categories (tractor, harvester, etc.).';

-- =====================================================================
-- MACHINES  (a rentable machine owned by a user)
-- =====================================================================
create table if not exists public.machines (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  category_id        uuid references public.machinery_categories(id) on delete set null,
  village_id         uuid references public.villages(id) on delete set null,
  name               text not null,
  slug               text,
  machine_status     public.machine_status not null default 'draft',
  ownership_type     public.machine_ownership not null default 'individual',
  brand              text,
  model              text,
  manufacture_year   integer,
  registration_no    text,
  fuel              public.fuel_type not null default 'diesel',
  power_hp           numeric(8,2),
  description        text,
  specifications     jsonb not null default '{}'::jsonb,
  implements_included text[] not null default '{}',
  operator_included  boolean not null default false,
  base_location      text,
  service_radius_km  numeric(8,2),
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  image_url          text,
  gallery_urls       text[] not null default '{}',
  min_booking_hours  numeric(6,2),
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  total_bookings     integer not null default 0,
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint machines_slug_unique unique (slug),
  constraint machines_reg_unique unique (registration_no),
  constraint machines_year_chk check (manufacture_year is null or manufacture_year between 1900 and extract(year from now())::int + 1),
  constraint machines_power_chk check (power_hp is null or power_hp >= 0),
  constraint machines_radius_chk check (service_radius_km is null or service_radius_km >= 0),
  constraint machines_rating_chk check (rating_avg between 0 and 5),
  constraint machines_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint machines_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.machines is 'Rentable farm machines owned by users.';

-- =====================================================================
-- OPERATORS  (drivers/operators, optionally linked to a user)
-- =====================================================================
create table if not exists public.operators (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  user_id            uuid references auth.users(id) on delete set null,
  village_id         uuid references public.villages(id) on delete set null,
  full_name          text not null,
  phone              text,
  operator_status    public.operator_status not null default 'pending',
  years_experience   integer,
  skills             text[] not null default '{}',
  daily_wage         numeric(10,2),
  photo_url          text,
  is_verified        boolean not null default false,
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint operators_experience_chk check (years_experience is null or years_experience >= 0),
  constraint operators_wage_chk check (daily_wage is null or daily_wage >= 0),
  constraint operators_rating_chk check (rating_avg between 0 and 5)
);
comment on table public.operators is 'Machine operators/drivers managed by an owner.';

-- =====================================================================
-- OPERATOR_DOCUMENTS
-- =====================================================================
create table if not exists public.operator_documents (
  id                  uuid primary key default gen_random_uuid(),
  operator_id         uuid not null references public.operators(id) on delete cascade,
  doc_type            public.operator_doc_type not null default 'driving_license',
  verification_status public.doc_verification_status not null default 'pending',
  document_number     text,
  document_url        text,
  issued_on           date,
  expires_on          date,
  verified_at         timestamptz,
  status              public.record_status not null default 'active',
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,
  created_by          uuid,
  updated_by          uuid,
  constraint operator_documents_dates_chk check (expires_on is null or issued_on is null or expires_on >= issued_on)
);
comment on table public.operator_documents is 'Verification documents for operators.';

-- =====================================================================
-- PRICING_RULES  (per-machine pricing tiers)
-- =====================================================================
create table if not exists public.pricing_rules (
  id            uuid primary key default gen_random_uuid(),
  machine_id    uuid not null references public.machines(id) on delete cascade,
  name          text,
  unit          public.pricing_unit not null default 'per_hour',
  price         numeric(12,2) not null,
  currency      char(3) not null default 'INR',
  min_units     numeric(10,2),
  max_units     numeric(10,2),
  operator_fee  numeric(12,2) not null default 0,
  fuel_included boolean not null default false,
  season_start  date,
  season_end    date,
  valid_from    date,
  valid_until   date,
  is_active     boolean not null default true,
  priority      integer not null default 0,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  created_by    uuid,
  updated_by    uuid,
  constraint pricing_rules_price_chk check (price >= 0),
  constraint pricing_rules_operfee_chk check (operator_fee >= 0),
  constraint pricing_rules_units_chk check (max_units is null or min_units is null or max_units >= min_units),
  constraint pricing_rules_valid_chk check (valid_until is null or valid_from is null or valid_until >= valid_from)
);
comment on table public.pricing_rules is 'Pricing tiers for a machine (per hour/day/acre/km).';

-- =====================================================================
-- AVAILABILITY  (machine availability windows)
-- =====================================================================
create table if not exists public.availability (
  id            uuid primary key default gen_random_uuid(),
  machine_id    uuid not null references public.machines(id) on delete cascade,
  slot_status   public.availability_status not null default 'available',
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  reason        text,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint availability_range_chk check (ends_at > starts_at),
  -- prevent two overlapping non-available (blocked/booked/maintenance) windows for a machine
  constraint availability_no_overlap exclude using gist (
    machine_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (slot_status <> 'available')
);
comment on table public.availability is 'Availability/blocked windows for a machine.';

-- =====================================================================
-- BOOKINGS
-- =====================================================================
create table if not exists public.bookings (
  id                 uuid primary key default gen_random_uuid(),
  booking_number     text not null,
  machine_id         uuid not null references public.machines(id) on delete restrict,
  owner_id           uuid not null references auth.users(id) on delete restrict,
  renter_id          uuid not null references auth.users(id) on delete restrict,
  operator_id        uuid references public.operators(id) on delete set null,
  pricing_rule_id    uuid references public.pricing_rules(id) on delete set null,
  village_id         uuid references public.villages(id) on delete set null,
  booking_state      public.booking_state not null default 'requested',
  payment_status     public.machinery_payment_status not null default 'unpaid',
  starts_at          timestamptz not null,
  ends_at            timestamptz not null,
  units              numeric(10,2),
  unit_type          public.pricing_unit,
  service_address    jsonb,
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  unit_price         numeric(12,2) not null default 0,
  operator_fee       numeric(12,2) not null default 0,
  discount_amount    numeric(12,2) not null default 0,
  tax_amount         numeric(12,2) not null default 0,
  total_amount       numeric(14,2) not null default 0,
  advance_amount     numeric(14,2) not null default 0,
  currency           char(3) not null default 'INR',
  notes              text,
  cancel_reason      text,
  confirmed_at       timestamptz,
  completed_at       timestamptz,
  cancelled_at       timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint bookings_number_unique unique (booking_number),
  constraint bookings_range_chk check (ends_at > starts_at),
  constraint bookings_total_chk check (total_amount >= 0),
  constraint bookings_advance_chk check (advance_amount >= 0 and advance_amount <= total_amount),
  constraint bookings_not_self check (renter_id <> owner_id),
  constraint bookings_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint bookings_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.bookings is 'Machinery rental bookings.';

-- =====================================================================
-- BOOKING_STATUS  (status transition history / audit log)
-- =====================================================================
create table if not exists public.booking_status (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.bookings(id) on delete cascade,
  from_state    public.booking_state,
  to_state      public.booking_state not null,
  note          text,
  changed_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);
comment on table public.booking_status is 'Immutable history of booking state transitions.';

-- =====================================================================
-- BOOKING_PAYMENTS
-- =====================================================================
create table if not exists public.booking_payments (
  id                 uuid primary key default gen_random_uuid(),
  booking_id         uuid not null references public.bookings(id) on delete cascade,
  payer_id           uuid references auth.users(id) on delete set null,
  amount             numeric(14,2) not null,
  currency           char(3) not null default 'INR',
  method             public.machinery_payment_method not null default 'upi',
  payment_status     public.machinery_payment_status not null default 'pending',
  is_advance         boolean not null default false,
  is_refund          boolean not null default false,
  transaction_ref    text,
  gateway            text,
  paid_at            timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid,
  updated_by         uuid,
  constraint booking_payments_txn_unique unique (transaction_ref),
  constraint booking_payments_amount_chk check (amount >= 0)
);
comment on table public.booking_payments is 'Payments and refunds against a booking.';

-- =====================================================================
-- MAINTENANCE  (machine maintenance log)
-- =====================================================================
create table if not exists public.maintenance (
  id                 uuid primary key default gen_random_uuid(),
  machine_id         uuid not null references public.machines(id) on delete cascade,
  maint_type         public.maintenance_type not null default 'routine',
  maint_status       public.maintenance_status not null default 'scheduled',
  title              text not null,
  description        text,
  scheduled_at       timestamptz,
  started_at         timestamptz,
  completed_at       timestamptz,
  cost               numeric(12,2),
  currency           char(3) not null default 'INR',
  service_provider   text,
  odometer_hours     numeric(10,2),
  status             public.record_status not null default 'active',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint maintenance_cost_chk check (cost is null or cost >= 0)
);
comment on table public.maintenance is 'Maintenance and repair records for machines.';

-- =====================================================================
-- MACHINE_REVIEWS
-- =====================================================================
create table if not exists public.machine_reviews (
  id                   uuid primary key default gen_random_uuid(),
  machine_id           uuid not null references public.machines(id) on delete cascade,
  booking_id           uuid references public.bookings(id) on delete set null,
  operator_id          uuid references public.operators(id) on delete set null,
  user_id              uuid not null references auth.users(id) on delete cascade,
  rating               smallint not null,
  operator_rating      smallint,
  title                text,
  body                 text,
  review_status        public.review_publish_status not null default 'pending',
  is_verified_booking  boolean not null default false,
  helpful_count        integer not null default 0,
  owner_response       text,
  responded_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  created_by           uuid,
  updated_by           uuid,
  constraint machine_reviews_booking_user_unique unique (booking_id, user_id),
  constraint machine_reviews_rating_chk check (rating between 1 and 5),
  constraint machine_reviews_oprating_chk check (operator_rating is null or operator_rating between 1 and 5)
);
comment on table public.machine_reviews is 'Reviews for machines and their operators (one per booking/user).';

-- =====================================================================
-- GPS_LOCATIONS  (live/ historical machine location pings)
-- =====================================================================
create table if not exists public.gps_locations (
  id            uuid primary key default gen_random_uuid(),
  machine_id    uuid not null references public.machines(id) on delete cascade,
  booking_id    uuid references public.bookings(id) on delete set null,
  latitude      numeric(9,6) not null,
  longitude     numeric(9,6) not null,
  speed_kmph    numeric(7,2),
  heading       numeric(6,2),
  accuracy_m    numeric(8,2),
  recorded_at   timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  constraint gps_locations_lat_chk check (latitude between -90 and 90),
  constraint gps_locations_lng_chk check (longitude between -180 and 180),
  constraint gps_locations_speed_chk check (speed_kmph is null or speed_kmph >= 0),
  constraint gps_locations_heading_chk check (heading is null or heading between 0 and 360)
);
comment on table public.gps_locations is 'GPS tracking pings for machines (optionally tied to a booking).';

-- =====================================================================
-- Ownership helper functions (security definer to avoid RLS recursion)
-- =====================================================================
create or replace function public.owns_machine(p_machine_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.machines m
    where m.id = p_machine_id and m.owner_id = auth.uid()
  );
$$;

create or replace function public.owns_operator(p_operator_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.operators o
    where o.id = p_operator_id and o.owner_id = auth.uid()
  );
$$;

create or replace function public.owns_booking(p_booking_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.bookings b
    where b.id = p_booking_id and (b.renter_id = auth.uid() or b.owner_id = auth.uid())
  );
$$;

-- =====================================================================
-- Booking status-history logging trigger
-- =====================================================================
create or replace function public.log_booking_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.booking_status(booking_id, from_state, to_state, changed_by)
    values (new.id, null, new.booking_state, auth.uid());
  elsif tg_op = 'UPDATE' and new.booking_state is distinct from old.booking_state then
    insert into public.booking_status(booking_id, from_state, to_state, changed_by)
    values (new.id, old.booking_state, new.booking_state, auth.uid());
  end if;
  return new;
end;
$$;

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_machinery_categories_parent on public.machinery_categories(parent_id);
create index if not exists idx_machines_owner       on public.machines(owner_id);
create index if not exists idx_machines_category    on public.machines(category_id);
create index if not exists idx_machines_village     on public.machines(village_id);
create index if not exists idx_machines_status      on public.machines(machine_status) where deleted_at is null;
create index if not exists idx_machines_geo         on public.machines(latitude, longitude);
create index if not exists idx_machines_specs       on public.machines using gin(specifications);
create index if not exists idx_operators_owner      on public.operators(owner_id);
create index if not exists idx_operators_user       on public.operators(user_id);
create index if not exists idx_operators_status     on public.operators(operator_status) where deleted_at is null;
create index if not exists idx_operator_documents_operator on public.operator_documents(operator_id);
create index if not exists idx_operator_documents_status on public.operator_documents(verification_status);
create index if not exists idx_pricing_rules_machine on public.pricing_rules(machine_id);
create index if not exists idx_pricing_rules_active  on public.pricing_rules(machine_id) where is_active and deleted_at is null;
create index if not exists idx_availability_machine  on public.availability(machine_id);
create index if not exists idx_availability_range    on public.availability using gist (machine_id, tstzrange(starts_at, ends_at));
create index if not exists idx_bookings_machine      on public.bookings(machine_id);
create index if not exists idx_bookings_owner        on public.bookings(owner_id);
create index if not exists idx_bookings_renter       on public.bookings(renter_id);
create index if not exists idx_bookings_operator     on public.bookings(operator_id);
create index if not exists idx_bookings_state        on public.bookings(booking_state) where deleted_at is null;
create index if not exists idx_bookings_starts       on public.bookings(starts_at desc);
create index if not exists idx_booking_status_booking on public.booking_status(booking_id);
create index if not exists idx_booking_payments_booking on public.booking_payments(booking_id);
create index if not exists idx_booking_payments_payer on public.booking_payments(payer_id);
create index if not exists idx_maintenance_machine   on public.maintenance(machine_id);
create index if not exists idx_maintenance_status    on public.maintenance(maint_status) where deleted_at is null;
create index if not exists idx_machine_reviews_machine on public.machine_reviews(machine_id);
create index if not exists idx_machine_reviews_operator on public.machine_reviews(operator_id);
create index if not exists idx_machine_reviews_user  on public.machine_reviews(user_id);
create index if not exists idx_machine_reviews_status on public.machine_reviews(review_status) where deleted_at is null;
create index if not exists idx_gps_locations_machine on public.gps_locations(machine_id, recorded_at desc);
create index if not exists idx_gps_locations_booking on public.gps_locations(booking_id, recorded_at desc);

-- =====================================================================
-- Triggers: updated_at + audit + soft-delete + status logging
-- =====================================================================
do $$
declare
  t text;
  updated_at_tables text[] := array[
    'machinery_categories','machines','operators','operator_documents','pricing_rules',
    'availability','bookings','booking_payments','maintenance','machine_reviews'
  ];
  audit_tables text[] := array[
    'machinery_categories','machines','operators','operator_documents','pricing_rules',
    'bookings','booking_payments','maintenance','machine_reviews'
  ];
  softdel_tables text[] := array[
    'machinery_categories','machines','operators','operator_documents','pricing_rules',
    'bookings','maintenance','machine_reviews'
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

drop trigger if exists trg_bookings_status_log on public.bookings;
create trigger trg_bookings_status_log
  after insert or update of booking_state on public.bookings
  for each row execute function public.log_booking_status();

-- =====================================================================
-- Row Level Security + policies
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'machinery_categories','machines','operators','operator_documents','pricing_rules',
    'availability','bookings','booking_status','booking_payments','maintenance',
    'machine_reviews','gps_locations'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- machinery_categories: public read; admin write
drop policy if exists "machinery_categories_read" on public.machinery_categories;
create policy "machinery_categories_read" on public.machinery_categories
  for select to authenticated using (true);
drop policy if exists "machinery_categories_admin_write" on public.machinery_categories;
create policy "machinery_categories_admin_write" on public.machinery_categories
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- machines: public read active; owner/admin write
drop policy if exists "machines_read" on public.machines;
create policy "machines_read" on public.machines
  for select to authenticated
  using (machine_status in ('active','booked') or owner_id = auth.uid() or public.is_platform_admin());
drop policy if exists "machines_owner_write" on public.machines;
create policy "machines_owner_write" on public.machines
  for all to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin())
  with check (owner_id = auth.uid() or public.is_platform_admin());

-- operators: public read; owner/admin write
drop policy if exists "operators_read" on public.operators;
create policy "operators_read" on public.operators
  for select to authenticated using (true);
drop policy if exists "operators_owner_write" on public.operators;
create policy "operators_owner_write" on public.operators
  for all to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin())
  with check (owner_id = auth.uid() or public.is_platform_admin());

-- operator_documents: operator-owner/admin only (sensitive)
drop policy if exists "operator_documents_access" on public.operator_documents;
create policy "operator_documents_access" on public.operator_documents
  for all to authenticated
  using (public.owns_operator(operator_id) or public.is_platform_admin())
  with check (public.owns_operator(operator_id) or public.is_platform_admin());

-- pricing_rules: public read; machine owner/admin write
drop policy if exists "pricing_rules_read" on public.pricing_rules;
create policy "pricing_rules_read" on public.pricing_rules
  for select to authenticated using (true);
drop policy if exists "pricing_rules_owner_write" on public.pricing_rules;
create policy "pricing_rules_owner_write" on public.pricing_rules
  for all to authenticated
  using (public.owns_machine(machine_id) or public.is_platform_admin())
  with check (public.owns_machine(machine_id) or public.is_platform_admin());

-- availability: public read; machine owner/admin write
drop policy if exists "availability_read" on public.availability;
create policy "availability_read" on public.availability
  for select to authenticated using (true);
drop policy if exists "availability_owner_write" on public.availability;
create policy "availability_owner_write" on public.availability
  for all to authenticated
  using (public.owns_machine(machine_id) or public.is_platform_admin())
  with check (public.owns_machine(machine_id) or public.is_platform_admin());

-- bookings: renter or machine owner or admin
drop policy if exists "bookings_access" on public.bookings;
create policy "bookings_access" on public.bookings
  for all to authenticated
  using (renter_id = auth.uid() or owner_id = auth.uid() or public.is_platform_admin())
  with check (renter_id = auth.uid() or owner_id = auth.uid() or public.is_platform_admin());

-- booking_status: readable by booking parties; inserts via trigger (definer)
drop policy if exists "booking_status_read" on public.booking_status;
create policy "booking_status_read" on public.booking_status
  for select to authenticated
  using (public.owns_booking(booking_id) or public.is_platform_admin());

-- booking_payments: booking parties or admin
drop policy if exists "booking_payments_access" on public.booking_payments;
create policy "booking_payments_access" on public.booking_payments
  for all to authenticated
  using (public.owns_booking(booking_id) or public.is_platform_admin())
  with check (public.owns_booking(booking_id) or public.is_platform_admin());

-- maintenance: machine owner/admin only
drop policy if exists "maintenance_access" on public.maintenance;
create policy "maintenance_access" on public.maintenance
  for all to authenticated
  using (public.owns_machine(machine_id) or public.is_platform_admin())
  with check (public.owns_machine(machine_id) or public.is_platform_admin());

-- machine_reviews: public read published; author writes own
drop policy if exists "machine_reviews_read" on public.machine_reviews;
create policy "machine_reviews_read" on public.machine_reviews
  for select to authenticated
  using (review_status = 'published' or user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "machine_reviews_author_write" on public.machine_reviews;
create policy "machine_reviews_author_write" on public.machine_reviews
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- gps_locations: booking parties or machine owner or admin
drop policy if exists "gps_locations_read" on public.gps_locations;
create policy "gps_locations_read" on public.gps_locations
  for select to authenticated
  using (public.owns_machine(machine_id) or (booking_id is not null and public.owns_booking(booking_id)) or public.is_platform_admin());
drop policy if exists "gps_locations_write" on public.gps_locations;
create policy "gps_locations_write" on public.gps_locations
  for insert to authenticated
  with check (public.owns_machine(machine_id) or (booking_id is not null and public.owns_booking(booking_id)) or public.is_platform_admin());

-- =====================================================================
-- Views (security_invoker so RLS of the querying user applies)
-- =====================================================================
create or replace view public.v_machine_catalog
with (security_invoker = true) as
select
  m.id            as machine_id,
  m.name,
  m.slug,
  m.machine_status,
  m.brand,
  m.model,
  m.fuel,
  m.power_hp,
  m.operator_included,
  m.base_location,
  m.service_radius_km,
  m.latitude,
  m.longitude,
  m.image_url,
  m.rating_avg,
  m.rating_count,
  m.total_bookings,
  m.owner_id,
  c.id            as category_id,
  c.name          as category_name,
  pr.min_price,
  pr.min_unit
from public.machines m
left join public.machinery_categories c on c.id = m.category_id
left join lateral (
  select p.price as min_price, p.unit as min_unit
  from public.pricing_rules p
  where p.machine_id = m.id and p.is_active and p.deleted_at is null
  order by p.price asc
  limit 1
) pr on true
where m.deleted_at is null;
comment on view public.v_machine_catalog is 'Machine catalog with category and lowest active price.';

create or replace view public.v_booking_summary
with (security_invoker = true) as
select
  b.id            as booking_id,
  b.booking_number,
  b.machine_id,
  m.name          as machine_name,
  b.owner_id,
  b.renter_id,
  b.operator_id,
  b.booking_state,
  b.payment_status,
  b.starts_at,
  b.ends_at,
  b.total_amount,
  b.advance_amount,
  b.currency,
  coalesce(pay.paid_total, 0) as paid_total
from public.bookings b
left join public.machines m on m.id = b.machine_id
left join lateral (
  select sum(case when bp.is_refund then -bp.amount else bp.amount end) as paid_total
  from public.booking_payments bp
  where bp.booking_id = b.id and bp.payment_status = 'paid'
) pay on true
where b.deleted_at is null;
comment on view public.v_booking_summary is 'Per-booking rollup with machine name and net paid total.';
