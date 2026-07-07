import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(request: NextRequest) {
  try {
    const {
      cropType,
      issue,
      symptoms,
      language = "en",
      issueType = "disease",
      imageUrl,
      growthStage,
      soilType,
    } = await request.json();

    // Validate input
    if (!cropType || !issue || !symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: cropType, issue, symptoms" },
        { status: 400 }
      );
    }

    // Build system prompt based on language and issue type
    const systemPrompts = {
      en: `You are Akanksha, an expert agricultural AI advisor specializing in Indian farming. Provide accurate, comprehensive agricultural advice based on scientific knowledge and proven Indian farming practices. Be specific with quantities, timings, costs, and cultural practices. Always include confidence levels.`,
      te: `మీరు అకంక్ష, భారతీయ రైతుల కోసం నిపుణ వ్యవసాయ AI సలహాదారు. ఖచ్చితమైన, కార్యరూప సలహాను అందించండి. నిర్దిష్ట పరిమాణాలు, సమయాలు మరియు ఖర్చులను చేర్చండి.`,
      hi: `आप अकांक्षा हैं, भारतीय किसानों के लिए विशेषज्ञ कृषि AI सलाहकार। सटीक, कार्यरत कृषि सलाह प्रदान करें। विशिष्ट मात्रा, समय और लागत शामिल करें।`,
    };

    const systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en;

    // Build analysis prompt
    const analysisPrompt = `Analyze this agricultural ${issueType} for a ${cropType} crop:

Issue Description: ${issue}
Observed Symptoms: ${symptoms.join(", ")}
Growth Stage: ${growthStage || "not specified"}
Soil Type: ${soilType || "not specified"}
${imageUrl ? "Image attached for visual analysis" : ""}

Provide a JSON response with this exact structure:
{
  "issue": "Specific issue name",
  "confidence": 85,
  "severity": "mild|moderate|severe|critical",
  "description": "Detailed description of the issue",
  "immediate": ["Action 1", "Action 2", "Action 3"],
  "shortTerm": ["Action 1", "Action 2", "Action 3"],
  "longTerm": ["Action 1", "Action 2"],
  "preventive": ["Measure 1", "Measure 2"],
  "startTreatment": "timing",
  "expectedResolution": "7-14 days",
  "monitoringPeriod": "21 days",
  "expectedOutcome": "Description of expected results",
  "costEstimate": 2500
}`;

    // Generate AI analysis
    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      prompt: analysisPrompt,
      temperature: 0.7,
    });

    // Parse the JSON response
    let analysisData;
    try {
      // Extract JSON from the response (may contain markdown code blocks)
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError);
      // Return a structured response based on the text
      analysisData = {
        issue: issue,
        confidence: 75,
        severity: "moderate",
        description: `Analysis of ${issue} in ${cropType}`,
        immediate: ["Monitor crop closely", "Document symptoms"],
        shortTerm: ["Implement treatment plan", "Track progress"],
        longTerm: ["Prevent recurrence"],
        preventive: ["Maintain crop health"],
        startTreatment: "As soon as possible",
        expectedResolution: "7-21 days",
        monitoringPeriod: "30 days",
        expectedOutcome: "Improved crop health",
        costEstimate: 2000,
      };
    }

    return NextResponse.json({
      analysis: {
        issue: analysisData.issue || issue,
        issueType: issueType,
        confidence: analysisData.confidence || 75,
        severity: analysisData.severity || "moderate",
        description: analysisData.description || `Detected ${issueType} in ${cropType}`,
        followUpQuestions: [
          "When did you first notice these symptoms?",
          "What percentage of your field is affected?",
          "Have you applied any treatments yet?",
        ],
      },
      recommendations: {
        immediate: analysisData.immediate || ["Monitor the crop", "Document changes"],
        shortTerm: analysisData.shortTerm || ["Implement treatment", "Track progress"],
        longTerm: analysisData.longTerm || ["Prevent recurrence"],
        preventive: analysisData.preventive || ["Maintain crop health"],
        costEstimate: analysisData.costEstimate || 2500,
      },
      timeline: {
        startTreatment: analysisData.startTreatment || "Immediately",
        expectedResolution: analysisData.expectedResolution || "7-14 days",
        monitoringPeriod: analysisData.monitoringPeriod || "21 days",
      },
      expectedOutcome:
        analysisData.expectedOutcome ||
        "Full crop recovery with improved yield restoration expected",
    });
  } catch (error) {
    console.error("[v0] Crop doctor API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze crop health", details: String(error) },
      { status: 500 }
    );
  }
}
