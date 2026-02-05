"use client"

import { CalendarView } from "@/components/calendar-view"
import { DragDropPlanner } from "@/components/drag-drop-planner"
import { WorkoutTimer } from "@/components/workout-timer"
import { WorkoutLogger } from "@/components/workout-logger"
import { useCalendar } from "./use-calendar"
import { useAppSettings } from "@/stores/app-settings-store"
import { useAuthStore } from "@/stores/auth-store"

export default function CalendarPage() {
    const {
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
    } = useCalendar()
    const language = useAppSettings((s) => s.language)
    const { user } = useAuthStore()

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <>
            <CalendarView
                workouts={workouts}
                templates={templates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                addWorkout={addWorkout}
                updateWorkout={updateWorkout}
                deleteWorkout={deleteWorkout}
                setActiveWorkout={setActiveWorkout}
                exerciseDatabase={exerciseDatabase}
                language={language}
                userEmail={user?.email}
            />
            <DragDropPlanner
                selectedDate={selectedDate}
                language={language}
                onAddExercise={handleAddExerciseFromDragDrop}
                exerciseDatabase={exerciseDatabase}
            />
            {
                activeWorkout && (
                    <WorkoutTimer
                        workout={activeWorkout}
                        onClose={() => setActiveWorkout(null)}
                        onComplete={(duration) => handleWorkoutComplete(activeWorkout, duration)}
                        language={language}
                        exerciseDatabase={exerciseDatabase}
                    />
                )
            }

            {
                showWorkoutLogger && workoutToLog && (
                    <WorkoutLogger
                        workout={workoutToLog}
                        isOpen={showWorkoutLogger}
                        onClose={() => setShowWorkoutLogger(false)}
                        onComplete={handleWorkoutLogged}
                        language={language}
                        exerciseDatabase={exerciseDatabase}
                    />
                )
            }
        </>
    )
}
