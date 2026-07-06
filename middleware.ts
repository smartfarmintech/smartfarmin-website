import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Only guard/refresh sessions on the real Supabase-backed farmer module.
  // The existing demo app under /app is intentionally left untouched.
  matcher: ["/farmer/:path*"],
}
