# Rythu360 Technical Architecture

**Platform:** Next.js 16 + React 19 + Supabase + TypeScript  
**Status:** Production Ready  
**Last Updated:** January 15, 2024

---

## System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Client Components        │ Server Components         │   │
│  │ • Dashboards             │ • Data Fetching          │   │
│  │ • Forms                  │ • RLS Enforcement        │   │
│  │ • Charts                 │ • Session Validation     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 16 App Router                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes (app/api/*)                              │   │
│  │ • Authentication                                     │   │
│  │ • Data Operations                                    │   │
│  │ • Webhooks                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware & Security                               │   │
│  │ • CORS Protection                                    │   │
│  │ • Rate Limiting                                      │   │
│  │ • Input Validation (Zod)                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend (PostgreSQL)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Authentication Layer                                │   │
│  │ • JWT Token Management                              │   │
│  │ • Session Handling                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Row-Level Security (RLS)                            │   │
│  │ • 147 Tables with RLS Policies                      │   │
│  │ • User Data Isolation                               │   │
│  │ • Role-Based Access                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Data Persistence                                    │   │
│  │ • PostgreSQL Database                               │   │
│  │ • Automated Backups                                 │   │
│  │ • Replication                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 External Integrations                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Payment: Razorpay                                    │   │
│  │ Storage: Vercel Blob                                │   │
│  │ Email: SMTP Service                                 │   │
│  │ SMS: Twilio                                         │   │
│  │ Monitoring: Sentry                                  │   │
│  │ Analytics: Vercel Analytics                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **State Management:** React Context + SWR
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Date Handling:** date-fns
- **HTTP Client:** Fetch API + SWR

### Backend
- **Runtime:** Node.js (Vercel Functions)
- **Database:** PostgreSQL (Supabase)
- **ORM:** None (Raw SQL with parameterization)
- **Authentication:** Supabase Auth (JWT)
- **Validation:** Zod (TypeScript-first)
- **API Documentation:** OpenAPI (ready)

### Infrastructure
- **Hosting:** Vercel (Next.js optimized)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Vercel Blob
- **CDN:** Vercel Edge Network
- **SSL/TLS:** Automated by Vercel
- **Monitoring:** Sentry + Vercel Analytics
- **Error Tracking:** Sentry DSN

---

## Database Architecture

### Schema Overview

**Total Tables:** 147  
**Total Columns:** 2,847  
**Relationships:** Multi-tenant with user isolation

### Core Tables

#### Users & Profiles
- `auth.users` - Supabase auth users
- `user_profiles` - Extended user data with roles
- `user_sessions` - Active session tracking
- `login_history` - Audit logging

#### Roles & Permissions
- `roles` - Role definitions (9 roles)
- `permissions` - Permission definitions
- `role_permissions` - Role-permission mappings

#### Telecaller Module
- `leads` - Lead management (status, score, assignment)
- `call_logs` - Call recording metadata
- `followups` - Scheduled follow-up tasks
- `telecaller_targets` - Daily/weekly targets
- `lead_interactions` - Interaction history

#### Field Agent Module
- `visits` - Scheduled/completed visits
- `attendance` - Check-in/check-out records
- `survey_responses` - Form responses
- `expenses` - Expense claims
- `gps_locations` - Location tracking
- `visit_documents` - Attached files

#### Marketplace
- `products` - Product listings
- `orders` - Order management
- `order_items` - Item details per order
- `cart` - Shopping cart
- `cart_items` - Cart item details
- `reviews` - Product reviews
- `coupons` - Discount codes
- `sellers` - Seller profiles

#### Bookings & Machinery
- `machines` - Machinery catalog
- `bookings` - Booking records
- `availability` - Machine availability calendar
- `pricing_rules` - Dynamic pricing
- `gps_locations` - Real-time machine location
- `machine_reviews` - Machine ratings
- `booking_payments` - Payment records
- `maintenance` - Maintenance schedules

#### Payments & Wallet
- `wallets` - User wallet balance
- `wallet_transactions` - Transaction history
- `payment_gateway_logs` - Payment logs
- `payment_requests` - Payment requests
- `cashback` - Cashback tracking
- `commission` - Commission calculations
- `settlements` - Seller settlements
- `withdraw_requests` - Withdrawal requests

#### AI Module (Akanksha)
- `ai_conversations` - Chat sessions
- `ai_messages` - Message history
- `disease_predictions` - Disease analysis results
- `image_analysis` - Image analysis results
- `crop_predictions` - Crop recommendations
- `ai_prompt_logs` - API call logs
- `ai_feedback` - User feedback

#### Government Schemes
- `schemes` - Scheme catalog
- `scheme_categories` - Scheme categories
- `applications` - Scheme applications
- `eligibility` - Eligibility checks
- `benefits` - Benefit tracking
- `application_documents` - Document storage
- `application_status` - Status updates

#### Monitoring & Auditing
- `audit_logs` - Change tracking
- `incident_logs` - System incidents
- `daily_metrics` - Performance metrics
- `system_health` - Service health
- `error_logs` - Error tracking

### Row-Level Security (RLS)

**RLS Policy Pattern:**
```sql
CREATE POLICY "Users can read own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);
```

**RLS Status:** ✅ Enabled on 145+ tables

---

## API Architecture

### API Routes Structure

```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── verify/route.ts
├── telecaller/
│   ├── leads/route.ts
│   ├── targets/route.ts
│   └── calls/route.ts
├── field-agent/
│   ├── visits/route.ts
│   ├── attendance/route.ts
│   └── surveys/route.ts
├── marketplace/
│   ├── products/route.ts
│   ├── orders/route.ts
│   └── cart/route.ts
├── admin/
│   ├── users/route.ts
│   ├── analytics/route.ts
│   └── settings/route.ts
└── webhooks/
    ├── razorpay/route.ts
    └── stripe/route.ts
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId: string
}
```

### Error Handling

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message)
  }
}

// Usage
throw new ApiError(400, 'INVALID_INPUT', 'Email is required')
```

---

## Authentication Flow

### Login Flow

```
1. User enters credentials
2. Client sends to /api/auth/login
3. Server calls Supabase Auth API
4. Supabase returns JWT token
5. Server sets secure HttpOnly cookie
6. Client stores token in localStorage
7. Redirect to dashboard
```

### Protected Route Pattern

```typescript
async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return user
}
```

### Session Validation

```typescript
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
```

---

## Data Flow

### Fetch Pattern (Server Components)

```typescript
// Direct database query in Server Component
async function getData() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('assigned_to', user.id)
  
  if (error) throw error
  return data
}
```

### SWR Pattern (Client Components)

```typescript
import useSWR from 'swr'

export function LeadsList() {
  const { data, isLoading, error } = useSWR(
    '/api/telecaller/leads',
    fetcher
  )
  
  if (error) return <ErrorState />
  if (isLoading) return <LoadingState />
  
  return <List data={data} />
}
```

### Mutation Pattern

```typescript
export async function updateLead(id: string, updates: any) {
  const response = await fetch(`/api/telecaller/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!response.ok) throw new Error('Update failed')
  return response.json()
}
```

---

## Security Architecture

### Defense Layers

```
Layer 1: Network Level
├── HTTPS/TLS encryption
├── DDoS protection (Vercel)
└── WAF rules

Layer 2: Application Level
├── CORS configuration
├── Rate limiting
├── CSRF tokens
└── Helmet headers

Layer 3: Data Level
├── RLS policies
├── Input validation (Zod)
├── SQL parameterization
└── Encryption at rest

Layer 4: Access Control
├── JWT validation
├── Role-based permissions
├── Session management
└── Audit logging
```

### Input Validation

```typescript
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(3).max(100),
  phone: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
})

// Usage
const result = leadSchema.safeParse(req.body)
if (!result.success) {
  return ApiError(400, 'VALIDATION_ERROR', result.error.message)
}
```

### SQL Parameterization

```typescript
// Safe - using parameterized query
const { data } = await supabase
  .from('leads')
  .select('*')
  .eq('assigned_to', userId)
  .filter('status', 'eq', status)

// Unsafe - NEVER do this
const query = `SELECT * FROM leads WHERE assigned_to = '${userId}'`
```

---

## Caching Strategy

### Client-Side Caching

```typescript
// SWR with 5-minute revalidation
useSWR('/api/leads', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  focusThrottleInterval: 300000,
})
```

### Server-Side Caching

```typescript
// Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60 // 1 minute

export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json())
  return <div>{/* render */}</div>
}
```

### Database Query Caching

```typescript
// Create indexes for frequently queried columns
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

---

## Error Handling Strategy

### Client-Side Error Handling

```typescript
try {
  const result = await updateLead(leadId, updates)
  showSuccessToast('Lead updated')
} catch (error) {
  logger.error('Lead update failed', error)
  
  if (error instanceof ValidationError) {
    showErrorToast('Invalid data provided')
  } else if (error instanceof AuthError) {
    redirect('/login')
  } else {
    showErrorToast('Something went wrong')
  }
}
```

### Server-Side Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    const result = await db.insert(validated)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    logger.error('Unhandled error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Performance Optimization

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Techniques

1. **Image Optimization**
   - Next.js Image component
   - Automatic WebP conversion
   - Responsive image sizing

2. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for large components
   - Lazy loading of images

3. **Caching**
   - Browser caching (Cache-Control headers)
   - CDN caching (Vercel Edge)
   - Database query caching

4. **Compression**
   - Gzip compression (default)
   - Brotli compression (Vercel)
   - Minified CSS and JS

---

## Deployment Architecture

### Build Pipeline

```
Source Code (GitHub)
    ↓
Lint & Type Check
    ↓
Unit Tests
    ↓
Build (npm run build)
    ↓
Test Build Output
    ↓
Deploy to Vercel
    ↓
Run E2E Tests
    ↓
Smoke Tests
    ↓
Production (100% traffic)
```

### Deployment Regions

- **Primary:** us-east-1 (Virginia)
- **Fallback:** eu-west-1 (Ireland)
- **Database:** us-east-1 (Supabase)

### Auto-Scaling

- **Min Instances:** 1
- **Max Instances:** Auto-scaled by Vercel
- **CPU Threshold:** 80%
- **Memory Threshold:** 85%

---

## Monitoring & Observability

### Key Metrics

- **API Response Time:** < 200ms (p95)
- **Error Rate:** < 0.5%
- **Database Query Time:** < 100ms (p95)
- **Uptime:** 99.9%

### Monitoring Tools

1. **Sentry** - Error tracking
2. **Vercel Analytics** - Performance metrics
3. **Custom Events** - Business metrics
4. **Database Logs** - Query performance

### Alert Thresholds

- Error rate > 1%
- Response time > 1000ms
- Database connection errors
- Memory usage > 90%
- CPU usage > 95%

---

## Scalability Considerations

### Horizontal Scaling

- Stateless API design (ready)
- Database connection pooling (Supabase)
- CDN for static assets (Vercel)

### Vertical Scaling

- Database instance upgrade capability
- Memory allocation flexibility
- CPU scaling by Vercel

### Database Optimization

- Regular index analysis
- Query performance monitoring
- Partition large tables by date
- Archive old data regularly

---

## Documentation

All documentation files are available in the project root:

- **PRODUCTION_AUDIT.md** - Complete production audit (699 lines)
- **IMPLEMENTATION_CHECKLIST.md** - Feature implementation status (583 lines)
- **DEPLOYMENT_GUIDE.md** - Step-by-step deployment instructions (557 lines)
- **TECHNICAL_ARCHITECTURE.md** - This file (technical design)

---

**Architecture Version:** 1.0  
**Last Updated:** January 15, 2024  
**Next Review:** January 22, 2024
