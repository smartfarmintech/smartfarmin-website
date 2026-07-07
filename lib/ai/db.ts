import { createClient } from '@/lib/supabase/server'

export async function ensureAITables() {
  const supabase = await createClient()

  // Create ai_conversations table
  try {
    await supabase.from('ai_conversations').select('id').limit(1)
  } catch {
    // Table likely doesn't exist, would be created by migration
  }

  // Create ai_messages table
  try {
    await supabase.from('ai_messages').select('id').limit(1)
  } catch {
    // Table likely doesn't exist, would be created by migration
  }

  // Create ai_reports table
  try {
    await supabase.from('ai_reports').select('id').limit(1)
  } catch {
    // Table likely doesn't exist, would be created by migration
  }

  // Create crop_analysis table
  try {
    await supabase.from('crop_analysis').select('id').limit(1)
  } catch {
    // Table likely doesn't exist, would be created by migration
  }

  return true
}

export async function getConversations(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

export async function createConversation(userId: string, title: string, language: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert([
      {
        user_id: userId,
        title,
        language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  return data?.[0] || null
}

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  tokens?: number
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_messages')
    .insert([
      {
        conversation_id: conversationId,
        role,
        content,
        tokens: tokens || 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error saving message:', error)
    return null
  }

  return data?.[0] || null
}

export async function saveCropAnalysis(
  userId: string,
  imagePath: string,
  analysis: {
    disease?: string
    confidence?: number
    recommendations?: string[]
    treatment?: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('crop_analysis')
    .insert([
      {
        user_id: userId,
        image_path: imagePath,
        analysis_result: analysis,
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error saving crop analysis:', error)
    return null
  }

  return data?.[0] || null
}

export async function getRecommendations(userId: string, limit: number = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('report_type', 'recommendation')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }

  return data || []
}

export async function saveReport(
  userId: string,
  reportType: string,
  title: string,
  content: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_reports')
    .insert([
      {
        user_id: userId,
        report_type: reportType,
        title,
        content,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error saving report:', error)
    return null
  }

  return data?.[0] || null
}
