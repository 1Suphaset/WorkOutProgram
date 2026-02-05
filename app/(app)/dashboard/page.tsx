"use client"

import { Dashboard } from "@/components/dashboard"
import { useDashboard } from "./use-dashboard"
import { useAppSettings } from "@/stores/app-settings-store"
import { DashboardSkeleton } from "./dashboard-skeleton"
export default function DashboardPage() {
  const { workouts, loading } = useDashboard()
  const language = useAppSettings((s) => s.language)

  if (loading) {
    return <DashboardSkeleton/>
  }

  return (
    <Dashboard
      workouts={workouts}
      language={language}
    />
  )
}
