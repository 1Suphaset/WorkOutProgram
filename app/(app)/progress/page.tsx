"use client"

import { ProgressDashboard } from "@/components/progress-dashboard"
import { useProgress } from "./use-progress"
import { useAppSettings } from "@/stores/app-settings-store"
import { ProgressDashboardSkeleton } from "./progress-dashboard-skeleton"
export default function ProgressPage() {
    const { workouts,workoutLogs,exerciseDatabase, loading } = useProgress()
    const language = useAppSettings((s) => s.language)

    if (loading) {
        return <ProgressDashboardSkeleton/>
    }

    return (
        <ProgressDashboard
            workouts={workouts}
            workoutLogs={workoutLogs}
            language={language}
            exerciseDatabase={exerciseDatabase}
        />
    )
}
