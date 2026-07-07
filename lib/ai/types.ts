// Akanksha AI Module Types

export type Language = 'en' | 'te' | 'hi'
export type MessageRole = 'user' | 'assistant'
export type ContentType = 'text' | 'image' | 'voice'
export type AnalysisType = 'disease' | 'pest' | 'deficiency' | 'growth'

export interface AIMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  contentType: ContentType
  images?: string[]
  audioUrl?: string
  createdAt: Date
  tokens?: { prompt: number; completion: number }
  latency?: number
}

export interface AIConversation {
  id: string
  userId: string
  farmerId?: string
  title: string
  language: Language
  model: string
  messageCount: number
  lastMessageAt: Date
  isArchived: boolean
  channel: 'web' | 'mobile' | 'voice'
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface CropAnalysis {
  id: string
  conversationId: string
  farmerId: string
  imageUrl: string
  analysisType: AnalysisType
  detected: string
  confidence: number
  severity?: 'mild' | 'moderate' | 'severe'
  description: string
  treatment?: Treatment[]
  alternatives?: string[]
  status: 'pending' | 'completed' | 'error'
  metadata?: Record<string, any>
  createdAt: Date
}

export interface Treatment {
  name: string
  steps: string[]
  duration: string
  cost?: number
  effectiveness?: number
  isOrganic?: boolean
}

export interface Recommendation {
  id: string
  type: 'fertilizer' | 'irrigation' | 'pesticide' | 'crop' | 'scheme'
  title: string
  description: string
  details: Record<string, any>
  confidence: number
  basedOn?: string[]
  createdAt: Date
}

export interface VoiceRequest {
  id: string
  conversationId: string
  userId: string
  language: Language
  audioUrl: string
  transcript: string
  confidence: number
  duration: number
  status: 'processing' | 'completed' | 'error'
  createdAt: Date
}

export interface VoiceResponse {
  id: string
  messageId: string
  voiceRequestId: string
  language: Language
  textContent: string
  audioUrl: string
  voice: string
  duration: number
  status: 'generating' | 'completed' | 'error'
  createdAt: Date
}

export interface AIFeedback {
  id: string
  messageId: string
  conversationId: string
  rating: 1 | 2 | 3 | 4 | 5
  reason?: string
  comment?: string
  isHelpful?: boolean
  createdAt: Date
}

export interface DiseaseData {
  name: string
  symptoms: string[]
  treatment: Treatment[]
  preventiveMeasures: string[]
  lifeCycle: string
}

export interface FertilizerRecommendation {
  crop: string
  stage: string
  npk: { n: number; p: number; k: number }
  micronutrients?: string[]
  dosage: string
  timing: string
  application: string
  costPerAcre: number
}

export interface IrrigationAdvice {
  crop: string
  stage: string
  frequency: string
  duration: string
  waterRequirement: number
  method: string[]
  soilType: string
}

export interface AIReport {
  id: string
  conversationId: string
  farmerId: string
  cropName: string
  analysisDate: Date
  findings: string
  recommendations: Recommendation[]
  treatment?: Treatment
  pdfUrl?: string
  status: 'draft' | 'generated' | 'sent'
  createdAt: Date
}
