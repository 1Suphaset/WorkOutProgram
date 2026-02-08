"use client"

import { useEffect, useState } from "react"
import type { Workout, Exercise } from "@/lib/types/workout"
import type { WorkoutLog } from "@/components/workout-logger"
import { useAuthStore } from "@/stores/auth-store"
import { useRef } from "react"

export function useProgress() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuthStore()
    const fetchedRef = useRef(false)

    console.log(user)
    const fetchData = () => {
        if (!user) return;
        setLoading(true);
        Promise.all([
            fetch(`/api/workouts?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
            fetch(`/api/workout-logs?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
            fetch(`/api/exercises?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
        ]).then(([w, l, e]) => {
            setWorkouts(w.workouts || [])
            setWorkoutLogs(l.workoutLogs || [])
            setExerciseDatabase(e.exercises || [])
        }).finally(() => setLoading(false))
    };

    useEffect(() => {
        if (!user || fetchedRef.current) return
        fetchedRef.current = true
        fetchData();
    }, [user])
    return { workouts, exerciseDatabase, workoutLogs, loading }
}

