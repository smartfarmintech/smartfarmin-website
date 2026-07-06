'use server'

import { createClient } from '@/lib/supabase/server'

export interface CropStressAnalysis {
  stress_level: 'low' | 'medium' | 'high'
  affected_area_percent: number
  detected_issues: string[]
  recommendations: string[]
  confidence: number
}

export interface SpraySchedule {
  recommended_date: string
  weather_window: { start_time: string; end_time: string }
  wind_speed_ms: number
  temperature_range: { min: number; max: number }
  humidity_percent: number
  safety_notes: string[]
}

export interface PesticideQuantity {
  product_name: string
  quantity_liters: number
  concentration_percent: number
  coverage_area_acres: number
  application_rate: string
  cost_per_acre: number
  total_cost: number
  safety_precautions: string[]
}

export interface FlightPlan {
  flight_id: string
  drone_model: string
  area_acres: number
  altitude_meters: number
  speed_kmph: number
  flight_time_minutes: number
  battery_required_percent: number
  waypoints: Array<{ lat: number; lng: number; altitude: number }>
  overlap_percent: number
  safety_zones: string[]
}

export interface NDVIAnalysis {
  ndvi_score: number
  vegetation_health: 'excellent' | 'good' | 'fair' | 'poor'
  stressed_zones: Array<{ zone_id: string; ndvi: number; coverage_percent: number }>
  recommendations: string[]
  processed_at: string
}

export interface CoverageEstimate {
  area_acres: number
  estimated_time_minutes: number
  estimated_battery_percent: number
  swath_width_meters: number
  number_of_passes: number
  overlap_margin_percent: number
  weather_impact: string
}

export interface PostFlightReport {
  flight_id: string
  date: string
  area_covered_acres: number
  duration_minutes: number
  battery_used_percent: number
  coverage_quality: 'excellent' | 'good' | 'fair' | 'poor'
  issues_encountered: string[]
  sample_locations: Array<{ lat: number; lng: number; image_url?: string }>
  recommendations: string[]
}

/**
 * Detect crop stress from uploaded drone/field image
 */
export async function detectCropStress(
  imageUrl: string,
  cropName: string,
  fieldArea: number,
): Promise<CropStressAnalysis> {
  // In production, this would call a real ML model (e.g., TensorFlow, PyTorch)
  // For now, return realistic sample analysis
  const supabase = await createClient()

  // Store the analysis in image_analysis table
  const { data } = await supabase.from('image_analysis').insert({
    image_url: imageUrl,
    analysis_type: 'crop_stress',
    model: 'crop-stress-v1',
    status: 'completed',
  })

  // Simulated crop stress detection logic
  const stressLevel = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
  const affectedArea = stressLevel === 'high' ? 25 : stressLevel === 'medium' ? 12 : 3

  const issueMap: Record<string, string[]> = {
    paddy: ['leaf blast', 'brown spot', 'nitrogen deficiency', 'waterlogging'],
    wheat: ['powdery mildew', 'rust', 'root rot', 'drought stress'],
    maize: ['fall armyworm', 'leaf spot', 'drought stress', 'nutrient deficiency'],
    cotton: ['spider mites', 'leaf curl', 'wilt', 'sooty mold'],
  }

  const recommendationMap: Record<string, string[]> = {
    paddy: [
      'Spray fungicide (propiconazole 25% EC) at 1000 L/acre',
      'Apply potassium nitrate (13% K) at 25 kg/acre',
      'Maintain 5cm water level for 7 days',
      'Monitor closely for secondary infections',
    ],
    wheat: [
      'Apply sulphur dust at 30 kg/acre for powdery mildew',
      'Spray mancozeb for rust control',
      'Improve drainage to prevent root rot',
      'Ensure proper irrigation scheduling',
    ],
    maize: [
      'Use Bt cotton or spray spinosad for armyworm',
      'Apply copper fungicide for leaf spot',
      'Increase irrigation frequency',
      'Apply NPK 19:19:19 at 25 kg/acre',
    ],
    cotton: [
      'Release natural predators (Phytoseiulus) for spider mites',
      'Spray neem oil at 3% concentration',
      'Disinfect irrigation system',
      'Remove infected plants',
    ],
  }

  return {
    stress_level: stressLevel as 'low' | 'medium' | 'high',
    affected_area_percent: affectedArea,
    detected_issues: (issueMap[cropName.toLowerCase()] || issueMap.paddy).slice(0, 2),
    recommendations: (recommendationMap[cropName.toLowerCase()] || recommendationMap.paddy).slice(
      0,
      3,
    ),
    confidence: 0.87 + Math.random() * 0.1,
  }
}

/**
 * Recommend optimal spraying schedule based on weather & crop
 */
export async function recommendSpraySchedule(
  fieldLat: number,
  fieldLng: number,
  cropName: string,
  issueType: string,
): Promise<SpraySchedule> {
  // In production, integrate with real weather API
  const baseTemp = 22 + Math.random() * 10
  const baseWind = 2 + Math.random() * 3

  return {
    recommended_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    weather_window: {
      start_time: '06:00 AM', // Early morning ideal
      end_time: '09:00 AM', // Before temperature rises
    },
    wind_speed_ms: baseWind,
    temperature_range: {
      min: Math.floor(baseTemp - 2),
      max: Math.ceil(baseTemp + 2),
    },
    humidity_percent: 60 + Math.random() * 20,
    safety_notes: [
      'Wind speed < 3.5 m/s is ideal for spray application',
      'Spray before 10 AM to avoid heat damage',
      'Avoid spraying 24 hours before/after rain',
      'Wear protective gear (PPE) during application',
    ],
  }
}

/**
 * Calculate pesticide/fertilizer quantity based on crop, area, and issue
 */
export async function calculatePesticideQuantity(
  cropName: string,
  areaAcres: number,
  issueType: string,
  sprayType: 'pesticide' | 'fertilizer' | 'growth_regulator',
): Promise<PesticideQuantity> {
  // Standard spray rates per crop/issue
  const rateMap: Record<string, { litersPerAcre: number; concentration: number; costPerAcre: number }> = {
    'paddy-fungicide': { litersPerAcre: 1000, concentration: 25, costPerAcre: 450 },
    'paddy-insecticide': { litersPerAcre: 1000, concentration: 4, costPerAcre: 350 },
    'wheat-fungicide': { litersPerAcre: 600, concentration: 20, costPerAcre: 380 },
    'maize-insecticide': { litersPerAcre: 800, concentration: 5, costPerAcre: 420 },
    'cotton-miticide': { litersPerAcre: 1000, concentration: 18, costPerAcre: 500 },
  }

  const key = `${cropName.toLowerCase()}-${issueType.toLowerCase()}`
  const rate = rateMap[key] || { litersPerAcre: 1000, concentration: 20, costPerAcre: 400 }

  const totalLiters = rate.litersPerAcre * areaAcres
  const totalCost = rate.costPerAcre * areaAcres

  return {
    product_name: `${issueType.replace(/_/g, ' ')} - ${cropName}`,
    quantity_liters: totalLiters,
    concentration_percent: rate.concentration,
    coverage_area_acres: areaAcres,
    application_rate: `${rate.litersPerAcre} L/acre`,
    cost_per_acre: rate.costPerAcre,
    total_cost: totalCost,
    safety_precautions: [
      'Apply in early morning or late evening',
      'Maintain wind speed 1-3 m/s',
      'Keep away from water bodies (minimum 25m)',
      'Reentry period: 24-48 hours',
      'Wear full PPE during mixing and spraying',
    ],
  }
}

/**
 * Generate automated flight plan for drone
 */
export async function generateFlightPlan(
  fieldBounds: { lat1: number; lng1: number; lat2: number; lng2: number },
  areaAcres: number,
  droneModel: string,
  sprayType: string,
): Promise<FlightPlan> {
  // Calculate optimal flight parameters
  const altitude = sprayType === 'pesticide' ? 15 : sprayType === 'ndvi' ? 100 : 50
  const speed = 8 // meters per second
  const flightTime = (areaAcres * 60) / 8 // Rough estimate: 8 acres per hour
  const overlap = sprayType === 'ndvi' ? 30 : 20 // NDVI needs more overlap for accuracy

  // Generate waypoints (simplified grid pattern)
  const waypoints = []
  const lat1 = fieldBounds.lat1
  const lng1 = fieldBounds.lng1
  const lat2 = fieldBounds.lat2
  const lng2 = fieldBounds.lng2

  const latStep = (lat2 - lat1) / 5
  const lngStep = (lng2 - lng1) / 5

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      waypoints.push({
        lat: lat1 + latStep * i,
        lng: lng1 + lngStep * j,
        altitude: altitude,
      })
    }
  }

  return {
    flight_id: `FLIGHT-${Date.now()}`,
    drone_model: droneModel,
    area_acres: areaAcres,
    altitude_meters: altitude,
    speed_kmph: speed * 3.6,
    flight_time_minutes: Math.ceil(flightTime),
    battery_required_percent: Math.ceil((flightTime / 25) * 100), // 25 min battery life
    waypoints: waypoints,
    overlap_percent: overlap,
    safety_zones: [
      'No-fly zone: Power lines > 30m radius',
      'Avoid residential areas within 100m',
      'Monitor for obstacles: trees, buildings',
    ],
  }
}

/**
 * Provide NDVI (Normalized Difference Vegetation Index) analysis placeholder
 */
export async function analyzeNDVI(
  imageUrl: string,
  fieldArea: number,
  capturedAt: string,
): Promise<NDVIAnalysis> {
  // NDVI calculation placeholder
  // Real implementation would use multispectral camera data
  const ndviScore = 0.4 + Math.random() * 0.5 // Range 0.4-0.9
  const vegetation_health: 'excellent' | 'good' | 'fair' | 'poor' =
    ndviScore > 0.75
      ? 'excellent'
      : ndviScore > 0.6
        ? 'good'
        : ndviScore > 0.4
          ? 'fair'
          : 'poor'

  return {
    ndvi_score: Math.round(ndviScore * 1000) / 1000,
    vegetation_health: vegetation_health,
    stressed_zones: [
      {
        zone_id: 'zone-1',
        ndvi: 0.35,
        coverage_percent: 15,
      },
      {
        zone_id: 'zone-2',
        ndvi: 0.55,
        coverage_percent: 20,
      },
    ],
    recommendations: [
      'Zone 1 (NDVI 0.35): Apply targeted nitrogen dose (30 kg/acre urea)',
      'Zone 2 (NDVI 0.55): Increase irrigation frequency by 25%',
      'Overall: Schedule follow-up NDVI imaging in 2 weeks',
    ],
    processed_at: capturedAt,
  }
}

/**
 * Estimate spray coverage and battery usage
 */
export async function estimateCoverage(
  areaAcres: number,
  droneModel: string,
  windCondition: 'calm' | 'light' | 'moderate',
): Promise<CoverageEstimate> {
  const baseTime = (areaAcres / 8) * 60 // 8 acres per hour
  const timeMultiplier = windCondition === 'calm' ? 1 : windCondition === 'light' ? 1.2 : 1.4
  const batteryPercentPerMinute = 4 // Standard battery usage

  const totalTime = baseTime * timeMultiplier
  const batteryUsed = totalTime * batteryPercentPerMinute
  const swathWidth = 15 // meters, typical for agricultural drones
  const passes = Math.ceil(areaAcres * 0.4 / swathWidth) // Rough calculation

  const weatherImpactMap: Record<string, string> = {
    calm: 'Optimal conditions - no impact',
    light: 'Light wind may cause 5-10% drift',
    moderate: 'Moderate wind may reduce coverage efficiency by 15-20%',
  }

  return {
    area_acres: areaAcres,
    estimated_time_minutes: Math.ceil(totalTime),
    estimated_battery_percent: Math.min(100, batteryUsed),
    swath_width_meters: swathWidth,
    number_of_passes: passes,
    overlap_margin_percent: 20,
    weather_impact: weatherImpactMap[windCondition],
  }
}

/**
 * Generate post-flight report
 */
export async function generatePostFlightReport(
  flightId: string,
  areaAcres: number,
  startTime: Date,
  endTime: Date,
  batteryRemaining: number,
  issues: string[],
): Promise<PostFlightReport> {
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / 60000
  const batteryUsed = 100 - batteryRemaining
  const coverage = areaAcres * (100 - Math.random() * 5) / 100 // 95-100% coverage
  const quality: 'excellent' | 'good' | 'fair' | 'poor' =
    coverage > 98 ? 'excellent' : coverage > 95 ? 'good' : coverage > 90 ? 'fair' : 'poor'

  return {
    flight_id: flightId,
    date: new Date().toISOString().split('T')[0],
    area_covered_acres: Math.round(coverage * 10) / 10,
    duration_minutes: Math.round(durationMinutes),
    battery_used_percent: batteryUsed,
    coverage_quality: quality,
    issues_encountered: issues.length > 0 ? issues : ['No issues encountered'],
    sample_locations: [
      { lat: 17.3605, lng: 78.4855, image_url: undefined }, // Sample coordinates
      { lat: 17.3606, lng: 78.4856, image_url: undefined },
    ],
    recommendations: [
      'Schedule next flight: 14-21 days',
      `Overall coverage: ${coverage.toFixed(1)}% - ${quality}`,
      issues.length > 0 ? `Address issues: ${issues.join(', ')}` : 'Repeat same flight pattern next cycle',
    ],
  }
}

/**
 * Store flight data in database
 */
export async function recordFlight(
  droneId: string,
  farmerId: string,
  bookingId: string,
  flightData: any,
) {
  const supabase = await createClient()

  const { error } = await supabase.from('drone_flights').insert({
    drone_id: droneId,
    farmer_id: farmerId,
    booking_id: bookingId,
    flight_plan: flightData.plan,
    crop_analysis: flightData.analysis,
    coverage_data: flightData.coverage,
    post_flight_report: flightData.report,
    status: 'completed',
  })

  if (error) {
    console.error('Error recording flight:', error)
    throw error
  }
}
