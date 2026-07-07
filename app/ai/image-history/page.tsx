"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ImageIcon,
  Upload,
  Download,
  Trash2,
  Calendar,
  MapPin,
  Camera,
  BarChart3,
  Leaf,
  AlertTriangle,
  Eye,
  ZoomIn,
  Share2,
} from "lucide-react"

const imageHistory = [
  {
    id: "img-001",
    date: "2025-07-07",
    time: "10:30 AM",
    field: "Field A",
    crop: "Sugarcane",
    type: "Aerial Drone",
    resolution: "4K (3840x2160)",
    analysis: {
      health: "Excellent",
      coverage: "95%",
      stress: "None detected",
      anomalies: 0,
    },
    thumbnail:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2322c55e' width='400' height='300'/%3E%3Crect fill='%231ea853' x='0' y='150' width='400' height='150'/%3E%3C/svg%3E",
    tags: ["drone", "aerial", "healthy"],
  },
  {
    id: "img-002",
    date: "2025-07-04",
    time: "9:15 AM",
    field: "Field A",
    crop: "Sugarcane",
    type: "Ground Camera",
    resolution: "HD (1920x1080)",
    analysis: {
      health: "Good",
      coverage: "92%",
      stress: "Minor",
      anomalies: 1,
    },
    thumbnail:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%236ee7b7' width='400' height='300'/%3E%3Crect fill='%232d9a6b' x='0' y='150' width='400' height='150'/%3E%3C/svg%3E",
    tags: ["ground-camera", "monitoring"],
  },
  {
    id: "img-003",
    date: "2025-07-01",
    time: "11:00 AM",
    field: "Field B",
    crop: "Cotton",
    type: "Satellite",
    resolution: "Sentinel-2",
    analysis: {
      health: "Fair",
      coverage: "88%",
      stress: "Moderate",
      anomalies: 2,
    },
    thumbnail:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23a4e2c0' width='400' height='300'/%3E%3Crect fill='%2333845c' x='0' y='150' width='400' height='150'/%3E%3C/svg%3E",
    tags: ["satellite", "ndvi"],
  },
  {
    id: "img-004",
    date: "2025-06-28",
    time: "2:45 PM",
    field: "Field A",
    crop: "Sugarcane",
    type: "Multispectral",
    resolution: "5MP",
    analysis: {
      health: "Good",
      coverage: "94%",
      stress: "None detected",
      anomalies: 0,
    },
    thumbnail:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2334d399' width='400' height='300'/%3E%3Crect fill='%232d7e63' x='0' y='150' width='400' height='150'/%3E%3C/svg%3E",
    tags: ["multispectral", "health-index"],
  },
]

export default function ImageHistoryPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof imageHistory)[0] | null>(null)
  const [filterField, setFilterField] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredImages = imageHistory.filter((img) => {
    const matchesField = !filterField || img.field === filterField
    const matchesType = !filterType || img.type === filterType
    return matchesField && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Crop Image History</h1>
            <p className="text-slate-400 mt-2">Track crop health through aerial and ground imagery</p>
          </div>
          <Button className="btn-primary gap-2">
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Images</p>
                <p className="text-3xl font-bold text-white mt-2">{imageHistory.length}</p>
              </div>
              <ImageIcon className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Healthy Crops</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {imageHistory.filter((img) => img.analysis.health === "Excellent" || img.analysis.health === "Good").length}
                </p>
              </div>
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Anomalies Detected</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {imageHistory.reduce((sum, img) => sum + img.analysis.anomalies, 0)}
                </p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Last Scan</p>
                <p className="text-lg font-bold text-white mt-2">Today</p>
                <p className="text-xs text-slate-400 mt-1">10:30 AM</p>
              </div>
              <Camera className="w-5 h-5 text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Field</label>
            <div className="flex gap-2">
              {["Field A", "Field B"].map((field) => (
                <Button
                  key={field}
                  onClick={() => setFilterField(filterField === field ? null : field)}
                  variant={filterField === field ? "default" : "outline"}
                  size="sm"
                  className={filterField === field ? "bg-emerald-600" : ""}
                >
                  {field}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
            <div className="flex gap-2">
              {["Aerial Drone", "Ground Camera", "Satellite"].map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? null : type)}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  className={filterType === type ? "bg-emerald-600" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Image Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`card-glass overflow-hidden cursor-pointer transition-all hover:border-emerald-500/50 ${
                    selectedImage?.id === image.id ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : ""
                  }`}
                >
                  {/* Image Thumbnail */}
                  <div className="relative w-full h-32 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={`${image.crop} on ${image.date}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 text-xs text-white font-semibold">
                      {image.type}
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{image.crop}</p>
                        <p className="text-sm text-slate-400">{image.field}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          image.analysis.health === "Excellent"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : image.analysis.health === "Good"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {image.analysis.health}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <p className="text-slate-500">Coverage</p>
                        <p className="font-semibold text-white">{image.analysis.coverage}</p>
                      </div>
                      <div className="text-xs">
                        <p className="text-slate-500">Stress</p>
                        <p className="font-semibold text-white">{image.analysis.stress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      {image.date} at {image.time}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 btn-secondary gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Image Details */}
          {selectedImage && (
            <Card className="card-glass p-6 h-fit">
              <h3 className="text-lg font-semibold text-white mb-4">Image Details</h3>

              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="w-full h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
                  <img src={selectedImage.thumbnail} alt="Selected crop" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Crop</p>
                    <p className="font-semibold text-white">{selectedImage.crop}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Field</p>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {selectedImage.field}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Date & Time</p>
                    <p className="font-semibold text-white">{selectedImage.date} at {selectedImage.time}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Camera Type</p>
                    <p className="font-semibold text-white">{selectedImage.type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Resolution</p>
                    <p className="font-semibold text-white">{selectedImage.resolution}</p>
                  </div>

                  {/* Analysis */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-3 font-semibold">AI Analysis</p>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-500">Health Status</p>
                        <p className="text-sm font-semibold text-white mt-1">{selectedImage.analysis.health}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Crop Coverage</p>
                        <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: selectedImage.analysis.coverage }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{selectedImage.analysis.coverage}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Stress Level</p>
                        <p className="text-sm font-semibold text-white mt-1">{selectedImage.analysis.stress}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Anomalies Detected</p>
                        <p className="text-sm font-semibold text-white mt-1">{selectedImage.analysis.anomalies}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-2 font-semibold">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <Button className="btn-primary w-full gap-2">
                      <ZoomIn className="w-4 h-4" />
                      View Full Resolution
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="w-full gap-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
