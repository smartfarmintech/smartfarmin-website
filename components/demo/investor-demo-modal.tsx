"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Copy, Eye, EyeOff, X, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEMO_WALKTHROUGH, DEMO_METRICS } from "@/lib/demo/investor-demo"
import { cn } from "@/lib/utils"

interface InvestorDemoModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InvestorDemoModal({ open = false, onOpenChange }: InvestorDemoModalProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNext = () => {
    if (currentStep < DEMO_WALKTHROUGH.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/founder")
      onOpenChange?.(false)
    }
  }

  const handleSkip = () => {
    router.push("/founder")
    onOpenChange?.(false)
  }

  const demoCredentials = {
    email: "investor@smartfarmin.demo",
    password: "DemoPass@2024",
  }

  if (currentStep < DEMO_WALKTHROUGH.length) {
    const step = DEMO_WALKTHROUGH[currentStep]

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              SmartFarmin Investor Tour
            </DialogTitle>
            <DialogDescription>
              Step {currentStep + 1} of {DEMO_WALKTHROUGH.length}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((currentStep + 1) / DEMO_WALKTHROUGH.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSkip} variant="outline" className="flex-1">
                Skip Tour
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {currentStep === DEMO_WALKTHROUGH.length - 1 ? "Start Demo" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Investor Demo Access
            </DialogTitle>
            <DialogDescription>
              Explore SmartFarmin's enterprise features with demo credentials
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange?.(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex gap-2">
                  <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all">
                    {demoCredentials.email}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(demoCredentials.email)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="flex gap-2">
                  <code
                    className={cn(
                      "flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all",
                      showPassword ? "" : "text-muted-foreground"
                    )}
                  >
                    {showPassword ? demoCredentials.password : "•".repeat(16)}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(demoCredentials.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                These demo credentials contain sample data only. No production data is affected.
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Business Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                  <p className="text-lg font-bold">₹{(DEMO_METRICS.revenue.monthly / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Active Farmers</p>
                  <p className="text-lg font-bold">{(DEMO_METRICS.users.farmers / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                  <p className="text-lg font-bold text-green-600">+{DEMO_METRICS.revenue.growth}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Drone Missions</p>
                  <p className="text-lg font-bold">{(DEMO_METRICS.operations.droneMissions / 1000).toFixed(1)}K+</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="secondary">Real-time Analytics</Badge>
            <Badge variant="secondary">Fleet Management</Badge>
            <Badge variant="secondary">AI Crop Doctor</Badge>
            <Badge variant="secondary">Marketplace</Badge>
            <Badge variant="secondary">Drone Services</Badge>
            <Badge variant="secondary">ROI Calculator</Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                router.push("/login?demo=true")
                onOpenChange?.(false)
              }}
              className="flex-1"
            >
              Start Demo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
