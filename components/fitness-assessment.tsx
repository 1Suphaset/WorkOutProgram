"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Target, TrendingUp, Play, RotateCcw, FileText, Award, ArrowRight } from "lucide-react"
import {
  fitnessAssessments,
  calculateAssessmentScore,
  getOverallFitnessLevel,
  getRecommendedProgressions,
} from "@/lib/fitness-assessments"
import type { AssessmentQuestion, AssessmentResult, UserAssessment } from "@/lib/fitness-assessments"
import { progressiveTemplates } from "@/lib/progressive-templates"

interface FitnessAssessmentProps {
  onAssessmentComplete?: (assessment: UserAssessment) => void
  userEmail?: string
}

export function FitnessAssessment({ onAssessmentComplete, userEmail }: FitnessAssessmentProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({})
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [savedAssessments, setSavedAssessments] = useState<UserAssessment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userEmail) return
    setLoading(true)
    fetch(`/api/assessments?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setSavedAssessments(data.assessments || []))
      .finally(() => setLoading(false))
  }, [userEmail])

  const currentCategory = fitnessAssessments[currentCategoryIndex]
  const currentQuestion = currentCategory?.questions[currentQuestionIndex]
  const totalQuestions = fitnessAssessments.reduce((sum, category) => sum + category.questions.length, 0)
  const answeredQuestions = Object.values(answers).reduce(
    (sum, categoryAnswers) => sum + Object.keys(categoryAnswers).length,
    0,
  )
  const progressPercentage = (answeredQuestions / totalQuestions) * 100

  const setAnswer = (categoryId: string, questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionId]: value,
      },
    }))
  }

  const getCurrentAnswer = () => {
    return answers[currentCategory.id]?.[currentQuestion.id]
  }

  const canProceed = () => {
    const answer = getCurrentAnswer()
    return answer !== undefined && answer !== null && answer !== ""
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentCategoryIndex < fitnessAssessments.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      completeAssessment()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
      setCurrentQuestionIndex(fitnessAssessments[currentCategoryIndex - 1].questions.length - 1)
    }
  }

  const completeAssessment = async () => {
    const results = fitnessAssessments.map((category) => calculateAssessmentScore(category, answers[category.id] || {}))
    const overallLevel = getOverallFitnessLevel(results)
    const recommendedProgressions = getRecommendedProgressions(results)
    const assessment: UserAssessment = {
      completedAt: new Date().toISOString(),
      results,
      overallFitnessLevel: overallLevel,
      recommendedProgressions,
      createdAt: new Date().toISOString(),
    }
    setAssessmentResults(results)
    setIsAssessmentComplete(true)
    setShowResults(true)
    if (userEmail) {
      setLoading(true)
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...assessment, userEmail }),
      })
      const data = await res.json()
      setSavedAssessments(prev => [...prev, data.assessment])
      setLoading(false)
    }
    if (onAssessmentComplete) {
      onAssessmentComplete(assessment)
    }
  }

  const restartAssessment = () => {
    setCurrentCategoryIndex(0)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsAssessmentComplete(false)
    setAssessmentResults([])
    setShowResults(false)
  }

  const renderQuestion = (question: AssessmentQuestion) => {
    const currentAnswer = getCurrentAnswer()

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) => setAnswer(currentCategory.id, question.id, Number.parseInt(value))}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "scale":
        return (
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={[currentAnswer || question.scaleMin || 1]}
                onValueChange={(value) => setAnswer(currentCategory.id, question.id, value[0])}
                min={question.scaleMin || 1}
                max={question.scaleMax || 5}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.scaleLabels?.min}</span>
              <span className="font-medium">{currentAnswer || question.scaleMin || 1}</span>
              <span>{question.scaleLabels?.max}</span>
            </div>
          </div>
        )

      case "boolean":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) => setAnswer(currentCategory.id, question.id, value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no" className="cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case "performance":
      case "time-based":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                value={currentAnswer || ""}
                onChange={(e) => setAnswer(currentCategory.id, question.id, Number.parseInt(e.target.value) || 0)}
                placeholder="Enter number"
                className="flex-1"
              />
              {question.unit && <span className="text-sm text-muted-foreground">{question.unit}</span>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return "🌱"
      case "intermediate":
        return "🔥"
      case "advanced":
        return "⭐"
      default:
        return "📊"
    }
  }

  if (showResults) {
    return <AssessmentResults results={assessmentResults} onRestart={restartAssessment} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fitness Assessment</h1>
          <p className="text-muted-foreground">Complete this assessment to get personalized exercise recommendations</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Target className="w-4 h-4 mr-2" />
          {Math.round(progressPercentage)}% Complete
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Assessment Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Question {answeredQuestions + 1} of {totalQuestions}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {fitnessAssessments.map((category, index) => (
              <div
                key={category.id}
                className={`text-center p-2 rounded-lg border ${
                  index === currentCategoryIndex
                    ? "border-primary bg-primary/10"
                    : index < currentCategoryIndex
                      ? "border-green-500 bg-green-50"
                      : "border-muted"
                }`}
              >
                <div className="text-lg mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
                {index < currentCategoryIndex && <CheckCircle className="w-4 h-4 mx-auto mt-1 text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentCategory && currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">{currentCategory.icon}</span>
                {currentCategory.name}
              </CardTitle>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {currentCategory.questions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
              {currentQuestion.description && (
                <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
              )}
              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Exercise demonstration"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              )}
            </div>

            {renderQuestion(currentQuestion)}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button onClick={nextQuestion} disabled={!canProceed()}>
                {currentCategoryIndex === fitnessAssessments.length - 1 &&
                currentQuestionIndex === currentCategory.questions.length - 1
                  ? "Complete Assessment"
                  : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Assessments */}
      {savedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Previous Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedAssessments.slice(-3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{getLevelIcon(assessment.overallFitnessLevel)}</div>
                    <div>
                      <div className="font-medium">{new Date(assessment.completedAt).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Overall Level: {assessment.overallFitnessLevel}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{assessment.results.length} categories</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface AssessmentResultsProps {
  results: AssessmentResult[]
  onRestart: () => void
}

function AssessmentResults({ results, onRestart }: AssessmentResultsProps) {
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null)
  const overallLevel = getOverallFitnessLevel(results)
  const recommendedProgressions = getRecommendedProgressions(results)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return "🌱"
      case "intermediate":
        return "🔥"
      case "advanced":
        return "⭐"
      default:
        return "📊"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          <p className="text-muted-foreground">Your personalized fitness assessment is complete</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>

      {/* Overall Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Overall Fitness Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">{getLevelIcon(overallLevel)}</div>
            <div className="text-center">
              <Badge className={`${getLevelColor(overallLevel)} text-white text-lg px-4 py-2`}>
                {overallLevel.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Based on your assessment across all fitness categories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => {
          const category = fitnessAssessments.find((cat) => cat.id === result.categoryId)
          if (!category) return null

          return (
            <Card key={result.categoryId} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <span className="text-2xl mr-2">{category.icon}</span>
                    {category.name}
                  </CardTitle>
                  <Badge className={`${getLevelColor(result.level)} text-white`}>{result.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span>
                      {result.score} / {result.maxScore}
                    </span>
                  </div>
                  <Progress value={result.percentage} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">{Math.round(result.percentage)}%</div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Recommended Starting Levels:</h5>
                  {Object.entries(result.startingLevels).map(([progressionId, level]) => {
                    const progression = progressiveTemplates.find((p) => p.id === progressionId)
                    return (
                      <div key={progressionId} className="flex justify-between text-sm">
                        <span>{progression?.name || progressionId}</span>
                        <Badge variant="outline">Level {level}</Badge>
                      </div>
                    )
                  })}
                </div>

                <Button size="sm" variant="outline" onClick={() => setSelectedResult(result)} className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recommended Progressions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recommended Progressive Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedProgressions.map((progressionId) => {
              const progression = progressiveTemplates.find((p) => p.id === progressionId)
              if (!progression) return null

              const relevantResult = results.find((r) => r.startingLevels[progressionId])
              const startingLevel = relevantResult?.startingLevels[progressionId] || 1

              return (
                <div key={progressionId} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{progression.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{progression.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Start at Level {startingLevel}</Badge>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Result Modal */}
      {selectedResult && (
        <Dialog open={true} onOpenChange={() => setSelectedResult(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {fitnessAssessments.find((cat) => cat.id === selectedResult.categoryId)?.name} - Detailed Results
              </DialogTitle>
              <DialogDescription>
                Your assessment results and personalized recommendations for this category
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-center">
                <Badge className={`${getLevelColor(selectedResult.level)} text-white text-lg px-4 py-2`}>
                  {selectedResult.level.toUpperCase()}
                </Badge>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{Math.round(selectedResult.percentage)}%</div>
                  <div className="text-sm text-muted-foreground">
                    Score: {selectedResult.score} / {selectedResult.maxScore}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Recommendations</h3>
                <ul className="space-y-2">
                  {selectedResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {Object.keys(selectedResult.startingLevels).length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Recommended Starting Levels</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedResult.startingLevels).map(([progressionId, level]) => {
                      const progression = progressiveTemplates.find((p) => p.id === progressionId)
                      const levelInfo = progression?.levels[level - 1]

                      return (
                        <div key={progressionId} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{progression?.name}</h4>
                            <Badge variant="outline">Level {level}</Badge>
                          </div>
                          {levelInfo && (
                            <div>
                              <div className="font-medium text-sm">{levelInfo.name}</div>
                              <div className="text-sm text-muted-foreground">{levelInfo.description}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
