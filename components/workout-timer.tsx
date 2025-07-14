"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Timer,
  CheckCircle,
  Clock,
  Repeat,
  Weight,
  Zap,
} from "lucide-react"
import type { Workout } from "@/app/page"
import type { ExerciseLibraryItem } from "@/lib/exercise-database"
import { ExerciseCountdownTimer } from "@/components/exercise-countdown-timer"
import { useTranslation, type Language } from "@/lib/i18n"

interface WorkoutTimerProps {
  workout: Workout
  onClose: () => void
  onComplete: (duration: number) => void
  language?: Language
  exerciseDatabase: ExerciseLibraryItem[]
}

export function WorkoutTimer({ workout, onClose, onComplete, language = "en", exerciseDatabase }: WorkoutTimerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({})
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({})
  const [actualReps, setActualReps] = useState<Record<string, Record<number, number>>>({})
  const [actualWeight, setActualWeight] = useState<Record<string, Record<number, number>>>({})
  const [showExerciseTimer, setShowExerciseTimer] = useState(false)

  const { t } = useTranslation(language)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const exData = exerciseDatabase.find(e => e.id === (currentExercise && 'exerciseId' in currentExercise ? currentExercise.exerciseId : 0))
  const exerciseName = exData?.name || t('unknownExercise')
  const totalExercises = workout.exercises.length
  const totalSets = workout.exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0)
  const completedSetsCount = Object.values(completedSets).reduce((sum, sets) => sum + sets, 0)

  // Timer effect for main workout timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) {
              setIsResting(false)
              return 0
            }
            return prev - 1
          })
        } else {
          setElapsedTime((prev) => prev + 1)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isResting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopWorkout = () => {
    setIsRunning(false)
    onComplete(elapsedTime)
  }

  const completeSet = () => {
    const exerciseId = currentExercise.id
    const newCompletedSets = { ...completedSets }
    newCompletedSets[exerciseId] = (newCompletedSets[exerciseId] || 0) + 1

    setCompletedSets(newCompletedSets)
    setShowExerciseTimer(false) // Hide timer when set is completed

    // Check if exercise is complete
    const totalSetsForExercise = currentExercise.sets || 1
    if (newCompletedSets[exerciseId] >= totalSetsForExercise) {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentSet(1)
      } else {
        // Workout complete
        stopWorkout()
        return
      }
    } else {
      setCurrentSet(currentSet + 1)
    }

    // Start rest timer
    startRest()
  }

  const startRest = (customTime?: number) => {
    const restDuration = customTime || 60 // Default 60 seconds
    setRestTime(restDuration)
    setIsResting(true)
  }

  const skipRest = () => {
    setIsResting(false)
    setRestTime(0)
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setCurrentSet(1)
      setShowExerciseTimer(false)
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setShowExerciseTimer(false)
    }
  }

  const updateActualReps = (exerciseId: string, set: number, reps: number) => {
    setActualReps((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [set]: reps,
      },
    }))
  }

  const updateActualWeight = (exerciseId: string, set: number, weight: number) => {
    setActualWeight((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [set]: weight,
      },
    }))
  }

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    setExerciseNotes((prev) => ({
      ...prev,
      [exerciseId]: notes,
    }))
  }

  const handleExerciseTimerComplete = () => {
    // Auto-complete the set when timer finishes
    setTimeout(() => {
      completeSet()
    }, 2000) // Give user 2 seconds to see completion message
  }

  return (
   <Dialog open={true} onOpenChange={onClose}>
  <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between min-w-0">
        <span className="flex items-center gap-2 truncate">
          <Timer className="w-5 h-5 shrink-0" />
          {workout.name}
        </span>
        <Badge variant="secondary" className="text-lg px-3 py-1 break-words">
          {formatTime(elapsedTime)}
        </Badge>
      </DialogTitle>
      <DialogDescription className="text-base">
        Exercise {currentExerciseIndex + 1} of {totalExercises} • Set {currentSet} of {currentExercise?.sets || 1}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6 w-full">
      {/* Progress Overview */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Workout Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedSetsCount} / {totalSets} sets</span>
            </div>
            <Progress value={(completedSetsCount / totalSets) * 100} className="h-3" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center w-full">
            <div>
              <div className="text-2xl font-bold">{currentExerciseIndex + 1}</div>
              <div className="text-xs text-muted-foreground">Exercise</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{completedSetsCount}</div>
              <div className="text-xs text-muted-foreground">Sets Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isResting && (
        <Card className="border-orange-200 bg-orange-50 w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" /> Rest Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{formatTime(restTime)}</div>
              <p className="text-sm text-muted-foreground">Take a break before the next set</p>
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              <Button onClick={() => startRest(30)} variant="outline" size="sm">30s</Button>
              <Button onClick={() => startRest(60)} variant="outline" size="sm">60s</Button>
              <Button onClick={() => startRest(90)} variant="outline" size="sm">90s</Button>
              <Button onClick={skipRest} size="sm">Skip Rest</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentExercise?.time && showExerciseTimer && (
        <ExerciseCountdownTimer
          duration={currentExercise.time}
          exerciseName={`${exerciseName} - Set ${currentSet}`}
          language={language}
          onComplete={handleExerciseTimerComplete}
          onStart={() => !isRunning && startTimer()}
          className="border-2 border-primary shadow-xl w-full"
        />
      )}

      <Card className="border-primary w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{exerciseName}</span>
            <Badge variant="outline" className="text-base px-3 py-1">
              Set {currentSet} of {currentExercise?.sets || 1}
            </Badge>
          </CardTitle>
          {exData?.imageUrl ? (
            <img
              src={exData.imageUrl}
              alt={exerciseName}
              className="w-32 h-32 object-cover rounded mx-auto my-4"
            />
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {currentExercise?.sets && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Repeat className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Target Sets</p>
                  <p className="font-semibold">{currentExercise.sets}</p>
                </div>
              </div>
            )}
            {currentExercise?.reps && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <span className="text-primary font-bold">&times;</span>
                <div>
                  <p className="text-sm text-muted-foreground">Target Reps</p>
                  <p className="font-semibold">{currentExercise.reps}</p>
                </div>
              </div>
            )}
            {currentExercise?.weight && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Weight className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Target Weight</p>
                  <p className="font-semibold">{currentExercise.weight} lbs</p>
                </div>
              </div>
            )}
            {currentExercise?.time && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Timer className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{formatTime(currentExercise.time)}</p>
                </div>
              </div>
            )}
            {currentExercise?.sets && currentExercise?.reps && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Repeat className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="font-semibold">{currentExercise.sets}×{currentExercise.reps}</p>
                </div>
              </div>
            )}
          </div>

          {currentExercise?.time && !showExerciseTimer && (
            <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 w-full">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Timed Exercise</h3>
                <p className="text-blue-700 mb-4">
                  This exercise runs for <strong>{formatTime(currentExercise.time)}</strong>
                </p>
                <Button
                  onClick={() => setShowExerciseTimer(true)}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  <Timer className="w-6 h-6 mr-3" /> Start Exercise Timer
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <Label htmlFor="actual-reps">Actual Reps</Label>
              <Input
                id="actual-reps"
                type="number"
                placeholder={currentExercise?.reps?.toString() || "0"}
                value={actualReps[currentExercise?.id]?.[currentSet] || ""}
                onChange={(e) => updateActualReps(String(currentExercise?.id || ""), currentSet, Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="actual-weight">Actual Weight (lbs)</Label>
              <Input
                id="actual-weight"
                type="number"
                placeholder={currentExercise?.weight?.toString() || "0"}
                value={actualWeight[currentExercise?.id]?.[currentSet] || ""}
                onChange={(e) => updateActualWeight(String(currentExercise?.id || ""), currentSet, Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="exercise-notes">Notes for this exercise</Label>
            <Textarea
              id="exercise-notes"
              placeholder="How did this exercise feel? Any form notes?"
              value={exerciseNotes[currentExercise?.id] || ""}
              onChange={(e) => updateExerciseNotes(String(currentExercise?.id || ""), e.target.value)}
              rows={2}
            />
          </div>

          {!showExerciseTimer && (
            <div className="flex justify-center">
              <Button onClick={completeSet} size="lg" className="w-full h-12 text-lg font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" /> Complete Set {currentSet}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between gap-3">
        <Button variant="outline" onClick={previousExercise} disabled={currentExerciseIndex === 0}>
          <SkipBack className="w-4 h-4 mr-2" /> {t("previous")}
        </Button>
        <div className="flex flex-wrap gap-2 justify-center">
          {!isRunning ? (
            <Button onClick={startTimer}>
              <Play className="w-4 h-4 mr-2" /> {t("start")}
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline">
              <Pause className="w-4 h-4 mr-2" /> {t("pause")}
            </Button>
          )}
          <Button onClick={stopWorkout} variant="destructive">
            <Square className="w-4 h-4 mr-2" /> {t("finish")}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={nextExercise}
          disabled={currentExerciseIndex === totalExercises - 1}
        >
          {t("next")} <SkipForward className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {currentExerciseIndex < totalExercises - 1 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Up Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise) => {
                const exData = exerciseDatabase.find(e => e.id === ('exerciseId' in exercise ? exercise.exerciseId : 0))
                const exerciseName = exData?.name || t('unknownExercise')
                return (
                  <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="font-medium truncate">{exerciseName}</span>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                      {exercise.time && formatTime(exercise.time)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </DialogContent>
</Dialog>

  )
}
