"use client"

import { ExerciseLibrary } from "@/components/exercise-library"
import { useLibrary } from "./use-library"
import { useAppSettings } from "@/stores/app-settings-store"

export default function LibraryPage() {
    const { exerciseDatabase, loading ,fetchExercises} = useLibrary()
    const language = useAppSettings((s) => s.language)

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <ExerciseLibrary exerciseDatabase={exerciseDatabase} language={language} fetchData={fetchExercises}/>
    )
}
