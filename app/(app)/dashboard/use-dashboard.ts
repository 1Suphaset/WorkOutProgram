"use client"

import { useEffect, useState } from "react"
import type { Workout } from "@/lib/types/workout"
import { useAuthStore } from "@/stores/auth-store"

export function useDashboard() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [loading, setLoading] = useState(true)
    const {user} = useAuthStore()
    console.log(user)
    useEffect(() => {
        if (!user) return

        fetch(`/api/workouts?user=${user.email}`)
            .then(res => res.json())
            .then(data => setWorkouts(data.workouts || []))
            .finally(() => setLoading(false))
    }, [user])

    return { workouts, loading }
}
