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
import type { Exercise } from "@/lib/utils"
import type { WorkoutTemplate as Template } from "@/lib/workout-templates"
import { ExerciseLibrary } from "@/components/exercise-library"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Eye, Clock, Weight, Repeat, Timer, CheckCircle } from "lucide-react"
import { workoutTemplates } from "@/lib/workout-templates"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

interface TemplatesProps {
  templates: Template[]
  addTemplate: (template: Template) => void
  updateTemplate: (templateId: number, updatedTemplate: Partial<Template>) => void
  deleteTemplate: (templateId: number) => void
  exerciseDatabase: Exercise[]
  language?: "en" | "th"
  isLoading?: boolean
}


export function Templates({ templates, addTemplate, updateTemplate, deleteTemplate, exerciseDatabase, language = "en", isLoading = false }: TemplatesProps) {
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [templateType, setTemplateType] = useState("")
  const [exercises, setExercises] = useState<Template['exercises']>([])
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState<Template['exercises'][number] | null>(null)
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
    setTemplateType("")
    setExercises([])
    setShowCreateDialog(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setTemplateName(template.name)
    setTemplateType(template.type)
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
    const templateData: Partial<Template> = {
      name: templateName,
      type: templateType as Template['type'],
      exercises: exercises,
    }
    try {
      if (editingTemplate) {
        await updateTemplate(Number(editingTemplate.id), templateData)
        toast({ title: t("success"), description: t("templateUpdated") })
      } else {
        await addTemplate(templateData as Template)
        toast({ title: t("success"), description: t("templateCreated") })
      }
      setShowCreateDialog(false)
    } catch (e) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
    }
  }

  const addExerciseFromLibrary = (libraryExercise: any) => {
    const exData = exerciseDatabase.find(e => e.id === libraryExercise.id)
    if (!exData) {
      toast({
        title: "ไม่พบท่าออกกำลังกาย",
        description: "ท่านี้ไม่มีในคลังข้อมูล กรุณาเลือกใหม่",
        variant: "destructive",
      })
      return
    }
    const newExercise: Template['exercises'][number] = {
      id: exData.id,
      name: exData.name,
      nameTranslations: { th: exData.name },
      sets: exData.recommendedSets?.sets || 3,
      reps: exData.recommendedSets?.reps || 10,
      duration: exData.estimatedDuration || 60,
      rest: 60,
      instructions: exData.instructions?.[0] || '',
      instructionsTranslations: { th: exData.instructions?.[0] || '' },
    }
    setExercises([...exercises, newExercise])
    setShowExerciseLibrary(false)
  }

  const handleEditExercise = (exercise: Template['exercises'][number], index: number) => {
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
    console.log("handlePreviewTemplate called with:", template);
    console.log("exData inside function:", exData);
    setPreviewTemplate(template);
    setPreviewExerciseIndex(0);
    setPreviewSetIndex(0);
    setShowPreview(true);
  };

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

  const exData = previewTemplate
    ? exerciseDatabase.find(
      e =>
        Number(e.id) ===
        Number(previewTemplate.exercises[previewExerciseIndex]?.id)
    )
    : undefined

  console.log("Rendering exData:", exData);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('workoutTemplates')}</h1>
          <p className="text-muted-foreground">{t('createAndManageReusableWorkoutRoutines')}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowLibraryDialog(true)} variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy from Library
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            {t('newTemplate')}
          </Button>
        </div>
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
                  <Badge variant="secondary">{template.type}</Badge>
                </div>
                <CardDescription>
                  {template.exercises.length} {template.exercises.length !== 1 ? t('exercises') : t('exercise')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {template.exercises.filter((exercise: Template['exercises'][number]) => exercise.name !== 'Unknown Exercise').map((exercise: Template['exercises'][number], index: number) => {
                      const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.id));
                      const exerciseName = exData?.name || t('unknownExercise');
                      const imageUrl = exData?.image_url || "/placeholder.svg";
                      return (
                        <div key={exercise.id ?? index} className="flex items-center justify-between text-sm gap-2">
                          <img src={imageUrl} alt={exerciseName} className="w-10 h-10 object-cover rounded" />
                          <span className="flex-1 ml-2">{exerciseName}</span>
                          <div className="text-muted-foreground">
                            {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                            {exercise.duration && `${exercise.duration}s`}
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
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
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
                  const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.id));
                  console.log("exddd", exData)
                  const exerciseName = exData?.name || t('unknownExercise');
                  const exerciseImg = exData?.image_url || "/placeholder.svg";
                  return (
                    <Card key={exercise.id ?? index}>
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
                        <div className="grid grid-cols-4 gap-3 items-center">
                          <img src={exerciseImg} alt={exerciseName} className="w-14 h-14 object-cover rounded" />
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
                            <Label>Instructions</Label>
                            <Input
                              value={exercise.instructions || ""}
                              onChange={e => setExercises(exs => exs.map((ex, i) => i === index ? { ...ex, instructions: e.target.value } : ex))}
                              placeholder="Instructions"
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
              <ExerciseLibrary onAddToWorkout={addExerciseFromLibrary} showAddButton={true} exerciseDatabase={exerciseDatabase} minimalView={true} />
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
                <Badge variant="secondary">{previewTemplate.type}</Badge>
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
                      <span>
                        {
                          previewTemplate?.exercises?.[previewExerciseIndex]?.nameTranslations?.th ||
                          previewTemplate?.exercises?.[previewExerciseIndex]?.name ||
                          "ไม่พบชื่อท่าในฐานข้อมูล"
                        }
                      </span>
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
                      {previewTemplate.exercises[previewExerciseIndex]?.duration && (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Timer className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-semibold">
                              {formatTime(previewTemplate.exercises[previewExerciseIndex].duration)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {previewTemplate.exercises[previewExerciseIndex]?.instructions && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Exercise Instructions:</p>
                        <p className="text-sm text-blue-800">{previewTemplate.exercises[previewExerciseIndex].instructions}</p>
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
                          const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.id));
                          const exerciseName = exData?.name || "Unknown Exercise";
                          return (
                            <div
                              key={exercise.id ?? index}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <span className="font-medium">{exerciseName}</span>
                              <div className="text-sm text-muted-foreground">
                                {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                                {exercise.duration && formatTime(exercise.duration)}
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
                          const exData = exerciseDatabase.find(e => String(e.id) === String(exercise.id));
                          const exerciseName = exData?.name || "Unknown Exercise";
                          return (
                            <div key={exercise.id ?? index}>
                              <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                  <h4 className="font-medium">
                                    {index + 1}. {exerciseName}
                                  </h4>
                                  {exercise.instructions && <p className="text-sm text-muted-foreground mt-2 italic">{exercise.instructions}</p>}
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
                                  {exercise.duration && (
                                    <div className="flex items-center">
                                      <Timer className="w-4 h-4 mr-1 text-muted-foreground" />
                                      <span>{formatTime(exercise.duration)}</span>
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
                  <CardDescription>{tpl.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={async () => {
                      const exercises = tpl.exercises.map(ex => {
                        const id = Number(ex.id)

                        const found = exerciseDatabase.find(
                          e => Number(e.id) === id
                        )

                        const reps =
                          typeof ex.reps === "number"
                            ? ex.reps
                            : typeof ex.reps === "string"
                              ? Number(ex.reps)
                              : undefined

                        const instructions =
                          Array.isArray(ex.instructions)
                            ? ex.instructions.join(" ")
                            : ex.instructions ?? ""

                        return {
                          id, // ✅ payload ต้องมีเสมอ
                          name: found?.name ?? ex.name,
                          nameTranslations: {
                            th: found?.name ?? ex.name,
                          },
                          sets: ex.sets,
                          reps,
                          duration: ex.duration,
                          rest: 60,
                          instructions,
                          instructionsTranslations: {
                            th: instructions,
                          },
                        }
                      })

                      await addTemplate({
                        id: Number(Date.now()),
                        name: String(tpl.name),
                        type: String(tpl.type),   // ✅ ส่ง type ชัด ๆ
                        exercises,
                      })

                      setShowLibraryDialog(false)
                    }}
                  >
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
