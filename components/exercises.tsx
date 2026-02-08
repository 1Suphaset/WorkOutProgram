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
import type { Template } from "@/lib/types/workout"
// Remove: import type { ExerciseLibraryItem } from "@/lib/exercise-database"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"

interface ExercisesProps {
  templates: Template[]
  addTemplate: (template: Template) => void
  updateTemplate: (templateId: number, updatedTemplate: Partial<Template>) => void
  deleteTemplate: (templateId: number) => void
  exerciseDatabase: any[] // Changed to any[] as ExerciseLibraryItem is removed
  language?: "en" | "th"
}

type ExerciseForm = {
  name: string;
  type: string;
  duration: number;
  reps?: number;
  sets?: number;
  calories?: number;
  description?: string;
  id?: number;
};

type NewTemplateForm = {
  name: string;
  category: string;
  exercises: ExerciseForm[];
};


export function Exercises({ templates, addTemplate, updateTemplate, deleteTemplate, exerciseDatabase, language = "en" }: ExercisesProps) {
  const { t } = useTranslation(language)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<NewTemplateForm>({
    name: "",
    category: "",
    exercises: [],
  })
  const [newExercise, setNewExercise] = useState<ExerciseForm>({
    name: "",
    type: "strength",
    duration: 300,
    reps: 10,
    sets: 3,
    calories: 50,
    description: "",
  })
  const { toast } = useToast()

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

  // เวลาสร้างหรือแก้ไข template ให้เติมข้อมูลจาก exerciseDatabase
  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.category.trim()) return
    const template: Template = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      name: newTemplate.name,
      nameTranslations: { th: newTemplate.name },
      type: newTemplate.category as Template['type'],
      duration: 30,
      difficulty: "Beginner",
      description: "",
      descriptionTranslations: { th: "" },
      equipment: [],
      targetMuscles: [],
      calories: 0,
      tags: [],
      exercises: newTemplate.exercises.map((ex: any, idx) => {
        const exData = exerciseDatabase.find(e => Number(e.id) === Number(ex.id));
        return {
          id: exData?.id, // serialize exerciseId เสมอ
          name: exData?.name || ex.name,
          nameTranslations: { th: exData?.name || ex.name },
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          rest: 60,
          instructions: ex.description || "",
          instructionsTranslations: { th: ex.description || "" },
        }
      }),
    }
    addTemplate(template)
    setIsCreateDialogOpen(false)
    setNewTemplate({ name: "", category: "", exercises: [] })
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !newTemplate.name.trim() || !newTemplate.category.trim()) return
    updateTemplate(Number(editingTemplate.id), {
      name: newTemplate.name,
      type: newTemplate.category as Template['type'],
      exercises: newTemplate.exercises.map((ex, idx) => {
        const exData = exerciseDatabase.find(e => Number(e.id) === Number(ex.id));
        return {
          id: Number(exData?.id), // serialize exerciseId เสมอ
          name: exData?.name || ex.name,
        }
      }),
    })
    setEditingTemplate(null)
    setNewTemplate({ name: "", category: "", exercises: [] })
  }

  const addExerciseToTemplate = () => {
    if (!newExercise.name.trim()) return
    // หา exercise จริงใน database ด้วยชื่อ (หรือ logic ที่เหมาะสม)
    const exData = exerciseDatabase.find(e => e.name === newExercise.name)
    if (!exData) {
      toast({
        title: "ไม่พบท่าออกกำลังกาย",
        description: "ท่านี้ไม่มีในคลังข้อมูล กรุณาเลือกใหม่",
        variant: "destructive",
      })
      return
    }
    setNewTemplate((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...newExercise,
          id: exData.id,
        },
      ],
    }))
    setNewExercise({
      name: "",
      type: "strength",
      duration: 300,
      reps: 10,
      sets: 3,
      calories: 50,
      description: "",
    })
  }

  const removeExerciseFromTemplate = (exerciseIdx: number) => {
    setNewTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== exerciseIdx),
    }))
  }

  const startEditing = (template: Template) => {
    setEditingTemplate(template)
    setNewTemplate({
      name: template.name,
      category: template.type,
      exercises: template.exercises.map((ex: any) => ({
        name: "",
        type: "strength",
        duration: ex.duration || 0,
        reps: ex.reps,
        sets: ex.sets,
        calories: 0,
        description: ex.instructions || "",
      })),
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
          <h1 className="text-3xl font-bold">{t('exercises.exerciseTemplates')}</h1>
          <p className="text-muted-foreground">{t('exercises.createAndManageWorkoutTemplates')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('exercises.newTemplate')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? t('exercises.editTemplate') : t('exercises.createNewTemplate')}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? t('exercises.updateYourWorkoutTemplate') : t('exercises.createAReusableWorkoutTemplate')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">{t('exercises.templateName')}</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name || ""}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={t('exercises.e.g.FullBodyStrength')}
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">{t('exercises.category')}</Label>
                  <Input
                    id="template-category"
                    value={newTemplate.category || ""}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder={t('exercises.e.g.StrengthCardio')}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">{t('exercises.addExercise')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('exercises.exerciseName')}</Label>
                    <Input
                      value={newExercise.name || ""}
                      onChange={(e) => setNewExercise((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('exercises.e.g.Pushups')}
                    />
                  </div>
                  <div>
                    <Label>{t('exercises.type')}</Label>
                    <Select
                      value={newExercise.type}
                      onValueChange={(value) =>
                        setNewExercise((prev) => ({ ...prev, type: value as ExerciseForm["type"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">{t('exercises.strength')}</SelectItem>
                        <SelectItem value="cardio">{t('exercises.cardio')}</SelectItem>
                        <SelectItem value="flexibility">{t('exercises.flexibility')}</SelectItem>
                        <SelectItem value="sports">{t('exercises.sports')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('exercises.duration')}</Label>
                    <Input
                      type="number"
                      value={newExercise.duration || 300}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t('exercises.calories')}</Label>
                    <Input
                      type="number"
                      value={newExercise.calories || 50}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, calories: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t('exercises.reps')}</Label>
                    <Input
                      type="number"
                      value={newExercise.reps || ""}
                      onChange={(e) =>
                        setNewExercise((prev) => ({ ...prev, reps: Number.parseInt(e.target.value) || undefined }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t('exercises.sets')}</Label>
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
                  <Label>{t('exercises.description')}</Label>
                  <Textarea
                    value={newExercise.description || ""}
                    onChange={(e) => setNewExercise((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder={t('exercises.exerciseInstructionsOrNotes')}
                  />
                </div>
                <Button onClick={addExerciseToTemplate} className="w-full">
                  {t('exercises.addExercise')}
                </Button>
              </div>

              {(newTemplate.exercises?.length || 0) > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{t('exercises.templateExercises')}</h4>
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {newTemplate.exercises?.map((exercise, idx) => (
                        <div key={exercise.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(exercise.type)}
                            <span className="text-sm">
                              {(() => { const exData = exerciseDatabase.find(e => Number(e.id) === Number(exercise.id)); return exData?.name || exercise.name || t('unknownExercise') })()}
                            </span>
                            <Badge variant="outline">{exercise.type}</Badge>
                            {exercise.reps && exercise.sets && (
                              <span className="text-xs text-muted-foreground">
                                {exercise.sets}x{exercise.reps}
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeExerciseFromTemplate(idx)}>
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
                  {editingTemplate ? t('exercises.updateTemplate') : t('exercises.createTemplate')}
                </Button>
                {editingTemplate && (
                  <Button variant="outline" onClick={cancelEditing}>
                    {t('exercises.cancel')}
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
                <Badge variant="secondary">{template.type}</Badge>
              </div>
              <CardDescription>
                {template.exercises.length} {template.exercises.length !== 1 ? t('exercises.exercises') : t('exercises.exercise')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {template.exercises.map((exercise: any) => (
                    <div key={exercise.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span>
                          {(() => { const exData = exerciseDatabase.find(e => Number(e.id) === Number(exercise.id)); return exData?.name || "Unknown Exercise" })()}
                        </span>
                      </div>
                      <div className="text-muted-foreground">{exercise.duration ? Math.round(exercise.duration / 60) + "min" : ""}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => startEditing(template)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  {t('exercises.edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTemplate(Number(template.id))}
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
          <h3 className="text-lg font-medium mb-2">{t('exercises.noTemplatesYet')}</h3>
          <p className="text-muted-foreground mb-4">{t('exercises.createYourFirstWorkoutTemplateToGetStarted')}</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('exercises.createTemplate')}
          </Button>
        </div>
      )}
    </div>
  )
}
