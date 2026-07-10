'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'result'

interface CropDoctorResult {
  disease: string
  confidence: number
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  medicine: string
  dosage: string
  nearbyShops: number
}

export function CameraCropDoctor() {
  const [state, setState] = useState<AnalysisState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<CropDoctorResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const mockResult: CropDoctorResult = {
    disease: 'Leaf Spot Disease',
    confidence: 92,
    severity: 'moderate',
    treatment: 'Apply fungicide spray',
    medicine: 'Mancozeb 75% WP',
    dosage: '5g per 2L water',
    nearbyShops: 3,
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setState('uploading')

      // Simulate upload and analysis
      setTimeout(() => {
        setState('analyzing')
        setTimeout(() => {
          setResult(mockResult)
          setState('result')
        }, 2000)
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => {
    setState('idle')
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <AnimatePresence mode="wait">
        {/* Idle State - Camera First */}
        {state === 'idle' && !preview && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🏥 Crop Doctor</h2>
              <p className="text-gray-600">Take or upload a photo of your crop</p>
            </div>

            {/* Camera Icon - Large */}
            <motion.div
              className="flex justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-32 h-32 bg-forest-green/10 border-4 border-forest-green rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-forest-green" />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => cameraInputRef.current?.click()}
                className="p-6 rounded-3xl bg-forest-green text-white font-bold text-lg flex flex-col items-center justify-center gap-3 hover:bg-leaf-green transition-all"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-8 h-8" />
                Take Photo
              </motion.button>
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-3xl border-3 border-forest-green text-forest-green font-bold text-lg flex flex-col items-center justify-center gap-3 hover:bg-forest-green/5 transition-all"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-8 h-8" />
                Upload
              </motion.button>
            </div>

            {/* Hidden inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />

            {/* Info */}
            <div className="bg-blue-50 border-2 border-sky-blue rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-700">
                📸 Take a clear photo of the affected crop area for best results
              </p>
            </div>
          </motion.div>
        )}

        {/* Preview State */}
        {state !== 'idle' && preview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-forest-green/20 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Crop preview"
                className="w-full h-64 object-cover"
              />

              {/* Loading Overlay */}
              {(state === 'uploading' || state === 'analyzing') && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <motion.div
                    className="text-center text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="text-4xl mb-3">
                      {state === 'uploading' ? '📤' : '🔍'}
                    </div>
                    <p className="font-bold text-lg">
                      {state === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                    </p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Result Display */}
            {state === 'result' && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Disease Info */}
                <div className={`p-6 rounded-2xl border-2 ${
                  result.severity === 'severe'
                    ? 'bg-red-50 border-red-300'
                    : result.severity === 'moderate'
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-green-50 border-green-300'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    {result.severity === 'severe' ? (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{result.disease}</h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {result.confidence}% | Severity: {result.severity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-white border-2 border-forest-green/20 rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-gray-900 text-lg">💊 Treatment</h4>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Medicine:</p>
                    <p className="font-semibold text-gray-900">{result.medicine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dosage:</p>
                    <p className="font-semibold text-gray-900">{result.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Steps:</p>
                    <p className="text-gray-900">{result.treatment}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={reset}
                    className="p-4 rounded-2xl border-2 border-forest-green text-forest-green font-bold hover:bg-forest-green/5 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    onClick={() => console.log('Expert consultation')}
                    className="p-4 rounded-2xl bg-forest-green text-white font-bold hover:bg-leaf-green transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📞 Talk to Expert
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
