"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Copy, Dumbbell } from "lucide-react"
import type { Template, Exercise } from "@/app/page"
import { ExerciseLibrary } from "@/components/exercise-library"
import type { ExerciseLibraryItem } from "@/lib/exercise-database"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Eye, Clock, Weight, Repeat, Timer, CheckCircle } from "lucide-react"
import { exerciseDatabase } from "@/lib/exercise-database"
import type { TemplateExerciseRef } from "@/app/page"
import { workoutTemplates } from "@/lib/workout-templates"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

interface TemplatesProps {
  templates: Template[]
  addTemplate: (template: Template) => void
  updateTemplate: (templateId: number, updatedTemplate: Partial<Template>) => void
  deleteTemplate: (templateId: number) => void
  exerciseDatabase: ExerciseLibraryItem[]
  language?: "en" | "th"
  isLoading?: boolean
}

export function Templates({ templates, addTemplate, updateTemplate, deleteTemplate, exerciseDatabase, language = "en", isLoading = false }: TemplatesProps) {
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [exercises, setExercises] = useState<TemplateExerciseRef[]>([])
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState<TemplateExerciseRef | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const [showPreview, setShowPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewExerciseIndex, setPreviewExerciseIndex] = useState(0)
  const [previewSetIndex, setPreviewSetIndex] = useState(0)

  const [showLibraryDialog, setShowLibraryDialog] = useState(false)

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setTemplateName("")
    setTemplateCategory("")
    setExercises([])
    setShowCreateDialog(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setTemplateName(template.name)
    setTemplateCategory(template.category)
    setExercises([...template.exercises])
    setShowCreateDialog(true)
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast({ title: t("error"), description: t("workoutNameRequired"), variant: "destructive" })
      return
    }
    if (exercises.length === 0) {
      toast({ title: t("error"), description: t("atLeastOneExerciseRequired"), variant: "destructive" })
      return
    }
    const templateData = {
      name: templateName,
      category: templateCategory,
      exercises: exercises.map(ex => ({
        exerciseId: ex.exerciseId ?? -1,
        sets: ex.sets ?? 3,
        reps: ex.reps ?? 10,
        time: ex.time ?? undefined,
        weight: ex.weight ?? undefined,
        notes: ex.notes ?? "",
      })),
      createdAt: new Date().toISOString(),
    }
    try { 
      if (editingTemplate) {
        console.log("Calling updateTemplate", editingTemplate.id, templateData)
        await updateTemplate(Number(editingTemplate.id), templateData)
        toast({ title: t("success"), description: t("templateUpdated") })
      } else {
        await addTemplate(templateData as Template as Template)
        toast({ title: t("success"), description: t("templateCreated") })
      }
      setShowCreateDialog(false)
    } catch (e) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
    }
  }

  const addExerciseFromLibrary = (libraryExercise: ExerciseLibraryItem) => {
    const newExercise: TemplateExerciseRef = {
      exerciseId: libraryExercise.id,
      sets: libraryExercise.recommendedSets?.sets || 3,
      reps: libraryExercise.recommendedSets?.reps ? parseInt(libraryExercise.recommendedSets.reps.split("-")[0]) : undefined,
    }
    setExercises([...exercises, newExercise])
    setShowExerciseLibrary(false)
  }

  const handleEditExercise = (exercise: TemplateExerciseRef, index: number) => {
    setExerciseToEdit(exercise)
    setEditIndex(index)
  }

  const handleSaveEditExercise = () => {
    if (editIndex !== null && exerciseToEdit) {
      setExercises(exs => exs.map((ex, i) => (i === editIndex ? exerciseToEdit : ex)))
      setExerciseToEdit(null)
      setEditIndex(null)
    }
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exs => exs.filter((_, i) => i !== index))
  }

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template)
    setPreviewExerciseIndex(0)
    setPreviewSetIndex(0)
    setShowPreview(true)
  }

  const nextPreviewExercise = () => {
    if (previewTemplate && previewExerciseIndex < previewTemplate.exercises.length - 1) {
      setPreviewExerciseIndex(previewExerciseIndex + 1)
      setPreviewSetIndex(0)
    }
  }

  const prevPreviewExercise = () => {
    if (previewExerciseIndex > 0) {
      setPreviewExerciseIndex(previewExerciseIndex - 1)
      setPreviewSetIndex(0)
    }
  }

  const nextPreviewSet = () => {
    if (previewTemplate) {
      const currentExercise = previewTemplate.exercises[previewExerciseIndex]
      if (currentExercise.sets && previewSetIndex < currentExercise.sets - 1) {
        setPreviewSetIndex(previewSetIndex + 1)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const exData = previewTemplate ? exerciseDatabase.find(e => String(e.id) === String(previewTemplate.exercises[previewExerciseIndex]?.exerciseId)) : undefined;

  const allExerciseIds = templates.flatMap(tpl => tpl.exercises.map(ex => ex.exerciseId));
  const missingIds = allExerciseIds.filter(id => !exerciseDatabase.some(e => String(e.id) === String(id)));

  const newExercises = missingIds.map(id => ({
    id,
    name: id, // หรือจะใส่ "Unknown Exercise"
    category: "Strength", // หรือ default อื่น ๆ
    muscleGroups: [],
    difficulty: "Beginner",
    equipment: "",
    description: "",
    instructions: [],
    imageUrl: "",
    estimatedDuration: 1,
    isCustom: true,
    createdAt: new Date().toISOString(),
  }));

  const mergedDatabase = [...exerciseDatabase, ...newExercises];

  const loadTemplate = (templateId: number | string) => {
    const template = templates.find((t) => String(t.id) === String(templateId))
    if (template) {
      setExercises(
        template.exercises.map((ex) => {
          const exData = exerciseDatabase.find(e => String(e.id) === String(ex.exerciseId))
          return {
            ...ex,
            id: Date.now() + Math.floor(Math.random() * 10000),
            name: exData?.name || "Unknown Exercise",
          }
        }),
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('workoutTemplates')}</h1>
          <p className="text-muted-foreground">{t('createAndManageReusableWorkoutRoutines')}</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          {t('newTemplate')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-lg font-medium mb-2">{t('loading')}</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">{t('noTemplatesYet')}</h3>
          <p className="text-muted-foreground mb-4">{t('createYourFirstWorkoutTemplateToGetStarted')}</p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={String(template.id)} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <CardDescription>
                  {template.exercises.length} {template.exercises.length !== 1 ? t('exercises') : t('exercise')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {template.exercises.filter((exercise: TemplateExerciseRef) => exercise.exerciseId !== 0).map((exercise: TemplateExerciseRef, index: number) => {
                      const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.exerciseId));
                      const exerciseName = exData?.name || "Unknown Exercise";
                      return (
                        <div key={String(exercise.exerciseId) + '-' + index} className="flex items-center justify-between text-sm">
                          <span>{exerciseName}</span>
                          <div className="text-muted-foreground">
                            {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                            {exercise.time && `${exercise.time}s`}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    {t('edit')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(Number(template.id))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? "Update your workout template" : "Create a reusable workout template"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Push Day, Full Body"
                />
              </div>
              <div>
                <Label htmlFor="template-category">Category</Label>
                <Input
                  id="template-category"
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  placeholder="e.g., Strength, Cardio"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Exercises</Label>
              <Button onClick={() => setShowExerciseLibrary(true)} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add from Library
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {exercises.map((exercise, index) => {
                  const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.exerciseId));
                  const exerciseName = exData?.name || "Unknown Exercise";
                  return (
                    <Card key={String(exercise.exerciseId) + '-' + index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {exerciseName}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditExercise(exercise, index)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Sets</Label>
                            <Input
                              type="number"
                              value={exercise.sets || ""}
                              onChange={e => setExercises(exs => exs.map((ex, i) => i === index ? { ...ex, sets: Number.parseInt(e.target.value) || undefined } : ex))}
                              placeholder={exData?.recommendedSets?.sets?.toString() || "3"}
                            />
                          </div>
                          <div>
                            <Label>Reps</Label>
                            <Input
                              type="number"
                              value={exercise.reps || ""}
                              onChange={e => setExercises(exs => exs.map((ex, i) => i === index ? { ...ex, reps: Number.parseInt(e.target.value) || undefined } : ex))}
                              placeholder={exData?.recommendedSets?.reps?.split("-")[0] || "10"}
                            />
                          </div>
                          <div>
                            <Label>Notes</Label>
                            <Input
                              value={exercise.notes || ""}
                              onChange={e => setExercises(exs => exs.map((ex, i) => i === index ? { ...ex, notes: e.target.value } : ex))}
                              placeholder="Notes"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {exercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No exercises added yet</p>
                    <p className="text-sm">Click "Add from Library" to get started</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} disabled={!templateName.trim() || exercises.length === 0}>
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
        <Dialog open={showExerciseLibrary} onOpenChange={setShowExerciseLibrary}>
          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Add Exercises from Library</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Browse and select exercises from the library to add to your template
              </DialogDescription>
            </DialogHeader>
            <div className="w-full">
              <ExerciseLibrary onAddToWorkout={addExerciseFromLibrary} showAddButton={true} />
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>

      {showPreview && previewTemplate && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                <span>Preview: {previewTemplate.name}</span>
                <Badge variant="secondary">{previewTemplate.category}</Badge>
              </DialogTitle>
              <DialogDescription>See how this template will look during workout execution</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="workout-view" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workout-view">Workout View</TabsTrigger>
                <TabsTrigger value="overview">Template Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="workout-view" className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <h3 className="font-semibold">Workout Progress</h3>
                    <Badge variant="outline">Exercise {previewExerciseIndex + 1} of {previewTemplate.exercises.length}</Badge>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((previewExerciseIndex + 1) / previewTemplate.exercises.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{exData?.name || "ไม่พบชื่อท่าในฐานข้อมูล"}</span>
                      <div className="flex items-center space-x-2">
                        {previewTemplate.exercises[previewExerciseIndex]?.sets && (
                          <Badge variant="secondary">
                            Set {previewSetIndex + 1} of {previewTemplate.exercises[previewExerciseIndex].sets}
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {previewTemplate.exercises[previewExerciseIndex]?.sets && (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Repeat className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Sets</p>
                            <p className="font-semibold">{previewTemplate.exercises[previewExerciseIndex].sets}</p>
                          </div>
                        </div>
                      )}
                      {previewTemplate.exercises[previewExerciseIndex]?.reps && (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <span className="text-primary font-bold">×</span>
                          <div>
                            <p className="text-sm text-muted-foreground">Reps</p>
                            <p className="font-semibold">{previewTemplate.exercises[previewExerciseIndex].reps}</p>
                          </div>
                        </div>
                      )}
                      {previewTemplate.exercises[previewExerciseIndex]?.weight && (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Weight className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Weight</p>
                            <p className="font-semibold">
                              {previewTemplate.exercises[previewExerciseIndex].weight} lbs
                            </p>
                          </div>
                        </div>
                      )}
                      {previewTemplate.exercises[previewExerciseIndex]?.time && (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Timer className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-semibold">
                              {formatTime(previewTemplate.exercises[previewExerciseIndex].time)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {previewTemplate.exercises[previewExerciseIndex]?.notes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Exercise Notes:</p>
                        <p className="text-sm text-blue-800">{previewTemplate.exercises[previewExerciseIndex].notes}</p>
                      </div>
                    )}

                    {previewTemplate.exercises[previewExerciseIndex]?.sets && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Set Progress:</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: previewTemplate.exercises[previewExerciseIndex].sets! }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index < previewSetIndex
                                  ? "bg-green-500 text-white"
                                  : index === previewSetIndex
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                {index < previewSetIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={prevPreviewExercise} disabled={previewExerciseIndex === 0}>
                          Previous Exercise
                        </Button>
                        {previewTemplate.exercises[previewExerciseIndex]?.sets && (
                          <Button
                            variant="outline"
                            onClick={nextPreviewSet}
                            disabled={previewSetIndex >= previewTemplate.exercises[previewExerciseIndex].sets! - 1}
                          >
                            Next Set
                          </Button>
                        )}
                      </div>
                      <Button
                        onClick={nextPreviewExercise}
                        disabled={previewExerciseIndex >= previewTemplate.exercises.length - 1}
                      >
                        Next Exercise
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {previewExerciseIndex < previewTemplate.exercises.length - 1 && (
                  <div>
                    <h4 className="font-medium mb-3">Up Next:</h4>
                    <div className="space-y-2">
                      {previewTemplate.exercises
                        .slice(previewExerciseIndex + 1, previewExerciseIndex + 4)
                        .map((exercise, index) => {
                          const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.exerciseId));
                          const exerciseName = exData?.name || "Unknown Exercise";
                          return (
                            <div
                              key={String(exercise.exerciseId) + '-' + index}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <span className="font-medium">{exerciseName}</span>
                              <div className="text-sm text-muted-foreground">
                                {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                                {exercise.time && formatTime(exercise.time)}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Dumbbell className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Exercises</p>
                          <p className="text-2xl font-bold">{previewTemplate.exercises.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Repeat className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Sets</p>
                          <p className="text-2xl font-bold">
                            {previewTemplate.exercises.reduce((total, ex) => total + (ex.sets || 0), 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Est. Duration</p>
                          <p className="text-2xl font-bold">
                            {Math.round(
                              previewTemplate.exercises.length * 3 +
                              previewTemplate.exercises.reduce((total, ex) => total + (ex.sets || 0), 0) * 2,
                            )}{" "}
                            min
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Complete Exercise List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {previewTemplate.exercises.map((exercise, index) => {
                          const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.exerciseId));
                          const exerciseName = exData?.name || "Unknown Exercise";
                          return (
                            <div key={String(exercise.exerciseId) + '-' + index}>
                              <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                  <h4 className="font-medium">
                                    {index + 1}. {exerciseName}
                                  </h4>
                                  {exercise.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  {exercise.sets && (
                                    <div className="flex items-center">
                                      <Repeat className="w-4 h-4 mr-1 text-muted-foreground" />
                                      <span>{exercise.sets} sets</span>
                                    </div>
                                  )}
                                  {exercise.reps && (
                                    <div className="flex items-center">
                                      <span className="text-muted-foreground mr-1">×</span>
                                      <span>{exercise.reps} reps</span>
                                    </div>
                                  )}
                                  {exercise.weight && (
                                    <div className="flex items-center">
                                      <Weight className="w-4 h-4 mr-1 text-muted-foreground" />
                                      <span>{exercise.weight} lbs</span>
                                    </div>
                                  )}
                                  {exercise.time && (
                                    <div className="flex items-center">
                                      <Timer className="w-4 h-4 mr-1 text-muted-foreground" />
                                      <span>{formatTime(exercise.time)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {index < previewTemplate.exercises.length - 1 && <Separator className="my-2" />}
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  handleEditTemplate(previewTemplate)
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Button onClick={() => setShowLibraryDialog(true)} variant="outline" className="ml-2">
        Copy from Library
      </Button>

      <Dialog open={showLibraryDialog} onOpenChange={setShowLibraryDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Copy Template from Library</DialogTitle>
            <DialogDescription>เลือกโปรแกรมสำเร็จรูปเพื่อคัดลอกไปยังเทมเพลตของคุณ</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {workoutTemplates.map((tpl) => (
              <Card key={tpl.id}>
                <CardHeader>
                  <CardTitle>{tpl.name}</CardTitle>
                  <CardDescription>{tpl.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={async () => {
                    const exercises = tpl.exercises.map(ex => {
                      const found = exerciseDatabase.find(e => e.name === ex.name)
                      return found ? {
                        exerciseId: found.id,
                        sets: ex.sets,
                        reps: typeof ex.reps === "number" ? ex.reps : (typeof ex.reps === "string" ? parseInt(ex.reps) : undefined),
                        time: ex.duration,
                        notes: ex.instructions,
                      } : {
                        exerciseId: -1,
                        sets: ex.sets,
                        reps: typeof ex.reps === "number" ? ex.reps : (typeof ex.reps === "string" ? parseInt(ex.reps) : undefined),
                        time: ex.duration,
                        notes: (ex.instructions || "") + " (ชื่อท่าไม่พบในฐานข้อมูล)",
                      }
                    })
                    await addTemplate({
                      id: Date.now(),
                      name: tpl.name,
                      category: tpl.type,
                      createdAt: new Date().toISOString(),
                      exercises,
                    })
                    setShowLibraryDialog(false)
                  }}>
                    Copy This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>{t("areYouSureDeleteTemplate")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>{t("cancel")}</Button>
            <Button variant="destructive" onClick={async () => {
              if (confirmDeleteId !== null) {
                try {
                  await deleteTemplate(confirmDeleteId)
                  toast({ title: t("success"), description: t("templateDeleted") })
                } catch {
                  toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
                }
                setConfirmDeleteId(null)
              }
            }}>{t("delete")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
