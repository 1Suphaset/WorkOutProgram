"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, CheckCircle, Clock, Timer } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"

interface ExerciseCountdownTimerProps {
  duration: number // duration in seconds
  exerciseName: string
  language?: Language
  onComplete?: () => void
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
  autoStart?: boolean
  className?: string
}

export function ExerciseCountdownTimer({
  duration,
  exerciseName,
  language = "en",
  onComplete,
  onStart,
  onPause,
  onReset,
  autoStart = false,
  className = "",
}: ExerciseCountdownTimerProps) {
  const { t } = useTranslation(language)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Clear interval helper
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Start timer
  const startTimer = () => {
    if (timeLeft > 0 && !isCompleted) {
      setIsActive(true)
      onStart?.()

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            clearTimer()
            onComplete?.()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
  }

  // Pause timer
  const pauseTimer = () => {
    setIsActive(false)
    clearTimer()
    onPause?.()
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)
    setIsCompleted(false)
    setTimeLeft(duration)
    clearTimer()
    onReset?.()
  }

  // Auto-start effect
  useEffect(() => {
    if (autoStart && !isCompleted && timeLeft === duration) {
      startTimer()
    }
  }, [autoStart])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [])

  const progressPercentage = ((duration - timeLeft) / duration) * 100
  const isLowTime = timeLeft <= 10 && timeLeft > 0 && isActive

  return (
    <Card
      className={`${
        isCompleted
          ? "border-green-500 bg-green-50 shadow-green-100"
          : isActive
            ? "border-blue-500 bg-blue-50 shadow-blue-100"
            : "border-gray-300"
      } shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Timer className="w-5 h-5 mr-2" />
            {exerciseName}
          </span>
          <Badge
            variant={isCompleted ? "default" : isActive ? "secondary" : "outline"}
            className={isCompleted ? "bg-green-600" : isActive ? "bg-blue-600" : ""}
          >
            {isCompleted ? t("completed") : isActive ? "Active" : "Ready"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Large Timer Display */}
        <div className="text-center">
          <div
            className={`text-7xl md:text-8xl font-bold tabular-nums transition-all duration-300 ${
              isCompleted
                ? "text-green-600"
                : isLowTime
                  ? "text-red-500 animate-pulse"
                  : isActive
                    ? "text-blue-600"
                    : "text-gray-600"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <p className="text-lg text-muted-foreground mt-2 font-medium">
            {isCompleted ? t("exerciseComplete") : isActive ? "Time Remaining" : "Duration"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress
            value={progressPercentage}
            className={`h-4 transition-all duration-300 ${
              isCompleted ? "[&>div]:bg-green-500" : isActive ? "[&>div]:bg-blue-500" : ""
            }`}
          />
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>Start</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {!isActive && !isCompleted && (
            <Button
              onClick={startTimer}
              size="lg"
              className="min-w-[120px] h-12 text-lg font-semibold"
              disabled={timeLeft === 0}
            >
              <Play className="w-5 h-5 mr-2" />
              {t("start")}
            </Button>
          )}

          {isActive && (
            <Button
              onClick={pauseTimer}
              variant="outline"
              size="lg"
              className="min-w-[120px] h-12 text-lg font-semibold border-2"
            >
              <Pause className="w-5 h-5 mr-2" />
              {t("pause")}
            </Button>
          )}

          {!isActive && !isCompleted && timeLeft < duration && (
            <Button onClick={startTimer} size="lg" className="min-w-[120px] h-12 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              {t("resume")}
            </Button>
          )}

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="min-w-[120px] h-12 text-lg font-semibold border-2"
            disabled={timeLeft === duration && !isCompleted}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("reset")}
          </Button>
        </div>

        {/* Status Messages */}
        {isCompleted && (
          <div className="text-center p-6 bg-green-100 rounded-xl border-2 border-green-200">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-green-800 font-bold text-xl">{t("exerciseComplete")}</p>
            <p className="text-green-700 text-sm mt-1">Great job! You can move to the next exercise.</p>
          </div>
        )}

        {isLowTime && (
          <div className="text-center p-4 bg-red-100 rounded-xl border-2 border-red-200 animate-pulse">
            <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800 font-bold text-lg">
              {timeLeft} second{timeLeft !== 1 ? "s" : ""} left!
            </p>
            <p className="text-red-700 text-sm">Almost done, keep going!</p>
          </div>
        )}

        {!isActive && !isCompleted && timeLeft === duration && (
          <div className="text-center p-4 bg-blue-100 rounded-xl border-2 border-blue-200">
            <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 font-semibold text-lg">Ready to start!</p>
            <p className="text-blue-700 text-sm">Click the start button when you're ready to begin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
