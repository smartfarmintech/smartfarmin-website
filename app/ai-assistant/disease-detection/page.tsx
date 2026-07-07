'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Upload, Camera, Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface AnalysisResult {
  disease: string
  confidence: number
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  treatment: string[]
  preventive: string[]
  cost: number
}

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setError(null)
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          analysisType: 'disease'
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const severityColors = {
    mild: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    severe: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Disease Detection</h1>
          <p className="text-muted-foreground">Upload a crop image to get instant disease identification and treatment recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </TabsContent>

              <TabsContent value="camera" className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="font-semibold mb-1">Click to take a photo</p>
                  <p className="text-sm text-muted-foreground">Use your device camera</p>
                </div>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </TabsContent>
            </Tabs>

            {selectedImage && (
              <div className="mt-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedImage}
                    alt="Selected crop"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Results Section */}
          <Card className="p-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Analysis Error</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {!result && !isAnalyzing && !selectedImage && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">Upload an image to start</p>
                <p className="text-sm">We'll analyze it for diseases and pests</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                <p className="font-semibold">Analyzing your image...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait while our AI examines the crop</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{result.disease}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <Badge className={severityColors[result.severity]}>
                    {result.severity}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{result.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Treatment Plan</h4>
                  <ul className="space-y-1">
                    {result.treatment.map((step, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Prevention Measures</h4>
                  <ul className="space-y-1">
                    {result.preventive.map((measure, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.cost > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">Estimated Cost: </span>
                      <span>₹{result.cost.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                )}

                <Button className="w-full" asChild>
                  <a href="/ai-assistant/chat">Get More Help</a>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-3">Tips for Better Analysis</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use good lighting and take photos from multiple angles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Focus on affected areas of the crop or leaf</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Include surrounding area for better context</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep images clear and avoid blurry photos</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
