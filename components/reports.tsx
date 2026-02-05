"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, Clock, Dumbbell, Download } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Exercise } from "@/lib/utils"

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

interface ReportsProps {
  workouts: Workout[]
  exerciseDatabase: any[] // Changed from ExerciseLibraryItem[]
  language: "en" | "th"
}

function mapExerciseFromDB(dbExercise: any) {
  return {
    ...dbExercise,
    id: Number(dbExercise.id),
    muscleGroups: dbExercise.muscle_groups || [],
    image_url: dbExercise.image_url,
    estimatedDuration: dbExercise.estimated_duration,
    isCustom: dbExercise.is_custom,
    createdAt: dbExercise.created_at,
    userId: dbExercise.user_id,
  };
}

export function Reports({ workouts, exerciseDatabase, language }: ReportsProps) {
  const { t } = useTranslation(language)
  const [timeRange, setTimeRange] = useState("30")
  const [reportType, setReportType] = useState("overview")

  const filteredWorkouts = useMemo(() => {
    const days = Number.parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return workoutDate >= cutoffDate && workout.completed
    })
  }, [workouts, timeRange])

  const stats = useMemo(() => {
    const totalWorkouts = filteredWorkouts.length
    const totalDuration = filteredWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0)
    const totalExercises = filteredWorkouts.reduce((sum, w) => sum + w.exercises.length, 0)
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0
    const avgExercises = totalWorkouts > 0 ? totalExercises / totalWorkouts : 0

    // Workout frequency by day of week
    const dayFrequency = Array(7).fill(0)
    filteredWorkouts.forEach((workout) => {
      const day = new Date(workout.date).getDay()
      dayFrequency[day]++
    })

    // Most common exercises
    const exerciseCount: Record<string, number> = {}
    filteredWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const exData = exerciseDatabase.find(e => e.id === ((exercise as any).exerciseId ?? exercise.id));
        const name = exData?.name || t('unknownExercise');
        exerciseCount[name] = (exerciseCount[name] || 0) + 1
      })
    })

    const topExercises = Object.entries(exerciseCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    // Weekly progress
    const weeklyData = []
    const weeks = Math.ceil(Number.parseInt(timeRange) / 7)
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - i * 7 - 6)
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() - i * 7)

      const weekWorkouts = filteredWorkouts.filter((w) => {
        const date = new Date(w.date)
        return date >= weekStart && date <= weekEnd
      })

      weeklyData.push({
        week: `Week ${weeks - i}`,
        workouts: weekWorkouts.length,
        duration: weekWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
      })
    }

    return {
      totalWorkouts,
      totalDuration,
      totalExercises,
      avgDuration,
      avgExercises,
      dayFrequency,
      topExercises,
      weeklyData,
    }
  }, [filteredWorkouts, timeRange, exerciseDatabase])
  console.log(stats)
  const dayNames = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")]

  const exportReport = () => {
    const reportData = {
      timeRange: `${timeRange} days`,
      generatedAt: new Date().toISOString(),
      stats,
      workouts: filteredWorkouts.map((w) => ({
        date: w.date,
        name: w.name,
        duration: w.duration,
        exercises: w.exercises.length,
      })),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `workout-report-${new Date().toLocaleDateString("sv-SE")}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("workoutReports")}</h1>
          <p className="text-muted-foreground">{t("analyzeFitnessProgress")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("last7days")}</SelectItem>
              <SelectItem value="30">{t("last30days")}</SelectItem>
              <SelectItem value="90">{t("last90days")}</SelectItem>
              <SelectItem value="365">{t("lastYear")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t("export")}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalWorkouts")}</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">{t("inLastXDays")}: {timeRange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalTime")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalDuration / 60)}min</div>
            <p className="text-xs text-muted-foreground">{t("avgPerWorkout")}: {Math.round(stats.avgDuration / 60)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalExercises")}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">{t("avgExercisesPerWorkout")}: {Math.round(stats.avgExercises)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("frequency")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalWorkouts > 0 ? Math.round((stats.totalWorkouts / Number.parseInt(timeRange)) * 7) : 0}
            </div>
            <p className="text-xs text-muted-foreground">{t("workoutsPerWeek")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="trends">{t("trends")}</TabsTrigger>
          <TabsTrigger value="exercises">{t("exercises")}</TabsTrigger>
          <TabsTrigger value="schedule">{t("schedule")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("weeklyProgress")}</CardTitle>
                <CardDescription>{t("workoutFrequencyOverTime")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.weeklyData.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{week.week}</p>
                        <p className="text-sm text-muted-foreground">{Math.round(week.duration / 60)} minutes total</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min((week.workouts / 7) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{week.workouts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("workoutDistribution")}</CardTitle>
                <CardDescription>{t("byDayOfTheWeek")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayNames.map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.max((stats.dayFrequency[index] / Math.max(...stats.dayFrequency)) * 100, 0)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">{stats.dayFrequency[index]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("performanceTrends")}</CardTitle>
              <CardDescription>{t("yourWorkoutPatternsOverTime")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">{t("consistencyScore")}</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${Math.min((stats.totalWorkouts / ((Number.parseInt(timeRange) / 7) * 3)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((stats.totalWorkouts / ((Number.parseInt(timeRange) / 7) * 3)) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t("basedOn3WorkoutsPerWeekTarget")}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">{t("averageWorkoutDuration")}</h4>
                  <div className="text-2xl font-bold">{Math.round(stats.avgDuration / 60)} minutes</div>
                  <p className="text-sm text-muted-foreground">
                    {stats.avgDuration > 45 * 60 ? t("aboveAverage") : t("belowAverage")} workout length
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("mostPopularExercises")}</CardTitle>
              <CardDescription>{t("yourMostFrequentlyPerformedExercises")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topExercises.length > 0 ? (
                  stats.topExercises.map(([exercise, count], index) => (
                    <div key={exercise} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{exercise}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(count / stats.topExercises[0][1]) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {t("noExerciseDataAvailableForSelectedTimeRange")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("workoutScheduleAnalysis")}</CardTitle>
              <CardDescription>{t("whenYouPreferToWorkOut")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">{t("mostActiveDay")}</h4>
                  <div className="text-2xl font-bold">
                    {dayNames[stats.dayFrequency.indexOf(Math.max(...stats.dayFrequency))]}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.max(...stats.dayFrequency)} workouts on this day
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">{t("workoutFrequency")}</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-xs font-medium mb-1">{day}</div>
                        <div
                          className={`h-8 rounded flex items-center justify-center text-xs font-medium ${stats.dayFrequency[index] > 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {stats.dayFrequency[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
