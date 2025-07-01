"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Workout, Template, Exercise } from "@/app/page"
import { ExerciseLibrary } from "@/components/exercise-library"
import { useToast } from "@/hooks/use-toast"
import { exerciseDatabase as defaultExerciseDatabase } from "@/lib/exercise-database"

interface WorkoutFormProps {
  workout?: Workout | null
  templates: Template[]
  selectedDate: Date
  onSave: (workout: Omit<Workout, "id" | "date" | "completed" | "createdAt">) => void
  onClose: () => void
  exerciseDatabase?: typeof defaultExerciseDatabase
}

export function WorkoutForm({ workout, templates, selectedDate, onSave, onClose, exerciseDatabase = defaultExerciseDatabase }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [notes, setNotes] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    if (workout) {
      setWorkoutName(workout.name)
      setExercises(workout.exercises)
      setNotes(workout.notes || "")
    }
  }, [workout])

  const addExercise = () => {
    // ไม่อนุญาตให้เพิ่ม exercise เปล่าๆ อีกต่อไป ให้เลือกจาก ExerciseLibrary เท่านั้น
    // สามารถลบปุ่ม Add Exercise ได้ หรือ disable
  }

  const updateExercise = (id: number, updates: Partial<Exercise>) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)))
  }

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const loadTemplate = (templateId: number) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      console.log('Selected template:', template);
      setWorkoutName(template.name)
      setExercises(
        template.exercises.map((ex) => ({
          ...ex,
          id: Date.now() + Math.floor(Math.random() * 10000),
        }))
      )
    }
  }

  const handleSave = () => {
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Workout name is required.",
        variant: "destructive",
      })
      return
    }

    if (exercises.length === 0) {
      toast({
        title: "Error",
        description: "At least one exercise is required.",
        variant: "destructive",
      })
      return
    }

    onSave({
      name: workoutName,
      exercises,
      notes,
    })

    toast({
      title: "Success",
      description: "Workout saved successfully.",
    })

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workout ? "Edit Workout" : "Create New Workout"}</DialogTitle>
          <DialogDescription>Plan your workout for {selectedDate.toLocaleDateString()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Push Day, Cardio Session"
              />
            </div>
            <div>
              <Label>Load from Template</Label>
              <Select
                value={selectedTemplate ? selectedTemplate.toString() : ""}
                onValueChange={(value) => {
                  console.log("onValueChange", value);
                  setSelectedTemplate(Number(value))
                  loadTemplate(Number(value))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name} ({template.exercises.length} exercises)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for this workout..."
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Exercises</Label>
              <Button onClick={addExercise} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {exercises.map((exercise, index) => {
                  const exData = exerciseDatabase.find(e => e.id === exercise.exerciseId);
                  return (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Exercise {index + 1}
                          <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Exercise Name</Label>
                          <div className="py-2 px-3 bg-muted rounded text-base">{exData?.name || "Unknown Exercise"}</div>
                        </div>
                        <Tabs defaultValue="sets-reps" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="sets-reps">Sets & Reps</TabsTrigger>
                            <TabsTrigger value="time">Time Based</TabsTrigger>
                          </TabsList>
                          <TabsContent value="sets-reps" className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  value={exercise.sets || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { sets: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="3"
                                />
                              </div>
                              <div>
                                <Label>Reps</Label>
                                <Input
                                  type="number"
                                  value={exercise.reps || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { reps: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="10"
                                />
                              </div>
                              <div>
                                <Label>Weight (lbs)</Label>
                                <Input
                                  type="number"
                                  value={exercise.weight || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { weight: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="135"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="time" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Time (seconds)</Label>
                                <Input
                                  type="number"
                                  value={exercise.time || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { time: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="60"
                                />
                              </div>
                              <div>
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  value={exercise.sets || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { sets: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="3"
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        <div>
                          <Label>Notes (optional)</Label>
                          <Input
                            value={exercise.notes || ""}
                            onChange={(e) => updateExercise(exercise.id, { notes: e.target.value })}
                            placeholder="Form cues, modifications, etc."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {exercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No exercises added yet</p>
                    <p className="text-sm">Click "Add Exercise" to get started</p>
                  </div>
                )}
                <ExerciseLibrary
                  onAddToWorkout={(libraryExercise) => {
                    const newExercise: Exercise = {
                      id: Date.now() + Math.floor(Math.random() * 10000),
                      exerciseId: libraryExercise.id,
                      sets: libraryExercise.recommendedSets?.sets || 3,
                      reps: Number.parseInt(libraryExercise.recommendedSets?.reps.split("-")[0] || "10"),
                      notes: libraryExercise.description,
                    }
                    setExercises([...exercises, newExercise])
                  }}
                  showAddButton={true}
                />
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!workoutName.trim() || exercises.length === 0}>
              {workout ? "Update Workout" : "Save Workout"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
