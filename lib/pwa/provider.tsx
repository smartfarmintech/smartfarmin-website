"use client"

import { useEffect, useState, ReactNode } from "react"

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAContextType {
  isInstalled: boolean
  isPrompting: boolean
  installPrompt: BeforeInstallPromptEvent | null
  handleInstall: () => Promise<void>
}

export const PWAProvider = ({ children }: { children: ReactNode }) => {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isPrompting, setIsPrompting] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Detect app mode on orientation change
    window.addEventListener("orientationchange", () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
      }
    })

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setIsPrompting(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsPrompting(false)
      setInstallPrompt(null)
    }

    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("[v0] Service Worker registered successfully", registration)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error("[v0] Service Worker registration failed:", error)
        })
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    try {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === "accepted") {
        setIsInstalled(true)
        setIsPrompting(false)
        setInstallPrompt(null)
      } else {
        // User dismissed the prompt
        setIsPrompting(false)
      }
    } catch (error) {
      console.error("[v0] Installation failed:", error)
    }
  }

  return (
    <PWAContext.Provider value={{ isInstalled, isPrompting, installPrompt, handleInstall }}>
      {children}
    </PWAContext.Provider>
  )
}

import React from "react"
export const PWAContext = React.createContext<PWAContextType>({
  isInstalled: false,
  isPrompting: false,
  installPrompt: null,
  handleInstall: async () => {},
})

export const usePWA = () => {
  const context = React.useContext(PWAContext)
  if (!context) {
    throw new Error("usePWA must be used within PWAProvider")
  }
  return context
}
