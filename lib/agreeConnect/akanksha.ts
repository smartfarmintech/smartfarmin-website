export type Role = "user" | "ai"

export type ChatMessage = {
  id: string
  role: Role
  text: string
  attachment?: { kind: "image" | "scan"; label: string }
  cards?: InsightCard[]
  time: string
}

export type InsightCard = {
  title: string
  value: string
  hint?: string
  tone?: "up" | "down" | "neutral"
}

export type Capability = {
  id: string
  label: string
  desc: string
  icon: "disease" | "weather" | "market" | "schemes" | "reco" | "camera"
  prompt: string
}

export const CAPABILITIES: Capability[] = [
  {
    id: "disease",
    label: "Crop Disease",
    desc: "Diagnose from a photo or symptoms",
    icon: "disease",
    prompt: "My paddy leaves have yellow-brown spots with drooping tips. What disease is this?",
  },
  {
    id: "weather",
    label: "Weather",
    desc: "Forecast & spraying windows",
    icon: "weather",
    prompt: "What's the weather outlook for Warangal this week and is it safe to spray?",
  },
  {
    id: "market",
    label: "Market Prices",
    desc: "Live mandi rates & best time to sell",
    icon: "market",
    prompt: "What is today's paddy mandi price and should I sell now or wait?",
  },
  {
    id: "schemes",
    label: "Government Schemes",
    desc: "Subsidies & eligibility",
    icon: "schemes",
    prompt: "Which government schemes and subsidies am I eligible for as a small farmer?",
  },
  {
    id: "reco",
    label: "Recommendations",
    desc: "Personalised crop & input advice",
    icon: "reco",
    prompt: "Recommend the best crop plan for my 6.5 acres this Kharif season.",
  },
]

function now() {
  return new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
}

let seq = 0
export function makeMessage(role: Role, text: string, extra?: Partial<ChatMessage>): ChatMessage {
  seq += 1
  return {
    id: `m${Date.now()}-${seq}`,
    role,
    text,
    time: now(),
    ...extra,
  }
}

type Reply = { text: string; cards?: InsightCard[] }

export function generateReply(input: string): Reply {
  const q = input.toLowerCase()

  if (/(disease|spot|fungus|pest|leaf|blight|yellow|insect|worm)/.test(q)) {
    return {
      text: "Based on the yellow-brown lesions and drooping tips, this looks like Bacterial Leaf Blight (BLB), a common paddy disease in humid conditions. Confidence: 88%. Act within 2-3 days to limit spread.\n\nRecommended action:\n• Drain the field for 2 days to reduce humidity\n• Spray Copper Oxychloride (2.5 g/L) at dusk\n• Avoid excess nitrogen fertiliser for 10 days\n• Re-scan affected leaves in 5 days to confirm recovery",
      cards: [
        { title: "Diagnosis", value: "Bacterial Leaf Blight", tone: "down" },
        { title: "Confidence", value: "88%", tone: "neutral" },
        { title: "Severity", value: "Moderate", hint: "Treat in 2-3 days", tone: "down" },
      ],
    }
  }

  if (/(weather|rain|spray|temperature|forecast|humid|wind)/.test(q)) {
    return {
      text: "Warangal outlook for the next 7 days: partly cloudy with light showers on Thursday and Friday. Daytime highs 30-33°C, humidity 68-74%.\n\nSpraying window: Best today and tomorrow morning (low wind, no rain). Avoid Thu-Fri — rain will wash off foliar sprays. Resume Saturday evening.",
      cards: [
        { title: "Today", value: "31°C · Clear", hint: "Safe to spray", tone: "up" },
        { title: "Thu-Fri", value: "Light rain", hint: "Hold spraying", tone: "down" },
        { title: "Humidity", value: "68-74%", tone: "neutral" },
      ],
    }
  }

  if (/(price|mandi|sell|market|rate|quintal)/.test(q)) {
    return {
      text: "Today's paddy price at Warangal mandi is ₹2,203/quintal, up 1.8% from last week and trending upward. Arrivals are moderate.\n\nMy advice: prices typically peak in the next 8-10 days as procurement picks up. If you can store safely, hold for ~1 week to capture an estimated ₹80-120/quintal upside. Sell 30% now to cover immediate cash needs.",
      cards: [
        { title: "Paddy · Warangal", value: "₹2,203/qtl", hint: "+1.8% wk", tone: "up" },
        { title: "7-day trend", value: "Rising", tone: "up" },
        { title: "Suggestion", value: "Hold ~1 week", tone: "neutral" },
      ],
    }
  }

  if (/(scheme|subsidy|loan|kisan|pm-kisan|government|eligible|insurance)/.test(q)) {
    return {
      text: "As a small farmer with 6.5 acres in Telangana, you're likely eligible for:\n\n• PM-KISAN — ₹6,000/year direct income support\n• Rythu Bandhu — ₹7,500/acre/season investment support\n• PM Fasal Bima Yojana — subsidised crop insurance (2% premium)\n• Drip irrigation subsidy — up to 90% under PMKSY\n\nYou can apply for the drip subsidy directly from the Recommendations tab. Want me to check your PM-KISAN payment status?",
      cards: [
        { title: "PM-KISAN", value: "₹6,000/yr", hint: "Eligible", tone: "up" },
        { title: "Rythu Bandhu", value: "₹7,500/acre", hint: "Eligible", tone: "up" },
        { title: "Drip subsidy", value: "Up to 90%", hint: "PMKSY", tone: "up" },
      ],
    }
  }

  if (/(recommend|crop plan|kharif|rabi|what.*grow|advice|plan|acre)/.test(q)) {
    return {
      text: "For your 6.5 acres this Kharif season in Warangal's black cotton soil, here's an optimised plan:\n\n• 4 acres — BPT-5204 paddy (reliable, strong mandi demand)\n• 1.5 acres — Bt cotton (good margins, current prices firm)\n• 1 acre — red gram intercrop (soil nitrogen + extra income)\n\nStart nursery by late June, transplant early July. Projected net margin ≈ ₹92,000 for the season. Want a week-by-week task calendar?",
      cards: [
        { title: "Paddy", value: "4 acres", hint: "BPT-5204", tone: "neutral" },
        { title: "Cotton", value: "1.5 acres", hint: "Bt hybrid", tone: "neutral" },
        { title: "Est. margin", value: "₹92,000", hint: "this season", tone: "up" },
      ],
    }
  }

  return {
    text: "I'm Akanksha, your farming co-pilot. I can diagnose crop diseases from a photo, forecast weather and spraying windows, track live mandi prices, find government schemes you qualify for, and build a personalised crop plan. Tap a suggestion below or ask me anything in your own words.",
  }
}

export function scanResult(): Reply {
  return {
    text: "Scan complete. I analysed the leaf image and detected early-stage Leaf Blast on your paddy — small diamond-shaped grey lesions on 12% of the leaf area. Confidence: 91%.\n\nRecommended action:\n• Spray Tricyclazole (0.6 g/L) this evening\n• Reduce standing water to 2-3 cm\n• Re-scan in 4 days — I'll track the recovery for you",
    cards: [
      { title: "Detected", value: "Leaf Blast", tone: "down" },
      { title: "Affected area", value: "12%", hint: "Early stage", tone: "neutral" },
      { title: "Confidence", value: "91%", tone: "up" },
    ],
  }
}
