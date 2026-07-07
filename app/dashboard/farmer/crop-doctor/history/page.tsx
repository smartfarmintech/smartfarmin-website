'use client'

import { useState, useEffect } from 'react'
import { Calendar, Image, TrendingUp, CheckCircle2, AlertCircle, Download, Share2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalysisRecord {
  id: string
  cropName: string
  issueType: 'disease' | 'pest' | 'deficiency'
  issueName: string
  imageUrl?: string
  confidence: number
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  analyzedDate: string
  status: 'pending' | 'in-progress' | 'resolved' | 'monitoring'
  treatment: string
  outcome?: string
}

export default function CropDoctorHistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'disease' | 'pest' | 'deficiency'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null)

  useEffect(() => {
    // In production, fetch from /api/ai/crop-doctor/history
    const mockData: AnalysisRecord[] = [
      {
        id: '1',
        cropName: 'Rice',
        issueType: 'disease',
        issueName: 'Rice Blast',
        imageUrl: 'https://via.placeholder.com/300x200?text=Rice+Blast',
        confidence: 92,
        severity: 'severe',
        analyzedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        treatment: 'Applied Trichoderma and neem spray',
        outcome: 'Crop recovered well with 85% yield maintained',
      },
      {
        id: '2',
        cropName: 'Cotton',
        issueType: 'pest',
        issueName: 'Armyworm Infestation',
        imageUrl: 'https://via.placeholder.com/300x200?text=Armyworm',
        confidence: 87,
        severity: 'moderate',
        analyzedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        treatment: 'Sprayed Spinosad and used pheromone traps',
        outcome: 'Pest population controlled, normal growth resumed',
      },
      {
        id: '3',
        cropName: 'Sugarcane',
        issueType: 'deficiency',
        issueName: 'Nitrogen Deficiency',
        confidence: 78,
        severity: 'mild',
        analyzedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress',
        treatment: 'Urea application 100 kg/acre scheduled',
        outcome: undefined,
      },
      {
        id: '4',
        cropName: 'Wheat',
        issueType: 'disease',
        issueName: 'Powdery Mildew',
        imageUrl: 'https://via.placeholder.com/300x200?text=Powdery+Mildew',
        confidence: 85,
        severity: 'moderate',
        analyzedDate: new Date().toISOString(),
        status: 'pending',
        treatment: 'Sulphur spray recommended',
        outcome: undefined,
      },
    ]

    setRecords(mockData)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = records

    // Apply issue type filter
    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.issueType === filter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter((r) => r.status !== 'resolved')
      } else if (statusFilter === 'resolved') {
        filtered = filtered.filter((r) => r.status === 'resolved')
      }
    }

    setFilteredRecords(filtered)
  }, [records, filter, statusFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'severe':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400'
      case 'moderate':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400'
      case 'pending':
        return 'bg-amber-500/10 text-amber-400'
      default:
        return 'bg-slate-500/10 text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="size-4" />
      case 'pending':
        return <AlertCircle className="size-4" />
      default:
        return <TrendingUp className="size-4" />
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDownloadReport = (record: AnalysisRecord) => {
    // Generate and download PDF report
    const reportContent = `
CROP DOCTOR ANALYSIS REPORT
================================
Crop: ${record.cropName}
Issue Type: ${record.issueType.toUpperCase()}
Issue Name: ${record.issueName}
Analysis Date: ${formatDate(record.analyzedDate)}

ANALYSIS RESULTS
- Confidence Level: ${record.confidence}%
- Severity: ${record.severity}
- Status: ${record.status}

TREATMENT RECOMMENDED
${record.treatment}

OUTCOME
${record.outcome || 'Awaiting follow-up monitoring'}

================================
Generated by Akanksha AI Crop Doctor
    `
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent))
    element.setAttribute('download', `crop-report-${record.cropName}-${record.id}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Crop Doctor History</h1>
          <p className="text-slate-300">
            Track all crop analyses, treatments, and outcomes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="card-glass rounded-xl p-4">
            <div className="text-3xl font-bold text-white">{records.length}</div>
            <div className="text-xs text-slate-400 mt-1">Total Analyses</div>
          </div>
          <div className="card-glass rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400">
              {records.filter((r) => r.status === 'resolved').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Resolved Issues</div>
          </div>
          <div className="card-glass rounded-xl p-4">
            <div className="text-3xl font-bold text-amber-400">
              {records.filter((r) => r.status === 'in-progress').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">In Progress</div>
          </div>
          <div className="card-glass rounded-xl p-4">
            <div className="text-3xl font-bold text-red-400">
              {records.filter((r) => r.severity === 'severe' || r.severity === 'critical').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Critical Issues</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-glass rounded-xl p-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="size-4 text-slate-400" />
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  filter === 'all'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                All Issues
              </button>
              {(['disease', 'pest', 'deficiency'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded text-sm transition-all capitalize ${
                    filter === type
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  statusFilter === 'resolved'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Records Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-400">Loading analysis history...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="card-glass rounded-xl p-12 text-center">
            <Image className="size-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">No analyses found. Start analyzing your crops!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="card-glass rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  {record.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={record.imageUrl}
                        alt={record.issueName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{record.issueName}</h3>
                          <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400 capitalize">
                            {record.cropName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                          <Calendar className="size-3" />
                          {formatDate(record.analyzedDate)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadReport(record)
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Download className="size-4 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`px-3 py-1 rounded text-xs font-medium border ${getSeverityColor(record.severity)} capitalize`}>
                        {record.severity}
                      </div>
                      <div className="text-sm">
                        <span className="text-emerald-400 font-semibold">{record.confidence}%</span>
                        <span className="text-slate-500 text-xs ml-1">confidence</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)} capitalize`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </div>
                    </div>

                    {/* Treatment */}
                    <p className="text-sm text-slate-300 mb-2">{record.treatment}</p>

                    {/* Outcome */}
                    {record.outcome && (
                      <div className="mt-2 p-2 bg-emerald-500/10 rounded text-xs text-emerald-300">
                        ✓ {record.outcome}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="card-glass rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedRecord.issueName}</h2>
                <p className="text-slate-400 mt-1">{selectedRecord.cropName} • {formatDate(selectedRecord.analyzedDate)}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="size-5 text-slate-400" />
              </button>
            </div>

            {selectedRecord.imageUrl && (
              <img
                src={selectedRecord.imageUrl}
                alt={selectedRecord.issueName}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            <div className="grid gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Analysis Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-emerald-400 font-bold text-lg">{selectedRecord.confidence}%</div>
                    <div className="text-xs text-slate-500">Confidence</div>
                  </div>
                  <div className={`rounded-lg p-3 ${getSeverityColor(selectedRecord.severity)}`}>
                    <div className="font-bold text-lg capitalize">{selectedRecord.severity}</div>
                    <div className="text-xs">Severity</div>
                  </div>
                  <div className={`rounded-lg p-3 ${getStatusColor(selectedRecord.status)}`}>
                    <div className="font-bold text-lg capitalize">{selectedRecord.status}</div>
                    <div className="text-xs">Status</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Treatment Plan</h3>
                <p className="text-slate-300">{selectedRecord.treatment}</p>
              </div>

              {selectedRecord.outcome && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-400 mb-2">Outcome</h3>
                  <p className="text-emerald-200">{selectedRecord.outcome}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1 btn-primary">
                  <Download className="size-4 mr-2" />
                  Download Report
                </Button>
                <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white">
                  <Share2 className="size-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function X({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
