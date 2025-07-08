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
import { ExerciseLibraryItem } from "@/lib/exercise-database"

interface ProgressDashboardProps {
  workouts: Workout[]
  workoutLogs: WorkoutLog[]
  language: "en" | "th"
  exerciseDatabase: ExerciseLibraryItem[]
}

function mapExerciseFromDB(dbExercise: any) {
  return {
    ...dbExercise,
    id: Number(dbExercise.id),
    muscleGroups: dbExercise.muscle_groups || [],
    imageUrl: dbExercise.image_url,
    estimatedDuration: dbExercise.estimated_duration,
    isCustom: dbExercise.is_custom,
    createdAt: dbExercise.created_at,
    userId: dbExercise.user_id,
  };
}

export function ProgressDashboard({ workouts, workoutLogs, language, exerciseDatabase }: ProgressDashboardProps) {
  const { t } = useTranslation(language)
  
  console.log("ProgressDashboard - received workoutLogs:", workoutLogs)
  console.log("ProgressDashboard - workoutLogs length:", workoutLogs?.length)
  console.log("ProgressDashboard - workoutLogs keys:", workoutLogs?.[0] ? Object.keys(workoutLogs[0]) : [])
  console.log("ProgressDashboard - sample workoutLog:", workoutLogs?.[0])
  console.log("ProgressDashboard - overall_effort values:", workoutLogs?.map(log => log.overall_effort))
  console.log("ProgressDashboard - overall_effort types:", workoutLogs?.map(log => typeof log.overall_effort))
  console.log("ProgressDashboard - duration values:", workoutLogs?.map(log => log.duration))
  console.log("ProgressDashboard - duration types:", workoutLogs?.map(log => typeof log.duration))

  // Calculate statistics
  const completedWorkouts = workouts ? workouts.filter((w) => w.completed) : []
  const totalWorkouts = workouts ? workouts.length : 0
  const completionRate = totalWorkouts > 0 ? Math.min((completedWorkouts.length / totalWorkouts) * 100, 100) : 0

  // Weekly data for the last 8 weeks
  const weeklyData = completedWorkouts ? Array.from({ length: 8 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i * 7)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekWorkouts = completedWorkouts.filter((w) => {
      if (!w.date) return false
      const workoutDate = new Date(w.date)
      return workoutDate >= weekStart && workoutDate <= weekEnd
    })

    return {
      week: `Week ${8 - i}`,
      workouts: weekWorkouts.length,
      duration: weekWorkouts.length > 0 ? weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 60 : 0, // in minutes
    }
  }).reverse() : []

  // Exercise frequency
  const exerciseFrequency = completedWorkouts ? completedWorkouts.reduce(
    (acc, workout) => {
      if (workout.exercises && workout.exercises.length > 0) {
        workout.exercises.forEach((exercise) => {
          const exData = exerciseDatabase.find(e => e.id === (exercise.exerciseId ?? exercise.id));
          const name = exData?.name || t('unknownExercise');
          acc[name] = (acc[name] || 0) + 1
        })
      }
      return acc
    },
    {} as Record<string, number>,
  ) : {}

  const topExercises = exerciseFrequency ? Object.entries(exerciseFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count })) : []

  // Monthly trends
  console.log("ProgressDashboard - calculating monthly data from workoutLogs:", workoutLogs?.length, "logs")
  const monthlyData = (completedWorkouts && workoutLogs) ? Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", { month: "short" })

    const monthWorkouts = completedWorkouts.filter((w) => {
      if (!w.date) return false
      const workoutDate = new Date(w.date)
      return workoutDate.getMonth() === date.getMonth() && workoutDate.getFullYear() === date.getFullYear()
    })

    const monthLogs = workoutLogs.filter((log) => {
      const completedAt = log.completedAt || (log as any).completed_at;
      if (!completedAt) return false;
      const logDate = new Date(completedAt)
      return logDate.getMonth() === date.getMonth() && logDate.getFullYear() === date.getFullYear()
    })
    
    console.log(`Month ${month} logs:`, monthLogs.map(log => ({
      id: (log as any).id ?? log?.id,
      overall_effort: log.overall_effort,
      overall_effort_type: typeof log.overall_effort,
      completedAt: log.completedAt || (log as any).completed_at
    })))
    
    const avgEffort = monthLogs.length > 0 
                      ? monthLogs.reduce((sum, log) => {
                          console.log(`Adding effort for log ${log.id}: ${log.overall_effort}, type: ${typeof log.overall_effort}`)
                          return sum + (Number(log.overall_effort) || 0)
                        }, 0) / monthLogs.length
      : 0

    console.log(`Monthly data for ${month}:`, {
      monthLogs: monthLogs.length,
      avgEffort: avgEffort,
      avgEffortType: typeof avgEffort,
      effortValue: avgEffort > 0 ? Math.round(avgEffort * 10) / 10 : 0,
      effortValueType: typeof (avgEffort > 0 ? Math.round(avgEffort * 10) / 10 : 0),
      duration: monthLogs.length > 0 ? monthLogs.reduce((sum, w) => sum + (w.duration || 0), 0) / 60 : 0,
      durationLogs: monthLogs.map(log => ({ id: (log as any).id ?? log?.id, duration: log.duration }))
    })

    return {
      month,
      workouts: monthWorkouts.length,
      duration: monthLogs.length > 0 ? monthLogs.reduce((sum, w) => sum + (w.duration || 0), 0) / 60 : 0,
      effort: avgEffort > 0 ? Math.round(avgEffort * 10) / 10 : 0,
    }
  }).reverse() : []

  console.log("ProgressDashboard - final monthlyData:", monthlyData)
  console.log("ProgressDashboard - monthlyData effort values:", monthlyData?.map(data => ({ month: data.month, effort: data.effort, effortType: typeof data.effort })))

  // Workout category distribution
  const categoryData = completedWorkouts ? completedWorkouts.reduce(
    (acc, workout) => {
      // Determine category based on exercises (simplified logic)
      const hasCardio = workout.exercises && workout.exercises.some((ex) => ex.time && ex.time > 0)
      const hasStrength = workout.exercises && workout.exercises.some((ex) => ex.sets && ex.reps)

      let category = "Mixed"
      if (hasCardio && !hasStrength) category = "Cardio"
      else if (hasStrength && !hasCardio) category = "Strength"

      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  ) : {}

  const categoryChartData = categoryData ? Object.entries(categoryData).map(([name, value]) => ({ name, value })) : []

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
          {completedWorkouts ? completedWorkouts.length : 0} {t("totalWorkouts")}
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
            <div className="text-xl md:text-2xl font-bold">{completedWorkouts ? completedWorkouts.length : 0}</div>
            <Progress value={completionRate || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{Math.round(completionRate || 0)}% {t("completionRate")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("totalTime")}</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">
              {workoutLogs && workoutLogs.length > 0 ? Math.round(workoutLogs.reduce((sum, w) => sum + (Number(w.duration) || 0), 0) / 3600) : 0}h
            </div>
            <p className="text-xs text-muted-foreground">{t("avg")}: {workoutLogs && workoutLogs.length > 0 ? Math.round(workoutLogs.reduce((sum, w) => sum + (Number(w.duration) || 0), 0) / workoutLogs.length / 60) : 0} {t("minPerWorkout")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">{t("thisWeek")}</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl md:text-2xl font-bold">{weeklyData && weeklyData.length > 0 ? (weeklyData[weeklyData.length - 1]?.workouts || 0) : 0}</div>
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
              {(() => {
                const effort = workoutLogs && workoutLogs.length > 0
                  ? (Math.round((workoutLogs.reduce((sum, log) => sum + (log.overall_effort || 0), 0) / workoutLogs.length) * 10) / 10).toFixed(1)
                  : "0.0"
                console.log("Calculated avg effort:", effort, "from", workoutLogs?.length, "logs")
                return effort
              })()}
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
              <BarChart data={weeklyData || []}>
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
              <LineChart data={monthlyData || []}>
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
              {topExercises && topExercises.length > 0 ? (
                (topExercises || []).map((exercise, index) => (
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
                        <Progress value={topExercises && topExercises[0] && topExercises[0].count > 0 ? (exercise.count / topExercises[0].count) * 100 : 0} className="h-2" />
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
            {categoryChartData && categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryChartData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(categoryChartData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
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