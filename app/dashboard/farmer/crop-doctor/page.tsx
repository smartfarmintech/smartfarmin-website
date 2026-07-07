'use client';

export const dynamic = 'force-dynamic'

import { useState } from 'react';
import { Upload, MessageCircle, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
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

  const commonSymptoms = [
    'Yellowing leaves',
    'Brown spots',
    'Wilting',
    'Stunted growth',
    'Leaf curl',
    'White powder',
    'Pest damage',
    'Blight',
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
  ];

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

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Akanksha AI Crop Doctor</h1>
          <p className="text-slate-300">Get AI-powered diagnosis and treatment recommendations for crop diseases, pests, and nutrient deficiencies</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="card-glass rounded-2xl p-6 space-y-6 sticky top-8">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Crop
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

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Issue Description
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe what you're seeing in your crop..."
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Observed Symptoms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms.map((symptom) => (
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
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze with Akanksha'}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {!analysis ? (
              <div className="card-glass rounded-2xl p-12 text-center">
                <MessageCircle className="size-16 mx-auto text-emerald-400/50 mb-4" />
                <p className="text-slate-400">
                  Fill in the details and click "Analyze with Akanksha" to get AI-powered recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Analysis Header */}
                <div className="card-glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
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
                      <h3 className="text-xl font-bold text-white mb-2">
                        {analysis.analysis.issue}
                      </h3>
                      <p className="text-slate-400 mb-4">{analysis.analysis.description}</p>
                      <div className="flex gap-6">
                        <div>
                          <div className="text-2xl font-bold text-emerald-400">
                            {analysis.analysis.confidence}%
                          </div>
                          <div className="text-xs text-slate-500">Confidence</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white capitalize">
                            {analysis.analysis.severity}
                          </div>
                          <div className="text-xs text-slate-500">Severity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="card-glass rounded-2xl p-4">
                    <div className="font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="size-4 text-red-400" />
                      Immediate Actions
                    </div>
                    <ul className="space-y-2">
                      {analysis.recommendations.immediate.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-emerald-400">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-glass rounded-2xl p-4">
                    <div className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="size-4 text-amber-400" />
                      Short-term Plan
                    </div>
                    <ul className="space-y-2">
                      {analysis.recommendations.shortTerm.map((action, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-emerald-400">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline and Outcome */}
                <div className="card-glass rounded-2xl p-6">
                  <h4 className="font-semibold text-white mb-4">Treatment Timeline</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Start Treatment
                      </div>
                      <div className="font-semibold text-emerald-400">
                        {analysis.timeline.startTreatment}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Expected Resolution
                      </div>
                      <div className="font-semibold text-emerald-400">
                        {analysis.timeline.expectedResolution}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Monitoring Period
                      </div>
                      <div className="font-semibold text-emerald-400">
                        {analysis.timeline.monitoringPeriod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-emerald-500/10 to-transparent">
                  <h4 className="font-semibold text-white mb-2">Expected Outcome</h4>
                  <p className="text-slate-300">{analysis.expectedOutcome}</p>
                  <div className="mt-4 text-xs text-slate-500">
                    Estimated Cost: ₹{analysis.recommendations.costEstimate.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
