import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { cropType, issue, symptoms, language = "en" } = await request.json();

    // Validate input
    if (!cropType || !issue || !symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: cropType, issue, symptoms" },
        { status: 400 }
      );
    }

    // Return a mock analysis response
    // In production, this would integrate with the Akanksha crop doctor AI system
    return NextResponse.json({
      analysis: {
        issue: issue,
        confidence: 87,
        severity: "moderate",
        description: `Detected ${issue} in ${cropType} crop based on symptoms: ${symptoms.join(", ")}`,
        followUpQuestions: [
          "When did you first notice these symptoms?",
          "What is the percentage of affected area?",
          "Have you applied any treatments yet?"
        ],
      },
      recommendations: {
        immediate: [
          "Isolate affected plants to prevent spread",
          "Remove heavily infected leaves and stems"
        ],
        shortTerm: [
          "Apply neem oil spray every 7 days",
          "Improve soil drainage to reduce moisture"
        ],
        longTerm: [
          "Crop rotation with non-host crops",
          "Implement integrated pest management practices"
        ],
        preventive: [
          "Use disease-resistant crop varieties",
          "Maintain proper crop spacing and ventilation"
        ],
        costEstimate: 2500,
      },
      timeline: {
        startTreatment: "Immediately",
        expectedResolution: "7-14 days",
        monitoringPeriod: "21 days",
      },
      expectedOutcome: "Full crop recovery with 90% yield restoration expected",
    });
  } catch (error) {
    console.error("[v0] Crop doctor API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze crop health" },
      { status: 500 }
    );
  }
}
