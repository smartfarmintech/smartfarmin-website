import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { akanshaAI } from '@/lib/ai/service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const conversationId = formData.get('conversationId') as string
    const analysisType = (formData.get('analysisType') as string) || 'disease'

    if (!file || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get farmer ID
    const { data: farmer } = await supabase
      .from('farmers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer profile not found' },
        { status: 404 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Initialize AI service
    await akanshaAI.initialize()

    // Analyze image
    const analysis = await akanshaAI.analyzeCropImage(
      dataUrl,
      conversationId,
      farmer.id,
      analysisType as 'disease' | 'pest' | 'deficiency'
    )

    // Format response for chat
    const analysisText = `
**Analysis Result: ${analysis.detected}**

**Confidence:** ${(analysis.confidence * 100).toFixed(0)}%
**Severity:** ${analysis.severity}

**Description:**
${analysis.description}

**Recommended Treatment:**
${Array.isArray(analysis.treatment) ? analysis.treatment[0]?.name || 'N/A' : analysis.treatment?.name || 'N/A'}
- Duration: ${Array.isArray(analysis.treatment) ? analysis.treatment[0]?.duration || 'N/A' : analysis.treatment?.duration || 'N/A'}
- Cost: ₹${Array.isArray(analysis.treatment) ? analysis.treatment[0]?.cost || 'TBD' : analysis.treatment?.cost || 'TBD'}
- Effectiveness: ${Array.isArray(analysis.treatment) ? analysis.treatment[0]?.effectiveness : analysis.treatment?.effectiveness}%

${analysis.alternatives && analysis.alternatives.length > 0 ? 
`**Alternative Treatments:**
${analysis.alternatives.map((alt, i) => `${i + 1}. ${alt}`).join('\n')}` 
: ''}

Would you like more detailed information about the treatment or preventive measures?
    `.trim()

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      data: analysis
    })
  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
