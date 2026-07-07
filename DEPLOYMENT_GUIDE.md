# Rythu360 Deployment Guide

**Status:** ✅ Production Ready  
**Build Status:** ✅ SUCCESS - 0 errors, 0 warnings  
**Last Updated:** January 15, 2024

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Vercel account with active project
- Supabase project configured
- Environment variables set up

### Build & Test
```bash
# Install dependencies
npm install

# Run type check
npx tsc --noEmit

# Run linter
npx eslint . --fix

# Build for production
npm run build

# Start dev server
npm run dev
```

---

## Production Environment Setup

### 1. Environment Variables

Create `.env.production.local` with all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# API Configuration
NEXT_PUBLIC_API_URL=https://api.smartfarmin.dev
API_TIMEOUT=30000

# Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Encryption
ENCRYPTION_KEY=your-256-bit-key

# File Storage
NEXT_PUBLIC_BLOB_STORAGE_URL=your-blob-url

# Email Service
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Optional - for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@domain.iam.gserviceaccount.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-ga-id

# Feature Flags
FEATURE_FLAGS_SECRET=your-feature-flags-secret
```

### 2. Supabase Configuration

#### Enable Row-Level Security (RLS)

All tables should have RLS enabled:

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ... repeat for all 147 tables
```

#### Create RLS Policies

Example for farmers accessing their own data:

```sql
CREATE POLICY "Users can read own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);
```

#### Enable Backups

```bash
# Via Supabase dashboard:
# 1. Project Settings > Backups
# 2. Enable automated daily backups
# 3. Set retention to 30 days
```

### 3. Vercel Deployment

#### Step 1: Connect Repository

```bash
vercel link --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

#### Step 2: Configure Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

#### Step 3: Set Production Environment Variables

```bash
vercel env pull .env.production.local \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

Then add each environment variable:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

#### Step 4: Configure Domains

```bash
# Add production domain
vercel domains add smartfarmin.dev \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn

# Add API domain
vercel domains add api.smartfarmin.dev \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

#### Step 5: Enable HTTPS & SSL

```bash
vercel ssl add smartfarmin.dev \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

#### Step 6: Deploy

```bash
npm run build
vercel deploy --prod \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn
```

---

## Database Setup

### 1. Create Database in Supabase

1. Go to Supabase Dashboard
2. Create new project in production region
3. Wait for database initialization
4. Get connection credentials

### 2. Run Migrations

```bash
# Apply all migrations
supabase db push

# Or run specific migration
supabase db push --version=001_initial_schema.sql
```

### 3. Seed Initial Data

```bash
# Run seed scripts
npm run db:seed

# Verify data
supabase query "SELECT COUNT(*) FROM users;"
```

### 4. Create Indexes

```sql
-- Create indexes for common queries
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status_id);
CREATE INDEX idx_visits_agent_id ON visits(agent_id);
CREATE INDEX idx_visits_scheduled ON visits(scheduled_at);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_state ON bookings(booking_state);
```

---

## API Configuration

### 1. Rate Limiting

Configure rate limiting per route:

```typescript
// lib/rate-limit.ts
export const createRateLimiter = (
  maxRequests: number,
  windowSeconds: number
) => {
  // Implementation using Upstash Redis
}

// Usage in route
const limiter = createRateLimiter(100, 60)
await limiter.check()
```

### 2. CORS Configuration

```typescript
// middleware.ts
export const config = {
  matcher: ['/api/:path*'],
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', 'https://smartfarmin.dev')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

### 3. API Key Management

```typescript
// lib/api-keys.ts
export async function validateApiKey(key: string) {
  const hash = hashApiKey(key)
  const { data } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', hash)
    .single()
  
  return data
}
```

---

## Payment Integration

### Razorpay Setup

#### 1. Get Credentials

1. Log in to Razorpay Dashboard
2. Go to Settings > API Keys
3. Copy Key ID and Key Secret

#### 2. Configure in Vercel

```bash
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
```

#### 3. Test Integration

```bash
npm run test:payments
```

#### 4. Enable Webhooks

```typescript
// pages/api/webhook/razorpay.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, headers } = req
  
  const signature = headers['x-razorpay-signature']
  const valid = validateRazorpaySignature(body, signature)
  
  if (!valid) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  await handlePaymentWebhook(body)
  res.status(200).json({ success: true })
}
```

---

## Monitoring & Alerts

### 1. Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 2. Performance Monitoring

```typescript
// lib/monitoring.ts
export async function captureMetric(
  name: string,
  value: number,
  tags?: Record<string, string>
) {
  await fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, value, tags })
  })
}
```

### 3. Set Up Alerts

Configure in Vercel Dashboard:
- Error rate > 1%
- Response time > 1s
- Database connection errors
- Payment processing failures

---

## Security Checklist

### Pre-Deployment
- [ ] All API keys in environment variables
- [ ] No secrets in code or git history
- [ ] SSL/TLS certificates configured
- [ ] CORS headers properly set
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Security headers configured

### Post-Deployment
- [ ] HTTPS enforced for all requests
- [ ] Security headers verified
- [ ] SSL certificate validity checked
- [ ] Rate limiting tested
- [ ] API authentication verified
- [ ] Database access controls verified
- [ ] Backup system working
- [ ] Monitoring alerts active

---

## Rollout Strategy

### Phase 1: Staging (24 hours)
```bash
# Deploy to staging
vercel deploy --scope=team_4NXYzDhmST9KXofKB3OD5Qtn

# Run integration tests
npm run test:integration

# Monitor for errors
# Check: error logs, API response times, database performance
```

### Phase 2: Canary (24-48 hours)
```bash
# Deploy to production with 5% traffic
vercel deploy --prod \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn \
  --env=canary

# Monitor metrics closely
# Check: error rates, latency, user feedback
```

### Phase 3: Full Rollout
```bash
# Increase to 100% traffic
vercel deploy --prod \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn \
  --env=production

# Monitor continuously
# Check: all metrics, user feedback, system health
```

---

## Rollback Procedure

If issues occur:

```bash
# Quick rollback to previous version
vercel rollback --scope=team_4NXYzDhmST9KXofKB3OD5Qtn

# Or redeploy specific version
vercel deploy --prod \
  --scope=team_4NXYzDhmST9KXofKB3OD5Qtn \
  --target=production \
  --prod
```

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
npm install --legacy-peer-deps
npm run build
```

### Database Connection Issues

```bash
# Verify connection
supabase status

# Check connection string
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_KEY | head -c 20
```

### API Errors

```bash
# Check API logs
vercel logs <project-id> --scope=team_4NXYzDhmST9KXofKB3OD5Qtn

# Check Sentry errors
# Visit sentry.io dashboard
```

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check database query performance
supabase db profile

# Review Vercel analytics
# Visit vercel.com/analytics
```

---

## Maintenance Tasks

### Daily
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Review user feedback
- [ ] Verify backup completion

### Weekly
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Optimize database queries
- [ ] Check SSL certificate validity

### Monthly
- [ ] Database maintenance
- [ ] Capacity planning
- [ ] Security audit
- [ ] Performance review

---

## Support & Escalation

**For Deployment Issues:**
- Team: DevOps Team
- Email: devops@smartfarmin.dev
- Slack: #deployment-alerts

**For Security Issues:**
- Team: Security Team
- Email: security@smartfarmin.dev
- Phone: +91-XXXX-XXXX-XX (Emergency)

**For Performance Issues:**
- Team: Infrastructure Team
- Email: infra@smartfarmin.dev
- Slack: #performance-alerts

---

## Sign-Off

**Deployment Approved By:**
- Project Lead: _________________
- Tech Lead: _________________
- DevOps Lead: _________________

**Date:** _______________

**Deployment Time:** _______________

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2024  
**Next Review Date:** January 22, 2024
