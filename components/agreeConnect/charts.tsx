"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
}

function TooltipBox({
  active,
  payload,
  label,
  suffix = "",
  prefix = "",
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  suffix?: string
  prefix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-popover-foreground">
            {prefix}
            {p.value.toLocaleString("en-IN")}
            {suffix}
          </span>
        </p>
      ))}
    </div>
  )
}

const incomeData = [
  { month: "Jan", income: 42000, expenses: 28000 },
  { month: "Feb", income: 38000, expenses: 24000 },
  { month: "Mar", income: 55000, expenses: 31000 },
  { month: "Apr", income: 61000, expenses: 33000 },
  { month: "May", income: 72000, expenses: 38000 },
  { month: "Jun", income: 68000, expenses: 35000 },
  { month: "Jul", income: 84000, expenses: 41000 },
]

export function IncomeAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={incomeData} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#fillIncome)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#fillExpenses)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const mandiData = [
  { week: "W1", price: 2100 },
  { week: "W2", price: 2180 },
  { week: "W3", price: 2050 },
  { week: "W4", price: 2240 },
  { week: "W5", price: 2320 },
  { week: "W6", price: 2280 },
  { week: "W7", price: 2410 },
  { week: "W8", price: 2480 },
]

export function MandiLineChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={mandiData} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis {...axisProps} width={44} domain={["dataMin - 100", "dataMax + 100"]} />
        <Tooltip content={<TooltipBox prefix="₹" suffix="/qtl" />} cursor={{ stroke: "var(--border)" }} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--chart-1)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

const moistureData = [
  { field: "North", moisture: 68 },
  { field: "East", moisture: 54 },
  { field: "South", moisture: 81 },
  { field: "West", moisture: 47 },
  { field: "Canal", moisture: 73 },
]

export function SoilMoistureChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={moistureData} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="field" {...axisProps} />
        <YAxis {...axisProps} width={36} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<TooltipBox suffix="%" />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
        <Bar dataKey="moisture" fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CropHealthGauge({ value = 88 }: { value?: number }) {
  const data = [{ name: "health", value }]
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        data={data}
        startAngle={220}
        endAngle={-40}
        innerRadius="72%"
        outerRadius="100%"
        barSize={14}
      >
        <defs>
          <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>
        </defs>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          background={{ fill: "var(--muted)" }}
          dataKey="value"
          cornerRadius={12}
          fill="url(#healthGrad)"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

export function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const chartData = data.map((v, i) => ({ i, v }))
  const color = up ? "var(--chart-1)" : "var(--destructive)"
  const id = `spark-${up ? "up" : "down"}`
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={chartData} margin={{ top: 4, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MarketAreaChart({
  data,
  unit,
  up,
}: {
  data: Array<{ label: string; price: number }>
  unit: string
  up: boolean
}) {
  const color = up ? "var(--chart-1)" : "var(--destructive)"
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillMarket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.32} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} minTickGap={16} />
        <YAxis {...axisProps} width={52} domain={["dataMin - dataMin * 0.03", "dataMax + dataMax * 0.02"]} tickFormatter={(v) => Number(v).toLocaleString("en-IN")} />
        <Tooltip content={<TooltipBox prefix="₹" suffix={` ${unit.replace("₹/", "/")}`} />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="price" name="price" stroke={color} strokeWidth={2.5} fill="url(#fillMarket)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MarketTrendChart({
  data,
  up,
}: {
  data: Array<{ label: string; price: number }>
  up: boolean
}) {
  const color = up ? "var(--chart-1)" : "var(--destructive)"
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} minTickGap={16} />
        <YAxis {...axisProps} width={52} domain={["dataMin - dataMin * 0.03", "dataMax + dataMax * 0.02"]} tickFormatter={(v) => Number(v).toLocaleString("en-IN")} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ stroke: "var(--border)" }} />
        <Line type="monotone" dataKey="price" name="price" stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const rainData = [
  { day: "Mon", temp: 31, rain: 2 },
  { day: "Tue", temp: 33, rain: 0 },
  { day: "Wed", temp: 30, rain: 12 },
  { day: "Thu", temp: 28, rain: 24 },
  { day: "Fri", temp: 29, rain: 8 },
  { day: "Sat", temp: 32, rain: 0 },
  { day: "Sun", temp: 34, rain: 0 },
]

export function WeatherChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={rainData} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillRain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} width={36} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="rain"
          name="rain (mm)"
          stroke="var(--chart-3)"
          strokeWidth={2.5}
          fill="url(#fillRain)"
        />
        <Line type="monotone" dataKey="temp" name="temp (°C)" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

/* ---------------- CRM charts ---------------- */

export function CallsTrendChart({
  data,
}: {
  data: Array<{ label: string; calls: number; connected: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ left: -4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={40} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="calls" name="calls" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#fillCalls)" />
        <Line type="monotone" dataKey="connected" name="connected" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function RegistrationsBarChart({
  data,
}: {
  data: Array<{ label: string; farmers: number; operators: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={32} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
        <Bar dataKey="farmers" name="farmers" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={26} />
        <Bar dataKey="operators" name="operators" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RevenueTargetChart({
  data,
}: {
  data: Array<{ label: string; revenue: number; target: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ left: -4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
        <Bar dataKey="revenue" name="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={34} />
        <Line type="monotone" dataKey="target" name="target" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="5 4" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function DonutProgress({
  value = 72,
  label,
}: {
  value?: number
  label?: string
}) {
  const data = [{ name: "progress", value }]
  return (
    <div className="relative w-full">
      <ResponsiveContainer width="100%" height={120}>
        <RadialBarChart data={data} startAngle={90} endAngle={-270} innerRadius="78%" outerRadius="100%" barSize={12}>
          <defs>
            <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" />
              <stop offset="100%" stopColor="var(--chart-1)" />
            </linearGradient>
          </defs>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: "var(--muted)" }} dataKey="value" cornerRadius={12} fill="url(#donutGrad)" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-lg font-semibold tabular-nums">{value}%</span>
        {label ? <span className="text-[10px] text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  )
}

/* ---------------- Executive charts ---------------- */

export function RevenueGmvChart({
  data,
}: {
  data: Array<{ label: string; gmv: number; revenue: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillGmv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.32} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={46} tickFormatter={(v) => `${v / 100000}L`} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="gmv" name="GMV" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#fillGmv)" />
        <Area type="monotone" dataKey="revenue" name="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#fillRev)" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function RevenueStreamChart({
  data,
}: {
  data: Array<{ label: string; marketplace: number; subscriptions: number; commissions: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `${v / 100000}L`} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
        <Bar dataKey="marketplace" name="marketplace" stackId="r" fill="var(--chart-1)" maxBarSize={30} />
        <Bar dataKey="subscriptions" name="subscriptions" stackId="r" fill="var(--chart-2)" maxBarSize={30} />
        <Bar dataKey="commissions" name="commissions" stackId="r" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AiUsageChart({
  data,
}: {
  data: Array<{ label: string; queries: number; scans: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillAi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="queries" name="AI queries" stroke="var(--accent)" strokeWidth={2.5} fill="url(#fillAi)" />
        <Line type="monotone" dataKey="scans" name="crop scans" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function MrrTrendChart({
  data,
}: {
  data: Array<{ label: string; mrr: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillMrr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.32} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `${v / 100000}L`} />
        <Tooltip content={<TooltipBox prefix="₹" />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="mrr" name="MRR" stroke="var(--accent)" strokeWidth={2.5} fill="url(#fillMrr)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
