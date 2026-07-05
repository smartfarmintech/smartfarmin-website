import type { Metadata } from "next"
import { ThemeProvider } from "@/components/rythu360/theme-provider"
import { SessionProvider } from "@/components/rythu360/session-provider"

export const metadata: Metadata = {
  title: "Rythu360 — Agriculture Super App",
  description:
    "Rythu360 by SmartFarmin: a multi-role agriculture super app for farmers, operators, dealers, buyers, experts and administrators.",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
