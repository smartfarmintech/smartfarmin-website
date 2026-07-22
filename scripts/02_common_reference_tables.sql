-- =====================================================================
-- AgreeConnect :: 02 :: Common reference tables (RBAC, settings, geo, i18n)
-- Applied via Supabase migration: common_reference_tables
-- =====================================================================

-- ================= ROLES =============================================
create table if not exists public.roles (
  id          uuid primary key default gen_random_uuid(),
  name        citext not null,
  slug        text generated always as (public.slugify(name::text)) stored,
  description text,
  level       smallint not null default 0,
  is_system   boolean not null default false,
  status      public.record_status not null default 'active',
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  created_by  uuid,
  updated_by  uuid,
  constraint roles_name_unique unique (name),
  constraint roles_level_chk check (level between 0 and 100)
);
comment on table public.roles is 'System and custom RBAC roles.';

-- ================= PERMISSIONS =======================================
create table if not exists public.permissions (
  id          uuid primary key default gen_random_uuid(),
  code        text not null,
  name        text not null,
  description text,
  resource    text not null,
  action      public.permission_action not null,
  is_system   boolean not null default false,
  status      public.record_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  created_by  uuid,
  updated_by  uuid,
  constraint permissions_code_unique unique (code),
  constraint permissions_resource_action_unique unique (resource, action)
);
comment on table public.permissions is 'Granular resource/action permissions.';

-- ================= ROLE_PERMISSIONS (junction) =======================
create table if not exists public.role_permissions (
  id            uuid primary key default gen_random_uuid(),
  role_id       uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid,
  updated_by    uuid,
  constraint role_permissions_unique unique (role_id, permission_id)
);
comment on table public.role_permissions is 'Maps permissions to roles (many-to-many).';

-- ================= APP_SETTINGS ======================================
create table if not exists public.app_settings (
  id          uuid primary key default gen_random_uuid(),
  key         citext not null,
  value       jsonb not null default 'null'::jsonb,
  data_type   public.setting_data_type not null default 'string',
  category    text not null default 'general',
  description text,
  is_public   boolean not null default false,
  is_editable boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  created_by  uuid,
  updated_by  uuid,
  constraint app_settings_key_unique unique (key)
);
comment on table public.app_settings is 'Global application configuration (typed key/value).';

-- ================= CURRENCIES ========================================
create table if not exists public.currencies (
  id             uuid primary key default gen_random_uuid(),
  code           char(3) not null,
  name           text not null,
  symbol         text not null,
  decimal_digits smallint not null default 2,
  status         public.record_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  created_by     uuid,
  updated_by     uuid,
  constraint currencies_code_unique unique (code),
  constraint currencies_code_format_chk check (code ~ '^[A-Z]{3}$'),
  constraint currencies_decimals_chk check (decimal_digits between 0 and 6)
);
comment on table public.currencies is 'ISO-4217 currencies.';

-- ================= LANGUAGES =========================================
create table if not exists public.languages (
  id          uuid primary key default gen_random_uuid(),
  code        citext not null,
  name        text not null,
  native_name text,
  direction   public.text_direction not null default 'ltr',
  is_active   boolean not null default true,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  created_by  uuid,
  updated_by  uuid,
  constraint languages_code_unique unique (code),
  constraint languages_code_format_chk check (code ~ '^[a-zA-Z]{2,3}(-[a-zA-Z]{2,4})?$')
);
comment on table public.languages is 'Supported UI/content languages (BCP-47-ish).';

-- ================= COUNTRIES =========================================
create table if not exists public.countries (
  id            uuid primary key default gen_random_uuid(),
  iso2          char(2) not null,
  iso3          char(3) not null,
  name          text not null,
  official_name text,
  phone_code    text,
  currency_code char(3) references public.currencies(code) on update cascade on delete set null,
  flag_emoji    text,
  status        public.record_status not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  created_by    uuid,
  updated_by    uuid,
  constraint countries_iso2_unique unique (iso2),
  constraint countries_iso3_unique unique (iso3),
  constraint countries_iso2_format_chk check (iso2 ~ '^[A-Z]{2}$'),
  constraint countries_iso3_format_chk check (iso3 ~ '^[A-Z]{3}$')
);
comment on table public.countries is 'ISO-3166 countries.';

-- ================= STATES ============================================
create table if not exists public.states (
  id         uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  name       text not null,
  code       text,
  status     public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  constraint states_country_name_unique unique (country_id, name)
);
comment on table public.states is 'States / provinces within a country.';

-- ================= DISTRICTS =========================================
create table if not exists public.districts (
  id         uuid primary key default gen_random_uuid(),
  state_id   uuid not null references public.states(id) on delete cascade,
  name       text not null,
  code       text,
  status     public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  constraint districts_state_name_unique unique (state_id, name)
);
comment on table public.districts is 'Districts within a state.';

-- ================= MANDALS (sub-district) ============================
create table if not exists public.mandals (
  id          uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id) on delete cascade,
  name        text not null,
  code        text,
  status      public.record_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  created_by  uuid,
  updated_by  uuid,
  constraint mandals_district_name_unique unique (district_id, name)
);
comment on table public.mandals is 'Mandals / tehsils / talukas within a district.';

-- ================= VILLAGES ==========================================
create table if not exists public.villages (
  id         uuid primary key default gen_random_uuid(),
  mandal_id  uuid not null references public.mandals(id) on delete cascade,
  name       text not null,
  code       text,
  pincode    text,
  latitude   numeric(9,6),
  longitude  numeric(9,6),
  status     public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid,
  updated_by uuid,
  constraint villages_mandal_name_unique unique (mandal_id, name),
  constraint villages_pincode_chk check (pincode is null or pincode ~ '^[0-9]{4,10}$'),
  constraint villages_lat_chk check (latitude is null or latitude between -90 and 90),
  constraint villages_lng_chk check (longitude is null or longitude between -180 and 180)
);
comment on table public.villages is 'Villages within a mandal (leaf of geo hierarchy).';

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_roles_status          on public.roles(status) where deleted_at is null;
create index if not exists idx_permissions_resource   on public.permissions(resource);
create index if not exists idx_role_permissions_role  on public.role_permissions(role_id);
create index if not exists idx_role_permissions_perm  on public.role_permissions(permission_id);
create index if not exists idx_app_settings_category  on public.app_settings(category);
create index if not exists idx_app_settings_public    on public.app_settings(is_public) where is_public;
create index if not exists idx_countries_currency     on public.countries(currency_code);
create index if not exists idx_states_country         on public.states(country_id);
create index if not exists idx_districts_state        on public.districts(state_id);
create index if not exists idx_mandals_district       on public.mandals(district_id);
create index if not exists idx_villages_mandal        on public.villages(mandal_id);
create index if not exists idx_villages_pincode       on public.villages(pincode);
create index if not exists idx_villages_name_trgm     on public.villages using gin (name gin_trgm_ops);
create index if not exists idx_languages_active       on public.languages(is_active) where is_active;

-- =====================================================================
-- Triggers: updated_at + audit stamping + soft-delete
-- =====================================================================
do $$
declare
  t text;
  audited_tables text[] := array[
    'roles','permissions','role_permissions','app_settings','currencies',
    'languages','countries','states','districts','mandals','villages'
  ];
  softdel_tables text[] := array[
    'roles','permissions','app_settings','currencies',
    'languages','countries','states','districts','mandals','villages'
  ];
begin
  foreach t in array audited_tables loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s;', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on public.%1$s
         for each row execute function public.update_updated_at_column();', t);

    execute format('drop trigger if exists trg_%1$s_audit on public.%1$s;', t);
    execute format(
      'create trigger trg_%1$s_audit before insert or update on public.%1$s
         for each row execute function public.handle_audit_fields();', t);
  end loop;

  foreach t in array softdel_tables loop
    execute format('drop trigger if exists trg_%1$s_soft_delete on public.%1$s;', t);
    execute format(
      'create trigger trg_%1$s_soft_delete before delete on public.%1$s
         for each row execute function public.handle_soft_delete();', t);
  end loop;
end $$;

-- =====================================================================
-- Row Level Security + policies
--   Read: any authenticated user.  Write: platform admins only.
-- =====================================================================
do $$
declare
  t text;
  rls_tables text[] := array[
    'roles','permissions','role_permissions','app_settings','currencies',
    'languages','countries','states','districts','mandals','villages'
  ];
begin
  foreach t in array rls_tables loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%1$s_read_authenticated" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_read_authenticated" on public.%1$s
         for select to authenticated using (true);', t);

    execute format('drop policy if exists "%1$s_admin_write" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_admin_write" on public.%1$s
         for all to authenticated
         using (public.is_platform_admin())
         with check (public.is_platform_admin());', t);
  end loop;
end $$;

-- Public app_settings are readable even by anon (e.g. feature flags on landing).
drop policy if exists "app_settings_public_read" on public.app_settings;
create policy "app_settings_public_read" on public.app_settings
  for select to anon using (is_public = true and deleted_at is null);
