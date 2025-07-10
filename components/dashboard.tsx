"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Dumbbell, Target, TrendingUp, Clock, Flame, Award, Plus } from "lucide-react"
import type { Workout } from "@/app/page"
import { useTranslation } from "@/lib/i18n"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardProps {
  workouts: Workout[]
  language: "en" | "th"
}

export function Dashboard({ workouts, language }: DashboardProps) {
  const { t } = useTranslation(language)
  const today = new Date().toLocaleDateString("sv-SE") 
  const thisWeek = getThisWeekDates()
  const thisMonth = getThisMonthDates()

  const todayWorkouts = workouts.filter((w) => new Date(w.date).toLocaleDateString("sv-SE") === today)
  const weekWorkouts = workouts.filter((w) => thisWeek.includes(new Date(w.date).toLocaleDateString("sv-SE")))
  const monthWorkouts = workouts.filter((w) => thisMonth.includes(new Date(w.date).toLocaleDateString("sv-SE")))
  const completedThisWeek = weekWorkouts.filter((w) => w.completed).length
  const completedThisMonth = monthWorkouts.filter((w) => w.completed).length

  const weeklyGoal = 4 // workouts per week
  const monthlyGoal = 16 // workouts per month

  const recentWorkouts = workouts
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const totalWorkouts = workouts.filter((w) => w.completed).length
  const totalDuration = workouts.filter((w) => w.completed && w.duration).reduce((sum, w) => sum + (w.duration || 0), 0)

  function getThisWeekDates() {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date.toLocaleDateString("sv-SE") )
    }
    return dates
  }

  function getThisMonthDates() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const dates = []
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i).toLocaleDateString("sv-SE") )
    }
    return dates
  }

  const isLoading = workouts.length === 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("welcomeBack") + " " + t("fitnessOverview")}</p>
        </div>
        {/* <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t("quickWorkout")}
        </Button> */}
      </div>

      {/* Today's Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {t("todaySchedule")}
          </CardTitle>
          <CardDescription>
            {todayWorkouts.length} {t("workoutsPlanned")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : todayWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${workout.completed ? "bg-green-500" : "bg-yellow-500"}`} />
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{workout.exercises.length} {t("exercises")}</p>
                    </div>
                  </div>
                  <Badge variant={workout.completed ? "default" : "secondary"}>
                    {workout.completed ? t("completed") : t("scheduled")}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("noWorkoutsToday")}</p>
              <p className="text-sm">{t("planWorkout")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("totalWorkouts")}</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWorkouts}</div>
                <p className="text-xs text-muted-foreground">{t("allTimeCompleted")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("thisWeek")}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedThisWeek}</div>
                <div className="space-y-2">
                  <Progress value={(completedThisWeek / weeklyGoal) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completedThisWeek} {t("of")} {weeklyGoal} {t("weeklyGoal")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("thisMonth")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedThisMonth}</div>
                <div className="space-y-2">
                  <Progress value={(completedThisMonth / monthlyGoal) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completedThisMonth} {t("of")} {monthlyGoal} {t("monthlyGoal")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("totalTime")}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(totalDuration / 60)}min</div>
                <p className="text-xs text-muted-foreground">{t("timeSpentExercising")}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              {t("recentWorkouts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(workout.date).toLocaleDateString(language === "th" ? "th-TH" : "en-US")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {workout.duration ? `${Math.round(workout.duration / 60)}min` : t("nA")}
                      </p>
                      <p className="text-xs text-muted-foreground">{workout.exercises.length} {t("exercises")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("noRecentWorkouts")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thisWeek.map((date, index) => {
                const dayWorkouts = workouts.filter((w) => new Date(w.date).toLocaleDateString("sv-SE") === date)
                const completed = dayWorkouts.filter((w) => w.completed).length
                const total = dayWorkouts.length
                const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
                const isToday = date === today

                return (
                  <div key={date} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : completed > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dayName.charAt(0)}
                      </div>
                      <span className={`text-sm ${isToday ? "font-medium" : ""}`}>{dayName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {completed}/{total}
                      </span>
                      <p className="text-xs text-muted-foreground">workouts</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
