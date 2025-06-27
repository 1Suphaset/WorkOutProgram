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

export type Template = {
  id: string
  name: string
  exercises: Exercise[]
  category: string
  createdAt: string
}

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
    const savedLogs = localStorage.getItem("workout-logs")
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
      setTemplates(JSON.parse(savedTemplates))
    } else {
      // Initialize with default templates
      const defaultTemplates: Template[] = [
        // EXISTING TEMPLATES
        {
          id: "template-1",
          name: "Push Day",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-1", name: "Bench Press", sets: 4, reps: 8, weight: 135 },
            { id: "ex-2", name: "Overhead Press", sets: 3, reps: 10, weight: 95 },
            { id: "ex-3", name: "Dips", sets: 3, reps: 12 },
            { id: "ex-4", name: "Push-ups", sets: 2, reps: 15 },
          ],
        },
        {
          id: "template-2",
          name: "Cardio HIIT",
          category: "Cardio",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-5", name: "Jumping Jacks", time: 30, sets: 4 },
            { id: "ex-6", name: "Burpees", time: 20, sets: 4 },
            { id: "ex-7", name: "Mountain Climbers", time: 30, sets: 4 },
            { id: "ex-8", name: "Rest", time: 60, sets: 3 },
          ],
        },
        // NEW CARDIO TEMPLATES
        {
          id: "template-3",
          name: "Jump Rope Cardio",
          category: "Cardio",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-9", name: "Jump Rope", time: 60, sets: 5, notes: "Basic two-foot bounce" },
            { id: "ex-10", name: "Rest", time: 30, sets: 4 },
            { id: "ex-11", name: "Jump Rope - Single Leg", time: 30, sets: 4, notes: "Alternate legs" },
            { id: "ex-12", name: "Jump Rope - Double Unders", time: 20, sets: 3, notes: "Advanced technique" },
          ],
        },
        {
          id: "template-4",
          name: "Burpee Challenge",
          category: "Cardio",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-13", name: "Burpees", sets: 4, reps: 8, notes: "Standard form" },
            { id: "ex-14", name: "Half Burpees", sets: 3, reps: 12, notes: "No push-up" },
            { id: "ex-15", name: "Burpee Broad Jumps", sets: 3, reps: 6, notes: "Jump forward after burpee" },
            { id: "ex-16", name: "Rest", time: 90, sets: 3 },
          ],
        },
        {
          id: "template-5",
          name: "Mountain Climber Blast",
          category: "Cardio",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-17", name: "Mountain Climbers", time: 45, sets: 4, notes: "Fast pace" },
            { id: "ex-18", name: "Cross-Body Mountain Climbers", time: 30, sets: 3, notes: "Knee to opposite elbow" },
            { id: "ex-19", name: "Slow Mountain Climbers", time: 60, sets: 2, notes: "Controlled movement" },
            { id: "ex-20", name: "Rest", time: 45, sets: 3 },
          ],
        },
        {
          id: "template-6",
          name: "High Knees Workout",
          category: "Cardio",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-21", name: "High Knees", time: 30, sets: 5, notes: "Lift knees to hip level" },
            { id: "ex-22", name: "High Knees - In Place", time: 45, sets: 3, notes: "Stationary position" },
            { id: "ex-23", name: "High Knees - Forward", time: 20, sets: 4, notes: "Move forward while lifting knees" },
            { id: "ex-24", name: "Rest", time: 30, sets: 4 },
          ],
        },
        // NEW STRENGTH TEMPLATES
        {
          id: "template-7",
          name: "Push-up Power",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-25", name: "Push-ups", sets: 3, reps: 12, notes: "Standard form" },
            { id: "ex-26", name: "Wide-Grip Push-ups", sets: 3, reps: 10, notes: "Hands wider than shoulders" },
            { id: "ex-27", name: "Diamond Push-ups", sets: 2, reps: 8, notes: "Hands form diamond shape" },
            { id: "ex-28", name: "Incline Push-ups", sets: 2, reps: 15, notes: "Hands on elevated surface" },
          ],
        },
        {
          id: "template-8",
          name: "Squat Strength",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-29", name: "Squats", sets: 4, reps: 15, notes: "Bodyweight squats" },
            { id: "ex-30", name: "Jump Squats", sets: 3, reps: 10, notes: "Explosive movement" },
            { id: "ex-31", name: "Single-Leg Squats", sets: 2, reps: 6, notes: "Each leg, use support if needed" },
            { id: "ex-32", name: "Wall Sit", time: 45, sets: 3, notes: "Back against wall" },
          ],
        },
        {
          id: "template-9",
          name: "Lunge Workout",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-33", name: "Lunges", sets: 3, reps: 12, notes: "Alternating legs" },
            { id: "ex-34", name: "Reverse Lunges", sets: 3, reps: 10, notes: "Step backward" },
            { id: "ex-35", name: "Lateral Lunges", sets: 2, reps: 8, notes: "Side to side movement" },
            { id: "ex-36", name: "Walking Lunges", sets: 2, reps: 20, notes: "Move forward with each lunge" },
          ],
        },
        {
          id: "template-10",
          name: "Plank Challenge",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-37", name: "Plank", time: 60, sets: 3, notes: "Hold position" },
            { id: "ex-38", name: "Side Plank", time: 30, sets: 2, notes: "Each side" },
            { id: "ex-39", name: "Plank Up-Downs", sets: 3, reps: 10, notes: "From plank to forearm plank" },
            { id: "ex-40", name: "Plank Jacks", sets: 2, reps: 15, notes: "Jump feet apart and together" },
          ],
        },
        {
          id: "template-11",
          name: "Deadlift Basics",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-41", name: "Romanian Deadlifts", sets: 4, reps: 10, weight: 95, notes: "Hinge at hips" },
            { id: "ex-42", name: "Single-Leg Deadlifts", sets: 3, reps: 8, notes: "Each leg, bodyweight" },
            { id: "ex-43", name: "Sumo Deadlifts", sets: 3, reps: 12, weight: 85, notes: "Wide stance" },
            { id: "ex-44", name: "Good Mornings", sets: 2, reps: 15, notes: "Bodyweight hip hinge" },
          ],
        },
        // NEW CORE TEMPLATES
        {
          id: "template-12",
          name: "Crunch Core",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-45", name: "Crunches", sets: 3, reps: 20, notes: "Basic abdominal crunches" },
            { id: "ex-46", name: "Bicycle Crunches", sets: 3, reps: 15, notes: "Each side" },
            { id: "ex-47", name: "Reverse Crunches", sets: 2, reps: 15, notes: "Lift hips off ground" },
            { id: "ex-48", name: "Crunch Hold", time: 30, sets: 2, notes: "Hold at top of crunch" },
          ],
        },
        {
          id: "template-13",
          name: "Russian Twist Core",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-49", name: "Russian Twists", sets: 4, reps: 20, notes: "Rotate side to side" },
            { id: "ex-50", name: "Weighted Russian Twists", sets: 3, reps: 16, notes: "Hold weight or water bottle" },
            { id: "ex-51", name: "Russian Twist Hold", time: 45, sets: 2, notes: "Hold twisted position" },
            { id: "ex-52", name: "Oblique Crunches", sets: 2, reps: 12, notes: "Each side" },
          ],
        },
        {
          id: "template-14",
          name: "Leg Raise Core",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-53", name: "Leg Raises", sets: 3, reps: 12, notes: "Straight legs up and down" },
            { id: "ex-54", name: "Bent-Knee Leg Raises", sets: 3, reps: 15, notes: "Knees bent to chest" },
            { id: "ex-55", name: "Single-Leg Raises", sets: 2, reps: 10, notes: "Each leg" },
            { id: "ex-56", name: "Leg Raise Hold", time: 20, sets: 3, notes: "Hold legs at 45 degrees" },
          ],
        },
        {
          id: "template-15",
          name: "Flutter Kick Core",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-57", name: "Flutter Kicks", time: 30, sets: 4, notes: "Small alternating leg movements" },
            { id: "ex-58", name: "Scissor Kicks", time: 25, sets: 3, notes: "Cross legs over each other" },
            { id: "ex-59", name: "Vertical Leg Crunches", sets: 2, reps: 15, notes: "Legs straight up" },
            { id: "ex-60", name: "Dead Bug", sets: 2, reps: 10, notes: "Each side, opposite arm and leg" },
          ],
        },
        // NEW FLEXIBILITY TEMPLATES
        {
          id: "template-16",
          name: "Hamstring Stretch",
          category: "Flexibility",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-61", name: "Standing Hamstring Stretch", time: 30, sets: 2, notes: "Each leg, heel elevated" },
            { id: "ex-62", name: "Seated Forward Fold", time: 45, sets: 2, notes: "Reach toward toes" },
            { id: "ex-63", name: "Lying Hamstring Stretch", time: 30, sets: 2, notes: "Each leg, use towel if needed" },
            { id: "ex-64", name: "Walking Hamstring Stretch", sets: 1, reps: 10, notes: "Dynamic leg swings" },
          ],
        },
        {
          id: "template-17",
          name: "Child's Pose Flow",
          category: "Flexibility",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-65", name: "Child's Pose", time: 60, sets: 3, notes: "Kneel and sit back on heels" },
            { id: "ex-66", name: "Cat-Cow Stretch", sets: 2, reps: 10, notes: "Arch and round spine" },
            { id: "ex-67", name: "Extended Child's Pose", time: 45, sets: 2, notes: "Reach arms to each side" },
            { id: "ex-68", name: "Thread the Needle", sets: 2, reps: 8, notes: "Each side, spinal rotation" },
          ],
        },
        {
          id: "template-18",
          name: "Cobra Stretch",
          category: "Flexibility",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-69", name: "Sphinx Pose", time: 45, sets: 2, notes: "Forearms on ground" },
            { id: "ex-70", name: "Low Cobra", time: 30, sets: 3, notes: "Gentle backbend" },
            { id: "ex-71", name: "Full Cobra", time: 20, sets: 2, notes: "Deeper backbend, listen to body" },
            { id: "ex-72", name: "Upward Facing Dog", time: 15, sets: 2, notes: "Advanced backbend" },
          ],
        },
        // NEW UPPER BODY & ABS TEMPLATES
        {
          id: "template-19",
          name: "Upper Body Blast",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-73", name: "Push-ups", sets: 3, reps: 12, notes: "Standard form, chest to ground" },
            { id: "ex-74", name: "Tricep Dips", sets: 3, reps: 10, notes: "Use chair or bench" },
            { id: "ex-75", name: "Shoulder Taps", sets: 3, reps: 20, notes: "10 each shoulder, plank position" },
            { id: "ex-76", name: "Pike Push-ups", sets: 2, reps: 8, notes: "Downward dog position" },
          ],
        },
        {
          id: "template-20",
          name: "Core Crusher",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-77", name: "Sit-ups", sets: 3, reps: 15, notes: "Full range of motion" },
            { id: "ex-78", name: "Plank", time: 45, sets: 3, notes: "Hold steady position" },
            { id: "ex-79", name: "Bicycle Crunches", sets: 3, reps: 20, notes: "10 each side" },
            { id: "ex-80", name: "Dead Bug", sets: 2, reps: 12, notes: "6 each side, slow and controlled" },
          ],
        },
        {
          id: "template-21",
          name: "Quick Abs Burn",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-81", name: "Crunches", sets: 4, reps: 20, notes: "Focus on upper abs" },
            { id: "ex-82", name: "Leg Raises", sets: 3, reps: 12, notes: "Straight legs, control the movement" },
            { id: "ex-83", name: "Russian Twists", sets: 3, reps: 24, notes: "12 each side" },
            { id: "ex-84", name: "Plank Hold", time: 30, sets: 3, notes: "Maximum effort hold" },
          ],
        },
        {
          id: "template-22",
          name: "Bodyweight Strength",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-85", name: "Pull-ups", sets: 3, reps: 6, notes: "Use assistance if needed" },
            { id: "ex-86", name: "Pike Push-ups", sets: 3, reps: 10, notes: "Targets shoulders" },
            { id: "ex-87", name: "Plank Hold", time: 60, sets: 3, notes: "Core stability" },
            { id: "ex-88", name: "Bodyweight Rows", sets: 3, reps: 12, notes: "Use table or bar" },
          ],
        },
        {
          id: "template-23",
          name: "Upper Pump Express",
          category: "Strength",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-89", name: "Dumbbell Press", sets: 4, reps: 10, weight: 25, notes: "Chest press movement" },
            { id: "ex-90", name: "Bicep Curls", sets: 3, reps: 12, weight: 15, notes: "Control the weight" },
            { id: "ex-91", name: "Overhead Press", sets: 3, reps: 8, weight: 20, notes: "Shoulder press" },
            { id: "ex-92", name: "Tricep Extensions", sets: 3, reps: 12, weight: 12, notes: "Behind head or overhead" },
          ],
        },
        {
          id: "template-24",
          name: "Abs & Core Finisher",
          category: "Core",
          createdAt: new Date().toISOString(),
          exercises: [
            { id: "ex-93", name: "Mountain Climbers", time: 30, sets: 3, notes: "Fast pace" },
            { id: "ex-94", name: "Bicycle Crunches", sets: 3, reps: 30, notes: "15 each side" },
            { id: "ex-95", name: "Leg Raises", sets: 3, reps: 15, notes: "Lower abs focus" },
            { id: "ex-96", name: "Plank to Push-up", sets: 2, reps: 10, notes: "Transition movement" },
          ],
        },
      ]
      setTemplates(defaultTemplates)
      localStorage.setItem("workout-planner-templates", JSON.stringify(defaultTemplates))
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
    localStorage.setItem("workout-logs", JSON.stringify(workoutLogs))
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
