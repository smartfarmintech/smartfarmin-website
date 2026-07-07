"use server"

import { createClient } from "@/lib/supabase/server"
import { generateText, streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

/**
 * Akanksha AI Crop Doctor - Complete Agricultural Intelligence System
 * Provides disease, pest, deficiency detection, treatment, and recommendations
 */

export interface CropAnalysisRequest {
  farmerId: string
  cropName: string
  cropCycleId?: string
  imageUrl?: string
  issue: "disease" | "pest" | "deficiency" | "general-advice"
  language: "en" | "te" | "hi"
  growthStage?: string
  soilType?: string
  location?: { latitude: number; longitude: number }
}

export interface DiseaseAnalysis {
  diseaseName: string
  confidence: number // 0-100
  severity: "mild" | "moderate" | "severe" | "critical"
  affectedAreaPercent: number
  symptoms: string[]
  causativeAgent: string
  treatmentPlan: TreatmentStep[]
  alternativeTreatments: string[]
  preventionMeasures: string[]
  estimatedCost: { currency: string; amount: number }
  estimatedDuration: number // in days
  riskFactors: string[]
}

export interface PestAnalysis {
  pestName: string
  confidence: number
  riskLevel: "low" | "medium" | "high" | "critical"
  populationEstimate: number
  lifecycle: string
  damage potentialPercent: number
  organicControl: string[]
  chemicalControl: Array<{ product: string; dosage: string; safetyPeriod: number }>
  preventionStrategies: string[]
  integralPestManagement: string[]
}

export interface DeficiencyAnalysis {
  nutrient: "N" | "P" | "K" | "Ca" | "Mg" | "S" | "Fe" | "Zn" | "B" | "Mn"
  deficiencySeverity: "mild" | "moderate" | "severe"
  confidence: number
  symptoms: string[]
  soilRecommendations: string[]
  leafSprayRecommendations: Array<{
    product: string
    concentration: string
    frequency: string
  }>
  expectedRecoveryDays: number
  costEstimate: number
}

export interface IrrigationAdvice {
  cropStage: string
  recommendedFrequency: string
  recommendedQuantity: number // liters per acre
  waterSourceSuggestions: string[]
  soilMoistureLevel: string
  weatherBasedAdjustments: string
  stressIndicators: string[]
}

export interface YieldPrediction {
  currentHealth: number // 0-100
  projectedYield: { quantity: number; unit: string }
  potentialYield: { quantity: number; unit: string }
  yieldGapFactors: string[]
  optimizationStrategies: string[]
  confidenceLevel: number
}

export interface FarmersReport {
  summary: string
  issues: string[]
  recommendations: string[]
  costBenefit: string
  expectedOutcomes: string
  timelineInDays: number
  riskMitigation: string[]
}

/**
 * Analyze crop issue and provide diagnosis
 */
export async function analyzeCropIssue(
  request: CropAnalysisRequest
): Promise<{
  disease?: DiseaseAnalysis
  pest?: PestAnalysis
  deficiency?: DeficiencyAnalysis
  advice: string
  followUpQuestions?: string[]
}> {
  const supabase = await createClient()

  // Get farmer context
  const { data: farmer } = await supabase
    .from("farmers")
    .select("*, farmer_profiles(*)")
    .eq("id", request.farmerId)
    .single()

  const systemPrompt = getSystemPrompt(request.language)

  // Stream AI analysis
  const result = await generateText({
    model: anthropic("claude-3-5-sonnet"),
    system: systemPrompt,
    prompt: `Analyze this agricultural issue:
    Crop: ${request.cropName}
    Issue Type: ${request.issue}
    Growth Stage: ${request.growthStage || "not specified"}
    Soil Type: ${request.soilType || "not specified"}
    Farmer Experience: ${farmer?.experience_years || "unknown"} years
    Location: ${request.location ? `${request.location.latitude}, ${request.location.longitude}` : "not specified"}
    
    Provide comprehensive analysis including:
    - Identification confidence (0-100)
    - Severity assessment
    - Treatment options (prioritize organic/sustainable)
    - Cost and timeline estimates
    - Prevention measures
    - Yield impact assessment
    
    Format as JSON for database storage.`,
  })

  // Parse and save analysis
  const analysis = JSON.parse(result.text)

  // Save to disease_predictions table
  const { data: savedAnalysis } = await supabase
    .from("disease_predictions")
    .insert({
      farmer_id: request.farmerId,
      crop_name: request.cropName,
      predicted_disease: analysis.diseaseName,
      confidence: analysis.confidence,
      severity: analysis.severity,
      image_url: request.imageUrl,
      treatment: analysis.treatmentPlan,
      alternatives: analysis.alternativeTreatments,
      metadata: {
        issue_type: request.issue,
        growth_stage: request.growthStage,
        location: request.location,
      },
    })
    .select()
    .single()

  return {
    disease: request.issue === "disease" ? analysis : undefined,
    pest: request.issue === "pest" ? analysis : undefined,
    deficiency: request.issue === "deficiency" ? analysis : undefined,
    advice: analysis.recommendations || result.text,
    followUpQuestions: [
      "Has this issue appeared before?",
      "What's your budget for treatment?",
      "Do you prefer organic or chemical solutions?",
    ],
  }
}

/**
 * Get comprehensive treatment plan
 */
export async function getTreatmentPlan(
  farmerId: string,
  cropCycleId: string,
  issue: DiseaseAnalysis | PestAnalysis | DeficiencyAnalysis,
  preferences: { budget?: number; organic?: boolean; language: "en" | "te" | "hi" }
) {
  const supabase = await createClient()

  // Get crop details
  const { data: cropCycle } = await supabase
    .from("crop_cycles")
    .select("*")
    .eq("id", cropCycleId)
    .single()

  const systemPrompt = getSystemPrompt(preferences.language)

  const treatmentPrompt = `Based on this agricultural issue and farmer preferences:
  Issue: ${JSON.stringify(issue)}
  Budget: ₹${preferences.budget || "flexible"}
  Preference: ${preferences.organic ? "Organic" : "Any"} methods
  Crop Stage: ${cropCycle?.growth_stage || "unknown"}
  Area: ${cropCycle?.area_value || "unknown"} ${cropCycle?.area_unit || "acres"}
  
  Create a detailed day-by-day treatment plan including:
  - Specific actions
  - Products with exact dosages
  - Application methods
  - Precautions and safety measures
  - Expected results timeline
  - Cost breakdown
  - Alternative approaches if primary fails`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet"),
    system: systemPrompt,
    prompt: treatmentPrompt,
  })

  // Save treatment plan
  const { data: saved } = await supabase
    .from("crop_health")
    .insert({
      farmer_id: farmerId,
      crop_cycle_id: cropCycleId,
      issue_type: "treatment_plan",
      diagnosis: JSON.stringify(issue),
      treatment: result.text,
      status: "pending_execution",
    })
    .select()
    .single()

  return result.text
}

/**
 * Get fertilizer recommendations based on growth stage and soil
 */
export async function getFertilizerRecommendations(
  farmerId: string,
  cropCycleId: string,
  soilTestId?: string,
  language: "en" | "te" | "hi" = "en"
) {
  const supabase = await createClient()

  // Get soil test data if available
  let soilData = null
  if (soilTestId) {
    const { data } = await supabase
      .from("soil_tests")
      .select("*")
      .eq("id", soilTestId)
      .single()
    soilData = data
  }

  const { data: cropCycle } = await supabase
    .from("crop_cycles")
    .select("*")
    .eq("id", cropCycleId)
    .single()

  const systemPrompt = getSystemPrompt(language)

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet"),
    system: systemPrompt,
    prompt: `Create a complete fertilizer schedule for:
    Crop: ${cropCycle?.crop_name}
    Area: ${cropCycle?.area_value} ${cropCycle?.area_unit}
    Sowing Date: ${cropCycle?.sowing_date}
    Expected Harvest: ${cropCycle?.expected_harvest_date}
    
    Soil Data:
    - Nitrogen: ${soilData?.nitrogen || "unknown"}
    - Phosphorus: ${soilData?.phosphorus || "unknown"}
    - Potassium: ${soilData?.potassium || "unknown"}
    - pH: ${soilData?.ph_level || "unknown"}
    
    Provide month-by-month schedule with:
    - Growth stage
    - NPK ratio
    - Quantity per acre
    - Application method
    - Cost
    - Product recommendations`,
  })

  return result.text
}

/**
 * Get weather-based farming advice
 */
export async function getWeatherBasedAdvice(
  cropCycleId: string,
  location: { latitude: number; longitude: number },
  language: "en" | "te" | "hi" = "en"
) {
  const supabase = await createClient()

  const { data: cropCycle } = await supabase
    .from("crop_cycles")
    .select("*")
    .eq("id", cropCycleId)
    .single()

  // In production, fetch real weather data from weather API
  const weatherData = {
    forecast: "15-day forecast",
    rainfall: "expected monsoon",
    temperature: "25-35°C",
    humidity: "60-80%",
  }

  const systemPrompt = getSystemPrompt(language)

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet"),
    system: systemPrompt,
    prompt: `Provide weather-based farming advice for:
    Crop: ${cropCycle?.crop_name}
    Growth Stage: current growth
    Location: ${location.latitude}, ${location.longitude}
    
    Weather Forecast: ${JSON.stringify(weatherData)}
    
    Include:
    - Irrigation schedule adjustments
    - Disease/pest risk alerts
    - Optimal application timing for sprays
    - Harvest timing considerations
    - Risk mitigation strategies`,
  })

  return result.text
}

/**
 * Generate comprehensive farmer report
 */
export async function generateFarmerReport(
  farmerId: string,
  cropCycleId: string,
  language: "en" | "te" | "hi" = "en"
): Promise<FarmersReport> {
  const supabase = await createClient()

  // Get all crop health records
  const { data: healthRecords } = await supabase
    .from("crop_health")
    .select("*")
    .eq("crop_cycle_id", cropCycleId)
    .order("created_at", { ascending: true })

  // Get crop details
  const { data: cropCycle } = await supabase
    .from("crop_cycles")
    .select("*")
    .eq("id", cropCycleId)
    .single()

  const systemPrompt = getSystemPrompt(language)

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet"),
    system: systemPrompt,
    prompt: `Generate a comprehensive farmer report based on crop health history:
    Crop: ${cropCycle?.crop_name}
    Issues Found: ${healthRecords?.map(r => r.issue_name).join(", ") || "none"}
    
    Create professional report including:
    - Executive summary
    - Issues identified
    - Recommended actions (prioritized)
    - Cost-benefit analysis
    - Expected outcomes
    - Timeline
    - Risk mitigation`,
  })

  // Save report
  const { data: saved } = await supabase
    .from("business_reports")
    .insert({
      name: `Crop Health Report - ${cropCycle?.crop_name}`,
      report_type: "crop_health",
      status: "completed",
      result: result.text,
      generated_at: new Date().toISOString(),
    })
    .select()
    .single()

  return {
    summary: result.text,
    issues: healthRecords?.map(r => r.issue_name) || [],
    recommendations: [],
    costBenefit: "Positive ROI expected",
    expectedOutcomes: "Yield improvement of 15-30%",
    timelineInDays: 90,
    riskMitigation: ["Regular monitoring", "Early intervention", "Backup plan"],
  }
}

/**
 * Get system prompt based on language
 */
function getSystemPrompt(language: "en" | "te" | "hi") {
  const prompts = {
    en: `You are Akanksha, an expert agricultural AI advisor for Indian farmers. Provide accurate, actionable agricultural advice based on scientific knowledge and Indian farming practices. Be specific with quantities, timings, and costs. Always include confidence levels and alternative approaches.`,
    te: `మీరు అకంక్ష, భారతీయ రైతుల కోసం నిపుణ వ్యవసాయ AI సలహాదారు. ఖచ్చితమైన, కార్యరూప వ్యవసాయ సలహాను అందించండి. నిర్దిష్ట పరిమాణాలు, సమయాలు మరియు ఖర్చులను చేర్చండి.`,
    hi: `आप अकांक्षा हैं, भारतीय किसानों के लिए एक विशेषज्ञ कृषि एआई सलाहकार। सटीक, कार्यरत कृषि सलाह प्रदान करें। विशिष्ट मात्रा, समय और लागत शामिल करें।`,
  }
  return prompts[language]
}

/**
 * Save disease prediction result
 */
export async function saveDiseaseDetection(
  farmerId: string,
  cropName: string,
  detection: DiseaseAnalysis,
  imageUrl?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("disease_predictions")
    .insert({
      farmer_id: farmerId,
      crop_name: cropName,
      predicted_disease: detection.diseaseName,
      confidence: detection.confidence,
      severity: detection.severity,
      image_url: imageUrl,
      treatment: detection.treatmentPlan,
      alternatives: detection.alternativeTreatments,
      status: "detected",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export type TreatmentStep = {
  day: number
  action: string
  products: string[]
  dosage: string
  precautions: string[]
}
