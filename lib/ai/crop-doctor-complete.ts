"use server"

import { createClient } from "@/lib/supabase/server"

export interface DiseaseDetection {
  diseaseId: string
  name: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  affectedArea: number
  description: string
  symptoms: string[]
  causingAgents: string[]
}

export interface DeficiencyDetection {
  nutrientType: "nitrogen" | "phosphorus" | "potassium" | "magnesium" | "calcium" | "sulfur"
  severity: "mild" | "moderate" | "severe"
  confidence: number
  symptoms: string[]
  recommendations: string[]
}

export interface PestDetection {
  pestId: string
  name: string
  confidence: number
  count: number
  riskLevel: "low" | "medium" | "high"
  lifecycle: string
  recommendations: string[]
}

export interface TreatmentPlan {
  diseaseId: string
  treatmentSteps: Array<{
    day: number
    action: string
    products: string[]
    dosage: string
    precautions: string[]
  }>
  estimatedDuration: number
  costEstimate: number
  successRate: number
}

export interface FertilizerSchedule {
  month: string
  cropStage: string
  nitrogen: number
  phosphorus: number
  potassium: number
  secondaryNutrients: Record<string, number>
  applicationMethod: string
  precautions: string[]
}

export interface PesticideRecommendation {
  pestName: string
  recommendedProducts: Array<{
    productName: string
    activeIngredient: string
    dosage: string
    frequency: string
    safetyPeriod: number
    cost: number
  }>
  applicationTiming: string
  mixingInstructions: string
  safetyMeasures: string[]
}

/**
 * Detect diseases from crop image
 */
export async function detectCropDiseases(
  imageUrl: string,
  cropType: string
): Promise<DiseaseDetection[]> {
  // Mock disease detection - in production, call ML API
  const diseases: DiseaseDetection[] = []

  // Simulate disease detection based on crop type
  if (cropType.toLowerCase() === "wheat") {
    diseases.push({
      diseaseId: "powdery_mildew",
      name: "Powdery Mildew",
      confidence: 0.85,
      severity: "medium",
      affectedArea: 25,
      description: "Fungal disease causing white powdery coating on leaves",
      symptoms: ["White powder on leaves", "Leaf curling", "Stunted growth"],
      causingAgents: ["Erysiphe graminis"],
    })
  } else if (cropType.toLowerCase() === "rice") {
    diseases.push({
      diseaseId: "blast",
      name: "Rice Blast",
      confidence: 0.92,
      severity: "high",
      affectedArea: 40,
      description: "Severe fungal disease affecting rice plants",
      symptoms: ["Diamond-shaped lesions", "White center", "Brown borders"],
      causingAgents: ["Pyricularia oryzae"],
    })
  }

  return diseases
}

/**
 * Detect nutrient deficiencies
 */
export async function detectNutrientDeficiencies(
  imageUrl: string,
  cropType: string
): Promise<DeficiencyDetection[]> {
  const deficiencies: DeficiencyDetection[] = []

  // Mock deficiency detection
  deficiencies.push({
    nutrientType: "nitrogen",
    severity: "mild",
    confidence: 0.78,
    symptoms: ["Yellowing of lower leaves", "Reduced growth"],
    recommendations: ["Apply urea at 20 kg/acre", "Increase frequency of irrigation"],
  })

  return deficiencies
}

/**
 * Detect pests from image
 */
export async function detectPests(
  imageUrl: string,
  cropType: string
): Promise<PestDetection[]> {
  const pests: PestDetection[] = []

  // Mock pest detection
  if (cropType.toLowerCase() === "cotton") {
    pests.push({
      pestId: "bollworm",
      name: "Cotton Bollworm",
      confidence: 0.88,
      count: 5,
      riskLevel: "high",
      lifecycle: "2-3 weeks to mature",
      recommendations: [
        "Apply Bt spray",
        "Hand-pick infected bolls",
        "Implement pheromone traps",
      ],
    })
  }

  return pests
}

/**
 * Get treatment plan for disease
 */
export async function getTreatmentPlan(
  diseaseId: string,
  severity: string
): Promise<TreatmentPlan> {
  // Mock treatment plan
  return {
    diseaseId,
    treatmentSteps: [
      {
        day: 0,
        action: "Isolate affected plants",
        products: [],
        dosage: "",
        precautions: ["Wear gloves", "Wash hands thoroughly"],
      },
      {
        day: 1,
        action: "Apply fungicide spray",
        products: ["Sulfur", "Mancozeb"],
        dosage: "2g per liter of water",
        precautions: ["Spray in early morning", "Avoid rain for 24 hours"],
      },
      {
        day: 7,
        action: "Repeat fungicide application",
        products: ["Mancozeb", "Copper hydroxide"],
        dosage: "2g per liter of water",
        precautions: ["Ensure good coverage", "Avoid spray during flowering"],
      },
    ],
    estimatedDuration: 14,
    costEstimate: 2500,
    successRate: 0.85,
  }
}

/**
 * Get fertilizer schedule for crop
 */
export async function getFertilizerSchedule(
  cropType: string,
  soilType: string
): Promise<FertilizerSchedule[]> {
  const schedule: FertilizerSchedule[] = []

  // Mock fertilizer schedule for wheat
  if (cropType.toLowerCase() === "wheat") {
    schedule.push(
      {
        month: "October",
        cropStage: "Germination",
        nitrogen: 40,
        phosphorus: 20,
        potassium: 0,
        secondaryNutrients: { sulfur: 10, zinc: 2 },
        applicationMethod: "Broadcast",
        precautions: ["Mix well with soil", "Apply before sowing"],
      },
      {
        month: "December",
        cropStage: "Vegetative growth",
        nitrogen: 30,
        phosphorus: 0,
        potassium: 0,
        secondaryNutrients: { boron: 1 },
        applicationMethod: "Fertigation",
        precautions: ["Apply after rain", "Avoid flooding"],
      },
      {
        month: "February",
        cropStage: "Flowering",
        nitrogen: 20,
        phosphorus: 0,
        potassium: 15,
        secondaryNutrients: { magnesium: 5 },
        applicationMethod: "Foliar spray",
        precautions: ["Spray in evening", "Repeat after 15 days"],
      }
    )
  }

  return schedule
}

/**
 * Get pesticide recommendations
 */
export async function getPesticideRecommendations(
  pestId: string,
  cropType: string
): Promise<PesticideRecommendation> {
  // Mock pesticide recommendations
  return {
    pestName: "Cotton Bollworm",
    recommendedProducts: [
      {
        productName: "Spinosad 45 SC",
        activeIngredient: "Spinosad",
        dosage: "100-150 ml per 200 liters",
        frequency: "7-10 days",
        safetyPeriod: 3,
        cost: 1200,
      },
      {
        productName: "Bt Spray",
        activeIngredient: "Bacillus thuringiensis",
        dosage: "500-750 ml per 200 liters",
        frequency: "5-7 days",
        safetyPeriod: 0,
        cost: 800,
      },
    ],
    applicationTiming: "Early morning or late evening",
    mixingInstructions: "Mix in clean water, stir well, use within 2 hours",
    safetyMeasures: [
      "Wear gloves and mask",
      "Avoid skin contact",
      "Do not apply during flowering",
      "Maintain 3-day harvest interval",
    ],
  }
}

/**
 * Get yield prediction
 */
export async function getYieldPrediction(
  cropType: string,
  areaAcres: number,
  healthScore: number,
  soilHealth: number
): Promise<{
  estimatedYield: number
  unit: string
  confidence: number
  factors: Array<{ factor: string; impact: number }>
}> {
  // Mock yield prediction
  const baseYield = cropType.toLowerCase() === "wheat" ? 40 : 30
  const predictedYield = baseYield * areaAcres * (healthScore / 100) * (soilHealth / 100)

  return {
    estimatedYield: Math.round(predictedYield * 10) / 10,
    unit: "quintals",
    confidence: 0.82,
    factors: [
      { factor: "Crop health", impact: healthScore },
      { factor: "Soil fertility", impact: soilHealth },
      { factor: "Water availability", impact: 85 },
      { factor: "Pest pressure", impact: -20 },
      { factor: "Weather conditions", impact: 75 },
    ],
  }
}

/**
 * Save disease history
 */
export async function saveDiseaseHistory(
  farmerId: string,
  cropType: string,
  diseaseId: string,
  severity: string,
  treatment: string,
  outcome: string
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("disease_history")
      .insert({
        farmer_id: farmerId,
        crop_type: cropType,
        disease_id: diseaseId,
        severity,
        treatment,
        outcome,
        recorded_at: new Date().toISOString(),
      })

    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get disease history
 */
export async function getDiseaseHistory(farmerId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("disease_history")
      .select("*")
      .eq("farmer_id", farmerId)
      .order("recorded_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (err: any) {
    return []
  }
}

/**
 * Voice assistant for crop health queries
 */
export async function cropHealthVoiceQuery(
  query: string,
  cropType: string,
  location: string
): Promise<string> {
  // Mock voice response
  const responses: Record<string, string> = {
    disease:
      "I detected a potential fungal disease. Let me analyze the severity and recommend treatment.",
    pest: "There are pests detected on your crop. Here are the recommended pesticides.",
    fertilizer:
      "Based on the soil analysis, your crop needs additional nitrogen and potassium.",
    weather:
      "Current weather conditions are favorable for disease development. Consider preventive spraying.",
  }

  let response = "I'm analyzing your crop condition..."
  Object.keys(responses).forEach((key) => {
    if (query.toLowerCase().includes(key)) {
      response = responses[key]
    }
  })

  return response
}
