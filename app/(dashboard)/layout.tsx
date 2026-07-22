import type { Metadata } from "next"
import { ThemeProvider } from "@/components/agreeConnect/theme-provider"
import { SessionProvider } from "@/components/agreeConnect/session-provider"

export const metadata: Metadata = {
  title: "AgreeConnect — Agriculture Super App",
  description:
    "AgreeConnect by SmartFarmin: a multi-role agriculture super app for farmers, operators, dealers, buyers, experts and administrators.",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
