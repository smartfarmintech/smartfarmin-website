import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      machine_id,
      starts_at,
      ends_at,
      units,
      unit_type,
      total_amount,
      advance_amount,
      service_address,
      latitude,
      longitude,
      notes,
    } = body

    // Get farmer ID
    const { data: farmer, error: farmerError } = await supabase
      .from('farmers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (farmerError || !farmer) {
      return NextResponse.json(
        { error: 'Farmer profile not found' },
        { status: 400 }
      )
    }

    // Get machine and owner details
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .select('owner_id, category_id')
      .eq('id', machine_id)
      .single()

    if (machineError || !machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 400 }
      )
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now()}`

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          machine_id,
          owner_id: machine.owner_id,
          renter_id: farmer.id,
          booking_state: 'pending',
          payment_status: 'pending',
          starts_at,
          ends_at,
          units,
          unit_type,
          unit_price: total_amount / units,
          total_amount,
          advance_amount,
          service_address,
          latitude,
          longitude,
          notes,
          booking_number: bookingNumber,
          currency: 'INR',
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json(
        { error: bookingError.message },
        { status: 400 }
      )
    }

    // Create initial booking status
    await supabase
      .from('booking_status')
      .insert([
        {
          booking_id: booking.id,
          from_state: null,
          to_state: 'pending',
          changed_by: user.id,
          note: 'Booking created',
        },
      ])

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
