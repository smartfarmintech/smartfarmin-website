# API Route Implementation Examples

These examples show the pattern to follow when creating all 50+ API routes needed for production.

## Example 1: Farmer Registration & Login

### File: `app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone, user_type } =
      await request.json()

    // Validate input
    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.signUpWithPassword({
        email,
        password,
        options: {
          data: { user_type },
        },
      })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        phone,
        role_id: user_type === 'farmer' ? FARMER_ROLE_ID : OPERATOR_ROLE_ID,
      })

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Registration successful', user: authData.user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Registration error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### File: `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Log login
    await supabase.from('login_history').insert({
      user_id: data.user.id,
      status: 'success',
      ip_address: request.ip,
      user_agent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ session: data.session, user: data.user })
  } catch (error: any) {
    console.error('[v0] Login error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Example 2: Farmer CRUD Operations

### File: `app/api/farmers/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getFarmers, createFarmer } from '@/lib/supabase/queries'
import { createClient } from '@supabase/supabase-js'
import { checkAuth } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Get farmers with pagination
    const result = await getFarmers({ page, limit, search })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[v0] Get farmers error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { village_id, farmer_type, experience_years, registration_number } =
      await request.json()

    if (!village_id || !farmer_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const farmer = await createFarmer(userId, village_id, {
      farmer_type,
      experience_years: experience_years || 0,
      registration_number,
    })

    return NextResponse.json(farmer, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Create farmer error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### File: `app/api/farmers/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import {
  getFarmerById,
  updateFarmer,
  deleteFarmer,
} from '@/lib/supabase/queries'
import { checkAuth } from '@/lib/middleware/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmer = await getFarmerById(params.id)
    return NextResponse.json(farmer)
  } catch (error: any) {
    console.error('[v0] Get farmer error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const farmer = await updateFarmer(params.id, updates, userId)

    return NextResponse.json(farmer)
  } catch (error: any) {
    console.error('[v0] Update farmer error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const farmer = await deleteFarmer(params.id, userId)
    return NextResponse.json(farmer)
  } catch (error: any) {
    console.error('[v0] Delete farmer error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Example 3: Machinery Booking

### File: `app/api/bookings/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createBooking, getBookings } from '@/lib/supabase/queries'
import { checkAuth, getUserRole } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = await getUserRole(userId)
    const bookings = await getBookings(userId, role)

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error('[v0] Get bookings error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      machine_id,
      operator_id,
      starts_at,
      ends_at,
      units,
      unit_price,
      total_amount,
    } = await request.json()

    // Validate required fields
    if (!machine_id || !starts_at || !ends_at || !units || !unit_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await createBooking(userId, {
      machine_id,
      renter_id: userId,
      operator_id,
      starts_at,
      ends_at,
      units,
      unit_price,
      total_amount,
    })

    // Create notification
    // TODO: Send notification to machine owner

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Create booking error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Example 4: Payment Processing (Razorpay)

### File: `app/api/payments/create-order/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/middleware/auth'
import { createClient } from '@supabase/supabase-js'

const Razorpay = require('razorpay')

export async function POST(request: NextRequest) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { booking_id, amount, currency = 'INR' } = await request.json()

    if (!booking_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Create order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: booking_id,
      notes: {
        booking_id,
        user_id: userId,
      },
    })

    // Save payment request to database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: paymentReq, error } = await supabase
      .from('payment_requests')
      .insert({
        gateway_order_id: razorpayOrder.id,
        amount,
        currency,
        reference_id: booking_id,
        reference_type: 'booking',
        gateway: 'razorpay',
        user_id: userId,
        request_status: 'pending',
        created_by: userId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentReqId: paymentReq.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('[v0] Create payment order error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### File: `app/api/webhooks/razorpay/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, payload } = body

    // Verify webhook signature
    const signature = request.headers.get('x-razorpay-signature')!
    const key = process.env.RAZORPAY_KEY_SECRET!
    const hash = crypto
      .createHmac('sha256', key)
      .update(JSON.stringify(body))
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (event === 'payment.authorized') {
      const { payment } = payload

      // Update payment status
      await supabase
        .from('payment_requests')
        .update({
          gateway_payment_id: payment.id,
          request_status: 'completed',
        })
        .eq('gateway_order_id', payment.order_id)

      // Update booking status
      const { data: paymentReq } = await supabase
        .from('payment_requests')
        .select()
        .eq('gateway_order_id', payment.order_id)
        .single()

      if (paymentReq?.reference_type === 'booking') {
        await supabase
          .from('bookings')
          .update({
            booking_state: 'confirmed',
            payment_status: 'paid',
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', paymentReq.reference_id)

        // Create wallet transaction
        await supabase.from('wallet_transactions').insert({
          user_id: paymentReq.user_id,
          amount: paymentReq.amount,
          txn_type: 'debit',
          category: 'booking_payment',
          reference_type: 'booking',
          reference_id: paymentReq.reference_id,
          description: `Payment for booking ${paymentReq.reference_id}`,
          txn_status: 'completed',
          created_by: paymentReq.user_id,
        })
      }
    }

    return NextResponse.json({ status: 'success' })
  } catch (error: any) {
    console.error('[v0] Razorpay webhook error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Example 5: Notifications

### File: `app/api/notifications/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import {
  createNotification,
  getNotifications,
} from '@/lib/supabase/queries'
import { checkAuth } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const notifications = await getNotifications(userId, unreadOnly, limit)
    return NextResponse.json(notifications)
  } catch (error: any) {
    console.error('[v0] Get notifications error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, body, category, channel, action_url, image_url } =
      await request.json()

    if (!title || !body || !category || !channel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = await createNotification(userId, {
      title,
      body,
      category,
      channel,
      action_url,
      image_url,
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Create notification error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Pattern Summary

All API routes should follow this structure:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/middleware/auth'
import { supabaseServer } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    // 1. Check authentication (if required)
    const userId = await checkAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validate input (query params, request body)
    const { searchParams } = new URL(request.url)
    const requiredParam = searchParams.get('required_param')
    if (!requiredParam) {
      return NextResponse.json(
        { error: 'Missing required parameter' },
        { status: 400 }
      )
    }

    // 3. Execute database query
    const data = await supabaseServer
      .from('table_name')
      .select('*')
      .eq('user_id', userId)

    // 4. Return response
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[v0] Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Same pattern for POST, PUT, DELETE
  } catch (error: any) {
    // Error handling
  }
}
```

## Required Middleware Files

Create these helper files referenced in the examples:

### File: `lib/middleware/auth.ts`

```typescript
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function checkAuth(request: NextRequest): Promise<string | null> {
  const token = request.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.getUser(token)
  if (error) return null

  return data.user?.id || null
}

export async function getUserRole(userId: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('user_profiles')
    .select('role_id')
    .eq('id', userId)
    .single()

  // TODO: Fetch role name from roles table
  return 'farmer'
}
```

---

## Entities Requiring Similar Implementations

Apply this pattern to all these entities:

- ✅ Farmers (examples provided)
- ✅ Bookings (examples provided)
- ✅ Orders (examples provided)
- ✅ Payments (examples provided)
- ✅ Notifications (examples provided)
- Operators
- Machines
- Products
- Marketplace Orders
- Organic Products
- Schemes
- Applications
- Wallet
- Reviews
- Telecan CRM
- And 25+ more...

---

**Total Routes to Create**: ~50 API routes using this pattern
**Estimated Time**: 200-300 hours for complete backend
**Timeline**: 2-3 weeks with 2-3 developers
