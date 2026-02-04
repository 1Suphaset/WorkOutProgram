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
import { ExerciseLibrary } from "@/components/exercise-library"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n"
import type { Exercise } from "@/lib/utils"
import type { WorkoutTemplate } from "@/lib/workout-templates"

interface Workout {
  id: number;
  name: string;
  date: string;
  notes?: string;
  completed?: boolean;
  duration?: number;
  exercises: Exercise[];
  createdAt?: string;
}

interface WorkoutFormProps {
  workout?: Workout | null
  templates: WorkoutTemplate[]
  selectedDate: Date
  onSave: (workout: Omit<Workout, "id" | "date" | "completed" | "createdAt">) => void
  onClose: () => void
  exerciseDatabase: Exercise[]
  language: "en" | "th"
}

export function WorkoutForm({ workout, templates, selectedDate, onSave, onClose, exerciseDatabase = [], language }: WorkoutFormProps) {
  const { t } = useTranslation(language)
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [notes, setNotes] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0)
  const { toast } = useToast()
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

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
    console.log("Add exercise button clicked - use ExerciseLibrary instead");
  }

  const updateExercise = (id: number, updates: Partial<Exercise>) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)))
  }

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const loadTemplate = (templateId: number | string) => {
    const template = templates.find((t) => String(t.id) === String(templateId))
    if (template) {
      const convertedExercises = (template.exercises || []).map((ex: any, idx: number) => {
        // map ด้วย exerciseId (หรือ id) เป็นหลัก
        const exData = exerciseDatabase.find(e => e.id === (ex.exerciseId ?? ex.id));
        return {
          id: Date.now() + Math.floor(Math.random() * 10000),
          exerciseId: ex.exerciseId ?? exData?.id ?? 0,
          name: exData?.name || ex.name || 'Unknown Exercise',
          category: exData?.category || ex.category || '',
          sets: ex.sets ?? 3,
          reps: ex.reps ?? 10,
          notes: ex.notes ?? "",
          duration: ex.duration ?? undefined,
          // ...field อื่นๆ ที่ต้องการ
        };
      });
      setWorkoutName(template.name)
      setExercises(convertedExercises)
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
      exercises: exercises.map(ex => ({
        ...ex,
        name: ex.name || '',
        category: ex.category || '',
      })),
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
          <DialogTitle>{workout ? t("editWorkout") : t("createNewWorkout")}</DialogTitle>
          <DialogDescription>
            {t("planYourWorkoutFor")}: {selectedDate.toLocaleDateString(language === "th" ? "th-TH" : "en-US")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workout-name">{t("workoutName")}</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder={t("workoutNamePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("loadFromTemplate")}</Label>
              <Select
                value={selectedTemplate ? selectedTemplate.toString() : ""}
                onValueChange={(value) => {
                  setSelectedTemplate(Number(value))
                  loadTemplate(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("chooseATemplate")}/>
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name} ({template.exercises?.length || 0} {t("exercises")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{t("notesOptional")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("additionalNotesPlaceholder")}
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">{t("exercises")}</Label>
              <Button onClick={() => setShowLibraryDialog(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {t("addExercise")}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {exercises.map((exercise, index) => {
                  const exData = exerciseDatabase.find(e => e.id === ((exercise as any).exerciseId ?? exercise.id));
                  console.log("Exercise:", exercise, "exData:", exData);
                  return (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {t("exercise")} {index + 1}
                          <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>{t("exerciseName")}</Label>
                          <div className="py-2 px-3 bg-muted rounded text-base">
                            {exData?.name || t('unknownExercise')}
                          </div>
                        </div>
                        <Tabs defaultValue="sets-reps" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="sets-reps">{t("setsAndReps")}</TabsTrigger>
                            <TabsTrigger value="time">{t("timeBased")}</TabsTrigger>
                          </TabsList>
                          <TabsContent value="sets-reps" className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>{t("sets")}</Label>
                                <Input
                                  type="number"
                                  value={(exercise as any).sets || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { ...(exercise as any), sets: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="3"
                                />
                              </div>
                              <div>
                                <Label>{t("reps")}</Label>
                                <Input
                                  type="number"
                                  value={(exercise as any).reps || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { ...(exercise as any), reps: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="10"
                                />
                              </div>
                              <div>
                                <Label>{t("weight")}</Label>
                                <Input
                                  type="number"
                                  value={(exercise as any).weight || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { ...(exercise as any), weight: Number.parseFloat(e.target.value) || undefined })
                                  }
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="time" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>{t("time")}</Label>
                                <Input
                                  type="number"
                                  value={(exercise as any).time || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { ...(exercise as any), time: Number.parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="60"
                                />
                              </div>
                              <div>
                                <Label>{t("notes")}</Label>
                                <Input
                                  value={(exercise as any).notes || ""}
                                  onChange={(e) =>
                                    updateExercise(exercise.id, { ...(exercise as any), notes: e.target.value })
                                  }
                                  placeholder={t("exerciseNotesPlaceholder")}
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )
                })}
                {exercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No exercises added yet</p>
                    <p className="text-sm">Select a template or add exercises from the library</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={handleSave} disabled={!workoutName.trim() || exercises.length === 0}>{t("saveWorkout")}</Button>
          </div>
        </div>
      </DialogContent>
          <ExerciseLibrary
            exerciseDatabase={exerciseDatabase}
            minimalView={true}
            showAddButton={true}
            onAddToWorkout={(libraryExercise) => {
              const newExercise: Exercise = {
                id: Date.now() + Math.floor(Math.random() * 10000),
            name: libraryExercise.name || '',
            category: libraryExercise.category || '',
              };
              setExercises([...exercises, newExercise]);
              setShowLibraryDialog(false);
            }}
          />
    </Dialog>
  )
}
