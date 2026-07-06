-- =====================================================================
-- Rythu360 :: 03 :: Authentication schema
--   Built on Supabase auth.users. Adds profile, devices, sessions,
--   tokens, MFA factors, and login history.
-- Applied via Supabase migration: authentication_schema
-- =====================================================================

-- ---------- auth-specific enums --------------------------------------
do $$ begin
  create type public.gender_type as enum ('male','female','other','prefer_not_to_say');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.token_type as enum
    ('email_verification','password_reset','phone_otp','magic_link','invite');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.mfa_factor_type as enum ('totp','sms','email','recovery_code');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.device_platform as enum ('web','ios','android','desktop','unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.login_status as enum ('success','failed','locked','challenge');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- USER_PROFILES  (1:1 with auth.users)
-- =====================================================================
create table if not exists public.user_profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  role_id           uuid references public.roles(id) on delete set null,
  village_id        uuid references public.villages(id) on delete set null,
  email             citext,
  phone             text,
  username          citext,
  full_name         text,
  display_name      text,
  first_name        text,
  last_name         text,
  avatar_url        text,
  bio               text,
  gender            public.gender_type,
  date_of_birth     date,
  preferred_language citext references public.languages(code) on update cascade on delete set null,
  timezone          text not null default 'Asia/Kolkata',
  address_line1     text,
  address_line2     text,
  pincode           text,
  latitude          numeric(9,6),
  longitude         numeric(9,6),
  status            public.record_status not null default 'active',
  is_verified       boolean not null default false,
  email_verified_at timestamptz,
  phone_verified_at timestamptz,
  onboarded_at      timestamptz,
  last_active_at    timestamptz,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  created_by        uuid,
  updated_by        uuid,
  constraint user_profiles_username_unique unique (username),
  constraint user_profiles_phone_chk check (phone is null or phone ~ '^\+?[0-9\s\-]{7,20}$'),
  constraint user_profiles_pincode_chk check (pincode is null or pincode ~ '^[0-9]{4,10}$'),
  constraint user_profiles_dob_chk check (date_of_birth is null or date_of_birth <= current_date)
);
comment on table public.user_profiles is 'Application profile extending auth.users.';

-- =====================================================================
-- USER_DEVICES
-- =====================================================================
create table if not exists public.user_devices (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  device_token   text,
  platform       public.device_platform not null default 'unknown',
  device_name    text,
  device_model   text,
  os_version     text,
  app_version    text,
  push_enabled   boolean not null default true,
  is_trusted     boolean not null default false,
  last_used_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint user_devices_token_unique unique (user_id, device_token)
);
comment on table public.user_devices is 'Registered devices per user (push + trust).';

-- =====================================================================
-- USER_SESSIONS  (app-level session tracking / audit)
-- =====================================================================
create table if not exists public.user_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  device_id      uuid references public.user_devices(id) on delete set null,
  session_token  text,
  ip_address     inet,
  user_agent     text,
  location       jsonb,
  is_active      boolean not null default true,
  expires_at     timestamptz,
  revoked_at     timestamptz,
  last_seen_at   timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint user_sessions_token_unique unique (session_token)
);
comment on table public.user_sessions is 'App-level session records for audit/revocation.';

-- =====================================================================
-- AUTH_TOKENS  (verification / reset / invite / otp)
--   Store only hashes, never raw tokens.
-- =====================================================================
create table if not exists public.auth_tokens (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  token_type   public.token_type not null,
  token_hash   text not null,
  identifier   citext,
  expires_at   timestamptz not null,
  consumed_at  timestamptz,
  attempts     smallint not null default 0,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  constraint auth_tokens_hash_unique unique (token_hash),
  constraint auth_tokens_attempts_chk check (attempts >= 0)
);
comment on table public.auth_tokens is 'Hashed one-time tokens (email verify, reset, OTP, invite).';

-- =====================================================================
-- USER_MFA_FACTORS
-- =====================================================================
create table if not exists public.user_mfa_factors (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  factor_type  public.mfa_factor_type not null,
  friendly_name text,
  secret       text,               -- encrypted TOTP secret / hashed recovery code
  phone        text,
  is_verified  boolean not null default false,
  verified_at  timestamptz,
  last_used_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint user_mfa_phone_chk check (phone is null or phone ~ '^\+?[0-9\s\-]{7,20}$')
);
comment on table public.user_mfa_factors is 'Per-user multi-factor authentication factors.';

-- =====================================================================
-- LOGIN_HISTORY  (append-only audit)
-- =====================================================================
create table if not exists public.login_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  email        citext,
  status       public.login_status not null,
  ip_address   inet,
  user_agent   text,
  device_id    uuid references public.user_devices(id) on delete set null,
  location     jsonb,
  failure_reason text,
  created_at   timestamptz not null default now()
);
comment on table public.login_history is 'Append-only login attempt audit trail.';

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_user_profiles_role      on public.user_profiles(role_id);
create index if not exists idx_user_profiles_village    on public.user_profiles(village_id);
create index if not exists idx_user_profiles_status     on public.user_profiles(status) where deleted_at is null;
create index if not exists idx_user_profiles_phone      on public.user_profiles(phone);
create index if not exists idx_user_profiles_email      on public.user_profiles(email);
create index if not exists idx_user_profiles_name_trgm  on public.user_profiles using gin (coalesce(full_name,'') gin_trgm_ops);
create index if not exists idx_user_devices_user        on public.user_devices(user_id);
create index if not exists idx_user_sessions_user       on public.user_sessions(user_id);
create index if not exists idx_user_sessions_active     on public.user_sessions(user_id) where is_active;
create index if not exists idx_auth_tokens_user         on public.auth_tokens(user_id);
create index if not exists idx_auth_tokens_lookup       on public.auth_tokens(token_type, identifier);
create index if not exists idx_auth_tokens_expiry       on public.auth_tokens(expires_at) where consumed_at is null;
create index if not exists idx_mfa_user                 on public.user_mfa_factors(user_id);
create index if not exists idx_login_history_user       on public.login_history(user_id);
create index if not exists idx_login_history_created    on public.login_history(created_at desc);

-- =====================================================================
-- Triggers: updated_at + audit + soft-delete
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['user_profiles','user_devices','user_sessions','user_mfa_factors'] loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s;', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$s
      for each row execute function public.update_updated_at_column();', t);
  end loop;

  execute 'drop trigger if exists trg_user_profiles_audit on public.user_profiles;';
  execute 'create trigger trg_user_profiles_audit before insert or update on public.user_profiles
    for each row execute function public.handle_audit_fields();';

  execute 'drop trigger if exists trg_user_profiles_soft_delete on public.user_profiles;';
  execute 'create trigger trg_user_profiles_soft_delete before delete on public.user_profiles
    for each row execute function public.handle_soft_delete();';
end $$;

-- =====================================================================
-- Auto-create profile on signup (security definer bypasses RLS)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role_id uuid;
begin
  select id into default_role_id
  from public.roles
  where slug = 'farmer' and deleted_at is null
  limit 1;

  insert into public.user_profiles (
    id, email, phone, full_name, display_name, role_id,
    email_verified_at
  )
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    coalesce((new.raw_user_meta_data ->> 'role_id')::uuid, default_role_id),
    new.email_confirmed_at
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.user_profiles     enable row level security;
alter table public.user_devices      enable row level security;
alter table public.user_sessions     enable row level security;
alter table public.auth_tokens       enable row level security;
alter table public.user_mfa_factors  enable row level security;
alter table public.login_history     enable row level security;

-- ----- user_profiles: self read/update, admin all
drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own" on public.user_profiles
  for select to authenticated using (auth.uid() = id or public.is_platform_admin());

drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own" on public.user_profiles
  for insert to authenticated with check (auth.uid() = id or public.is_platform_admin());

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own" on public.user_profiles
  for update to authenticated
  using (auth.uid() = id or public.is_platform_admin())
  with check (auth.uid() = id or public.is_platform_admin());

drop policy if exists "user_profiles_admin_delete" on public.user_profiles;
create policy "user_profiles_admin_delete" on public.user_profiles
  for delete to authenticated using (public.is_platform_admin());

-- ----- generic owner-scoped tables
do $$
declare t text;
begin
  foreach t in array array['user_devices','user_sessions','user_mfa_factors'] loop
    execute format('drop policy if exists "%1$s_own_all" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_own_all" on public.%1$s
         for all to authenticated
         using (auth.uid() = user_id or public.is_platform_admin())
         with check (auth.uid() = user_id or public.is_platform_admin());', t);
  end loop;
end $$;

-- ----- login_history: user may read own; admins read all; inserts are server-side
drop policy if exists "login_history_select_own" on public.login_history;
create policy "login_history_select_own" on public.login_history
  for select to authenticated using (auth.uid() = user_id or public.is_platform_admin());

-- ----- auth_tokens: no client access (server/security-definer only). Admin read for support.
drop policy if exists "auth_tokens_admin_select" on public.auth_tokens;
create policy "auth_tokens_admin_select" on public.auth_tokens
  for select to authenticated using (public.is_platform_admin());
