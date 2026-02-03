"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, Upload } from "lucide-react"
import type { ExerciseTemplate } from "@/lib/exercise-templates"
import { ExerciseTemplateSelector } from "@/components/exercise-template-selector"
import { useTranslation } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import type { Exercise } from "@/lib/utils"

interface CustomExerciseFormProps {
  exercise?: Exercise | null
  onSave: (exercise: Omit<Exercise, "id" | "createdAt">) => void
  onClose: () => void
  language?: "en" | "th"
}

const muscleGroupOptions = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Core",
  "Abs",
  "Obliques",
  "Lower Back",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Hip Flexors",
  "Full Body",
  "Cardio",
  "Flexibility",
]

const equipmentOptions = [
  "Bodyweight",
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Cable Machine",
  "Smith Machine",
  "Medicine Ball",
  "Battle Ropes",
  "Plyometric Box",
  "Yoga Mat",
  "Foam Roller",
  "TRX",
  "Bosu Ball",
  "Stability Ball",
  "Other",
]

export function CustomExerciseForm({ exercise, onSave, onClose, language = "en" }: CustomExerciseFormProps) {
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: exercise?.name || "",
    category: exercise?.category || ("Strength" as const),
    muscleGroups: exercise?.muscleGroups || [],
    difficulty: exercise?.difficulty || ("Beginner" as const),
    equipment: exercise?.equipment || "Bodyweight",
    description: exercise?.description || "",
    instructions: exercise?.instructions || [""],
    image_url: exercise?.image_url || "",
    estimatedDuration: exercise?.estimatedDuration || 3,
    benefits: exercise?.benefits || [],
    tips: exercise?.tips || [],
    variations: exercise?.variations || [],
    recommendedSets: exercise?.recommendedSets || {
      sets: 3,
      reps: "8-12",
      rest: 60,
    },
  })

  const [newMuscleGroup, setNewMuscleGroup] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newTip, setNewTip] = useState("")
  const [newVariation, setNewVariation] = useState({ name: "", description: "" })
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addMuscleGroup = (muscleGroup: string) => {
    if (muscleGroup && !formData.muscleGroups.includes(muscleGroup)) {
      updateFormData("muscleGroups", [...formData.muscleGroups, muscleGroup])
    }
  }

  const removeMuscleGroup = (muscleGroup: string) => {
    updateFormData(
      "muscleGroups",
      formData.muscleGroups.filter((mg: string) => mg !== muscleGroup),
    )
  }

  const addInstruction = () => {
    updateFormData("instructions", [...formData.instructions, ""])
  }

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions]
    newInstructions[index] = value
    updateFormData("instructions", newInstructions)
  }

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      updateFormData(
        "instructions",
        formData.instructions.filter((_, i) => i !== index),
      )
    }
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      updateFormData("benefits", [...formData.benefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    updateFormData(
      "benefits",
      formData.benefits.filter((_, i) => i !== index),
    )
  }

  const addTip = () => {
    if (newTip.trim()) {
      updateFormData("tips", [...formData.tips, newTip.trim()])
      setNewTip("")
    }
  }

  const removeTip = (index: number) => {
    updateFormData(
      "tips",
      formData.tips.filter((_, i) => i !== index),
    )
  }

  const addVariation = () => {
    if (newVariation.name.trim() && newVariation.description.trim()) {
      updateFormData("variations", [...formData.variations, { ...newVariation }])
      setNewVariation({ name: "", description: "" })
    }
  }

  const removeVariation = (index: number) => {
    updateFormData(
      "variations",
      formData.variations.filter((_, i) => i !== index),
    )
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          console.log("Cloudinary URL:", data.url);
          updateFormData('image_url', data.url);
          toast({ title: t("success"), description: t("exerciseAdded") })
        } else {
          toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
        }
      } catch (err) {
        toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleImageUpload({ target: { files: [file] } } as any);
    }
  };

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      formData.muscleGroups.length === 0 ||
      formData.instructions.some((inst) => !inst.trim())
    ) {
      toast({ title: t("error"), description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      // ตรวจสอบว่า image_url เป็น url จริง (ไม่ใช่ blob:)
      const image_url = formData.image_url && !formData.image_url.startsWith('blob:')
        ? formData.image_url
        : "/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(formData.name);
      const exerciseData = {
        ...formData,
        instructions: formData.instructions.filter((inst) => inst.trim()),
        image_url,
        isCustom: true as const,
        userId: undefined, // or set to a number if available
        variations: Array.isArray(formData.variations)
          ? formData.variations.map((v: any) =>
              typeof v === 'string' ? { name: v, description: '' } : v
            )
          : [],
      };
      await onSave(exerciseData);
      toast({ title: t("success"), description: t("exerciseAdded") });
    } catch (error) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateSelect = (template: ExerciseTemplate) => {
    setFormData({
      name: template.name,
      category: template.category,
      muscleGroups: template.muscleGroups,
      difficulty: template.difficulty,
      equipment: template.equipment,
      description: template.description,
      instructions: template.instructions,
      image_url: "/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(template.name),
      estimatedDuration: template.estimatedDuration,
      benefits: template.benefits || [],
      tips: template.tips || [],
      variations: template.variations || [],
      recommendedSets: template.recommendedSets,
    })
    setShowTemplateSelector(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{exercise ? "Edit Custom Exercise" : "Create Custom Exercise"}</DialogTitle>
          <DialogDescription>
            {exercise ? "Update your custom exercise" : "Create a new exercise for your library"}
          </DialogDescription>
          <div className="flex justify-between items-center pt-4">
            <Button onClick={() => setShowTemplateSelector(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              {t('Use Template')}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Basic Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-name">{t('Exercise Name *')}</Label>
                    <Input
                      id="exercise-name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="e.g., Bulgarian Split Squats"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t('Category *')}</Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">{t('Difficulty *')}</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => updateFormData("difficulty", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipment">{t('Equipment *')}</Label>
                    <Select value={formData.equipment} onValueChange={(value) => updateFormData("equipment", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions.map((eq) => (
                          <SelectItem key={eq} value={eq}>
                            {eq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t('Description *')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Brief description of the exercise and what it targets..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">{t('Estimated Duration (minutes) *')}</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.estimatedDuration}
                    onChange={(e) => updateFormData("estimatedDuration", Number.parseInt(e.target.value) || 3)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Target Muscle Groups *')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.muscleGroups.map((muscle: string) => (
                    <Badge key={muscle} variant="secondary" className="flex items-center gap-1">
                      {muscle}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeMuscleGroup(muscle)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select value={newMuscleGroup} onValueChange={setNewMuscleGroup}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroupOptions
                        .filter((mg) => !formData.muscleGroups.includes(mg))
                        .map((muscle) => (
                          <SelectItem key={muscle} value={muscle}>
                            {muscle}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => {
                      addMuscleGroup(newMuscleGroup)
                      setNewMuscleGroup("")
                    }}
                    disabled={!newMuscleGroup}
                  >
                    {t('Add')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Exercise Image')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <div>
                    {formData.image_url
                      ? <img src={formData.image_url} alt={formData.name} className="w-full h-48 object-cover rounded-lg mx-auto" />
                      : <span>Drag & drop or click to upload image</span>
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Step-by-Step Instructions *')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium mt-1">
                      {index + 1}
                    </div>
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder={`Step ${index + 1} instructions...`}
                      rows={2}
                      className="flex-1"
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="mt-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addInstruction} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('Add Step')}
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Sets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Recommended Sets & Reps')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sets">{t('Sets')}</Label>
                    <Input
                      id="sets"
                      type="number"
                      min="1"
                      value={formData.recommendedSets.sets}
                      onChange={(e) =>
                        updateFormData("recommendedSets", {
                          ...formData.recommendedSets,
                          sets: Number.parseInt(e.target.value) || 3,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reps">{t('Reps')}</Label>
                    <Input
                      id="reps"
                      value={formData.recommendedSets.reps}
                      onChange={(e) =>
                        updateFormData("recommendedSets", {
                          ...formData.recommendedSets,
                          reps: e.target.value,
                        })
                      }
                      placeholder="e.g., 8-12, 30 seconds"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rest">{t('Rest (seconds)')}</Label>
                    <Input
                      id="rest"
                      type="number"
                      min="0"
                      value={formData.recommendedSets.rest || ""}
                      onChange={(e) =>
                        updateFormData("recommendedSets", {
                          ...formData.recommendedSets,
                          rest: Number.parseInt(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Benefits')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm flex-1">• {benefit}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit..."
                    onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                  />
                  <Button type="button" onClick={addBenefit} disabled={!newBenefit.trim()}>
                    {t('Add')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Tips & Safety')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm flex-1">💡 {tip}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTip(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    placeholder="Add a tip or safety note..."
                    onKeyPress={(e) => e.key === "Enter" && addTip()}
                  />
                  <Button type="button" onClick={addTip} disabled={!newTip.trim()}>
                    {t('Add')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Variations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Exercise Variations')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {formData.variations.map((variation, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{variation.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{variation.description}</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariation(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Input
                    value={newVariation.name}
                    onChange={(e) => setNewVariation((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Variation name..."
                  />
                  <Input
                    value={newVariation.description}
                    onChange={(e) => setNewVariation((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Variation description..."
                  />
                  <Button
                    type="button"
                    onClick={addVariation}
                    disabled={!newVariation.name.trim() || !newVariation.description.trim()}
                    className="w-full"
                  >
                    {t('Add Variation')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                {t('saving')}
              </>
            ) : (
              exercise ? t('Update Exercise') : t('Create Exercise')
            )}
          </Button>
        </div>
      </DialogContent>
      {showTemplateSelector && (
        <ExerciseTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </Dialog>
  )
}
