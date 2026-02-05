"use client"

import { NotificationSettings } from "@/components/notification-settings"
import { Settings as SettingsComponent } from "@/components/settings"
import { useAuthStore } from "@/stores/auth-store"
import { useAppSettings } from "@/stores/app-settings-store"

export default function ProgressPage() {
    const language = useAppSettings((s) => s.language)
    const { user, logout,loading } = useAuthStore()
    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <>
            <SettingsComponent
                language={language}
                user={user}
                onLogout={logout}
            />
            <NotificationSettings language={language} />
        </>
    )
}
