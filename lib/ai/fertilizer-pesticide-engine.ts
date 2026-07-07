"use server"

import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

/**
 * Fertilizer & Pesticide Recommendation Engine
 * Provides crop-specific NPK schedules, dose calculations, and pesticide recommendations
 */

export interface CropNutrientRequirements {
  cropName: string
  growthStage: string
  totalAreaAcres: number
  nitrogen: number // kg per acre
  phosphorus: number // kg per acre
  potassium: number // kg per acre
  secondaryNutrients: Record<string, number>
  micronutrients: Record<string, number>
}

export interface FertilizerApplication {
  day: number
  stage: string
  totalQuantityKg: number
  npkRatio: string
  nitrogenKg: number
  phosphorusKg: number
  potassiumKg: number
  products: Array<{
    name: string
    quantity: number
    unit: string
    price: number
    method: "broadcast" | "drip" | "foliar"
    precautions: string[]
  }>
}

export interface FertilizerSchedule {
  cropName: string
  totalArea: number
  areaUnit: string
  sowingDate: string
  harvestDate: string
  soilTestData?: {
    nitrogen: number
    phosphorus: number
    potassium: number
    ph: number
    organicMatter: number
  }
  schedule: FertilizerApplication[]
  totalCostEstimate: number
  totalNitrogenKg: number
  totalPhosphorusKg: number
  totalPotassiumKg: number
  recommendations: string[]
  warningsAndPrecautions: string[]
}

export interface PesticideRecommendation {
  pestName: string
  cropName: string
  severity: "low" | "medium" | "high" | "critical"
  products: Array<{
    productName: string
    activeIngredient: string
    dosagePerLiter: string // grams/ml per liter
    waterRequirement: number // liters per acre
    totalDosage: number // grams/ml required
    frequency: number // days between applications
    safetyPeriod: number // days before harvest
    costPerUnit: number
    totalCost: number
    organicAlternatives: string[]
    mixingInstructions: string
    applicationMethod: "spray" | "soil" | "seed" | "drip"
    safetyMeasures: string[]
  }>
  integratedPestManagement: string[]
  preventionMeasures: string[]
  harvestPrecautions: string
}

/**
 * Get comprehensive fertilizer schedule for a crop
 */
export async function getFertilizerSchedule(
  cropName: string,
  totalArea: number,
  soilTestData?: {
    nitrogen: number
    phosphorus: number
    potassium: number
    ph: number
    organicMatter: number
  },
  sowingDate?: string,
  harvestDate?: string,
  language: "en" | "te" | "hi" = "en"
): Promise<FertilizerSchedule> {
  const prompt = `Create a detailed month-by-month fertilizer schedule for ${cropName}:
  
  Crop Details:
  - Total Area: ${totalArea} acres
  - Sowing Date: ${sowingDate || "to be determined"}
  - Expected Harvest: ${harvestDate || "120-150 days after sowing"}
  
  Soil Analysis:
  ${soilTestData ? `
  - Nitrogen (N): ${soilTestData.nitrogen} mg/kg
  - Phosphorus (P): ${soilTestData.phosphorus} mg/kg
  - Potassium (K): ${soilTestData.potassium} mg/kg
  - pH: ${soilTestData.ph}
  - Organic Matter: ${soilTestData.organicMatter}%
  ` : "- Not available - use standard recommendations"}
  
  Provide JSON response with:
  {
    "schedule": [
      {
        "day": 30,
        "stage": "Vegetative",
        "totalQuantityKg": 150,
        "npkRatio": "20:10:10",
        "nitrogenKg": 100,
        "phosphorusKg": 50,
        "potassiumKg": 0,
        "products": [
          {
            "name": "Urea",
            "quantity": 100,
            "unit": "kg",
            "price": 250,
            "method": "broadcast",
            "precautions": ["Apply before rain", "Mix with soil"]
          }
        ]
      }
    ],
    "totalCostEstimate": 5000,
    "totalNitrogenKg": 300,
    "totalPhosphorusKg": 100,
    "totalPotassiumKg": 50,
    "recommendations": ["Use slow-release fertilizers", "Apply during humid weather"],
    "warningsAndPrecautions": ["Avoid burning leaves with urea", "Don't apply during peak heat"]
  }`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system:
      "You are an expert agricultural nutritionist for Indian crops. Provide precise, science-based fertilizer schedules with exact quantities and costs.",
    prompt,
    temperature: 0.7,
    maxTokens: 2000,
  })

  // Parse response
  let scheduleData
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      scheduleData = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error("[v0] Parse error:", e)
  }

  const schedule: FertilizerSchedule = {
    cropName,
    totalArea,
    areaUnit: "acres",
    sowingDate: sowingDate || new Date().toISOString().split("T")[0],
    harvestDate: harvestDate || new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    soilTestData,
    schedule: scheduleData?.schedule || getDefaultFertilizerSchedule(cropName, totalArea),
    totalCostEstimate: scheduleData?.totalCostEstimate || 5000,
    totalNitrogenKg: scheduleData?.totalNitrogenKg || 300,
    totalPhosphorusKg: scheduleData?.totalPhosphorusKg || 100,
    totalPotassiumKg: scheduleData?.totalPotassiumKg || 50,
    recommendations: scheduleData?.recommendations || [
      "Apply fertilizers during cloudy weather",
      "Use certified quality seeds",
      "Maintain proper spacing",
    ],
    warningsAndPrecautions: scheduleData?.warningsAndPrecautions || [
      "Avoid over-application of nitrogen",
      "Don't apply fertilizers during waterlogging",
    ],
  }

  return schedule
}

/**
 * Get pesticide recommendations for a pest/disease
 */
export async function getPesticideRecommendations(
  pestName: string,
  cropName: string,
  severity: "low" | "medium" | "high" | "critical" = "medium",
  totalArea: number = 1,
  language: "en" | "te" | "hi" = "en"
): Promise<PesticideRecommendation> {
  const prompt = `Provide pesticide recommendations for ${pestName} on ${cropName}:
  
  Pest Details:
  - Crop: ${cropName}
  - Pest/Disease: ${pestName}
  - Severity: ${severity}
  - Area Affected: ${totalArea} acres
  
  Provide JSON with:
  {
    "products": [
      {
        "productName": "Neem Oil 3%",
        "activeIngredient": "Azadirachtin",
        "dosagePerLiter": "5ml",
        "waterRequirement": 200,
        "totalDosage": 1000,
        "frequency": 7,
        "safetyPeriod": 3,
        "costPerUnit": 150,
        "totalCost": 1500,
        "organicAlternatives": ["Cow urine spray", "Garlic extract"],
        "mixingInstructions": "Mix 5ml in 1 liter water, add 1ml soap solution",
        "applicationMethod": "spray",
        "safetyMeasures": ["Wear gloves and mask", "Avoid skin contact"]
      }
    ],
    "integratedPestManagement": ["Use pheromone traps", "Encourage natural predators"],
    "preventionMeasures": ["Remove infected plants", "Maintain crop hygiene"],
    "harvestPrecautions": "Wait 7 days after final spray before harvest"
  }`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system:
      "You are an expert in integrated pest management for Indian crops. Prioritize organic/sustainable solutions. Provide exact dosages and costs.",
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  })

  // Parse response
  let pestData
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      pestData = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error("[v0] Parse error:", e)
  }

  const recommendation: PesticideRecommendation = {
    pestName,
    cropName,
    severity,
    products: pestData?.products || getDefaultPesticideProducts(pestName, totalArea),
    integratedPestManagement: pestData?.integratedPestManagement || [
      "Monitor crop regularly",
      "Use resistant varieties",
      "Maintain field sanitation",
    ],
    preventionMeasures: pestData?.preventionMeasures || [
      "Remove infected plant parts",
      "Use clean tools",
      "Crop rotation",
    ],
    harvestPrecautions: pestData?.harvestPrecautions || "Wait 7-14 days after final spray",
  }

  return recommendation
}

/**
 * Calculate exact pesticide dose for given area
 */
export function calculatePesticideDose(
  dosagePerLiter: number, // grams/ml per liter
  waterRequirementPerAcre: number, // liters per acre
  totalArea: number, // acres
  productType: "powder" | "liquid" = "liquid"
): {
  totalWater: number
  totalDosage: number
  unit: string
  applications: Array<{ applicationNumber: number; dosage: number; date: string }>
} {
  const totalWater = waterRequirementPerAcre * totalArea
  const totalDosage = (dosagePerLiter / 1000) * totalWater * (productType === "powder" ? 1000 : 1) // convert to grams if powder

  return {
    totalWater,
    totalDosage,
    unit: productType === "powder" ? "grams" : "ml",
    applications: [
      {
        applicationNumber: 1,
        dosage: totalDosage,
        date: new Date().toISOString().split("T")[0],
      },
      {
        applicationNumber: 2,
        dosage: totalDosage,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      {
        applicationNumber: 3,
        dosage: totalDosage,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    ],
  }
}

/**
 * Default fertilizer schedule (fallback)
 */
function getDefaultFertilizerSchedule(cropName: string, totalArea: number): FertilizerApplication[] {
  const baseNitrogen = totalArea * 80
  const basePhosphorus = totalArea * 40
  const basePotassium = totalArea * 40

  return [
    {
      day: 0,
      stage: "Basal",
      totalQuantityKg: (basePhosphorus + basePotassium) / 2,
      npkRatio: "0:20:20",
      nitrogenKg: 0,
      phosphorusKg: basePhosphorus / 2,
      potassiumKg: basePotassium / 2,
      products: [
        {
          name: "DAP (Diammonium Phosphate)",
          quantity: (basePhosphorus / 2) * 0.46,
          unit: "kg",
          price: 650,
          method: "broadcast",
          precautions: ["Mix with soil before planting", "Apply with compost"],
        },
      ],
    },
    {
      day: 30,
      stage: "Vegetative",
      totalQuantityKg: baseNitrogen / 2,
      npkRatio: "46:0:0",
      nitrogenKg: baseNitrogen / 2,
      phosphorusKg: 0,
      potassiumKg: 0,
      products: [
        {
          name: "Urea",
          quantity: (baseNitrogen / 2) / 0.46,
          unit: "kg",
          price: 250,
          method: "broadcast",
          precautions: ["Apply before rain", "Avoid leaf burn"],
        },
      ],
    },
    {
      day: 60,
      stage: "Flowering",
      totalQuantityKg: baseNitrogen / 2,
      npkRatio: "46:0:20",
      nitrogenKg: baseNitrogen / 2,
      phosphorusKg: 0,
      potassiumKg: basePotassium / 2,
      products: [
        {
          name: "Muriate of Potash",
          quantity: (basePotassium / 2) / 0.6,
          unit: "kg",
          price: 280,
          method: "drip",
          precautions: ["Use only with drip irrigation", "Monitor soil moisture"],
        },
      ],
    },
  ]
}

/**
 * Default pesticide products (fallback)
 */
function getDefaultPesticideProducts(pestName: string, totalArea: number): PesticideRecommendation["products"] {
  return [
    {
      productName: "Neem Oil 3%",
      activeIngredient: "Azadirachtin",
      dosagePerLiter: "5ml",
      waterRequirement: 200 * totalArea,
      totalDosage: 5 * 200 * totalArea,
      frequency: 7,
      safetyPeriod: 3,
      costPerUnit: 150,
      totalCost: 1500,
      organicAlternatives: ["Cow urine (10% solution)", "Soap spray"],
      mixingInstructions: "Mix 5ml in 1 liter water, add 1ml soap solution",
      applicationMethod: "spray",
      safetyMeasures: ["Wear protective gear", "Avoid skin contact", "Apply in evening"],
    },
    {
      productName: "Spinosad 45 SC",
      activeIngredient: "Spinosad",
      dosagePerLiter: "1ml",
      waterRequirement: 200 * totalArea,
      totalDosage: 1 * 200 * totalArea,
      frequency: 5,
      safetyPeriod: 7,
      costPerUnit: 800,
      totalCost: 2400,
      organicAlternatives: ["Pyrethrin extract"],
      mixingInstructions: "Mix 1ml in 1 liter water, spray uniformly",
      applicationMethod: "spray",
      safetyMeasures: ["Use in morning", "Avoid contact with eyes"],
    },
  ]
}
