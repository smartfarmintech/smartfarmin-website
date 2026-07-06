import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Guard/refresh sessions on all private routes
  matcher: [
    "/farmer/:path*",
    "/operator/:path*",
    "/admin/:path*",
    "/founder/:path*",
    "/field-agent/:path*",
    "/telecaller/:path*",
    "/dealer/:path*",
    "/app/:path*",
  ],
}
