'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, User, Phone, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Job {
  id: string
  booking_number: string
  farmer_name: string
  farmer_phone: string
  machine_name: string
  service_location: string
  start_time: string
  end_time: string
  job_status: 'not_started' | 'in_progress' | 'paused' | 'completed'
  duration_hours: number
  latitude: number
  longitude: number
}

const mockJobs: Job[] = [
  {
    id: '1',
    booking_number: 'BK-001',
    farmer_name: 'Ramakrishna Reddy',
    farmer_phone: '+91 98765 43210',
    machine_name: 'Tractor - 50HP',
    service_location: 'Hyderabad, Telangana',
    start_time: '09:00 AM',
    end_time: '05:00 PM',
    job_status: 'not_started',
    duration_hours: 8,
    latitude: 17.3850,
    longitude: 78.4867,
  },
  {
    id: '2',
    booking_number: 'BK-002',
    farmer_name: 'Venkat Kumar',
    farmer_phone: '+91 87654 32109',
    machine_name: 'Rotavator - 7FT',
    service_location: 'Vijayawada, Andhra Pradesh',
    start_time: '10:00 AM',
    end_time: '02:00 PM',
    job_status: 'in_progress',
    duration_hours: 4,
    latitude: 16.5062,
    longitude: 80.6480,
  },
]

const statusColors = {
  not_started: 'bg-gray-100 text-gray-800 border-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
}

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  paused: 'Paused',
  completed: 'Completed',
}

export default function TodaysJobs() {
  const [jobs, setJobs] = useState(mockJobs)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleStartJob = async (jobId: string) => {
    setActionLoading(jobId)
    try {
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, job_status: 'in_progress' as const } : j)
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handlePauseJob = async (jobId: string) => {
    setActionLoading(jobId)
    try {
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, job_status: 'paused' as const } : j)
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleCompleteJob = async (jobId: string) => {
    setActionLoading(jobId)
    try {
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, job_status: 'completed' as const } : j)
      )
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <Alert>
          <AlertDescription>
            No jobs scheduled for today.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Job Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{job.machine_name}</h3>
                      <p className="text-xs text-muted-foreground">#{job.booking_number}</p>
                    </div>
                    <Badge className={statusColors[job.job_status]}>
                      {statusLabels[job.job_status]}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {job.start_time} - {job.end_time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.service_location}
                    </div>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">FARMER DETAILS</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {job.farmer_name}
                    </div>
                    <a
                      href={`tel:${job.farmer_phone}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {job.farmer_phone}
                    </a>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">DURATION</p>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{job.duration_hours}h</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="flex gap-2">
                    {job.job_status === 'not_started' && (
                      <Button
                        onClick={() => handleStartJob(job.id)}
                        disabled={actionLoading === job.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}

                    {job.job_status === 'in_progress' && (
                      <>
                        <Button
                          onClick={() => handlePauseJob(job.id)}
                          disabled={actionLoading === job.id}
                          variant="outline"
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          onClick={() => handleCompleteJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}

                    {job.job_status === 'paused' && (
                      <>
                        <Button
                          onClick={() => handleStartJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                        <Button
                          onClick={() => handleCompleteJob(job.id)}
                          disabled={actionLoading === job.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}

                    {job.job_status === 'completed' && (
                      <Button disabled className="w-full">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </Button>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    View GPS Tracking
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
