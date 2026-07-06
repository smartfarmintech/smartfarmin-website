"use server"

import { generateObject } from "ai"
import { z } from "zod"
import type { InsightCard } from "./akanksha"

const MODEL = "google/gemini-2.5-flash"

const SYSTEM_PROMPT = [
  "You are Akanksha, an AI farming co-pilot built by SmartFarmin Technologies for the Rythu360 platform.",
  "You help Indian farmers (primarily Telangana / Andhra Pradesh) with crop diseases, weather-based spraying windows,",
  "mandi (market) prices, government schemes and subsidies, personalised crop plans, and yield guidance.",
  "Give concise, practical, actionable advice. Use INR (₹), acres, and quintals. Use India-available products and schemes",
  "(PM-KISAN, Rythu Bandhu, PMFBY, PMKSY, etc.) where relevant. Be honest about uncertainty and remind farmers to verify",
  "critical or safety decisions with a local expert or extension officer. Keep the main answer under ~150 words and use short",
  "bullet points where helpful. Optionally include up to 3 short insight cards (a title, a punchy value, and an optional hint)",
  "that summarise the key numbers or takeaways.",
].join(" ")

export type AkankshaReply = { text: string; cards?: InsightCard[] }

/**
 * Ask Akanksha a farming question. Returns a real AI-generated answer with
 * optional summary insight cards.
 */
export async function askAkanksha(question: string): Promise<AkankshaReply> {
  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: z.object({
        text: z.string().describe("The main answer for the farmer"),
        cards: z
          .array(
            z.object({
              title: z.string(),
              value: z.string(),
              hint: z.string().optional(),
              tone: z.enum(["up", "down", "neutral"]).optional(),
            })
          )
          .max(3)
          .optional()
          .describe("Up to 3 short summary cards of the key numbers/takeaways"),
      }),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    })

    return { text: object.text, cards: object.cards as InsightCard[] | undefined }
  } catch (err: any) {
    return {
      text:
        "Sorry, I couldn't reach the AI service just now. Please try again in a moment. " +
        "If this keeps happening, check your connection or contact support.",
    }
  }
}
