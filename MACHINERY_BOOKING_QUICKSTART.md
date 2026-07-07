# Machinery Booking Module - Quick Start Guide

## Overview
This guide will help you get started with the Machinery Booking Module in Rythu360.

## Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager
- Supabase account with machinery booking tables
- Razorpay account for payment processing

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/smartfarmintech/rythu360.git
cd rythu360
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Node Environment
NODE_ENV=development
```

### 4. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

## Key Features Overview

### Farmer Dashboard
**Path:** `/dashboard/farmer/machinery`

Access these features:
1. **Browse Machinery** - Search by type, location, price
2. **Book Machinery** - Select dates, times, and duration
3. **Manage Bookings** - View status, payments, cancel if needed
4. **Payment** - Pay advance or full amount via Razorpay
5. **Invoice** - Download billing documents

**Example:**
```typescript
// Access farmer machinery page
Visit: http://localhost:3000/dashboard/farmer/machinery
```

### Operator Dashboard
**Path:** `/dashboard/operator`

Features available:
1. **Dashboard** - Overview of bookings, earnings, metrics
2. **Booking Requests** - Accept/Reject farmer requests
3. **Today's Jobs** - Start, pause, complete jobs
4. **Machines** - Add/edit machinery inventory
5. **Earnings** - View income and commissions
6. **GPS Tracking** - Track machinery location in real-time

**Example:**
```typescript
// Access operator dashboard
Visit: http://localhost:3000/dashboard/operator
```

## Creating a Test Booking

### Step 1: Login as Farmer
1. Navigate to `/login/farmer`
2. Enter your credentials
3. Go to "Machinery Booking" dashboard

### Step 2: Browse and Select Machinery
```typescript
// Component: components/farmer/machinery/machinery-list.tsx
// The list shows available machinery with:
// - Machine name and details
// - Operator information
// - Pricing (daily/hourly)
// - Ratings and reviews
```

### Step 3: Initiate Booking
```typescript
// Fill booking form
{
  machine_id: 'machine-uuid',
  booking_type: 'day', // or 'hour'
  start_date: '2024-07-25',
  end_date: '2024-07-28',
  units: 3, // days
  total_amount: 4500,
  service_address: { /* location */ }
}
```

### Step 4: Make Payment
```typescript
// POST /api/bookings/[id]/payment
{
  amount: 2250, // 50% advance
  payment_type: 'partial',
  is_advance: true
}
```

## API Endpoints Reference

### Booking Endpoints

#### Create Booking
```bash
POST /api/bookings/create
Content-Type: application/json

{
  "machine_id": "uuid",
  "starts_at": "2024-07-25T09:00:00Z",
  "ends_at": "2024-07-28T17:00:00Z",
  "units": 3,
  "unit_type": "day",
  "total_amount": 4500,
  "advance_amount": 2250,
  "service_address": {
    "line1": "Farm Address",
    "city": "Hyderabad",
    "state": "Telangana"
  },
  "latitude": 17.3850,
  "longitude": 78.4867,
  "notes": "Urgent plowing required"
}

Response:
{
  "id": "booking-uuid",
  "booking_number": "BK1721000000000",
  "booking_state": "pending",
  "payment_status": "pending",
  "created_at": "2024-07-15T10:30:00Z"
}
```

#### Update Booking Status
```bash
PATCH /api/bookings/{booking_id}/status
Content-Type: application/json

{
  "booking_state": "confirmed",
  "note": "Booking confirmed by operator"
}
```

#### Process Booking Payment
```bash
POST /api/bookings/{booking_id}/payment
Content-Type: application/json

{
  "amount": 2250,
  "payment_type": "partial",
  "is_advance": true
}

Response:
{
  "razorpay_order": {
    "id": "order_...",
    "amount": 225000,
    "currency": "INR"
  }
}
```

### Machinery Endpoints

#### Create Machine
```bash
POST /api/machines/create
Content-Type: application/json

{
  "name": "Tractor - 50HP",
  "brand": "John Deere",
  "model": "5050D",
  "category_id": "uuid",
  "registration_no": "TS-09-XY-1234",
  "power_hp": 50,
  "fuel": "diesel",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "service_radius_km": 50,
  "base_location": "Hyderabad, Telangana",
  "operator_included": true
}
```

#### Get Pricing Rules
```bash
GET /api/machines/{machine_id}/pricing

Response:
[
  {
    "id": "uuid",
    "price": 1500,
    "unit": "day",
    "valid_from": "2024-07-01",
    "valid_until": "2024-12-31",
    "fuel_included": true
  },
  {
    "id": "uuid",
    "price": 200,
    "unit": "hour",
    "valid_from": "2024-07-01",
    "valid_until": "2024-12-31"
  }
]
```

## Database Structure

### Key Tables

#### machines
```sql
id (uuid) - Primary key
name (text) - Machine name
brand (text) - Manufacturer
model (text) - Model number
owner_id (uuid) - FK to operators
category_id (uuid) - FK to machinery_categories
registration_no (text) - Vehicle registration
power_hp (numeric) - Power in HP
fuel (enum) - Fuel type (diesel/petrol/electric)
latitude/longitude (numeric) - GPS location
service_radius_km (numeric) - Service coverage
status (enum) - available/busy/maintenance
rating_avg (numeric) - Average rating
total_bookings (integer) - Booking count
created_at/updated_at (timestamp)
```

#### bookings
```sql
id (uuid) - Primary key
machine_id (uuid) - FK to machines
renter_id (uuid) - FK to farmers
owner_id (uuid) - FK to operators
booking_state (enum) - pending/confirmed/started/completed/cancelled
payment_status (enum) - pending/partial/completed
starts_at/ends_at (timestamp) - Booking duration
units (numeric) - Duration quantity
total_amount (numeric) - Total cost
advance_amount (numeric) - Advance paid
booking_number (text) - Unique booking reference
created_at/updated_at (timestamp)
```

#### booking_payments
```sql
id (uuid) - Primary key
booking_id (uuid) - FK to bookings
amount (numeric) - Payment amount
payment_status (enum) - pending/completed/failed/refunded
gateway (text) - Payment gateway (razorpay)
transaction_ref (text) - Gateway transaction ID
is_advance (boolean) - Is advance payment
paid_at (timestamp) - Payment timestamp
created_at (timestamp)
```

## Component Usage

### Display Machinery List
```tsx
import MachineryList from '@/components/farmer/machinery/machinery-list'

export default function MachineryPage() {
  return (
    <div>
      <MachineryList />
    </div>
  )
}
```

### Show Booking Dialog
```tsx
import MachineryBookingDialog from '@/components/farmer/machinery/machinery-booking-dialog'

export default function BookingComponent() {
  const [open, setOpen] = useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Book Machine</DialogTrigger>
      <DialogContent>
        <MachineryBookingDialog 
          machine={selectedMachine} 
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
```

### GPS Tracking
```tsx
import GPSTracking from '@/components/machinery/gps-tracking'

export default function TrackingPage() {
  return (
    <GPSTracking 
      booking_id="booking-uuid"
      live={true}
    />
  )
}
```

## Razorpay Integration

### Payment Checkout (Frontend)
```typescript
const createOrder = async (bookingId: string, amount: number) => {
  // 1. Create order in your backend
  const response = await fetch(`/api/bookings/${bookingId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      payment_type: 'partial',
      is_advance: true
    })
  })
  
  const { razorpay_order } = await response.json()
  
  // 2. Open Razorpay checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: razorpay_order.amount,
    currency: 'INR',
    name: 'Rythu360',
    order_id: razorpay_order.id,
    handler: handlePaymentSuccess,
    prefill: {
      email: user.email,
      contact: user.phone
    }
  }
  
  const razorpay = new window.Razorpay(options)
  razorpay.open()
}
```

## Testing

### Run Tests
```bash
npm run test
```

### Build Check
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

## Debugging

### Enable Debug Logging
```typescript
// In components or API routes
console.log("[v0] Debug message:", data)
```

### Check Environment Variables
```bash
npm run env-check
```

### View Database Logs
1. Go to Supabase Dashboard
2. Navigate to Logs
3. Check SQL and API activity

## Performance Optimization

### Image Optimization
- Images are automatically optimized via Next.js Image component
- Use `next/image` for all images

### Database Queries
```typescript
// Good - with relations
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    machine:machines(name, brand),
    operator:operators(full_name, phone)
  `)

// Avoid - multiple queries
const bookings = await supabase.from('bookings').select('*')
const machines = await supabase.from('machines').select('*')
```

## Common Issues & Solutions

### Issue: Payment gateway not responding
**Solution:** Verify Razorpay credentials in `.env.local`

### Issue: Booking not appearing
**Solution:** Check RLS policies and user authentication

### Issue: GPS tracking not updating
**Solution:** Verify Supabase Realtime is enabled

### Issue: Build fails with TypeScript errors
**Solution:** Run `npm run type-check` and fix errors

## Next Steps

1. **Complete Setup** - Ensure all env vars are configured
2. **Test Flow** - Create test booking from start to end
3. **Verify Payment** - Test payment flow with Razorpay
4. **Deploy** - Push to GitHub and deploy to Vercel
5. **Monitor** - Set up error tracking and analytics

## Additional Resources

- **Documentation:** `/MACHINERY_BOOKING_IMPLEMENTATION.md`
- **API Reference:** Check individual route handlers
- **Component Docs:** JSDoc comments in component files
- **Database Schema:** Supabase tables documentation

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review error logs in Supabase dashboard
3. Contact the development team
4. Submit bug reports with detailed information

---

**Happy Building! 🚀**
