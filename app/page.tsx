"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { CalendarView } from "@/components/calendar-view"
import { Templates } from "@/components/templates"
import type { WorkoutTemplate } from "@/lib/workout-templates"
import { Settings as SettingsComponent } from "@/components/settings"
import { WorkoutTimer } from "@/components/workout-timer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ExerciseLibrary } from "@/components/exercise-library"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { WorkoutLogger, type WorkoutLog } from "@/components/workout-logger"
import { LoginForm } from "@/components/auth/login-form"
import { PWAInstallBanner } from "@/components/pwa-install-banner"
import { DailyNotes } from "@/components/daily-notes"
import { DragDropPlanner } from "@/components/drag-drop-planner"
import { NotificationSettings } from "@/components/notification-settings"
import { Logo } from "@/components/ui/logo"
import { Home, CalendarIcon, Dumbbell, BarChart3,BookOpen, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode"

interface Exercise {
  id: number;
  name: string;
  category: string;
  sets?: number;
  reps?: number;
  duration?: number;
  notes?: string;
  weight?: number;
  time?: number;
  exerciseId?: String;
}
interface Workout {
  id: number;
  name: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
  createdAt: string;
  duration?: number;
  notes?: string;
}

function mapExerciseFromDB(dbExercise: unknown): Exercise {
  return dbExercise as Exercise;
}

export default function WorkoutPlannerApp() {
  const [activeView, setActiveView] = useState<string>("dashboard")
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [showWorkoutLogger, setShowWorkoutLogger] = useState(false)
  const [workoutToLog, setWorkoutToLog] = useState<Workout | null>(null)
  const [language, setLanguage] = useState<"en" | "th">("en")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [exerciseDatabase, setExerciseDatabase] = useState<Exercise[]>([])

  // Auto-login: เช็ค token อัตโนมัติ
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      try {
        const decoded = jwtDecode(token) as { exp?: number; name?: string; email?: string };
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem("token")
          setUser(null)
        } else {
          // ดึงข้อมูล user จาก API เพื่อให้ชื่อใหม่อัปเดต
          fetch("/api/user", {
            headers: { "Authorization": `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              if (data.user) {
                setUser({ name: data.user.name, email: data.user.email })
              } else {
                setUser({ name: decoded.name ?? "", email: decoded.email ?? "" })
              }
            })
            .catch(() => {
              setUser({ name: decoded.name ?? "", email: decoded.email ?? "" })
            })
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
    Promise.all([
      fetch(`/api/workouts?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
      fetch(`/api/templates?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
      fetch(`/api/workout-logs?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
      fetch(`/api/exercises?user=${encodeURIComponent(user.email)}`).then(res => res.json()),
    ]).then(([w, t, l, e]) => {
      setWorkouts(w.workouts || [])
      setTemplates((t.templates || []).map((tpl: any) => ({
        ...tpl,
        nameTranslations: tpl.nameTranslations || { th: tpl.name },
        type: tpl.type || tpl.category || "Strength",
        duration: tpl.duration || 30,
        difficulty: tpl.difficulty || "Beginner",
        description: tpl.description || "",
        descriptionTranslations: tpl.descriptionTranslations || { th: tpl.description || "" },
        equipment: tpl.equipment || [],
        targetMuscles: tpl.targetMuscles || [],
        calories: tpl.calories || 0,
        tags: tpl.tags || [],
        exercises: (tpl.exercises || []).map((ex: any) => ({
          ...ex,
          id: Number(ex.id),
          nameTranslations: ex.nameTranslations || { th: ex.name },
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          rest: ex.rest,
          instructions: ex.instructions || "",
          instructionsTranslations: ex.instructionsTranslations || { th: ex.instructions || "" },
        })),
      })));
      setWorkoutLogs(l.workoutLogs || [])
      setExerciseDatabase((e.exercises || []).map(mapExerciseFromDB))
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
  const addTemplate = async (template: WorkoutTemplate) => {
    if (!user) return;
    // Ensure all required fields for WorkoutTemplate are present
    const fullTemplate: WorkoutTemplate = {
      ...template,
      nameTranslations: template.nameTranslations || { th: template.name },
      type: template.type ,
      duration: template.duration || 30,
      difficulty: template.difficulty || "Beginner",
      description: template.description || "",
      descriptionTranslations: template.descriptionTranslations || { th: template.description || "" },
      equipment: template.equipment || [],
      targetMuscles: template.targetMuscles || [],
      calories: template.calories || 0,
      tags: template.tags || [],
      exercises: (template.exercises || []).map((ex: any) => ({
        ...ex,
        id: Number(ex.id),
        nameTranslations: ex.nameTranslations || { th: ex.name },
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        rest: ex.rest,
        instructions: ex.instructions || "",
        instructionsTranslations: ex.instructionsTranslations || { th: ex.instructions || "" },
      })),
    };
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fullTemplate, userEmail: user.email }),
    })
    const data = await res.json()
    setTemplates(prev => [data.template, ...prev])
  }

  // แก้ไข template
  const updateTemplate = async (templateId: number, updatedTemplate: Partial<WorkoutTemplate>) => {
    const template = templates.find(t => Number(t.id) === Number(templateId))
    if (!template) return;
    const fullTemplate: WorkoutTemplate = {
      ...template,
      ...updatedTemplate,
      nameTranslations: updatedTemplate.nameTranslations || template.nameTranslations || { th: template.name },
      type: updatedTemplate.type || template.type,
      duration: updatedTemplate.duration || template.duration || 30,
      difficulty: updatedTemplate.difficulty || template.difficulty || "Beginner",
      description: updatedTemplate.description || template.description || "",
      descriptionTranslations: updatedTemplate.descriptionTranslations || template.descriptionTranslations || { th: template.description || "" },
      equipment: updatedTemplate.equipment || template.equipment || [],
      targetMuscles: updatedTemplate.targetMuscles || template.targetMuscles || [],
      calories: updatedTemplate.calories || template.calories || 0,
      tags: updatedTemplate.tags || template.tags || [],
      exercises: (updatedTemplate.exercises || template.exercises || []).map((ex: any) => ({
        ...ex,
        id: Number(ex.id),
        nameTranslations: ex.nameTranslations || { th: ex.name },
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        rest: ex.rest,
        instructions: ex.instructions || "",
        instructionsTranslations: ex.instructionsTranslations || { th: ex.instructions || "" },
      })),
    };
    const res = await fetch("/api/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullTemplate),
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
    console.log("Adding workout log to API:", { ...logData, userEmail: user.email })
    const res = await fetch("/api/workout-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...logData, userEmail: user.email }),
    })
    const data = await res.json()
    console.log("API response:", data)
    setWorkoutLogs(prev => [data.workoutLog, ...prev])
  }

  const handleWorkoutComplete = (workout: Workout, duration?: number) => {
    console.log("handleWorkoutComplete - duration from timer:", duration)
    setWorkoutToLog({ ...workout, duration })
    setShowWorkoutLogger(true)
    setActiveWorkout(null)
  }

  const handleWorkoutLogged = async (logData: WorkoutLog) => {
    console.log("Workout logged:", logData)
    console.log("Overall effort:", logData.overall_effort)
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

  const handleAddExerciseFromDragDrop = (exercise: unknown) => {
  const ex = exercise as Exercise;
    console.log(ex)
  const workoutExercise = {
    id: Number(ex.exerciseId ?? ex.id),
    name: ex.name,
    reps: ex.reps ?? 10,
    sets: ex.sets ?? 3,
    notes: ex.notes ?? "",
    category: ex.category,
    duration: ex.duration ?? 60, // default 60 วินาที
    exerciseId: String(ex.exerciseId ?? ex.id),
  };
  const newWorkout: Workout = {
    id: Date.now(),
    date: selectedDate.toLocaleDateString("sv-SE"),
    name: `${ex.name} Workout`,
    exercises: [workoutExercise],
    completed: false,
    createdAt: new Date().toISOString(),
  };

  addWorkout(newWorkout);
};


  // Show login form if user is not authenticated
  if (!user) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="workout-planner-theme">
        <LoginForm onLogin={handleLogin} language={language} />
      </ThemeProvider>
    )
  }

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
                  exerciseDatabase={exerciseDatabase}
                  language={language}
                  userEmail={user?.email}
                />
              </div>
              <div className="2xl:col-span-4 space-y-4 md:space-y-6">
                <DragDropPlanner
                  selectedDate={selectedDate}
                  language={language}
                  onAddExercise={handleAddExerciseFromDragDrop}
                  exerciseDatabase={exerciseDatabase}
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
            exerciseDatabase={exerciseDatabase}
            language={language}
            isLoading={loading}
          />
        )
      case "progress":
        return <ProgressDashboard workouts={workouts} workoutLogs={workoutLogs} language={language} exerciseDatabase={exerciseDatabase} />
      case "settings":
        return (
          <div>
            <SettingsComponent language={language} user={user} onLogout={handleLogout} />
            <NotificationSettings language={language} />
          </div>
        )
      case "library":
        return <ExerciseLibrary exerciseDatabase={exerciseDatabase} language={language} />
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
          {/* Mobile Header - Fixed */}
          <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-50">
            <Logo size={32} />
          </div>
          {/* Add padding to account for fixed header */}
          <div className="md:hidden pt-16">
            <div className="min-h-full">{renderActiveView()}</div>
          </div>
          {/* Desktop content */}
          <div className="hidden md:block">
            <div className="min-h-full">{renderActiveView()}</div>
          </div>
        </main>

        {activeWorkout && (
          <WorkoutTimer
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onComplete={(duration) => handleWorkoutComplete(activeWorkout, duration)}
            language={language}
            exerciseDatabase={exerciseDatabase}
          />
        )}

        {showWorkoutLogger && workoutToLog && (
          <WorkoutLogger
            workout={workoutToLog}
            isOpen={showWorkoutLogger}
            onClose={() => setShowWorkoutLogger(false)}
            onComplete={handleWorkoutLogged}
            language={language}
            exerciseDatabase={exerciseDatabase}
          />
        )}

        <PWAInstallBanner language={language} />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
