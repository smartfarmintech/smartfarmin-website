"use server"

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

/**
 * Irrigation & Weather Intelligence Engine
 * Provides crop-specific irrigation schedules and weather-based farming advice
 */

export interface WeatherData {
  temperature: { min: number; max: number } // Celsius
  rainfall: number // mm
  humidity: number // percentage
  windSpeed: number // km/h
  uvIndex: number
  pressure: number // mb
  dewPoint: number
  soilMoisture?: number // percentage
}

export interface IrrigationSchedule {
  cropName: string
  growthStage: string
  soilType: string
  currentMoisture: number // percentage
  recommendedFrequency: number // days
  recommendedQuantity: number // liters per acre
  waterSourceSuggestions: string[]
  irrigationMethod: "drip" | "sprinkler" | "flood" | "furrow"
  timingRecommendation: string
  weatherAdjustments: string
  soilMoistureThresholds: {
    minimum: number
    optimal: number
    maximum: number
  }
  stressIndicators: string[]
  costsEstimate: {
    electricityCost: number
    waterCost: number
    totalPerAcrePerMonth: number
  }
}

export interface WeatherFarmingAdvice {
  date: string
  currentWeather: WeatherData
  forecast15Day: Array<{
    date: string
    condition: string
    temperature: { min: number; max: number }
    rainfall: number
    advisoryLevel: "normal" | "caution" | "warning" | "critical"
  }>
  cropSpecificAdvice: string[]
  irrigationAdjustments: string
  pestRiskAlerts: string[]
  diseaseRiskAlerts: string[]
  optimizedOperations: string[]
  yieldImpactAssessment: string
  harvestReadinessForecast: string
}

export interface CropWaterRequirement {
  cropName: string
  totalSeasonWater: number // mm
  monthlyBreakdown: Array<{
    month: number
    growthStage: string
    waterRequired: number // mm
    percentageOfTotal: number
  }>
  adjustmentFactors: {
    rainfallReduction: number // percentage
    evapotranspirationFactor: number
    soilRetention: number
  }
}

/**
 * Get irrigation schedule for a crop based on soil, weather, and growth stage
 */
export async function getIrrigationSchedule(
  cropName: string,
  growthStage: string,
  soilType: string,
  totalArea: number,
  currentMoisture: number = 60,
  location?: { latitude: number; longitude: number },
  language: "en" | "te" | "hi" = "en"
): Promise<IrrigationSchedule> {
  const prompt = `Generate an irrigation schedule for ${cropName}:
  
  Crop Details:
  - Crop: ${cropName}
  - Growth Stage: ${growthStage}
  - Total Area: ${totalArea} acres
  - Soil Type: ${soilType}
  - Current Soil Moisture: ${currentMoisture}%
  - Location: ${location ? `${location.latitude}, ${location.longitude}` : "Central India"}
  
  Provide JSON with irrigation schedule:
  {
    "recommendedFrequency": 7,
    "recommendedQuantity": 40,
    "waterSourceSuggestions": ["Well water", "Tube well", "Canal"],
    "irrigationMethod": "drip",
    "timingRecommendation": "Early morning 5-7 AM",
    "weatherAdjustments": "Reduce by 20% if rainfall expected within 48 hours",
    "soilMoistureThresholds": {
      "minimum": 50,
      "optimal": 70,
      "maximum": 85
    },
    "stressIndicators": ["Wilting leaves", "Reduced growth", "Leaf curling"],
    "costsEstimate": {
      "electricityCost": 500,
      "waterCost": 1000,
      "totalPerAcrePerMonth": 1500
    }
  }`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system:
      "You are an expert in agricultural water management and crop irrigation. Provide precise, cost-effective irrigation recommendations for Indian farming conditions.",
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  })

  let scheduleData
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      scheduleData = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error("[v0] Parse error:", e)
  }

  return {
    cropName,
    growthStage,
    soilType,
    currentMoisture,
    recommendedFrequency: scheduleData?.recommendedFrequency || 7,
    recommendedQuantity: scheduleData?.recommendedQuantity || 40,
    waterSourceSuggestions: scheduleData?.waterSourceSuggestions || ["Well water", "Tube well"],
    irrigationMethod: scheduleData?.irrigationMethod || "drip",
    timingRecommendation: scheduleData?.timingRecommendation || "Early morning",
    weatherAdjustments: scheduleData?.weatherAdjustments || "Monitor rainfall",
    soilMoistureThresholds: scheduleData?.soilMoistureThresholds || {
      minimum: 50,
      optimal: 70,
      maximum: 85,
    },
    stressIndicators: scheduleData?.stressIndicators || ["Wilting", "Leaf curl"],
    costsEstimate: scheduleData?.costsEstimate || {
      electricityCost: 500,
      waterCost: 1000,
      totalPerAcrePerMonth: 1500,
    },
  }
}

/**
 * Get weather-based farming advice for the next 15 days
 */
export async function getWeatherFarmingAdvice(
  cropName: string,
  growthStage: string,
  currentWeather: WeatherData,
  forecast: Array<{ date: string; condition: string; temp: number; rainfall: number }>,
  location?: { latitude: number; longitude: number },
  language: "en" | "te" | "hi" = "en"
): Promise<WeatherFarmingAdvice> {
  const prompt = `Provide 15-day weather-based farming advice for ${cropName} at ${growthStage} stage:
  
  Current Weather:
  - Temperature: ${currentWeather.temperature.min}°C to ${currentWeather.temperature.max}°C
  - Rainfall: ${currentWeather.rainfall}mm
  - Humidity: ${currentWeather.humidity}%
  - Wind Speed: ${currentWeather.windSpeed} km/h
  - Soil Moisture: ${currentWeather.soilMoisture || "not available"}%
  
  Provide JSON advice:
  {
    "cropSpecificAdvice": [
      "Reduce irrigation by 30% due to expected rainfall",
      "Spray fungicide before predicted rain",
      "Ensure good drainage to prevent waterlogging"
    ],
    "irrigationAdjustments": "Skip one irrigation, resume after weather stabilizes",
    "pestRiskAlerts": ["High humidity may increase fungal diseases", "Monitor for leaf spot"],
    "diseaseRiskAlerts": ["Blast disease risk high due to temp and humidity", "Apply preventive spray"],
    "optimizedOperations": ["Prune excess foliage for better air circulation", "Apply mulch"],
    "yieldImpactAssessment": "Current weather favorable, expected 5-10% yield increase",
    "harvestReadinessForecast": "Harvest window extending by 3-4 days due to weather"
  }`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system:
      "You are an expert agricultural meteorologist. Provide actionable weather-based farming advice for Indian crops with specific impact on yield and disease management.",
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  })

  let adviceData
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      adviceData = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error("[v0] Parse error:", e)
  }

  return {
    date: new Date().toISOString().split("T")[0],
    currentWeather,
    forecast15Day: forecast.map((day, idx) => ({
      date: day.date,
      condition: day.condition,
      temperature: {
        min: day.temp - 5,
        max: day.temp + 5,
      },
      rainfall: day.rainfall,
      advisoryLevel: day.rainfall > 30 ? "warning" : day.temp > 35 ? "caution" : "normal",
    })),
    cropSpecificAdvice: adviceData?.cropSpecificAdvice || [
      "Monitor crop regularly",
      "Maintain proper irrigation",
    ],
    irrigationAdjustments: adviceData?.irrigationAdjustments || "Monitor and adjust as needed",
    pestRiskAlerts: adviceData?.pestRiskAlerts || [],
    diseaseRiskAlerts: adviceData?.diseaseRiskAlerts || [],
    optimizedOperations: adviceData?.optimizedOperations || ["Maintain field hygiene"],
    yieldImpactAssessment: adviceData?.yieldImpactAssessment || "Expected normal yield",
    harvestReadinessForecast: adviceData?.harvestReadinessForecast || "Monitor crop progress",
  }
}

/**
 * Calculate crop water requirements for entire season
 */
export async function getCropWaterRequirement(
  cropName: string,
  totalArea: number,
  soilType: string,
  location?: { latitude: number; longitude: number }
): Promise<CropWaterRequirement> {
  const prompt = `Calculate water requirements for ${cropName}:
  
  Details:
  - Crop: ${cropName}
  - Area: ${totalArea} acres
  - Soil Type: ${soilType}
  - Location: ${location ? `${location.latitude}, ${location.longitude}` : "Central India"}
  
  Provide JSON:
  {
    "totalSeasonWater": 600,
    "monthlyBreakdown": [
      {
        "month": 1,
        "growthStage": "Germination",
        "waterRequired": 50,
        "percentageOfTotal": 8.3
      },
      {
        "month": 2,
        "growthStage": "Vegetative",
        "waterRequired": 150,
        "percentageOfTotal": 25
      }
    ],
    "adjustmentFactors": {
      "rainfallReduction": 30,
      "evapotranspirationFactor": 1.2,
      "soilRetention": 70
    }
  }`

  const result = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system:
      "You are an expert in crop water management and agricultural hydrology. Provide accurate water requirement calculations for Indian crops.",
    prompt,
    temperature: 0.7,
    maxTokens: 1200,
  })

  let waterData
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      waterData = JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error("[v0] Parse error:", e)
  }

  return {
    cropName,
    totalSeasonWater: waterData?.totalSeasonWater || 600,
    monthlyBreakdown: waterData?.monthlyBreakdown || getDefaultMonthlyWaterBreakdown(),
    adjustmentFactors: waterData?.adjustmentFactors || {
      rainfallReduction: 30,
      evapotranspirationFactor: 1.2,
      soilRetention: 70,
    },
  }
}

/**
 * Estimate pest risk based on weather conditions
 */
export function assessPestRiskFromWeather(weather: WeatherData): {
  overallRisk: "low" | "medium" | "high" | "critical"
  affectedPests: Array<{ pest: string; risk: "low" | "medium" | "high" | "critical" }>
  recommendedActions: string[]
} {
  let riskScore = 0

  // Temperature-based risk
  if (weather.temperature.min > 20 && weather.temperature.max < 30) riskScore += 30
  if (weather.temperature.min > 15 && weather.temperature.max > 35) riskScore += 20

  // Humidity-based risk
  if (weather.humidity > 70) riskScore += 25
  if (weather.humidity > 85) riskScore += 15

  // Rainfall-based risk
  if (weather.rainfall > 10) riskScore += 20

  // Wind speed-based risk (low wind increases pest pressure)
  if (weather.windSpeed < 5) riskScore += 15

  const overallRisk =
    riskScore > 75 ? "critical" : riskScore > 60 ? "high" : riskScore > 40 ? "medium" : "low"

  const affectedPests: Array<{ pest: string; risk: "low" | "medium" | "high" | "critical" }> = []

  if (weather.humidity > 80 && weather.temperature.min > 20) {
    affectedPests.push({ pest: "Fungal diseases", risk: "high" })
    affectedPests.push({ pest: "Leaf spot", risk: "high" })
  }

  if (weather.temperature.max > 30 && weather.humidity > 60) {
    affectedPests.push({ pest: "Mites", risk: "high" })
    affectedPests.push({ pest: "Aphids", risk: "medium" })
  }

  if (weather.rainfall > 20) {
    affectedPests.push({ pest: "Bacterial blight", risk: "high" })
  }

  return {
    overallRisk,
    affectedPests: affectedPests.length > 0 ? affectedPests : [{ pest: "General pests", risk: "low" }],
    recommendedActions:
      overallRisk === "critical"
        ? [
            "Spray fungicide immediately",
            "Ensure proper drainage",
            "Increase field monitoring frequency",
          ]
        : overallRisk === "high"
          ? ["Prepare pesticide spray", "Monitor weather closely", "Check crop regularly"]
          : ["Continue regular monitoring", "Maintain field sanitation"],
  }
}

/**
 * Default monthly water breakdown (fallback)
 */
function getDefaultMonthlyWaterBreakdown(): CropWaterRequirement["monthlyBreakdown"] {
  return [
    { month: 1, growthStage: "Germination", waterRequired: 50, percentageOfTotal: 8.3 },
    { month: 2, growthStage: "Vegetative", waterRequired: 150, percentageOfTotal: 25 },
    { month: 3, growthStage: "Flowering", waterRequired: 200, percentageOfTotal: 33.3 },
    { month: 4, growthStage: "Fruiting", waterRequired: 150, percentageOfTotal: 25 },
    { month: 5, growthStage: "Maturity", waterRequired: 50, percentageOfTotal: 8.3 },
  ]
}
