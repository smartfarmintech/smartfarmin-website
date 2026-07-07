"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Shield,
  Mail,
  Phone,
  MapPin,
  Clock,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react"

const teamMembers = [
  {
    id: "user-001",
    name: "Rajesh Kumar",
    email: "rajesh@smartfarmin.com",
    role: "admin",
    phone: "+91-9876543210",
    location: "Maharashtra",
    joinedDate: "2025-01-15",
    status: "active",
    avatar: "RK",
  },
  {
    id: "user-002",
    name: "Priya Sharma",
    email: "priya@smartfarmin.com",
    role: "manager",
    phone: "+91-9123456789",
    location: "Maharashtra",
    joinedDate: "2025-02-10",
    status: "active",
    avatar: "PS",
  },
  {
    id: "user-003",
    name: "Arjun Singh",
    email: "arjun@smartfarmin.com",
    role: "operator",
    phone: "+91-8765432109",
    location: "Maharashtra",
    joinedDate: "2025-03-05",
    status: "active",
    avatar: "AS",
  },
  {
    id: "user-004",
    name: "Vikram Patel",
    email: "vikram@smartfarmin.com",
    role: "farmer",
    phone: "+91-7654321098",
    location: "Gujarat",
    joinedDate: "2025-04-01",
    status: "active",
    avatar: "VP",
  },
]

const roleDescriptions = {
  admin: "Full access, can manage all features and members",
  manager: "Can manage operations and view reports",
  operator: "Can operate machinery and log activities",
  farmer: "Can view crop information and advice",
}

const roleColors = {
  admin: "bg-red-500/20 text-red-400",
  manager: "bg-purple-500/20 text-purple-400",
  operator: "bg-blue-500/20 text-blue-400",
  farmer: "bg-green-500/20 text-green-400",
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || member.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Team Members</h1>
            <p className="text-slate-400 mt-2">Manage organization members and their roles</p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Members</p>
                <p className="text-3xl font-bold text-white mt-2">{teamMembers.length}</p>
              </div>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Admins</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {teamMembers.filter((m) => m.role === "admin").length}
                </p>
              </div>
              <Shield className="w-5 h-5 text-red-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {teamMembers.filter((m) => m.status === "active").length}
                </p>
              </div>
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
          </Card>

          <Card className="card-glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">0</p>
              </div>
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-xs">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <Filter className="w-4 h-4 text-slate-400" />
          {["admin", "manager", "operator", "farmer"].map((role) => (
            <Button
              key={role}
              onClick={() => setFilterRole(filterRole === role ? null : role)}
              variant={filterRole === role ? "default" : "outline"}
              size="sm"
              className={filterRole === role ? "bg-emerald-600" : ""}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </div>

        {/* Members Table */}
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="card-glass p-6 hover:translate-y-[-2px] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {member.avatar}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[member.role as keyof typeof roleColors]
                        }`}
                      >
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                      {member.status === "active" && (
                        <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        {member.location}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </p>

                    {member.role && (
                      <p className="text-xs text-slate-400 mt-2">
                        <span className="text-emerald-400 font-semibold">Permissions:</span> {roleDescriptions[member.role as keyof typeof roleDescriptions]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <Card className="card-glass p-12 text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No members found matching your search</p>
            <Button className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Add New Member
            </Button>
          </Card>
        )}

        {/* Role Permissions Info */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Role Permissions Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(roleColors).map(([role, color]) => (
              <Card key={role} className="card-glass p-4">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${color} mb-3`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
                <p className="text-slate-400 text-sm">
                  {roleDescriptions[role as keyof typeof roleDescriptions]}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
