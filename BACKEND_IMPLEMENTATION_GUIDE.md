# SmartFarmin Backend Implementation Guide

## Overview
SmartFarmin has **147 fully-configured Supabase tables** with RLS policies, 60+ lib modules with business logic, but **ZERO API routes**. This guide provides the implementation roadmap.

## Status Summary
- **Database**: 100% complete (147 tables, RLS enabled)
- **Authentication**: 40% (UI exists, Supabase Auth not integrated)
- **API Routes**: 0% (no /api/* handlers)
- **CRUD Operations**: 0% (business logic exists but no endpoints)
- **Notifications**: 40% (templates exist, no delivery)
- **Payments**: 40% (Razorpay SDK included, webhooks missing)
- **Dashboards**: 20% (UI exists with mock data)

---

## Critical Implementation Path (Priority Order)

### PHASE 1: Authentication (Week 1)
**Must complete before any other work**

1. **Supabase Auth Integration**
   ```typescript
   // lib/supabase/auth.ts - Create this file
   import { createClient } from '@supabase/supabase-js'
   
   export async function registerUser(email: string, password: string, userType: string) {
     const { data, error } = await supabase.auth.signUpWithPassword({
       email,
       password,
       options: {
         data: { user_type: userType }
       }
     })
     if (error) throw error
     return data
   }
   
   export async function loginUser(email: string, password: string) {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password
     })
     if (error) throw error
     return data
   }
   ```

2. **Session Management**
   - Use Supabase Auth session hooks
   - Store user roles in `user_profiles` table
   - Implement role checks in all operations

3. **Password Reset**
   - Use Supabase Auth built-in reset flow
   - Send email via Supabase Auth (no additional setup needed)

**Related Tables**: `user_profiles`, `roles`, `role_permissions`

---

### PHASE 2: API Route Structure (Week 1-2)
**Create foundations for all CRUD operations**

1. **Base API Route Handler**
   ```typescript
   // app/api/[resource]/route.ts - Template
   import { createClient } from '@supabase/supabase-js'
   import { NextResponse } from 'next/server'
   
   export async function GET(request: Request) {
     const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
     )
     
     try {
       const { data, error } = await supabase
         .from('table_name')
         .select('*')
       
       if (error) throw error
       return NextResponse.json(data)
     } catch (err: any) {
       return NextResponse.json({ error: err.message }, { status: 400 })
     }
   }
   ```

2. **Required Routes** (Priority Order):
   - `/api/auth/*` - Login, register, logout
   - `/api/farmers/*` - CRUD for farmers
   - `/api/bookings/*` - CRUD for machinery bookings
   - `/api/orders/*` - CRUD for marketplace orders
   - `/api/notifications/*` - Create/read notifications
   - `/api/wallet/*` - Wallet transactions
   - `/api/machinery/*` - Machinery listings
   - `/api/schemes/*` - Government schemes
   - And 20+ more for all entities

**Key Files to Create**:
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/farmers/route.ts`
- `app/api/bookings/route.ts`
- (And 30+ more as per schema)

---

### PHASE 3: CRUD Operations for Each Entity (Weeks 2-4)

**High Priority Entities** (affect user experience most):
1. **Farmers** - User core data
2. **Bookings** - Core business flow
3. **Orders** - Revenue stream
4. **Machinery** - Marketplace inventory
5. **Wallet** - Payments
6. **Notifications** - User engagement
7. **Products** - Marketplace inventory
8. **Operators** - Service providers

**Medium Priority**:
9-20. Telecallers, Field Agents, Drone Services, Schemes, etc.

**Low Priority**:
21-40. Admin functions, reports, analytics

**Per-Entity Implementation**:
```typescript
// Example: Farmers CRUD
// POST /api/farmers - Create
// GET /api/farmers - List
// GET /api/farmers/[id] - Read
// PUT /api/farmers/[id] - Update
// DELETE /api/farmers/[id] - Delete
```

---

### PHASE 4: Authentication & Authorization (Week 2, parallel)

**Role-Based Access Control (8 Roles)**:
1. Founder - Full platform access
2. Admin - Platform management
3. Farmer - Own data + marketplace
4. Operator - Own machinery + bookings
5. Telecaller - Lead management
6. Field Agent - Field operations
7. Drone Operator - Drone services
8. Machinery Owner - Machinery management

**Implementation**:
```typescript
// Middleware to check roles
import { getSession } from '@supabase/auth-helpers-nextjs'

export async function checkRole(request: Request, requiredRole: string) {
  const session = await getSession()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role_id')
    .eq('id', session.user.id)
    .single()
  
  const { data: role } = await supabase
    .from('roles')
    .select('name')
    .eq('id', profile.role_id)
    .single()
  
  if (role.name !== requiredRole) {
    throw new Error('Unauthorized')
  }
}
```

**Related Tables**: `roles`, `role_permissions`, `user_profiles`

---

### PHASE 5: Real Data Integration (Weeks 3-4)

Replace all mock data in dashboards:

1. **Executive Dashboard**
   - Replace `KPIS` with real queries:
     ```sql
     SELECT COUNT(*) as farmer_count FROM farmers WHERE created_at >= NOW() - INTERVAL '1 month'
     SELECT COUNT(*) as booking_count FROM bookings WHERE created_at >= NOW() - INTERVAL '1 month'
     SELECT SUM(total_amount) as revenue FROM bookings WHERE completed_at >= NOW() - INTERVAL '1 month'
     ```

2. **Farmer Dashboard**
   - Query actual user crops from `crop_cycles`
   - Query booking history
   - Query weather data
   - Query wallet balance

3. **Operator Dashboard**
   - Query available bookings
   - Query earnings from `wallet_transactions`
   - Query maintenance logs
   - Query availability schedule

**Files to Update**:
- `lib/rythu360/executive.ts` - Replace mock KPIS queries
- `components/rythu360/executive-dashboard.tsx` - Replace hardcoded data
- `lib/rythu360/farmer.ts` - Real farmer data
- `lib/rythu360/operator.ts` - Real operator data
- (And similar for all dashboard types)

---

### PHASE 6: Payments Integration (Week 3)

**Razorpay Setup** (SDK already included):

1. **Create Payment Order**
   ```typescript
   // POST /api/payments/create-order
   const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID!,
     key_secret: process.env.RAZORPAY_KEY_SECRET!
   })
   
   const order = await razorpay.orders.create({
     amount: totalAmount * 100, // in paise
     currency: 'INR',
     receipt: bookingId
   })
   
   // Save to payment_requests table
   await supabase
     .from('payment_requests')
     .insert({
       gateway_order_id: order.id,
       amount: totalAmount,
       reference_id: bookingId,
       reference_type: 'booking'
     })
   ```

2. **Handle Payment Webhook**
   ```typescript
   // POST /api/webhooks/razorpay
   // Verify signature and update payment status
   ```

3. **Update Order Status**
   - On payment success → update bookings/orders table
   - Create wallet transactions
   - Send notifications

**Related Tables**: `payment_requests`, `payment_gateway_logs`, `bookings`, `orders`, `wallet_transactions`

---

### PHASE 7: Notifications Backend (Week 2-3)

1. **In-App Notifications** (Ready to use):
   ```typescript
   // POST /api/notifications
   await supabase
     .from('notifications')
     .insert({
       user_id: userId,
       title,
       body,
       category: 'booking',
       channel: 'in-app',
       status: 'delivered'
     })
   ```

2. **Email Notifications** (Requires provider):
   - Use Resend, SendGrid, or similar
   - Template from `notification_templates` table
   - Log to `email_logs` table

3. **SMS Notifications** (Placeholder):
   - Template framework in place
   - Needs Twilio/AWS SNS integration
   - Log to `sms_logs` table

4. **WhatsApp** (Placeholder):
   - Same as SMS
   - Use Meta Business API or similar

**Related Tables**: `notifications`, `notification_templates`, `email_logs`, `sms_logs`, `notification_logs`

---

### PHASE 8: Analytics & Reporting (Week 4)

1. **Dashboard Caching**
   - Use `dashboard_cache` table
   - Cache computed metrics
   - Invalidate on data changes

2. **Metrics Collection**
   - Populate `daily_metrics` and `monthly_metrics` tables
   - Run batch jobs to aggregate data
   - Use for dashboard displays

3. **Business Reports**
   - `business_reports` table ready
   - Generate via scheduled jobs
   - Email to stakeholders

---

## Implementation Checklist

### Phase 1: Authentication (Week 1)
- [ ] Create `lib/supabase/auth.ts`
- [ ] Implement signup flow
- [ ] Implement login flow
- [ ] Implement logout flow
- [ ] Implement password reset
- [ ] Test authentication end-to-end

### Phase 2: API Routes (Weeks 1-2)
- [ ] Create base route handler template
- [ ] Implement `/api/auth/*` routes
- [ ] Test auth routes
- [ ] Create error handling middleware
- [ ] Create validation middleware
- [ ] Create RLS middleware

### Phase 3: CRUD Operations (Weeks 2-4)
- [ ] Farmers CRUD (8 entity types)
- [ ] Bookings CRUD
- [ ] Orders CRUD
- [ ] Machinery CRUD
- [ ] Operators CRUD
- [ ] Products CRUD
- [ ] Wallet CRUD
- [ ] Notifications CRUD
- [ ] Schemes CRUD
- [ ] (30+ more entities)

### Phase 4: Authorization (Week 2)
- [ ] Implement role checking middleware
- [ ] Test role-based access
- [ ] Verify RLS policies work
- [ ] Document role requirements per endpoint

### Phase 5: Real Data (Weeks 3-4)
- [ ] Update Executive Dashboard queries
- [ ] Update Farmer Dashboard queries
- [ ] Update Operator Dashboard queries
- [ ] Update Telecaller Dashboard queries
- [ ] Update Field Agent Dashboard queries
- [ ] Update Analytics Dashboard
- [ ] Test all dashboards with real data

### Phase 6: Payments (Week 3)
- [ ] Create Razorpay order endpoint
- [ ] Create webhook handler
- [ ] Update booking status on payment
- [ ] Create wallet transaction
- [ ] Send payment confirmation
- [ ] Test full booking + payment flow

### Phase 7: Notifications (Weeks 2-3)
- [ ] Implement in-app notification creation
- [ ] Integrate email provider
- [ ] Implement email sending
- [ ] Setup SMS (optional)
- [ ] Setup WhatsApp (optional)
- [ ] Test notification delivery

### Phase 8: Analytics (Week 4)
- [ ] Implement metrics collection
- [ ] Setup dashboard caching
- [ ] Create report generation
- [ ] Test analytics end-to-end

---

## Key Files Requiring Creation

**Total New Files**: ~50

### Authentication (3 files)
- `lib/supabase/auth.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`

### API Routes (35 files)
```
app/api/auth/*
app/api/farmers/*
app/api/operators/*
app/api/bookings/*
app/api/orders/*
app/api/machinery/*
app/api/products/*
app/api/wallet/*
app/api/notifications/*
app/api/schemes/*
app/api/payments/*
app/api/webhooks/*
(And more...)
```

### Middleware (3 files)
- `lib/middleware/auth.ts`
- `lib/middleware/validation.ts`
- `lib/middleware/errors.ts`

### Queries (3 files)
- `lib/supabase/queries.ts` - Core CRUD functions
- `lib/supabase/aggregations.ts` - Dashboard queries
- `lib/supabase/subscriptions.ts` - Real-time data

### Utilities (2 files)
- `lib/supabase/errors.ts`
- `lib/supabase/validators.ts`

---

## Estimated Effort

| Phase | Duration | Effort | Dependencies |
|-------|----------|--------|--------------|
| 1. Auth | 3-4 days | 40 hours | None |
| 2. API Routes | 5-7 days | 80 hours | Phase 1 |
| 3. CRUD (High) | 7-10 days | 120 hours | Phase 2 |
| 4. RBAC | 3-4 days | 40 hours | Phase 2 |
| 5. Real Data | 5-7 days | 60 hours | Phase 3 |
| 6. Payments | 3-4 days | 40 hours | Phase 2 |
| 7. Notifications | 4-5 days | 50 hours | Phase 2 |
| 8. Analytics | 3-4 days | 30 hours | Phase 5 |
| **TOTAL** | **6-8 weeks** | **460 hours** | Sequential |

---

## Critical Success Factors

1. **Database already perfect** - No migrations needed
2. **RLS policies already in place** - No security implementation needed
3. **Business logic (60% done)** - lib modules exist, just needs integration
4. **UI ready** - Just needs real data instead of mocks
5. **Supabase configured** - All env vars set, connection ready

---

## Remaining Configuration Required

**EXTERNAL INTEGRATIONS** (Not yet wired):
- [ ] Razorpay: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to .env
- [ ] Email Provider: Choose (Resend/SendGrid/AWS SES) and add credentials
- [ ] SMS Provider: Choose (Twilio/AWS SNS) and add credentials
- [ ] WhatsApp: Choose provider and add credentials
- [ ] Weather API: Configure IMD or OpenWeatherMap API
- [ ] Image Recognition: Configure AWS Rekognition or similar

---

## Next Immediate Step

**Start with Phase 1 (Authentication)**:
1. Create `lib/supabase/auth.ts`
2. Integrate Supabase Auth with existing UI
3. Test signup/login/logout flows
4. Verify JWT tokens working
5. Confirm RLS policies enforced

This unblocks all other phases.

---

**Report Generated**: January 7, 2024
**Database Status**: 100% Complete
**Backend Status**: 5% Complete (auth skeleton)
**Estimated Timeline to Production**: 6-8 weeks from Phase 1 start
