"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X, Smartphone } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface PWAInstallBannerProps {
  language: "en" | "th"
}

export function PWAInstallBanner({ language }: PWAInstallBannerProps) {
  const { t } = useTranslation(language)
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Show banner after 30 seconds if not installed
    const timer = setTimeout(() => {
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowBanner(true)
      }
    }, 30000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    }
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem("pwa-banner-dismissed", "true")
  }

  if (!showBanner || localStorage.getItem("pwa-banner-dismissed")) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{t("installApp")}</h4>
            <p className="text-xs text-muted-foreground mt-1">{t("addToHomeScreen")} for quick access</p>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" onClick={handleInstall} className="text-xs">
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs">
                Later
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
