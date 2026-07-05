import type { LucideIcon } from "lucide-react"
import {
  BadgeIndianRupee,
  Banknote,
  FlaskConical,
  HandCoins,
  ShieldCheck,
  Sprout,
} from "lucide-react"

export type SchemeStatus = "not_applied" | "in_review" | "approved" | "action_needed"

export type StepState = "done" | "current" | "pending"

export type ApplicationStep = {
  label: string
  note: string
  state: StepState
}

export type Scheme = {
  id: string
  name: string
  shortName: string
  category: "Income" | "Insurance" | "Subsidy" | "Credit" | "Advisory"
  icon: LucideIcon
  tint: string
  tagline: string
  benefit: string
  benefitNote: string
  deadline: string
  beneficiaries: string
  about: string
  eligibility: { label: string; met: boolean }[]
  documents: { label: string; uploaded: boolean }[]
  steps: ApplicationStep[]
  status: SchemeStatus
  appId?: string
}

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    shortName: "PM-KISAN",
    category: "Income",
    icon: BadgeIndianRupee,
    tint: "bg-primary/12 text-primary",
    tagline: "Direct income support",
    benefit: "₹6,000",
    benefitNote: "per year · 3 instalments",
    deadline: "Rolling · open",
    beneficiaries: "11.2 Cr farmers",
    about:
      "Income support of ₹6,000 a year to all landholding farmer families, paid in three equal ₹2,000 instalments directly into your bank account via DBT.",
    eligibility: [
      { label: "Landholding farmer family", met: true },
      { label: "Aadhaar linked to bank account", met: true },
      { label: "Not an income-tax payer", met: true },
      { label: "Land records updated post-2019", met: false },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Bank passbook", uploaded: true },
      { label: "Land ownership records (RoR)", uploaded: false },
    ],
    steps: [
      { label: "Application submitted", note: "Verified by CSC", state: "done" },
      { label: "State land verification", note: "Revenue dept.", state: "done" },
      { label: "Central approval", note: "PFMS validation", state: "current" },
      { label: "Instalment credited", note: "DBT to bank", state: "pending" },
    ],
    status: "in_review",
    appId: "PMK-TS-2026-88214",
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "Crop Insurance",
    category: "Insurance",
    icon: ShieldCheck,
    tint: "bg-accent/15 text-accent",
    tagline: "Crop failure protection",
    benefit: "Up to ₹2L",
    benefitNote: "sum insured per ha",
    deadline: "31 Jul 2026",
    beneficiaries: "5.5 Cr enrolled",
    about:
      "Comprehensive risk cover against crop loss due to natural calamities, pests and disease. Premium is just 2% for Kharif, 1.5% for Rabi — the rest is subsidised by the government.",
    eligibility: [
      { label: "Growing a notified crop", met: true },
      { label: "Land in a notified area", met: true },
      { label: "Valid sowing certificate", met: true },
      { label: "Enrolled before cut-off date", met: true },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Bank passbook", uploaded: true },
      { label: "Sowing certificate", uploaded: true },
      { label: "Land records (RoR)", uploaded: true },
    ],
    steps: [
      { label: "Application submitted", note: "Via bank/CSC", state: "done" },
      { label: "Premium debited", note: "₹840 paid", state: "done" },
      { label: "Policy issued", note: "Cover active", state: "done" },
      { label: "Claim window", note: "On loss reported", state: "pending" },
    ],
    status: "approved",
    appId: "PMFBY-TS-2026-40917",
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization",
    shortName: "Subsidies",
    category: "Subsidy",
    icon: Sprout,
    tint: "bg-chart-3/15 text-chart-3",
    tagline: "Equipment purchase subsidy",
    benefit: "40–50%",
    benefitNote: "on machinery cost",
    deadline: "15 Aug 2026",
    beneficiaries: "18 L claims",
    about:
      "Financial assistance of 40–50% on the purchase of tractors, rotavators, harvesters and other farm machinery, with higher rates for SC/ST, women and small farmers.",
    eligibility: [
      { label: "Own cultivable land", met: true },
      { label: "No subsidy claimed this year", met: true },
      { label: "Purchase from approved dealer", met: false },
      { label: "Valid quotation uploaded", met: false },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Land records (RoR)", uploaded: true },
      { label: "Dealer quotation", uploaded: false },
      { label: "Caste certificate (if applicable)", uploaded: false },
    ],
    steps: [
      { label: "Application", note: "Not started", state: "pending" },
      { label: "Document verification", note: "Agri dept.", state: "pending" },
      { label: "Subsidy sanction", note: "DBT approval", state: "pending" },
      { label: "Amount credited", note: "To bank", state: "pending" },
    ],
    status: "not_applied",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    shortName: "Loans",
    category: "Credit",
    icon: Banknote,
    tint: "bg-chart-4/15 text-chart-4",
    tagline: "Low-interest crop loans",
    benefit: "4% interest",
    benefitNote: "up to ₹3L limit",
    deadline: "Rolling · open",
    beneficiaries: "7.3 Cr cards",
    about:
      "Flexible credit for crop cultivation and allied activities at an effective 4% interest with timely repayment. Covers inputs, harvest expenses and household needs.",
    eligibility: [
      { label: "Farmer / tenant / sharecropper", met: true },
      { label: "Land records verified", met: true },
      { label: "No loan default history", met: true },
      { label: "KYC completed at bank", met: false },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Land records (RoR)", uploaded: true },
      { label: "Passport photo", uploaded: false },
      { label: "Bank KYC form", uploaded: false },
    ],
    steps: [
      { label: "Application submitted", note: "At branch", state: "done" },
      { label: "Field verification", note: "Bank officer", state: "current" },
      { label: "Credit sanction", note: "Limit assigned", state: "pending" },
      { label: "Card issued", note: "Ready to use", state: "pending" },
    ],
    status: "action_needed",
    appId: "KCC-TS-2026-11703",
  },
  {
    id: "shc",
    name: "Soil Health Card Scheme",
    shortName: "Soil Health",
    category: "Advisory",
    icon: FlaskConical,
    tint: "bg-primary/12 text-primary",
    tagline: "Free soil nutrient testing",
    benefit: "Free",
    benefitNote: "test every 2 years",
    deadline: "Rolling · open",
    beneficiaries: "22 Cr cards",
    about:
      "Get your soil tested free of cost and receive a personalised card with nutrient status and crop-wise fertiliser recommendations to cut input costs and boost yield.",
    eligibility: [
      { label: "Own or cultivate farmland", met: true },
      { label: "Located in a covered district", met: true },
      { label: "Sample collected by agent", met: false },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Land records (RoR)", uploaded: true },
    ],
    steps: [
      { label: "Request submitted", note: "Online/CSC", state: "done" },
      { label: "Soil sample collected", note: "Field agent", state: "current" },
      { label: "Lab analysis", note: "12 parameters", state: "pending" },
      { label: "Card generated", note: "With advisory", state: "pending" },
    ],
    status: "in_review",
    appId: "SHC-TS-2026-63550",
  },
  {
    id: "kalia",
    name: "Interest Subvention & Relief Grant",
    shortName: "Relief Grant",
    category: "Income",
    icon: HandCoins,
    tint: "bg-accent/15 text-accent",
    tagline: "Support for small farmers",
    benefit: "₹10,000",
    benefitNote: "per season",
    deadline: "30 Sep 2026",
    beneficiaries: "1.2 Cr farmers",
    about:
      "Livelihood assistance for small and marginal farmers and landless agricultural households, paid per cropping season to cover cultivation costs.",
    eligibility: [
      { label: "Small / marginal farmer", met: true },
      { label: "Annual income below threshold", met: true },
      { label: "Not a govt. employee", met: true },
      { label: "Bank account seeded with Aadhaar", met: false },
    ],
    documents: [
      { label: "Aadhaar card", uploaded: true },
      { label: "Income certificate", uploaded: false },
      { label: "Bank passbook", uploaded: true },
    ],
    steps: [
      { label: "Application", note: "Not started", state: "pending" },
      { label: "Gram panchayat verification", note: "Local body", state: "pending" },
      { label: "Approval", note: "District level", state: "pending" },
      { label: "Grant credited", note: "DBT", state: "pending" },
    ],
    status: "not_applied",
  },
]

export const STATUS_META: Record<
  SchemeStatus,
  { label: string; tone: string; dot: string }
> = {
  not_applied: {
    label: "Not applied",
    tone: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  in_review: {
    label: "In review",
    tone: "bg-accent/15 text-accent",
    dot: "bg-accent",
  },
  approved: {
    label: "Approved",
    tone: "bg-primary/12 text-primary",
    dot: "bg-primary",
  },
  action_needed: {
    label: "Action needed",
    tone: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
}

export function eligibilityScore(s: Scheme) {
  const met = s.eligibility.filter((e) => e.met).length
  return { met, total: s.eligibility.length, pct: Math.round((met / s.eligibility.length) * 100) }
}

export function docsScore(s: Scheme) {
  const done = s.documents.filter((d) => d.uploaded).length
  return { done, total: s.documents.length }
}
