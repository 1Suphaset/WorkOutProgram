"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dumbbell, Search, Plus, GripVertical, Calendar } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { exerciseDatabase } from "@/lib/exercise-database"

interface DragDropPlannerProps {
  selectedDate: Date
  language: "en" | "th"
  onAddExercise: (exercise: any) => void
}

// Mock exercise bank
const exerciseBank = exerciseDatabase.map((ex) => ({
  id: ex.id,
  name: ex.name,
  category: ex.category,
  duration:
  ex.recommendedSets?.sets
    ? Math.round((ex.estimatedDuration * 60) / ex.recommendedSets.sets)
    : ex.estimatedDuration * 60,
  reps: ex.recommendedSets?.reps,
}))

export function DragDropPlanner({ selectedDate, language, onAddExercise }: DragDropPlannerProps) {
  const { t } = useTranslation(language)
  const [searchTerm, setSearchTerm] = useState("")
  const [draggedExercise, setDraggedExercise] = useState<any>(null)
  const [dropZoneActive, setDropZoneActive] = useState(false)

  const filteredExercises = exerciseBank.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDragStart = (exercise: any) => {
    setDraggedExercise(exercise)
  }

  const handleDragEnd = () => {
    setDraggedExercise(null)
    setDropZoneActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDropZoneActive(true)
  }

  const handleDragLeave = () => {
    setDropZoneActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedExercise) {
      onAddExercise(draggedExercise)
      setDropZoneActive(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Strength":
        return "bg-blue-100 text-blue-800"
      case "Cardio":
        return "bg-red-100 text-red-800"
      case "Core":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Exercise Bank */}
      <Card className="md:col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Dumbbell className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {t("exerciseBank")}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">{t("dragToCalendar")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm md:text-base"
            />
          </div>

          <ScrollArea className="h-64 md:h-96">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  draggable
                  onDragStart={() => handleDragStart(exercise)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center justify-between p-2 md:p-3 border rounded-lg cursor-move hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <GripVertical className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate">{exercise.name}</p>
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(exercise.category)}`}>
                          {exercise.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {exercise.duration}s{exercise.reps && ` • ${exercise.reps} reps`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onAddExercise(exercise)} className="flex-shrink-0">
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="truncate">
              {selectedDate.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Drag exercises here to add them to your workout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        min-h-48 md:min-h-64 border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-colors
        ${dropZoneActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
      `}
          >
            {dropZoneActive ? (
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-medium text-primary">Drop Exercise Here</h3>
                  <p className="text-muted-foreground text-sm md:text-base">Release to add to your workout</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-medium">{t("dropHere")}</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Drag exercises from the bank to build your workout
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
