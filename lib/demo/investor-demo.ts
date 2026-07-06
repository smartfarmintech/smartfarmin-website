"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ActionState = { ok: boolean; error?: string } | null

/**
 * Demo account credentials - change for each demo
 */
const DEMO_CREDENTIALS = {
  email: "investor@smartfarmin.demo",
  password: "DemoPass@2024",
  role: "founder",
}

/**
 * Demo metrics reflecting impressive business metrics
 */
export const DEMO_METRICS = {
  revenue: {
    monthly: 4820000, // ₹48.2 L
    quarterly: 14460000,
    yearly: 57840000,
    growth: 18.4,
  },
  users: {
    farmers: 24580,
    operators: 3840,
    dealers: 450,
    fpos: 85,
    growthRate: 12.5,
  },
  operations: {
    activeBookings: 2145,
    completedBookings: 15430,
    marketplaceOrders: 8945,
    droneMissions: 1240,
    aiAnalyses: 18740,
  },
  regions: {
    maharashtra: { farmers: 8500, revenue: 1200000 },
    karnataka: { farmers: 6200, revenue: 950000 },
    "uttar-pradesh": { farmers: 5800, revenue: 880000 },
    rajasthan: { farmers: 4080, revenue: 790000 },
  },
}

/**
 * Get demo login credentials
 */
export async function getDemoCredentials() {
  return DEMO_CREDENTIALS
}

/**
 * Create demo account (one-time setup)
 */
export async function createDemoAccount(): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Create demo auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      email_confirm: true,
      user_metadata: {
        role: "founder",
        isDemo: true,
        createdAt: new Date().toISOString(),
      },
    })

    if (authError) throw authError

    // Create demo profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        name: "SmartFarmin Investor",
        email: DEMO_CREDENTIALS.email,
        role: "founder",
        is_demo_account: true,
        metadata: {
          company: "SmartFarmin Demo",
          region: "India",
          demoSetupDate: new Date().toISOString(),
        },
      })

    if (profileError) throw profileError

    revalidatePath("/")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Get demo analytics data
 */
export async function getDemoAnalytics() {
  return {
    metrics: DEMO_METRICS,
    insights: {
      topPerformer: "Maharashtra region - ₹1.2 Cr revenue",
      fastestGrowth: "AI Crop Doctor adoption - 32% farmers active",
      marketplaceGrowth: "Sales growing 24.1% MoM",
      retentionRate: "95.3% monthly retention",
    },
    forecasts: {
      next_quarter_revenue: 17500000,
      projected_users_by_year_end: 35000,
      market_expansion_potential: "8 additional states",
    },
  }
}

/**
 * ROI Calculator for investors
 */
export function calculateDemoROI(
  investmentAmount: number,
  investmentDate: Date
): {
  currentValue: number
  roi: number
  roiPercentage: number
  monthlyGrowth: number
  projectedValue12Months: number
} {
  // Simulate investment based on current metrics
  const monthsSinceInvestment = Math.max(
    1,
    (Date.now() - investmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )

  const monthlyGrowth = DEMO_METRICS.revenue.growth / 12 // Monthly growth rate
  const currentValue = investmentAmount * (1 + monthlyGrowth / 100) ** monthsSinceInvestment
  const roi = currentValue - investmentAmount
  const roiPercentage = (roi / investmentAmount) * 100

  const projectedValue12Months =
    investmentAmount * (1 + monthlyGrowth / 100) ** 12

  return {
    currentValue: Math.round(currentValue),
    roi: Math.round(roi),
    roiPercentage: Math.round(roiPercentage * 10) / 10,
    monthlyGrowth: monthlyGrowth,
    projectedValue12Months: Math.round(projectedValue12Months),
  }
}

/**
 * Growth projections for demo
 */
export function getGrowthProjections() {
  const months = 12
  const projections = []

  for (let i = 0; i <= months; i++) {
    const monthlyGrowth = DEMO_METRICS.revenue.growth / 12
    const revenue =
      DEMO_METRICS.revenue.monthly * (1 + monthlyGrowth / 100) ** i
    const farmers =
      DEMO_METRICS.users.farmers *
      (1 + DEMO_METRICS.users.growthRate / 12 / 100) ** i

    projections.push({
      month: i,
      revenue: Math.round(revenue),
      farmers: Math.round(farmers),
      activeBookings: Math.round(
        DEMO_METRICS.operations.activeBookings * (1 + (5 / 100) ** i)
      ),
    })
  }

  return projections
}

/**
 * Demo walkthrough steps
 */
export const DEMO_WALKTHROUGH = [
  {
    step: 1,
    title: "Welcome to SmartFarmin",
    description: "India's leading AgriTech platform",
    action: "View Dashboard",
    target: "/founder",
  },
  {
    step: 2,
    title: "Revenue Analytics",
    description: "Real-time business metrics and growth trends",
    action: "View Analytics",
    target: "/founder/analytics",
  },
  {
    step: 3,
    title: "User Growth",
    description: "24,580 active farmers, 3,840 operators",
    action: "View Users",
    target: "/admin/users",
  },
  {
    step: 4,
    title: "Drone Services",
    description: "1,240 completed missions, AI-powered crop analysis",
    action: "View Drones",
    target: "/founder/drone-analytics",
  },
  {
    step: 5,
    title: "Marketplace",
    description: "₹88.9 L in agricultural products",
    action: "View Marketplace",
    target: "/founder/marketplace-analytics",
  },
  {
    step: 6,
    title: "ROI & Growth",
    description: "18.4% YoY revenue growth, sustainable expansion",
    action: "Calculate ROI",
    target: "/investor/roi-calculator",
  },
]

/**
 * Reset demo account (for fresh presentation)
 */
export async function resetDemoAccount(): Promise<ActionState> {
  const supabase = await createClient()

  try {
    // Reset metrics by updating metadata
    const { error } = await supabase
      .from("user_profiles")
      .update({
        metadata: {
          lastReset: new Date().toISOString(),
          walkthrough_step: 0,
          demo_tours_completed: 0,
        },
      })
      .eq("email", DEMO_CREDENTIALS.email)

    if (error) throw error

    revalidatePath("/")
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Track demo engagement
 */
export async function trackDemoEngagement(
  action: string,
  duration: number,
  section: string
) {
  const supabase = await createClient()

  try {
    await supabase.from("demo_analytics").insert({
      action,
      duration_seconds: duration,
      section,
      timestamp: new Date().toISOString(),
    })

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
