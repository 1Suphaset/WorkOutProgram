"use client"

import { LoginForm } from "@/components/auth/login-form"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from "@/stores/auth-store"
import { useAppSettings } from "@/stores/app-settings-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()
  const { language } = useAppSettings()

  const handleLogin = async () => {
      router.replace("/dashboard")
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="workout-planner-theme">
        <LoginForm
          language={language}
          onLogin={handleLogin}
        />
    </ThemeProvider>
  )
}
