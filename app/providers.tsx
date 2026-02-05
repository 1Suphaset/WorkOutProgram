"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useAppSettings } from "@/stores/app-settings-store"

export function Providers({ children }: { children: React.ReactNode }) {
    const hydrateAuth = useAuthStore((s) => s.hydrate)
    const hydrateSettings = useAppSettings((s) => s.hydrate)

    useEffect(() => {
        hydrateAuth()
        hydrateSettings()
    }, [hydrateAuth, hydrateSettings])

    return <>{children}</>
}
