// Akanksha AI Recommendations Engine

export interface CropData {
  name: string
  season: string
  stage: string
  sowingDate: Date
  area: number
  soilType: string
}

export interface SoilTestData {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  organicCarbon: number
}

export const FERTILIZER_RECOMMENDATIONS: Record<string, Record<string, any>> = {
  'rice': {
    'vegetative': { n: 80, p: 40, k: 40, micronutrients: ['Zn'] },
    'flowering': { n: 40, p: 60, k: 60, micronutrients: ['B'] },
    'maturity': { n: 0, p: 20, k: 40, micronutrients: ['Cu'] }
  },
  'wheat': {
    'vegetative': { n: 60, p: 40, k: 30, micronutrients: ['Zn'] },
    'flowering': { n: 40, p: 40, k: 50, micronutrients: ['B'] },
    'maturity': { n: 20, p: 20, k: 30, micronutrients: ['Cu'] }
  },
  'cotton': {
    'vegetative': { n: 100, p: 40, k: 40, micronutrients: ['B', 'Zn'] },
    'flowering': { n: 60, p: 60, k: 80, micronutrients: ['B', 'Mg'] },
    'maturity': { n: 40, p: 20, k: 80, micronutrients: ['K'] }
  },
  'maize': {
    'vegetative': { n: 100, p: 40, k: 30, micronutrients: ['Zn'] },
    'flowering': { n: 80, p: 40, k: 40, micronutrients: ['B', 'Zn'] },
    'maturity': { n: 40, p: 20, k: 60, micronutrients: [] }
  }
}

export const IRRIGATION_REQUIREMENTS: Record<string, Record<string, any>> = {
  'rice': {
    'kharif': { frequency: 'Every 5-7 days', depth: '5-7 cm', method: ['Flood', 'Drip'] },
    'rabi': { frequency: 'Every 10-15 days', depth: '5 cm', method: ['Drip', 'Sprinkler'] }
  },
  'wheat': {
    'rabi': { frequency: 'Every 20-25 days', depth: '5-7 cm', method: ['Flood', 'Drip'] }
  },
  'cotton': {
    'kharif': { frequency: 'Every 10-15 days', depth: '6-8 cm', method: ['Drip', 'Flood'] }
  },
  'maize': {
    'kharif': { frequency: 'Every 8-10 days', depth: '5-7 cm', method: ['Drip', 'Sprinkler'] }
  }
}

export const DISEASE_TREATMENTS: Record<string, any> = {
  'leaf_blast': {
    organic: [
      'Spray Bordeaux mixture (1%)',
      'Use copper fungicides',
      'Spray Trichoderma',
      'Use resistant varieties'
    ],
    chemical: [
      'Apply carbendazim (500 ppm)',
      'Use propiconazole',
      'Spray mancozeb',
      'Apply tebuconazole'
    ],
    prevention: [
      'Maintain proper spacing',
      'Remove infected leaves',
      'Improve drainage',
      'Use certified seeds'
    ],
    cost: { organic: 500, chemical: 300 }
  },
  'brown_leaf_spot': {
    organic: [
      'Spray neem oil (5%)',
      'Use Bordeaux mixture',
      'Apply sulfur powder',
      'Spray Trichoderma'
    ],
    chemical: [
      'Apply mancozeb',
      'Use carbendazim',
      'Spray cymoxanil',
      'Apply chlorothalonil'
    ],
    prevention: [
      'Remove infected leaves immediately',
      'Improve air circulation',
      'Avoid overhead irrigation',
      'Crop rotation'
    ],
    cost: { organic: 400, chemical: 250 }
  },
  'stem_rot': {
    organic: [
      'Apply Trichoderma to soil',
      'Use biocompost',
      'Drench with neem extract',
      'Improve drainage'
    ],
    chemical: [
      'Soil drench with carbendazim',
      'Apply metalaxyl',
      'Use chlorothalonil',
      'Drench with copper sulfate'
    ],
    prevention: [
      'Proper field sanitation',
      'Crop rotation',
      'Good drainage',
      'Avoid waterlogging'
    ],
    cost: { organic: 600, chemical: 400 }
  }
}

export const PEST_CONTROL: Record<string, any> = {
  'armyworm': {
    organic: [
      'Hand-pick and destroy',
      'Spray neem oil (5%)',
      'Use Bacillus thuringiensis',
      'Introduce natural enemies'
    ],
    chemical: [
      'Apply chlorpyrifos',
      'Spray lambda-cyhalothrin',
      'Use profenofos',
      'Apply deltamethrin'
    ],
    prevention: [
      'Use pheromone traps',
      'Remove alternate hosts',
      'Plough deep',
      'Use IPM'
    ],
    cost: { organic: 300, chemical: 150 }
  },
  'bollworm': {
    organic: [
      'Install pheromone traps',
      'Spray neem oil',
      'Use Bacillus thuringiensis',
      'Hand-pick eggs'
    ],
    chemical: [
      'Apply chlorpyrifos',
      'Spray spinosad',
      'Use lambda-cyhalothrin',
      'Apply acephate'
    ],
    prevention: [
      'Use resistant varieties',
      'Intercropping',
      'Proper field sanitation',
      'Timely harvesting'
    ],
    cost: { organic: 400, chemical: 200 }
  }
}

export function getFertilizerRecommendation(crop: string, stage: string, soilTest?: SoilTestData) {
  const baseRec = FERTILIZER_RECOMMENDATIONS[crop.toLowerCase()]?.[stage.toLowerCase()]

  if (!baseRec) {
    return null
  }

  let adjusted = { ...baseRec }

  if (soilTest) {
    // Adjust based on soil test
    if (soilTest.nitrogen < 280) adjusted.n *= 1.1
    if (soilTest.phosphorus < 16) adjusted.p *= 1.2
    if (soilTest.potassium < 112) adjusted.k *= 1.15
  }

  return {
    ...adjusted,
    dosagePerAcre: {
      urea: (adjusted.n / 46).toFixed(1), // Urea is 46% N
      dap: (adjusted.p / 18).toFixed(1), // DAP is 18% P and 20% N
      mop: (adjusted.k / 60).toFixed(1) // MOP is 60% K
    }
  }
}

export function getIrrigationAdvice(crop: string, season: string, rainfall: number = 0) {
  const requirement = IRRIGATION_REQUIREMENTS[crop.toLowerCase()]?.[season.toLowerCase()]

  if (!requirement) {
    return null
  }

  // Adjust for rainfall
  let adjustedFrequency = requirement.frequency
  if (rainfall > 50) {
    adjustedFrequency = 'Reduce frequency - sufficient rainfall'
  }

  return {
    ...requirement,
    adjustedFrequency,
    cropWaterRequirement: {
      season: '700-1200 mm',
      perDay: '3-5 mm',
      recommendation: `Provide ${requirement.depth} cm depth every ${requirement.frequency}`
    }
  }
}

export function analyzeDaysSince(date: Date): { days: number; stage: string } {
  const today = new Date()
  const diff = today.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  let stage = 'early'
  if (days > 90) stage = 'maturity'
  else if (days > 60) stage = 'flowering'
  else if (days > 30) stage = 'vegetative'

  return { days, stage }
}

export function calculateDeficiencyProbability(soilTest: SoilTestData): Record<string, number> {
  const deficiencies: Record<string, number> = {
    nitrogen: soilTest.nitrogen < 280 ? (280 - soilTest.nitrogen) / 280 : 0,
    phosphorus: soilTest.phosphorus < 16 ? (16 - soilTest.phosphorus) / 16 : 0,
    potassium: soilTest.potassium < 112 ? (112 - soilTest.potassium) / 112 : 0,
    sulfur: soilTest.nitrogen < 10 ? 0.8 : 0,
    zinc: 0.3, // Common in many soils
    boron: 0.2
  }

  return Object.fromEntries(
    Object.entries(deficiencies)
      .filter(([_, val]) => val > 0)
      .sort(([_, a], [_, b]) => b - a)
  )
}

export function getDiseaseRiskFactors(
  rainfall: number,
  temperature: number,
  humidity: number,
  cropStage: string
): { disease: string; probability: number; recommendation: string }[] {
  const risks = []

  // Leaf blast risk
  if (rainfall > 100 && temperature > 25 && humidity > 80) {
    risks.push({
      disease: 'Leaf Blast',
      probability: 0.8,
      recommendation: 'Spray Bordeaux mixture, improve drainage'
    })
  }

  // Brown spot risk
  if (humidity > 85 && temperature > 27) {
    risks.push({
      disease: 'Brown Spot',
      probability: 0.7,
      recommendation: 'Avoid overhead irrigation, improve ventilation'
    })
  }

  // Sheath blight risk
  if (temperature > 28 && humidity > 85) {
    risks.push({
      disease: 'Sheath Blight',
      probability: 0.75,
      recommendation: 'Increase spacing, apply fungicide'
    })
  }

  // Armyworm risk
  if (temperature > 20 && temperature < 30) {
    risks.push({
      disease: 'Armyworm',
      probability: 0.6,
      recommendation: 'Install pheromone traps, scout regularly'
    })
  }

  return risks.sort((a, b) => b.probability - a.probability)
}

export function estimateYield(
  crop: string,
  area: number,
  healthScore: number,
  expectedYield: number = 5000
): { estimate: number; factors: string[] } {
  let multiplier = 1
  const factors: string[] = []

  // Health score impact
  if (healthScore > 80) {
    multiplier *= 1.1
    factors.push('Excellent crop health')
  } else if (healthScore < 50) {
    multiplier *= 0.7
    factors.push('Poor crop health - diseases/pests detected')
  }

  const estimate = Math.round(expectedYield * multiplier * area)

  return { estimate, factors }
}

export const GOVERNMENT_SCHEMES = [
  {
    name: 'PM-KISAN',
    description: 'Income support for all farmers',
    benefit: '₹6,000 per year',
    link: 'https://pmkisan.gov.in'
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme',
    benefit: 'Premium subsidy up to 50%',
    link: 'https://pmfby.gov.in'
  },
  {
    name: 'Kisan Credit Card',
    description: 'Flexible credit for farming',
    benefit: 'Up to ₹2 lakh credit',
    link: 'https://www.nabard.org'
  }
]
