import { NextRequest, NextResponse } from "next/server"
import { comprehensiveCropAnalysis } from "@/lib/services/crop-doctor"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * POST /api/crop-doctor/analyze
 * Comprehensive crop analysis: disease, pests, deficiencies, growth stage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, cropName, farmerId, soilType, conversationId } = body

    // Validate input
    if (!imageUrl || !cropName || !farmerId) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, cropName, farmerId" },
        { status: 400 }
      )
    }

    // Run comprehensive analysis
    const analysis = await comprehensiveCropAnalysis(
      imageUrl,
      cropName,
      farmerId,
      soilType
    )

    // Add conversation context if provided
    if (conversationId) {
      Object.assign(analysis, { conversationId })
    }

    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    console.error("[v0] Crop analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze crop image" },
      { status: 500 }
    )
  }
}
