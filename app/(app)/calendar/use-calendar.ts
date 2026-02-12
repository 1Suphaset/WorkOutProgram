"use client"

import { useEffect, useState, useRef } from "react"
import type { Exercise, Workout, Template } from "@/lib/types/workout"
import { useAuthStore } from "@/stores/auth-store"
import { WorkoutLogger, type WorkoutLog } from "@/components/workout-logger"
export function useCalendar() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const fetchedRef = useRef(false)
    const { user } = useAuthStore()
    const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [showWorkoutLogger, setShowWorkoutLogger] = useState(false)
    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
    const [workoutToLog, setWorkoutToLog] = useState<Workout | null>(null)

    const fetchData = async () => {
        if (!user) return
        setLoading(true)

        try {
            const [w, t, e] = await Promise.all([
                fetch(`/api/workouts?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
                fetch(`/api/templates?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
                fetch(`/api/exercises?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
            ])
            setWorkouts(w.workouts ?? [])
            setTemplates(t.templates ?? [])
            setExerciseDatabase(e.exercises ?? [])
        } catch (err) {
            console.error("fetch templates error", err)
            setWorkouts([])
            setTemplates([])
            setExerciseDatabase([])
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (!user || fetchedRef.current) return
        fetchedRef.current = true
        fetchData();
        // ไม่มี setInterval อีกต่อไป
    }, [user])


    const addWorkout = async (workout: Workout) => {
        if (!user) return;
        console.log("[POST] userEmail:", user.email);
        const res = await fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...workout, userEmail: user.email }),
        })
        const data = await res.json()
        // แปลง date เป็น 'sv-SE' format ก่อน setWorkouts
        const fixedWorkout = {
            ...data.workout,
            date: new Date(data.workout.date).toLocaleDateString("sv-SE"),
        }
        setWorkouts(prev => [fixedWorkout, ...prev])
    }

    // แก้ไข workout
    const updateWorkout = async (workoutId: number, updatedWorkout: Partial<Workout>) => {
        const workout = workouts.find(w => Number(w.id) === Number(workoutId))
        if (!workout || !user) return
        const res = await fetch("/api/workouts", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...workout, ...updatedWorkout, id: Number(workoutId), userEmail: user.email }),
        })
        const data = await res.json()
        console.log("[PUT] updateWorkout response:", data)
        // แปลง date เป็น 'sv-SE' format ก่อน setWorkouts
        const fixedWorkout = {
            ...data.workout,
            date: new Date(data.workout.date).toLocaleDateString("sv-SE"),
        }
        setWorkouts(prev => prev.map(w => Number(w.id) === Number(workoutId) ? fixedWorkout : w))
    }

    // ลบ workout
    const deleteWorkout = async (workoutId: number) => {
        if (!user) return;
        await fetch("/api/workouts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: workoutId, userEmail: user.email }),
        })
        setWorkouts(prev => prev.filter(w => w.id !== workoutId))
    }

    // เพิ่ม workout log
    const addWorkoutLog = async (logData: WorkoutLog) => {
        if (!user) return;
        console.log("Adding workout log to API:", { ...logData, userEmail: user.email })
        const res = await fetch("/api/workout-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...logData, userEmail: user.email }),
        })
        const data = await res.json()
        console.log("API response:", data)
        setWorkoutLogs(prev => [data.workoutLog, ...prev])
    }
    const handleAddExerciseFromDragDrop = (exercise: unknown) => {
        const ex = exercise as Exercise;
        console.log(ex)
        const workoutExercise = {
            id: Number(ex.id),
            name: ex.name,
            reps: ex.recommendedSets?.reps ?? 10,
            sets: ex.recommendedSets?.sets ?? 3,
            category: ex.category,
            duration: ex.estimatedDuration ?? 60, // default 60 วินาที
        };
        const newWorkout: Workout = {
            id: Date.now(),
            date: selectedDate.toLocaleDateString("sv-SE"),
            name: `${ex.name} Workout`,
            exercises: [workoutExercise],
            completed: false,
            createdAt: new Date().toISOString(),
        };

        addWorkout(newWorkout);
    };

    const handleWorkoutComplete = (workout: Workout, duration?: number) => {
        console.log("handleWorkoutComplete - duration from timer:", duration)
        setWorkoutToLog({ ...workout, duration })
        setShowWorkoutLogger(true)
        setActiveWorkout(null)
    }

    const handleWorkoutLogged = async (logData: WorkoutLog) => {
        console.log("Workout logged:", logData)
        console.log("Overall effort:", logData.overall_effort)
        await addWorkoutLog(logData)
        await updateWorkout(Number(logData.workoutId), { completed: true, duration: Number(logData.duration) })
        if (user) fetchData(); // refresh ข้อมูลหลัง finish workout
        setShowWorkoutLogger(false)
        setWorkoutToLog(null)
    }
    return {
        workouts,
        templates,
        exerciseDatabase,
        loading,
        activeWorkout,
        setActiveWorkout,
        handleWorkoutComplete,
        showWorkoutLogger,
        setShowWorkoutLogger,
        handleWorkoutLogged,
        workoutToLog,
        selectedDate,
        setSelectedDate,
        addWorkout,
        handleAddExerciseFromDragDrop,
        updateWorkout,
        deleteWorkout,
    }
}

