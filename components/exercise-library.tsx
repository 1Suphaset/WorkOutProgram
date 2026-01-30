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
import { CustomExerciseForm } from "@/components/custom-exercise-form"
import { ProgressiveExerciseTracker } from "@/components/progressive-exercise-tracker"
import { FitnessAssessment } from "@/components/fitness-assessment"
import { useTranslation } from "@/lib/i18n"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Exercise } from "@/lib/utils"

interface ExerciseLibraryProps {
  onAddToWorkout?: (exercise: Exercise) => void
  showAddButton?: boolean
  exerciseDatabase?: Exercise[]
  language?: "en" | "th"
  userEmail?: string
  minimalView?: boolean
}

function mapExerciseFromDB(dbExercise: unknown): Exercise {
  const ex = dbExercise as any;
  return {
    ...ex,
    muscleGroups: ex.muscle_groups || ex.muscleGroups,
    imageUrl: ex.image_url || ex.imageUrl,
    estimatedDuration: ex.estimated_duration || ex.estimatedDuration,
    isCustom: ex.is_custom || ex.isCustom,
    createdAt: ex.created_at || ex.createdAt,
    userId: ex.user_id || ex.userId,
  };
}

export function ExerciseLibrary({ onAddToWorkout, showAddButton = false, exerciseDatabase: propExerciseDatabase, language = "en", userEmail, minimalView = false }: ExerciseLibraryProps) {
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const exerciseDatabase = minimalView ? (propExerciseDatabase || []) : (propExerciseDatabase || []).map(mapExerciseFromDB);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("exerciseFavorites");
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  });

  const [customExercises, setCustomExercises] = useState<Exercise[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [editingCustomExercise, setEditingCustomExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<{ [id: number]: boolean }>({})

  // ดึง custom exercises จาก API
  useEffect(() => {
    if (!userEmail) return
    setLoading(true)
    fetch(`/api/exercises?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setCustomExercises((data.exercises || []).filter((ex: unknown) => (ex as Exercise).isCustom).map(mapExerciseFromDB)))
      .finally(() => setLoading(false))
  }, [userEmail])

  // เพิ่ม custom exercise
  const addCustomExercise = async (exercise: Exercise) => {
    if (!userEmail) return
    setActionLoading((prev) => ({ ...prev, add: true }))
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...exercise, userEmail, createdAt: new Date().toISOString() }),
      })
      const data = await res.json()
      setCustomExercises(prev => [...prev, data.exercise])
      toast({ title: t("success"), description: t("exerciseAdded") })
    } catch (error) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
    } finally {
      setActionLoading((prev) => ({ ...prev, add: false }))
    }
  }

  // แก้ไข custom exercise
  const updateCustomExercise = async (id: number, updates: Partial<Exercise>) => {
    const exercise = customExercises.find(ex => ex.id === id)
    if (!exercise) return
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch("/api/exercises", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...exercise, ...updates }),
      })
      const data = await res.json()
      setCustomExercises(prev => prev.map(ex => ex.id === id ? data.exercise : ex))
      toast({ title: t("success"), description: t("exerciseUpdated") })
    } catch (error) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  // ลบ custom exercise
  const deleteCustomExercise = async (id: number) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      await fetch("/api/exercises", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setCustomExercises(prev => prev.filter(ex => ex.id !== id))
      toast({ title: t("success"), description: t("exerciseDeleted") })
    } catch (error) {
      toast({ title: t("error"), description: t("errorOccurred"), variant: "destructive" })
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Get unique values for filters
  const categories: string[] = Array.from(new Set(exerciseDatabase.map((ex: Exercise) => ex.category)));
  const muscleGroups: string[] = Array.from(new Set(
    exerciseDatabase.flatMap((ex: Exercise) =>
      Array.isArray(ex.muscleGroups)
        ? ex.muscleGroups.map(mg => mg && mg.trim()).filter(Boolean)
        : []
    )
  )).sort((a, b) => a.localeCompare(b));
  const difficulties: string[] = Array.from(new Set(exerciseDatabase.map((ex: Exercise) => ex.difficulty).filter((d): d is string => !!d)));
  const equipment: string[] = Array.from(new Set(exerciseDatabase.map((ex: Exercise) => ex.equipment).filter((e): e is string => !!e)));

  // รวม customExercises กับ exerciseDatabase ใน allExercises
  const allExercises = useMemo(() => {
    const mappedPropExercises = (propExerciseDatabase || []).map(mapExerciseFromDB)
    const mappedCustomExercises = customExercises.map(mapExerciseFromDB)
    return [...mappedPropExercises, ...mappedCustomExercises]
  }, [propExerciseDatabase, customExercises])

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise: Exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.some((mg: string) => mg.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
      const matchesMuscleGroup = selectedMuscleGroup === "all" || (Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.includes(selectedMuscleGroup))
      const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty
      const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment

      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesDifficulty && matchesEquipment
    })
  }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedDifficulty, selectedEquipment, allExercises])

  const toggleFavorite = (exerciseId: number) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(exerciseId)) {
        newFavs.delete(exerciseId);
      } else {
        newFavs.add(exerciseId);
      }
      localStorage.setItem("exerciseFavorites", JSON.stringify(Array.from(newFavs)));
      return newFavs;
    });
  };

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

  const handleEditExercise = (exercise: Exercise) => {
    setEditingCustomExercise(exercise as Exercise)
    setShowCustomForm(true)
  }

  const handleSaveExercise = (exerciseData: Omit<Exercise, "id" | "createdAt">) => {
    if (editingCustomExercise) {
      if (allExercises.some(ex => ex.id === editingCustomExercise.id)) {
        updateExercise(editingCustomExercise.id, exerciseData)
      }
    } else {
      addCustomExercise(exerciseData as Exercise)
    }
    setShowCustomForm(false)
  }

  const handleDeleteExercise = (exerciseId: number) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(exerciseId)
    }
  }

  // เพิ่ม exercise ใหม่ (POST)
  const addExercise = async (exercise: Exercise) => {
    if (!userEmail) return
    setLoading(true)
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...exercise, userEmail, createdAt: new Date().toISOString() }),
    })
    const data = await res.json()
    // Refresh custom exercises instead of manually updating
    fetchCustomExercises()
    setLoading(false)
  }

  // แก้ไข exercise (PUT)
  const updateExercise = async (id: number, updates: Partial<Exercise>) => {
    const exercise = allExercises.find(ex => ex.id === id)
    if (!exercise) return
    setLoading(true)
    const res = await fetch("/api/exercises", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...exercise, ...updates }),
    })
    const data = await res.json()
    // Refresh custom exercises instead of manually updating
    fetchCustomExercises()
    setLoading(false)
  }

  // ลบ exercise (DELETE)
  const deleteExercise = async (id: number) => {
    setLoading(true)
    await fetch("/api/exercises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    // Refresh custom exercises instead of manually updating
    fetchCustomExercises()
    setLoading(false)
  }

  // Helper function to fetch custom exercises
  const fetchCustomExercises = async () => {
    if (!userEmail) return
    try {
      const res = await fetch(`/api/exercises?user=${encodeURIComponent(userEmail)}`)
      const data = await res.json()
      setCustomExercises((data.exercises || []).filter((ex: unknown) => (ex as Exercise).isCustom).map(mapExerciseFromDB))
    } catch (error) {
      console.error('Error fetching custom exercises:', error)
    }
  }

  if (minimalView) {
    return (
      <div>
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            type="text"
            placeholder={t('exerciseLibrary.searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder={t('exerciseLibrary.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder={t('exerciseLibrary.muscleGroup')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Muscles</SelectItem>
              {muscleGroups.map((mg) => (
                <SelectItem key={mg} value={mg}>{mg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* List View */}
        <div className="grid grid-cols-1 gap-4">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="flex flex-row items-center gap-4 p-2">
              <img src={exercise.image_url || exercise.image_url || "/placeholder.svg"} alt={exercise.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{exercise.name}</div>
                <div className="text-xs text-muted-foreground">{exercise.category} | {exercise.difficulty}</div>
                <div className="text-xs text-muted-foreground">{exercise.muscleGroups?.join(", ")}</div>
              </div>
              {showAddButton && onAddToWorkout && (
                <Button size="sm" onClick={() => onAddToWorkout(exercise)}>
                  Add
                </Button>
              )}
            </Card>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No exercises found</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('exerciseLibrary.title')}</h1>
          <p className="text-muted-foreground">{t('exerciseLibrary.description')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateCustomExercise}>
            <Plus className="w-4 h-4 mr-2" />
            {t('exerciseLibrary.createExerciseButton')}
          </Button>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {filteredExercises.length} {t('exerciseLibrary.exercises')}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            {t('exerciseLibrary.searchFilterTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('exerciseLibrary.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={clearFilters} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {t('exerciseLibrary.clearFiltersButton')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('exerciseLibrary.categoryLabel')}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exerciseLibrary.allCategories')}</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category || 'all'}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t('exerciseLibrary.muscleGroupLabel')}</label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exerciseLibrary.allMuscles')}</SelectItem>
                  {muscleGroups.map((muscle: string, idx: number) => (
                    <SelectItem key={muscle || `all-${idx}`} value={muscle || 'all'}>
                      {muscle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t('exerciseLibrary.difficultyLabel')}</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exerciseLibrary.allLevels')}</SelectItem>
                  {difficulties.map((difficulty: string) => (
                    <SelectItem key={difficulty} value={difficulty || 'all'}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t('exerciseLibrary.equipmentLabel')}</label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exerciseLibrary.allEquipment')}</SelectItem>
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
          <TabsTrigger value="grid">{t('exerciseLibrary.gridView')}</TabsTrigger>
          <TabsTrigger value="list">{t('exerciseLibrary.listView')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('exerciseLibrary.favorites')}({favorites.size})</TabsTrigger>
          <TabsTrigger value="progressions">{t('exerciseLibrary.progressivePrograms')}</TabsTrigger>
          <TabsTrigger value="assessment">{t('exerciseLibrary.fitnessAssessment')}</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.filter((exercise: Exercise) => exercise.id !== 0).map((exercise: Exercise) => (
              <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={exercise.image_url || exercise.image_url || "/placeholder.svg"}
                    alt={exercise.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {exercise.isCustom && (
                    <Badge variant="outline" className="absolute top-2 left-2 bg-white/80">
                      {t('exerciseLibrary.custom')}
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
                    <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty ?? "")} text-white`}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="secondary">{exercise.equipment}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(exercise.muscleGroups) &&
                      exercise.muscleGroups.slice(0, 3).map((muscle) => (
                      <Badge key={String(muscle)} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                      ))
                    }
                    {Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.length > 3 && (
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
                        {t('exerciseLibrary.view')}
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
                            onClick={() => handleEditExercise(exercise)}
                            disabled={!!actionLoading[exercise.id]}
                          >
                            {actionLoading[exercise.id] ? (
                              <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                            ) : (
                              <Edit className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteExercise(exercise.id)}
                            disabled={!!actionLoading[exercise.id]}
                          >
                            {actionLoading[exercise.id] ? (
                              <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
          <div className="space-y-4">
            {filteredExercises.filter((exercise: Exercise) => exercise.id !== 0).map((exercise: Exercise) => (
              <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={exercise.image_url || exercise.image_url || "/placeholder.svg"}
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
                            {t('exerciseLibrary.viewDetails')}
                          </Button>
                          {showAddButton && onAddToWorkout && (
                            <Button size="sm" onClick={() => onAddToWorkout(exercise)}>
                              <Plus className="w-4 h-4 mr-2" />
                              {t('exerciseLibrary.add')}
                            </Button>
                          )}
                          {exercise.isCustom && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditExercise(exercise)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteExercise(exercise.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty ?? "")} text-white`}>
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
                        {Array.isArray(exercise.muscleGroups) &&
                          exercise.muscleGroups.map((muscle) => (
                          <Badge key={String(muscle)} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                          ))
                        }
                      </div>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.filter((exercise: Exercise) => favorites.has(exercise.id)).map((exercise: Exercise) => (
              <Card key={String(exercise.id) + '-' + exercise.name} className="hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={exercise.image_url || exercise.image_url || "/placeholder.svg"}
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
                  <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty ?? "")} text-white w-fit`}>
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
                    {t('exerciseLibrary.viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {favorites.size === 0 && (
              <div className="col-span-full text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">{t('exerciseLibrary.noFavoritesYet')}</h3>
                <p className="text-muted-foreground">{t('exerciseLibrary.clickStarIcon')}</p>
              </div>
            )}
          </div>
          )}
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
          <h3 className="text-lg font-medium mb-2">{t('exerciseLibrary.noExercisesFound')}</h3>
          <p className="text-muted-foreground">{t('exerciseLibrary.tryAdjusting')}</p>
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
          exercise={editingCustomExercise ? { 
            ...editingCustomExercise, 
            image_url: editingCustomExercise.image_url || editingCustomExercise.image_url, 
            isCustom: true as const, 
            createdAt: editingCustomExercise.createdAt || "",
            category: editingCustomExercise.category as "Strength" | "Cardio" | "Flexibility" | "Sports",
            difficulty: editingCustomExercise.difficulty as "Beginner" | "Intermediate" | "Advanced"
          } : undefined}
          onSave={handleSaveExercise}
          onClose={() => setShowCustomForm(false)}
          language={language}
        />
      )}
    </div>
  )
}

interface ExerciseDetailModalProps {
  exercise: Exercise
  onClose: () => void
  onAddToWorkout?: (exercise: Exercise) => void
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
            <span>{exercise.name}</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onToggleFavorite}>
                <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              {showAddButton && onAddToWorkout && (
                <Button onClick={() => onAddToWorkout(exercise)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('exerciseLibrary.addToWorkout')}
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>{t('exerciseLibrary.detailedExerciseInstructions')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Image */}
          <div className="relative">
            <img
              src={exercise.image_url || exercise.image_url || "/placeholder.svg"}
              alt={exercise.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Exercise Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('exerciseLibrary.exerciseDetails')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseLibrary.category')}:</span>
                    <Badge variant="secondary">{exercise.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseLibrary.difficulty')}:</span>
                    <Badge className={`${getDifficultyColor(exercise.difficulty ?? "")} text-white`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseLibrary.equipment')}:</span>
                    <Badge variant="outline">{exercise.equipment}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{t('exerciseLibrary.duration')}:</span>
                    <span className="text-sm">{exercise.estimatedDuration} {t('exerciseLibrary.minutes')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('exerciseLibrary.targetMuscles')}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(exercise.muscleGroups) &&
                    exercise.muscleGroups.map((muscle) => (
                    <Badge key={String(muscle)} variant="outline">
                      {muscle}
                    </Badge>
                    ))
                  }
                </div>
              </div>

              {exercise.recommendedSets && (
                <div>
                  <h3 className="font-semibold mb-2">{t('exerciseLibrary.recommended')}</h3>
                  <div className="text-sm space-y-1">
                    <div>{t('exerciseLibrary.sets')}: {exercise.recommendedSets.sets}</div>
                    <div>{t('exerciseLibrary.reps')}: {exercise.recommendedSets.reps}</div>
                    {exercise.recommendedSets.rest && <div>{t('exerciseLibrary.rest')}: {exercise.recommendedSets.rest} {t('exerciseLibrary.seconds')}</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('exerciseLibrary.description')}</h3>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
              </div>

              {Array.isArray(exercise.benefits) && exercise.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">{t('exerciseLibrary.benefits')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {exercise.benefits.map((benefit: string) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('exerciseLibrary.stepByStepInstructions')}</h3>
            <div className="space-y-3">
              {exercise.instructions?.map((instruction, index) => (
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
          {Array.isArray(exercise.tips) && exercise.tips.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{t('exerciseLibrary.tipsSafety')}</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="text-sm space-y-2">
                  {exercise.tips.map((tip: string) => (
                    <li key={tip} className="flex items-start">
                      <span className="mr-2 text-primary">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Variations */}
          {Array.isArray(exercise.variations) && exercise.variations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{t('exerciseLibrary.variations')}</h3>
              <div className="flex flex-col gap-1 mt-2">
                {exercise.variations.map((variation: { name: string; description: string }) => (
                  <div key={variation.name} className="text-xs">
                    <span className="font-semibold">{variation.name}:</span> {variation.description}
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
