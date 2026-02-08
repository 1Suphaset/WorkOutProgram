// lib/types/workout.ts
export interface Exercise {
    id?: number;
    name: string;
    category?: string;
    muscleGroups?: string[];
    difficulty?: string;
    equipment?: string;
    description?: string;
    instructions?: string[];
    image_url?: string;
    estimatedDuration?: number;
    isCustom?: boolean;
    createdAt?: string;
    benefits?: string[];
    tips?: string[];
    variations?: {
        name: string;
        description: string;
    }[];
    recommendedSets?: {
        sets: number;
        reps: string;
        rest?: number;
    };
    user_id?: number;
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

export interface Template {
    id: number
    name: string
    nameTranslations: {
        th: string
    }
    type: "Cardio" | "Strength" | "Core" | "Flexibility" | "Full Body" | "HIIT"
    duration: number // in minutes
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    description: string
    descriptionTranslations: {
        th: string
    }
    exercises:Exercise[]
    equipment: string[]
    targetMuscles: string[]
    calories: number // estimated calories burned
    tags: string[]
}
