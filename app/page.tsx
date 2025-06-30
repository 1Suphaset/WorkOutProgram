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

export type Exercise = {
  id: string
  name: string
  sets?: number
  reps?: number
  time?: number // in seconds
  weight?: number
  notes?: string
}

export type Workout = {
  id: string
  date: string
  name: string
  exercises: Exercise[]
  notes?: string
  completed: boolean
  duration?: number // total workout duration in seconds
  createdAt: string
}

export type TemplateExerciseRef = {
  exerciseId: string;
  sets?: number;
  reps?: number;
  time?: number;
  weight?: number;
  notes?: string;
};

export type Template = {
  id: string;
  name: string;
  exercises: TemplateExerciseRef[];
  category: string;
  createdAt: string;
};

export type WorkoutTemplate = {
  id: string
  name: string
  category: string
  exercises: Exercise[]
}

export default function WorkoutPlannerApp() {
  const [activeView, setActiveView] = useState("dashboard")
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null)
  const [showWorkoutLogger, setShowWorkoutLogger] = useState(false)
  const [workoutToLog, setWorkoutToLog] = useState<Workout | null>(null)
  const [language, setLanguage] = useState<"en" | "th">("en")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workout-planner-workouts")
    const savedTemplates = localStorage.getItem("workout-planner-templates")
    const savedLogs = localStorage.getItem("workout-planner-logs")
    const savedLanguage = localStorage.getItem("workout-planner-language")
    const savedUser = localStorage.getItem("workout-planner-user")

    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }

    if (savedLogs) {
      setWorkoutLogs(JSON.parse(savedLogs))
    }

    if (savedLanguage) {
      setLanguage(savedLanguage as "en" | "th")
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedTemplates) {
      let shouldSetDefault = false
      if (!savedTemplates) {
        shouldSetDefault = true
      } else {
        try {
          const parsed = JSON.parse(savedTemplates)
          if (!Array.isArray(parsed) || parsed.length === 0) {
            shouldSetDefault = true
          }
        } catch {
          shouldSetDefault = true
        }
      }
      if (shouldSetDefault) {
        const defaultTemplates: Template[] = [
          // EXISTING TEMPLATES
          {
            id: "template-1",
            name: "Push Day",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "bench-press", sets: 4, reps: 8, weight: 135 },
              { exerciseId: "squats", sets: 3, reps: 10, weight: 95 },
              { exerciseId: "deadlift", sets: 3, reps: 12 },
              { exerciseId: "push-ups", sets: 2, reps: 15 },
            ],
          },
          {
            id: "template-2",
            name: "Cardio HIIT",
            category: "Cardio",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-5", sets: 4 },
              { exerciseId: "ex-6", sets: 4 },
              { exerciseId: "ex-7", sets: 4 },
              { exerciseId: "ex-8", sets: 3 },
            ],
          },
          // NEW CARDIO TEMPLATES
          {
            id: "template-3",
            name: "Jump Rope Cardio",
            category: "Cardio",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-9", sets: 5, notes: "Basic two-foot bounce" },
              { exerciseId: "ex-10", sets: 4 },
              { exerciseId: "ex-11", sets: 4, notes: "Alternate legs" },
              { exerciseId: "ex-12", sets: 3, notes: "Advanced technique" },
            ],
          },
          {
            id: "template-4",
            name: "Burpee Challenge",
            category: "Cardio",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-13", sets: 4, reps: 8, notes: "Standard form" },
              { exerciseId: "ex-14", sets: 3, reps: 12, notes: "No push-up" },
              { exerciseId: "ex-15", sets: 3, reps: 6, notes: "Jump forward after burpee" },
              { exerciseId: "ex-16", sets: 3 },
            ],
          },
          {
            id: "template-5",
            name: "Mountain Climber Blast",
            category: "Cardio",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-17", sets: 4, notes: "Fast pace" },
              { exerciseId: "ex-18", sets: 3, notes: "Knee to opposite elbow" },
              { exerciseId: "ex-19", sets: 2, notes: "Controlled movement" },
              { exerciseId: "ex-20", sets: 3 },
            ],
          },
          {
            id: "template-6",
            name: "High Knees Workout",
            category: "Cardio",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-21", sets: 5, notes: "Lift knees to hip level" },
              { exerciseId: "ex-22", sets: 3, notes: "Stationary position" },
              { exerciseId: "ex-23", sets: 4, notes: "Move forward while lifting knees" },
              { exerciseId: "ex-24", sets: 4 },
            ],
          },
          // NEW STRENGTH TEMPLATES
          {
            id: "template-7",
            name: "Push-up Power",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-25", sets: 3, reps: 12, notes: "Standard form" },
              { exerciseId: "ex-26", sets: 3, reps: 10, notes: "Hands wider than shoulders" },
              { exerciseId: "ex-27", sets: 2, reps: 8, notes: "Hands form diamond shape" },
              { exerciseId: "ex-28", sets: 2, reps: 15, notes: "Hands on elevated surface" },
            ],
          },
          {
            id: "template-8",
            name: "Squat Strength",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-29", sets: 4, reps: 15, notes: "Bodyweight squats" },
              { exerciseId: "ex-30", sets: 3, reps: 10, notes: "Explosive movement" },
              { exerciseId: "ex-31", sets: 2, reps: 6, notes: "Each leg, use support if needed" },
              { exerciseId: "ex-32", sets: 3, notes: "Back against wall" },
            ],
          },
          {
            id: "template-9",
            name: "Lunge Workout",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-33", sets: 3, reps: 12, notes: "Alternating legs" },
              { exerciseId: "ex-34", sets: 3, reps: 10, notes: "Step backward" },
              { exerciseId: "ex-35", sets: 2, reps: 8, notes: "Side to side movement" },
              { exerciseId: "ex-36", sets: 2, reps: 20, notes: "Move forward with each lunge" },
            ],
          },
          {
            id: "template-10",
            name: "Plank Challenge",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-37", sets: 3 },
              { exerciseId: "ex-38", sets: 2 },
              { exerciseId: "ex-39", sets: 3, reps: 10 },
              { exerciseId: "ex-40", sets: 2, reps: 15 },
            ],
          },
          {
            id: "template-11",
            name: "Deadlift Basics",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-41", sets: 4, reps: 10, weight: 95, notes: "Hinge at hips" },
              { exerciseId: "ex-42", sets: 3, reps: 8, notes: "Each leg, bodyweight" },
              { exerciseId: "ex-43", sets: 3, reps: 12, weight: 85, notes: "Wide stance" },
              { exerciseId: "ex-44", sets: 2, reps: 15, notes: "Bodyweight hip hinge" },
            ],
          },
          // NEW CORE TEMPLATES
          {
            id: "template-12",
            name: "Crunch Core",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-45", sets: 3, reps: 20, notes: "Basic abdominal crunches" },
              { exerciseId: "ex-46", sets: 3, reps: 15, notes: "Each side" },
              { exerciseId: "ex-47", sets: 2, reps: 15, notes: "Lift hips off ground" },
              { exerciseId: "ex-48", sets: 2 },
            ],
          },
          {
            id: "template-13",
            name: "Russian Twist Core",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-49", sets: 4, reps: 20, notes: "Rotate side to side" },
              { exerciseId: "ex-50", sets: 3, reps: 16, notes: "Hold weight or water bottle" },
              { exerciseId: "ex-51", sets: 2 },
              { exerciseId: "ex-52", sets: 2, reps: 12 },
            ],
          },
          {
            id: "template-14",
            name: "Leg Raise Core",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-53", sets: 3, reps: 12 },
              { exerciseId: "ex-54", sets: 3, reps: 15 },
              { exerciseId: "ex-55", sets: 2, reps: 10 },
              { exerciseId: "ex-56", sets: 3 },
            ],
          },
          {
            id: "template-15",
            name: "Flutter Kick Core",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-57", sets: 4 },
              { exerciseId: "ex-58", sets: 3 },
              { exerciseId: "ex-59", sets: 2, reps: 15 },
              { exerciseId: "ex-60", sets: 2 },
            ],
          },
          // NEW FLEXIBILITY TEMPLATES
          {
            id: "template-16",
            name: "Hamstring Stretch",
            category: "Flexibility",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-61", sets: 2 },
              { exerciseId: "ex-62", sets: 2 },
              { exerciseId: "ex-63", sets: 2 },
              { exerciseId: "ex-64", sets: 1 },
            ],
          },
          {
            id: "template-17",
            name: "Child's Pose Flow",
            category: "Flexibility",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-65", sets: 3 },
              { exerciseId: "ex-66", sets: 2 },
              { exerciseId: "ex-67", sets: 2 },
              { exerciseId: "ex-68", sets: 2 },
            ],
          },
          {
            id: "template-18",
            name: "Cobra Stretch",
            category: "Flexibility",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-69", sets: 2 },
              { exerciseId: "ex-70", sets: 3 },
              { exerciseId: "ex-71", sets: 2 },
              { exerciseId: "ex-72", sets: 2 },
            ],
          },
          // NEW UPPER BODY & ABS TEMPLATES
          {
            id: "template-19",
            name: "Upper Body Blast",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-73", sets: 3 },
              { exerciseId: "ex-74", sets: 3 },
              { exerciseId: "ex-75", sets: 3 },
              { exerciseId: "ex-76", sets: 2 },
            ],
          },
          {
            id: "template-20",
            name: "Core Crusher",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-77", sets: 3 },
              { exerciseId: "ex-78", sets: 3 },
              { exerciseId: "ex-79", sets: 3 },
              { exerciseId: "ex-80", sets: 2 },
            ],
          },
          {
            id: "template-21",
            name: "Quick Abs Burn",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-81", sets: 4 },
              { exerciseId: "ex-82", sets: 3 },
              { exerciseId: "ex-83", sets: 3 },
              { exerciseId: "ex-84", sets: 3 },
            ],
          },
          {
            id: "template-22",
            name: "Bodyweight Strength",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-85", sets: 3 },
              { exerciseId: "ex-86", sets: 3 },
              { exerciseId: "ex-87", sets: 3 },
              { exerciseId: "ex-88", sets: 3 },
            ],
          },
          {
            id: "template-23",
            name: "Upper Pump Express",
            category: "Strength",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-89", sets: 4 },
              { exerciseId: "ex-90", sets: 3 },
              { exerciseId: "ex-91", sets: 3 },
              { exerciseId: "ex-92", sets: 3 },
            ],
          },
          {
            id: "template-24",
            name: "Abs & Core Finisher",
            category: "Core",
            createdAt: new Date().toISOString(),
            exercises: [
              { exerciseId: "ex-93", sets: 3 },
              { exerciseId: "ex-94", sets: 3 },
              { exerciseId: "ex-95", sets: 3 },
              { exerciseId: "ex-96", sets: 2 },
            ],
          },
        ]
        setTemplates(defaultTemplates)
        localStorage.setItem("workout-planner-templates", JSON.stringify(defaultTemplates))
      } else {
        setTemplates(JSON.parse(savedTemplates))
      }
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workout-planner-workouts", JSON.stringify(workouts))
  }, [workouts])

  useEffect(() => {
    localStorage.setItem("workout-planner-templates", JSON.stringify(templates))
  }, [templates])

  useEffect(() => {
    localStorage.setItem("workout-planner-logs", JSON.stringify(workoutLogs))
  }, [workoutLogs])

  useEffect(() => {
    localStorage.setItem("workout-planner-language", language)
  }, [language])

  useEffect(() => {
    if (user) {
      localStorage.setItem("workout-planner-user", JSON.stringify(user))
    }
  }, [user])

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout])
  }

  const updateWorkout = (workoutId: string, updatedWorkout: Partial<Workout>) => {
    setWorkouts((prev) => prev.map((w) => (w.id === workoutId ? { ...w, ...updatedWorkout } : w)))
  }

  const deleteWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId))
  }

  const addTemplate = (template: Template) => {
    setTemplates((prev) => [...prev, template])
  }

  const updateTemplate = (templateId: string, updatedTemplate: Partial<Template>) => {
    setTemplates((prev) => prev.map((t) => (t.id === templateId ? { ...t, ...updatedTemplate } : t)))
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const handleWorkoutComplete = (workout: Workout) => {
    setWorkoutToLog(workout)
    setShowWorkoutLogger(true)
    setActiveWorkout(null)
  }

  const handleWorkoutLogged = (logData: WorkoutLog) => {
    setWorkoutLogs((prev) => [...prev, logData])
    updateWorkout(logData.workoutId, { completed: true, duration: logData.duration })
    setShowWorkoutLogger(false)
    setWorkoutToLog(null)
  }

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("workout-planner-user")
  }

  const handleAddExerciseFromDragDrop = (exercise: any) => {
    // Create a new workout with the dragged exercise
    const newWorkout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate.toLocaleDateString("sv-SE") ,
      name: `${exercise.name} Workout`,
      exercises: [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: exercise.name,
          sets: exercise.sets || 3,
          reps: exercise.reps,
          time: exercise.duration,
        },
      ],
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

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard workouts={workouts} />
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
          />
        )
      case "progress":
        return <ProgressDashboard workouts={workouts} workoutLogs={workoutLogs} language={language} />
      case "settings":
        return (
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <SettingsComponent />
            <NotificationSettings language={language} />
          </div>
        )
      case "library":
        return <ExerciseLibrary />
      default:
        return <Dashboard workouts={workouts} />
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
