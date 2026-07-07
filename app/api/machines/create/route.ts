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
      name,
      brand,
      model,
      category_id,
      registration_no,
      power_hp,
      fuel,
      latitude,
      longitude,
      service_radius_km,
      base_location,
      operator_included,
      specifications,
    } = body

    // Get operator (owner) details
    const { data: operator, error: operatorError } = await supabase
      .from('operators')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (operatorError || !operator) {
      return NextResponse.json(
        { error: 'Operator profile not found' },
        { status: 400 }
      )
    }

    // Create machine
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .insert([
        {
          name,
          brand,
          model,
          category_id,
          registration_no,
          power_hp,
          fuel,
          latitude,
          longitude,
          service_radius_km,
          base_location,
          operator_included,
          specifications,
          owner_id: operator.id,
          machine_status: 'available',
          status: 'available',
          slug: `${brand.toLowerCase()}-${model.toLowerCase()}`,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (machineError) {
      return NextResponse.json(
        { error: machineError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(machine, { status: 201 })
  } catch (error) {
    console.error('Machine creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
