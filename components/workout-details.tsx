"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Exercise } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Edit, Clock, Weight, Repeat, Timer } from "lucide-react"

interface Workout {
  id: number;
  name: string;
  date: string;
  notes?: string;
  completed?: boolean;
  duration?: number;
  exercises: Exercise[];
  createdAt?: string;
}
import { useTranslation } from "@/lib/i18n"

interface WorkoutDetailsProps {
  workout: Workout
  onClose: () => void
  onEdit: () => void
  onStart: () => void
  exerciseDatabase: any[] // Changed from ExerciseLibraryItem[]
  language?: "en" | "th"
}

export function WorkoutDetails({ workout, onClose, onEdit, onStart, exerciseDatabase, language = "en" }: WorkoutDetailsProps) {
  const { t } = useTranslation(language)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{workout.name}</span>
            <Badge variant={workout.completed ? "default" : "secondary"}>
              {workout.completed ? "Completed" : "Scheduled"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {new Date(workout.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {workout.notes && (
            <div>
              <h3 className="font-medium mb-2">{t('workoutDetails.notes')}</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{workout.notes}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-4">{t('workoutDetails.exercises')}({workout.exercises.length})</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => {
                  const exData = exerciseDatabase.find(e => e.id === ((exercise as any).exerciseId ?? exercise.id));
                  const exerciseName = exData?.name || t('unknownExercise');
                  return (
                  <Card key={exercise.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>
                            {index + 1}. {exerciseName}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {(exercise as any).sets && (
                          <div className="flex items-center">
                            <Repeat className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>{(exercise as any).sets} sets</span>
                          </div>
                        )}
                        {(exercise as any).reps && (
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-1">×</span>
                            <span>{(exercise as any).reps} reps</span>
                          </div>
                        )}
                        {(exercise as any).weight && (
                          <div className="flex items-center">
                            <Weight className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>{(exercise as any).weight} lbs</span>
                          </div>
                        )}
                        {(exercise as any).time && (
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>{formatTime((exercise as any).time)}</span>
                          </div>
                        )}
                      </div>
                      {(exercise as any).notes && <p className="text-sm text-muted-foreground mt-2 italic">{(exercise as any).notes}</p>}
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {workout.duration && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>{t('workoutDetails.completedIn')} {Math.round(workout.duration / 60)} {t('workoutDetails.minutes')}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              {t('workoutDetails.edit')}
            </Button>
            <Button onClick={onStart} disabled={workout.completed}>
              <Play className="w-4 h-4 mr-2" />
              {workout.completed ? t('workoutDetails.completed') : t('workoutDetails.startWorkout')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
