'use client'

import React, { useState } from 'react'
import { Upload, AlertCircle, TrendingDown, Zap, Pill, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface DiseaseResult {
  disease: string
  confidence: number
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  medicine: string
  dosage: string
  nearbyShops: string[]
}

export function CropDoctorUpload() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [selectedCrop, setSelectedCrop] = useState<string>('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedImage || !selectedCrop) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock result for demonstration
    const mockResult: DiseaseResult = {
      disease: 'Leaf Rust',
      confidence: 87,
      severity: 'moderate',
      treatment: 'Apply fungicide spray in early morning or late evening',
      medicine: 'Hexaconazole 5% EC or Propiconazole 25% EC',
      dosage: '1 ml per liter of water',
      nearbyShops: ['Ram Agricultural Store', 'Krishna Seed Center', 'Farmer Cooperative'],
    }

    setResult(mockResult)
    setLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'text-yellow-600 bg-yellow-50'
      case 'moderate':
        return 'text-orange-600 bg-orange-50'
      case 'severe':
        return 'text-red-600 bg-red-50'
      default:
        return ''
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Upload Section */}
      {!result && (
        <div className="space-y-6">
          {/* Crop Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What crop are you growing?
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-leaf-green-500"
            >
              <option value="">Select crop...</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="maize">Maize</option>
              <option value="groundnut">Groundnut</option>
              <option value="soybean">Soybean</option>
              <option value="tomato">Tomato</option>
              <option value="onion">Onion</option>
            </select>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Take a clear photo of affected leaf
            </label>
            <div
              onClick={() => document.getElementById('image-upload')?.click()}
              className="border-3 border-dashed border-leaf-green-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-soft-mint-50 transition-colors"
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded crop"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button onClick={() => setUploadedImage(null)} variant="outline" className="w-full">
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-block p-3 bg-leaf-green-100 rounded-full">
                    <Upload size={32} className="text-leaf-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Upload photo</p>
                  <p className="text-sm text-gray-600">Tap to take or upload photo from gallery</p>
                  <p className="text-xs text-gray-500 mt-4">
                    For best results: Focus on affected leaf, good lighting, clear view of damage
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!uploadedImage || !selectedCrop || loading}
            className="w-full h-14 text-lg bg-leaf-green-500 hover:bg-leaf-green-600 text-white font-semibold rounded-xl"
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Analysis Complete</h2>
              <p className="text-gray-600 text-sm mt-1">AI Crop Doctor findings</p>
            </div>
            <Button
              onClick={() => {
                setResult(null)
                setUploadedImage(null)
              }}
              variant="outline"
              className="text-sm"
            >
              New Analysis
            </Button>
          </div>

          {/* Disease Detected */}
          <Card className={`p-6 rounded-2xl border-2 ${getSeverityColor(result.severity)}`}>
            <div className="flex items-start gap-4">
              <AlertCircle size={32} />
              <div>
                <h3 className="text-xl font-bold mb-2">{result.disease}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">
                    Confidence: {result.confidence}% {result.confidence > 80 ? '✓' : '⚠'}
                  </span>
                  <span className="font-semibold capitalize">
                    Severity: {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Treatment Information */}
          <Card className="p-6 rounded-2xl border-2 border-gray-200 space-y-4">
            <div className="flex items-start gap-3">
              <Leaf className="text-leaf-green-600 mt-1" size={24} />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">Treatment Method</h4>
                <p className="text-gray-700">{result.treatment}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Pill className="text-blue-600 mt-1" size={24} />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">Recommended Medicine</h4>
                <p className="text-gray-700">{result.medicine}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="text-orange-600 mt-1" size={24} />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">Dosage</h4>
                <p className="text-gray-700">{result.dosage}</p>
              </div>
            </div>
          </Card>

          {/* Nearby Shops */}
          <Card className="p-6 rounded-2xl border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3">Nearby Agriculture Shops</h4>
            <div className="space-y-2">
              {result.nearbyShops.map((shop, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-leaf-green-500 rounded-full" />
                  <span className="text-gray-800">{shop}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-leaf-green-500 hover:bg-leaf-green-600 text-white">
              Talk to Expert
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
