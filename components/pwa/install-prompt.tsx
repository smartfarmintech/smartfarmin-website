"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWA } from "@/lib/pwa/provider"
import { cn } from "@/lib/utils"

export function PWAInstallPrompt() {
  const { isPrompting, isInstalled, handleInstall } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isPrompting && !isInstalled && !dismissed) {
      setShowPrompt(true)
    }
  }, [isPrompting, isInstalled, dismissed])

  if (!showPrompt) return null

  const handleDismiss = () => {
    setDismissed(true)
    setShowPrompt(false)
  }

  const handleInstallClick = async () => {
    await handleInstall()
    setShowPrompt(false)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Install SmartFarmin</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install the app for quick access and offline support
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="h-8 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
