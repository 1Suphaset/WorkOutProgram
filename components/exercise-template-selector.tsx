"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Target, Heart, Zap, Trophy, Clock, Users, Filter } from "lucide-react"
import { exerciseTemplates, movementPatterns, getTemplatesByMovementPattern } from "@/lib/exercise-templates"
import type { ExerciseTemplate } from "@/lib/exercise-templates"
import { useTranslation } from "@/lib/i18n"

interface ExerciseTemplateSelectorProps {
  onSelectTemplate: (template: ExerciseTemplate) => void
  onClose: () => void
  language?: "en" | "th"
}

export function ExerciseTemplateSelector({ onSelectTemplate, onClose, language = "en" }: ExerciseTemplateSelectorProps) {
  const { t } = useTranslation(language)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMovementPattern, setSelectedMovementPattern] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<ExerciseTemplate | null>(null)

  const filteredTemplates = exerciseTemplates.filter((template) => {
    const matchesSearch =
      searchTerm === "" ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.movementPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.muscleGroups.some((muscle) => muscle.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesPattern = selectedMovementPattern === "all" || template.movementPattern === selectedMovementPattern
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesPattern && matchesCategory && matchesDifficulty
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Strength":
        return <Target className="w-4 h-4" />
      case "Cardio":
        return <Heart className="w-4 h-4" />
      case "Flexibility":
        return <Zap className="w-4 h-4" />
      case "Sports":
        return <Trophy className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedMovementPattern("all")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
  }

  const groupedByPattern = movementPatterns.reduce(
    (acc, pattern) => {
      const templates = getTemplatesByMovementPattern(pattern)
      if (templates.length > 0) {
        acc[pattern] = templates
      }
      return acc
    },
    {} as Record<string, ExerciseTemplate[]>,
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('exerciseTemplates.title')}</DialogTitle>
          <DialogDescription>
            {t('exerciseTemplates.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                {t('exerciseTemplates.searchFilter.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('exerciseTemplates.searchFilter.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={clearFilters} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('exerciseTemplates.searchFilter.clearFilters')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('exerciseTemplates.searchFilter.movementPattern')}</label>
                  <Select value={selectedMovementPattern} onValueChange={setSelectedMovementPattern}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('exerciseTemplates.searchFilter.allPatterns')}</SelectItem>
                      {movementPatterns.map((pattern) => (
                        <SelectItem key={pattern} value={pattern}>
                          {pattern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('exerciseTemplates.searchFilter.category')}</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('exerciseTemplates.searchFilter.allCategories')}</SelectItem>
                      <SelectItem value="Strength">{t('exerciseTemplates.searchFilter.strength')}</SelectItem>
                      <SelectItem value="Cardio">{t('exerciseTemplates.searchFilter.cardio')}</SelectItem>
                      <SelectItem value="Flexibility">{t('exerciseTemplates.searchFilter.flexibility')}</SelectItem>
                      <SelectItem value="Sports">{t('exerciseTemplates.searchFilter.sports')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('exerciseTemplates.searchFilter.difficulty')}</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('exerciseTemplates.searchFilter.allLevels')}</SelectItem>
                      <SelectItem value="Beginner">{t('exerciseTemplates.searchFilter.beginner')}</SelectItem>
                      <SelectItem value="Intermediate">{t('exerciseTemplates.searchFilter.intermediate')}</SelectItem>
                      <SelectItem value="Advanced">{t('exerciseTemplates.searchFilter.advanced')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Results */}
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">{t('exerciseTemplates.tabs.gridView')}</TabsTrigger>
              <TabsTrigger value="patterns">{t('exerciseTemplates.tabs.byMovementPattern')}</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${getDifficultyColor(template.difficulty)} text-white`}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="secondary">{template.movementPattern}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {template.muscleGroups.slice(0, 3).map((muscle) => (
                          <Badge key={muscle} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                        {template.muscleGroups.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.muscleGroups.length - 3}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {template.estimatedDuration}min
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template)}>
                            {t('exerciseTemplates.preview')}
                          </Button>
                          <Button size="sm" onClick={() => onSelectTemplate(template)}>
                            {t('exerciseTemplates.useTemplate')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns">
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {Object.entries(groupedByPattern).map(([pattern, templates]) => (
                    <div key={pattern} className="space-y-3">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        {pattern}
                        <Badge variant="secondary" className="ml-2">
                          {templates.length} {t('exerciseTemplates.templates')}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{template.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className={`${getDifficultyColor(template.difficulty)} text-white text-xs`}
                                    >
                                      {template.difficulty}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {template.category}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-1 ml-4">
                                  <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template)}>
                                    {t('exerciseTemplates.preview')}
                                  </Button>
                                  <Button size="sm" onClick={() => onSelectTemplate(template)}>
                                    {t('exerciseTemplates.use')}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">{t('exerciseTemplates.noTemplatesFound')}</h3>
              <p className="text-muted-foreground">{t('exerciseTemplates.tryAdjusting')}</p>
            </div>
          )}
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <TemplatePreviewModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onUseTemplate={() => {
              onSelectTemplate(selectedTemplate)
              setSelectedTemplate(null)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface TemplatePreviewModalProps {
  template: ExerciseTemplate
  onClose: () => void
  onUseTemplate: () => void
}

function TemplatePreviewModal({ template, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  const { t } = useTranslation("en")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            <Button onClick={onUseTemplate}>{t('exerciseTemplates.useThisTemplate')}</Button>
          </DialogTitle>
          <DialogDescription>{t('exerciseTemplates.movementPattern')}: {template.movementPattern}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('exerciseTemplates.templateDetails')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseTemplates.category')}:</span>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseTemplates.difficulty')}:</span>
                    <Badge className={`${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseTemplates.equipment')}:</span>
                    <Badge variant="outline">{template.equipment}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseTemplates.duration')}:</span>
                    <span className="text-sm">{template.estimatedDuration} {t('exerciseTemplates.minutes')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('exerciseTemplates.targetMuscles')}</h3>
                <div className="flex flex-wrap gap-2">
                  {template.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('exerciseTemplates.recommendedSets')}</h3>
                <div className="text-sm space-y-1">
                  <div>{t('exerciseTemplates.sets')}: {template.recommendedSets.sets}</div>
                  <div>{t('exerciseTemplates.reps')}: {template.recommendedSets.reps}</div>
                  <div>{t('exerciseTemplates.rest')}: {template.recommendedSets.rest} {t('exerciseTemplates.seconds')}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('exerciseTemplates.description')}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('exerciseTemplates.benefits')}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('exerciseTemplates.templateInstructions')}</h3>
            <div className="space-y-3">
              {template.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('exerciseTemplates.formTips')}</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <ul className="text-sm space-y-2">
                {template.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Variations */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('exerciseTemplates.commonVariations')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.variations.map((variation, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1">{variation.name}</h4>
                  <p className="text-xs text-muted-foreground">{variation.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-semibold">{t('exerciseTemplates.tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
