-- =====================================================================
-- Rythu360 :: 08 :: Wallet & Payments Module
--   Wallets, ledger transactions, add-money/withdraw requests,
--   subscriptions, gateway logs, cashback, reward points,
--   settlements, commission, invoices, GST records.
--   Built on auth.users / record_status / is_platform_admin()
--   and shared trigger functions.
-- =====================================================================

-- ---------- enums (idempotent) ---------------------------------------
do $$ begin create type public.wallet_status as enum
  ('active','frozen','suspended','closed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.wallet_txn_type as enum
  ('credit','debit'); exception when duplicate_object then null; end $$;

do $$ begin create type public.wallet_txn_category as enum
  ('topup','withdrawal','purchase','refund','cashback','reward','commission','settlement','adjustment','transfer','fee'); exception when duplicate_object then null; end $$;

do $$ begin create type public.wallet_txn_status as enum
  ('pending','completed','failed','reversed','cancelled'); exception when duplicate_object then null; end $$;

do $$ begin create type public.payment_request_status as enum
  ('created','pending','processing','succeeded','failed','expired','cancelled'); exception when duplicate_object then null; end $$;

do $$ begin create type public.payment_channel as enum
  ('upi','card','netbanking','wallet','bank_transfer','cash','other'); exception when duplicate_object then null; end $$;

do $$ begin create type public.withdraw_status as enum
  ('requested','approved','processing','paid','rejected','cancelled','failed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.subscription_status as enum
  ('trialing','active','past_due','paused','cancelled','expired'); exception when duplicate_object then null; end $$;

do $$ begin create type public.billing_interval as enum
  ('day','week','month','quarter','year','lifetime'); exception when duplicate_object then null; end $$;

do $$ begin create type public.cashback_status as enum
  ('pending','credited','expired','reversed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.reward_txn_type as enum
  ('earn','redeem','expire','adjust'); exception when duplicate_object then null; end $$;

do $$ begin create type public.settlement_status as enum
  ('pending','processing','settled','failed','on_hold'); exception when duplicate_object then null; end $$;

do $$ begin create type public.commission_status as enum
  ('pending','invoiced','collected','waived','reversed'); exception when duplicate_object then null; end $$;

do $$ begin create type public.invoice_status as enum
  ('draft','issued','paid','partially_paid','overdue','cancelled','refunded'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- WALLETS  (one active wallet per user per currency)
-- =====================================================================
create table if not exists public.wallets (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  wallet_status      public.wallet_status not null default 'active',
  currency           char(3) not null default 'INR',
  balance            numeric(16,2) not null default 0,
  reserved_balance   numeric(16,2) not null default 0,
  total_credited     numeric(18,2) not null default 0,
  total_debited      numeric(18,2) not null default 0,
  last_txn_at        timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint wallets_user_currency_unique unique (user_id, currency),
  constraint wallets_balance_chk check (balance >= 0),
  constraint wallets_reserved_chk check (reserved_balance >= 0 and reserved_balance <= balance)
);
comment on table public.wallets is 'Per-user wallet with running balance (maintained by ledger trigger).';

-- =====================================================================
-- WALLET_TRANSACTIONS  (immutable ledger)
-- =====================================================================
create table if not exists public.wallet_transactions (
  id                 uuid primary key default gen_random_uuid(),
  wallet_id          uuid not null references public.wallets(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  txn_type           public.wallet_txn_type not null,
  category           public.wallet_txn_category not null default 'adjustment',
  txn_status         public.wallet_txn_status not null default 'completed',
  amount             numeric(16,2) not null,
  balance_after      numeric(16,2),
  currency           char(3) not null default 'INR',
  reference_type     text,
  reference_id       uuid,
  description        text,
  idempotency_key    text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid,
  updated_by         uuid,
  constraint wallet_transactions_idem_unique unique (idempotency_key),
  constraint wallet_transactions_amount_chk check (amount > 0)
);
comment on table public.wallet_transactions is 'Immutable wallet ledger; drives wallet balance via trigger.';

-- =====================================================================
-- PAYMENT_REQUESTS  (add-money / inbound payment intents)
-- =====================================================================
create table if not exists public.payment_requests (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  wallet_id          uuid references public.wallets(id) on delete set null,
  request_status     public.payment_request_status not null default 'created',
  channel            public.payment_channel not null default 'upi',
  amount             numeric(16,2) not null,
  currency           char(3) not null default 'INR',
  purpose            text,
  reference_type     text,
  reference_id       uuid,
  gateway            text,
  gateway_order_id   text,
  gateway_payment_id text,
  idempotency_key    text,
  expires_at         timestamptz,
  completed_at       timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid,
  updated_by         uuid,
  constraint payment_requests_idem_unique unique (idempotency_key),
  constraint payment_requests_order_unique unique (gateway_order_id),
  constraint payment_requests_amount_chk check (amount > 0)
);
comment on table public.payment_requests is 'Inbound payment / add-money intents against a wallet.';

-- =====================================================================
-- WITHDRAW_REQUESTS  (payouts out of wallet)
-- =====================================================================
create table if not exists public.withdraw_requests (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  wallet_id          uuid not null references public.wallets(id) on delete cascade,
  withdraw_status    public.withdraw_status not null default 'requested',
  amount             numeric(16,2) not null,
  currency           char(3) not null default 'INR',
  bank_account_name  text,
  bank_account_no    text,
  bank_ifsc          text,
  upi_id             text,
  payout_ref         text,
  rejection_reason   text,
  processed_by       uuid references auth.users(id) on delete set null,
  processed_at       timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint withdraw_requests_amount_chk check (amount > 0)
);
comment on table public.withdraw_requests is 'User payout/withdrawal requests from a wallet.';

-- =====================================================================
-- SUBSCRIPTION_PLANS  (catalog; public read)
-- =====================================================================
create table if not exists public.subscription_plans (
  id                 uuid primary key default gen_random_uuid(),
  code               text not null,
  name               text not null,
  description        text,
  price              numeric(12,2) not null default 0,
  currency           char(3) not null default 'INR',
  bill_interval      public.billing_interval not null default 'month',
  interval_count     integer not null default 1,
  trial_days         integer not null default 0,
  features           jsonb not null default '[]'::jsonb,
  is_active          boolean not null default true,
  display_order      integer not null default 0,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint subscription_plans_code_unique unique (code),
  constraint subscription_plans_price_chk check (price >= 0),
  constraint subscription_plans_interval_chk check (interval_count > 0),
  constraint subscription_plans_trial_chk check (trial_days >= 0)
);
comment on table public.subscription_plans is 'Subscription plan catalog.';

-- =====================================================================
-- SUBSCRIPTIONS
-- =====================================================================
create table if not exists public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  plan_id              uuid not null references public.subscription_plans(id) on delete restrict,
  sub_status           public.subscription_status not null default 'active',
  current_period_start timestamptz not null default now(),
  current_period_end   timestamptz,
  trial_end            timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at         timestamptz,
  amount               numeric(12,2) not null default 0,
  currency             char(3) not null default 'INR',
  auto_renew           boolean not null default true,
  external_ref         text,
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  created_by           uuid,
  updated_by           uuid,
  constraint subscriptions_amount_chk check (amount >= 0),
  constraint subscriptions_period_chk check (current_period_end is null or current_period_end >= current_period_start)
);
comment on table public.subscriptions is 'User subscriptions to plans.';

-- =====================================================================
-- PAYMENT_GATEWAY_LOGS  (raw gateway callbacks/webhooks; admin only)
-- =====================================================================
create table if not exists public.payment_gateway_logs (
  id                 uuid primary key default gen_random_uuid(),
  gateway            text not null,
  event_type         text,
  reference_type     text,
  reference_id       uuid,
  gateway_order_id   text,
  gateway_payment_id text,
  http_status        integer,
  direction          text not null default 'inbound',
  request_payload    jsonb,
  response_payload   jsonb,
  signature          text,
  is_verified        boolean not null default false,
  created_at         timestamptz not null default now()
);
comment on table public.payment_gateway_logs is 'Raw payment-gateway request/response logs (admin only).';

-- =====================================================================
-- CASHBACK
-- =====================================================================
create table if not exists public.cashback (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  wallet_id          uuid references public.wallets(id) on delete set null,
  cashback_status    public.cashback_status not null default 'pending',
  amount             numeric(14,2) not null,
  currency           char(3) not null default 'INR',
  reason             text,
  campaign_code      text,
  reference_type     text,
  reference_id       uuid,
  credited_txn_id    uuid references public.wallet_transactions(id) on delete set null,
  expires_at         timestamptz,
  credited_at        timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid,
  updated_by         uuid,
  constraint cashback_amount_chk check (amount > 0)
);
comment on table public.cashback is 'Cashback awards to users, optionally credited to wallet.';

-- =====================================================================
-- REWARD_POINTS  (points ledger)
-- =====================================================================
create table if not exists public.reward_points (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  reward_type        public.reward_txn_type not null default 'earn',
  points             integer not null,
  balance_after      integer,
  reason             text,
  reference_type     text,
  reference_id       uuid,
  expires_at         timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  created_by         uuid,
  constraint reward_points_points_chk check (points <> 0)
);
comment on table public.reward_points is 'Reward-points ledger (earn/redeem/expire/adjust).';

-- =====================================================================
-- SETTLEMENTS  (payouts to sellers/owners; admin managed)
-- =====================================================================
create table if not exists public.settlements (
  id                 uuid primary key default gen_random_uuid(),
  payee_id           uuid not null references auth.users(id) on delete restrict,
  settlement_status  public.settlement_status not null default 'pending',
  gross_amount       numeric(16,2) not null default 0,
  commission_amount  numeric(16,2) not null default 0,
  tax_amount         numeric(16,2) not null default 0,
  net_amount         numeric(16,2) not null default 0,
  currency           char(3) not null default 'INR',
  period_start       date,
  period_end         date,
  payout_ref         text,
  settled_at         timestamptz,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint settlements_amounts_chk check (gross_amount >= 0 and commission_amount >= 0 and tax_amount >= 0 and net_amount >= 0),
  constraint settlements_period_chk check (period_end is null or period_start is null or period_end >= period_start)
);
comment on table public.settlements is 'Seller/owner settlement payouts.';

-- =====================================================================
-- COMMISSION  (platform commission per transaction)
-- =====================================================================
create table if not exists public.commission (
  id                 uuid primary key default gen_random_uuid(),
  payer_id           uuid references auth.users(id) on delete set null,
  settlement_id      uuid references public.settlements(id) on delete set null,
  commission_status  public.commission_status not null default 'pending',
  reference_type     text,
  reference_id       uuid,
  base_amount        numeric(16,2) not null default 0,
  rate_percent       numeric(6,3),
  commission_amount  numeric(16,2) not null default 0,
  tax_amount         numeric(16,2) not null default 0,
  currency           char(3) not null default 'INR',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint commission_amounts_chk check (base_amount >= 0 and commission_amount >= 0 and tax_amount >= 0),
  constraint commission_rate_chk check (rate_percent is null or (rate_percent >= 0 and rate_percent <= 100))
);
comment on table public.commission is 'Platform commission charged on transactions.';

-- =====================================================================
-- INVOICE
-- =====================================================================
create table if not exists public.invoice (
  id                 uuid primary key default gen_random_uuid(),
  invoice_number     text not null,
  user_id            uuid references auth.users(id) on delete set null,
  invoice_status     public.invoice_status not null default 'draft',
  reference_type     text,
  reference_id       uuid,
  issue_date         date not null default current_date,
  due_date           date,
  subtotal           numeric(16,2) not null default 0,
  discount_amount    numeric(16,2) not null default 0,
  tax_amount         numeric(16,2) not null default 0,
  total_amount       numeric(16,2) not null default 0,
  amount_paid        numeric(16,2) not null default 0,
  currency           char(3) not null default 'INR',
  billing_name       text,
  billing_address    jsonb,
  gstin              text,
  line_items         jsonb not null default '[]'::jsonb,
  notes              text,
  pdf_url            text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint invoice_number_unique unique (invoice_number),
  constraint invoice_amounts_chk check (subtotal >= 0 and discount_amount >= 0 and tax_amount >= 0 and total_amount >= 0 and amount_paid >= 0),
  constraint invoice_due_chk check (due_date is null or due_date >= issue_date)
);
comment on table public.invoice is 'Tax invoices issued to users.';

-- =====================================================================
-- GST_RECORDS  (per-invoice GST breakup for compliance)
-- =====================================================================
create table if not exists public.gst_records (
  id                 uuid primary key default gen_random_uuid(),
  invoice_id         uuid references public.invoice(id) on delete cascade,
  user_id            uuid references auth.users(id) on delete set null,
  gstin              text,
  place_of_supply    text,
  hsn_sac_code       text,
  taxable_amount     numeric(16,2) not null default 0,
  cgst_rate          numeric(6,3) not null default 0,
  sgst_rate          numeric(6,3) not null default 0,
  igst_rate          numeric(6,3) not null default 0,
  cess_rate          numeric(6,3) not null default 0,
  cgst_amount        numeric(16,2) not null default 0,
  sgst_amount        numeric(16,2) not null default 0,
  igst_amount        numeric(16,2) not null default 0,
  cess_amount        numeric(16,2) not null default 0,
  total_tax          numeric(16,2) not null default 0,
  is_reverse_charge  boolean not null default false,
  filing_period      text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  created_by         uuid,
  updated_by         uuid,
  constraint gst_records_amounts_chk check (taxable_amount >= 0 and total_tax >= 0)
);
comment on table public.gst_records is 'Per-invoice GST breakup for tax compliance.';

-- =====================================================================
-- Ownership helper (security definer to avoid RLS recursion)
-- =====================================================================
create or replace function public.owns_wallet(p_wallet_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.wallets w
    where w.id = p_wallet_id and w.user_id = auth.uid()
  );
$$;

-- =====================================================================
-- Wallet balance ledger trigger
--   On a completed transaction, adjust wallet balance and stamp
--   balance_after / last_txn_at. Runs as definer to bypass RLS on wallets.
-- =====================================================================
create or replace function public.apply_wallet_transaction()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_new_balance numeric(16,2);
  v_delta       numeric(16,2);
begin
  if new.txn_status <> 'completed' then
    return new;
  end if;

  v_delta := case when new.txn_type = 'credit' then new.amount else -new.amount end;

  update public.wallets
     set balance        = balance + v_delta,
         total_credited = total_credited + (case when new.txn_type = 'credit' then new.amount else 0 end),
         total_debited  = total_debited  + (case when new.txn_type = 'debit'  then new.amount else 0 end),
         last_txn_at    = now(),
         updated_at     = now()
   where id = new.wallet_id
   returning balance into v_new_balance;

  if v_new_balance is null then
    raise exception 'Wallet % not found for transaction', new.wallet_id;
  end if;
  if v_new_balance < 0 then
    raise exception 'Insufficient wallet balance for debit of %', new.amount;
  end if;

  new.balance_after := v_new_balance;
  return new;
end;
$$;

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_wallets_user            on public.wallets(user_id);
create index if not exists idx_wallet_txns_wallet       on public.wallet_transactions(wallet_id, created_at desc);
create index if not exists idx_wallet_txns_user         on public.wallet_transactions(user_id, created_at desc);
create index if not exists idx_wallet_txns_category     on public.wallet_transactions(category);
create index if not exists idx_wallet_txns_reference    on public.wallet_transactions(reference_type, reference_id);
create index if not exists idx_payment_requests_user    on public.payment_requests(user_id, created_at desc);
create index if not exists idx_payment_requests_status  on public.payment_requests(request_status);
create index if not exists idx_payment_requests_wallet  on public.payment_requests(wallet_id);
create index if not exists idx_withdraw_requests_user   on public.withdraw_requests(user_id, created_at desc);
create index if not exists idx_withdraw_requests_wallet on public.withdraw_requests(wallet_id);
create index if not exists idx_withdraw_requests_status on public.withdraw_requests(withdraw_status) where deleted_at is null;
create index if not exists idx_subscription_plans_active on public.subscription_plans(is_active) where deleted_at is null;
create index if not exists idx_subscriptions_user       on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan       on public.subscriptions(plan_id);
create index if not exists idx_subscriptions_status     on public.subscriptions(sub_status) where deleted_at is null;
create index if not exists idx_gateway_logs_reference   on public.payment_gateway_logs(reference_type, reference_id);
create index if not exists idx_gateway_logs_order       on public.payment_gateway_logs(gateway_order_id);
create index if not exists idx_cashback_user            on public.cashback(user_id, created_at desc);
create index if not exists idx_cashback_status          on public.cashback(cashback_status);
create index if not exists idx_reward_points_user       on public.reward_points(user_id, created_at desc);
create index if not exists idx_settlements_payee        on public.settlements(payee_id, created_at desc);
create index if not exists idx_settlements_status       on public.settlements(settlement_status) where deleted_at is null;
create index if not exists idx_commission_payer         on public.commission(payer_id);
create index if not exists idx_commission_settlement    on public.commission(settlement_id);
create index if not exists idx_commission_reference     on public.commission(reference_type, reference_id);
create index if not exists idx_invoice_user             on public.invoice(user_id, issue_date desc);
create index if not exists idx_invoice_status           on public.invoice(invoice_status) where deleted_at is null;
create index if not exists idx_gst_records_invoice      on public.gst_records(invoice_id);
create index if not exists idx_gst_records_user         on public.gst_records(user_id);
create index if not exists idx_gst_records_filing       on public.gst_records(filing_period);

-- =====================================================================
-- Triggers: balance ledger + updated_at + audit + soft-delete
-- =====================================================================
drop trigger if exists trg_wallet_txn_apply on public.wallet_transactions;
create trigger trg_wallet_txn_apply
  before insert on public.wallet_transactions
  for each row execute function public.apply_wallet_transaction();

do $$
declare
  t text;
  updated_at_tables text[] := array[
    'wallets','wallet_transactions','payment_requests','withdraw_requests',
    'subscription_plans','subscriptions','cashback','settlements','commission',
    'invoice','gst_records'
  ];
  audit_tables text[] := array[
    'wallets','wallet_transactions','payment_requests','withdraw_requests',
    'subscription_plans','subscriptions','cashback','settlements','commission',
    'invoice','gst_records'
  ];
  softdel_tables text[] := array[
    'wallets','withdraw_requests','subscription_plans','subscriptions',
    'settlements','commission','invoice','gst_records'
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
    'wallets','wallet_transactions','payment_requests','withdraw_requests',
    'subscription_plans','subscriptions','payment_gateway_logs','cashback',
    'reward_points','settlements','commission','invoice','gst_records'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- wallets: owner read; owner/admin manage (balance normally moved via ledger)
drop policy if exists "wallets_read" on public.wallets;
create policy "wallets_read" on public.wallets
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "wallets_owner_insert" on public.wallets;
create policy "wallets_owner_insert" on public.wallets
  for insert to authenticated
  with check (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "wallets_admin_update" on public.wallets;
create policy "wallets_admin_update" on public.wallets
  for update to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- wallet_transactions: parties read; owner/admin insert (immutable, no update/delete)
drop policy if exists "wallet_txns_read" on public.wallet_transactions;
create policy "wallet_txns_read" on public.wallet_transactions
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "wallet_txns_insert" on public.wallet_transactions;
create policy "wallet_txns_insert" on public.wallet_transactions
  for insert to authenticated
  with check ((user_id = auth.uid() and public.owns_wallet(wallet_id)) or public.is_platform_admin());

-- payment_requests: owner manage
drop policy if exists "payment_requests_access" on public.payment_requests;
create policy "payment_requests_access" on public.payment_requests
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- withdraw_requests: owner manage
drop policy if exists "withdraw_requests_access" on public.withdraw_requests;
create policy "withdraw_requests_access" on public.withdraw_requests
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- subscription_plans: public read; admin write
drop policy if exists "subscription_plans_read" on public.subscription_plans;
create policy "subscription_plans_read" on public.subscription_plans
  for select to authenticated using (true);
drop policy if exists "subscription_plans_admin_write" on public.subscription_plans;
create policy "subscription_plans_admin_write" on public.subscription_plans
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- subscriptions: owner manage
drop policy if exists "subscriptions_access" on public.subscriptions;
create policy "subscriptions_access" on public.subscriptions
  for all to authenticated
  using (user_id = auth.uid() or public.is_platform_admin())
  with check (user_id = auth.uid() or public.is_platform_admin());

-- payment_gateway_logs: admin only
drop policy if exists "gateway_logs_admin" on public.payment_gateway_logs;
create policy "gateway_logs_admin" on public.payment_gateway_logs
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- cashback: owner read; admin write
drop policy if exists "cashback_read" on public.cashback;
create policy "cashback_read" on public.cashback
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "cashback_admin_write" on public.cashback;
create policy "cashback_admin_write" on public.cashback
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- reward_points: owner read; admin write (ledger, no update/delete for users)
drop policy if exists "reward_points_read" on public.reward_points;
create policy "reward_points_read" on public.reward_points
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "reward_points_admin_write" on public.reward_points;
create policy "reward_points_admin_write" on public.reward_points
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- settlements: payee read; admin write
drop policy if exists "settlements_read" on public.settlements;
create policy "settlements_read" on public.settlements
  for select to authenticated
  using (payee_id = auth.uid() or public.is_platform_admin());
drop policy if exists "settlements_admin_write" on public.settlements;
create policy "settlements_admin_write" on public.settlements
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- commission: payer read; admin write
drop policy if exists "commission_read" on public.commission;
create policy "commission_read" on public.commission
  for select to authenticated
  using (payer_id = auth.uid() or public.is_platform_admin());
drop policy if exists "commission_admin_write" on public.commission;
create policy "commission_admin_write" on public.commission
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- invoice: owner read; admin write
drop policy if exists "invoice_read" on public.invoice;
create policy "invoice_read" on public.invoice
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "invoice_admin_write" on public.invoice;
create policy "invoice_admin_write" on public.invoice
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- gst_records: owner read; admin write
drop policy if exists "gst_records_read" on public.gst_records;
create policy "gst_records_read" on public.gst_records
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());
drop policy if exists "gst_records_admin_write" on public.gst_records;
create policy "gst_records_admin_write" on public.gst_records
  for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- =====================================================================
-- Views (security_invoker so RLS of the querying user applies)
-- =====================================================================
create or replace view public.v_wallet_overview
with (security_invoker = true) as
select
  w.id            as wallet_id,
  w.user_id,
  w.wallet_status,
  w.currency,
  w.balance,
  w.reserved_balance,
  (w.balance - w.reserved_balance) as available_balance,
  w.total_credited,
  w.total_debited,
  w.last_txn_at,
  coalesce(rp.points_balance, 0) as reward_points_balance
from public.wallets w
left join lateral (
  select sum(points) as points_balance
  from public.reward_points r
  where r.user_id = w.user_id
) rp on true
where w.deleted_at is null;
comment on view public.v_wallet_overview is 'Wallet balances with available balance and reward-point total.';
