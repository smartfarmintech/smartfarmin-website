/**
 * AI Crop Doctor Service
 * Complete disease, pest, and deficiency detection using Vercel AI SDK
 */

import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

// Disease Detection Schema
const DiseaseSchema = z.object({
  predictedDisease: z.string().describe("Disease name"),
  confidence: z.number().min(0).max(100).describe("Confidence percentage"),
  severity: z.enum(["mild", "moderate", "severe"]).describe("Severity level"),
  affectedArea: z.number().min(0).max(100).describe("Percentage of crop affected"),
  treatment: z.array(z.object({
    step: z.number(),
    action: z.string(),
    duration: z.string(),
    materials: z.array(z.string()),
  })).describe("Step-by-step treatment plan"),
  alternatives: z.array(z.object({
    method: z.string(),
    effectiveness: z.number(),
    costEstimate: z.string(),
  })).describe("Alternative treatments"),
  preventive: z.array(z.string()).describe("Prevention measures for future"),
  daysToRecovery: z.number().describe("Estimated days to full recovery"),
  riskOfSpread: z.enum(["low", "medium", "high"]).describe("Risk to surrounding crops"),
})

// Pest Detection Schema
const PestSchema = z.object({
  identifiedPests: z.array(z.object({
    pestName: z.string(),
    confidence: z.number(),
    riskLevel: z.enum(["low", "medium", "high"]),
    populationEstimate: z.string(),
  })).describe("Identified pests"),
  lifecycle: z.object({
    currentStage: z.string(),
    nextStage: z.string(),
    daysToNext: z.number(),
  }).describe("Pest lifecycle information"),
  controlMethods: z.array(z.object({
    method: z.string(),
    type: z.enum(["organic", "chemical", "mechanical"]),
    effectiveness: z.number(),
    application: z.string(),
    safetyPrecautions: z.array(z.string()),
  })).describe("Control methods"),
  reentryPeriod: z.number().describe("Days before crop is safe to enter after treatment"),
})

// Nutrient Deficiency Schema
const DeficiencySchema = z.object({
  deficiencies: z.array(z.object({
    nutrient: z.enum(["N", "P", "K", "Mg", "Ca", "S", "Fe", "Zn", "Mn"]),
    severity: z.enum(["mild", "moderate", "severe"]),
    symptoms: z.array(z.string()),
    confidence: z.number(),
  })).describe("Nutrient deficiencies identified"),
  recommendations: z.array(z.object({
    nutrient: z.string(),
    npkRatio: z.string(),
    applicationRate: z.string(),
    applicationMethod: z.enum(["foliar", "soil", "drip"]),
    frequency: z.string(),
    costPerApplication: z.number(),
  })).describe("Fertilizer recommendations"),
  soilTest: z.object({
    urgency: z.enum(["low", "medium", "high"]),
    recommendedLab: z.string(),
    estimatedCost: z.number(),
  }).describe("Soil test recommendation"),
  expectedYieldIncrease: z.number().describe("Expected yield increase percentage"),
})

// Growth Stage Schema
const GrowthStageSchema = z.object({
  currentStage: z.enum(["seedling", "vegetative", "flowering", "fruiting", "maturity"]),
  daysInStage: z.number(),
  daysToNextStage: z.number(),
  stageCharacteristics: z.array(z.string()),
  managementTips: z.array(z.string()),
  expectedHeight: z.string(),
  waterRequirement: z.string(),
  nitrogenRequirement: z.string(),
})

export interface DiseaseDetectionRequest {
  imageUrl: string
  cropName: string
  farmerId: string
  conversationId?: string
}

export interface PestDetectionRequest {
  imageUrl: string
  cropName: string
  farmerId: string
  conversationId?: string
}

export interface DeficiencyDetectionRequest {
  imageUrl: string
  cropName: string
  soilType?: string
  farmerId: string
  conversationId?: string
}

/**
 * Detect diseases from crop image
 */
export async function detectDisease(req: DiseaseDetectionRequest) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema: DiseaseSchema,
    prompt: `Analyze this crop image and identify any diseases present.
    
Image URL: ${req.imageUrl}
Crop: ${req.cropName}

Provide:
1. Disease name with confidence score
2. Severity assessment (mild/moderate/severe)
3. Percentage of crop affected
4. Step-by-step treatment plan with materials needed
5. Alternative treatments with effectiveness ratings
6. Preventive measures
7. Estimated recovery time
8. Risk of spread to surrounding crops

If no disease detected, indicate healthy crop status with high confidence.`,
  })
  
  return {
    ...object,
    farmerId: req.farmerId,
    conversationId: req.conversationId,
    analyzedAt: new Date(),
    model: "claude-3-5-sonnet",
  }
}

/**
 * Detect pests from crop image
 */
export async function detectPests(req: PestDetectionRequest) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema: PestSchema,
    prompt: `Analyze this crop image and identify any pest infestations.
    
Image URL: ${req.imageUrl}
Crop: ${req.cropName}

Provide:
1. List of identified pests with confidence scores
2. Population estimate and risk levels
3. Current pest lifecycle stage and timeline to next stage
4. Organic and chemical control methods with effectiveness ratings
5. Safety precautions and reentry periods
6. Cost estimates for different approaches

If no pests detected, provide recommendation for preventive measures.`,
  })
  
  return {
    ...object,
    farmerId: req.farmerId,
    conversationId: req.conversationId,
    analyzedAt: new Date(),
    model: "claude-3-5-sonnet",
  }
}

/**
 * Detect nutrient deficiencies
 */
export async function detectDeficiencies(req: DeficiencyDetectionRequest) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema: DeficiencySchema,
    prompt: `Analyze this crop image and identify nutrient deficiencies.
    
Image URL: ${req.imageUrl}
Crop: ${req.cropName}
Soil Type: ${req.soilType || "unknown"}

Provide:
1. Specific nutrient deficiencies with severity levels
2. Visual symptoms showing each deficiency
3. Recommended fertilizer applications with NPK ratios
4. Application methods (foliar, soil drip) with rates
5. Soil test recommendations and urgency
6. Expected yield increase with proper nutrition

Consider crop stage and soil type in recommendations.`,
  })
  
  return {
    ...object,
    farmerId: req.farmerId,
    conversationId: req.conversationId,
    analyzedAt: new Date(),
    model: "claude-3-5-sonnet",
  }
}

/**
 * Analyze growth stage from image
 */
export async function analyzeGrowthStage(cropName: string, imageUrl: string, farmerId: string) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    schema: GrowthStageSchema,
    prompt: `Analyze the growth stage of this ${cropName} crop from the image.
    
Image URL: ${imageUrl}

Provide:
1. Current growth stage (seedling/vegetative/flowering/fruiting/maturity)
2. Estimated days in current stage
3. Days until next growth stage
4. Key characteristics visible in image
5. Stage-specific management tips
6. Expected height at this stage
7. Water and nitrogen requirements for this stage`,
  })
  
  return {
    ...object,
    farmerId,
    analyzedAt: new Date(),
    model: "claude-3-5-sonnet",
  }
}

/**
 * Comprehensive crop analysis combining all detection methods
 */
export async function comprehensiveCropAnalysis(
  imageUrl: string,
  cropName: string,
  farmerId: string,
  soilType?: string
) {
  try {
    // Run all analyses in parallel
    const [disease, pests, deficiencies, growthStage] = await Promise.all([
      detectDisease({ imageUrl, cropName, farmerId }),
      detectPests({ imageUrl, cropName, farmerId }),
      detectDeficiencies({ imageUrl, cropName, farmerId, soilType }),
      analyzeGrowthStage(cropName, imageUrl, farmerId),
    ])

    // Generate actionable recommendations
    const recommendations = generateRecommendations({
      disease,
      pests,
      deficiencies,
      growthStage,
    })

    return {
      cropName,
      farmerId,
      analyzedAt: new Date(),
      disease,
      pests,
      deficiencies,
      growthStage,
      recommendations,
      overallHealthScore: calculateHealthScore({ disease, pests, deficiencies }),
      nextActions: prioritizeActions({ disease, pests, deficiencies, growthStage }),
    }
  } catch (error) {
    console.error("[v0] AI Crop Doctor analysis error:", error)
    throw new Error("Failed to analyze crop image. Please try again.")
  }
}

/**
 * Generate actionable recommendations from analysis
 */
function generateRecommendations(analysis: any) {
  const recommendations = []

  // Disease recommendations
  if (analysis.disease && analysis.disease.confidence > 70) {
    recommendations.push({
      type: "disease",
      priority: "high",
      action: analysis.disease.treatment[0]?.action || "Consult with agricultural expert",
      urgency: analysis.disease.severity === "severe" ? "immediate" : "soon",
      estimatedCost: "varies",
    })
  }

  // Pest recommendations
  if (analysis.pests && analysis.pests.identifiedPests?.length > 0) {
    const maxRisk = analysis.pests.identifiedPests[0]?.riskLevel
    recommendations.push({
      type: "pest",
      priority: maxRisk === "high" ? "high" : "medium",
      action: analysis.pests.controlMethods[0]?.method || "Monitor closely",
      urgency: maxRisk === "high" ? "immediate" : "within-week",
      estimatedCost: "varies",
    })
  }

  // Nutrient recommendations
  if (analysis.deficiencies && analysis.deficiencies.deficiencies?.length > 0) {
    recommendations.push({
      type: "nutrition",
      priority: analysis.deficiencies.deficiencies[0]?.severity === "severe" ? "high" : "medium",
      action: `Apply ${analysis.deficiencies.recommendations[0]?.npkRatio || "balanced"} fertilizer`,
      urgency: analysis.deficiencies.deficiencies[0]?.severity === "severe" ? "immediate" : "within-2-weeks",
      estimatedCost: analysis.deficiencies.recommendations[0]?.costPerApplication || "varies",
    })
  }

  // Growth stage recommendations
  if (analysis.growthStage) {
    recommendations.push({
      type: "management",
      priority: "medium",
      action: analysis.growthStage.managementTips[0] || "Continue regular care",
      urgency: "ongoing",
      estimatedCost: "minimal",
    })
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
  })
}

/**
 * Calculate overall crop health score
 */
function calculateHealthScore(analysis: any) {
  let score = 100

  if (analysis.disease?.confidence > 70) {
    score -= analysis.disease.severity === "severe" ? 40 : analysis.disease.severity === "moderate" ? 20 : 10
  }

  if (analysis.pests?.identifiedPests?.length > 0) {
    const maxRisk = analysis.pests.identifiedPests[0]?.riskLevel
    score -= maxRisk === "high" ? 30 : maxRisk === "medium" ? 15 : 5
  }

  if (analysis.deficiencies?.deficiencies?.length > 0) {
    const maxSeverity = analysis.deficiencies.deficiencies[0]?.severity
    score -= maxSeverity === "severe" ? 20 : maxSeverity === "moderate" ? 10 : 5
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Prioritize next actions for farmer
 */
function prioritizeActions(analysis: any) {
  const actions = []

  if (analysis.disease && analysis.disease.severity === "severe") {
    actions.push("🚨 URGENT: Start disease treatment immediately")
  }

  if (analysis.pests?.identifiedPests?.some((p: any) => p.riskLevel === "high")) {
    actions.push("⚠️ HIGH PRIORITY: Control pest infestation this week")
  }

  if (analysis.deficiencies?.deficiencies?.some((d: any) => d.severity === "severe")) {
    actions.push("📋 Apply recommended fertilizer within 3 days")
  }

  if (analysis.growthStage) {
    actions.push(`💧 ${analysis.growthStage.waterRequirement}`)
  }

  return actions
}

export type { DiseaseSchema, PestSchema, DeficiencySchema, GrowthStageSchema }
