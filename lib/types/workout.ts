// lib/types/workout.ts

export interface Exercise {
    id: number
    name: string
    category: string
    sets?: number
    reps?: number
    duration?: number
    notes?: string
    weight?: number
    time?: number
    exerciseId?: string
}

export interface Workout {
    id: number
    name: string
    date: string            // "sv-SE" format
    exercises: Exercise[]
    completed: boolean
    createdAt: string       // ISO string
    duration?: number
    notes?: string
}
