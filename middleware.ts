import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Guard/refresh sessions on the Supabase-backed farmer and operator modules.
  // The existing demo app under /app is intentionally left untouched.
  matcher: ["/farmer/:path*", "/operator/:path*"],
}
