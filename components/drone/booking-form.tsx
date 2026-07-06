'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  detectCropStress,
  recommendSpraySchedule,
  calculatePesticideQuantity,
  generateFlightPlan,
  analyzeNDVI,
  estimateCoverage,
  type CropStressAnalysis,
  type SpraySchedule,
  type PesticideQuantity,
  type FlightPlan,
  type NDVIAnalysis,
  type CoverageEstimate,
} from '@/lib/drone/ai-engine'
import { createDroneBooking } from '@/lib/drone/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader2, CheckCircle2, TrendingUp } from 'lucide-react'

const SERVICE_TYPES = [
  { id: 'pesticide_spraying', label: 'Pesticide Spraying' },
  { id: 'fertilizer_spraying', label: 'Fertilizer Spraying' },
  { id: 'nano_urea', label: 'Nano Urea Spraying' },
  { id: 'seed_broadcast', label: 'Seed Broadcasting' },
  { id: 'crop_monitoring', label: 'Crop Health Monitoring' },
  { id: 'ndvi_mapping', label: 'NDVI Mapping' },
  { id: 'land_survey', label: 'Land Survey' },
]

interface BookingFormProps {
  farmId?: string
  farmName?: string
  onSuccess?: (bookingId: string) => void
}

export function DroneBokingForm({ farmId, farmName, onSuccess }: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [analysisActive, setAnalysisActive] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    farm_id: farmId || '',
    crop_name: 'Paddy',
    area_acres: '',
    service_type: 'pesticide_spraying',
    special_instructions: '',
    booked_date: new Date().toISOString().split('T')[0],
    booked_time: '08:00',
  })

  // AI Analysis Results
  const [cropStress, setCropStress] = useState<CropStressAnalysis | null>(null)
  const [spraySchedule, setSpraySchedule] = useState<SpraySchedule | null>(null)
  const [pesticide, setPesticide] = useState<PesticideQuantity | null>(null)
  const [flightPlan, setFlightPlan] = useState<FlightPlan | null>(null)
  const [ndvi, setNdvi] = useState<NDVIAnalysis | null>(null)
  const [coverage, setCoverage] = useState<CoverageEstimate | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const runAIAnalysis = async () => {
    if (!formData.area_acres || !formData.crop_name) {
      alert('Please fill in crop type and area')
      return
    }

    setAnalysisActive(true)
    setLoading(true)

    try {
      // Simulate image analysis (in production, user would upload image)
      const imageUrl = '/images/drone-field-sample.jpg'

      // Run all analyses in parallel
      const [stress, schedule, pesticideCalc, flight, ndviAnalysis, coverageEst] = await Promise.all([
        detectCropStress(imageUrl, formData.crop_name, parseFloat(formData.area_acres)),
        recommendSpraySchedule(17.3605, 78.4855, formData.crop_name, 'fungicide'),
        calculatePesticideQuantity(
          formData.crop_name,
          parseFloat(formData.area_acres),
          'fungicide',
          'pesticide',
        ),
        generateFlightPlan(
          { lat1: 17.36, lng1: 78.48, lat2: 17.37, lng2: 78.49 },
          parseFloat(formData.area_acres),
          'DJI Agras T30',
          formData.service_type,
        ),
        analyzeNDVI(imageUrl, parseFloat(formData.area_acres), new Date().toISOString()),
        estimateCoverage(parseFloat(formData.area_acres), 'DJI Agras T30', 'calm'),
      ])

      setCropStress(stress)
      setSpraySchedule(schedule)
      setPesticide(pesticideCalc)
      setFlightPlan(flight)
      setNdvi(ndviAnalysis)
      setCoverage(coverageEst)
    } catch (error) {
      console.error('AI analysis error:', error)
      alert('Failed to run analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createDroneBooking({
        farm_id: formData.farm_id,
        crop_name: formData.crop_name,
        area_acres: parseFloat(formData.area_acres),
        service_type: formData.service_type,
        special_instructions: formData.special_instructions,
        booked_date: formData.booked_date,
        booked_time: formData.booked_time,
      })

      if (result.ok && result.data) {
        onSuccess?.(result.data.id)
        router.push(`/drone-services/booking/${result.data.id}`)
      } else {
        alert(`Booking failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book Drone Service</CardTitle>
          <CardDescription>Schedule precision spraying or field monitoring for your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="crop_name">Crop Type</Label>
                <Select value={formData.crop_name} onValueChange={(val) => handleSelectChange('crop_name', val)}>
                  <SelectTrigger id="crop_name">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paddy">Paddy (Rice)</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Maize">Maize (Corn)</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_acres">Area (Acres)</Label>
                <Input
                  id="area_acres"
                  name="area_acres"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.area_acres}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select
                value={formData.service_type}
                onValueChange={(val) => handleSelectChange('service_type', val)}
              >
                <SelectTrigger id="service_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scheduling */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booked_date">Preferred Date</Label>
                <Input
                  id="booked_date"
                  name="booked_date"
                  type="date"
                  value={formData.booked_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booked_time">Preferred Time</Label>
                <Input
                  id="booked_time"
                  name="booked_time"
                  type="time"
                  value={formData.booked_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                name="special_instructions"
                placeholder="Any specific areas to focus on, hazards, or additional requirements..."
                value={formData.special_instructions}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* AI Analysis Section */}
            {!analysisActive && (
              <Button
                type="button"
                variant="outline"
                onClick={runAIAnalysis}
                disabled={loading || !formData.area_acres}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 size-4" />
                    Get AI Analysis & Recommendations
                  </>
                )}
              </Button>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Drone Service'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {analysisActive && (cropStress || spraySchedule || pesticide || flightPlan || ndvi || coverage) && (
        <div className="space-y-4">
          <Tabs defaultValue="crop-stress" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="crop-stress" className="text-xs">
                Crop Stress
              </TabsTrigger>
              <TabsTrigger value="spray-schedule" className="text-xs">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="pesticide" className="text-xs">
                Pesticide
              </TabsTrigger>
              <TabsTrigger value="flight-plan" className="text-xs">
                Flight Plan
              </TabsTrigger>
              <TabsTrigger value="ndvi" className="text-xs">
                NDVI
              </TabsTrigger>
              <TabsTrigger value="coverage" className="text-xs">
                Coverage
              </TabsTrigger>
            </TabsList>

            {/* Crop Stress */}
            {cropStress && (
              <TabsContent value="crop-stress">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Crop Stress Analysis</CardTitle>
                      <Badge
                        variant={
                          cropStress.stress_level === 'high'
                            ? 'destructive'
                            : cropStress.stress_level === 'medium'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {cropStress.stress_level.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Affected Area</p>
                        <p className="text-2xl font-bold">{cropStress.affected_area_percent}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-2xl font-bold">{Math.round(cropStress.confidence * 100)}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Detected Issues:</p>
                      <ul className="space-y-1">
                        {cropStress.detected_issues.map((issue, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <AlertCircle className="size-4 text-amber-600" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {cropStress.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Spray Schedule */}
            {spraySchedule && (
              <TabsContent value="spray-schedule">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimal Spray Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-green-50 p-3">
                        <p className="text-sm text-muted-foreground">Recommended Date</p>
                        <p className="font-semibold">{spraySchedule.recommended_date}</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-muted-foreground">Ideal Time Window</p>
                        <p className="font-semibold">
                          {spraySchedule.weather_window.start_time} -{' '}
                          {spraySchedule.weather_window.end_time}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Wind Speed</p>
                        <p className="text-lg font-semibold">{spraySchedule.wind_speed_ms} m/s</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-lg font-semibold">
                          {spraySchedule.temperature_range.min}°-{spraySchedule.temperature_range.max}°C
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="text-lg font-semibold">{spraySchedule.humidity_percent}%</p>
                      </div>
                    </div>
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        <ul className="mt-2 space-y-1 text-sm">
                          {spraySchedule.safety_notes.map((note, i) => (
                            <li key={i}>• {note}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Pesticide Calculation */}
            {pesticide && (
              <TabsContent value="pesticide">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pesticide Quantity & Cost</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="font-semibold">{pesticide.product_name}</p>
                      <p className="text-sm text-muted-foreground">{pesticide.concentration_percent}% concentration</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Quantity</p>
                        <p className="text-2xl font-bold">{pesticide.quantity_liters.toFixed(0)} L</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold">₹{pesticide.total_cost.toFixed(0)}</p>
                      </div>
                    </div>
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        <ul className="mt-2 space-y-1 text-sm">
                          {pesticide.safety_precautions.map((precaution, i) => (
                            <li key={i}>• {precaution}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Flight Plan */}
            {flightPlan && (
              <TabsContent value="flight-plan">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Automated Flight Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Altitude</p>
                        <p className="text-lg font-semibold">{flightPlan.altitude_meters} m</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Speed</p>
                        <p className="text-lg font-semibold">{flightPlan.speed_kmph.toFixed(1)} km/h</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Flight Duration</p>
                        <p className="text-lg font-semibold">{flightPlan.flight_time_minutes} min</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Battery Required</p>
                        <p className="text-lg font-semibold">{flightPlan.battery_required_percent}%</p>
                      </div>
                    </div>
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        <p className="font-semibold mb-2">Safety Zones:</p>
                        <ul className="space-y-1 text-sm">
                          {flightPlan.safety_zones.map((zone, i) => (
                            <li key={i}>• {zone}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* NDVI */}
            {ndvi && (
              <TabsContent value="ndvi">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NDVI Analysis (Vegetation Index)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gradient-to-r from-red-50 to-green-50 p-4">
                        <p className="text-sm text-muted-foreground">NDVI Score</p>
                        <p className="text-3xl font-bold text-center">{ndvi.ndvi_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Vegetation Health</p>
                        <Badge
                          variant={
                            ndvi.vegetation_health === 'excellent'
                              ? 'default'
                              : ndvi.vegetation_health === 'good'
                                ? 'secondary'
                                : 'destructive'
                          }
                          className="text-base py-1 px-3"
                        >
                          {ndvi.vegetation_health.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Stressed Zones:</p>
                      <div className="space-y-2">
                        {ndvi.stressed_zones.map((zone, i) => (
                          <div key={i} className="rounded-lg bg-amber-50 p-2">
                            <p className="text-sm font-medium">{zone.zone_id}</p>
                            <p className="text-xs text-muted-foreground">
                              NDVI: {zone.ndvi} | Coverage: {zone.coverage_percent}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {ndvi.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Coverage Estimate */}
            {coverage && (
              <TabsContent value="coverage">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Coverage & Battery Estimate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm text-muted-foreground">Estimated Duration</p>
                        <p className="text-3xl font-bold">{coverage.estimated_time_minutes}</p>
                        <p className="text-xs text-muted-foreground mt-1">minutes</p>
                      </div>
                      <div className="rounded-lg bg-orange-50 p-4">
                        <p className="text-sm text-muted-foreground">Battery Usage</p>
                        <p className="text-3xl font-bold">{coverage.estimated_battery_percent}%</p>
                        <p className="text-xs text-muted-foreground mt-1">of capacity</p>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Swath Width</p>
                        <p className="font-semibold">{coverage.swath_width_meters} m</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Number of Passes</p>
                        <p className="font-semibold">{coverage.number_of_passes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Overlap Margin</p>
                        <p className="font-semibold">{coverage.overlap_margin_percent}%</p>
                      </div>
                    </div>
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>{coverage.weather_impact}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  )
}
