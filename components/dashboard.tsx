"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Dumbbell, Target, TrendingUp, Clock, Flame, Award, Plus } from "lucide-react"
import type { Workout } from "@/app/page"

interface DashboardProps {
  workouts: Workout[]
}

export function Dashboard({ workouts }: DashboardProps) {
  const today = new Date().toLocaleDateString("sv-SE") 
  const thisWeek = getThisWeekDates()
  const thisMonth = getThisMonthDates()

  const todayWorkouts = workouts.filter((w) => w.date === today)
  const weekWorkouts = workouts.filter((w) => thisWeek.includes(w.date))
  const monthWorkouts = workouts.filter((w) => thisMonth.includes(w.date))
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your fitness overview</p>
        </div>
        {/* <Button>
          <Plus className="w-4 h-4 mr-2" />
          Quick Workout
        </Button> */}
      </div>

      {/* Today's Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            {todayWorkouts.length} workout{todayWorkouts.length !== 1 ? "s" : ""} planned for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${workout.completed ? "bg-green-500" : "bg-yellow-500"}`} />
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{workout.exercises.length} exercises</p>
                    </div>
                  </div>
                  <Badge variant={workout.completed ? "default" : "secondary"}>
                    {workout.completed ? "Completed" : "Scheduled"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No workouts scheduled for today</p>
              <p className="text-sm">Plan a workout to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">All time completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisWeek}</div>
            <div className="space-y-2">
              <Progress value={(completedThisWeek / weeklyGoal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedThisWeek} of {weeklyGoal} weekly goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisMonth}</div>
            <div className="space-y-2">
              <Progress value={(completedThisMonth / monthlyGoal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedThisMonth} of {monthlyGoal} monthly goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalDuration / 60)}min</div>
            <p className="text-xs text-muted-foreground">Time spent exercising</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(workout.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {workout.duration ? `${Math.round(workout.duration / 60)}min` : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">{workout.exercises.length} exercises</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No completed workouts yet</p>
                <p className="text-sm">Complete your first workout to see it here!</p>
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
                const dayWorkouts = workouts.filter((w) => w.date === date)
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
