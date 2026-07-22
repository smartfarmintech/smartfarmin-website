export type PlanId = "free" | "basic" | "premium" | "enterprise"

export type Plan = {
  id: PlanId
  name: string
  tagline: string
  price: number // monthly, INR
  yearlyPrice: number // per-month when billed yearly
  icon: "leaf" | "zap" | "crown" | "building"
  accent: string // css var token for accent color
  popular?: boolean
  highlights: string[]
  ctaLabel: string
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Start growing smarter",
    price: 0,
    yearlyPrice: 0,
    icon: "leaf",
    accent: "var(--chart-3)",
    highlights: [
      "Daily mandi prices for 1 crop",
      "Basic weather forecast",
      "Community access",
      "5 AI queries / month",
    ],
    ctaLabel: "Current plan",
  },
  {
    id: "basic",
    name: "Basic",
    tagline: "For the growing farmer",
    price: 199,
    yearlyPrice: 166,
    icon: "zap",
    accent: "var(--chart-1)",
    highlights: [
      "Mandi prices for 5 crops",
      "7-day hyperlocal weather",
      "50 AI queries / month",
      "Crop disease scans",
      "Priority community support",
    ],
    ctaLabel: "Upgrade to Basic",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The complete toolkit",
    price: 499,
    yearlyPrice: 416,
    icon: "crown",
    accent: "var(--accent)",
    popular: true,
    highlights: [
      "Unlimited crops & mandi alerts",
      "15-day weather + advisories",
      "Unlimited AI + voice assistant",
      "Priority equipment booking",
      "Free delivery on organic store",
      "Dedicated advisor",
    ],
    ctaLabel: "Upgrade to Premium",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For FPOs & agri-business",
    price: 999,
    yearlyPrice: 832,
    icon: "building",
    accent: "var(--chart-2)",
    highlights: [
      "Everything in Premium",
      "Multi-farm & team management",
      "Bulk procurement pricing",
      "API access & integrations",
      "Custom analytics dashboards",
      "24/7 account manager",
    ],
    ctaLabel: "Talk to sales",
  },
]

export type FeatureRow = {
  section: string
  label: string
  values: Record<PlanId, boolean | string>
}

export const FEATURE_MATRIX: FeatureRow[] = [
  {
    section: "Market Intelligence",
    label: "Mandi price tracking",
    values: { free: "1 crop", basic: "5 crops", premium: "Unlimited", enterprise: "Unlimited" },
  },
  {
    section: "Market Intelligence",
    label: "Price drop alerts",
    values: { free: false, basic: true, premium: true, enterprise: true },
  },
  {
    section: "Market Intelligence",
    label: "Weather forecast",
    values: { free: "3-day", basic: "7-day", premium: "15-day", enterprise: "15-day" },
  },
  {
    section: "Akanksha AI",
    label: "AI queries",
    values: { free: "5 / mo", basic: "50 / mo", premium: "Unlimited", enterprise: "Unlimited" },
  },
  {
    section: "Akanksha AI",
    label: "Crop disease scan",
    values: { free: false, basic: true, premium: true, enterprise: true },
  },
  {
    section: "Akanksha AI",
    label: "Voice assistant",
    values: { free: false, basic: false, premium: true, enterprise: true },
  },
  {
    section: "Marketplace",
    label: "Equipment booking",
    values: { free: "Standard", basic: "Standard", premium: "Priority", enterprise: "Priority" },
  },
  {
    section: "Marketplace",
    label: "Organic store delivery",
    values: { free: false, basic: "Paid", premium: "Free", enterprise: "Free" },
  },
  {
    section: "Marketplace",
    label: "Bulk procurement pricing",
    values: { free: false, basic: false, premium: false, enterprise: true },
  },
  {
    section: "Support & Scale",
    label: "Dedicated advisor",
    values: { free: false, basic: false, premium: true, enterprise: true },
  },
  {
    section: "Support & Scale",
    label: "Team & multi-farm",
    values: { free: false, basic: false, premium: false, enterprise: true },
  },
  {
    section: "Support & Scale",
    label: "API access",
    values: { free: false, basic: false, premium: false, enterprise: true },
  },
]

/* -------- Subscription analytics -------- */

export const MRR_TREND = [
  { label: "Feb", mrr: 1820000 },
  { label: "Mar", mrr: 2040000 },
  { label: "Apr", mrr: 2260000 },
  { label: "May", mrr: 2510000 },
  { label: "Jun", mrr: 2740000 },
  { label: "Jul", mrr: 3120000 },
]

export const PLAN_MIX: Array<{ plan: string; subscribers: number; accent: string }> = [
  { plan: "Basic", subscribers: 18420, accent: "var(--chart-1)" },
  { plan: "Premium", subscribers: 9260, accent: "var(--accent)" },
  { plan: "Enterprise", subscribers: 1180, accent: "var(--chart-2)" },
]

export const SUB_KPIS = [
  { label: "MRR", value: "₹31.2L", delta: 13.9, up: true, hint: "Monthly recurring" },
  { label: "ARR", value: "₹3.74Cr", delta: 18.2, up: true, hint: "Annual run-rate" },
  { label: "Paid subscribers", value: "28,860", delta: 9.4, up: true, hint: "Across 3 tiers" },
  { label: "Net churn", value: "1.8%", delta: 0.6, up: false, hint: "Monthly" },
]

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN")
}

export function planPrice(plan: Plan, yearly: boolean) {
  return yearly ? plan.yearlyPrice : plan.price
}
