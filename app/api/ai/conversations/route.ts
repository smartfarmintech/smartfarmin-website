import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { title, language = 'en' } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get farmer ID
    const { data: farmer } = await supabase
      .from('farmers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert([
        {
          user_id: user.id,
          farmer_id: farmer?.id,
          title: title || `Chat - ${new Date().toLocaleDateString()}`,
          language,
          model: 'claude-3-5-sonnet',
          message_count: 0,
          channel: 'web',
          created_at: new Date(),
          last_message_at: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
