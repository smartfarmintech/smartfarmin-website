import { generateText, streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import type { Language, AIMessage, CropAnalysis, Recommendation } from './types'

const SYSTEM_PROMPTS = {
  en: `You are Akanksha, an expert agricultural AI assistant for Indian farmers. 
Your knowledge covers:
- Crop disease detection and treatment
- Pest identification and control
- Nutrient deficiency analysis
- Fertilizer and irrigation recommendations
- Weather-based farming advice
- Government scheme eligibility
- Yield prediction and optimization

Always provide practical, actionable advice tailored to Indian farming conditions.
Use metric units. When giving recommendations, include cost and time estimates.
If confidence is low, acknowledge it and suggest expert consultation.`,

  te: `మీరు అకంక్ష, భారతీయ రైతుల కోసం నిపుణ వ్యవసాయ AI సహాయक.
మీ జ్ఞానం కవర్ చేస్తుంది:
- పంట వ్యాధి గుర్తింపు మరియు చికిత్స
- తీవ్ర సంక్రమణ పర్యవేక్షణ
- పోషక లోపం విశ్లేషణ
- సారవంత మరియు నీటిపారుదల సిఫారసులు
- వాతావరణ-ఆధారిత వ్యవసాయ సలహా
- ప్రభుత్వ స్కీమ్ సరిపోతకుండా
- దిగుబడి సూచన ఆప్టిమైజేషన

ఎల్లప్పుడు ఆచరణీయ, కార్యరూప సలహా ఇవ్వండి.`,

  hi: `आप अकांक्षा हैं, भारतीय किसानों के लिए एक विशेषज्ञ कृषि एआई सहायक।
आपका ज्ञान शामिल है:
- फसल रोग का पता लगाना और उपचार
- कीट पहचान और नियंत्रण
- पोषक तत्व की कमी विश्लेषण
- उर्वरक और सिंचाई की सिफारिशें
- मौसम आधारित खेती की सलाह
- सरकारी योजना पात्रता
- उपज भविष्यवाणी और अनुकूलन

हमेशा व्यावहारिक, कार्यरत सलाह दें जो भारतीय कृषि को अनुकूल हो।`
}

export class AkanshaAIService {
  private supabase = null as any

  async initialize() {
    this.supabase = await createClient()
  }

  async saveConversation(
    userId: string,
    title: string,
    language: Language = 'en'
  ) {
    if (!this.supabase) await this.initialize()

    const { data, error } = await this.supabase
      .from('ai_conversations')
      .insert([
        {
          user_id: userId,
          title,
          language,
          model: 'claude-3-5-sonnet',
          message_count: 0,
          channel: 'web',
          created_at: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: Record<string, any>
  ) {
    if (!this.supabase) await this.initialize()

    const { data, error } = await this.supabase
      .from('ai_messages')
      .insert([
        {
          conversation_id: conversationId,
          role,
          content,
          metadata,
          created_at: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async streamChat(
    conversationId: string,
    userMessage: string,
    language: Language = 'en'
  ) {
    const systemPrompt = SYSTEM_PROMPTS[language]

    // Get conversation history
    if (!this.supabase) await this.initialize()

    const { data: messages } = await this.supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    const conversationHistory = (messages || []).map(
      (msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })
    )

    return streamText({
      model: 'claude-3-5-sonnet',
      system: systemPrompt,
      messages: [...conversationHistory, { role: 'user', content: userMessage }],
      temperature: 0.7,
      maxTokens: 2048
    })
  }

  async analyzeCropImage(
    imageUrl: string,
    conversationId: string,
    farmerId: string,
    analysisType: 'disease' | 'pest' | 'deficiency'
  ): Promise<CropAnalysis> {
    if (!this.supabase) await this.initialize()

    const result = await generateText({
      model: 'claude-3-5-sonnet',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: imageUrl }
            },
            {
              type: 'text',
              text: `Analyze this crop image for ${analysisType}. Provide:
              1. What was detected
              2. Confidence (0-100)
              3. Severity (mild/moderate/severe)
              4. Description
              5. Treatment steps
              6. Alternative treatments
              
              Format as JSON.`
            }
          ]
        }
      ]
    })

    try {
      const analysis = JSON.parse(result.text)
      const { data, error } = await this.supabase
        .from('crop_analysis')
        .insert([
          {
            conversation_id: conversationId,
            farmer_id: farmerId,
            image_url: imageUrl,
            analysis_type: analysisType,
            detected: analysis.detected,
            confidence: analysis.confidence,
            severity: analysis.severity,
            description: analysis.description,
            treatment: analysis.treatment,
            alternatives: analysis.alternatives,
            status: 'completed',
            created_at: new Date()
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Crop analysis error:', err)
      throw new Error('Failed to analyze crop image')
    }
  }

  async getFertilizerRecommendation(
    cropName: string,
    growthStage: string,
    soilTest?: Record<string, any>
  ) {
    const prompt = `
    Based on the following information, provide fertilizer recommendations:
    - Crop: ${cropName}
    - Growth Stage: ${growthStage}
    - Soil Test Results: ${JSON.stringify(soilTest || {})}
    
    Provide NPK ratio, micronutrients, dosage, timing, and cost estimates.
    Format as JSON.
    `

    const result = await generateText({
      model: 'claude-3-5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    })

    return JSON.parse(result.text)
  }

  async getIrrigationAdvice(
    cropName: string,
    growthStage: string,
    soilType: string,
    rainfall?: number
  ) {
    const prompt = `
    Provide irrigation recommendations for:
    - Crop: ${cropName}
    - Growth Stage: ${growthStage}
    - Soil Type: ${soilType}
    - Recent Rainfall: ${rainfall}mm
    
    Include: frequency, duration, water requirement, methods, and soil moisture indicators.
    Format as JSON.
    `

    const result = await generateText({
      model: 'claude-3-5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    })

    return JSON.parse(result.text)
  }

  async getGovernmentSchemeRecommendations(
    farmerProfile: Record<string, any>,
    cropInfo: Record<string, any>
  ): Promise<Recommendation[]> {
    if (!this.supabase) await this.initialize()

    // Get eligible schemes
    const { data: schemes } = await this.supabase
      .from('schemes')
      .select('id, name, code, benefits(*), eligibility(*)')
      .eq('status', 'active')
      .limit(20)

    const prompt = `
    Based on farmer profile: ${JSON.stringify(farmerProfile)}
    And crop info: ${JSON.stringify(cropInfo)}
    And available schemes: ${JSON.stringify(schemes)}
    
    Recommend the top 5 most suitable government schemes with reasons.
    Format as JSON array with scheme_id, title, reason, and benefit_amount.
    `

    const result = await generateText({
      model: 'claude-3-5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    })

    const recommendations = JSON.parse(result.text)
    return recommendations.map((rec: any) => ({
      type: 'scheme' as const,
      title: rec.title,
      description: rec.reason,
      details: rec,
      confidence: 0.85
    }))
  }

  async generateReport(conversationId: string, farmerId: string, cropName: string) {
    if (!this.supabase) await this.initialize()

    const { data: messages } = await this.supabase
      .from('ai_messages')
      .select('content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    const conversationSummary = (messages || [])
      .map((m: any) => m.content)
      .join('\n\n')

    const prompt = `
    Generate a comprehensive farming report based on this AI conversation:
    ${conversationSummary}
    
    Include: Summary, Findings, Recommendations, Treatment Plan (if applicable), Success Rate, and Cost Estimate.
    Format as structured text suitable for PDF export.
    `

    const result = await generateText({
      model: 'claude-3-5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      maxTokens: 2000
    })

    const { data, error } = await this.supabase
      .from('ai_reports')
      .insert([
        {
          conversation_id: conversationId,
          farmer_id: farmerId,
          crop_name: cropName,
          findings: result.text,
          analysis_date: new Date(),
          status: 'generated',
          created_at: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async saveFeedback(
    messageId: string,
    conversationId: string,
    rating: 1 | 2 | 3 | 4 | 5,
    reason?: string
  ) {
    if (!this.supabase) await this.initialize()

    const { data, error } = await this.supabase
      .from('ai_feedback')
      .insert([
        {
          message_id: messageId,
          conversation_id: conversationId,
          rating,
          reason,
          created_at: new Date()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const akanshaAI = new AkanshaAIService()
