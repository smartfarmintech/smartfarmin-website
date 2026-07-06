"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateObject } from "ai"
import { z } from "zod"

// Multimodal model routed through the Vercel AI Gateway (zero-config for Google in v0).
const VISION_MODEL = "google/gemini-2.5-flash"

export interface DiseaseAnalysis {
  diseaseId: string
  name: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  symptoms: string[]
  riskFactors: string[]
  timelineToSpread: string
  treatment: TreatmentPlan
}

export interface TreatmentPlan {
  steps: Array<{
    day: number
    action: string
    products: string[]
    dosage: string
    timing: string
    precautions: string[]
  }>
  duration: number
  successRate: number
  costEstimate: number
}

export interface DeficiencyAnalysis {
  nutrient: "N" | "P" | "K" | "Ca" | "Mg" | "S" | "Fe" | "Zn" | "B" | "Mn"
  severity: "mild" | "moderate" | "severe"
  confidence: number
  visibleSymptoms: string[]
  rootCauseFactors: string[]
  fertilizationPlan: FertilizerPlan
}

export interface FertilizerPlan {
  productName: string
  quantity: number
  unit: string
  applicationMethod: string
  frequency: string
  timing: string
  costPerApplication: number
}

export interface PestAnalysis {
  pestId: string
  commonName: string
  scientificName: string
  confidence: number
  populationDensity: string
  riskLevel: "low" | "medium" | "high" | "critical"
  lifecycleStage: string
  recommendations: PestRecommendation[]
}

export interface PestRecommendation {
  type: "cultural" | "biological" | "chemical" | "mechanical"
  action: string
  product?: string
  dosage?: string
  frequency?: string
  safetyPeriod?: number
  cost?: number
}

export interface IrrigationAdvice {
  waterRequirement: number
  unit: string
  frequency: string
  timing: string
  soilMoistureLevel: string
  weatherForecast: string
  recommendation: string
}

export interface WeatherInsight {
  currentCondition: string
  temperature: number
  humidity: number
  rainfall: number
  risk: string
  recommendation: string
}

export interface YieldPrediction {
  estimatedYield: number
  unit: string
  confidence: number
  potentialFactors: string[]
  optimizationSuggestions: string[]
}

export interface AIReport {
  id: string
  userId: string
  cropId: string
  cropType: string
  analysisDate: string
  diseases: DiseaseAnalysis[]
  deficiencies: DeficiencyAnalysis[]
  pests: PestAnalysis[]
  irrigation: IrrigationAdvice
  weather: WeatherInsight
  yield: YieldPrediction
  confidence: number
  createdAt: string
  imageUrl: string | null
}

/**
 * Analyze crop image for diseases
 */
export async function analyzeCropDisease(
  userId: string,
  cropId: string,
  imageUrl: string,
  cropType: string
): Promise<{ ok: boolean; data?: DiseaseAnalysis[]; error?: string }> {
  const supabase = await createClient()

  if (!imageUrl) {
    return { ok: false, error: "A crop image is required for disease analysis." }
  }

  try {
    const { object } = await generateObject({
      model: VISION_MODEL,
      schema: z.object({
        healthy: z
          .boolean()
          .describe("true if the plant appears healthy with no detectable disease"),
        diseases: z.array(
          z.object({
            diseaseId: z
              .string()
              .describe("lowercase snake_case identifier, e.g. rice_blast"),
            name: z.string().describe("Common disease name"),
            confidence: z.number().min(0).max(1).describe("0-1 confidence"),
            severity: z.enum(["low", "medium", "high", "critical"]),
            symptoms: z.array(z.string()),
            riskFactors: z.array(z.string()),
            timelineToSpread: z.string().describe("e.g. '3-5 days'"),
            treatment: z.object({
              steps: z.array(
                z.object({
                  day: z.number().int(),
                  action: z.string(),
                  products: z.array(z.string()),
                  dosage: z.string(),
                  timing: z.string(),
                  precautions: z.array(z.string()),
                })
              ),
              duration: z.number().describe("Total treatment duration in days"),
              successRate: z.number().min(0).max(1),
              costEstimate: z.number().describe("Estimated cost in INR"),
            }),
          })
        ),
      }),
      system:
        "You are an expert agricultural plant pathologist for Indian farming conditions. " +
        "Analyze the crop leaf/plant image and identify any diseases. Provide practical, " +
        "India-appropriate treatments with products available to smallholder farmers, dosages, " +
        "timing, precautions, and realistic INR cost estimates. If the plant is healthy, return " +
        "an empty diseases array and healthy=true. Only report diseases you can actually observe.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Crop type: ${cropType || "unknown"}. Diagnose any diseases visible in this image.`,
            },
            { type: "image", image: imageUrl },
          ],
        },
      ],
    })

    const diseases = object.diseases as DiseaseAnalysis[]

    if (diseases.length > 0) {
      const { error: dbError } = await supabase.from("crop_health_reports").insert({
        user_id: userId,
        crop_id: cropId,
        report_type: "disease_analysis",
        analysis_data: { diseases, healthy: object.healthy },
        image_url: imageUrl,
        confidence: Math.max(...diseases.map((d) => d.confidence)),
      })

      if (dbError) throw dbError
    }

    revalidatePath("/farmer/crops")
    return { ok: true, data: diseases }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Analyze crop for nutrient deficiencies
 */
export async function analyzeNutrientDeficiency(
  userId: string,
  cropId: string,
  cropType: string,
  cropStage: string
): Promise<{ ok: boolean; data?: DeficiencyAnalysis[]; error?: string }> {
  try {
    const { object } = await generateObject({
      model: VISION_MODEL,
      schema: z.object({
        deficiencies: z.array(
          z.object({
            nutrient: z.enum(["N", "P", "K", "Ca", "Mg", "S", "Fe", "Zn", "B", "Mn"]),
            severity: z.enum(["mild", "moderate", "severe"]),
            confidence: z.number().min(0).max(1),
            visibleSymptoms: z.array(z.string()),
            rootCauseFactors: z.array(z.string()),
            fertilizationPlan: z.object({
              productName: z.string(),
              quantity: z.number(),
              unit: z.string().describe("e.g. kg/hectare"),
              applicationMethod: z.string(),
              frequency: z.string(),
              timing: z.string(),
              costPerApplication: z.number().describe("INR"),
            }),
          })
        ),
      }),
      system:
        "You are an expert soil and plant-nutrition agronomist for Indian farming. Given a crop " +
        "and its growth stage, identify the most likely nutrient deficiencies at that stage, with " +
        "typical visible symptoms, root causes, and a corrective fertilization plan using products " +
        "available in India with realistic INR costs. Rank by likelihood; return at most 3.",
      prompt: `Crop: ${cropType}. Growth stage: ${cropStage}. What nutrient deficiencies are most likely and how should they be corrected?`,
    })

    return { ok: true, data: object.deficiencies as DeficiencyAnalysis[] }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Analyze for pest infestation
 */
export async function analyzePestInfestation(
  userId: string,
  cropId: string,
  cropType: string
): Promise<{ ok: boolean; data?: PestAnalysis[]; error?: string }> {
  try {
    const { object } = await generateObject({
      model: VISION_MODEL,
      schema: z.object({
        pests: z.array(
          z.object({
            pestId: z.string().describe("lowercase snake_case identifier"),
            commonName: z.string(),
            scientificName: z.string(),
            confidence: z.number().min(0).max(1),
            populationDensity: z.string().describe("e.g. '8 larvae per 100 bolls'"),
            riskLevel: z.enum(["low", "medium", "high", "critical"]),
            lifecycleStage: z.string(),
            recommendations: z.array(
              z.object({
                type: z.enum(["cultural", "biological", "chemical", "mechanical"]),
                action: z.string(),
                product: z.string().optional(),
                dosage: z.string().optional(),
                frequency: z.string().optional(),
                safetyPeriod: z.number().optional(),
                cost: z.number().optional(),
              })
            ),
          })
        ),
      }),
      system:
        "You are an integrated pest management (IPM) specialist for Indian agriculture. For the " +
        "given crop, list the pests that pose the highest risk this season with cultural, biological, " +
        "and chemical control options. Prefer IPM/organic first; include India-available chemical " +
        "products with dosage, frequency, safety period (days), and INR cost. Return at most 3 pests.",
      prompt: `Crop: ${cropType}. What are the highest-risk pests and how should the farmer manage them?`,
    })

    return { ok: true, data: object.pests as PestAnalysis[] }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get irrigation advice
 */
export async function getIrrigationAdvice(
  cropType: string,
  cropStage: string,
  soilType: string
): Promise<{ ok: boolean; data?: IrrigationAdvice; error?: string }> {
  try {
    const advice: Record<string, Record<string, IrrigationAdvice>> = {
      rice: {
        flowering: {
          waterRequirement: 100,
          unit: "mm",
          frequency: "Every 5-7 days",
          timing: "Early morning or evening",
          soilMoistureLevel: "Keep flooded 5cm above soil",
          weatherForecast: "Check monsoon forecast",
          recommendation: "Maintain standing water during flowering for better grain fill",
        },
        vegetative: {
          waterRequirement: 80,
          unit: "mm",
          frequency: "Every 7-10 days",
          timing: "Early morning",
          soilMoistureLevel: "80-100% field capacity",
          weatherForecast: "Reduce in monsoon",
          recommendation: "Provide adequate water for vegetative growth",
        },
      },
      wheat: {
        flowering: {
          waterRequirement: 60,
          unit: "mm",
          frequency: "Every 10-15 days",
          timing: "Early morning",
          soilMoistureLevel: "70-80% field capacity",
          weatherForecast: "Critical stage - no waterlogging",
          recommendation: "Avoid excess water during flowering",
        },
      },
    }

    const defaultAdvice: IrrigationAdvice = {
      waterRequirement: 50,
      unit: "mm",
      frequency: "Every 10 days",
      timing: "Early morning",
      soilMoistureLevel: "70% field capacity",
      weatherForecast: "Monitor rainfall",
      recommendation: "Maintain consistent soil moisture",
    }

    const data = advice[cropType.toLowerCase()]?.[cropStage.toLowerCase()] || defaultAdvice
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get yield prediction
 */
export async function predictYield(
  cropType: string,
  farmArea: number,
  cropStage: string,
  healthScore: number
): Promise<{ ok: boolean; data?: YieldPrediction; error?: string }> {
  try {
    // Base yields per hectare for different crops
    const baseYields: Record<string, number> = {
      rice: 4500, // kg/hectare
      wheat: 4000,
      cotton: 18, // quintals/hectare
      maize: 5000,
      groundnut: 1500,
    }

    const baseYield = baseYields[cropType.toLowerCase()] || 4000
    const healthMultiplier = healthScore / 100 // 0 to 1
    const estimatedYield = baseYield * farmArea * healthMultiplier

    return {
      ok: true,
      data: {
        estimatedYield: Math.round(estimatedYield),
        unit: cropType.toLowerCase() === "cotton" ? "quintals" : "kg",
        confidence: healthScore > 80 ? 0.85 : healthScore > 60 ? 0.7 : 0.55,
        potentialFactors: [
          "Soil fertility",
          "Water availability",
          "Pest & disease management",
          "Weather patterns",
          "Variety used",
        ],
        optimizationSuggestions: [
          "Increase fertilizer application by 15%",
          "Implement drip irrigation for water efficiency",
          "Adopt integrated pest management",
          "Use high-yielding varieties",
        ],
      },
    }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Generate farmer report (PDF-ready format)
 */
export async function generateFarmerReport(
  userId: string,
  cropId: string,
  analysis: Partial<AIReport>
): Promise<{ ok: boolean; reportData?: string; error?: string }> {
  const supabase = await createClient()

  try {
    // Create report object
    const report = {
      ...analysis,
      userId,
      cropId,
      generatedAt: new Date().toISOString(),
      language: "en",
    }

    // Save report to database
    const { data: savedReport, error: dbError } = await supabase
      .from("ai_reports")
      .insert(report)
      .select()
      .single()

    if (dbError) throw dbError

    // Generate CSV-ready data
    const reportData = JSON.stringify(report, null, 2)

    revalidatePath("/farmer/crops")
    return { ok: true, reportData }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get crop image history
 */
export async function getCropImageHistory(
  userId: string,
  cropId: string
): Promise<{ ok: boolean; data?: Array<{ date: string; imageUrl: string }> | null; error?: string }> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("crop_health_reports")
      .select("created_at, image_url")
      .eq("user_id", userId)
      .eq("crop_id", cropId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    return {
      ok: true,
      data: data?.map((d) => ({ date: d.created_at, imageUrl: d.image_url })) || [],
    }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get treatment timeline
 */
export async function getTreatmentTimeline(
  userId: string,
  cropId: string
): Promise<{ ok: boolean; data?: Array<{ date: string; action: string; status: string }> | null; error?: string }> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("treatment_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("crop_id", cropId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return {
      ok: true,
      data: data?.map((d) => ({ date: d.created_at, action: d.action, status: d.status })) || [],
    }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
