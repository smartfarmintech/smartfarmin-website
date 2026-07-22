# AgreeConnect — Database Audit Report

_Platform: Supabase (PostgreSQL) · Project `glaqqpulfxfkyxjauplu` · Generated from live database introspection._

---

## 1. Executive Summary

A full audit of the live production schema was performed using PostgreSQL system
catalogs and Supabase's built-in security & performance advisors. The schema is
in strong structural shape: **133 tables, 100% with RLS enabled, 100% with
policies, 100% with primary keys.** No orphan tables or missing-PK issues exist.

The audit identified a set of **real, high-value hardening opportunities** — all
of which were addressed with a single **safe, additive, non-destructive
migration** (`audit_safe_hardening`). No data was modified and no objects were
dropped.

### Scorecard

| Area | Before | After | Status |
| --- | --- | --- | --- |
| Tables | 133 | 133 | — |
| Tables with RLS enabled | 133 / 133 | 133 / 133 | Pass |
| Tables with at least one policy | 133 / 133 | 133 / 133 | Pass |
| Tables with a primary key | 133 / 133 | 133 / 133 | Pass |
| Unindexed foreign keys | 51 | **0** | Fixed |
| App functions with mutable `search_path` | many | **0** | Fixed |
| SECURITY DEFINER funcs callable by `anon` | many | **0** | Fixed |
| Analytics MVs exposed on API | 2 | **0** | Fixed |

---

## 2. Methodology

Findings were derived from three sources against the **live** database:

1. **`pg_catalog` introspection** — RLS state, policies, primary keys, foreign
   keys, supporting indexes, function security attributes, and `search_path`
   configuration.
2. **Supabase Security Advisor** — 148 lint entries reviewed.
3. **Supabase Performance Advisor** — 540 lint entries reviewed.

Every finding was triaged into **real issue** vs **false positive** (e.g.
"unused index" warnings on a freshly seeded project, or `search_path` warnings on
extension-owned functions such as `pgvector`, `pg_trgm`, `citext`).

---

## 3. Findings & Remediation

### 3.1 Unindexed Foreign Keys — FIXED (High impact)

**Finding:** 51 foreign-key constraints had no supporting index on their
referencing column(s). This causes sequential scans on joins and, critically,
slow cascade/`ON DELETE` checks against parent rows.

**Remediation:** A `DO` block iterated every FK lacking a covering index and
created a `idx_fk_<constraint_name>` B-tree index on the referencing column(s).
**52 indexes** were created; remaining unindexed FKs: **0**.

> Idempotent: re-running skips any FK that already has a covering index.

### 3.2 Function `search_path` Hardening — FIXED (Security)

**Finding:** Application-owned functions did not pin `search_path`, leaving them
theoretically vulnerable to search-path–based object shadowing (a Supabase
security lint, `function_search_path_mutable`).

**Remediation:** Every non-extension function in `public` was altered to
`SET search_path = public, pg_temp`. Extension functions were intentionally
skipped (they are maintained by their extensions). App functions with mutable
search_path: **0**.

### 3.3 SECURITY DEFINER Exposure — FIXED (Security)

**Finding:** `SECURITY DEFINER` helper functions (e.g. RLS helpers like
`is_platform_admin`) were executable by the `anon` role and `PUBLIC`.

**Remediation:** `EXECUTE` was revoked from `PUBLIC` and `anon`, and granted to
`authenticated` (required by RLS policy evaluation). SECURITY DEFINER functions
callable by `anon`: **0**.

### 3.4 Analytics Materialized Views on the API — FIXED (Security)

**Finding:** `mv_daily_event_summary` and `mv_farmer_engagement` were reachable
through the PostgREST API (`materialized_view_in_api` lint).

**Remediation:** `SELECT` was revoked from `anon` and `authenticated`. These
aggregates should be served through controlled server-side code / SECURITY
DEFINER RPCs rather than direct API reads.

---

## 4. Known Open Items (Not Yet Applied)

These were identified but **deliberately not changed** in this pass, per scope
decision. They are safe to schedule as follow-ups:

### 4.1 RLS `InitPlan` Re-evaluation (Performance)

~78 policies call `auth.uid()` / `is_platform_admin()` **unwrapped**, so Postgres
re-evaluates them once per row. The official fix is to wrap them:

```sql
-- Before
using (applicant_id = auth.uid())
-- After (evaluated once per query)
using (applicant_id = (select auth.uid()))
```

This is a large, cross-module change and was excluded from the safe set. It is a
meaningful win on large result sets and recommended as the next migration.

### 4.2 Extensions in `public` Schema

Extensions such as `citext`, `pg_trgm`, `vector` live in `public`. Best practice
is a dedicated `extensions` schema, but relocating them can break code that
references their functions unqualified — higher risk, so deferred.

### 4.3 "Unused Index" Warnings — No Action (False Positive)

The performance advisor flags many indexes as unused. On a newly populated
project these statistics are not meaningful. **Do not drop these** until the
database has accumulated representative production traffic.

---

## 5. Operational Recommendations (Infra / Ops)

These are outside the scope of schema migrations but part of a complete audit:

- **Backups / PITR:** Confirm Point-in-Time-Recovery is enabled on the Supabase
  plan; document RPO/RTO targets and test a restore.
- **Connection pooling:** Use the Supavisor/PgBouncer transaction pooler
  connection string for serverless workloads to avoid connection exhaustion.
- **Monitoring:** Wire Supabase logs/metrics to alerting; watch for slow queries
  and RLS-related sequential scans as data grows.
- **Ephemeral state:** If rate limiting, sessions, or caching are needed, use a
  Redis-style store rather than Postgres tables.

---

## 6. Change Log

| Migration | Description | Destructive? |
| --- | --- | --- |
| `government_services_module` | Added Government Services module (7 tables, enums, indexes, triggers, RLS). | No |
| `audit_safe_hardening` | Indexed 51 FKs; pinned function `search_path`; locked down SECURITY DEFINER grants; removed analytics MVs from API. | No |

_All migrations in this report are additive and non-destructive. No rows were
modified or deleted._
