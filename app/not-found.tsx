import Link from "next/link"
import { Compass, Home, LayoutDashboard } from "lucide-react"
import { BrandMark } from "@/components/agreeConnect/status-screens"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="px-6 py-5">
        <Link href="/" aria-label="AgreeConnect home">
          <BrandMark />
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/12 text-primary">
            <Compass className="size-8" />
          </span>

          <p className="mt-6 font-serif text-6xl font-semibold tracking-tight text-primary">
            404
          </p>
          <h1 className="mt-2 text-balance font-serif text-2xl font-semibold tracking-tight">
            This field is fallow
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s
            get you back on track.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/app/dashboard" />}
              nativeButton={false}
            >
              <LayoutDashboard className="size-4" /> Go to dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full sm:w-auto"
              render={<Link href="/" />}
              nativeButton={false}
            >
              <Home className="size-4" /> Back to homepage
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
