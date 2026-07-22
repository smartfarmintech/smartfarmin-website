-- =====================================================================
-- AgreeConnect :: 04 :: Farmer Module
--   Farmers, lands, soil, crops, health, irrigation, docs.
--   Built on public.user_profiles / auth.users and geo (villages).
-- =====================================================================

-- ---------- enums (idempotent) ---------------------------------------
do $$ begin create type public.farmer_type as enum
  ('owner','tenant','sharecropper','laborer','fpo_member'); exception when duplicate_object then null; end $$;

do $$ begin create type public.education_level as enum
  ('none','primary','secondary','higher_secondary','graduate','postgraduate'); exception when duplicate_object then null; end $$;

do $$ begin create type public.social_category as enum
  ('general','obc','sc','st','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.area_unit as enum
  ('acre','hectare','guntha','cent','bigha','square_meter'); exception when duplicate_object then null; end $$;

do $$ begin create type public.land_ownership_type as enum
  ('owned','leased','shared','government','encroached','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.land_type as enum
  ('irrigated','rainfed','wetland','dryland','plantation','fallow'); exception when duplicate_object then null; end $$;

do $$ begin create type public.soil_type as enum
  ('alluvial','black','red','laterite','sandy','clay','loamy','saline','peaty','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.water_source as enum
  ('borewell','open_well','canal','river','tank','rainwater','pond','municipal','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.crop_season as enum
  ('kharif','rabi','zaid','summer','perennial','whole_year'); exception when duplicate_object then null; end $$;

do $$ begin create type public.crop_cycle_status as enum
  ('planned','sowing','growing','flowering','maturing','harvested','failed','abandoned'); exception when duplicate_object then null; end $$;

do $$ begin create type public.growth_stage as enum
  ('germination','seedling','vegetative','flowering','fruiting','maturity','harvest'); exception when duplicate_object then null; end $$;

do $$ begin create type public.crop_health_status as enum
  ('healthy','mild','moderate','severe','critical'); exception when duplicate_object then null; end $$;

do $$ begin create type public.crop_issue_type as enum
  ('pest','disease','nutrient_deficiency','weed','weather_damage','water_stress','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.irrigation_method as enum
  ('drip','sprinkler','flood','furrow','manual','rainfed','micro_spray'); exception when duplicate_object then null; end $$;

do $$ begin create type public.temperature_unit as enum
  ('celsius','fahrenheit'); exception when duplicate_object then null; end $$;

do $$ begin create type public.farm_document_type as enum
  ('land_record','pahani','patta','ror','bank_passbook','aadhaar','pan','kcc','insurance','subsidy','soil_health_card','lease_agreement','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.document_verification_status as enum
  ('pending','verified','rejected','expired'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- FARMERS  (1:1 with a user)
-- =====================================================================
create table if not exists public.farmers (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  village_id          uuid references public.villages(id) on delete set null,
  farmer_code         text,
  registration_number text,
  farmer_type         public.farmer_type not null default 'owner',
  experience_years    smallint not null default 0,
  is_verified         boolean not null default false,
  verified_at         timestamptz,
  status              public.record_status not null default 'active',
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,
  created_by          uuid,
  updated_by          uuid,
  constraint farmers_user_unique unique (user_id),
  constraint farmers_code_unique unique (farmer_code),
  constraint farmers_regno_unique unique (registration_number),
  constraint farmers_experience_chk check (experience_years between 0 and 120)
);
comment on table public.farmers is 'Farmer master record (1:1 with a platform user).';

-- =====================================================================
-- FARMER_PROFILES  (1:1 with farmers, sensitive/extended details)
-- =====================================================================
create table if not exists public.farmer_profiles (
  id                    uuid primary key default gen_random_uuid(),
  farmer_id             uuid not null references public.farmers(id) on delete cascade,
  aadhaar_hash          text,
  aadhaar_last4         char(4),
  pan_number            text,
  bank_account_last4    char(4),
  bank_name             text,
  ifsc_code             text,
  upi_id                text,
  kisan_credit_card_no  text,
  household_size        smallint,
  annual_income         numeric(14,2),
  education_level       public.education_level,
  social_category       public.social_category,
  is_pmkisan_beneficiary boolean not null default false,
  is_insured            boolean not null default false,
  photo_url             text,
  emergency_contact     text,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz,
  created_by            uuid,
  updated_by            uuid,
  constraint farmer_profiles_farmer_unique unique (farmer_id),
  constraint farmer_profiles_pan_chk check (pan_number is null or pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  constraint farmer_profiles_ifsc_chk check (ifsc_code is null or ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  constraint farmer_profiles_income_chk check (annual_income is null or annual_income >= 0),
  constraint farmer_profiles_household_chk check (household_size is null or household_size between 1 and 100)
);
comment on table public.farmer_profiles is 'Extended, sensitive farmer details (KYC, financial).';

-- =====================================================================
-- LANDS
-- =====================================================================
create table if not exists public.lands (
  id             uuid primary key default gen_random_uuid(),
  farmer_id      uuid not null references public.farmers(id) on delete cascade,
  village_id     uuid references public.villages(id) on delete set null,
  land_name      text,
  survey_number  text,
  khata_number   text,
  area_value     numeric(12,4) not null,
  area_unit      public.area_unit not null default 'acre',
  ownership_type public.land_ownership_type not null default 'owned',
  land_type      public.land_type not null default 'rainfed',
  soil_type      public.soil_type,
  water_source   public.water_source,
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  is_active      boolean not null default true,
  status         public.record_status not null default 'active',
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint lands_area_chk check (area_value > 0),
  constraint lands_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint lands_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.lands is 'Individual land parcels owned/worked by a farmer.';

-- =====================================================================
-- LAND_BOUNDARIES  (ordered vertices of a parcel polygon)
-- =====================================================================
create table if not exists public.land_boundaries (
  id           uuid primary key default gen_random_uuid(),
  land_id      uuid not null references public.lands(id) on delete cascade,
  sequence_no  integer not null,
  latitude     numeric(9,6) not null,
  longitude    numeric(9,6) not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint land_boundaries_seq_unique unique (land_id, sequence_no),
  constraint land_boundaries_seq_chk check (sequence_no >= 0),
  constraint land_boundaries_lat_chk check (latitude between -90 and 90),
  constraint land_boundaries_lng_chk check (longitude between -180 and 180)
);
comment on table public.land_boundaries is 'Ordered GPS vertices defining a land parcel boundary.';

-- =====================================================================
-- SOIL_TESTS
-- =====================================================================
create table if not exists public.soil_tests (
  id             uuid primary key default gen_random_uuid(),
  land_id        uuid not null references public.lands(id) on delete cascade,
  farmer_id      uuid not null references public.farmers(id) on delete cascade,
  test_date      date not null,
  lab_name       text,
  ph_level       numeric(4,2),
  nitrogen       numeric(8,2),
  phosphorus     numeric(8,2),
  potassium      numeric(8,2),
  organic_carbon numeric(6,2),
  ec_value       numeric(6,2),
  micronutrients jsonb not null default '{}'::jsonb,
  recommendations text,
  report_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint soil_tests_ph_chk check (ph_level is null or ph_level between 0 and 14),
  constraint soil_tests_date_chk check (test_date <= current_date)
);
comment on table public.soil_tests is 'Soil analysis reports for a land parcel.';

-- =====================================================================
-- CROP_HISTORY  (completed / historical crops)
-- =====================================================================
create table if not exists public.crop_history (
  id              uuid primary key default gen_random_uuid(),
  land_id         uuid not null references public.lands(id) on delete cascade,
  farmer_id       uuid not null references public.farmers(id) on delete cascade,
  crop_name       text not null,
  variety         text,
  season          public.crop_season not null,
  crop_year       smallint not null,
  area_sown       numeric(12,4),
  area_unit       public.area_unit not null default 'acre',
  yield_quantity  numeric(12,3),
  yield_unit      text,
  revenue         numeric(14,2),
  input_cost      numeric(14,2),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,
  created_by      uuid,
  updated_by      uuid,
  constraint crop_history_year_chk check (crop_year between 1900 and extract(year from current_date)::int + 1),
  constraint crop_history_area_chk check (area_sown is null or area_sown > 0)
);
comment on table public.crop_history is 'Historical crop records per land parcel.';

-- =====================================================================
-- CROP_CYCLES  (current / active crop lifecycle)
-- =====================================================================
create table if not exists public.crop_cycles (
  id                   uuid primary key default gen_random_uuid(),
  land_id              uuid not null references public.lands(id) on delete cascade,
  farmer_id            uuid not null references public.farmers(id) on delete cascade,
  crop_name            text not null,
  variety              text,
  season               public.crop_season not null,
  status               public.crop_cycle_status not null default 'planned',
  sowing_date          date,
  expected_harvest_date date,
  actual_harvest_date  date,
  area_value           numeric(12,4),
  area_unit            public.area_unit not null default 'acre',
  expected_yield       numeric(12,3),
  actual_yield         numeric(12,3),
  yield_unit           text,
  seed_source          text,
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  created_by           uuid,
  updated_by           uuid,
  constraint crop_cycles_area_chk check (area_value is null or area_value > 0),
  constraint crop_cycles_harvest_chk check (
    expected_harvest_date is null or sowing_date is null or expected_harvest_date >= sowing_date),
  constraint crop_cycles_actual_harvest_chk check (
    actual_harvest_date is null or sowing_date is null or actual_harvest_date >= sowing_date)
);
comment on table public.crop_cycles is 'Active crop lifecycle from sowing to harvest.';

-- =====================================================================
-- CROP_IMAGES
-- =====================================================================
create table if not exists public.crop_images (
  id            uuid primary key default gen_random_uuid(),
  crop_cycle_id uuid not null references public.crop_cycles(id) on delete cascade,
  farmer_id     uuid not null references public.farmers(id) on delete cascade,
  image_url     text not null,
  caption       text,
  growth_stage  public.growth_stage,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  captured_at   timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint crop_images_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint crop_images_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.crop_images is 'Field photos tied to a crop cycle and growth stage.';

-- =====================================================================
-- CROP_HEALTH
-- =====================================================================
create table if not exists public.crop_health (
  id                uuid primary key default gen_random_uuid(),
  crop_cycle_id     uuid not null references public.crop_cycles(id) on delete cascade,
  farmer_id         uuid not null references public.farmers(id) on delete cascade,
  observed_at       timestamptz not null default now(),
  health_status     public.crop_health_status not null default 'healthy',
  issue_type        public.crop_issue_type,
  issue_name        text,
  severity          smallint,
  affected_area_pct numeric(5,2),
  diagnosis         text,
  treatment         text,
  image_url         text,
  is_resolved       boolean not null default false,
  resolved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  created_by        uuid,
  updated_by        uuid,
  constraint crop_health_severity_chk check (severity is null or severity between 1 and 5),
  constraint crop_health_area_chk check (affected_area_pct is null or affected_area_pct between 0 and 100)
);
comment on table public.crop_health is 'Pest/disease/health observations per crop cycle.';

-- =====================================================================
-- IRRIGATION
-- =====================================================================
create table if not exists public.irrigation (
  id                 uuid primary key default gen_random_uuid(),
  land_id            uuid not null references public.lands(id) on delete cascade,
  crop_cycle_id      uuid references public.crop_cycles(id) on delete set null,
  farmer_id          uuid not null references public.farmers(id) on delete cascade,
  irrigation_date    date not null,
  method             public.irrigation_method not null default 'flood',
  source             public.water_source,
  duration_minutes   integer,
  water_volume_liters numeric(14,2),
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint irrigation_duration_chk check (duration_minutes is null or duration_minutes >= 0),
  constraint irrigation_volume_chk check (water_volume_liters is null or water_volume_liters >= 0),
  constraint irrigation_date_chk check (irrigation_date <= current_date)
);
comment on table public.irrigation is 'Irrigation events per land / crop cycle.';

-- =====================================================================
-- WEATHER_PREFERENCES  (1:1 with farmers)
-- =====================================================================
create table if not exists public.weather_preferences (
  id                uuid primary key default gen_random_uuid(),
  farmer_id         uuid not null references public.farmers(id) on delete cascade,
  alerts_enabled    boolean not null default true,
  rainfall_alerts   boolean not null default true,
  temperature_alerts boolean not null default true,
  wind_alerts       boolean not null default false,
  temperature_unit  public.temperature_unit not null default 'celsius',
  preferred_time    time,
  alert_channels    jsonb not null default '["push"]'::jsonb,
  latitude          numeric(9,6),
  longitude         numeric(9,6),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint weather_prefs_farmer_unique unique (farmer_id),
  constraint weather_prefs_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint weather_prefs_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.weather_preferences is 'Per-farmer weather alert preferences.';

-- =====================================================================
-- FARM_DOCUMENTS
-- =====================================================================
create table if not exists public.farm_documents (
  id                  uuid primary key default gen_random_uuid(),
  farmer_id           uuid not null references public.farmers(id) on delete cascade,
  land_id             uuid references public.lands(id) on delete set null,
  document_type       public.farm_document_type not null,
  title               text not null,
  file_url            text not null,
  file_size_bytes     bigint,
  mime_type           text,
  issued_by           text,
  issue_date          date,
  expiry_date         date,
  verification_status public.document_verification_status not null default 'pending',
  verified_by         uuid,
  verified_at         timestamptz,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,
  created_by          uuid,
  updated_by          uuid,
  constraint farm_documents_size_chk check (file_size_bytes is null or file_size_bytes >= 0),
  constraint farm_documents_expiry_chk check (expiry_date is null or issue_date is null or expiry_date >= issue_date)
);
comment on table public.farm_documents is 'Uploaded farmer/land documents with verification state.';

-- =====================================================================
-- Ownership helper functions (security definer to avoid RLS recursion)
-- =====================================================================
create or replace function public.owns_farmer(p_farmer_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.farmers f
    where f.id = p_farmer_id and f.user_id = auth.uid()
  );
$$;

create or replace function public.owns_land(p_land_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.lands l
    join public.farmers f on f.id = l.farmer_id
    where l.id = p_land_id and f.user_id = auth.uid()
  );
$$;

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_farmers_user            on public.farmers(user_id);
create index if not exists idx_farmers_village          on public.farmers(village_id);
create index if not exists idx_farmers_status           on public.farmers(status) where deleted_at is null;
create index if not exists idx_farmer_profiles_farmer   on public.farmer_profiles(farmer_id);
create index if not exists idx_lands_farmer             on public.lands(farmer_id);
create index if not exists idx_lands_village            on public.lands(village_id);
create index if not exists idx_lands_active             on public.lands(farmer_id) where is_active and deleted_at is null;
create index if not exists idx_land_boundaries_land     on public.land_boundaries(land_id);
create index if not exists idx_soil_tests_land          on public.soil_tests(land_id);
create index if not exists idx_soil_tests_farmer        on public.soil_tests(farmer_id);
create index if not exists idx_soil_tests_date          on public.soil_tests(test_date desc);
create index if not exists idx_crop_history_land        on public.crop_history(land_id);
create index if not exists idx_crop_history_farmer      on public.crop_history(farmer_id);
create index if not exists idx_crop_history_year        on public.crop_history(crop_year desc);
create index if not exists idx_crop_cycles_land         on public.crop_cycles(land_id);
create index if not exists idx_crop_cycles_farmer       on public.crop_cycles(farmer_id);
create index if not exists idx_crop_cycles_status       on public.crop_cycles(status) where deleted_at is null;
create index if not exists idx_crop_images_cycle        on public.crop_images(crop_cycle_id);
create index if not exists idx_crop_images_farmer       on public.crop_images(farmer_id);
create index if not exists idx_crop_health_cycle        on public.crop_health(crop_cycle_id);
create index if not exists idx_crop_health_farmer       on public.crop_health(farmer_id);
create index if not exists idx_crop_health_unresolved   on public.crop_health(crop_cycle_id) where not is_resolved;
create index if not exists idx_irrigation_land          on public.irrigation(land_id);
create index if not exists idx_irrigation_cycle         on public.irrigation(crop_cycle_id);
create index if not exists idx_irrigation_farmer        on public.irrigation(farmer_id);
create index if not exists idx_irrigation_date          on public.irrigation(irrigation_date desc);
create index if not exists idx_weather_prefs_farmer     on public.weather_preferences(farmer_id);
create index if not exists idx_farm_documents_farmer    on public.farm_documents(farmer_id);
create index if not exists idx_farm_documents_land      on public.farm_documents(land_id);
create index if not exists idx_farm_documents_type      on public.farm_documents(document_type);
create index if not exists idx_farm_documents_status    on public.farm_documents(verification_status);

-- =====================================================================
-- Triggers: updated_at + audit + soft-delete
-- =====================================================================
do $$
declare
  t text;
  updated_at_tables text[] := array[
    'farmers','farmer_profiles','lands','land_boundaries','soil_tests',
    'crop_history','crop_cycles','crop_images','crop_health','irrigation',
    'weather_preferences','farm_documents'
  ];
  audit_tables text[] := array[
    'farmers','farmer_profiles','lands','soil_tests','crop_history',
    'crop_cycles','crop_health','irrigation','farm_documents'
  ];
  softdel_tables text[] := array[
    'farmers','farmer_profiles','lands','soil_tests','crop_history',
    'crop_cycles','crop_health','irrigation','farm_documents'
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
    'farmers','farmer_profiles','lands','land_boundaries','soil_tests',
    'crop_history','crop_cycles','crop_images','crop_health','irrigation',
    'weather_preferences','farm_documents'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- farmers: owner via user_id
drop policy if exists "farmers_own_all" on public.farmers;
create policy "farmers_own_all" on public.farmers
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- tables keyed by farmer_id -> owns_farmer()
do $$
declare t text;
begin
  foreach t in array array[
    'farmer_profiles','lands','soil_tests','crop_history','crop_cycles',
    'crop_images','crop_health','irrigation','weather_preferences','farm_documents'
  ] loop
    execute format('drop policy if exists "%1$s_own_all" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_own_all" on public.%1$s
         for all to authenticated
         using (public.owns_farmer(farmer_id) or public.is_platform_admin())
         with check (public.owns_farmer(farmer_id) or public.is_platform_admin());', t);
  end loop;
end $$;

-- land_boundaries: keyed by land_id -> owns_land()
drop policy if exists "land_boundaries_own_all" on public.land_boundaries;
create policy "land_boundaries_own_all" on public.land_boundaries
  for all to authenticated
  using (public.owns_land(land_id) or public.is_platform_admin())
  with check (public.owns_land(land_id) or public.is_platform_admin());

-- =====================================================================
-- Views (security_invoker so RLS of the querying user applies)
-- =====================================================================
create or replace view public.v_farmer_land_summary
with (security_invoker = true) as
select
  f.id                              as farmer_id,
  f.user_id,
  count(distinct l.id)              as total_lands,
  coalesce(sum(l.area_value) filter (where l.area_unit = 'acre'), 0) as total_area_acre,
  count(distinct l.village_id)      as villages_count
from public.farmers f
left join public.lands l
  on l.farmer_id = f.id and l.deleted_at is null and l.is_active
where f.deleted_at is null
group by f.id, f.user_id;
comment on view public.v_farmer_land_summary is 'Per-farmer land counts and total acreage.';

create or replace view public.v_active_crop_cycles
with (security_invoker = true) as
select
  cc.id            as crop_cycle_id,
  cc.farmer_id,
  cc.land_id,
  l.land_name,
  cc.crop_name,
  cc.variety,
  cc.season,
  cc.status,
  cc.sowing_date,
  cc.expected_harvest_date,
  cc.area_value,
  cc.area_unit,
  (select ch.health_status
     from public.crop_health ch
     where ch.crop_cycle_id = cc.id and ch.deleted_at is null
     order by ch.observed_at desc limit 1) as latest_health_status
from public.crop_cycles cc
join public.lands l on l.id = cc.land_id
where cc.deleted_at is null
  and cc.status not in ('harvested','failed','abandoned');
comment on view public.v_active_crop_cycles is 'Currently active crop cycles with latest health status.';

create or replace view public.v_farmer_overview
with (security_invoker = true) as
select
  f.id                       as farmer_id,
  f.user_id,
  f.farmer_code,
  f.farmer_type,
  f.status,
  up.full_name,
  up.phone,
  fp.social_category,
  fp.is_pmkisan_beneficiary,
  ls.total_lands,
  ls.total_area_acre,
  (select count(*) from public.crop_cycles cc
     where cc.farmer_id = f.id and cc.deleted_at is null
       and cc.status not in ('harvested','failed','abandoned')) as active_crop_cycles,
  (select count(*) from public.farm_documents fd
     where fd.farmer_id = f.id and fd.deleted_at is null) as documents_count
from public.farmers f
left join public.user_profiles up on up.id = f.user_id
left join public.farmer_profiles fp on fp.farmer_id = f.id and fp.deleted_at is null
left join public.v_farmer_land_summary ls on ls.farmer_id = f.id
where f.deleted_at is null;
comment on view public.v_farmer_overview is 'Consolidated farmer overview (profile + lands + crop + docs).';
