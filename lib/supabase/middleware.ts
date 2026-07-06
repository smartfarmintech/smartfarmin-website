import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: Do not run code between createServerClient and getClaims().
  // getClaims() refreshes the auth token and keeps the session alive.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const path = request.nextUrl.pathname

  // Each module has its own auth surface (login/register) and home.
  const modules = [
    { base: "/farmer", login: "/farmer/login", register: "/farmer/register" },
    { base: "/operator", login: "/operator/login", register: "/operator/register" },
  ]
  const active = modules.find((m) => path.startsWith(m.base))

  if (active) {
    const isPublic = path === active.login || path === active.register
    const isProtected = !isPublic

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = active.login
      url.searchParams.set("redirectTo", path)
      return NextResponse.redirect(url)
    }

    if (isPublic && user) {
      const url = request.nextUrl.clone()
      url.pathname = active.base
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
