export type Trend = "up" | "down"

export type Kpi = {
  id: string
  label: string
  value: string
  delta: number
  trend: Trend
  spark: number[]
  icon: string
  tint: string
}

export const KPIS: Kpi[] = [
  {
    id: "calls",
    label: "Calls Today",
    value: "342",
    delta: 12.4,
    trend: "up",
    spark: [220, 260, 240, 300, 280, 320, 342],
    icon: "PhoneCall",
    tint: "text-chart-1",
  },
  {
    id: "followups",
    label: "Follow-ups Due",
    value: "48",
    delta: -6.2,
    trend: "down",
    spark: [70, 64, 58, 60, 55, 51, 48],
    icon: "CalendarClock",
    tint: "text-accent",
  },
  {
    id: "farmers",
    label: "Farmer Signups",
    value: "1,284",
    delta: 8.1,
    trend: "up",
    spark: [980, 1020, 1080, 1120, 1180, 1230, 1284],
    icon: "Users",
    tint: "text-chart-1",
  },
  {
    id: "operators",
    label: "Operator Signups",
    value: "236",
    delta: 15.7,
    trend: "up",
    spark: [150, 168, 180, 195, 210, 224, 236],
    icon: "Tractor",
    tint: "text-chart-3",
  },
  {
    id: "revenue",
    label: "Revenue (MTD)",
    value: "₹18.6L",
    delta: 9.3,
    trend: "up",
    spark: [11, 12.4, 13.8, 15.1, 16.2, 17.5, 18.6],
    icon: "IndianRupee",
    tint: "text-chart-1",
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "34.8%",
    delta: 2.6,
    trend: "up",
    spark: [28, 29.5, 30, 31.4, 32.8, 33.6, 34.8],
    icon: "Target",
    tint: "text-accent",
  },
]

/* Today's target */
export const TARGET = {
  callsDone: 342,
  callsGoal: 400,
  revenueDone: 186000,
  revenueGoal: 250000,
  signupsDone: 62,
  signupsGoal: 80,
}

export function pct(done: number, goal: number) {
  return Math.min(100, Math.round((done / goal) * 100))
}

/* Call analytics */
export const CALL_STATS = {
  connected: 268,
  missed: 41,
  scheduled: 33,
  avgDuration: "4m 12s",
  answerRate: 78,
}

export const CALLS_TREND = [
  { label: "Mon", calls: 280, connected: 210 },
  { label: "Tue", calls: 312, connected: 236 },
  { label: "Wed", calls: 298, connected: 224 },
  { label: "Thu", calls: 340, connected: 262 },
  { label: "Fri", calls: 358, connected: 281 },
  { label: "Sat", calls: 402, connected: 318 },
  { label: "Sun", calls: 342, connected: 268 },
]

/* Registrations */
export const REGISTRATIONS = [
  { label: "Mon", farmers: 148, operators: 22 },
  { label: "Tue", farmers: 172, operators: 28 },
  { label: "Wed", farmers: 156, operators: 24 },
  { label: "Thu", farmers: 188, operators: 31 },
  { label: "Fri", farmers: 204, operators: 36 },
  { label: "Sat", farmers: 224, operators: 41 },
  { label: "Sun", farmers: 192, operators: 34 },
]

/* Revenue vs target */
export const REVENUE_TREND = [
  { label: "Jan", revenue: 120000, target: 150000 },
  { label: "Feb", revenue: 138000, target: 150000 },
  { label: "Mar", revenue: 162000, target: 170000 },
  { label: "Apr", revenue: 155000, target: 170000 },
  { label: "May", revenue: 188000, target: 190000 },
  { label: "Jun", revenue: 210000, target: 200000 },
  { label: "Jul", revenue: 186000, target: 250000 },
]

/* AI Lead scoring */
export type Lead = {
  id: string
  name: string
  location: string
  crop: string
  score: number
  intent: "Hot" | "Warm" | "Cold"
  value: string
  reason: string
  phone: string
}

export const LEADS: Lead[] = [
  {
    id: "l1",
    name: "Ramesh Yadav",
    location: "Warangal",
    crop: "Cotton · 12 acres",
    score: 94,
    intent: "Hot",
    value: "₹48,000",
    reason: "Opened pricing 3x, requested drone demo",
    phone: "+91 98765 43210",
  },
  {
    id: "l2",
    name: "Lakshmi Devi",
    location: "Karimnagar",
    crop: "Paddy · 8 acres",
    score: 88,
    intent: "Hot",
    value: "₹32,500",
    reason: "Booked soil test, high engagement",
    phone: "+91 91234 56780",
  },
  {
    id: "l3",
    name: "Suresh Reddy",
    location: "Nizamabad",
    crop: "Maize · 20 acres",
    score: 76,
    intent: "Warm",
    value: "₹61,000",
    reason: "Compared 2 machinery quotes",
    phone: "+91 99887 76655",
  },
  {
    id: "l4",
    name: "Anita Kumari",
    location: "Khammam",
    crop: "Chilli · 6 acres",
    score: 71,
    intent: "Warm",
    value: "₹24,800",
    reason: "Subscribed to price alerts",
    phone: "+91 90000 12345",
  },
  {
    id: "l5",
    name: "Venkat Rao",
    location: "Adilabad",
    crop: "Soybean · 15 acres",
    score: 52,
    intent: "Cold",
    value: "₹18,200",
    reason: "Single visit, no callback yet",
    phone: "+91 98111 22333",
  },
]

/* Follow-ups */
export type FollowUp = {
  id: string
  name: string
  time: string
  type: "Call" | "Visit" | "Demo" | "Payment"
  note: string
  priority: "High" | "Medium" | "Low"
  done: boolean
}

export const FOLLOWUPS: FollowUp[] = [
  { id: "f1", name: "Ramesh Yadav", time: "10:30 AM", type: "Demo", note: "Drone spraying demo — North field", priority: "High", done: false },
  { id: "f2", name: "Lakshmi Devi", time: "11:15 AM", type: "Call", note: "Confirm soil test slot", priority: "High", done: false },
  { id: "f3", name: "Suresh Reddy", time: "01:00 PM", type: "Payment", note: "Collect harvester advance", priority: "Medium", done: false },
  { id: "f4", name: "Anita Kumari", time: "03:30 PM", type: "Visit", note: "Field visit — chilli pest check", priority: "Medium", done: false },
  { id: "f5", name: "Venkat Rao", time: "05:00 PM", type: "Call", note: "Re-engage cold lead", priority: "Low", done: true },
]

/* Calendar */
export type CalEvent = {
  day: number
  count: number
  intensity: 0 | 1 | 2 | 3
}

export const CAL_MONTH = "July 2026"
export const CAL_FIRST_WEEKDAY = 2 // Wed (0=Sun)
export const CAL_DAYS = 31
export const CAL_TODAY = 5

export const CAL_EVENTS: Record<number, CalEvent> = {
  2: { day: 2, count: 3, intensity: 1 },
  3: { day: 3, count: 6, intensity: 2 },
  5: { day: 5, count: 8, intensity: 3 },
  8: { day: 8, count: 4, intensity: 2 },
  11: { day: 11, count: 2, intensity: 1 },
  14: { day: 14, count: 7, intensity: 3 },
  17: { day: 17, count: 5, intensity: 2 },
  22: { day: 22, count: 3, intensity: 1 },
  25: { day: 25, count: 6, intensity: 2 },
  29: { day: 29, count: 4, intensity: 2 },
}

/* Leaderboard */
export type Agent = {
  id: string
  name: string
  role: string
  calls: number
  conversions: number
  revenue: string
  score: number
  change: number
}

export const LEADERBOARD: Agent[] = [
  { id: "a1", name: "Priya Sharma", role: "Sr. Agri Advisor", calls: 412, conversions: 148, revenue: "₹6.2L", score: 96, change: 2 },
  { id: "a2", name: "Arjun Mehta", role: "Field Executive", calls: 388, conversions: 132, revenue: "₹5.4L", score: 91, change: 0 },
  { id: "a3", name: "Kavya Nair", role: "Agri Advisor", calls: 356, conversions: 121, revenue: "₹4.9L", score: 87, change: 3 },
  { id: "a4", name: "Rohit Verma", role: "Field Executive", calls: 334, conversions: 108, revenue: "₹4.1L", score: 82, change: -1 },
  { id: "a5", name: "Sneha Rao", role: "Agri Advisor", calls: 312, conversions: 96, revenue: "₹3.7L", score: 78, change: 1 },
]

export function intentColor(intent: Lead["intent"]) {
  if (intent === "Hot") return "text-destructive bg-destructive/10 border-destructive/20"
  if (intent === "Warm") return "text-accent bg-accent/10 border-accent/20"
  return "text-muted-foreground bg-muted border-border"
}

export function priorityColor(p: FollowUp["priority"]) {
  if (p === "High") return "text-destructive bg-destructive/10"
  if (p === "Medium") return "text-accent bg-accent/10"
  return "text-muted-foreground bg-muted"
}
