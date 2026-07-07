# Rythu360 - Agricultural Technology Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com/smartfarmintech/rythu360)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org)

> **Rythu360** is a comprehensive agricultural technology platform connecting farmers with machinery rental services, marketplace commerce, government scheme management, drone services, field operations tracking, and AI-powered insights.

**Live Demo:** [https://rythu360.smartfarmintech.com](https://rythu360.smartfarmintech.com)  
**Documentation:** [https://docs.rythu360.smartfarmintech.com](https://docs.rythu360.smartfarmintech.com)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Database](#database)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Support](#support)

---

## Features

### Core Modules

#### 1. **Farmer Management**
- Comprehensive farmer profiles with KYC verification
- Land management with GPS boundaries
- Multi-season crop tracking
- Soil health monitoring
- Irrigation scheduling
- Document management (certificates, ownership proofs)

#### 2. **Machinery Booking**
- 10,000+ machines across India
- Dynamic pricing based on season/location
- Real-time GPS tracking during bookings
- Operator management and assignment
- Invoice generation
- Cancellation and rescheduling
- Machine reviews and ratings (4.8⭐ avg)

#### 3. **Marketplace**
- 5,000+ agricultural products
- Smart inventory management
- Real-time order tracking
- Product reviews and ratings
- Wishlist and favorites
- Advanced search with 50+ filters

#### 4. **Payments & Wallet**
- Secure Razorpay integration
- Digital wallet with instant transfers
- Multi-payment methods (UPI, Bank, Card)
- Automated settlements
- Refund management
- Transaction history with audit logs

#### 5. **Government Schemes**
- 50+ active government schemes
- Automated eligibility checking
- One-click applications
- Document management
- Status tracking and notifications

#### 6. **CRM & Lead Management**
- AI-powered lead scoring
- Call center integration
- Telecaller performance tracking
- Automated follow-up scheduling
- Pipeline analytics

#### 7. **Field Operations**
- GPS tracking for field agents
- Visit management and verification
- Real-time attendance logging
- Expense tracking
- Photo/document capture

#### 8. **AI Services**
- Crop disease detection via image analysis
- Yield predictions using ML models
- Pest identification with 95%+ accuracy
- Weather-based recommendations
- Multi-language AI assistant

#### 9. **Analytics & Dashboards**
- Real-time business metrics
- Revenue analytics
- User engagement tracking
- Geographic heat maps
- Custom report generation

#### 10. **Notifications**
- Multi-channel (In-app, Email, SMS, Push)
- 50+ notification templates
- 15+ languages support
- Smart scheduling and batching
- Delivery tracking

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Web & Mobile Clients                    │
│              (Next.js Frontend + React Native)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   API Layer (Next.js 16)                    │
│  ├─ Authentication (JWT, Supabase Auth)                     │
│  ├─ REST API (32 endpoints)                                 │
│  ├─ Rate Limiting & Validation                              │
│  └─ Error Handling & Logging                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Business Logic Layer                       │
│  ├─ Farmer Services                                         │
│  ├─ Machinery Booking Engine                                │
│  ├─ Marketplace Services                                    │
│  ├─ Payment Processing                                      │
│  ├─ Notification Engine                                     │
│  └─ AI/ML Pipeline                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               Data Access Layer (Supabase)                  │
│  ├─ PostgreSQL (147 tables)                                 │
│  ├─ Row Level Security (RLS)                                │
│  ├─ Real-time Subscriptions                                 │
│  ├─ Storage Buckets (6)                                     │
│  └─ Edge Functions                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              External Services & Integrations               │
│  ├─ Razorpay (Payments)                                     │
│  ├─ SendGrid/AWS SES (Email)                                │
│  ├─ Twilio (SMS)                                            │
│  ├─ Firebase Cloud Messaging (Push)                         │
│  ├─ Google Maps (Geolocation)                               │
│  ├─ Weather API (Forecasting)                               │
│  └─ Sentry (Monitoring)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request
    ↓
Authentication & Validation
    ↓
Business Logic (Services & Utils)
    ↓
Database Query (with RLS)
    ↓
Response Formatting
    ↓
HTTP Response + Caching Headers
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (with Shadcn components)
- **State:** SWR for data fetching & caching
- **UI Components:** 145+ Shadcn/UI components
- **Charts:** Recharts for analytics
- **Maps:** React Simple Maps for geospatial
- **Forms:** React Hook Form with Zod validation

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Next.js 16 API Routes
- **Database:** PostgreSQL 15 via Supabase
- **ORM:** Direct SQL (parameterized queries)
- **Authentication:** Supabase Auth + JWT
- **Real-time:** Supabase Realtime (WebSocket)
- **File Storage:** Supabase Storage + CDN

### Infrastructure
- **Hosting:** Vercel (Auto-scaling, CDN, Edge)
- **Database:** Supabase Cloud (auto-backups, PITR)
- **Monitoring:** Sentry for error tracking
- **Analytics:** PostHog/Mixpanel for user events
- **Email:** SendGrid API
- **SMS:** Twilio API
- **Payments:** Razorpay API

### DevOps
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions (automated testing, deployment)
- **Containerization:** Docker (optional)
- **Logging:** Winston/Pino
- **Performance Monitoring:** Datadog APM

---

## Quick Start

### Prerequisites

- **Node.js:** 18.0 or higher
- **npm/pnpm/yarn:** Latest version
- **Git:** 2.30 or higher
- **Supabase Account:** [Create free account](https://supabase.com)
- **Razorpay Account:** [Create account](https://razorpay.com)

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/smartfarmintech/rythu360.git
cd rythu360
```

2. **Install Dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set Up Environment Variables**

```bash
cp .env.example .env.local
```

Configure the following in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@rythu360.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+1234567890

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Analytics
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

4. **Run Database Migrations**

```bash
npm run db:migrate
```

5. **Start Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Workflow

```bash
# Start development server with HMR
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

---

## Project Structure

```
rythu360/
├── app/                           # Next.js 16 App Router
│   ├── api/                       # API routes (32 endpoints)
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── machinery/             # Machinery booking API
│   │   ├── marketplace/           # E-commerce API
│   │   ├── payments/              # Payment processing
│   │   ├── wallet/                # Digital wallet
│   │   ├── notifications/         # Notification system
│   │   ├── analytics/             # Business metrics
│   │   └── crm/                   # Lead management
│   ├── (public)/                  # Public pages
│   ├── (auth)/                    # Auth pages
│   ├── dashboard/                 # Dashboard layout
│   ├── farmer/                    # Farmer module pages
│   ├── machinery/                 # Machinery module pages
│   ├── marketplace/               # Marketplace pages
│   ├── drone/                     # Drone services pages
│   ├── admin/                     # Admin panel pages
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
│
├── components/                    # React components (145 total)
│   ├── auth/                      # Login, register, password reset
│   ├── dashboard/                 # Dashboard widgets
│   ├── farmer/                    # Farmer-specific components
│   ├── machinery/                 # Machinery booking components
│   ├── marketplace/               # E-commerce components
│   ├── drone/                     # Drone service components
│   ├── notifications/             # Notification components
│   ├── analytics/                 # Analytics components
│   ├── ui/                        # Shadcn/UI base components
│   └── common/                    # Reusable components
│
├── lib/                           # Business logic & utilities (85+ files)
│   ├── api/                       # API client & helpers
│   ├── auth/                      # Authentication utilities
│   ├── supabase/                  # Supabase client & queries
│   ├── farmer/                    # Farmer business logic
│   ├── machinery/                 # Machinery booking services
│   ├── marketplace/               # Marketplace services
│   ├── wallet/                    # Wallet & payment services
│   ├── notifications/             # Notification services
│   ├── crm/                       # CRM & lead services
│   ├── ai/                        # AI/ML services
│   ├── analytics/                 # Analytics services
│   ├── realtime/                  # Real-time subscriptions
│   ├── validation/                # Zod schemas & validation
│   ├── security/                  # Security utilities
│   ├── optimization/              # Caching & optimization
│   └── utils/                     # General utilities
│
├── hooks/                         # React hooks (20+)
│   ├── useAuth.ts
│   ├── useFarmer.ts
│   ├── useBooking.ts
│   ├── useCart.ts
│   ├── useWallet.ts
│   ├── useNotifications.ts
│   └── useRealtime.ts
│
├── types/                         # TypeScript type definitions
│   ├── index.ts                   # Core types
│   ├── auth.ts                    # Auth types
│   ├── farmer.ts                  # Farmer types
│   ├── machinery.ts               # Machinery types
│   ├── marketplace.ts             # Marketplace types
│   └── [module].ts                # Module-specific types
│
├── public/                        # Static assets
│   ├── images/                    # Images, icons, logos
│   ├── vectors/                   # SVG graphics
│   └── fonts/                     # Custom fonts
│
├── styles/                        # Global styles
│   ├── globals.css                # Tailwind directives
│   ├── fonts.css                  # Font definitions
│   └── animations.css             # Animation keyframes
│
├── documentation/                 # Project documentation
│   ├── API.md                     # API documentation (32 endpoints)
│   ├── DATABASE.md                # Database schema (147 tables)
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── INVENTORY.md               # Project inventory
│   └── ARCHITECTURE.md            # System architecture
│
├── .github/                       # GitHub configuration
│   ├── workflows/                 # CI/CD workflows
│   │   ├── test.yml               # Automated testing
│   │   ├── lint.yml               # Code quality checks
│   │   └── deploy.yml             # Auto-deployment
│   └── ISSUE_TEMPLATE/            # Issue templates
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .eslintrc.json                 # ESLint configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies & scripts
├── pnpm-lock.yaml                 # Lock file (pnpm)
├── DATABASE.md                    # Database documentation
├── API.md                         # API documentation
├── DEPLOYMENT.md                  # Deployment guide
├── INVENTORY.md                   # Project inventory
├── README.md                      # This file
├── CHANGELOG.md                   # Version history
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md            # Code of conduct
└── SECURITY.md                    # Security policy
```

---

## Database

### Schema Overview

**147 Tables** across 15 modules:

| Module | Tables | Purpose |
|--------|--------|---------|
| Authentication | 10 | User accounts, roles, permissions, sessions |
| Farmer | 13 | Profiles, lands, crops, soil, irrigation |
| Machinery | 15 | Machines, bookings, pricing, GPS, reviews |
| Marketplace | 25 | Products, orders, cart, reviews, inventory |
| Payments | 8 | Wallets, transactions, commission, settlements |
| Government | 8 | Schemes, applications, eligibility, benefits |
| CRM | 9 | Leads, status, calls, follow-ups, performance |
| Field Ops | 8 | Agents, visits, GPS, attendance, verification |
| Notifications | 6 | Templates, logs, channels, campaigns |
| AI Services | 10 | Conversations, predictions, analysis, metrics |
| Analytics | 8 | Metrics, dashboards, events, reporting |
| Organic | 8 | Farms, products, certificates, orders |
| Geographic | 5 | States, districts, villages, mandals |
| Support | 9 | Settings, currencies, languages, subscriptions |
| Views | 16 | Analytics views for dashboards & reports |

### Key Features

- **Row Level Security (RLS):** Enabled on 139/147 tables (95% coverage)
- **Real-time Subscriptions:** WebSocket support for live updates
- **Full-Text Search:** On product names, descriptions, lead notes
- **Geospatial Queries:** GPS coordinates for location-based services
- **Audit Logging:** All sensitive operations tracked
- **Soft Deletes:** Data retention with deleted_at timestamp
- **Point-in-Time Recovery:** 7-day PITR available
- **Automated Backups:** Daily backups with 30-day retention

### Database Access

For detailed schema documentation, see [DATABASE.md](DATABASE.md).

---

## API

### Endpoints Overview

**32 REST API Endpoints** across 9 modules:

| Module | Endpoints | Operations |
|--------|-----------|------------|
| Authentication | 3 | Session, token refresh, password reset |
| Machinery | 6 | List, details, booking, tracking, reviews |
| Marketplace | 6 | Products, orders, reviews, wishlist, cart |
| Payments | 3 | Order creation, verification, webhooks |
| Wallet | 3 | Overview, transactions, withdrawal |
| Notifications | 1 | Fetch with pagination & filtering |
| Profiles | 4 | Farmer & operator management |
| CRM | 1 | Lead management with filtering |
| Analytics | 1 | Dashboard metrics & reporting |

### Authentication

All API endpoints require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.rythu360.com/api/machinery
```

### Example Request & Response

**Get Machinery Bookings**

```bash
curl -X GET "https://api.rythu360.com/api/machinery/bookings?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**

```json
{
  "ok": true,
  "data": {
    "bookings": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "booking_number": "BK-2025-001",
        "machine_id": "550e8400-e29b-41d4-a716-446655440001",
        "starts_at": "2025-01-20T06:00:00Z",
        "ends_at": "2025-01-21T18:00:00Z",
        "total_amount": 5000,
        "booking_state": "confirmed",
        "payment_status": "paid"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10
  }
}
```

For complete API documentation, see [API.md](API.md).

---

## Environment Variables

### Core Configuration

```env
# Supabase (PostgreSQL Database)
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
SUPABASE_JWT_SECRET=[jwt-secret]

# Razorpay (Payment Gateway)
NEXT_PUBLIC_RAZORPAY_KEY_ID=[key-id]
RAZORPAY_KEY_SECRET=[secret]
RAZORPAY_WEBHOOK_SECRET=[webhook-secret]

# Email (SendGrid)
SENDGRID_API_KEY=[api-key]
SENDGRID_FROM_EMAIL=noreply@rythu360.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=[account-sid]
TWILIO_AUTH_TOKEN=[auth-token]
TWILIO_FROM_NUMBER=+1234567890

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID=[project-id]
FIREBASE_PRIVATE_KEY=[private-key]
FIREBASE_CLIENT_EMAIL=[client-email]

# Monitoring & Analytics
SENTRY_DSN=[sentry-dsn]
NEXT_PUBLIC_POSTHOG_KEY=[posthog-key]

# Application
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.rythu360.com
```

---

## Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsmartfarmintech%2Frythu360&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY)

### Manual Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

**Quick Deployment to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Setup

1. Connect Supabase project
2. Configure payment gateway (Razorpay)
3. Set up email provider (SendGrid)
4. Configure SMS provider (Twilio)
5. Set monitoring (Sentry)

---

## Performance

### Optimization Metrics

- **Lighthouse Score:** 95/100 (Performance)
- **Core Web Vitals:** All green
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

- **Database Query Performance:**
  - Average query time: < 100ms
  - 95th percentile: < 500ms
  - Slow query threshold: 1s

- **API Response Time:**
  - P50: 150ms
  - P95: 500ms
  - P99: 1s

### Caching Strategy

- **Client-side:** SWR with 1-minute cache
- **CDN:** 24-hour cache for static assets
- **Database:** Realtime subscriptions for live data
- **API:** Response caching with conditional requests

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage

- **Unit Tests:** 85% coverage
- **Integration Tests:** 75% coverage
- **E2E Tests:** Critical user flows

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Quality

- Run linter: `npm run lint`
- Format code: `npm run format`
- Check types: `npm run type-check`

---

## Security

For security issues, please see [SECURITY.md](SECURITY.md).

**Do not open public issues for security vulnerabilities.**

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

### Documentation
- [API Documentation](API.md)
- [Database Schema](DATABASE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contribution Guidelines](CONTRIBUTING.md)

### Community
- **Issues:** [GitHub Issues](https://github.com/smartfarmintech/rythu360/issues)
- **Discussions:** [GitHub Discussions](https://github.com/smartfarmintech/rythu360/discussions)
- **Email:** support@smartfarmintech.com
- **Website:** https://smartfarmintech.com

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Contributors

<a href="https://github.com/smartfarmintech/rythu360/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=smartfarmintech/rythu360" />
</a>

---

## Acknowledgments

- SmartFarmin Technologies Pvt. Ltd.
- Next.js & Vercel teams
- Supabase community
- All open-source contributors

---

**Made with ❤️ by SmartFarmin Technologies Pvt. Ltd.**

**Transforming Indian Agriculture through Technology**
