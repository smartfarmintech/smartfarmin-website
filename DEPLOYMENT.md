# RYTHU360 PRODUCTION DEPLOYMENT GUIDE

**Version:** 1.0  
**Last Updated:** January 2025  
**Environment:** Production (AWS/Vercel)  
**Maintainer:** SmartFarmin Technologies Pvt. Ltd.

---

## TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Configuration](#environment-variables-configuration)
3. [Supabase Setup](#supabase-setup)
4. [Database Migration Strategy](#database-migration-strategy)
5. [Razorpay Integration](#razorpay-integration)
6. [Storage Bucket Configuration](#storage-bucket-configuration)
7. [Email Provider Setup](#email-provider-setup)
8. [Domain Configuration](#domain-configuration)
9. [Vercel Deployment](#vercel-deployment)
10. [Monitoring & Analytics](#monitoring--analytics)
11. [Backup Strategy](#backup-strategy)
12. [Incident Management](#incident-management)
13. [Rollback Procedures](#rollback-procedures)
14. [Post-Deployment Verification](#post-deployment-verification)

---

## PRE-DEPLOYMENT CHECKLIST

### System Requirements
- [ ] Node.js 18.17+ installed
- [ ] PostgreSQL 14+ database provisioned
- [ ] SSL certificate obtained and valid
- [ ] DNS records configured
- [ ] Email provider account created
- [ ] Payment gateway account (Razorpay) created
- [ ] Backup infrastructure in place
- [ ] Monitoring tools configured

### Code Quality
- [ ] All TypeScript errors resolved (0 errors)
- [ ] ESLint checks passing
- [ ] Build succeeds in production mode
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks acceptable
- [ ] Documentation updated

### Infrastructure
- [ ] Load balancer configured
- [ ] CDN setup complete
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured
- [ ] Logging infrastructure ready
- [ ] DDoS protection enabled
- [ ] WAF (Web Application Firewall) configured

---

## ENVIRONMENT VARIABLES CONFIGURATION

### Supabase Configuration

```bash
# .env.production

# Supabase Project Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_ANON_KEY=your-anon-key-here

# PostgreSQL Configuration
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
POSTGRES_PRISMA_URL=postgresql://user:password@host:5432/database
POSTGRES_HOST=your-host.supabase.co
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password-here
```

### Payment Gateway Configuration

```bash
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-key-secret-here
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret-here

# Payment Settings
PAYMENT_CAPTURE_TIMEOUT=300000 # 5 minutes
PAYMENT_RETRY_ATTEMPTS=3
PAYMENT_RETRY_DELAY=5000 # 5 seconds
```

### Email Configuration

```bash
# Email Provider (SendGrid / AWS SES)
EMAIL_PROVIDER=sendgrid # or aws_ses
SENDGRID_API_KEY=your-api-key-here
SENDGRID_FROM_EMAIL=noreply@rythu360.com

# Or AWS SES
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@rythu360.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### SMS Configuration

```bash
# SMS Provider (Twilio / AWS SNS)
SMS_PROVIDER=twilio # or aws_sns
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_PHONE=+1234567890

# Or AWS SNS
AWS_SNS_REGION=us-east-1
```

### Application Configuration

```bash
# Security
BETTER_AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
JWT_EXPIRY=86400 # 24 hours
REFRESH_TOKEN_EXPIRY=604800 # 7 days
SESSION_TIMEOUT=1800000 # 30 minutes
RATE_LIMIT_WINDOW=15 # minutes
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_UPLOAD_SIZE=52428800 # 50MB in bytes
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# Storage
SUPABASE_STORAGE_BUCKET=agricultural-files

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.rythu360.com
API_RATE_LIMIT_ENABLED=true
API_REQUEST_TIMEOUT=30000 # 30 seconds

# Monitoring
SENTRY_DSN=your-sentry-dsn-here
SENTRY_ENVIRONMENT=production
LOG_LEVEL=info
ENABLE_PERFORMANCE_MONITORING=true

# Cache
CACHE_TTL=3600 # 1 hour
CACHE_MAX_SIZE=1000

# Feature Flags
FEATURE_REALTIME_ENABLED=true
FEATURE_AI_ENABLED=true
FEATURE_BULK_OPERATIONS_ENABLED=true
```

### Vercel Configuration

```bash
# .env.production (Vercel)
VERCEL_ENV=production
VERCEL_URL=https://rythu360.com
```

---

## SUPABASE SETUP

### 1. Project Initialization

```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Set production environment
supabase db remote set production
```

### 2. Database Schema Deployment

```bash
# Apply migrations
supabase db push

# Verify tables (147 tables should exist)
supabase db list-tables

# Check RLS policies
supabase db remote status
```

### 3. Storage Buckets Setup

```sql
-- Create storage buckets via Supabase SQL Editor

-- Agricultural documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('agricultural-files', 'agricultural-files', false);

-- Product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Machinery photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('machinery-photos', 'machinery-photos', true);

-- User avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true);

-- Government scheme documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('scheme-documents', 'scheme-documents', false);

-- Organic farm certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('organic-certificates', 'organic-certificates', false);
```

### 4. Enable Realtime

```bash
# Enable Realtime for tables
supabase realtime enable bookings
supabase realtime enable orders
supabase realtime enable wallet_transactions
supabase realtime enable notifications
supabase realtime enable gps_locations
```

### 5. RLS Policy Verification

```bash
# Verify all 147 tables have RLS enabled
supabase db remote show-rls-policies

# Check for any tables without policies
supabase db remote audit
```

### 6. Backup Configuration

```bash
# Enable daily backups
supabase db backup schedule --frequency daily --retention-days 30

# Enable point-in-time recovery
supabase db backup enable-pitr --retention-days 7
```

---

## DATABASE MIGRATION STRATEGY

### Pre-Migration

```bash
# 1. Create full backup
supabase db backup create --name "pre-production-deploy-$(date +%Y%m%d)"

# 2. Test migrations in staging
supabase db push --dry-run

# 3. Verify no conflicts
supabase db remote status
```

### Migration Execution (Zero-Downtime)

```bash
# 1. Run migrations with connection pooling
supabase db push --pooled-connections

# 2. Monitor migration progress
supabase db remote status --verbose

# 3. Verify data integrity
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

# Should return: 147 tables
```

### Post-Migration

```bash
# 1. Rebuild indexes
REINDEX INDEX CONCURRENTLY idx_bookings_machine_id;
REINDEX INDEX CONCURRENTLY idx_orders_buyer_id;
-- Run for all critical indexes

# 2. Analyze table statistics
ANALYZE;

# 3. Verify foreign key constraints
SELECT * FROM information_schema.referential_constraints;

# 4. Run health checks
SELECT pg_stat_statements_reset();
```

---

## RAZORPAY INTEGRATION

### 1. Account Setup

- [ ] Create Razorpay Business Account
- [ ] Complete KYC verification
- [ ] Add bank account for settlements
- [ ] Generate API keys (Key ID and Key Secret)
- [ ] Configure webhook endpoint

### 2. API Key Configuration

```bash
# Store securely in Vercel Secrets
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add RAZORPAY_WEBHOOK_SECRET
```

### 3. Webhook Setup

```bash
# Configure webhook in Razorpay Dashboard
URL: https://api.rythu360.com/api/payments/webhook
Method: POST
Auth: HMAC SHA256

# Events to enable:
- payment.authorized
- payment.captured
- payment.failed
- payment.refunded
- subscription.created
- subscription.paid
- subscription.cancelled
```

### 4. Testing

```bash
# Test payment creation endpoint
curl -X POST https://api.rythu360.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 10000,
    "currency": "INR",
    "description": "Test booking",
    "customer_notify": 1
  }'

# Verify webhook signature
# Use Razorpay test credentials to trigger test events
```

### 5. Settlement Configuration

- [ ] Verify bank account details
- [ ] Set settlement frequency (daily/weekly)
- [ ] Configure minimum settlement amount
- [ ] Enable automated settlements

---

## STORAGE BUCKET CONFIGURATION

### 1. Create Buckets

```typescript
// lib/storage/bucket-setup.ts
export async function setupStorageBuckets() {
  const supabase = createClient();
  
  const buckets = [
    { id: 'agricultural-files', public: false },
    { id: 'product-images', public: true },
    { id: 'machinery-photos', public: true },
    { id: 'user-avatars', public: true },
    { id: 'scheme-documents', public: false },
    { id: 'organic-certificates', public: false },
  ];

  for (const bucket of buckets) {
    await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: 52428800, // 50MB
    });
  }
}
```

### 2. Configure CORS

```bash
# Set CORS policy in Supabase Storage
CORS_ALLOWED_ORIGINS: https://rythu360.com,https://*.rythu360.com
CORS_ALLOWED_METHODS: GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS: Content-Type,Authorization
```

### 3. Configure Cache Headers

```sql
-- Configure CDN caching in storage
UPDATE storage.buckets 
SET cache_control = 'public, max-age=3600'
WHERE name IN ('product-images', 'machinery-photos', 'user-avatars');

UPDATE storage.buckets 
SET cache_control = 'private, max-age=1800'
WHERE name IN ('agricultural-files', 'scheme-documents', 'organic-certificates');
```

### 4. Setup Cleanup Jobs

```typescript
// Scheduled job to remove orphaned files every 24 hours
export async function cleanupOrphanedFiles() {
  // Delete files not referenced in database after 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  // Implement cleanup logic
}
```

---

## EMAIL PROVIDER SETUP

### SendGrid Configuration

```bash
# 1. Create SendGrid account at sendgrid.com
# 2. Verify sender domain
# 3. Generate API key

# 4. Store in Vercel
vercel env add SENDGRID_API_KEY

# 5. Configure email settings
EMAIL_PROVIDER=sendgrid
SENDGRID_FROM_EMAIL=noreply@rythu360.com
SENDGRID_FROM_NAME="Rythu360"
SENDGRID_REPLY_TO=support@rythu360.com
```

### AWS SES Configuration

```bash
# 1. Setup SES in AWS Console
# 2. Verify domain and sender email
# 3. Request production access (remove sandbox)

# 4. Create IAM user with SES permissions
# 5. Generate access keys

# 6. Store in Vercel
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_SES_REGION

# Email settings
EMAIL_PROVIDER=aws_ses
AWS_SES_FROM_EMAIL=noreply@rythu360.com
```

### Email Templates

```bash
# Create templates for:
1. Welcome email
2. Password reset
3. Email verification
4. Order confirmation
5. Booking confirmation
6. Payment receipt
7. Application status update
8. Scheme eligibility notification
9. Machinery availability alert
10. Notification digest
```

### Testing

```bash
# Test email delivery
curl -X POST https://api.rythu360.com/api/email/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email": "test@example.com"}'
```

---

## DOMAIN CONFIGURATION

### DNS Records

```
# A Records
@ → 76.76.19.0 (Vercel)
www → 76.76.19.0 (Vercel)
api → 76.76.19.0 (Vercel)

# CNAME Records (if using Vercel)
cname → cname.vercel-dns.com

# MX Records (for email)
@ → mx.sendgrid.net (if using SendGrid)
@ → inbound-smtp.us-east-1.amazonaws.com (if using AWS SES)

# TXT Records
@ → "v=spf1 include:sendgrid.net ~all"
default._domainkey → "v=DKIM1; k=rsa; p=YOUR_DKIM_KEY"
_acme-challenge → YOUR_SSL_VERIFICATION_TOKEN
```

### SSL Certificate

```bash
# Vercel handles SSL automatically
# Verify in Vercel Dashboard
# Settings → Domains → SSL/TLS

# For custom domain:
# 1. Add domain in Vercel
# 2. Update DNS records
# 3. Wait for verification
# 4. SSL certificate auto-issued (Let's Encrypt)
```

---

## VERCEL DEPLOYMENT

### 1. Connect Repository

```bash
# Push code to GitHub
git push origin main

# In Vercel Dashboard:
# 1. Click "New Project"
# 2. Select GitHub repository
# 3. Import project
```

### 2. Environment Variables

```bash
# In Vercel Project Settings → Environment Variables

# Add all variables from .env.production
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... continue for all variables
```

### 3. Build Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "nodeVersion": "18.17",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### 4. First Deployment

```bash
# Deploy to production
vercel deploy --prod

# Verify deployment
curl https://rythu360.com/api/health

# Check logs
vercel logs
```

### 5. Production Settings

```bash
# In Vercel Dashboard → Project Settings

# Deployment Protection
- Require approval for production
- Add team members as approvers

# Git Branch Deployment
- Production: main
- Preview: all other branches

# Performance
- Analytics: Enable
- Real Experience Monitoring: Enable
- Speed Insights: Enable
```

---

## MONITORING & ANALYTICS

### 1. Application Monitoring

```bash
# Setup Sentry for error tracking
npm install @sentry/nextjs

# Configure in next.config.js
const withSentryConfig = require("@sentry/nextjs/withSentryConfig");

module.exports = withSentryConfig(
  {
    // your Next.js config
  },
  {
    org: "your-org",
    project: "rythu360",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  }
);
```

### 2. Performance Monitoring

```typescript
// lib/monitoring/performance.ts
import * as Sentry from "@sentry/nextjs";

export function capturePerformanceMetrics() {
  // Monitor API response times
  // Monitor database query times
  // Monitor third-party service calls
  // Track user interaction metrics
}
```

### 3. Logging Configuration

```bash
# Configure structured logging
npm install winston pino

# Setup log levels:
- error: Production errors
- warn: Warnings
- info: Information events
- debug: Debug information

# Log to:
- CloudWatch (AWS)
- Vercel Analytics
- Sentry
- Application logs
```

### 4. Database Monitoring

```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC;

-- Monitor connection pool
SELECT datname, usename, count(*)
FROM pg_stat_activity
GROUP BY datname, usename;
```

### 5. Uptime Monitoring

```bash
# Setup uptime monitoring
- Vercel Analytics: Built-in
- UptimeRobot: Monitor health endpoints
- Pingdom: Monitor critical endpoints

# Health check endpoint
GET /api/health
Response: { status: 'ok', timestamp, version }
```

---

## BACKUP STRATEGY

### 1. Automated Backups

```bash
# Supabase automatic backups
- Daily backups: 30-day retention
- Point-in-time recovery: 7-day retention
- Enable in Supabase Dashboard → Backings

# Schedule manual backups
0 2 * * * supabase db backup create --name "daily-$(date +\%Y\%m\%d)"
```

### 2. Application Backups

```bash
# Backup Supabase bucket files
0 3 * * * aws s3 sync s3://agricultural-files s3://backups/agriculture/$(date +%Y%m%d)/

# Backup configurations
0 4 * * * git push backup origin main
```

### 3. Restore Procedure

```bash
# Restore from Supabase backup
1. Go to Supabase Dashboard
2. Navigate to Backups
3. Select backup timestamp
4. Click "Restore"
5. Wait for restore completion

# Verify restore
SELECT COUNT(*) FROM information_schema.tables;

# Point-in-time recovery
supabase db restore --timestamp "2025-01-15 14:30:00"
```

### 4. Disaster Recovery

```bash
# RTO: 4 hours
# RPO: 1 hour

# Create read replica for failover
supabase db replica create production-replica

# Test failover
1. Simulate data center outage
2. Switch to replica
3. Monitor for issues
4. Failback when primary recovered
```

---

## INCIDENT MANAGEMENT

### 1. Incident Response Plan

```
Severity Levels:
- P1 (Critical): System completely down, data loss risk
- P2 (High): Major functionality broken, significant impact
- P3 (Medium): Feature broken but workaround exists
- P4 (Low): Minor issues, cosmetic problems
```

### 2. Escalation Matrix

```
P1 → Immediate notification to all senior engineers
P2 → Notify team lead and system admin
P3 → Notify project manager
P4 → Add to backlog
```

### 3. Response Checklist

```bash
# Upon incident:
1. [ ] Create incident ticket
2. [ ] Set severity level
3. [ ] Notify stakeholders
4. [ ] Gather logs and diagnostics
5. [ ] Identify root cause
6. [ ] Implement fix
7. [ ] Deploy fix
8. [ ] Verify resolution
9. [ ] Post-mortem analysis
10. [ ] Document learnings
```

### 4. Communication Template

```
Subject: [INCIDENT] Production Issue - Machinery Bookings Down

To: engineering@smartfarmin.com, ops@smartfarmin.com

Incident: Machinery Booking API returning 500 errors
Severity: P2
Start Time: 2025-01-15 14:30 UTC
Status: Under Investigation

Impact: Users unable to create new bookings

ETA: Investigating root cause

Updates: [Posted as updates occur]
```

---

## ROLLBACK PROCEDURES

### 1. Quick Rollback (< 5 minutes)

```bash
# Rollback to previous Vercel deployment
# In Vercel Dashboard:
1. Go to Deployments
2. Find previous stable deployment
3. Click "Promote to Production"

# Verify rollback
curl https://api.rythu360.com/api/health
```

### 2. Code Rollback

```bash
# If previous deployment has issues:
1. Revert last commit
git revert HEAD --no-edit
git push origin main

2. Wait for new deployment
3. Monitor health endpoints
4. Verify in production
```

### 3. Database Rollback

```bash
# Rollback database to point-in-time
supabase db restore --timestamp "2025-01-15 14:00:00"

# Verify data integrity
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM orders;

# Run consistency checks
```

### 4. Full System Rollback

```bash
# Complete rollback procedure
1. Stop current deployment
2. Restore database from backup
3. Rollback application code
4. Clear cache
5. Restart services
6. Run health checks
7. Notify users
8. Monitor for issues
```

### 5. Rollback Testing

```bash
# Monthly rollback drills
1. Backup current production state
2. Perform rollback
3. Run full test suite
4. Restore from backup
5. Document timing and issues
```

---

## POST-DEPLOYMENT VERIFICATION

### 1. Health Checks

```bash
# Application health
curl https://api.rythu360.com/api/health

# Database connectivity
curl https://api.rythu360.com/api/db/health

# External services
curl https://api.rythu360.com/api/services/health
```

### 2. Functionality Testing

```
Test Cases to Verify:

Authentication:
- [ ] User registration
- [ ] Email verification
- [ ] Login/logout
- [ ] Password reset
- [ ] JWT token generation

Farmer Module:
- [ ] Create farm profile
- [ ] Upload documents
- [ ] Create crop cycle
- [ ] View dashboard

Machinery Booking:
- [ ] Browse machinery
- [ ] Create booking
- [ ] Confirm booking
- [ ] Track GPS

Marketplace:
- [ ] Browse products
- [ ] Add to cart
- [ ] Place order
- [ ] Payment processing

Payments:
- [ ] Create payment order
- [ ] Razorpay payment flow
- [ ] Webhook handling
- [ ] Wallet credit
```

### 3. Performance Validation

```bash
# Page load times
# Target: < 2s for homepage
# Target: < 1s for API responses

# Database query performance
# Target: < 100ms for most queries
# Target: < 500ms for complex aggregations

# Check in Vercel Analytics
# Monitor real user metrics (RUM)
```

### 4. Security Verification

```bash
# SSL/TLS certificate
curl -I https://api.rythu360.com
# Should show: Strict-Transport-Security header

# Security headers
curl -I https://api.rythu360.com
# Should show:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - Content-Security-Policy

# Run security audit
npm audit
```

### 5. Monitoring Validation

```bash
# Verify all monitoring is active
1. [ ] Sentry is capturing errors
2. [ ] Analytics are recording data
3. [ ] Logs are flowing to CloudWatch
4. [ ] Alerts are configured
5. [ ] Dashboards are updating
```

---

## MAINTENANCE WINDOWS

### Scheduled Maintenance

```
Maintenance Window: Every Sunday 2:00-3:00 AM UTC

During maintenance:
- Display banner: "System maintenance in progress"
- Queue requests
- Perform backups
- Run database optimization
- Update dependencies
- Test disaster recovery

Frequency:
- Critical updates: As needed
- Monthly updates: First Sunday
- Quarterly major updates: Q1, Q2, Q3, Q4
```

### Notification Procedure

```
Before Maintenance (24 hours):
- Email notification to users
- In-app banner
- Social media announcement

5 Minutes Before:
- Final notice
- Request users to finish activities

During Maintenance:
- Monitor progress
- Be ready for emergency rollback

After Maintenance:
- Verify all systems
- Send completion notification
- Monitor for issues
```

---

## VERIFICATION CHECKLIST

Before going live:

```
Production Readiness:
[ ] Code build succeeds
[ ] Zero TypeScript errors
[ ] All tests passing
[ ] Security audit cleared
[ ] Performance targets met
[ ] Monitoring configured
[ ] Alerts configured
[ ] Backup system tested
[ ] Disaster recovery plan ready
[ ] Runbooks documented
[ ] Team trained
[ ] Incident response plan ready
[ ] Database migrations tested
[ ] SSL certificate valid
[ ] DNS records propagated
[ ] Email system verified
[ ] Payment gateway tested
[ ] Rate limiting configured
[ ] WAF rules deployed
[ ] CORS configured
[ ] Cache strategy implemented
[ ] Realtime subscriptions working
[ ] File uploads working
[ ] Search functionality working
[ ] All API endpoints tested
[ ] Authentication flows tested
[ ] Authorization rules verified
[ ] User roles functioning
[ ] Permissions enforced
[ ] Audit logs enabled
[ ] Error logging working
[ ] Analytics tracking data
```

---

## SUPPORT & CONTACTS

### Emergency Contacts

```
Engineering Lead: +91-XXXXXXXXXX
DevOps Engineer: +91-XXXXXXXXXX
Database Admin: +91-XXXXXXXXXX
Security Officer: +91-XXXXXXXXXX

Slack: #production-incidents
PagerDuty: Set up escalation policy
```

### Documentation Links

- Architecture Documentation: `/docs/architecture.md`
- API Documentation: `https://api.rythu360.com/docs`
- Database Schema: `https://dashboard.supabase.io`
- Monitoring Dashboard: `https://vercel.com`
- Error Tracking: `https://sentry.io`

### Useful Commands

```bash
# View Vercel logs
vercel logs

# View Supabase logs
supabase logs

# Monitor real-time logs
tail -f vercel.log | grep ERROR

# Database diagnostics
supabase db remote show-status

# Clear cache
curl -X POST https://api.rythu360.com/api/cache/clear

# Force deployment
vercel deploy --prod --force
```

---

## VERSION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-15 | Initial deployment guide | SmartFarmin |

---

**DEPLOYMENT AUTHORIZATION**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CTO | _____________ | _____________ | _____________ |
| DevOps Lead | _____________ | _____________ | _____________ |
| Security Officer | _____________ | _____________ | _____________ |

---

**DEPLOYMENT CHECKLIST SIGN-OFF**

All items completed and verified:

**Date:** __________________  
**Deployed By:** __________________  
**Verified By:** __________________  
**Approved By:** __________________  

---

## EMERGENCY CONTACTS

**Production Down?**
- Call: +91-XXXXXXXXXX
- Slack: @oncall-engineer
- Email: production-emergency@smartfarmin.com

**24/7 Support Available**

---

*Last Updated: January 2025*  
*Next Review: April 2025*
