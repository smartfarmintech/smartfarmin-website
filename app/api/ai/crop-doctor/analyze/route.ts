import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { analyzeCropHealth, getRecommendations } from "@/lib/ai/akanksha-crop-doctor";

export async function POST(request: NextRequest) {
  try {
    const { cropType, issue, symptoms, farmingMethod, language = "en" } = await request.json();

    // Validate input
    if (!cropType || !issue || !symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: cropType, issue, symptoms" },
        { status: 400 }
      );
    }

    // Get AI analysis
    const analysis = await analyzeCropHealth({
      cropType,
      issue,
      symptoms,
      farmingMethod: farmingMethod || "conventional",
      language,
    });

    // Get personalized recommendations
    const recommendations = await getRecommendations({
      cropType,
      issue: analysis.issue,
      severity: analysis.severity,
      farmingMethod: farmingMethod || "conventional",
      language,
    });

    return NextResponse.json({
      analysis: {
        issue: analysis.issue,
        issueType: analysis.issueType,
        confidence: analysis.confidence,
        severity: analysis.severity,
        description: analysis.description,
      },
      recommendations: {
        immediate: recommendations.immediate,
        shortTerm: recommendations.shortTerm,
        longTerm: recommendations.longTerm,
        preventive: recommendations.preventive,
        costEstimate: recommendations.costEstimate,
      },
      timeline: recommendations.timeline,
      expectedOutcome: recommendations.expectedOutcome,
    });
  } catch (error) {
    console.error("[v0] Crop doctor API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze crop health" },
      { status: 500 }
    );
  }
}
