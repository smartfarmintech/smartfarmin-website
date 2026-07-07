# Rythu360 Complete Modules Implementation Guide

## Overview
This guide provides production-ready implementations for 6 major modules built on the existing Supabase database schema with 147 tables, Razorpay payment integration, and TypeScript strict mode.

## Modules to Build

### 1. Drone Services Module
**Routes**: `/dashboard/farmer/drones`, `/dashboard/drone-operator/`
**Features**: Booking, Spraying, Surveys, AI Mapping, Live Tracking, Battery Monitoring
**Database**: drones, drone_bookings, drone_flights, gps_locations, drone_operators

### 2. Marketplace Module  
**Routes**: `/marketplace`, `/seller/dashboard`
**Features**: Products, Cart, Checkout, Reviews, Coupons, Orders, Shipping
**Database**: products, cart, orders, reviews, categories, coupons

### 3. Organic Marketplace Module
**Routes**: `/organic`, `/organic/farm`
**Features**: Organic Farms, Certified Products, Subscriptions, Orders, Verification
**Database**: organic_farms, organic_products, organic_orders, organic_certificates

### 4. Wallet & Payments Module
**Routes**: `/wallet`, `/payments`
**Features**: Balance Management, Add Money, Withdraw, Razorpay, Transactions, Invoices
**Database**: wallets, wallet_transactions, payment_requests, bookingpayments

### 5. Order & Delivery Module
**Routes**: `/orders`, `/delivery/dashboard`
**Features**: Order Management, Tracking, Delivery Partners, Returns, OTP Verification
**Database**: orders, tracking, delivery_agents, delivery_events, return_requests

### 6. Akanksha AI Module
**Routes**: `/ai-assistant`, `/crop-doctor`
**Features**: Chat, Voice, Image Analysis, Disease Detection, Recommendations
**Database**: ai_conversations, ai_messages, disease_predictions, crop_predictions

## Implementation Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Node.js API Routes
- **Database**: Supabase PostgreSQL (147 tables with RLS)
- **Payment**: Razorpay (₹0 processing for testing)
- **Storage**: Supabase Storage (images, documents)
- **Real-time**: Supabase Realtime
- **Maps**: Leaflet.js for GPS tracking
- **Charts**: Recharts for analytics
- **Forms**: React Hook Form + Zod validation
- **UI**: shadcn/ui components, Tailwind CSS

## Module Breakdown & Implementation

### DRONE SERVICES MODULE

#### Features
1. **Farmer Interface**
   - Browse available drones
   - Book drone services (spraying, survey, mapping)
   - Live tracking with GPS
   - Battery status monitoring
   - Service history and invoices

2. **Operator Dashboard**
   - Drone inventory management
   - Booking requests management
   - Live flight tracking
   - Earnings and commission
   - Pilot verification and documents

3. **Key Components**
   ```
   /app/dashboard/farmer/drones/
   - page.tsx (main booking interface)
   - [id]/details.tsx (drone details)
   - [id]/book.tsx (booking flow)
   
   /app/dashboard/drone-operator/
   - page.tsx (operator dashboard)
   - drones/ (manage inventory)
   - flights/ (active flights)
   - earnings/ (commission tracking)
   
   /components/drones/
   - drone-catalog.tsx
   - booking-dialog.tsx
   - live-tracking.tsx
   - battery-monitor.tsx
   - operator-dashboard.tsx
   ```

4. **Database Tables Used**
   - machines (drone inventory)
   - bookings (drone bookings)
   - gps_locations (live tracking)
   - operators (drone pilots)
   - booking_payments (payment tracking)
   - machine_reviews (ratings)

#### API Routes
```
POST /api/drones/book - Create drone booking
GET  /api/drones/[id]/tracking - Get live GPS coordinates
PATCH /api/drones/[id]/flight/status - Update flight status
GET  /api/drones/earnings - Get operator earnings
```

---

### MARKETPLACE MODULE

#### Features
1. **Buyer Interface**
   - Product browsing with filters
   - Search functionality
   - Shopping cart management
   - Wishlist
   - Checkout with address selection
   - Order tracking
   - Returns and refunds

2. **Seller Dashboard**
   - Product inventory management
   - Order management
   - Shipment tracking
   - Revenue analytics
   - Commission breakdown

3. **Admin Interface**
   - Product approval
   - Seller verification
   - Dispute resolution
   - Analytics dashboard

#### Key Components
```
/app/marketplace/
- page.tsx (product listing)
- [id]/page.tsx (product details)
- cart/page.tsx (shopping cart)
- checkout/page.tsx (checkout flow)
- orders/page.tsx (order history)

/app/seller/
- dashboard/page.tsx
- products/page.tsx
- orders/page.tsx
- analytics/page.tsx

/components/marketplace/
- product-card.tsx
- product-filter.tsx
- cart-item.tsx
- checkout-form.tsx
- order-item.tsx
```

#### Database Tables
- products
- cart, cart_items
- orders, order_items
- reviews
- categories
- coupons
- payment_requests
- shipping_addresses

#### API Routes
```
GET  /api/products - List products with filtering
GET  /api/products/[id] - Get product details
POST /api/cart/add - Add to cart
POST /api/orders/create - Create order
GET  /api/orders/[id] - Get order details
PATCH /api/orders/[id]/status - Update order status
```

---

### ORGANIC MARKETPLACE MODULE

#### Features
1. **Farmer/Farm Interface**
   - Create organic farm profile
   - Upload organic certification
   - Add organic products
   - Track orders
   - Manage inventory

2. **Buyer Interface**
   - Browse certified organic products
   - View farm details and certifications
   - Subscription boxes
   - Order history

3. **Admin Interface**
   - Farm verification
   - Certificate validation
   - Product approval
   - Compliance monitoring

#### Key Components
```
/app/organic/
- page.tsx (organic marketplace)
- farms/[id]/page.tsx (farm details)
- products/[id]/page.tsx (product details)
- subscription/page.tsx (subscription management)

/app/organic/farm/
- setup/page.tsx (create farm)
- dashboard/page.tsx
- products/page.tsx
- orders/page.tsx

/components/organic/
- farm-card.tsx
- farm-form.tsx
- product-card.tsx
- subscription-plan.tsx
- certification-display.tsx
```

#### Database Tables
- organic_farms
- organic_products
- organic_orders, organic_order_items
- organic_certificates
- organic_categories
- organic_reviews

#### API Routes
```
POST /api/organic/farms - Create farm profile
POST /api/organic/products - Add product
GET  /api/organic/farms/[id] - Get farm details
POST /api/organic/orders - Create order
GET  /api/organic/certificates/verify - Verify certificate
```

---

### WALLET & PAYMENTS MODULE

#### Features
1. **Wallet Dashboard**
   - View wallet balance
   - Transaction history
   - Add money to wallet
   - Withdraw funds
   - Cashback tracking

2. **Payment Methods**
   - Razorpay integration
   - UPI support
   - Card payments
   - Net banking
   - Wallet balance payments

3. **Settlement & Invoices**
   - Automatic settlement
   - Invoice generation (with GST)
   - Transaction receipts
   - Tax reports

#### Key Components
```
/app/wallet/
- page.tsx (wallet overview)
- add-money/page.tsx
- withdraw/page.tsx
- transactions/page.tsx
- invoices/page.tsx

/components/wallet/
- wallet-card.tsx
- add-money-modal.tsx
- transaction-list.tsx
- withdraw-form.tsx
- razorpay-form.tsx
```

#### Database Tables
- wallets
- wallet_transactions
- payment_requests
- booking_payments
- cashback
- withdraw_requests
- invoice
- gst_records

#### API Routes
```
POST /api/wallet/add-money - Initiate Razorpay payment
POST /api/wallet/verify-payment - Verify Razorpay signature
POST /api/wallet/withdraw - Initiate withdrawal
GET  /api/wallet/transactions - Get transaction history
GET  /api/wallet/[id]/balance - Get wallet balance
POST /api/wallet/generate-invoice - Generate invoice PDF
```

---

### ORDER & DELIVERY MODULE

#### Features
1. **Buyer Interface**
   - Order tracking with real-time updates
   - Delivery address management
   - OTP verification for delivery
   - Return requests
   - Refund tracking

2. **Delivery Partner Dashboard**
   - Assigned deliveries list
   - Real-time GPS tracking
   - OTP verification
   - Photo proof of delivery
   - Earnings tracking

3. **Admin Interface**
   - Delivery partner management
   - Performance analytics
   - Dispute resolution

#### Key Components
```
/app/orders/
- page.tsx (order history)
- [id]/page.tsx (order tracking)
- returns/page.tsx (return management)

/app/delivery/
- dashboard/page.tsx
- deliveries/[id]/page.tsx
- tracking/page.tsx
- earnings/page.tsx

/components/delivery/
- order-status-timeline.tsx
- live-tracking-map.tsx
- otp-verification.tsx
- delivery-proof.tsx
- return-form.tsx
```

#### Database Tables
- orders, order_items
- tracking
- delivery_agents
- delivery_events
- delivery_proofs
- return_requests
- refund_requests
- invoice

#### API Routes
```
GET  /api/orders/[id]/tracking - Get real-time tracking
POST /api/delivery/otp/verify - Verify delivery OTP
POST /api/delivery/proof/upload - Upload delivery proof
POST /api/returns/create - Create return request
GET  /api/returns/[id]/status - Get return status
```

---

### AKANKSHA AI ASSISTANT MODULE

#### Features
1. **AI Chat Interface**
   - Multi-turn conversations
   - Multilingual support (Telugu, Hindi, English)
   - Image upload and analysis
   - Voice input/output

2. **Crop Intelligence Features**
   - Disease detection from images
   - Pest identification
   - Deficiency detection
   - Fertilizer recommendations
   - Irrigation advice
   - Yield predictions

3. **Knowledge Management**
   - Conversation history
   - Saved recommendations
   - Treatment tracking
   - Progress monitoring

#### Key Components
```
/app/ai-assistant/
- page.tsx (chat interface)
- crop-doctor/page.tsx (disease detection)
- conversations/[id]/page.tsx (conversation history)

/components/ai/
- chat-interface.tsx
- message-list.tsx
- image-upload.tsx
- voice-input.tsx
- recommendation-card.tsx
- disease-analysis.tsx
```

#### Database Tables
- ai_conversations
- ai_messages
- disease_predictions
- crop_predictions
- image_analysis
- voice_requests, voice_responses
- knowledge_base

#### API Routes
```
POST /api/ai/chat - Send chat message
POST /api/ai/analyze-image - Analyze crop image
POST /api/ai/disease-detect - Detect disease
POST /api/ai/recommend/fertilizer - Get fertilizer recommendation
POST /api/ai/recommend/irrigation - Get irrigation advice
GET  /api/ai/conversations - Get conversation history
```

---

## Implementation Sequence

### Phase 1: Foundation (APIs & Database)
1. Create API routes for each module
2. Set up Supabase RLS policies
3. Implement Razorpay webhook handlers
4. Create utility functions for common operations

### Phase 2: Core UI Components
1. Build shared components (cards, forms, modals)
2. Create module-specific components
3. Implement navigation and routing
4. Add responsive design

### Phase 3: Integration
1. Connect components to APIs
2. Add real-time updates with Supabase Realtime
3. Implement payment flows
4. Add file uploads

### Phase 4: Polish
1. Error handling and validation
2. Loading states and skeletons
3. Accessibility audit
4. Performance optimization

## Code Generation Templates

### API Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('table_name')
      .insert([{ ...body, created_by: user.id }])
      .select()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Component Template
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Component() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/endpoint')
      if (!res.ok) throw new Error('Failed to load')
      const result = await res.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (error) return <div className="text-red-600">{error}</div>
  if (loading) return <LoadingSkeleton />
  
  return (
    <div className="space-y-6">
      {data && <Card>{/* render data */}</Card>}
    </div>
  )
}
```

## Security Checklist

- RLS policies enabled on all tables
- Input validation on all API routes
- Parameterized queries (Supabase handles this)
- Payment verification with Razorpay signatures
- CSRF protection on forms
- Rate limiting on sensitive endpoints
- Audit logging for critical operations
- User data isolation (farmers can only see own data)

## Performance Guidelines

- Lazy load components using dynamic imports
- Use Supabase cache for static data (schemes, categories)
- Implement pagination for large datasets
- Optimize images (next/image)
- Server-side filtering and sorting
- Denormalized views for complex queries (v_ tables)

## Testing Checklist

- TypeScript compilation: `npm run build`
- ESLint: `npm run lint`
- Component unit tests with Vitest
- API integration tests
- E2E tests with Playwright

## Deployment

1. Push to GitHub on feature branch
2. Vercel Preview deployment
3. Manual testing on preview
4. Merge to main
5. Production deployment

---

## File Organization

```
app/
├── dashboard/
│   ├── farmer/
│   │   ├── drones/
│   │   ├── marketplace/
│   │   └── wallet/
│   ├── operator/
│   ├── seller/
│   └── delivery/
├── api/
│   ├── drones/
│   ├── marketplace/
│   ├── orders/
│   ├── wallet/
│   └── ai/
└── organic/

components/
├── drones/
├── marketplace/
├── organic/
├── wallet/
├── delivery/
├── ai/
└── shared/

lib/
├── supabase/
├── razorpay/
├── validations/
└── utils/
```

---

## Next Steps

1. Review this implementation guide
2. Choose which module to build first
3. Start with API routes and database queries
4. Build UI components
5. Integrate payment flows
6. Test end-to-end
7. Deploy to production

This modular approach allows each module to be built independently and integrated seamlessly with the existing Rythu360 architecture.
