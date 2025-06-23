"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  RotateCcw,
  FileText,
  Award,
  ArrowRight,
  ArrowLeft,
  Eye,
  Scale,
  Zap,
} from "lucide-react"
import { movementScreenTests, calculateMovementScreenScore, generateMovementScreenReport } from "@/lib/movement-screen"
import type { MovementScreenResult, MovementScreenAssessment } from "@/lib/movement-screen"

interface MovementScreenAssessmentProps {
  onAssessmentComplete?: (assessment: MovementScreenAssessment) => void
}

export function MovementScreenAssessment({ onAssessmentComplete }: MovementScreenAssessmentProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [results, setResults] = useState<MovementScreenResult[]>([])
  const [currentResult, setCurrentResult] = useState<Partial<MovementScreenResult>>({})
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [savedAssessments, setSavedAssessments] = useState<MovementScreenAssessment[]>([])
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("workout-planner-movement-screens")
    if (saved) {
      setSavedAssessments(JSON.parse(saved))
    }
  }, [])

  const currentCategory = movementScreenTests[currentCategoryIndex]
  const currentTest = currentCategory?.tests[currentTestIndex]
  const totalTests = movementScreenTests.reduce((sum, category) => sum + category.tests.length, 0)
  const completedTests = results.length
  const progressPercentage = (completedTests / totalTests) * 100

  const updateCurrentResult = (field: keyof MovementScreenResult, value: any) => {
    setCurrentResult((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const canProceed = () => {
    return currentResult.score !== undefined && currentResult.score >= 0
  }

  const saveCurrentResult = () => {
    if (!currentTest || !canProceed()) return

    const result: MovementScreenResult = {
      testId: currentTest.id,
      score: currentResult.score || 0,
      maxScore: 3,
      notes: currentResult.notes || "",
      compensations: currentResult.compensations || [],
      redFlags: currentResult.redFlags || [],
      leftSide: currentResult.leftSide,
      rightSide: currentResult.rightSide,
      asymmetry:
        currentResult.leftSide !== undefined && currentResult.rightSide !== undefined
          ? Math.abs(currentResult.leftSide - currentResult.rightSide) > 1
          : false,
    }

    setResults((prev) => [...prev, result])
    setCurrentResult({})
  }

  const nextTest = () => {
    saveCurrentResult()

    if (currentTestIndex < currentCategory.tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1)
    } else if (currentCategoryIndex < movementScreenTests.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
      setCurrentTestIndex(0)
    } else {
      completeAssessment()
    }
  }

  const previousTest = () => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex(currentTestIndex - 1)
      // Remove the last result if going back
      setResults((prev) => prev.slice(0, -1))
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
      const prevCategory = movementScreenTests[currentCategoryIndex - 1]
      setCurrentTestIndex(prevCategory.tests.length - 1)
      setResults((prev) => prev.slice(0, -1))
    }
  }

  const completeAssessment = () => {
    saveCurrentResult()

    const screenResults = calculateMovementScreenScore(results)

    const assessment: MovementScreenAssessment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "current-user",
      completedAt: new Date().toISOString(),
      results,
      overallScore: screenResults.overallScore,
      maxOverallScore: screenResults.maxOverallScore,
      riskLevel: screenResults.riskLevel,
      primaryLimitations: screenResults.primaryLimitations,
      recommendedCorrectiveExercises: screenResults.recommendedCorrectiveExercises,
      exerciseRestrictions: screenResults.exerciseRestrictions,
      followUpRecommendations: generateFollowUpRecommendations(
        screenResults.riskLevel,
        screenResults.primaryLimitations,
      ),
    }

    setIsAssessmentComplete(true)
    setShowResults(true)

    // Save assessment
    const updatedAssessments = [...savedAssessments, assessment]
    setSavedAssessments(updatedAssessments)
    localStorage.setItem("workout-planner-movement-screens", JSON.stringify(updatedAssessments))

    if (onAssessmentComplete) {
      onAssessmentComplete(assessment)
    }
  }

  const restartAssessment = () => {
    setCurrentCategoryIndex(0)
    setCurrentTestIndex(0)
    setResults([])
    setCurrentResult({})
    setIsAssessmentComplete(false)
    setShowResults(false)
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "✅"
      case "moderate":
        return "⚠️"
      case "high":
        return "🚨"
      default:
        return "📊"
    }
  }

  if (showResults) {
    return <MovementScreenResults results={results} onRestart={restartAssessment} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Functional Movement Screen</h1>
          <p className="text-muted-foreground">
            Identify movement limitations and dysfunctions to prevent injury and optimize performance
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Activity className="w-4 h-4 mr-2" />
          {Math.round(progressPercentage)}% Complete
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Movement Screen Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Test {completedTests + 1} of {totalTests}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {movementScreenTests.map((category, index) => (
              <div
                key={category.id}
                className={`text-center p-3 rounded-lg border ${
                  index === currentCategoryIndex
                    ? "border-primary bg-primary/10"
                    : index < currentCategoryIndex
                      ? "border-green-500 bg-green-50"
                      : "border-muted"
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{category.tests.length} tests</div>
                {index < currentCategoryIndex && <CheckCircle className="w-4 h-4 mx-auto mt-2 text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Test */}
      {currentCategory && currentTest && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">{currentCategory.icon}</span>
                {currentTest.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize">
                  {currentTest.category.replace("-", " ")}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setShowInstructions(true)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Instructions
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">{currentTest.description}</p>

              {currentTest.equipment && currentTest.equipment.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Equipment Needed:</h4>
                  <ul className="text-sm space-y-1">
                    {currentTest.equipment.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentTest.imageUrl && (
                <img
                  src={currentTest.imageUrl || "/placeholder.svg"}
                  alt={`${currentTest.name} demonstration`}
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
              )}
            </div>

            {/* Scoring Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Movement Quality Score</h3>
              <RadioGroup
                value={currentResult.score?.toString()}
                onValueChange={(value) => updateCurrentResult("score", Number.parseInt(value))}
              >
                {currentTest.scoringCriteria.map((criteria) => (
                  <div key={criteria.score} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={criteria.score.toString()} id={`score-${criteria.score}`} />
                      <Label htmlFor={`score-${criteria.score}`} className="font-medium">
                        {criteria.score} - {criteria.description}
                      </Label>
                    </div>
                    <div className="ml-6 text-sm text-muted-foreground">
                      <ul className="space-y-1">
                        {criteria.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></span>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Bilateral Testing */}
            {(currentTest.category === "asymmetry" || currentTest.id === "single-leg-squat") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="left-side">Left Side Score (1-3)</Label>
                  <Input
                    id="left-side"
                    type="number"
                    min="1"
                    max="3"
                    value={currentResult.leftSide || ""}
                    onChange={(e) => updateCurrentResult("leftSide", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="right-side">Right Side Score (1-3)</Label>
                  <Input
                    id="right-side"
                    type="number"
                    min="1"
                    max="3"
                    value={currentResult.rightSide || ""}
                    onChange={(e) => updateCurrentResult("rightSide", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Compensations Checklist */}
            <div className="space-y-3">
              <h4 className="font-medium">Observed Compensations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentTest.commonCompensations.map((compensation, index) => (
                  <label key={index} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={currentResult.compensations?.includes(compensation) || false}
                      onChange={(e) => {
                        const compensations = currentResult.compensations || []
                        if (e.target.checked) {
                          updateCurrentResult("compensations", [...compensations, compensation])
                        } else {
                          updateCurrentResult(
                            "compensations",
                            compensations.filter((c) => c !== compensation),
                          )
                        }
                      }}
                      className="rounded"
                    />
                    <span>{compensation}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">Red Flags</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentTest.redFlags.map((redFlag, index) => (
                  <label key={index} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={currentResult.redFlags?.includes(redFlag) || false}
                      onChange={(e) => {
                        const redFlags = currentResult.redFlags || []
                        if (e.target.checked) {
                          updateCurrentResult("redFlags", [...redFlags, redFlag])
                        } else {
                          updateCurrentResult(
                            "redFlags",
                            redFlags.filter((r) => r !== redFlag),
                          )
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-red-600">{redFlag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Record any additional observations, pain locations, or relevant details..."
                value={currentResult.notes || ""}
                onChange={(e) => updateCurrentResult("notes", e.target.value)}
                rows={3}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={previousTest}
                disabled={currentCategoryIndex === 0 && currentTestIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={nextTest} disabled={!canProceed()}>
                {currentCategoryIndex === movementScreenTests.length - 1 &&
                currentTestIndex === currentCategory.tests.length - 1
                  ? "Complete Screen"
                  : "Next Test"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions Modal */}
      {currentTest && (
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentTest.name} - Instructions</DialogTitle>
              <DialogDescription>{currentTest.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step-by-Step Instructions:</h3>
                <ol className="space-y-2">
                  {currentTest.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {currentTest.imageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Visual Reference:</h3>
                  <img
                    src={currentTest.imageUrl || "/placeholder.svg"}
                    alt={`${currentTest.name} demonstration`}
                    className="w-full rounded-lg border"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Previous Assessments */}
      {savedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Previous Movement Screens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedAssessments.slice(-3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{getRiskLevelIcon(assessment.riskLevel)}</div>
                    <div>
                      <div className="font-medium">{new Date(assessment.completedAt).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Risk Level: {assessment.riskLevel} • Score: {assessment.overallScore}/
                        {assessment.maxOverallScore}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getRiskLevelColor(assessment.riskLevel)} text-white`}>
                    {assessment.riskLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface MovementScreenResultsProps {
  results: MovementScreenResult[]
  onRestart: () => void
}

function MovementScreenResults({ results, onRestart }: MovementScreenResultsProps) {
  const screenResults = calculateMovementScreenScore(results)
  const [selectedResult, setSelectedResult] = useState<MovementScreenResult | null>(null)
  const [showReport, setShowReport] = useState(false)

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "✅"
      case "moderate":
        return "⚠️"
      case "high":
        return "🚨"
      default:
        return "📊"
    }
  }

  const assessment: MovementScreenAssessment = {
    id: "current",
    userId: "current-user",
    completedAt: new Date().toISOString(),
    results,
    overallScore: screenResults.overallScore,
    maxOverallScore: screenResults.maxOverallScore,
    riskLevel: screenResults.riskLevel,
    primaryLimitations: screenResults.primaryLimitations,
    recommendedCorrectiveExercises: screenResults.recommendedCorrectiveExercises,
    exerciseRestrictions: screenResults.exerciseRestrictions,
    followUpRecommendations: generateFollowUpRecommendations(screenResults.riskLevel, screenResults.primaryLimitations),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movement Screen Results</h1>
          <p className="text-muted-foreground">Your functional movement assessment is complete</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowReport(true)}>
            <FileText className="w-4 h-4 mr-2" />
            View Report
          </Button>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Screen
          </Button>
        </div>
      </div>

      {/* Overall Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Overall Movement Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-6xl mb-2">{getRiskLevelIcon(screenResults.riskLevel)}</div>
              <Badge className={`${getRiskLevelColor(screenResults.riskLevel)} text-white text-lg px-4 py-2`}>
                {screenResults.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{screenResults.overallScore}</div>
              <div className="text-muted-foreground">out of {screenResults.maxOverallScore}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round((screenResults.overallScore / screenResults.maxOverallScore) * 100)}% Score
              </div>
            </div>
          </div>

          {screenResults.riskLevel === "high" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High risk detected. Consider consulting with a movement professional before beginning intensive exercise
                programs.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => {
          const test = findTestById(result.testId)
          if (!test) return null

          const category = movementScreenTests.find((cat) => cat.tests.some((t) => t.id === result.testId))

          return (
            <Card key={result.testId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <span className="text-xl mr-2">{category?.icon}</span>
                    {test.name}
                  </CardTitle>
                  <Badge variant={result.score <= 1 ? "destructive" : result.score === 2 ? "secondary" : "default"}>
                    {result.score}/3
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Progress value={(result.score / 3) * 100} className="h-2" />
                  <div className="text-sm text-muted-foreground text-center">
                    {Math.round((result.score / 3) * 100)}% Quality
                  </div>
                </div>

                {result.asymmetry && (
                  <Alert>
                    <Scale className="h-4 w-4" />
                    <AlertDescription className="text-sm">Asymmetry detected between sides</AlertDescription>
                  </Alert>
                )}

                {result.redFlags.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {result.redFlags.length} red flag(s) identified
                    </AlertDescription>
                  </Alert>
                )}

                <Button size="sm" variant="outline" onClick={() => setSelectedResult(result)} className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recommendations */}
      <Tabs defaultValue="limitations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="limitations">Primary Limitations</TabsTrigger>
          <TabsTrigger value="correctives">Corrective Exercises</TabsTrigger>
          <TabsTrigger value="restrictions">Exercise Restrictions</TabsTrigger>
        </TabsList>

        <TabsContent value="limitations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Primary Movement Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {screenResults.primaryLimitations.length > 0 ? (
                <ul className="space-y-2">
                  {screenResults.primaryLimitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No significant limitations identified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correctives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Recommended Corrective Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {screenResults.recommendedCorrectiveExercises.length > 0 ? (
                <ul className="space-y-2">
                  {screenResults.recommendedCorrectiveExercises.map((exercise, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{exercise}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific corrective exercises needed.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restrictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Exercise Restrictions & Precautions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {screenResults.exerciseRestrictions.length > 0 ? (
                <ul className="space-y-2">
                  {screenResults.exerciseRestrictions.map((restriction, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{restriction}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific exercise restrictions identified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Result Modal */}
      {selectedResult && (
        <Dialog open={true} onOpenChange={() => setSelectedResult(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{findTestById(selectedResult.testId)?.name} - Detailed Results</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <Badge
                  variant={
                    selectedResult.score <= 1 ? "destructive" : selectedResult.score === 2 ? "secondary" : "default"
                  }
                >
                  Score: {selectedResult.score}/3
                </Badge>
              </div>

              {selectedResult.leftSide !== undefined && selectedResult.rightSide !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="font-medium">Left Side</div>
                    <div className="text-2xl">{selectedResult.leftSide}/3</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Right Side</div>
                    <div className="text-2xl">{selectedResult.rightSide}/3</div>
                  </div>
                </div>
              )}

              {selectedResult.compensations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Observed Compensations:</h3>
                  <ul className="space-y-1">
                    {selectedResult.compensations.map((compensation, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5"></span>
                        {compensation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedResult.redFlags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">Red Flags:</h3>
                  <ul className="space-y-1">
                    {selectedResult.redFlags.map((redFlag, index) => (
                      <li key={index} className="text-sm flex items-start text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {redFlag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedResult.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Notes:</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedResult.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Report Modal */}
      {showReport && (
        <Dialog open={showReport} onOpenChange={setShowReport}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Functional Movement Screen Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {generateMovementScreenReport(assessment)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

const findTestById = (testId: string) => {
  for (const category of movementScreenTests) {
    const test = category.tests.find((t) => t.id === testId)
    if (test) return test
  }
  return undefined
}

const generateFollowUpRecommendations = (riskLevel: string, limitations: string[]): string[] => {
  const recommendations: string[] = []

  switch (riskLevel) {
    case "high":
      recommendations.push("Consider consultation with a physical therapist or movement specialist")
      recommendations.push("Focus on corrective exercises before progressing to intensive training")
      recommendations.push("Re-screen in 4-6 weeks after implementing correctives")
      break
    case "moderate":
      recommendations.push("Implement corrective exercises 2-3 times per week")
      recommendations.push("Monitor movement quality during exercise")
      recommendations.push("Re-screen in 6-8 weeks")
      break
    case "low":
      recommendations.push("Maintain current movement quality with regular mobility work")
      recommendations.push("Re-screen every 3-6 months or after significant training changes")
      break
  }

  if (limitations.length > 0) {
    recommendations.push("Address identified limitations before progressing exercise intensity")
  }

  return recommendations
}
