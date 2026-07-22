import { AuthScreen } from "@/components/agreeConnect/auth-screen"

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  const initialMode = mode === "register" ? "register" : "login"
  return <AuthScreen initialMode={initialMode} />
}
