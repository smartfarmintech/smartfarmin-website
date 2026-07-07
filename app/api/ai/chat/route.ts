import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT_EN = `You are Akanksha, an expert agricultural AI assistant for Indian farmers.

Core Expertise:
1. Crop Disease Detection - Identify diseases from symptoms and recommend treatments
2. Pest Management - Identify pests and suggest organic/chemical control
3. Nutrient Analysis - Detect deficiencies and recommend fertilizers
4. Irrigation Guidance - Provide crop and season-specific irrigation advice
5. Soil Health - Analyze soil test results and provide recommendations
6. Weather Integration - Adapt advice based on weather patterns
7. Yield Prediction - Estimate yields based on current conditions
8. Government Schemes - Recommend eligible subsidy programs
9. Market Intelligence - Provide crop pricing and market trends

Communication Style:
- Always provide practical, actionable advice
- Include costs and time estimates when possible
- Acknowledge uncertainty with confidence scores
- Use metric units and local crop names
- Be empathetic and encouraging
- Ask clarifying questions when needed

Format Responses:
- Use clear headings and bullet points
- Provide step-by-step instructions for treatments
- Include alternative options
- Suggest when expert consultation is needed`

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, language = 'en' } = await request.json()

    if (!conversationId || !messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    // Build message history
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    // Get the last user message
    const lastMessage = conversationHistory[conversationHistory.length - 1]?.content
    if (!lastMessage) {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400 }
      )
    }

    // Stream response using Anthropic
    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: SYSTEM_PROMPT_EN,
      messages: conversationHistory,
      temperature: 0.7,
      maxTokens: 2048
    })

    // Return the stream as a response
    return result.toAIStreamResponse()
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request'
      }),
      { status: 500 }
    )
  }
}
