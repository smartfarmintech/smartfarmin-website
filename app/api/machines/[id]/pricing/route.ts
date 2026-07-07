import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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
    const {
      price,
      unit, // 'day', 'hour'
      min_units,
      max_units,
      fuel_included,
      valid_from,
      valid_until,
      season_start,
      season_end,
      operator_fee,
      name,
    } = body

    // Verify machine ownership
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .select('owner_id')
      .eq('id', id)
      .single()

    if (machineError || !machine) {
      return NextResponse.json(
        { error: 'Machine not found' },
        { status: 404 }
      )
    }

    // Verify operator
    const { data: operator, error: opError } = await supabase
      .from('operators')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (opError || operator?.id !== machine.owner_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Create pricing rule
    const { data: rule, error: ruleError } = await supabase
      .from('pricing_rules')
      .insert([
        {
          machine_id: id,
          name,
          price,
          unit,
          min_units,
          max_units,
          fuel_included,
          valid_from,
          valid_until,
          season_start,
          season_end,
          operator_fee,
          is_active: true,
          currency: 'INR',
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (ruleError) {
      return NextResponse.json(
        { error: ruleError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Pricing rule creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()

    const { data: rules, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('machine_id', id)
      .eq('is_active', true)
      .order('priority')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching pricing rules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
