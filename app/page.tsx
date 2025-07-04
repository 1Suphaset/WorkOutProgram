"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { CalendarView } from "@/components/calendar-view"
import { Templates } from "@/components/templates"
import { Settings as SettingsComponent } from "@/components/settings"
import { WorkoutTimer } from "@/components/workout-timer"
import { ThemeProvider } from "@/components/theme-provider"
import { ExerciseLibrary } from "@/components/exercise-library"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { WorkoutLogger, type WorkoutLog } from "@/components/workout-logger"
import { LoginForm } from "@/components/auth/login-form"
import { PWAInstallBanner } from "@/components/pwa-install-banner"
import { DailyNotes } from "@/components/daily-notes"
import { DragDropPlanner } from "@/components/drag-drop-planner"
import { NotificationSettings } from "@/components/notification-settings"
import { Home, CalendarIcon, Dumbbell, BarChart3,BookOpen, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exerciseDatabase } from "@/lib/exercise-database"
import { jwtDecode } from "jwt-decode"

export type Exercise = {
  id: number
  exerciseId: number
  sets?: number
  reps?: number
  time?: number // in seconds
  weight?: number
  notes?: string
}

export type Workout = {
  id: number
  date: string
  name: string
  exercises: Exercise[]
  notes?: string
  completed: boolean
  duration?: number // total workout duration in seconds
  createdAt: string
}

export type TemplateExerciseRef = {
  exerciseId: number;
  sets?: number;
  reps?: number;
  time?: number;
  weight?: number;
  notes?: string;
};

export type Template = {
  id: number;
  name: string;
  exercises: TemplateExerciseRef[];
  category: string;
  createdAt: string;
};

export type WorkoutTemplate = {
  id: number
  name: string
  category: string
  exercises: Exercise[]
}

export default function WorkoutPlannerApp() {
  const [activeView, setActiveView] = useState<string>("dashboard")
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [showWorkoutLogger, setShowWorkoutLogger] = useState(false)
  const [workoutToLog, setWorkoutToLog] = useState<Workout | null>(null)
  const [language, setLanguage] = useState<"en" | "th">("en")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-login: เช็ค token อัตโนมัติ
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        // เช็ควันหมดอายุ (exp)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem("token")
          setUser(null)
        } else {
          setUser({ name: decoded.name, email: decoded.email })
        }
      } catch {
        localStorage.removeItem("token")
        setUser(null)
      }
    }
  }, [])

  // ดึงข้อมูลจาก API เมื่อ user login
  const fetchData = () => {
    if (!user) return;
    setLoading(true);
    console.log("[GET] userEmail:", user.email);
    Promise.all([
      fetch(`/api/workouts?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
      fetch(`/api/templates?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
      fetch(`/api/workout-logs?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
    ]).then(([w, t, l]) => {
      console.log("[GET] workouts from API:", w.workouts);
      setWorkouts(w.workouts || [])
      setTemplates(t.templates || [])
      setWorkoutLogs(l.workoutLogs || [])
    }).finally(() => setLoading(false))
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
    // ไม่มี setInterval อีกต่อไป
  }, [user])

  // เพิ่ม workout
  const addWorkout = async (workout: Workout) => {
    if (!user) return;
    console.log("[POST] userEmail:", user.email);
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...workout, userEmail: user.email }),
    })
    const data = await res.json()
    // แปลง date เป็น 'sv-SE' format ก่อน setWorkouts
    const fixedWorkout = {
      ...data.workout,
      date: new Date(data.workout.date).toLocaleDateString("sv-SE"),
    }
    setWorkouts(prev => [fixedWorkout, ...prev])
  }

  // แก้ไข workout
  const updateWorkout = async (workoutId: number, updatedWorkout: Partial<Workout>) => {
    const workout = workouts.find(w => Number(w.id) === Number(workoutId))
    if (!workout || !user) return
    const res = await fetch("/api/workouts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...workout, ...updatedWorkout, id: Number(workoutId), userEmail: user.email }),
    })
    const data = await res.json()
    console.log("[PUT] updateWorkout response:", data)
    // แปลง date เป็น 'sv-SE' format ก่อน setWorkouts
    const fixedWorkout = {
      ...data.workout,
      date: new Date(data.workout.date).toLocaleDateString("sv-SE"),
    }
    setWorkouts(prev => prev.map(w => Number(w.id) === Number(workoutId) ? fixedWorkout : w))
  }

  // ลบ workout
  const deleteWorkout = async (workoutId: number) => {
    if (!user) return;
    await fetch("/api/workouts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: workoutId, userEmail: user.email }),
    })
    setWorkouts(prev => prev.filter(w => w.id !== workoutId))
  }

  // เพิ่ม template
  const addTemplate = async (template: Template) => {
    if (!user) return;
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...template, userEmail: user.email }),
    })
    const data = await res.json()
    setTemplates(prev => [data.template, ...prev])
  }

  // แก้ไข template
  const updateTemplate = async (templateId: number, updatedTemplate: Partial<Template>) => {
    console.log("updateTemplate called", templateId, updatedTemplate)
    const template = templates.find(t => Number(t.id) === Number(templateId))
    if (!template) {
      console.log("Template not found for id", templateId, templates.map(t => t.id))
      return
    }
    const res = await fetch("/api/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...template, ...updatedTemplate }),
    })
    const data = await res.json()
    setTemplates(prev => prev.map(t => Number(t.id) === Number(templateId) ? data.template : t))
  }

  // ลบ template
  const deleteTemplate = async (templateId: number) => {
    await fetch("/api/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: templateId }),
    })
    setTemplates(prev => prev.filter(t => Number(t.id) !== Number(templateId)))
  }

  // เพิ่ม workout log
  const addWorkoutLog = async (logData: WorkoutLog) => {
    if (!user) return;
    const res = await fetch("/api/workout-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...logData, userEmail: user.email }),
    })
    const data = await res.json()
    setWorkoutLogs(prev => [data.workoutLog, ...prev])
  }

  const handleWorkoutComplete = (workout: Workout) => {
    setWorkoutToLog(workout)
    setShowWorkoutLogger(true)
    setActiveWorkout(null)
  }

  const handleWorkoutLogged = async (logData: WorkoutLog) => {
    await addWorkoutLog(logData)
    await updateWorkout(Number(logData.workoutId), { completed: true, duration: Number(logData.duration) })
    if (user) fetchData(); // refresh ข้อมูลหลัง finish workout
    setShowWorkoutLogger(false)
    setWorkoutToLog(null)
  }

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const handleAddExerciseFromDragDrop = (exercise: any) => {
    // Create a new workout with the dragged exercise
    const newWorkout: Workout = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      date: selectedDate.toLocaleDateString("sv-SE") ,
      name: `${exercise.name} Workout`,
      exercises: [
        {
          id: Date.now() + Math.floor(Math.random() * 10000),
          exerciseId: exercise.id,
          // สามารถเพิ่ม sets/reps/notes ตามต้องการ
        }
      ],
      notes: "",
      completed: false,
      createdAt: new Date().toISOString(),
    }
    addWorkout(newWorkout)
  }

  // Show login form if user is not authenticated
  if (!user) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="workout-planner-theme">
        <LoginForm onLogin={handleLogin} language={language} />
      </ThemeProvider>
    )
  }

  // สร้าง mergedDatabase ที่รวม exerciseDatabase กับ exerciseId ที่อ้างถึงใน templates แต่ไม่มีใน database
  const allExerciseIds = templates.flatMap(tpl => tpl.exercises.map(ex => Number(ex.exerciseId)))
  const missingIds = allExerciseIds.filter(id => !exerciseDatabase.some(e => e.id === id))
  const newExercises = missingIds.map((id: number) => ({
    id,
    name: 'Unknown Exercise',
    category: 'Strength' as const,
    muscleGroups: [],
    difficulty: 'Beginner' as const,
    equipment: '',
    description: '',
    instructions: [],
    imageUrl: '',
    estimatedDuration: 1,
    isCustom: true,
    createdAt: new Date().toISOString(),
  }))
  const mergedDatabase = [...exerciseDatabase, ...newExercises]

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard workouts={workouts} language={language} />
      case "calendar":
        return (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
              <div className="2xl:col-span-4">
                <CalendarView
                  workouts={workouts}
                  templates={templates}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  addWorkout={addWorkout}
                  updateWorkout={updateWorkout}
                  deleteWorkout={deleteWorkout}
                  setActiveWorkout={setActiveWorkout}
                  exerciseDatabase={mergedDatabase}
                />
              </div>
              <div className="2xl:col-span-4 space-y-4 md:space-y-6">
                <DailyNotes selectedDate={selectedDate} language={language} />
                <DragDropPlanner
                  selectedDate={selectedDate}
                  language={language}
                  onAddExercise={handleAddExerciseFromDragDrop}
                />
              </div>
            </div>
          </div>
        )
      case "templates":
        return (
          <Templates
            templates={templates}
            addTemplate={addTemplate}
            updateTemplate={updateTemplate}
            deleteTemplate={deleteTemplate}
            exerciseDatabase={mergedDatabase}
            language={language}
            isLoading={loading}
          />
        )
      case "progress":
        return <ProgressDashboard workouts={workouts} workoutLogs={workoutLogs} language={language} />
      case "settings":
        return (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <SettingsComponent language={language} />
            <NotificationSettings language={language} />
          </div>
        )
      case "library":
        return <ExerciseLibrary exerciseDatabase={mergedDatabase} language={language} />
      default:
        return <Dashboard workouts={workouts} language={language} />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="workout-planner-theme">
      <div className="flex h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            language={language}
            onLanguageChange={setLanguage}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="flex justify-around py-2 px-2">
            {[
              { id: "dashboard", icon: Home },
              { id: "calendar", icon: CalendarIcon },
              { id: "templates", icon: Dumbbell },
              { id: "library", icon: BookOpen },
              { id: "progress", icon: BarChart3 },
              { id: "settings", icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(item.id)}
                  className="flex-col h-auto py-2 px-2 min-w-0 flex-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs mt-1 truncate">{item.id}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="min-h-full">{renderActiveView()}</div>
        </main>

        {activeWorkout && (
          <WorkoutTimer
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onComplete={() => handleWorkoutComplete(activeWorkout)}
            language={language}
          />
        )}

        {showWorkoutLogger && workoutToLog && (
          <WorkoutLogger
            workout={workoutToLog}
            isOpen={showWorkoutLogger}
            onClose={() => setShowWorkoutLogger(false)}
            onComplete={handleWorkoutLogged}
            language={language}
          />
        )}

        <PWAInstallBanner language={language} />
      </div>
    </ThemeProvider>
  )
}
