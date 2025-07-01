"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Target, Clock, Dumbbell, Calendar, Award } from "lucide-react"
import type { Workout } from "@/app/page"
import type { WorkoutLog } from "@/components/workout-logger"
import { useTranslation } from "@/lib/i18n"
import { exerciseDatabase as defaultExerciseDatabase } from "@/lib/exercise-database"

interface ProgressDashboardProps {
  workouts: Workout[]
  workoutLogs: WorkoutLog[]
  language: "en" | "th"
  exerciseDatabase?: typeof defaultExerciseDatabase
}

export function ProgressDashboard({ workouts, workoutLogs, language, exerciseDatabase = defaultExerciseDatabase }: ProgressDashboardProps) {
  const { t } = useTranslation(language)

  // Calculate statistics
  const completedWorkouts = workouts.filter((w) => w.completed)
  const totalWorkouts = workouts.length
  const completionRate = totalWorkouts > 0 ? (completedWorkouts.length / totalWorkouts) * 100 : 0

  // Weekly data for the last 8 weeks
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i * 7)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekWorkouts = completedWorkouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekStart && workoutDate <= weekEnd
    })

    return {
      week: `Week ${8 - i}`,
      workouts: weekWorkouts.length,
      duration: weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 60, // in minutes
    }
  }).reverse()

  // Exercise frequency
  const exerciseFrequency = completedWorkouts.reduce(
    (acc, workout) => {
      workout.exercises.forEach((exercise) => {
        const exData = exerciseDatabase.find(e => e.id === (exercise.exerciseId ?? exercise.id));
        const name = exData?.name || exercise.name || "Unknown Exercise";
        acc[name] = (acc[name] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const topExercises = Object.entries(exerciseFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Monthly trends
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", { month: "short" })

    const monthWorkouts = completedWorkouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate.getMonth() === date.getMonth() && workoutDate.getFullYear() === date.getFullYear()
    })

    const avgEffort = workoutLogs
      .filter((log) => {
        const logDate = new Date(log.completedAt)
        return logDate.getMonth() === date.getMonth() && logDate.getFullYear() === date.getFullYear()
      })
      .reduce((sum, log, _, arr) => sum + log.overallEffort / arr.length, 0)

    return {
      month,
      workouts: monthWorkouts.length,
      duration: monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 60,
      effort: Math.round(avgEffort * 10) / 10,
    }
  }).reverse()

  // Workout category distribution
  const categoryData = completedWorkouts.reduce(
    (acc, workout) => {
      // Determine category based on exercises (simplified logic)
      const hasCardio = workout.exercises.some((ex) => ex.time && ex.time > 0)
      const hasStrength = workout.exercises.some((ex) => ex.sets && ex.reps)

      let category = "Mixed"
      if (hasCardio && !hasStrength) category = "Cardio"
      else if (hasStrength && !hasCardio) category = "Strength"

      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("progressTracking")}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t("workoutStats")}</p>
        </div>
        <Badge variant="secondary" className="text-sm md:text-base px-3 py-2 w-fit">
          <Calendar className="w-4 h-4 mr-2" />
          {completedWorkouts.length} {t("totalWorkouts")}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("totalWorkouts")}</CardTitle>
            <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">{completedWorkouts.length}</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{Math.round(completionRate)}% {t("completionRate")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("totalTime")}</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">
              {Math.round(completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 3600)}h
            </div>
            <p className="text-xs text-muted-foreground">{t("avg")}: {Math.round(completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / completedWorkouts.length / 60 || 0)} {t("minPerWorkout")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("thisWeek")}</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">{weeklyData[weeklyData.length - 1]?.workouts || 0}</div>
            <p className="text-xs text-muted-foreground">{t("workoutsThisWeek")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("avgEffort")}</CardTitle>
            <Award className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">
              {workoutLogs.length > 0
                ? Math.round((workoutLogs.reduce((sum, log) => sum + log.overallEffort, 0) / workoutLogs.length) * 10) /
                  10
                : 0}
              /10
            </div>
            <p className="text-xs text-muted-foreground">{t("perceivedEffort")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t("weeklyActivity")}</CardTitle>
            <CardDescription className="text-sm md:text-base">{t("workoutsPerWeek")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t("monthlyTrends")}</CardTitle>
            <CardDescription className="text-sm md:text-base">{t("workoutDuration")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#82ca9d" strokeWidth={2} name="Duration (min)" />
                <Line type="monotone" dataKey="effort" stroke="#ff7300" strokeWidth={2} name="Avg Effort" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Exercises */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t("topExercises")}</CardTitle>
            <CardDescription className="text-sm md:text-base">Most frequently performed exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {topExercises.length > 0 ? (
                topExercises.map((exercise, index) => (
                  <div key={exercise.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary font-medium text-xs md:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm md:text-base truncate">{exercise.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs md:text-sm text-muted-foreground">{exercise.count}x</span>
                      <div className="w-12 md:w-16 lg:w-20">
                        <Progress value={(exercise.count / topExercises[0].count) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <Dumbbell className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No exercises tracked yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workout Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Workout Categories</CardTitle>
            <CardDescription className="text-sm md:text-base">Distribution of workout types</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <Target className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm md:text-base">No workout data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
