"use client"

import { useEffect, useState } from "react"
import type { Exercise } from "@/lib/types/workout"
import { useAuthStore } from "@/stores/auth-store"

export function useLibrary() {
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)
    const user = useAuthStore((s) => s.user)

    useEffect(() => {
        if (!user) return

        fetch(`/api/exercises?user=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => setExerciseDatabase(data.exercises || []))
            .finally(() => setLoading(false))
    }, [user])

    return { exerciseDatabase, loading }
}
