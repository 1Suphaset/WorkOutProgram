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

interface TemplatesProps {
  templates: Template[]
  addTemplate: (template: Template) => void
  updateTemplate: (templateId: string, updatedTemplate: Partial<Template>) => void
  deleteTemplate: (templateId: string) => void
}

export function Templates({ templates, addTemplate, updateTemplate, deleteTemplate }: TemplatesProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false)

  const [showPreview, setShowPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewExerciseIndex, setPreviewExerciseIndex] = useState(0)
  const [previewSetIndex, setPreviewSetIndex] = useState(0)

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

  const handleSaveTemplate = () => {
    if (!templateName.trim() || exercises.length === 0) return

    const templateData = {
      name: templateName,
      category: templateCategory,
      exercises,
    }

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, templateData)
    } else {
      addTemplate({
        ...templateData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      })
    }

    setShowCreateDialog(false)
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      sets: 3,
      reps: 10,
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const duplicateTemplate = (template: Template) => {
    addTemplate({
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      exercises: template.exercises.map((ex) => ({
        ...ex,
        id: Math.random().toString(36).substr(2, 9),
      })),
    })
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

  const addExerciseFromLibrary = (libraryExercise: ExerciseLibraryItem) => {
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: libraryExercise.name,
      sets: libraryExercise.recommendedSets?.sets || 3,
      reps: Number.parseInt(libraryExercise.recommendedSets?.reps.split("-")[0] || "10"),
      notes: libraryExercise.description,
    }
    setExercises([...exercises, newExercise])
    setShowExerciseLibrary(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workout Templates</h1>
          <p className="text-muted-foreground">Create and manage reusable workout routines</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <CardDescription>
                {template.exercises.length} exercise{template.exercises.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {template.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between text-sm">
                      <span>{exercise.name}</span>
                      <div className="text-muted-foreground">
                        {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                        {exercise.time && `${exercise.time}s`}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTemplate(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-4">Create your first workout template to get started</p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}

      {/* Create/Edit Template Dialog */}
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Exercises</Label>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowExerciseLibrary(true)} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    From Library
                  </Button>
                  <Button onClick={addExercise} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Custom Exercise
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          Exercise {index + 1}
                          <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label>Exercise Name</Label>
                          <Input
                            value={exercise.name}
                            onChange={(e) => updateExercise(exercise.id, { name: e.target.value })}
                            placeholder="e.g., Bench Press"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
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
                            <Label>Weight</Label>
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
                      </CardContent>
                    </Card>
                  ))}

                  {exercises.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No exercises added yet</p>
                      <p className="text-sm">Click "Add Exercise" to get started</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

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
        {showExerciseLibrary && (
          <Dialog open={showExerciseLibrary} onOpenChange={setShowExerciseLibrary}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Exercises from Library</DialogTitle>
                <DialogDescription>
                  Browse and select exercises from the library to add to your template
                </DialogDescription>
              </DialogHeader>
              <ExerciseLibrary onAddToWorkout={addExerciseFromLibrary} showAddButton={true} />
            </DialogContent>
          </Dialog>
        )}
      </Dialog>

      {/* Template Preview Dialog */}
      {showPreview && previewTemplate && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
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
                {/* Workout Progress Header */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Workout Progress</h3>
                    <Badge variant="outline">
                      Exercise {previewExerciseIndex + 1} of {previewTemplate.exercises.length}
                    </Badge>
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

                {/* Current Exercise Display */}
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{previewTemplate.exercises[previewExerciseIndex]?.name}</span>
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
                    {/* Exercise Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                    {/* Exercise Notes */}
                    {previewTemplate.exercises[previewExerciseIndex]?.notes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Exercise Notes:</p>
                        <p className="text-sm text-blue-800">{previewTemplate.exercises[previewExerciseIndex].notes}</p>
                      </div>
                    )}

                    {/* Set Progress Indicators */}
                    {previewTemplate.exercises[previewExerciseIndex]?.sets && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Set Progress:</p>
                        <div className="flex space-x-2">
                          {Array.from({ length: previewTemplate.exercises[previewExerciseIndex].sets! }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  index < previewSetIndex
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

                    {/* Navigation Controls */}
                    <div className="flex justify-between pt-4">
                      <div className="flex space-x-2">
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

                {/* Upcoming Exercises */}
                {previewExerciseIndex < previewTemplate.exercises.length - 1 && (
                  <div>
                    <h4 className="font-medium mb-3">Up Next:</h4>
                    <div className="space-y-2">
                      {previewTemplate.exercises
                        .slice(previewExerciseIndex + 1, previewExerciseIndex + 4)
                        .map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <span className="font-medium">{exercise.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets && exercise.reps && `${exercise.sets}x${exercise.reps}`}
                              {exercise.time && formatTime(exercise.time)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-4">
                {/* Template Summary */}
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

                {/* Complete Exercise List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Exercise List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {previewTemplate.exercises.map((exercise, index) => (
                          <div key={exercise.id}>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                              <div>
                                <h4 className="font-medium">
                                  {index + 1}. {exercise.name}
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
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
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
    </div>
  )
}
