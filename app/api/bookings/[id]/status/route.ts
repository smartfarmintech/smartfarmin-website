import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    const { booking_state, note } = body

    const validStates = ['pending', 'confirmed', 'started', 'completed', 'cancelled']
    if (!validStates.includes(booking_state)) {
      return NextResponse.json(
        { error: 'Invalid booking state' },
        { status: 400 }
      )
    }

    // Get current booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('booking_state')
      .eq('id', id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking state
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_state,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    // Create status history
    await supabase
      .from('booking_status')
      .insert([
        {
          booking_id: id,
          from_state: booking.booking_state,
          to_state: booking_state,
          changed_by: user.id,
          note: note || `Booking ${booking_state}`,
        },
      ])

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Booking status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
