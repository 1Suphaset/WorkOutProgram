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

interface ExerciseTemplateSelectorProps {
  onSelectTemplate: (template: ExerciseTemplate) => void
  onClose: () => void
}

export function ExerciseTemplateSelector({ onSelectTemplate, onClose }: ExerciseTemplateSelectorProps) {
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
          <DialogTitle>Exercise Templates</DialogTitle>
          <DialogDescription>
            Choose from movement pattern templates to quickly create exercises with proper form and structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filter Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search templates by name, movement pattern, or muscle groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={clearFilters} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Movement Pattern</label>
                  <Select value={selectedMovementPattern} onValueChange={setSelectedMovementPattern}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patterns</SelectItem>
                      {movementPatterns.map((pattern) => (
                        <SelectItem key={pattern} value={pattern}>
                          {pattern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Flexibility">Flexibility</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Results */}
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="patterns">By Movement Pattern</TabsTrigger>
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
                            Preview
                          </Button>
                          <Button size="sm" onClick={() => onSelectTemplate(template)}>
                            Use Template
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
                          {templates.length} templates
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
                                    Preview
                                  </Button>
                                  <Button size="sm" onClick={() => onSelectTemplate(template)}>
                                    Use
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
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
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
            <Button onClick={onUseTemplate}>Use This Template</Button>
          </DialogTitle>
          <DialogDescription>Movement Pattern: {template.movementPattern}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Template Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Category:</span>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Difficulty:</span>
                    <Badge className={`${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Equipment:</span>
                    <Badge variant="outline">{template.equipment}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{template.estimatedDuration} minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {template.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Recommended Sets</h3>
                <div className="text-sm space-y-1">
                  <div>Sets: {template.recommendedSets.sets}</div>
                  <div>Reps: {template.recommendedSets.reps}</div>
                  <div>Rest: {template.recommendedSets.rest} seconds</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
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
            <h3 className="font-semibold">Template Instructions</h3>
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
            <h3 className="font-semibold">Form Tips</h3>
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
            <h3 className="font-semibold">Common Variations</h3>
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
            <h3 className="font-semibold">Tags</h3>
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
