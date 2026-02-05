"use client"

import { useEffect, useState } from "react"
import type { Exercise } from "@/lib/types/workout"
import { useAuthStore } from "@/stores/auth-store"

export function useLibrary() {
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(false)
    const user = useAuthStore((s) => s.user)

    async function fetchExercises() {
        if (!user) return
        try {
            const res = await fetch(
                `/api/exercises?user=${encodeURIComponent(user?.email)}`
            )
            const data = await res.json()
            setExerciseDatabase(data.exercises || [])
        } catch (err) {
            console.error("Failed to fetch exercises", err)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchExercises()
        setLoading(false)
    }, [user])

    return {
        exerciseDatabase,
        loading,
        fetchExercises, // 👈 เรียกซ้ำจากภายนอกได้
    }
}
