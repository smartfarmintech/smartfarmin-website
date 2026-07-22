# AgreeConnect - Farmer-Friendly Agriculture Platform

## Overview

AgreeConnect is India's most farmer-friendly digital agriculture platform, built with mobile-first design principles. The platform serves farmers with minimal technical knowledge, using:

- **Simple, icon-driven UI** inspired by WhatsApp, PhonePe, and Google Pay
- **Mobile-first responsive design** with bottom navigation
- **Minimal text, large buttons** for accessibility
- **Multi-language support** (English, Telugu, Hindi)
- **Production-ready architecture** with Supabase

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL), Server Components
- **Authentication**: Supabase Auth with custom role-based access control
- **UI Components**: shadcn/ui, custom AgreeConnect components
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React (SVG icons)

## Project Structure

```
app/
├── farmer/
│   ├── dashboard/          # Main farmer dashboard
│   ├── bookings/           # Machinery bookings history
│   ├── lands/              # Farm land management
│   ├── crop-cycles/        # Crop tracking
│   ├── soil-tests/         # Soil health reports
│   ├── wallet/             # Payment wallet
│   ├── schemes/            # Government schemes
│   ├── profile/            # Farmer profile
│   └── layout.tsx          # Farmer section layout with bottom nav
├── machinery/              # Machinery booking flows
├── ai-assistant/           # AI Crop Doctor
├── drone-services/         # Drone booking services
├── marketplace/            # Product marketplace
├── enterprise/             # Enterprise features
└── api/                    # Backend API routes

components/
├── dashboard/
│   ├── action-card.tsx           # Large action cards (WhatsApp-style)
│   ├── farmer-info-summary.tsx   # Farmer greeting + metrics
│   ├── upcoming-bookings.tsx     # Booking list
│   ├── metric-summary.tsx        # KPI cards
│   └── farming-tips.tsx          # Educational tips
├── bottom-navigation.tsx         # Mobile bottom nav
├── language-switcher.tsx         # Multi-language support
├── quick-action-button.tsx       # CTA buttons
└── [other components...]

lib/
├── supabase/
│   ├── server.ts                 # Server-side Supabase client
│   └── auth.ts                   # Authentication utilities
├── queries/
│   └── farmer-dashboard.ts       # Dashboard data fetching
└── [other utilities...]
```

## Core Features

### 1. **Farmer Dashboard** (`/farmer/dashboard`)
The main entry point for farmers with:
- **Welcome greeting** with farmer name and village
- **Key metrics**: Active lands, growing crops, wallet balance, weather
- **Quick action cards** in a grid layout:
  - 🚜 Book Tractor
  - 🤖 AI Crop Doctor
  - 🛍️ Marketplace
  - 🚁 Drone Services
  - 📋 Government Schemes
  - ☁️ Weather & Alerts
  - And 6 more services...
- **Upcoming bookings** with machine images and dates
- **Crop health alerts** for active issues
- **Mobile-optimized** with bottom navigation

### 2. **Machinery Booking**
Step-by-step booking wizard:
- Step 1: Select Machine (Tractor, Harvester, etc.)
- Step 2: Select Village
- Step 3: Select Date
- Step 4: Select Time
- Step 5: Confirm booking

### 3. **AI Crop Doctor (Akanksha)**
Advanced disease/pest detection:
- Image upload from camera or gallery
- AI-powered disease/pest identification
- Confidence scores and severity assessment
- Treatment protocols with step-by-step instructions
- Medicine recommendations with dosage
- Nearby shop locator
- Chat with expert option

### 4. **Marketplace**
Product browsing and purchasing:
- Large product cards with images
- Categories: Seeds, Fertilizers, Pesticides, Equipment, Organic
- Simple filters
- Cart and checkout integration
- Order tracking

### 5. **Government Schemes**
Eligibility checking and applications:
- Traffic-light color indicator:
  - 🟢 Eligible
  - 🟡 Review Needed
  - 🔴 Not Eligible
- One-click apply functionality
- Application tracking

## Design System

### Colors
- **Primary**: Emerald/Green (#059669) - trust, agriculture
- **Secondary**: Teal (#14b8a6) - growth
- **Accent**: Orange (#ea580c) - action
- **Neutral**: Gray scale for text

### Typography
- **Headers**: Bold, large (3xl-4xl) for farmers with poor vision
- **Body**: Clear, readable, 16px minimum on mobile
- **Max 2 font families**: System fonts for performance

### Components
- **Action Cards**: Large, colorful, rounded corners with hover effects
- **Bottom Navigation**: Mobile-optimized 5-item nav
- **Buttons**: Large touch targets (48px minimum)
- **Forms**: Minimal fields, clear labels, helpful hints
- **Cards**: Rounded (rounded-xl/2xl), subtle shadows, borders

### Accessibility
- High contrast ratios (WCAG AA)
- Large touch targets for farmers with limited dexterity
- Icons with text labels (not icon-only)
- Color not sole indicator of meaning
- Clear loading and error states
- Voice-friendly UI elements

## Data Architecture

### Key Tables
- `farmers` - Farmer profiles
- `user_profiles` - User information
- `lands` - Farm fields
- `crop_cycles` - Current growing crops
- `bookings` - Machinery rental bookings
- `machines` - Available machinery
- `disease_predictions` - AI Crop Doctor results
- `soil_tests` - Soil health data
- `wallets` - Payment wallets
- `notifications` - System alerts

### Queries
Located in `/lib/queries/farmer-dashboard.ts`:
- `getFarmerDashboardData()` - Complete dashboard data
- `getFarmerWeather()` - Location-based weather
- `getFarmerSchemeEligibility()` - Scheme eligibility
- `getFarmerBookingHistory()` - Past bookings
- `getFarmerAiHistory()` - AI Doctor results

## Authentication & Authorization

Using Supabase Auth with row-level security:

```typescript
import { getCurrentUser } from '@/lib/supabase/auth'

// Server-side: Get authenticated user
const user = await getCurrentUser()

// Check user role for access control
const userRole = await getUserRole()
```

Roles:
- `farmer` - Individual farmer
- `telecaller` - Sales team
- `field_agent` - Field representatives
- `machinery_owner` - Machinery lenders
- `drone_operator` - Drone service providers
- `dealer` - Product dealers
- `distributor` - Supply chain
- `admin` - System administrators
- `founder` - Platform owner

## Multi-Language Support

Language switcher in header with localStorage persistence:
- 🇬🇧 English
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Hindi (हिंदी)

All AI responses use selected language. App defaults to farmer's preferred language.

## Mobile-First Approach

### Farmer Dashboard Layout
- **Desktop (lg+)**: 3-column grid for action cards
- **Tablet (sm+)**: 2-column grid
- **Mobile**: 1-column stack

### Bottom Navigation (Mobile Only)
Fixed 5-tab navigation:
1. Home (/farmer/dashboard)
2. Browse (/marketplace)
3. Book (/machinery/booking)
4. Alerts (/notifications)
5. Profile (/farmer/profile)

Hides on tablets/desktop where top navigation is used.

## Performance Optimizations

- **Server Components**: Data fetching on server, not browser
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Route-based code splitting
- **Caching**: Supabase query caching with SWR
- **Animations**: GPU-accelerated with Framer Motion
- **CSS**: Tailwind v4 with JIT compilation

## Security Best Practices

- **RLS Policies**: Row-level security on all tables
- **API Routes**: Protected with Supabase Auth
- **User ID Filtering**: All queries scoped to authenticated user
- **Sensitive Data**: Never logged or exposed to client
- **HTTPS Only**: All data transmission encrypted
- **Token Rotation**: Automatic session refresh

## Deployment

Built for **Vercel** with automatic deployments:

```bash
# Install dependencies
pnpm install

# Build
npm run build

# Run
npm run start
```

Environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## API Routes

- `/api/farmers/me` - Current farmer profile
- `/api/machinery/bookings` - Booking creation/listing
- `/api/machinery/tracking` - GPS tracking
- `/api/ai/analyze-image` - AI image analysis
- `/api/marketplace/products` - Product listing
- `/api/dashboard/analytics` - Dashboard metrics
- `/api/notifications/send` - Send push notifications

## Getting Started

### For Farmers
1. Visit homepage
2. Click "Get Started" as Farmer
3. Register with phone + password
4. Complete profile (optional)
5. Access dashboard at `/farmer/dashboard`

### For Developers
1. Clone repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local`
4. Add Supabase credentials
5. Run dev server: `npm run dev`
6. Open http://localhost:3000

## Component Examples

### Action Card
```typescript
<ActionCard
  title="Book Tractor"
  description="Rent machinery for your fields"
  icon="🚜"
  href="/machinery/booking"
  color="green"
  badge="POPULAR"
/>
```

### Metric Summary
```typescript
<MetricSummary
  label="Wallet Balance"
  value={1200}
  format="currency"
  trend={{ value: 5, direction: 'up' }}
/>
```

### Quick Action Button
```typescript
<QuickActionButton
  label="Book AI Doctor"
  icon="🤖"
  href="/ai-assistant/disease-detection"
  color="blue"
  size="lg"
/>
```

## Future Enhancements

- [ ] Voice-based search and commands
- [ ] Offline support with service workers
- [ ] WhatsApp integration for notifications
- [ ] Video tutorials in local languages
- [ ] Real-time weather alerts
- [ ] Soil moisture sensors integration
- [ ] Loan eligibility calculator
- [ ] E-commerce payment gateway integration
- [ ] Field agent GPS tracking map
- [ ] Community forums for farmers
- [ ] Video consultation with experts
- [ ] Crop insurance integration

## Support & Documentation

- **Farmer Help**: In-app support chat
- **Developer Docs**: See this file and inline code comments
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## License

Built for SmartFarmin Technologies Pvt. Ltd.
