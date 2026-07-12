"use client"

import { useAuth } from "@/lib/hooks"

export default function ProfilePage() {
  const { profile } = useAuth()

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-600 mt-2">{profile?.full_name}</p>
    </div>
  )
}
