/**
 * Validate and sanitize API inputs
 */
export interface ValidationRule {
  required?: boolean
  type?: "string" | "number" | "boolean" | "email" | "phone" | "url" | "date"
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
}

export function validateInput(
  data: Record<string, any>,
  schema: Record<string, ValidationRule>
): {
  valid: boolean
  errors: Record<string, string[]>
} {
  const errors: Record<string, string[]> = {}

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field]
    const fieldErrors: string[] = []

    // Check required
    if (rule.required && (value === undefined || value === null || value === "")) {
      fieldErrors.push(`${field} is required`)
      errors[field] = fieldErrors
      continue
    }

    if (value === undefined || value === null) {
      continue
    }

    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldErrors.push("Invalid email format")
          }
          break
        case "phone":
          if (!/^[0-9\-+\s()]{10,}$/.test(value)) {
            fieldErrors.push("Invalid phone number")
          }
          break
        case "url":
          try {
            new URL(value)
          } catch {
            fieldErrors.push("Invalid URL")
          }
          break
        case "date":
          if (isNaN(Date.parse(value))) {
            fieldErrors.push("Invalid date format")
          }
          break
        case "number":
          if (typeof value !== "number" && isNaN(Number(value))) {
            fieldErrors.push("Must be a number")
          }
          break
        case "boolean":
          if (typeof value !== "boolean") {
            fieldErrors.push("Must be a boolean")
          }
          break
        case "string":
          if (typeof value !== "string") {
            fieldErrors.push("Must be a string")
          }
          break
      }
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      fieldErrors.push(`Minimum length is ${rule.minLength}`)
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      fieldErrors.push(`Maximum length is ${rule.maxLength}`)
    }

    // Number range validation
    if (rule.min !== undefined && Number(value) < rule.min) {
      fieldErrors.push(`Must be at least ${rule.min}`)
    }
    if (rule.max !== undefined && Number(value) > rule.max) {
      fieldErrors.push(`Must be at most ${rule.max}`)
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      fieldErrors.push("Invalid format")
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      fieldErrors.push("Validation failed")
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate farmer registration
 */
export function validateFarmerRegistration(data: Record<string, any>) {
  return validateInput(data, {
    name: { required: true, type: "string", minLength: 2, maxLength: 100 },
    email: { required: true, type: "email" },
    phone: { required: true, type: "phone" },
    password: {
      required: true,
      custom: (value) => {
        return (
          value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value)
        )
      },
    },
    landSize: { required: true, type: "number", min: 0.1, max: 10000 },
    district: { required: true, type: "string", minLength: 2, maxLength: 100 },
    cropType: { required: true, type: "string", minLength: 2, maxLength: 100 },
  })
}

/**
 * Validate booking creation
 */
export function validateBookingCreation(data: Record<string, any>) {
  return validateInput(data, {
    machineType: { required: true, type: "string" },
    fieldSize: { required: true, type: "number", min: 0.1, max: 10000 },
    startDate: { required: true, type: "date" },
    endDate: { required: true, type: "date" },
    notes: { maxLength: 500 },
  })
}

/**
 * Validate product listing
 */
export function validateProductListing(data: Record<string, any>) {
  return validateInput(data, {
    name: { required: true, type: "string", minLength: 3, maxLength: 200 },
    description: { required: true, type: "string", minLength: 10, maxLength: 2000 },
    price: { required: true, type: "number", min: 0, max: 10000000 },
    quantity: { required: true, type: "number", min: 1, max: 100000 },
    category: { required: true, type: "string" },
    imageUrl: { type: "url" },
  })
}

/**
 * SQL injection prevention - parametrized queries are used by Supabase
 */
export function escapeSQL(value: string): string {
  return value.replace(/'/g, "''")
}

/**
 * XSS prevention - sanitize HTML
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement("div")
  div.textContent = html
  return div.innerHTML
}

/**
 * Validate JWT token structure
 */
export function validateJWTStructure(token: string): boolean {
  const parts = token.split(".")
  if (parts.length !== 3) return false

  try {
    // Decode header
    const header = JSON.parse(atob(parts[0]))
    // Decode payload
    const payload = JSON.parse(atob(parts[1]))

    return header.typ === "JWT" && payload.sub && payload.iat && payload.exp
  } catch {
    return false
  }
}

/**
 * Check for common vulnerable patterns
 */
export function detectVulnerablePatterns(input: string): string[] {
  const vulnerabilities: string[] = []

  // SQL injection patterns
  if (/('|(--)|;|\/\*|\*\/|xp_|sp_)/i.test(input)) {
    vulnerabilities.push("Possible SQL injection")
  }

  // XSS patterns
  if (/<script|javascript:|onerror|onload/i.test(input)) {
    vulnerabilities.push("Possible XSS attack")
  }

  // Command injection patterns
  if (/[|&;`$()]/g.test(input)) {
    vulnerabilities.push("Possible command injection")
  }

  return vulnerabilities
}
