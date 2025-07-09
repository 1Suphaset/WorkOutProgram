"use client"

import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { WeekCalendar as WeekCalendar } from "@/components/ui/WeekCalendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WorkoutForm } from "@/components/workout-form"
import { WorkoutDetails } from "@/components/workout-details"
import { Plus, Play, Edit, Trash2, Clock, CalendarIcon } from "lucide-react"
import type { Workout, Template } from "@/app/page"
import { useTranslation } from "@/lib/i18n"

interface CalendarViewProps {
  workouts: Workout[]
  templates: Template[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  addWorkout: (workout: Workout) => void
  updateWorkout: (workoutId: number, updatedWorkout: Partial<Workout>) => void
  deleteWorkout: (workoutId: number) => void
  setActiveWorkout: (workout: Workout) => void
  exerciseDatabase: ExerciseLibraryItem[]
}

export function Calendar({
  workouts,
  templates,
  selectedDate,
  setSelectedDate,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  setActiveWorkout,
  exerciseDatabase,
}: CalendarViewProps) {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [calendarView, setCalendarView] = useState<"month" | "week">("month")
  const { t } = useTranslation()

  const selectedDateString = selectedDate.toLocaleDateString("sv-SE")
  const selectedDateWorkouts = workouts.filter((w) =>
    new Date(w.date).toLocaleDateString("sv-SE") === selectedDateString
  )

  const handleCreateWorkout = () => {
    setEditingWorkout(null)
    setShowWorkoutForm(true)
  }

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout)
    setShowWorkoutForm(true)
  }

  const handleWorkoutSaved = () => {
    setShowWorkoutForm(false)
    setEditingWorkout(null)
  }

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout)
  }

  const getWorkoutsForDate = (date: Date) => {
    const dateString = date.toLocaleDateString("sv-SE")
    return workouts.filter((w) => new Date(w.date).toLocaleDateString("sv-SE") === dateString)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Workout Calendar</h1>
          <p className="text-muted-foreground text-sm md:text-base">Plan and track your workouts</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Tabs value={calendarView} onValueChange={(v) => setCalendarView(v as "month" | "week")}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="month" className="flex-1 sm:flex-none">
                Month
              </TabsTrigger>
              <TabsTrigger value="week" className="flex-1 sm:flex-none">
                Week
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleCreateWorkout} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Workout</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Calendar */}
        {calendarView === "month" ? (
  <Card>
    <CardHeader>
      <CardTitle>Month View</CardTitle>
      <CardDescription>Select a date to view or plan workouts</CardDescription>
    </CardHeader>
    <CardContent>
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
        modifiers={{
          hasWorkout: (date) => getWorkoutsForDate(date).length > 0,
          completed: (date) => getWorkoutsForDate(date).some((w) => w.completed),
        }}
        modifiersStyles={{
          hasWorkout: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          completed: { backgroundColor: "hsl(var(--success))", color: "white" },
        }}
      />
    </CardContent>
  </Card>
) : (
  <Card>
    <CardHeader>
      <CardTitle>Week View</CardTitle>
      <CardDescription>View your workouts for the week</CardDescription>
    </CardHeader>
    <CardContent>
     <WeekCalendar
  selected={selectedDate}
  onSelect={(date) => setSelectedDate(date)}
/>
    </CardContent>
  </Card>
)}


        {/* Selected Date Workouts */}
        <Card >
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span className="text-lg md:text-xl">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              {selectedDateWorkouts.length} workout{selectedDateWorkouts.length !== 1 ? "s" : ""} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] md:h-[400px]">
              {selectedDateWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateWorkouts.map((workout) => (
                    <div key={workout.id} className="border rounded-lg p-3 md:p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${workout.completed ? "bg-green-500" : "bg-yellow-500"}`}
                          />
                          <h3 className="font-medium text-sm md:text-base">{workout.name}</h3>
                          <Badge variant={workout.completed ? "default" : "secondary"} className="text-xs">
                            {workout.completed ? "Completed" : "Scheduled"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWorkout(workout)}
                            className="text-xs md:text-sm"
                          >
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStartWorkout(workout)}>
                            <Play className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditWorkout(workout)}>
                            <Edit className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteWorkout(workout.id)}>
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {workout.exercises.length} exercises
                        </div>
                        {workout.duration && <div>Duration: {Math.round(workout.duration / 60)} min</div>}
                      </div>

                      <div className="space-y-1">
                        {workout.exercises.slice(0, 3).map((exercise) => {
                          const exData = exerciseDatabase.find(e => e.id === ("exerciseId" in exercise ? exercise.exerciseId : exercise.id));
                          return (
                            <div key={exercise.id} className="text-xs md:text-sm text-muted-foreground">
                              • {exData?.name || exercise.name || t('unknownExercise')}
                              {exercise.sets && exercise.reps && ` - ${exercise.sets}x${exercise.reps}`}
                              {exercise.time && ` - ${exercise.time}s`}
                            </div>
                          );
                        })}
                        {workout.exercises.length > 3 && (
                          <div className="text-xs md:text-sm text-muted-foreground">
                            +{workout.exercises.length - 3} more exercises
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No workouts scheduled for this date</p>
                  <p className="text-xs md:text-sm">Click "New Workout" to get started</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Workout Form Modal */}
      {showWorkoutForm && (
        <WorkoutForm
          workout={editingWorkout}
          templates={templates}
          selectedDate={selectedDate}
          onSave={(workout) => {
            if (editingWorkout) {
              updateWorkout(editingWorkout.id, workout)
            } else {
              addWorkout({
                ...workout,
                id: Date.now() + Math.floor(Math.random() * 10000),
                date: selectedDate.toLocaleDateString("sv-SE"),
                completed: false,
                createdAt: new Date().toISOString(),
              })
            }
            handleWorkoutSaved()
          }}
          onClose={() => setShowWorkoutForm(false)}
          exerciseDatabase={exerciseDatabase}
        />
      )}

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <WorkoutDetails
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onEdit={() => {
            setSelectedWorkout(null)
            handleEditWorkout(selectedWorkout)
          }}
          onStart={() => {
            setSelectedWorkout(null)
            handleStartWorkout(selectedWorkout)
          }}
        />
      )}
    </div>
  )
}

// Alias export so consumers can import { CalendarView }
export { Calendar as CalendarView }
