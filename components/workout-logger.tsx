"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Weight, Repeat } from "lucide-react"
import type { Workout } from "@/app/page"
import { useTranslation } from "@/lib/i18n"
import { exerciseDatabase as defaultExerciseDatabase } from "@/lib/exercise-database"

interface WorkoutLoggerProps {
  workout: Workout
  isOpen: boolean
  onClose: () => void
  onComplete: (logData: WorkoutLog) => void
  language: "en" | "th"
  exerciseDatabase?: typeof defaultExerciseDatabase
}

export interface WorkoutLog {
  workoutId: string
  completedAt: string
  duration: number
  exercises: ExerciseLog[]
  notes: string
  overallEffort: number
}

export interface ExerciseLog {
  exerciseId: string
  actualReps?: number
  actualWeight?: number
  actualTime?: number
  effort: number
  notes: string
}

export function WorkoutLogger({ workout, isOpen, onClose, onComplete, language, exerciseDatabase = defaultExerciseDatabase }: WorkoutLoggerProps) {
  const { t } = useTranslation(language)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(
    workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      actualReps: ex.reps,
      actualWeight: ex.weight,
      actualTime: ex.time,
      effort: 5,
      notes: "",
    })),
  )
  const [overallEffort, setOverallEffort] = useState([5])
  const [workoutNotes, setWorkoutNotes] = useState("")
  const [startTime] = useState(Date.now())

  const updateExerciseLog = (exerciseId: string, updates: Partial<ExerciseLog>) => {
    setExerciseLogs((prev) => prev.map((log) => (log.exerciseId === exerciseId ? { ...log, ...updates } : log)))
  }

  const handleComplete = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const logData: WorkoutLog = {
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      duration,
      exercises: exerciseLogs,
      notes: workoutNotes,
      overallEffort: overallEffort[0],
    }
    onComplete(logData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            {t("logWorkout")}: {workout.name}
          </DialogTitle>
          <DialogDescription>{t("workoutCompleted")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Logs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercises</h3>
            {workout.exercises.map((exercise, index) => {
              const log = exerciseLogs.find((l) => l.exerciseId === exercise.id)
              if (!log) return null
              const exData = exerciseDatabase.find(e => e.id === (exercise.exerciseId ?? exercise.id));
              const exerciseName = exData?.name || exercise.name || "Unknown Exercise";

              return (
                <Card key={exercise.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>
                        {index + 1}. {exerciseName}
                      </span>
                      <Badge variant="outline">
                        {exercise.sets && `${exercise.sets} sets`}
                        {exercise.reps && ` × ${exercise.reps} reps`}
                        {exercise.time && `${exercise.time}s`}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {exercise.reps && (
                        <div>
                          <Label className="flex items-center">
                            <Repeat className="w-4 h-4 mr-1" />
                            {t("actualReps")}
                          </Label>
                          <Input
                            type="number"
                            value={log.actualReps || ""}
                            onChange={(e) =>
                              updateExerciseLog(exercise.id, {
                                actualReps: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={exercise.reps?.toString()}
                          />
                        </div>
                      )}

                      {exercise.weight && (
                        <div>
                          <Label className="flex items-center">
                            <Weight className="w-4 h-4 mr-1" />
                            {t("actualWeight")}
                          </Label>
                          <Input
                            type="number"
                            value={log.actualWeight || ""}
                            onChange={(e) =>
                              updateExerciseLog(exercise.id, {
                                actualWeight: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={exercise.weight?.toString()}
                          />
                        </div>
                      )}

                      {exercise.time && (
                        <div>
                          <Label className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Actual Time (s)
                          </Label>
                          <Input
                            type="number"
                            value={log.actualTime || ""}
                            onChange={(e) =>
                              updateExerciseLog(exercise.id, {
                                actualTime: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={exercise.time?.toString()}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>
                        {t("perceivedEffort")}: {log.effort}/10
                      </Label>
                      <Slider
                        value={[log.effort]}
                        onValueChange={(value) => updateExerciseLog(exercise.id, { effort: value[0] })}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Exercise Notes</Label>
                      <Input
                        value={log.notes}
                        onChange={(e) => updateExerciseLog(exercise.id, { notes: e.target.value })}
                        placeholder="How did this exercise feel?"
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Overall Workout */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>
                  Overall {t("perceivedEffort")}: {overallEffort[0]}/10
                </Label>
                <Slider
                  value={overallEffort}
                  onValueChange={setOverallEffort}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t("workoutNotes")}</Label>
                <Textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="How was your workout today?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              {t("saveLog")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
