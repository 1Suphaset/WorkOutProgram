"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Dumbbell, Heart, Zap, Trophy } from "lucide-react"
import type { WorkoutTemplate, Exercise } from "@/app/page"

interface ExercisesProps {
  templates: WorkoutTemplate[]
  addTemplate: (template: WorkoutTemplate) => void
  updateTemplate: (templateId: string, updatedTemplate: Partial<WorkoutTemplate>) => void
  deleteTemplate: (templateId: string) => void
}

export function Exercises({ templates, addTemplate, updateTemplate, deleteTemplate }: ExercisesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: "",
    category: "",
    exercises: [],
  })
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: "",
    type: "strength",
    duration: 300,
    reps: 10,
    sets: 3,
    calories: 50,
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-4 h-4" />
      case "cardio":
        return <Heart className="w-4 h-4" />
      case "flexibility":
        return <Zap className="w-4 h-4" />
      case "sports":
        return <Trophy className="w-4 h-4" />
      default:
        return <Dumbbell className="w-4 h-4" />
    }
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name?.trim() || !newTemplate.category?.trim()) return

    const template: WorkoutTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTemplate.name,
      category: newTemplate.category,
      exercises: newTemplate.exercises || [],
    }

    addTemplate(template)
    setIsCreateDialogOpen(false)
    setNewTemplate({ name: "", category: "", exercises: [] })
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !newTemplate.name?.trim() || !newTemplate.category?.trim()) return

    updateTemplate(editingTemplate.id, {
      name: newTemplate.name,
      category: newTemplate.category,
      exercises: newTemplate.exercises,
    })

    setEditingTemplate(null)
    setNewTemplate({ name: "", category: "", exercises: [] })
  }

  const addExerciseToTemplate = () => {
    if (!newExercise.name?.trim()) return

    const exercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: newExercise.name,
      type: newExercise.type as Exercise["type"],
      duration: newExercise.duration || 300,
      reps: newExercise.reps,
      sets: newExercise.sets,
      description: newExercise.description,
      calories: newExercise.calories || 50,
    }

    setNewTemplate((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), exercise],
    }))

    setNewExercise({
      name: "",
      type: "strength",
      duration: 300,
      reps: 10,
      sets: 3,
      calories: 50,
    })
  }

  const removeExerciseFromTemplate = (exerciseId: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises?.filter((ex) => ex.id !== exerciseId) || [],
    }))
  }

  const startEditing = (template: WorkoutTemplate) => {
    setEditingTemplate(template)
    setNewTemplate({
      name: template.name,
      category: template.category,
      exercises: [...template.exercises],
    })
    setIsCreateDialogOpen(true)
  }

  const cancelEditing = () => {
    setEditingTemplate(null)
    setNewTemplate({ name: "", category: "", exercises: [] })
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise Templates</h1>
          <p className="text-muted-foreground">Create and manage workout templates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? "Update your workout template" : "Create a reusable workout template"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name || ""}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Full Body Strength"
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Category</Label>
                  <Input
                    id="template-category"
                    value={newTemplate.category || ""}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Strength, Cardio"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Exercise</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Exercise Name</Label>
                    <Input
                      value={newExercise.name || ""}
                      onChange={(e) => setNewExercise((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Push-ups"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newExercise.type}
                      onValueChange={(value) =>
                        setNewExercise((prev) => ({ ...prev, type: value as Exercise["type"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={newExercise.duration || 300}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      value={newExercise.calories || 50}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, calories: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Reps (optional)</Label>
                    <Input
                      type="number"
                      value={newExercise.reps || ""}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, reps: Number.parseInt(e.target.value) || undefined }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Sets (optional)</Label>
                    <Input
                      type="number"
                      value={newExercise.sets || ""}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, sets: Number.parseInt(e.target.value) || undefined }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={newExercise.description || ""}
                    onChange={(e) => setNewExercise((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Exercise instructions or notes"
                  />
                </div>
                <Button onClick={addExerciseToTemplate} className="w-full">
                  Add Exercise
                </Button>
              </div>

              {(newTemplate.exercises?.length || 0) > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Template Exercises</h4>
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {newTemplate.exercises?.map((exercise) => (
                        <div key={exercise.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(exercise.type)}
                            <span className="text-sm">{exercise.name}</span>
                            <Badge variant="outline">{exercise.type}</Badge>
                            {exercise.reps && exercise.sets && (
                              <span className="text-xs text-muted-foreground">
                                {exercise.sets}x{exercise.reps}
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeExerciseFromTemplate(exercise.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate} className="flex-1">
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
                {editingTemplate && (
                  <Button variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(exercise.type)}
                        <span>{exercise.name}</span>
                      </div>
                      <div className="text-muted-foreground">{Math.round(exercise.duration / 60)}min</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => startEditing(template)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
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
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  )
}
