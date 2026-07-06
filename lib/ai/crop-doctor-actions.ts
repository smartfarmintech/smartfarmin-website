"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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

  try {
    // Simulate AI analysis - in production, call ML API
    const diseases: DiseaseAnalysis[] = []

    // Disease detection based on crop type
    if (cropType.toLowerCase().includes("rice")) {
      diseases.push({
        diseaseId: "rice_blast",
        name: "Rice Blast",
        confidence: 0.89,
        severity: "high",
        symptoms: ["Brown/gray lesions on leaves", "Spindle-shaped spots", "Seedling die-off"],
        riskFactors: ["High humidity", "Cool nights", "Dense planting"],
        timelineToSpread: "3-5 days",
        treatment: {
          steps: [
            {
              day: 1,
              action: "Remove infected leaves",
              products: ["Tricyclazole", "Propiconazole"],
              dosage: "1g per liter",
              timing: "Early morning",
              precautions: ["Wear gloves", "Avoid skin contact"],
            },
            {
              day: 3,
              action: "Spray fungicide",
              products: ["Tricyclazole"],
              dosage: "1g per liter",
              timing: "Evening",
              precautions: ["Do not spray in rain"],
            },
            {
              day: 7,
              action: "Second spray",
              products: ["Propiconazole"],
              dosage: "0.75g per liter",
              timing: "Early morning",
              precautions: ["Maintain 15 days safety period"],
            },
          ],
          duration: 14,
          successRate: 0.92,
          costEstimate: 2500,
        },
      })
    } else if (cropType.toLowerCase().includes("wheat")) {
      diseases.push({
        diseaseId: "powdery_mildew",
        name: "Powdery Mildew",
        confidence: 0.85,
        severity: "medium",
        symptoms: ["White powder on leaves", "Leaf curling", "Stunted growth"],
        riskFactors: ["Low humidity", "Warm days", "Shade"],
        timelineToSpread: "7-10 days",
        treatment: {
          steps: [
            {
              day: 1,
              action: "Sulfur dusting",
              products: ["Wettable Sulfur"],
              dosage: "25kg per hectare",
              timing: "Early morning",
              precautions: ["Don't use during high heat"],
            },
            {
              day: 7,
              action: "Repeat spray",
              products: ["Wettable Sulfur"],
              dosage: "25kg per hectare",
              timing: "Evening",
              precautions: ["Maintain 3 days gap"],
            },
          ],
          duration: 10,
          successRate: 0.88,
          costEstimate: 1800,
        },
      })
    }

    // Save report to database
    if (diseases.length > 0) {
      const { error: dbError } = await supabase.from("crop_health_reports").insert({
        user_id: userId,
        crop_id: cropId,
        report_type: "disease_analysis",
        analysis_data: { diseases },
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
    const deficiencies: DeficiencyAnalysis[] = []

    // Simulate analysis based on crop stage
    if (cropStage === "flowering") {
      deficiencies.push({
        nutrient: "K",
        severity: "moderate",
        confidence: 0.82,
        visibleSymptoms: ["Leaf edges yellowing", "Weak stems", "Reduced flower size"],
        rootCauseFactors: ["Sandy soil", "Recent heavy rain", "High potassium removal"],
        fertilizationPlan: {
          productName: "Muriate of Potash",
          quantity: 50,
          unit: "kg/hectare",
          applicationMethod: "Soil application + foliar spray",
          frequency: "Once now, repeat after 15 days",
          timing: "Evening",
          costPerApplication: 1200,
        },
      })
    } else if (cropStage === "vegetative") {
      deficiencies.push({
        nutrient: "N",
        severity: "mild",
        confidence: 0.75,
        visibleSymptoms: ["Pale green leaves", "Slow growth", "Small leaf size"],
        rootCauseFactors: ["Leaching in heavy rain", "Soil depletion"],
        fertilizationPlan: {
          productName: "Urea",
          quantity: 60,
          unit: "kg/hectare",
          applicationMethod: "Split application",
          frequency: "Two splits, 15 days apart",
          timing: "Before irrigation",
          costPerApplication: 900,
        },
      })
    }

    return { ok: true, data: deficiencies }
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
    const pests: PestAnalysis[] = []

    if (cropType.toLowerCase().includes("cotton")) {
      pests.push({
        pestId: "bollworm",
        commonName: "Cotton Bollworm",
        scientificName: "Helicoverpa armigera",
        confidence: 0.87,
        populationDensity: "8 larvae per 100 bolls",
        riskLevel: "high",
        lifecycleStage: "Larval stage (L2-L3)",
        recommendations: [
          {
            type: "cultural",
            action: "Remove and destroy infested bolls",
          },
          {
            type: "biological",
            action: "Release parasitoid wasps (Habrobracon hebetor)",
          },
          {
            type: "chemical",
            action: "Spray Spinosad 45% SC",
            product: "Spinosad 45% SC",
            dosage: "3ml per liter",
            frequency: "Once every 7 days",
            safetyPeriod: 3,
            cost: 1500,
          },
        ],
      })
    }

    return { ok: true, data: pests }
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
