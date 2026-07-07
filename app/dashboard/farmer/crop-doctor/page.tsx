'use client';

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react';
import { Upload, MessageCircle, AlertCircle, CheckCircle2, Clock, Image, X, Zap, Leaf, Bug, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  analysis: {
    issue: string;
    issueType: string;
    confidence: number;
    severity: string;
    description: string;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    preventive: string[];
    costEstimate: number;
  };
  timeline: {
    startTreatment: string;
    expectedResolution: string;
    monitoringPeriod: string;
  };
  expectedOutcome: string;
}

export default function CropDoctorPage() {
  const [issue, setIssue] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState('en');
  const [issueType, setIssueType] = useState<'disease' | 'pest' | 'deficiency'>('disease');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [growthStage, setGrowthStage] = useState('');
  const [soilType, setSoilType] = useState('');

  const diseaseSymptoms = [
    'Yellowing leaves',
    'Brown spots',
    'Wilting',
    'Leaf curl',
    'White powder',
    'Blight',
    'Canker',
    'Rust marks',
  ];

  const pestSymptoms = [
    'Pest damage',
    'Holes in leaves',
    'Sticky residue',
    'Webbing',
    'Discolored patches',
    'Stunted growth',
    'Leaf rolling',
    'Visible insects',
  ];

  const deficiencySymptoms = [
    'Yellowing leaves',
    'Purple discoloration',
    'Stunted growth',
    'Poor root development',
    'Pale coloring',
    'Interveinal chlorosis',
    'Curled leaves',
    'Necrosis',
  ];

  const crops = [
    'Rice',
    'Wheat',
    'Cotton',
    'Sugarcane',
    'Maize',
    'Groundnut',
    'Soybean',
    'Tomato',
    'Onion',
    'Potato',
    'Chilli',
    'Tobacco',
  ];

  const growthStages = [
    'Germination',
    'Seedling',
    'Vegetative',
    'Flowering',
    'Fruiting',
    'Maturity',
    'Harvest',
  ];

  const soilTypes = [
    'Sandy',
    'Loamy',
    'Clayey',
    'Black soil',
    'Laterite',
    'Alluvial',
    'Mixed',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!cropType || !issue || symptoms.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/crop-doctor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType,
          issue,
          symptoms,
          language,
          issueType,
          imageUrl: uploadedImage,
          growthStage,
          soilType,
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('[v0] Analysis error:', error);
      alert('Failed to analyze crop health');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getSymptomList = () => {
    switch (issueType) {
      case 'pest':
        return pestSymptoms;
      case 'deficiency':
        return deficiencySymptoms;
      default:
        return diseaseSymptoms;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Leaf className="size-6 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Akanksha AI Crop Doctor</h1>
          </div>
          <p className="text-slate-300 max-w-2xl">Get AI-powered diagnosis and personalized treatment recommendations for crop diseases, pests, nutrient deficiencies, and growth optimization</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="card-glass rounded-2xl p-6 space-y-6 sticky top-8">
              {/* Issue Type Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Issue Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['disease', 'pest', 'deficiency'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setIssueType(type);
                        setSymptoms([]);
                      }}
                      className={`p-3 rounded-lg transition-all text-center ${
                        issueType === type
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xl mb-1">
                        {type === 'disease' && '🦠'}
                        {type === 'pest' && '🐛'}
                        {type === 'deficiency' && '⚗️'}
                      </div>
                      <div className="text-xs font-medium capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Crop *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Choose a crop...</option>
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Growth Stage */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Growth Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select stage...</option>
                  {growthStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select type...</option>
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Upload Crop Image
                </label>
                {!uploadedImage ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors"
                  >
                    <Image className="size-6 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-400">Click to upload or drag image</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                  </button>
                ) : (
                  <div className="relative">
                    <img src={uploadedImage} alt="Uploaded crop" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <X className="size-4 text-white" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Describe the Issue *
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe what you're seeing in your crop..."
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none h-24 resize-none"
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Observed Symptoms *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getSymptomList().map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`text-xs px-3 py-2 rounded-lg transition-all ${
                        symptoms.includes(symptom)
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={loading || !cropType || !issue || symptoms.length === 0}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="size-4 mr-2" />
                    Analyze with Akanksha
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {!analysis ? (
              <div className="card-glass rounded-2xl p-12 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-emerald-500/10 rounded-full">
                    <MessageCircle className="size-12 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to diagnose your crop</h3>
                <p className="text-slate-400">
                  Fill in the details on the left and click &quot;Analyze with Akanksha&quot; to get AI-powered recommendations for your crop
                </p>
              </div>
            ) : (
              <>
                {/* Analysis Header Card */}
                <div className="card-glass rounded-2xl p-6 border-l-4 border-emerald-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      analysis.analysis.severity === 'critical' ? 'bg-red-500/20' :
                      analysis.analysis.severity === 'severe' ? 'bg-orange-500/20' :
                      analysis.analysis.severity === 'moderate' ? 'bg-amber-500/20' :
                      'bg-emerald-500/20'
                    }`}>
                      {analysis.analysis.severity === 'critical' ? (
                        <AlertCircle className="size-6 text-red-400" />
                      ) : analysis.analysis.severity === 'severe' ? (
                        <AlertCircle className="size-6 text-orange-400" />
                      ) : (
                        <CheckCircle2 className="size-6 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {analysis.analysis.issue}
                      </h3>
                      <p className="text-slate-400 mb-4">{analysis.analysis.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">
                        AI Confidence
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {analysis.analysis.confidence}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">
                        Severity Level
                      </div>
                      <div className="text-lg font-semibold text-white capitalize px-3 py-1 rounded bg-white/5 w-fit">
                        {analysis.analysis.severity}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">
                        Estimated Cost
                      </div>
                      <div className="text-lg font-semibold text-emerald-400">
                        ₹{analysis.recommendations.costEstimate.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card-glass rounded-2xl p-6">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="size-5 text-amber-400" />
                    Treatment Timeline
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
                        Start Treatment
                      </div>
                      <div className="font-semibold text-white text-lg">
                        {analysis.timeline.startTreatment}
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
                        Expected Resolution
                      </div>
                      <div className="font-semibold text-emerald-400 text-lg">
                        {analysis.timeline.expectedResolution}
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-medium">
                        Monitoring Period
                      </div>
                      <div className="font-semibold text-white text-lg">
                        {analysis.timeline.monitoringPeriod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="card-glass rounded-2xl p-6">
                    <div className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="size-5 text-red-400" />
                      Immediate Actions
                    </div>
                    <ul className="space-y-3">
                      {analysis.recommendations.immediate.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-3">
                          <span className="text-emerald-400 font-bold">1.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-glass rounded-2xl p-6">
                    <div className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="size-5 text-amber-400" />
                      Short-term Actions
                    </div>
                    <ul className="space-y-3">
                      {analysis.recommendations.shortTerm.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-3">
                          <span className="text-emerald-400 font-bold">2.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Long-term and Preventive */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="card-glass rounded-2xl p-6">
                    <div className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Leaf className="size-5 text-emerald-400" />
                      Long-term Strategy
                    </div>
                    <ul className="space-y-3">
                      {analysis.recommendations.longTerm.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-3">
                          <span className="text-emerald-400 font-bold">3.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-glass rounded-2xl p-6">
                    <div className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Shield className="size-5 text-blue-400" />
                      Prevention Measures
                    </div>
                    <ul className="space-y-3">
                      {analysis.recommendations.preventive.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-3">
                          <span className="text-emerald-400 font-bold">4.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20">
                  <h4 className="font-semibold text-white mb-2 text-lg">Expected Outcome</h4>
                  <p className="text-slate-300 leading-relaxed">{analysis.expectedOutcome}</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                      💡 Follow the recommended actions in sequence for best results. Monitor your crop regularly and adjust treatments based on progress.
                    </p>
                  </div>
                </div>

                {/* New Analysis Button */}
                <Button
                  onClick={() => {
                    setAnalysis(null);
                    setIssue('');
                    setSymptoms([]);
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Analyze Another Crop Issue
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
