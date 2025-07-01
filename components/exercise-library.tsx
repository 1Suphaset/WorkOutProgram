"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Plus, Star, Clock, Target, Zap, Heart, Edit, Trash2 } from "lucide-react"
import { exerciseDatabase } from "@/lib/exercise-database"
import type { ExerciseLibraryItem } from "@/lib/exercise-database"
import { CustomExerciseForm } from "@/components/custom-exercise-form"
import type { CustomExercise as CustomExerciseType } from "@/lib/exercise-database"
import { ProgressiveExerciseTracker } from "@/components/progressive-exercise-tracker"
import { FitnessAssessment } from "@/components/fitness-assessment"

interface ExerciseLibraryProps {
  onAddToWorkout?: (exercise: ExerciseLibraryItem) => void
  showAddButton?: boolean
  exerciseDatabase?: ExerciseLibraryItem[]
}

export function ExerciseLibrary({ onAddToWorkout, showAddButton = false, exerciseDatabase: propExerciseDatabase }: ExerciseLibraryProps) {
  const exerciseDatabase = propExerciseDatabase || require("@/lib/exercise-database").exerciseDatabase;
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all")
  const [selectedExercise, setSelectedExercise] = useState<ExerciseLibraryItem | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const [customExercises, setCustomExercises] = useState<CustomExerciseType[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [editingCustomExercise, setEditingCustomExercise] = useState<CustomExerciseType | null>(null)

  useEffect(() => {
    const savedCustomExercises = localStorage.getItem("workout-planner-custom-exercises")
    if (savedCustomExercises) {
      setCustomExercises(JSON.parse(savedCustomExercises))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("workout-planner-custom-exercises", JSON.stringify(customExercises))
  }, [customExercises])

  // Get unique values for filters
  const categories: string[] = Array.from(new Set(exerciseDatabase.map((ex: ExerciseLibraryItem) => ex.category)));
  const muscleGroups: string[] = Array.from(new Set(exerciseDatabase.flatMap((ex: ExerciseLibraryItem) => ex.muscleGroups)));
  const difficulties: string[] = Array.from(new Set(exerciseDatabase.map((ex: ExerciseLibraryItem) => ex.difficulty)));
  const equipment: string[] = Array.from(new Set(exerciseDatabase.map((ex: ExerciseLibraryItem) => ex.equipment)));

  // Filter exercises based on search and filters
  const allExercises = [...exerciseDatabase, ...customExercises]
  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise: ExerciseLibraryItem) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some((mg: string) => mg.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
      const matchesMuscleGroup = selectedMuscleGroup === "all" || exercise.muscleGroups.includes(selectedMuscleGroup)
      const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty
      const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment

      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesDifficulty && matchesEquipment
    })
  }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedDifficulty, selectedEquipment, customExercises])

  const toggleFavorite = (exerciseId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(exerciseId)) {
        newFavorites.delete(exerciseId)
      } else {
        newFavorites.add(exerciseId)
      }
      return newFavorites
    })
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Strength":
        return <Target className="w-4 h-4" />
      case "Cardio":
        return <Heart className="w-4 h-4" />
      case "Flexibility":
        return <Zap className="w-4 h-4" />
      case "Sports":
        return <Target className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedMuscleGroup("all")
    setSelectedDifficulty("all")
    setSelectedEquipment("all")
  }

  const handleCreateCustomExercise = () => {
    setEditingCustomExercise(null)
    setShowCustomForm(true)
  }

  const handleEditCustomExercise = (exercise: CustomExerciseType) => {
    setEditingCustomExercise(exercise)
    setShowCustomForm(true)
  }

  const handleSaveCustomExercise = (exerciseData: Omit<CustomExerciseType, "id" | "createdAt">) => {
    if (editingCustomExercise) {
      setCustomExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingCustomExercise.id
            ? {
                ...exerciseData,
                id: editingCustomExercise.id,
                createdAt: editingCustomExercise.createdAt,
                isCustom: true,
              }
            : ex,
        ),
      )
    } else {
      const newExercise: CustomExerciseType = {
        ...exerciseData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        isCustom: true,
      }
      setCustomExercises((prev) => [...prev, newExercise])
    }
    setShowCustomForm(false)
  }

  const handleDeleteCustomExercise = (exerciseId: number) => {
    if (confirm("Are you sure you want to delete this custom exercise?")) {
      setCustomExercises((prev) => prev.filter((ex) => ex.id !== exerciseId))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground">Discover exercises with detailed instructions and demonstrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateCustomExercise}>
            <Plus className="w-4 h-4 mr-2" />
            Create Exercise
          </Button>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {filteredExercises.length} exercises
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search exercises, muscle groups, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={clearFilters} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category || 'all'}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Muscle Group</label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscles</SelectItem>
                  {muscleGroups.map((muscle: string) => (
                    <SelectItem key={muscle} value={muscle || 'all'}>
                      {muscle}
                    </SelectItem>
                  ))}
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
                  {difficulties.map((difficulty: string) => (
                    <SelectItem key={difficulty} value={difficulty || 'all'}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Equipment</label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {equipment.map((eq: string) => (
                    <SelectItem key={eq} value={eq || 'all'}>
                      {eq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.size})</TabsTrigger>
          <TabsTrigger value="progressions">Progressive Programs</TabsTrigger>
          <TabsTrigger value="assessment">Fitness Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.filter((exercise: ExerciseLibraryItem) => exercise.id !== 0).map((exercise: ExerciseLibraryItem) => (
              <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={exercise.imageUrl || "/placeholder.svg"}
                    alt={exercise.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {exercise.isCustom && (
                    <Badge variant="outline" className="absolute top-2 left-2 bg-white/80">
                      Custom
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(exercise.id)
                    }}
                  >
                    <Star
                      className={`w-4 h-4 ${favorites.has(exercise.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    {getCategoryIcon(exercise.category)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty)} text-white`}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="secondary">{exercise.equipment}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.slice(0, 3).map((muscle) => (
                      <Badge key={String(muscle)} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                    {exercise.muscleGroups.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{exercise.muscleGroups.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {exercise.estimatedDuration}min
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedExercise(exercise)}>
                        View
                      </Button>
                      {showAddButton && onAddToWorkout && (
                        <Button size="sm" onClick={() => onAddToWorkout(exercise)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                      {exercise.isCustom && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomExercise(exercise as CustomExerciseType)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCustomExercise(exercise.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredExercises.filter((exercise: ExerciseLibraryItem) => exercise.id !== 0).map((exercise: ExerciseLibraryItem) => (
              <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={exercise.imageUrl || "/placeholder.svg"}
                      alt={exercise.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{exercise.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleFavorite(exercise.id)}>
                            <Star
                              className={`w-4 h-4 ${favorites.has(exercise.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                            />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSelectedExercise(exercise)}>
                            View Details
                          </Button>
                          {showAddButton && onAddToWorkout && (
                            <Button size="sm" onClick={() => onAddToWorkout(exercise)}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          )}
                          {exercise.isCustom && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCustomExercise(exercise as CustomExerciseType)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCustomExercise(exercise.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty)} text-white`}>
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="secondary">{exercise.category}</Badge>
                        <Badge variant="outline">{exercise.equipment}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {exercise.estimatedDuration}min
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups.map((muscle) => (
                          <Badge key={String(muscle)} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exerciseDatabase
              .filter((exercise) => favorites.has(exercise.id))
              .map((exercise) => (
                <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={exercise.imageUrl || "/placeholder.svg"}
                      alt={exercise.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(exercise.id)}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty)} text-white w-fit`}>
                      {exercise.difficulty}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedExercise(exercise)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            {favorites.size === 0 && (
              <div className="col-span-full text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Click the star icon on exercises to add them to your favorites</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progressions">
          <ProgressiveExerciseTracker />
        </TabsContent>

        <TabsContent value="assessment">
          <FitnessAssessment />
        </TabsContent>
      </Tabs>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No exercises found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToWorkout={onAddToWorkout}
          showAddButton={showAddButton}
          isFavorite={favorites.has(selectedExercise.id)}
          onToggleFavorite={() => toggleFavorite(selectedExercise.id)}
        />
      )}

      {showCustomForm && (
        <CustomExerciseForm
          exercise={editingCustomExercise}
          onSave={handleSaveCustomExercise}
          onClose={() => setShowCustomForm(false)}
        />
      )}
    </div>
  )
}

interface ExerciseDetailModalProps {
  exercise: ExerciseLibraryItem
  onClose: () => void
  onAddToWorkout?: (exercise: ExerciseLibraryItem) => void
  showAddButton?: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
}

function ExerciseDetailModal({
  exercise,
  onClose,
  onAddToWorkout,
  showAddButton,
  isFavorite,
  onToggleFavorite,
}: ExerciseDetailModalProps) {
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
            <span>{exercise.name}</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onToggleFavorite}>
                <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              {showAddButton && onAddToWorkout && (
                <Button onClick={() => onAddToWorkout(exercise)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Workout
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>Detailed exercise instructions and demonstration</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Image */}
          <div className="relative">
            <img
              src={exercise.imageUrl || "/placeholder.svg"}
              alt={exercise.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Exercise Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Exercise Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Category:</span>
                    <Badge variant="secondary">{exercise.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Difficulty:</span>
                    <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Equipment:</span>
                    <Badge variant="outline">{exercise.equipment}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{exercise.estimatedDuration} minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((muscle) => (
                    <Badge key={String(muscle)} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              {exercise.recommendedSets && (
                <div>
                  <h3 className="font-semibold mb-2">Recommended</h3>
                  <div className="text-sm space-y-1">
                    <div>Sets: {exercise.recommendedSets.sets}</div>
                    <div>Reps: {exercise.recommendedSets.reps}</div>
                    {exercise.recommendedSets.rest && <div>Rest: {exercise.recommendedSets.rest} seconds</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
              </div>

              {exercise.benefits && exercise.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Benefits</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {exercise.benefits.map((benefit, index) => (
                      <li key={String(index)} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Step-by-Step Instructions</h3>
            <div className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <div key={String(index)} className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Safety */}
          {exercise.tips && exercise.tips.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Tips & Safety</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="text-sm space-y-2">
                  {exercise.tips.map((tip, index) => (
                    <li key={String(index)} className="flex items-start">
                      <span className="mr-2 text-primary">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Variations */}
          {exercise.variations && exercise.variations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.variations.map((variation, index) => (
                  <div key={String(index)} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">{variation.name}</h4>
                    <p className="text-xs text-muted-foreground">{variation.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
