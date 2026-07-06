"use client"

import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"

interface YieldPrediction {
  crop: string
  expectedYield: { min: number; max: number; unit: string }
  confidence: number
  factors: Array<{ label: string; impact: "positive" | "negative" | "neutral"; value: string }>
  recommendations: string[]
}

export function YieldPredictionCard({ prediction }: { prediction: YieldPrediction }) {
  return (
    <div className="space-y-4">
      <Card className="border border-border/70 bg-card/70 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>{prediction.crop} Yield Forecast</CardTitle>
            </div>
            <span className="text-sm font-medium text-primary">{prediction.confidence}% confidence</span>
          </div>
          <CardDescription>Based on weather, soil, and historical data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Yield Range */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Expected Yield Range</p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-end gap-4"
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {prediction.expectedYield.min}-{prediction.expectedYield.max}
                  </div>
                  <p className="text-sm text-muted-foreground">{prediction.expectedYield.unit}</p>
                </div>
                <div className="flex-1 h-24 bg-muted/50 rounded-lg flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "80%" }}
                    transition={{ duration: 1 }}
                    className="w-1/3 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-1/3 bg-gradient-to-t from-primary/80 to-primary/30 rounded-t mx-auto"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "70%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="w-1/3 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t ml-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Key Factors */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Key Factors</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {prediction.factors.map((factor) => (
                <motion.div
                  key={factor.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg",
                    factor.impact === "positive"
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      : factor.impact === "negative"
                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {factor.impact === "positive" && <CheckCircle className="h-4 w-4" />}
                  {factor.impact === "negative" && <AlertCircle className="h-4 w-4" />}
                  {factor.impact === "neutral" && <TrendingUp className="h-4 w-4" />}
                  <span className="text-xs">
                    <span className="font-semibold">{factor.label}</span> {factor.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <p className="text-sm font-medium">To Maximize Yield</p>
            <ul className="space-y-2">
              {prediction.recommendations.map((rec, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
