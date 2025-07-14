"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Info,
} from "lucide-react"
import { progressiveTemplates, calculateProgressionWeeks } from "@/lib/progressive-templates"
import type { ProgressiveExerciseTemplate, ProgressionLevel } from "@/lib/progressive-templates"
import { useToast } from "@/hooks/use-toast"

interface ProgressionRecord {
  templateId: string
  currentLevel: number
  startDate: string
  completedSessions: number
  totalSessions: number
  weekInLevel: number
  isActive: boolean
  notes: string[]
  createdAt: string
}

interface ProgressiveExerciseTrackerProps {
  onStartProgression?: (templateId: string) => void
  userEmail?: string
}

export function ProgressiveExerciseTracker({ onStartProgression, userEmail }: ProgressiveExerciseTrackerProps & { userEmail?: string }) {
  const [progressionRecords, setProgressionRecords] = useState<ProgressionRecord[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ProgressiveExerciseTemplate | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<ProgressionRecord | null>(null)
  const [showTemplateDetails, setShowTemplateDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!userEmail) return
    setLoading(true)
    fetch(`/api/progressions?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setProgressionRecords(data.progressions || []))
      .finally(() => setLoading(false))
  }, [userEmail])

  const startProgression = async (template: ProgressiveExerciseTemplate) => {
    if (!userEmail) return
    const newRecord: ProgressionRecord = {
      templateId: template.id,
      currentLevel: 1,
      startDate: new Date().toISOString(),
      completedSessions: 0,
      totalSessions: 0,
      weekInLevel: 1,
      isActive: true,
      notes: [],
      createdAt: new Date().toISOString(),
    }
    setLoading(true)
    try {
      const res = await fetch("/api/progressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRecord, userEmail }),
      })
      const data = await res.json()
      setProgressionRecords(prev => [...prev, data.progression])
      toast({ title: "Progression started", description: "New progression has been started." })
      if (onStartProgression) onStartProgression(template.id)
    } catch (error) {
      toast({ title: "Error", description: "Failed to start progression.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const updateProgression = async (recordIndex: number, updates: Partial<ProgressionRecord>) => {
    const record = progressionRecords[recordIndex]
    if (!record) return
    setLoading(true)
    try {
      const res = await fetch("/api/progressions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, ...updates }),
      })
      const data = await res.json()
      setProgressionRecords(prev => prev.map((r, idx) => idx === recordIndex ? data.progression : r))
      toast({ title: "Progression updated", description: "Progression has been updated." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update progression.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const advanceLevel = (recordIndex: number) => {
    const record = progressionRecords[recordIndex]
    const template = progressiveTemplates.find((t) => t.id === record.templateId)

    if (template && record.currentLevel < template.levels.length) {
      updateProgression(recordIndex, {
        currentLevel: record.currentLevel + 1,
        weekInLevel: 1,
        completedSessions: 0,
        totalSessions: 0,
        notes: [...record.notes, `Advanced to Level ${record.currentLevel + 1} on ${new Date().toLocaleDateString()}`],
      })
    }
  }

  const regressLevel = (recordIndex: number) => {
    const record = progressionRecords[recordIndex]

    if (record.currentLevel > 1) {
      updateProgression(recordIndex, {
        currentLevel: record.currentLevel - 1,
        weekInLevel: 1,
        completedSessions: 0,
        totalSessions: 0,
        notes: [...record.notes, `Regressed to Level ${record.currentLevel - 1} on ${new Date().toLocaleDateString()}`],
      })
    }
  }

  const pauseProgression = (recordIndex: number) => {
    updateProgression(recordIndex, { isActive: false })
  }

  const resumeProgression = (recordIndex: number) => {
    updateProgression(recordIndex, { isActive: true })
  }

  const resetProgression = (recordIndex: number) => {
    updateProgression(recordIndex, {
      currentLevel: 1,
      weekInLevel: 1,
      completedSessions: 0,
      totalSessions: 0,
      notes: [],
    })
  }

  const getProgressionProgress = (record: ProgressionRecord): number => {
    const template = progressiveTemplates.find((t) => t.id === record.templateId)
    if (!template) return 0

    const completedWeeks = calculateProgressionWeeks(template, record.currentLevel - 1) + record.weekInLevel - 1
    return (completedWeeks / template.totalWeeks) * 100
  }

  const getCurrentLevel = (record: ProgressionRecord): ProgressionLevel | null => {
    const template = progressiveTemplates.find((t) => t.id === record.templateId)
    return template ? template.levels[record.currentLevel - 1] : null
  }

  const activeProgressions = progressionRecords.filter((record) => record.isActive)
  const pausedProgressions = progressionRecords.filter((record) => !record.isActive)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progressive Exercise Tracker</h1>
          <p className="text-muted-foreground">Track your progression through structured exercise programs</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <TrendingUp className="w-4 h-4 mr-2" />
          {activeProgressions.length} Active
        </Badge>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Progressions ({activeProgressions.length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedProgressions.length})</TabsTrigger>
          <TabsTrigger value="templates">Available Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeProgressions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProgressions.map((record, index) => {
                const template = progressiveTemplates.find((t) => t.id === record.templateId)
                const currentLevel = getCurrentLevel(record)
                const progress = getProgressionProgress(record)

                if (!template || !currentLevel) return null

                return (
                  <Card key={`${record.templateId}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">Level {record.currentLevel}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{currentLevel.name}</h4>
                        <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Week in Level:</span>
                          <div className="font-medium">
                            {record.weekInLevel} / {currentLevel.targetWeeks}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sessions:</span>
                          <div className="font-medium">
                            {record.completedSessions} / {record.totalSessions}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Current Goals:</h5>
                        <div className="space-y-1 text-sm">
                          {currentLevel.progressionCriteria.reps && (
                            <div>Reps: {currentLevel.progressionCriteria.reps}</div>
                          )}
                          {currentLevel.progressionCriteria.sets && (
                            <div>Sets: {currentLevel.progressionCriteria.sets}</div>
                          )}
                          {currentLevel.progressionCriteria.duration && (
                            <div>Duration: {currentLevel.progressionCriteria.duration}s</div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => advanceLevel(progressionRecords.indexOf(record))}
                          disabled={record.currentLevel >= template.levels.length}
                        >
                          <ArrowUp className="w-4 h-4 mr-1" />
                          Advance
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => regressLevel(progressionRecords.indexOf(record))}
                          disabled={record.currentLevel <= 1}
                        >
                          <ArrowDown className="w-4 h-4 mr-1" />
                          Regress
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pauseProgression(progressionRecords.indexOf(record))}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRecord(record)
                            setSelectedTemplate(template)
                            setShowTemplateDetails(true)
                          }}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No active progressions</h3>
              <p className="text-muted-foreground mb-4">
                Start a progressive exercise program to track your improvement
              </p>
              <Button onClick={() => (document.querySelector('[data-value="templates"]') as HTMLElement)?.click()}>
                Browse Templates
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {pausedProgressions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pausedProgressions.map((record, index) => {
                const template = progressiveTemplates.find((t) => t.id === record.templateId)
                const currentLevel = getCurrentLevel(record)

                if (!template || !currentLevel) return null

                return (
                  <Card key={`paused-${record.templateId}-${index}`} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary">Paused</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium">{currentLevel.name}</h4>
                        <p className="text-sm text-muted-foreground">Level {record.currentLevel}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => resumeProgression(progressionRecords.indexOf(record))}>
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetProgression(progressionRecords.indexOf(record))}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pause className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No paused progressions</h3>
              <p className="text-muted-foreground">Paused progressions will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressiveTemplates.map((template) => {
              const isStarted = progressionRecords.some((record) => record.templateId === template.id)

              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant="outline">{template.levels.length} levels</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{template.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{template.totalWeeks} weeks total</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        <span>{template.movementPattern}</span>
                      </div>
                    </div>

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

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => startProgression(template)}
                        disabled={isStarted}
                        className="flex-1"
                      >
                        {isStarted ? "Already Started" : "Start Progression"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowTemplateDetails(true)
                        }}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Details Modal */}
      {selectedTemplate && showTemplateDetails && (
        <ProgressionTemplateModal
          template={selectedTemplate}
          record={selectedRecord}
          onClose={() => {
            setShowTemplateDetails(false)
            setSelectedTemplate(null)
            setSelectedRecord(null)
          }}
          onStartProgression={() => {
            startProgression(selectedTemplate)
            setShowTemplateDetails(false)
            setSelectedTemplate(null)
          }}
        />
      )}
    </div>
  )
}

interface ProgressionTemplateModalProps {
  template: ProgressiveExerciseTemplate
  record?: ProgressionRecord | null
  onClose: () => void
  onStartProgression: () => void
}

function ProgressionTemplateModal({ template, record, onClose, onStartProgression }: ProgressionTemplateModalProps) {
  const isStarted = !!record

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name}</span>
            {!isStarted && <Button onClick={onStartProgression}>Start Progression</Button>}
          </DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Program Details</h3>
                <div className="space-y-2 text-sm">
                  <div>Category: {template.category}</div>
                  <div>Movement Pattern: {template.movementPattern}</div>
                  <div>Equipment: {template.equipment}</div>
                  <div>Total Duration: {template.totalWeeks} weeks</div>
                  <div>Levels: {template.levels.length}</div>
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
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Safety Notes</h3>
                <ul className="text-sm space-y-1">
                  {template.safetyNotes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Progression Levels */}
          <div className="space-y-4">
            <h3 className="font-semibold">Progression Levels</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {template.levels.map((level, index) => (
                  <Card
                    key={index}
                    className={`${record && record.currentLevel === level.level ? "ring-2 ring-primary" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Level {level.level}: {level.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{level.targetWeeks} weeks</Badge>
                          {record && record.currentLevel === level.level && <Badge variant="default">Current</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{level.description}</p>

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Progression Criteria:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {level.progressionCriteria.reps && <div>Reps: {level.progressionCriteria.reps}</div>}
                          {level.progressionCriteria.sets && <div>Sets: {level.progressionCriteria.sets}</div>}
                          {level.progressionCriteria.duration && (
                            <div>Duration: {level.progressionCriteria.duration}s</div>
                          )}
                          {level.progressionCriteria.weight && <div>Weight: {level.progressionCriteria.weight}lbs</div>}
                        </div>
                      </div>

                      {level.progressionCriteria.form && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Form Requirements:</h5>
                          <ul className="text-sm space-y-1">
                            {level.progressionCriteria.form.map((requirement, reqIndex) => (
                              <li key={reqIndex} className="flex items-start">
                                <CheckCircle className="w-3 h-3 mr-2 text-green-500 mt-1 flex-shrink-0" />
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {level.prerequisites && (
                        <div className="text-sm">
                          <span className="font-medium">Prerequisites: </span>
                          <span className="text-muted-foreground">{level.prerequisites.join(", ")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">When to Progress</h3>
                <ul className="text-sm space-y-1">
                  {template.whenToProgress.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">When to Regress</h3>
                <ul className="text-sm space-y-1">
                  {template.whenToRegress.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowDown className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common Mistakes</h3>
                <ul className="text-sm space-y-1">
                  {template.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Alternative Exercises</h3>
                <div className="flex flex-wrap gap-2">
                  {template.alternativeExercises.map((exercise, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
