"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  Clock3,
  Heart,
  MapPin,
  Share2,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const services = [
  {
    id: "drone",
    title: "Drone crop spraying",
    operator: "Srinivas Drone Services",
    initials: "SD",
    rating: 4.9,
    jobs: 286,
    distance: "2.4 km",
    eta: "12 min",
    price: "₹450 / acre",
    status: "Available now",
    poster: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=85",
    video: "https://videos.pexels.com/video-files/2887463/2887463-hd_1920_1080_25fps.mp4",
  },
  {
    id: "tractor",
    title: "Tractor with driver",
    operator: "Venkateswara Tractors",
    initials: "VT",
    rating: 4.8,
    jobs: 412,
    distance: "3.1 km",
    eta: "18 min",
    price: "₹1,100 / hour",
    status: "2 tractors free",
    poster: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7a1f?auto=format&fit=crop&w=1200&q=85",
    video: "https://videos.pexels.com/video-files/4463164/4463164-hd_1920_1080_25fps.mp4",
  },
  {
    id: "rotavator",
    title: "Rotavator service",
    operator: "Lakshmi Farm Works",
    initials: "LF",
    rating: 4.7,
    jobs: 198,
    distance: "4.6 km",
    eta: "25 min",
    price: "₹1,650 / acre",
    status: "Available today",
    poster: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    video: "https://videos.pexels.com/video-files/4125025/4125025-hd_1920_1080_25fps.mp4",
  },
  {
    id: "harvester",
    title: "Combine harvester",
    operator: "Nellore Harvest Team",
    initials: "NH",
    rating: 4.9,
    jobs: 324,
    distance: "7.8 km",
    eta: "45 min",
    price: "₹2,800 / acre",
    status: "Next slot 2 PM",
    poster: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=85",
    video: "https://videos.pexels.com/video-files/4285697/4285697-hd_1920_1080_25fps.mp4",
  },
  {
    id: "irrigation",
    title: "Irrigation pump setup",
    operator: "Sai Water Solutions",
    initials: "SW",
    rating: 4.6,
    jobs: 151,
    distance: "5.2 km",
    eta: "30 min",
    price: "₹700 / visit",
    status: "Available now",
    poster: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=85",
    video: "https://videos.pexels.com/video-files/5199624/5199624-hd_1920_1080_25fps.mp4",
  },
]

function SmartVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (reduceMotion || connection?.saveData) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEnabled(entry.isIntersecting)
        if (entry.isIntersecting) void videoRef.current?.play().catch(() => undefined)
        else videoRef.current?.pause()
      },
      { rootMargin: "120px", threshold: 0.4 },
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-muted">
      {/* Native video keeps this cinematic surface lightweight and accessible. */}
      <video
        ref={videoRef}
        aria-label={`${title} service preview`}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
      >
        {enabled && <source src={src} type="video/mp4" />}
      </video>
      <div className="absolute inset-0 bg-foreground/45" aria-hidden="true" />
    </div>
  )
}

export function VideoServices() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [shareStatus, setShareStatus] = useState("")

  async function shareService(title: string) {
    const data = { title, text: `Book ${title} on Rythu360`, url: `${window.location.origin}/app/machinery` }
    try {
      if (navigator.share) await navigator.share(data)
      else {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`)
        setShareStatus(`${title} link copied`)
      }
    } catch {
      setShareStatus("Share cancelled")
    }
  }

  return (
    <section aria-labelledby="services-title" className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Verified near you</p>
          <h2 id="services-title" className="text-balance font-serif text-2xl font-semibold tracking-tight">
            Services ready for your farm
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Live availability around SPSR Nellore</p>
        </div>
        <Button render={<Link href="/app/nearby" />} nativeButton={false} variant="outline" className="hidden rounded-full sm:flex">
          View all
        </Button>
      </div>

      <p className="sr-only" aria-live="polite">{shareStatus}</p>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {services.map((service) => {
          const favorite = favorites.includes(service.id)
          return (
            <article key={service.id} className="group relative min-h-[390px] w-[84vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <SmartVideo src={service.video} poster={service.poster} title={service.title} />
              <div className="relative flex min-h-[390px] flex-col justify-between p-4 text-primary-foreground">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
                    <span className="size-1.5 rounded-full bg-primary" /> {service.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label={`${favorite ? "Remove" : "Add"} ${service.title} ${favorite ? "from" : "to"} favorites`}
                      aria-pressed={favorite}
                      onClick={() => setFavorites((items) => favorite ? items.filter((id) => id !== service.id) : [...items, service.id])}
                      className="flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background"
                    >
                      <Heart className={cn("size-4", favorite && "fill-primary text-primary")} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Share ${service.title}`}
                      onClick={() => void shareService(service.title)}
                      className="flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-balance font-serif text-2xl font-semibold tracking-tight">{service.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{service.initials}</span>
                    <span className="font-medium">{service.operator}</span>
                    <BadgeCheck className="size-4 text-accent" aria-label="Verified operator" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-primary-foreground/85">
                    <span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-accent text-accent" /> {service.rating} · {service.jobs} jobs</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {service.distance}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {service.eta}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary-foreground/25 pt-4">
                    <div>
                      <p className="text-xs text-primary-foreground/75">Starts at</p>
                      <p className="text-lg font-semibold">{service.price}</p>
                    </div>
                    <Button render={<Link href={`/app/machinery?service=${service.id}`} />} nativeButton={false} className="rounded-full bg-background text-foreground hover:bg-background/90">
                      Book now
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
