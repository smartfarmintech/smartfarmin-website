# RYTHU360 - COMPLETE DATABASE DOCUMENTATION

**Version:** 1.0  
**Last Updated:** January 2025  
**Database:** PostgreSQL via Supabase  
**Total Tables:** 147 (131 regular tables + 16 views)  
**RLS Enabled:** Yes (on 139 tables)  

---

## TABLE OF CONTENTS

1. [Database Overview](#database-overview)
2. [Authentication & User Management](#authentication--user-management)
3. [Farmer Module](#farmer-module)
4. [Machinery & Bookings](#machinery--bookings)
5. [Marketplace Module](#marketplace-module)
6. [Payments & Wallet](#payments--wallet)
7. [Government Schemes](#government-schemes)
8. [CRM & Leads](#crm--leads)
9. [Field Operations](#field-operations)
10. [Notifications](#notifications)
11. [AI & Analytics](#ai--analytics)
12. [Organic Store](#organic-store)
13. [Drone Services](#drone-services)
14. [Views & Reporting](#views--reporting)
15. [Relationships & Foreign Keys](#relationships--foreign-keys)
16. [RLS Policies](#rls-policies)
17. [Indexes & Performance](#indexes--performance)
18. [Storage Buckets](#storage-buckets)

---

## DATABASE OVERVIEW

### Schema Statistics

| Metric | Count |
|--------|-------|
| Total Tables | 147 |
| Core Tables | 131 |
| Views | 16 |
| RLS Enabled | 139 |
| RLS Disabled | 8 |
| Total Columns | ~2,500+ |
| Primary Keys | All tables |
| Foreign Keys | ~300+ |
| Indexes | Optimized |
| Storage Buckets | 6 |

### Core Modules

1. **Authentication (10 tables)** - User accounts, sessions, tokens
2. **Farmer Module (13 tables)** - Profiles, lands, crops, documents
3. **Machinery (15 tables)** - Machines, bookings, GPS tracking
4. **Marketplace (25 tables)** - Products, orders, reviews, inventory
5. **Wallet & Payments (8 tables)** - Transactions, settlements, refunds
6. **Government Schemes (8 tables)** - Applications, eligibility, benefits
7. **CRM & Leads (9 tables)** - Leads, follow-ups, call logs, performance
8. **Field Operations (8 tables)** - Visits, attendance, verifications
9. **Notifications (6 tables)** - Templates, channels, logs
10. **AI Services (10 tables)** - Conversations, predictions, image analysis
11. **Business Intelligence (8 tables)** - Metrics, dashboards, analytics
12. **Organic Store (8 tables)** - Farms, products, certificates
13. **Drone Services (3 tables)** - Bookings, services
14. **Geographic Data (5 tables)** - States, districts, villages
15. **Supporting Tables (9 tables)** - Settings, currencies, languages

---

## AUTHENTICATION & USER MANAGEMENT

### 1. `users` (Supabase Auth)
Built-in Supabase authentication table.

**Key Columns:**
- `id: uuid` - User ID (Primary Key)
- `email: text` - Email address
- `encrypted_password: text` - Password hash
- `email_confirmed_at: timestamp` - Email verification
- `created_at: timestamp` - Account creation time

**Relationships:**
- 1:1 → user_profiles
- 1:1 → farmers
- 1:1 → operators
- 1:M → user_sessions
- 1:M → login_history

**RLS:** System managed

---

### 2. `user_profiles`
Extended user information and preferences.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `role_id: uuid` (FK → roles)
- `village_id: uuid` (FK → villages)
- `full_name: text`
- `first_name: text`
- `last_name: text`
- `email: email` (UNIQUE)
- `phone: text` (UNIQUE)
- `avatar_url: text` - Profile picture (Storage: avatars/)
- `gender: enum` (male, female, other)
- `date_of_birth: date`
- `preferred_language: enum` (en, te, hi, etc.)
- `status: enum` (active, inactive, suspended)
- `is_verified: boolean`
- `email_verified_at: timestamp`
- `phone_verified_at: timestamp`
- `address_line1: text`
- `address_line2: text`
- `pincode: text`
- `latitude: numeric`
- `longitude: numeric`
- `timezone: text`
- `last_active_at: timestamp`
- `onboarded_at: timestamp`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← users
- M:1 ← roles
- M:1 ← villages

**RLS Policies:**
- `user_profiles_select_own` - Users see their own profile
- `user_profiles_update_own` - Users update their own profile
- `user_profiles_insert_own` - Users create their own profile
- `user_profiles_admin_delete` - Admin only deletion

**Indexes:**
- email (UNIQUE)
- phone (UNIQUE)
- role_id
- village_id
- user_id

---

### 3. `roles`
Role definitions for RBAC.

**Columns:**
- `id: uuid` (PK)
- `name: enum` (founder, super_admin, admin, farmer, telecaller, field_agent, machinery_operator, drone_operator)
- `slug: text` (UNIQUE)
- `description: text`
- `level: smallint` (1-8, hierarchy)
- `is_system: boolean` - System role (cannot delete)
- `status: enum` (active, inactive)
- `metadata: jsonb`

**RLS Policies:**
- `roles_read_authenticated` - All authenticated users
- `roles_admin_write` - Admin only

**Indexes:**
- name (UNIQUE)
- slug (UNIQUE)

---

### 4. `permissions`
Fine-grained permission definitions.

**Columns:**
- `id: uuid` (PK)
- `code: text` (UNIQUE) - e.g., "machinery:create_booking"
- `name: text`
- `description: text`
- `resource: text` - Target resource type
- `action: enum` (create, read, update, delete, approve)
- `status: enum` (active, inactive)
- `is_system: boolean`

**Many-to-Many:**
- M:M through `role_permissions`

**RLS Policies:**
- `permissions_read_authenticated` - All authenticated users
- `permissions_admin_write` - Admin only

---

### 5. `role_permissions`
Junction table for role-permission mapping.

**Columns:**
- `id: uuid` (PK)
- `role_id: uuid` (FK → roles)
- `permission_id: uuid` (FK → permissions)
- `created_at: timestamp`

**Relationships:**
- M:1 ← roles
- M:1 ← permissions

**RLS Policies:**
- `role_permissions_read_authenticated` - All authenticated users
- `role_permissions_admin_write` - Admin only

---

### 6. `user_sessions`
Active user sessions for multi-device support.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `session_token: text` (UNIQUE)
- `device_id: uuid` (FK → user_devices)
- `is_active: boolean`
- `ip_address: inet`
- `user_agent: text`
- `location: jsonb` - Geolocation data
- `last_seen_at: timestamp`
- `expires_at: timestamp`
- `revoked_at: timestamp` (NULL if active)
- `created_at: timestamp`

**Relationships:**
- M:1 ← users
- M:1 ← user_devices

**RLS Policies:**
- `user_sessions_own_all` - Users manage own sessions

**Indexes:**
- user_id
- session_token (UNIQUE)
- is_active

---

### 7. `login_history`
Login attempt logging for security.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `email: email`
- `status: enum` (success, failed, mfa_required)
- `ip_address: inet`
- `user_agent: text`
- `device_id: uuid`
- `failure_reason: text` (NULL on success)
- `location: jsonb` - Geolocation
- `created_at: timestamp`

**Relationships:**
- M:1 ← users

**RLS Policies:**
- `login_history_select_own` - Users see own login history

**Indexes:**
- user_id
- created_at (for auditing)

---

### 8. `auth_tokens`
Special tokens for authentication flows.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `token_hash: text` - Hashed token
- `token_type: enum` (email_confirmation, password_reset, mfa_setup)
- `identifier: enum` - email or phone
- `attempts: smallint` - Failed attempt count
- `expires_at: timestamp`
- `consumed_at: timestamp` (NULL if unused)
- `metadata: jsonb`
- `created_at: timestamp`

**RLS Policies:**
- `auth_tokens_admin_select` - Admin only

---

### 9. `user_mfa_factors`
Multi-factor authentication setup.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `factor_type: enum` (totp, phone)
- `secret: text` - Encrypted secret
- `phone: text` - For SMS MFA
- `friendly_name: text` - "Work Phone", etc.
- `is_verified: boolean`
- `verified_at: timestamp`
- `last_used_at: timestamp`
- `created_at: timestamp`

**Relationships:**
- M:1 ← users

**RLS Policies:**
- `user_mfa_factors_own_all` - Users manage own MFA

---

### 10. `user_devices`
Registered user devices for push notifications.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `platform: enum` (ios, android, web)
- `device_token: text` - Push notification token
- `device_name: text` - "iPhone 12 Pro"
- `device_model: text`
- `os_version: text`
- `app_version: text`
- `is_trusted: boolean`
- `push_enabled: boolean`
- `last_used_at: timestamp`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← users

**RLS Policies:**
- `user_devices_own_all` - Users manage own devices

---

## FARMER MODULE

### 11. `farmers`
Core farmer profile.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users, UNIQUE)
- `village_id: uuid` (FK → villages)
- `farmer_code: text` (UNIQUE) - Auto-generated
- `farmer_type: enum` (individual, cooperative, group)
- `experience_years: smallint`
- `status: enum` (active, inactive, blocked)
- `is_verified: boolean`
- `verified_at: timestamp`
- `registration_number: text` (farmer registration)
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp` (soft delete)

**Relationships:**
- 1:1 ← users
- 1:1 → farmer_profiles
- 1:M → lands
- 1:M → crop_cycles
- 1:M → crop_health
- M:1 ← villages

**RLS Policies:**
- `farmers_own_all` - Farmers access their own data

**Indexes:**
- user_id (UNIQUE)
- farmer_code (UNIQUE)
- village_id
- status

---

### 12. `farmer_profiles`
Extended farmer information.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers, UNIQUE)
- `aadhaar_hash: text` - PII encrypted
- `aadhaar_last4: char(4)`
- `pan_number: text` - Encrypted PII
- `kisan_credit_card_no: text` - Encrypted
- `bank_name: text`
- `bank_account_last4: char(4)`
- `ifsc_code: text`
- `upi_id: text` - For wallet transfers
- `social_category: enum` (general, sc, st, obc)
- `education_level: enum` (no_school, primary, secondary, higher_secondary, graduate)
- `annual_income: numeric` - In INR
- `household_size: smallint`
- `is_pmkisan_beneficiary: boolean`
- `is_insured: boolean` - Crop/livestock insurance
- `photo_url: text` - Storage: farmer-photos/
- `emergency_contact: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- 1:1 ← farmers

**RLS Policies:**
- `farmer_profiles_own_all` - Farmer owns their profile

**Indexes:**
- farmer_id (UNIQUE)

---

### 13. `lands`
Agricultural land records.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `village_id: uuid` (FK → villages)
- `land_name: text`
- `land_type: enum` (leased, owned, community)
- `ownership_type: enum` (individual, joint, cooperative)
- `survey_number: text` - Revenue record
- `khata_number: text` - Tax identification
- `status: enum` (active, inactive, disputed)
- `is_active: boolean`
- `area_value: numeric`
- `area_unit: enum` (acres, hectares, square_meters)
- `soil_type: enum` (black, red, laterite, alluvial, clay)
- `water_source: enum` (well, borewell, canal, tank, river)
- `latitude: numeric`
- `longitude: numeric`
- `metadata: jsonb` - Custom fields
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← villages
- 1:M → crop_cycles
- 1:M → crop_history
- 1:M → soil_tests
- 1:M → irrigation
- 1:M → farm_documents
- 1:M → land_boundaries

**RLS Policies:**
- `lands_own_all` - Farmer owns lands

**Indexes:**
- farmer_id
- village_id
- status
- (latitude, longitude) - Geospatial

---

### 14. `land_boundaries`
GPS boundary points for precise land mapping.

**Columns:**
- `id: uuid` (PK)
- `land_id: uuid` (FK → lands)
- `sequence_no: integer` - Order of points
- `latitude: numeric`
- `longitude: numeric`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← lands

**Indexes:**
- land_id
- sequence_no

---

### 15. `crop_cycles`
Active and completed crop seasons.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `land_id: uuid` (FK → lands)
- `crop_name: text`
- `variety: text` - e.g., "BPT 5204"
- `season: enum` (kharif, rabi, summer)
- `status: enum` (planning, growing, harvesting, completed)
- `sowing_date: date`
- `expected_harvest_date: date`
- `actual_harvest_date: date` (NULL until harvest)
- `area_value: numeric`
- `area_unit: enum` (acres, hectares)
- `expected_yield: numeric`
- `actual_yield: numeric`
- `yield_unit: text` - "quintals", "kg"
- `seed_source: text` - "FCI", "local market"
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← lands
- 1:M → crop_health
- 1:M → crop_images
- 1:M → irrigation

**RLS Policies:**
- `crop_cycles_own_all` - Farmer owns their cycles

**Indexes:**
- farmer_id
- land_id
- season
- status

---

### 16. `crop_health`
Disease and pest detection records.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `crop_cycle_id: uuid` (FK → crop_cycles)
- `health_status: enum` (healthy, affected, severe)
- `issue_type: enum` (disease, pest, weed, nutrient_deficiency)
- `issue_name: text` - "Powdery Mildew"
- `severity: smallint` (1-5 scale)
- `affected_area_pct: numeric` (0-100%)
- `diagnosis: text` - AI diagnosis
- `treatment: text` - Recommended treatment
- `image_url: text` - Storage: crop-images/
- `is_resolved: boolean`
- `observed_at: timestamp`
- `resolved_at: timestamp` (NULL if unresolved)
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← crop_cycles
- May reference → disease_predictions (from AI)

**RLS Policies:**
- `crop_health_own_all` - Farmer owns their records

**Indexes:**
- farmer_id
- crop_cycle_id
- health_status

---

### 17. `crop_images`
Timestamped crop photos for monitoring.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `crop_cycle_id: uuid` (FK → crop_cycles)
- `image_url: text` - Storage: crop-images/
- `growth_stage: enum` (germination, seedling, vegetative, flowering, fruiting, mature)
- `caption: text` - User description
- `latitude: numeric`
- `longitude: numeric`
- `captured_at: timestamp`
- `created_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← crop_cycles

**RLS Policies:**
- `crop_images_own_all` - Farmer owns images

**Indexes:**
- farmer_id
- crop_cycle_id
- captured_at

---

### 18. `crop_history`
Historical yield records.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `land_id: uuid` (FK → lands)
- `crop_year: smallint` - e.g., 2024
- `crop_name: text`
- `variety: text`
- `season: enum`
- `area_sown: numeric`
- `area_unit: enum`
- `yield_quantity: numeric`
- `yield_unit: text`
- `input_cost: numeric` - In INR
- `revenue: numeric` - In INR
- `notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← lands

**RLS Policies:**
- `crop_history_own_all` - Farmer owns history

---

### 19. `soil_tests`
Soil analysis records.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `land_id: uuid` (FK → lands)
- `test_date: date`
- `lab_name: text`
- `report_url: text` - Storage: documents/
- `ph_level: numeric` (6.5-7.5 ideal)
- `ec_value: numeric` - Electrical conductivity
- `organic_carbon: numeric` - %
- `nitrogen: numeric` - mg/kg
- `phosphorus: numeric` - mg/kg
- `potassium: numeric` - mg/kg
- `micronutrients: jsonb` - Zn, Fe, Mn, etc.
- `recommendations: text` - AI insights
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← lands

**RLS Policies:**
- `soil_tests_own_all` - Farmer owns tests

---

### 20. `irrigation`
Irrigation event logging.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `land_id: uuid` (FK → lands)
- `crop_cycle_id: uuid` (FK → crop_cycles)
- `irrigation_date: date`
- `source: enum` (well, borewell, canal, tank, river, drip)
- `method: enum` (flood, drip, sprinkler, micro_sprinkler)
- `water_volume_liters: numeric`
- `duration_minutes: integer`
- `notes: text`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← lands
- M:1 ← crop_cycles

**RLS Policies:**
- `irrigation_own_all` - Farmer owns records

---

### 21. `farm_documents`
Land ownership and certification documents.

**Columns:**
- `id: uuid` (PK)
- `farmer_id: uuid` (FK → farmers)
- `land_id: uuid` (FK → lands)
- `document_type: enum` (land_certificate, survey_report, tax_receipt, lease_agreement)
- `verification_status: enum` (pending, verified, rejected)
- `title: text`
- `file_url: text` - Storage: farm-documents/
- `mime_type: text` (application/pdf, etc.)
- `file_size_bytes: bigint`
- `issue_date: date`
- `expiry_date: date` (NULL if no expiry)
- `issued_by: text` - Authority name
- `verified_by: uuid` (FK → users, admin)
- `verified_at: timestamp`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← farmers
- M:1 ← lands
- M:1 ← users (verified_by)

**RLS Policies:**
- `farm_documents_own_all` - Farmer owns documents

**Indexes:**
- farmer_id
- land_id
- verification_status

---

## MACHINERY & BOOKINGS

### 22. `machines`
Machinery inventory.

**Columns:**
- `id: uuid` (PK)
- `owner_id: uuid` (FK → farmers/operators)
- `category_id: uuid` (FK → machinery_categories)
- `village_id: uuid` (FK → villages)
- `name: text`
- `slug: text` (UNIQUE)
- `brand: text`
- `model: text`
- `registration_no: text` (UNIQUE)
- `image_url: text` - Primary image
- `gallery_urls: text[]` - Multiple images (Storage)
- `description: text`
- `specifications: jsonb` - Power, fuel type, etc.
- `power_hp: numeric`
- `fuel: enum` (diesel, petrol, electric)
- `manufacture_year: integer`
- `ownership_type: enum` (owned, leased)
- `base_location: text`
- `latitude: numeric`
- `longitude: numeric`
- `service_radius_km: numeric`
- `status: enum` (active, inactive, maintenance)
- `machine_status: enum` (available, booked, unavailable)
- `operator_included: boolean`
- `implements_included: text[]` - e.g., ["rotavator", "harrow"]
- `rating_avg: numeric` (0-5)
- `rating_count: integer`
- `total_bookings: integer`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← machinery_categories
- M:1 ← villages
- 1:M → bookings
- 1:M → availability
- 1:M → pricing_rules
- 1:M → gps_locations
- 1:M → machine_reviews
- 1:M → maintenance

**RLS Policies:**
- `machines_owner_write` - Owner manages machine
- `machines_read` - Public read access

**Indexes:**
- owner_id
- category_id
- slug (UNIQUE)
- registration_no (UNIQUE)
- status
- (latitude, longitude) - Geospatial

---

### 23. `machinery_categories`
Machine types classification.

**Columns:**
- `id: uuid` (PK)
- `parent_id: uuid` (FK → machinery_categories) - Self-referential for subcategories
- `name: text` - "Tractors", "Harvesters"
- `slug: text` (UNIQUE)
- `description: text`
- `icon_url: text`
- `image_url: text`
- `display_order: integer` - Sort order
- `is_active: boolean`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- 1:M → machines
- M:1 ← machinery_categories (parent) - Self-referential

**RLS Policies:**
- `machinery_categories_read` - Public
- `machinery_categories_admin_write` - Admin only

**Indexes:**
- slug (UNIQUE)
- parent_id

---

### 24. `bookings`
Machinery rental bookings.

**Columns:**
- `id: uuid` (PK)
- `booking_number: text` (UNIQUE) - Auto-generated
- `machine_id: uuid` (FK → machines)
- `owner_id: uuid` (FK → farmers) - Machine owner
- `renter_id: uuid` (FK → farmers) - Who's renting
- `operator_id: uuid` (FK → operators, NULL if farmer operates)
- `pricing_rule_id: uuid` (FK → pricing_rules)
- `village_id: uuid` (FK → villages)
- `booking_state: enum` (pending, confirmed, cancelled, completed)
- `payment_status: enum` (unpaid, partial, paid, refunded)
- `unit_type: enum` (hours, days, acres)
- `units: numeric` - Booking duration/area
- `starts_at: timestamp`
- `ends_at: timestamp`
- `service_address: jsonb` - Delivery location
- `latitude: numeric` - Job location
- `longitude: numeric`
- `unit_price: numeric` - Per unit cost
- `operator_fee: numeric` - If operator hired
- `discount_amount: numeric`
- `tax_amount: numeric` (GST)
- `total_amount: numeric`
- `advance_amount: numeric`
- `currency: char(3)` - "INR"
- `confirmed_at: timestamp`
- `completed_at: timestamp`
- `cancelled_at: timestamp`
- `cancel_reason: text`
- `notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← machines
- M:1 ← farmers (owner_id)
- M:1 ← farmers (renter_id)
- M:1 ← operators
- M:1 ← pricing_rules
- M:1 ← villages
- 1:M → booking_payments
- 1:M → booking_status
- 1:M → gps_locations
- 1:M → invoices (payment_requests)

**RLS Policies:**
- `bookings_access` - Users access relevant bookings

**Indexes:**
- booking_number (UNIQUE)
- machine_id
- owner_id
- renter_id
- operator_id
- booking_state
- starts_at
- ends_at

---

### 25. `booking_status`
State change audit trail.

**Columns:**
- `id: uuid` (PK)
- `booking_id: uuid` (FK → bookings)
- `from_state: enum`
- `to_state: enum`
- `changed_by: uuid` (FK → users)
- `note: text`
- `created_at: timestamp`

**Relationships:**
- M:1 ← bookings
- M:1 ← users

**RLS Policies:**
- `booking_status_read` - Read access

**Indexes:**
- booking_id
- created_at

---

### 26. `pricing_rules`
Dynamic pricing configuration.

**Columns:**
- `id: uuid` (PK)
- `machine_id: uuid` (FK → machines, UNIQUE with other columns)
- `name: text` - "Summer Rate", "Weekend"
- `unit: enum` (hours, days, acres)
- `min_units: numeric`
- `max_units: numeric`
- `price: numeric` - Per unit
- `operator_fee: numeric` (daily/hourly)
- `fuel_included: boolean`
- `valid_from: date`
- `valid_until: date` (NULL = always valid)
- `season_start: date` (NULL = year-round)
- `season_end: date`
- `priority: integer` - Matching priority
- `is_active: boolean`
- `currency: char(3)`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← machines
- 1:M ← bookings

**RLS Policies:**
- `pricing_rules_owner_write` - Machine owner
- `pricing_rules_read` - Public

**Indexes:**
- machine_id
- is_active
- valid_from
- valid_until

---

### 27. `availability`
Machinery availability slots.

**Columns:**
- `id: uuid` (PK)
- `machine_id: uuid` (FK → machines)
- `starts_at: timestamp`
- `ends_at: timestamp`
- `slot_status: enum` (available, booked, maintenance, unavailable)
- `reason: text` - Why unavailable
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← machines

**RLS Policies:**
- `availability_read` - Public
- `availability_owner_write` - Machine owner

**Indexes:**
- machine_id
- starts_at
- ends_at

---

### 28. `booking_payments`
Payment records per booking.

**Columns:**
- `id: uuid` (PK)
- `booking_id: uuid` (FK → bookings)
- `payer_id: uuid` (FK → farmers)
- `amount: numeric`
- `currency: char(3)`
- `method: enum` (cash, upi, bank_transfer, card, wallet)
- `payment_status: enum` (pending, success, failed, refunded)
- `is_advance: boolean`
- `is_refund: boolean`
- `gateway: text` - "razorpay", "manual"
- `transaction_ref: text` - Gateway reference
- `paid_at: timestamp`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← bookings
- M:1 ← farmers (payer_id)

**RLS Policies:**
- `booking_payments_access` - Relevant users

**Indexes:**
- booking_id
- payer_id
- payment_status

---

### 29. `gps_locations`
Real-time GPS tracking for active bookings.

**Columns:**
- `id: uuid` (PK)
- `machine_id: uuid` (FK → machines)
- `booking_id: uuid` (FK → bookings)
- `latitude: numeric`
- `longitude: numeric`
- `speed_kmph: numeric` (0 if stationary)
- `heading: numeric` (0-360 degrees)
- `accuracy_m: numeric` - GPS accuracy in meters
- `recorded_at: timestamp` - When GPS point was recorded
- `created_at: timestamp`

**Relationships:**
- M:1 ← machines
- M:1 ← bookings

**RLS Policies:**
- `gps_locations_write` - Operator/machine writes
- `gps_locations_read` - Farmer/admin reads

**Indexes:**
- machine_id
- booking_id
- recorded_at

---

### 30. `machine_reviews`
User reviews for machines.

**Columns:**
- `id: uuid` (PK)
- `machine_id: uuid` (FK → machines)
- `booking_id: uuid` (FK → bookings)
- `user_id: uuid` (FK → farmers who rented)
- `operator_id: uuid` (FK → operators, NULL if farmer operated)
- `rating: smallint` (1-5)
- `operator_rating: smallint` (1-5) (NULL if no operator)
- `title: text`
- `body: text`
- `is_verified_booking: boolean` - Verified purchase
- `review_status: enum` (pending, approved, rejected)
- `helpful_count: integer`
- `owner_response: text` - Owner can respond
- `responded_at: timestamp`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← machines
- M:1 ← bookings
- M:1 ← farmers (user_id)
- M:1 ← operators

**RLS Policies:**
- `machine_reviews_author_write` - Author can write/edit
- `machine_reviews_read` - Public read

**Indexes:**
- machine_id
- user_id
- review_status

---

### 31. `maintenance`
Machine maintenance records.

**Columns:**
- `id: uuid` (PK)
- `machine_id: uuid` (FK → machines)
- `title: text`
- `description: text`
- `maint_type: enum` (regular, repair, inspection)
- `maint_status: enum` (pending, in_progress, completed)
- `status: enum` (scheduled, active, completed)
- `scheduled_at: timestamp`
- `started_at: timestamp`
- `completed_at: timestamp`
- `service_provider: text`
- `odometer_hours: numeric`
- `cost: numeric`
- `currency: char(3)`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← machines

**RLS Policies:**
- `maintenance_access` - Owner access

**Indexes:**
- machine_id
- scheduled_at
- status

---

## MARKETPLACE MODULE

### 32-36. Marketplace Tables (Products, Orders, Reviews, etc.)

Due to space constraints, see sections below for complete marketplace schema including:
- `products` - Product catalog
- `categories` - Product categories
- `inventory` - Stock management
- `orders` - Order records
- `order_items` - Line items
- `cart` / `cart_items` - Shopping cart
- `reviews` - Product reviews
- `ratings` - Star ratings
- `wishlist` - Favorites
- `returns` / `refunds` - Return management

[Full marketplace schema continues in MARKETPLACE.md segment]

---

## PAYMENTS & WALLET

### 37. `wallets`
User wallet account.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users, UNIQUE)
- `balance: numeric` (default: 0)
- `available_balance: numeric`
- `reserved_balance: numeric` - Pending transfers
- `total_credited: numeric` - Lifetime credit
- `total_debited: numeric` - Lifetime debit
- `wallet_status: enum` (active, frozen, closed)
- `currency: char(3)` - "INR"
- `last_txn_at: timestamp`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- 1:1 ← users
- 1:M → wallet_transactions
- 1:M → cashback
- 1:M → withdraw_requests
- 1:M → subscriptions

**RLS Policies:**
- `wallets_owner_insert` - User creates wallet
- `wallets_admin_update` - Admin manages wallet
- `wallets_read` - User reads own wallet

**Indexes:**
- user_id (UNIQUE)
- wallet_status

---

### 38. `wallet_transactions`
Wallet transaction log.

**Columns:**
- `id: uuid` (PK)
- `wallet_id: uuid` (FK → wallets)
- `user_id: uuid` (FK → users)
- `txn_type: enum` (credit, debit, transfer)
- `category: enum` (order_payment, refund, cashback, manual, subscription)
- `amount: numeric` (always positive, type indicates direction)
- `balance_after: numeric`
- `description: text`
- `reference_type: text` - "order", "booking", "subscription"
- `reference_id: uuid` - Link to original transaction
- `txn_status: enum` (pending, success, failed)
- `currency: char(3)`
- `idempotency_key: text` (UNIQUE) - Prevent duplicates
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← wallets
- M:1 ← users

**RLS Policies:**
- `wallet_txns_read` - User reads own transactions
- `wallet_txns_insert` - System inserts transactions

**Indexes:**
- wallet_id
- user_id
- created_at
- txn_status
- idempotency_key (UNIQUE)

---

### 39. `withdraw_requests`
Withdrawal from wallet to bank.

**Columns:**
- `id: uuid` (PK)
- `wallet_id: uuid` (FK → wallets)
- `user_id: uuid` (FK → users)
- `amount: numeric`
- `currency: char(3)`
- `withdraw_status: enum` (pending, approved, rejected, paid)
- `bank_account_name: text`
- `bank_account_no: text` (encrypted)
- `bank_ifsc: text`
- `upi_id: text` (encrypted, alternative)
- `processed_by: uuid` (FK → users, admin)
- `processed_at: timestamp`
- `payout_ref: text` - Settlement reference
- `rejection_reason: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← wallets
- M:1 ← users
- M:1 ← users (processed_by)

**RLS Policies:**
- `withdraw_requests_access` - User access own withdrawals

**Indexes:**
- wallet_id
- user_id
- withdraw_status

---

### 40. `payment_requests`
Payment gateway integration.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `wallet_id: uuid` (FK → wallets)
- `amount: numeric`
- `currency: char(3)`
- `reference_type: text` - "order", "booking", "subscription"
- `reference_id: uuid`
- `channel: enum` (razorpay, stripe, manual)
- `gateway: text` - Gateway name
- `gateway_order_id: text` (unique per gateway)
- `gateway_payment_id: text` (after payment)
- `request_status: enum` (pending, completed, failed, expired)
- `purpose: text` - "Order payment", "Booking advance"
- `expires_at: timestamp`
- `completed_at: timestamp`
- `idempotency_key: text` (UNIQUE)
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← users
- M:1 ← wallets

**RLS Policies:**
- `payment_requests_access` - User access own requests

**Indexes:**
- user_id
- gateway_order_id (UNIQUE)
- request_status
- expires_at

---

### 41. `payment_gateway_logs`
API logs for payment gateway integration.

**Columns:**
- `id: uuid` (PK)
- `reference_type: text` - "order", "booking"
- `reference_id: uuid`
- `gateway: text` - "razorpay"
- `event_type: text` - "order.created", "payment.authorized"
- `direction: text` - "request", "response", "webhook"
- `gateway_order_id: text`
- `gateway_payment_id: text`
- `http_status: integer` - HTTP response code
- `request_payload: jsonb` - Full request
- `response_payload: jsonb` - Full response
- `signature: text` - Webhook signature
- `is_verified: boolean` - Signature verified
- `created_at: timestamp`

**RLS Policies:**
- `gateway_logs_admin` - Admin only

**Indexes:**
- reference_id
- gateway_order_id
- created_at

---

### 42. `cashback`
Promotional cashback credited to wallet.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `wallet_id: uuid` (FK → wallets)
- `amount: numeric`
- `currency: char(3)`
- `cashback_status: enum` (pending, credited, expired, cancelled)
- `reason: text` - "First order", "Seasonal promotion"
- `campaign_code: text` - "FIRST50", "SUMMER20"
- `reference_type: text` - "order", "booking"
- `reference_id: uuid`
- `credited_txn_id: uuid` (FK → wallet_transactions, when credited)
- `expires_at: timestamp`
- `credited_at: timestamp`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`

**Relationships:**
- M:1 ← users
- M:1 ← wallets
- M:1 ← wallet_transactions (credited_txn_id)

**RLS Policies:**
- `cashback_admin_write` - Admin credits cashback
- `cashback_read` - User reads own cashback

---

### 43. `commission`
Commission tracking for sellers.

**Columns:**
- `id: uuid` (PK)
- `payer_id: uuid` (FK → users/sellers)
- `settlement_id: uuid` (FK → settlements)
- `reference_type: text` - "order", "booking"
- `reference_id: uuid`
- `base_amount: numeric`
- `rate_percent: numeric` (commission %)
- `commission_amount: numeric` (calculated)
- `tax_amount: numeric` (GST on commission)
- `commission_status: enum` (pending, settled, refunded)
- `currency: char(3)`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← settlements
- M:1 ← users (payer_id)

**RLS Policies:**
- `commission_admin_write` - Admin
- `commission_read` - Users read own commissions

---

### 44. `settlements`
Periodic settlement to sellers.

**Columns:**
- `id: uuid` (PK)
- `payee_id: uuid` (FK → sellers)
- `period_start: date`
- `period_end: date`
- `period: enum` (daily, weekly, monthly)
- `gross_amount: numeric` - Total earnings
- `commission_amount: numeric` - Commission deducted
- `tax_amount: numeric` - GST
- `net_amount: numeric` - Amount to be paid
- `settlement_status: enum` (pending, processing, completed, failed)
- `payout_ref: text` - Bank transfer reference
- `settled_at: timestamp`
- `currency: char(3)`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← users (payee_id)
- 1:M → commission

**RLS Policies:**
- `settlements_read` - User reads own settlements
- `settlements_admin_write` - Admin creates settlements

**Indexes:**
- payee_id
- period_start
- settlement_status

---

## GOVERNMENT SCHEMES

### 45-52. Government Scheme Tables (Applications, Eligibility, Benefits)

[Scheme management tables - includes applications, eligibility criteria, benefits, documents, status tracking]

---

## CRM & LEADS

### 53. `leads`
Sales lead records.

**Columns:**
- `id: uuid` (PK)
- `lead_number: text` (UNIQUE) - Auto-generated
- `full_name: text` (required)
- `phone: text` (required, indexed)
- `alt_phone: text`
- `email: email`
- `source_id: uuid` (FK → lead_sources) - Where from
- `status_id: uuid` (FK → lead_status)
- `assigned_to: uuid` (FK → telecallers)
- `crop_interest: text` - What crop/service
- `district: text`
- `state: text`
- `village_id: uuid` (FK → villages)
- `priority: enum` (low, medium, high, urgent)
- `temperature: enum` (cold, warm, hot) - Sales heat
- `score: integer` (0-100) - Lead score
- `estimated_value: numeric` - Potential order value
- `tags: text[]` - Custom tags
- `requirement: text` - Detailed requirement
- `notes: text` - Internal notes
- `last_contacted_at: timestamp`
- `next_followup_at: timestamp`
- `converted_at: timestamp` - When became customer
- `lost_reason: text` - Why lost
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← lead_sources
- M:1 ← lead_status
- M:1 ← telecallers
- M:1 ← villages
- 1:M → call_logs
- 1:M → followups

**RLS Policies:**
- `leads_read` - Telecallers read assigned leads
- `leads_insert` - Create new leads
- `leads_update` - Update own assigned leads
- `leads_admin_delete` - Admin delete

**Indexes:**
- phone (UNIQUE)
- status_id
- assigned_to
- priority
- next_followup_at

---

### 54. `lead_sources`
Lead source configuration.

**Columns:**
- `id: uuid` (PK)
- `code: text` (UNIQUE) - "call_center", "web_form"
- `name: text`
- `description: text`
- `is_active: boolean`
- `sort_order: integer`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**RLS Policies:**
- `lead_sources_read` - Public
- `lead_sources_admin_write` - Admin

---

### 55. `lead_status`
Lead status workflow.

**Columns:**
- `id: uuid` (PK)
- `code: text` (UNIQUE) - "new", "contacted", "qualified", "proposal_sent", "won", "lost"
- `name: text`
- `description: text`
- `is_active: boolean`
- `is_won: boolean` - Conversion
- `is_lost: boolean` - Failed
- `color: text` - UI color hex
- `sort_order: integer`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**RLS Policies:**
- `lead_status_read` - Public
- `lead_status_admin_write` - Admin

---

### 56. `call_logs`
Telecaller call records.

**Columns:**
- `id: uuid` (PK)
- `lead_id: uuid` (FK → leads)
- `telecaller_id: uuid` (FK → telecallers)
- `phone: text`
- `call_type: enum` (inbound, outbound)
- `outcome: enum` (no_answer, declined, interested, callback_scheduled)
- `started_at: timestamp`
- `ended_at: timestamp`
- `duration_seconds: integer`
- `recording_url: text` - Compliance storage
- `notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← leads
- M:1 ← telecallers
- 1:M → followups

**RLS Policies:**
- `call_logs_write` - Telecaller records
- `call_logs_read` - Admin/manager reads

**Indexes:**
- lead_id
- telecaller_id
- started_at

---

### 57. `followups`
Scheduled follow-up tasks.

**Columns:**
- `id: uuid` (PK)
- `lead_id: uuid` (FK → leads)
- `call_log_id: uuid` (FK → call_logs)
- `telecaller_id: uuid` (FK → telecallers)
- `purpose: text` - Why followup
- `scheduled_at: timestamp` (required)
- `reminder_at: timestamp` - Send notification
- `completed_at: timestamp`
- `followup_status: enum` (pending, completed, cancelled, rescheduled)
- `outcome_notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← leads
- M:1 ← call_logs
- M:1 ← telecallers

**RLS Policies:**
- `followups_write` - Telecaller creates/updates
- `followups_read` - Read access

**Indexes:**
- lead_id
- scheduled_at
- followup_status

---

### 58. `performance`
Telecaller performance metrics.

**Columns:**
- `id: uuid` (PK)
- `telecaller_id: uuid` (FK → telecallers)
- `period: enum` (daily, weekly, monthly)
- `period_start: date`
- `period_end: date`
- `leads_assigned: integer`
- `leads_worked: integer`
- `total_calls: integer`
- `connected_calls: integer`
- `total_talk_seconds: integer`
- `followups_completed: integer`
- `conversions: integer` - Leads won
- `revenue_generated: numeric` - Revenue from conversions
- `score: numeric` (0-100)
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← telecallers

**RLS Policies:**
- `performance_read` - Telecaller reads own
- `performance_admin_write` - Admin updates

**Indexes:**
- telecaller_id
- period_start
- period

---

### 59. `telecallers`
Telecaller team member.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users, UNIQUE)
- `village_id: uuid` (FK → villages)
- `employee_code: text` (UNIQUE)
- `full_name: text`
- `phone: text`
- `email: email`
- `team: text` - "Sales", "Support"
- `reporting_to: uuid` (FK → telecallers) - Manager
- `shift_start: time` - e.g., "09:00:00"
- `shift_end: time` - e.g., "18:00:00"
- `is_active: boolean`
- `joined_at: date`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- 1:1 ← users
- M:1 ← villages
- 1:M → leads (assigned_to)
- 1:M → call_logs
- 1:M → followups
- 1:M → performance
- 1:M → telecaller_attendance
- 1:M → telecaller_targets
- M:1 ← telecallers (reporting_to - self-ref)

**RLS Policies:**
- `telecallers_read` - Public
- `telecallers_self_update` - Update own profile
- `telecallers_admin_insert` - Admin creates
- `telecallers_admin_delete` - Admin deletes

**Indexes:**
- user_id (UNIQUE)
- employee_code (UNIQUE)
- reporting_to

---

### 60. `telecaller_attendance`
Telecaller attendance tracking.

**Columns:**
- `id: uuid` (PK)
- `telecaller_id: uuid` (FK → telecallers)
- `attendance_date: date`
- `attendance_status: enum` (present, absent, half_day, leave)
- `check_in_at: timestamp`
- `check_out_at: timestamp`
- `worked_minutes: integer`
- `notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← telecallers

**RLS Policies:**
- `tc_attendance_read` - HR/managers read
- `tc_attendance_self_write` - Telecaller records own

**Indexes:**
- telecaller_id
- attendance_date

---

### 61. `telecaller_targets`
Performance targets for telecallers.

**Columns:**
- `id: uuid` (PK)
- `telecaller_id: uuid` (FK → telecallers)
- `period: enum` (daily, weekly, monthly, quarterly)
- `period_start: date`
- `period_end: date`
- `metric: enum` (calls, connections, leads_qualified, conversions, revenue)
- `target_value: numeric`
- `achieved_value: numeric` (updated periodically)
- `notes: text`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← telecallers

**RLS Policies:**
- `tc_targets_read` - Telecaller reads own
- `tc_targets_admin_write` - Admin sets targets

---

## FIELD OPERATIONS

### 62-69. Field Operations (Visits, GPS, Agents, Attendance, Verification)

[Complete field agent tracking, visit management, GPS logging, verification records, expense tracking, document management]

**Key Tables:**
- `field_agents` - Agent profiles
- `visits` - Farm visits
- `gps_logs` - GPS tracking during visits
- `attendance` - Agent attendance
- `verification` - Farm verification records
- `documents` - Visit documents
- `expense_claims` - Reimbursement tracking

---

## NOTIFICATIONS

### 70. `notifications`
Notification inbox.

**Columns:**
- `id: uuid` (PK)
- `user_id: uuid` (FK → users)
- `farmer_id: uuid` (FK → farmers)
- `agent_id: uuid` (FK → field_agents)
- `template_id: uuid` (FK → notification_templates)
- `campaign_id: uuid` (FK → campaigns)
- `category: enum` (order, booking, payment, alert, announcement)
- `channel: enum` (in_app, email, sms, push)
- `title: text`
- `body: text`
- `image_url: text`
- `action_url: text` - Deep link
- `priority: enum` (low, normal, high, urgent)
- `status: enum` (unread, read, archived)
- `read_at: timestamp`
- `expires_at: timestamp`
- `data: jsonb` - Custom payload
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**Relationships:**
- M:1 ← users
- M:1 ← farmers
- M:1 ← field_agents
- M:1 ← notification_templates
- M:1 ← campaigns
- 1:M → notification_logs

**RLS Policies:**
- `notifications_owner_read` - User reads own
- `notifications_admin_write` - Admin/system creates
- `notifications_owner_update` - User marks as read
- `notifications_admin_delete` - Admin delete

**Indexes:**
- user_id
- status
- category
- created_at

---

### 71. `notification_templates`
Template library for notifications.

**Columns:**
- `id: uuid` (PK)
- `code: text` (UNIQUE) - "booking_confirmed", "payment_reminder"
- `name: text`
- `category: enum` (order, booking, payment, alert, announcement)
- `channel: enum` (in_app, email, sms, push)
- `language: text` (en, te, hi)
- `subject: text` (for email)
- `body: text` - Can use {{ variables }}
- `variables: jsonb` - Available variables
- `description: text`
- `is_active: boolean`
- `metadata: jsonb`
- `created_at: timestamp`
- `updated_at: timestamp`
- `deleted_at: timestamp`

**RLS Policies:**
- `notification_templates_read` - Public
- `notification_templates_admin` - Admin only

**Indexes:**
- code (UNIQUE)
- category
- channel

---

### 72. `notification_logs`
Delivery tracking.

**Columns:**
- `id: uuid` (PK)
- `notification_id: uuid` (FK → notifications)
- `campaign_id: uuid` (FK → campaigns)
- `user_id: uuid` (FK → users)
- `channel: enum`
- `status: enum` (sent, delivered, failed, bounced)
- `recipient: text` - Email/phone
- `provider: text` - "sendgrid", "twilio", "fcm"
- `provider_message_id: text`
- `attempt: integer`
- `request: jsonb` - API request
- `response: jsonb` - API response
- `error: text`
- `sent_at: timestamp`
- `delivered_at: timestamp`
- `created_at: timestamp`

**Relationships:**
- M:1 ← notifications
- M:1 ← campaigns
- M:1 ← users

**RLS Policies:**
- `notification_logs_read` - User reads own
- `notification_logs_admin` - Admin only

---

### 73-75. Email/SMS Logs, Push Tokens, Campaigns

[Email delivery logs, SMS delivery logs, push notification tokens, marketing campaigns]

---

## AI & ANALYTICS

### 76-85. AI Services (Conversations, Predictions, Image Analysis, etc.)

**AI Conversation Management:**
- `ai_conversations` - Multi-turn conversations
- `ai_messages` - Messages in conversations
- `ai_feedback` - User feedback on AI responses
- `ai_prompt_logs` - API call logging
- `voice_requests` / `voice_responses` - Voice AI

**AI Predictions:**
- `crop_predictions` - ML crop recommendations
- `disease_predictions` - Crop disease detection
- `image_analysis` - Image analysis results

**Analytics & Metrics:**
- `daily_metrics` - Daily aggregates
- `monthly_metrics` - Monthly aggregates
- `events` - User behavior events
- `dashboard_cache` - Cached dashboard data

---

## VIEWS & REPORTING

### V1-V16. Database Views

**View-Based Analytics (No RLS):**

1. **v_farmer_overview** - Farmer summary
2. **v_farmer_land_summary** - Land aggregates
3. **v_active_crop_cycles** - Current crops
4. **v_machine_catalog** - Searchable machines
5. **v_booking_summary** - Booking analytics
6. **v_product_catalog** - Product search
7. **v_order_summary** - Order analytics
8. **v_cart_detail** - Cart contents
9. **v_wallet_overview** - Wallet summary
10. **v_lead_pipeline** - Lead funnel
11. **v_field_agent_activity** - Agent activity
12. **v_organic_catalog** - Organic products
13. **v_organic_order_summary** - Organic orders

---

## RELATIONSHIPS & FOREIGN KEYS

### Core Relationship Map

```
users (1) ──→ (M) user_profiles
      ├─→ (1) farmers
      ├─→ (1) operators
      ├─→ (1) field_agents
      ├─→ (1) telecallers
      ├─→ (1) wallets
      └─→ (M) notifications

farmers (1) ──→ (M) lands
        ├─→ (M) crop_cycles
        ├─→ (M) bookings (as renter)
        ├─→ (M) machines (as owner)
        └─→ (M) leads (potential customers)

machines (1) ──→ (M) bookings (from farmer)
        ├─→ (M) pricing_rules
        ├─→ (M) availability
        ├─→ (M) gps_locations
        └─→ (M) machine_reviews

bookings (1) ──→ (M) booking_payments
        ├─→ (M) booking_status
        ├─→ (M) gps_locations
        └─→ (1) invoices

orders (1) ──→ (M) order_items
       ├─→ (M) tracking
       └─→ (1) invoices

wallets (1) ──→ (M) wallet_transactions
        ├─→ (M) cashback
        └─→ (M) withdraw_requests

leads (M) ──→ (M) call_logs
     ├─→ (M) followups
     └─→ (1) lead_status / lead_source
```

---

## RLS POLICIES

### Policy Types

1. **Owner-Based** (`*_own_all`) - User/farmer owns data
2. **Admin-Only** (`*_admin`) - Admin-only access
3. **Public Read** (`*_read`) - Public read, auth write
4. **Selective** (`*_access`) - Custom logic

### Policy Examples

**Farmer Profile (Owner-Based):**
```sql
-- Allow farmers to see/edit own profile
CREATE POLICY "farmer_profiles_own_all" ON farmer_profiles
FOR ALL USING (auth.uid() = farmer_id);

-- Allow admins to see all
CREATE POLICY "farmer_profiles_admin" ON farmer_profiles
FOR ALL USING (is_admin(auth.uid()));
```

**Bookings (Multi-party):**
```sql
-- Renters see own bookings
CREATE POLICY "bookings_renter" ON bookings
FOR SELECT USING (auth.uid() = renter_id);

-- Owners see own machines' bookings
CREATE POLICY "bookings_owner" ON bookings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM machines 
    WHERE machines.id = bookings.machine_id 
    AND machines.owner_id = (
      SELECT farmer_id FROM farmers 
      WHERE farmers.user_id = auth.uid()
    )
  )
);
```

---

## INDEXES & PERFORMANCE

### Index Strategy

**Primary Indexes (UNIQUE):**
- All primary keys
- Email, phone, codes where applicable
- Natural business keys

**Foreign Key Indexes:**
- All FK columns
- Composite FKs in junction tables

**Search Indexes:**
- `name`, `slug`, `title` (LIKE queries)
- Category/type columns (filtering)
- Status columns (filtering)

**Temporal Indexes:**
- `created_at` (date-based queries)
- `updated_at` (change tracking)
- `scheduled_at` (future events)

**Composite Indexes:**
- `(user_id, created_at)` - User's recent activity
- `(farm_id, status)` - Status filtering by user
- `(booking_id, status, created_at)` - State change history

**Geospatial Indexes:**
- `(latitude, longitude)` - Location-based queries

**Full-Text Search:**
- Product names, descriptions
- Lead notes, farmer names

### Optimization Rules

1. **Pagination:** Always use LIMIT/OFFSET with created_at sort
2. **Soft Deletes:** Always filter `deleted_at IS NULL`
3. **Caching:** Dashboard data cached 1 hour
4. **Partitioning:** No time-based partitioning (table size < 1GB)
5. **Queries:** Max 10s timeout, explain all queries > 1s

---

## STORAGE BUCKETS

### 6 Supabase Storage Buckets

| Bucket | Path | Public | Purpose | Retention |
|--------|------|--------|---------|-----------|
| avatars | /users/{user_id}/ | Yes | Profile pictures | Forever |
| farm-documents | /farmers/{farmer_id}/ | No | Land certificates, etc. | Forever |
| crop-images | /farms/{farm_id}/ | Yes | Crop photos | Forever |
| agricultural-files | /documents/ | No | PDFs, reports | 5 years |
| machine-uploads | /machines/{machine_id}/ | Yes | Machine images | Forever |
| organic-certificates | /farms/{farm_id}/ | No | Organic certs | 5 years |

### Storage Access Rules

```
avatars/            - Public read, user write own
farm-documents/     - Private, owner read
crop-images/        - Public read, owner write
agricultural-files/ - Private, admin read
machine-uploads/    - Public read, owner write
organic-certificates/ - Private, owner/admin read
```

---

## DATABASE GROWTH PROJECTIONS

### Year 1 Estimates

| Table | Rows | Growth | Notes |
|-------|------|--------|-------|
| users | 50K | +200/day | 365 days |
| farmers | 30K | +100/day | Active farmers |
| bookings | 100K | +300/day | 10+ bookings/farm |
| products | 5K | +20/day | Marketplace catalog |
| orders | 200K | +500/day | High marketplace activity |
| notifications | 5M | +15K/day | Many notifications |
| transactions | 300K | +1K/day | Wallet activity |

---

## BACKUP & RECOVERY

**Backup Strategy:**
- Daily backups (30-day retention)
- Point-in-time recovery (7 days)
- Monthly snapshots (12-month retention)
- Disaster recovery RTO: 4 hours, RPO: 1 hour

---

## COMPLIANCE & SECURITY

**Data Protection:**
- PII encrypted (Aadhaar, PAN, bank account)
- Password hashing (Supabase Auth)
- RLS on 139/147 tables (95% coverage)
- Audit logging on sensitive operations
- 2FA support with MFA tables

---

## FINAL STATS

```
Total Database Objects: 400+
├─ Tables: 131
├─ Views: 16
├─ Indexes: 200+
├─ RLS Policies: 250+
├─ Foreign Keys: 300+
├─ Storage Buckets: 6
└─ Estimated DB Size: 2-5 GB (Year 1)
```

---

**Documentation Version:** 1.0  
**Last Updated:** January 2025  
**Next Review:** Quarterly  
**Maintained By:** SmartFarmin Technologies Pvt. Ltd.

