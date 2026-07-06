export interface SchemeCategory {
  id: string
  name: string
  name_te: string | null
  description: string | null
  code: string | null
  icon: string | null
  sort_order: number
}

export interface Scheme {
  id: string
  name: string
  name_te: string | null
  code: string
  description: string | null
  summary: string | null
  department: string | null
  level: "state" | "national"
  category_id: string | null
  status: "active" | "inactive" | "upcoming"
  budget: number | null
  max_beneficiaries: number | null
  helpline: string | null
  application_url: string | null
  application_start: string | null
  application_end: string | null
  valid_from: string | null
  valid_to: string | null
  tags: string[]
  created_at: string
}

export interface SchemeBenefit {
  id: string
  scheme_id: string
  name: string
  description: string | null
  benefit_type: string
  amount: number | null
  unit: string | null
  max_amount: number | null
  frequency: string | null
  currency: string
}

export interface SchemeEligibility {
  id: string
  scheme_id: string
  criterion: string
  description: string | null
  value: Record<string, unknown> | null
  operator: string
  field_key: string | null
  is_mandatory: boolean
}

export interface SchemeApplication {
  id: string
  reference_no: string | null
  scheme_id: string
  farmer_id: string
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "disbursed"
  form_data: Record<string, unknown> | null
  is_eligible: boolean | null
  submitted_at: string | null
  approved_at: string | null
  rejected_at: string | null
  approval_notes: string | null
  scheme?: {
    id: string
    name: string
    code: string
  }
}
