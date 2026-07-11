"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  AlertCircle,
  Leaf,
  Droplets,
  Zap,
  TrendingUp,
  CheckCircle,
  Loader2,
  ImageIcon,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AnalysisResult {
  cropName: string
  overallHealthScore: number
  disease: {
    predictedDisease: string
    confidence: number
    severity: string
    treatment: Array<{ step: number; action: string; duration: string; materials: string[] }>
  }
  pests: {
    identifiedPests: Array<{ pestName: string; confidence: number; riskLevel: string }>
  }
  deficiencies: {
    deficiencies: Array<{ nutrient: string; severity: string; symptoms: string[] }>
  }
  growthStage: {
    currentStage: string
    daysToNextStage: number
    managementTips: string[]
  }
  recommendations: Array<{
    type: string
    priority: string
    action: string
    urgency: string
  }>
  nextActions: string[]
}

export function CropDoctorInteractive() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [cropName, setCropName] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!imageUrl || !cropName) {
      setError("Please select an image and enter crop name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/crop-doctor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          cropName,
          farmerId: "demo-farmer", // In production, use actual farmer ID from auth
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")
      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze image. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Leaf className="w-10 h-10 text-primary" />
            AI Crop Doctor
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Upload a crop image and get instant AI-powered diagnosis for diseases,
            pests, nutrient deficiencies, and growth stage recommendations.
          </p>
        </motion.div>

        {!analysis ? (
          <>
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid lg:grid-cols-2 gap-8 mb-12"
            >
              {/* Image Upload */}
              <Card className="p-8 border-2 hover:border-primary/30 transition-all">
                <h3 className="text-2xl font-bold mb-6">1. Upload Image</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-lg p-8 text-center cursor-pointer transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {imageUrl ? (
                    <div>
                      <img
                        src={imageUrl}
                        alt="Selected crop"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <p className="text-sm text-foreground/70">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                      <p className="font-semibold text-foreground mb-2">
                        Click or drag image here
                      </p>
                      <p className="text-sm text-foreground/60">
                        Support for JPG, PNG, WebP (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-sm text-primary mt-4">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </Card>

              {/* Crop Details */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">2. Enter Crop Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Crop Name *
                    </label>
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      placeholder="e.g., Tomato, Wheat, Rice..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Pro Tips:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Take clear photos in natural lighting</li>
                          <li>Include affected and healthy parts</li>
                          <li>Capture close-ups for better accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!imageUrl || !cropName || loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-4 gap-6"
            >
              {[
                { icon: AlertTriangle, title: "Disease Detection", desc: "Identify crop diseases with 95%+ accuracy" },
                { icon: Droplets, title: "Pest Identification", desc: "Detect harmful insects and infestations" },
                { icon: BarChart3, title: "Deficiency Analysis", desc: "Nutrient and micronutrient assessment" },
                { icon: TrendingUp, title: "Growth Stage", desc: "Track crop development and maturity" },
              ].map((feature, i) => (
                <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-foreground/70">{feature.desc}</p>
                </Card>
              ))}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </>
        ) : (
          <AnalysisResultsDisplay analysis={analysis} onReset={() => setAnalysis(null)} />
        )}
      </div>
    </div>
  )
}

/**
 * Display comprehensive analysis results
 */
function AnalysisResultsDisplay({
  analysis,
  onReset,
}: {
  analysis: AnalysisResult
  onReset: () => void
}) {
  const healthColor =
    analysis.overallHealthScore >= 75
      ? "text-green-600"
      : analysis.overallHealthScore >= 50
        ? "text-yellow-600"
        : "text-red-600"

  const healthBg =
    analysis.overallHealthScore >= 75
      ? "bg-green-50"
      : analysis.overallHealthScore >= 50
        ? "bg-yellow-50"
        : "bg-red-50"

  return (
    <AnimatePresence>
      <div className="space-y-8">
        {/* Overall Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${healthBg} border-2 rounded-2xl p-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
            <div className="text-right">
              <p className="text-sm text-foreground/70 mb-2">Crop Health Score</p>
              <p className={`text-5xl font-bold ${healthColor}`}>
                {Math.round(analysis.overallHealthScore)}%
              </p>
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-2">
            <p className="font-semibold text-foreground mb-3">Immediate Actions Required:</p>
            {analysis.nextActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  action.includes("URGENT") ? "text-red-600" : 
                  action.includes("HIGH") ? "text-orange-600" : 
                  "text-green-600"
                }`} />
                <p className="text-foreground/80">{action}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disease Analysis */}
        <AnalysisCard
          title="🦠 Disease Analysis"
          icon={AlertTriangle}
          color="red"
          content={
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {analysis.disease.predictedDisease}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  analysis.disease.confidence > 80
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {Math.round(analysis.disease.confidence)}% Confidence
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 mb-1">Severity</p>
                  <p className="font-semibold text-foreground capitalize">
                    {analysis.disease.severity}
                  </p>
                </div>
              </div>
              {analysis.disease.treatment && analysis.disease.treatment.length > 0 && (
                <div>
                  <p className="font-semibold text-foreground mb-2">Treatment Plan:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    {analysis.disease.treatment.slice(0, 3).map((step) => (
                      <li key={step.step} className="text-foreground/80 text-sm">
                        {step.action}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          }
        />

        {/* Pest Analysis */}
        <AnalysisCard
          title="🐛 Pest Identification"
          icon={Droplets}
          color="orange"
          content={
            <div className="space-y-3">
              {analysis.pests?.identifiedPests && analysis.pests.identifiedPests.length > 0 ? (
                analysis.pests.identifiedPests.slice(0, 3).map((pest, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-foreground">{pest.pestName}</p>
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        pest.riskLevel === "high" ? "bg-red-100 text-red-700" :
                        pest.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {pest.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Confidence: {Math.round(pest.confidence)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-green-600 font-semibold">✓ No major pests detected</p>
              )}
            </div>
          }
        />

        {/* Nutrient Analysis */}
        <AnalysisCard
          title="💧 Nutrient Analysis"
          icon={Leaf}
          color="green"
          content={
            <div className="space-y-2">
              {analysis.deficiencies?.deficiencies && analysis.deficiencies.deficiencies.length > 0 ? (
                analysis.deficiencies.deficiencies.slice(0, 3).map((def, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <span className="font-semibold text-foreground">{def.nutrient} Deficiency</span>
                    <span className={`px-2 py-1 text-xs rounded font-semibold ${
                      def.severity === "severe" ? "bg-red-100 text-red-700" :
                      def.severity === "moderate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {def.severity.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-green-600 font-semibold">✓ Nutrient levels appear adequate</p>
              )}
            </div>
          }
        />

        {/* Growth Stage */}
        <AnalysisCard
          title="🌱 Growth Stage"
          icon={TrendingUp}
          color="blue"
          content={
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-2">Current Stage</p>
                <p className="text-2xl font-bold text-blue-900 capitalize">
                  {analysis.growthStage?.currentStage}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  Days to Next Stage: {analysis.growthStage?.daysToNextStage}
                </p>
                <p className="text-sm text-foreground/70">
                  {analysis.growthStage?.managementTips?.[0]}
                </p>
              </div>
            </div>
          }
        />

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">Prioritized Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations?.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === "high"
                    ? "bg-red-50 border-red-500"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground capitalize">
                      {rec.type}: {rec.action}
                    </p>
                    <p className="text-sm text-foreground/70 mt-1">
                      Urgency: <span className="font-semibold capitalize">{rec.urgency}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold whitespace-nowrap ${
                    rec.priority === "high"
                      ? "bg-red-200 text-red-800"
                      : "bg-blue-200 text-blue-800"
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-8">
          <Button
            onClick={onReset}
            variant="outline"
            className="px-8 py-3 border-primary text-primary hover:bg-primary/5"
          >
            Analyze Another Image
          </Button>
          <Button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white">
            Get Farming Expert Advice
          </Button>
        </div>
      </div>
    </AnimatePresence>
  )
}

/**
 * Reusable analysis card component
 */
function AnalysisCard({
  title,
  icon: Icon,
  color,
  content,
}: {
  title: string
  icon: React.ElementType
  color: string
  content: React.ReactNode
}) {
  const colorClasses = {
    red: "border-red-200 bg-red-50",
    orange: "border-orange-200 bg-orange-50",
    green: "border-green-200 bg-green-50",
    blue: "border-blue-200 bg-blue-50",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 rounded-xl p-6 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Icon className="w-6 h-6" />
        {title}
      </h3>
      {content}
    </motion.div>
  )
}
