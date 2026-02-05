export interface AssessmentQuestion {
  id: string
  type: "multiple-choice" | "scale" | "boolean" | "performance" | "time-based"
  question: string
  description?: string
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
  unit?: string
  videoUrl?: string
  image_url?: string
}

export interface AssessmentCategory {
  id: string
  name: string
  description: string
  icon: string
  questions: AssessmentQuestion[]
  relatedProgressions: string[]
}

export interface AssessmentResult {
  categoryId: string
  score: number
  maxScore: number
  percentage: number
  level: "beginner" | "intermediate" | "advanced"
  recommendations: string[]
  startingLevels: Record<string, number>
}

export interface UserAssessment {
  id: string
  userId: string
  completedAt: string
  results: AssessmentResult[]
  overallFitnessLevel: "beginner" | "intermediate" | "advanced"
  recommendedProgressions: string[]
  notes?: string
}

export const fitnessAssessments: AssessmentCategory[] = [
  // UPPER BODY STRENGTH ASSESSMENT
  {
    id: "upper-body-strength",
    name: "Upper Body Strength",
    description: "Assess your current upper body strength and pushing/pulling capabilities",
    icon: "💪",
    relatedProgressions: ["pushup-progression", "pullup-progression"],
    questions: [
      {
        id: "pushup-max",
        type: "performance",
        question: "How many standard push-ups can you perform in a row with proper form?",
        description:
          "Perform push-ups from your toes with chest touching the ground and full arm extension. Stop when form breaks down.",
        unit: "repetitions",
        image_url: "/placeholder.svg?height=200&width=300&text=Push-up+Form",
      },
      {
        id: "pushup-difficulty",
        type: "multiple-choice",
        question: "What's the most challenging push-up variation you can perform?",
        options: [
          "Wall push-ups only",
          "Incline push-ups (hands elevated)",
          "Knee push-ups",
          "Standard push-ups from toes",
          "Diamond or decline push-ups",
        ],
      },
      {
        id: "pullup-ability",
        type: "multiple-choice",
        question: "What best describes your pull-up ability?",
        options: [
          "Cannot hang from a bar",
          "Can hang but cannot pull up",
          "Can do assisted pull-ups with band/machine",
          "Can do 1-3 unassisted pull-ups",
          "Can do 4+ unassisted pull-ups",
        ],
      },
      {
        id: "hang-time",
        type: "time-based",
        question: "How long can you hang from a pull-up bar?",
        description: "Hang with straight arms, feet off the ground. Time until you must let go.",
        unit: "seconds",
      },
      {
        id: "upper-body-pain",
        type: "boolean",
        question: "Do you currently have any shoulder, elbow, or wrist pain?",
      },
      {
        id: "upper-body-experience",
        type: "scale",
        question: "How would you rate your experience with upper body exercises?",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Complete beginner", max: "Very experienced" },
      },
    ],
  },

  // LOWER BODY STRENGTH ASSESSMENT
  {
    id: "lower-body-strength",
    name: "Lower Body Strength",
    description: "Evaluate your lower body strength, balance, and mobility",
    icon: "🦵",
    relatedProgressions: ["squat-progression"],
    questions: [
      {
        id: "squat-depth",
        type: "multiple-choice",
        question: "How deep can you squat with good form?",
        options: [
          "Cannot squat without support",
          "Partial squat (45 degrees)",
          "Parallel squat (thighs parallel to floor)",
          "Below parallel squat",
          "Full deep squat (ass to grass)",
        ],
      },
      {
        id: "squat-max",
        type: "performance",
        question: "How many bodyweight squats can you perform in a row?",
        description: "Perform squats to at least parallel depth with good form. Count until form breaks down.",
        unit: "repetitions",
      },
      {
        id: "single-leg-balance",
        type: "time-based",
        question: "How long can you balance on one leg with eyes closed?",
        description:
          "Stand on one leg, close your eyes, and time until you need to put the other foot down or open your eyes.",
        unit: "seconds",
      },
      {
        id: "ankle-mobility",
        type: "multiple-choice",
        question: "Can you squat down keeping your heels flat on the ground?",
        options: [
          "No, heels come up immediately",
          "Heels come up in deep squat",
          "Can keep heels down in parallel squat",
          "Can keep heels down in deep squat",
          "Excellent ankle mobility, no issues",
        ],
      },
      {
        id: "knee-pain",
        type: "boolean",
        question: "Do you experience knee pain during squatting movements?",
      },
      {
        id: "jump-ability",
        type: "multiple-choice",
        question: "What best describes your jumping ability?",
        options: [
          "Cannot jump or land safely",
          "Can do small jumps with difficulty",
          "Can jump and land with good control",
          "Can do explosive jumps confidently",
          "Can do advanced plyometric movements",
        ],
      },
    ],
  },

  // CORE STRENGTH ASSESSMENT
  {
    id: "core-strength",
    name: "Core Strength & Stability",
    description: "Test your core strength, stability, and endurance",
    icon: "🎯",
    relatedProgressions: ["plank-progression"],
    questions: [
      {
        id: "plank-hold",
        type: "time-based",
        question: "How long can you hold a standard plank with proper form?",
        description:
          "Hold a plank from your toes and forearms. Maintain straight line from head to heels. Stop when form breaks down.",
        unit: "seconds",
        image_url: "/placeholder.svg?height=200&width=300&text=Plank+Form",
      },
      {
        id: "plank-difficulty",
        type: "multiple-choice",
        question: "What's the most challenging plank variation you can hold for 30 seconds?",
        options: [
          "Wall plank (standing)",
          "Incline plank (hands elevated)",
          "Knee plank",
          "Standard plank from toes",
          "Single-arm or single-leg plank",
        ],
      },
      {
        id: "side-plank",
        type: "time-based",
        question: "How long can you hold a side plank on each side?",
        description: "Hold a side plank from your forearm and feet. Take the average of both sides.",
        unit: "seconds",
      },
      {
        id: "dead-bug",
        type: "performance",
        question: "How many controlled dead bug repetitions can you perform per side?",
        description: "Lie on back, arms up, knees at 90 degrees. Slowly extend opposite arm and leg. Count per side.",
        unit: "repetitions per side",
      },
      {
        id: "back-pain",
        type: "boolean",
        question: "Do you currently experience lower back pain?",
      },
      {
        id: "core-awareness",
        type: "scale",
        question: "How well can you engage and control your core muscles?",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "No awareness", max: "Complete control" },
      },
    ],
  },

  // CARDIOVASCULAR FITNESS ASSESSMENT
  {
    id: "cardiovascular-fitness",
    name: "Cardiovascular Fitness",
    description: "Assess your aerobic capacity and endurance",
    icon: "❤️",
    relatedProgressions: ["running-progression"],
    questions: [
      {
        id: "walking-endurance",
        type: "time-based",
        question: "How long can you walk at a brisk pace without getting winded?",
        description: "Walk at a pace where you can still hold a conversation but feel slightly breathless.",
        unit: "minutes",
      },
      {
        id: "running-ability",
        type: "multiple-choice",
        question: "What best describes your current running ability?",
        options: [
          "Cannot run at all",
          "Can jog for 1-2 minutes",
          "Can jog for 5-10 minutes",
          "Can run continuously for 15+ minutes",
          "Can run for 30+ minutes easily",
        ],
      },
      {
        id: "stairs-test",
        type: "multiple-choice",
        question: "How do you feel after climbing 2 flights of stairs?",
        options: [
          "Very winded, need to rest",
          "Moderately winded, slightly breathless",
          "Slightly winded, recover quickly",
          "Not winded at all",
          "Could easily do more",
        ],
      },
      {
        id: "resting-heart-rate",
        type: "performance",
        question: "What is your resting heart rate? (optional)",
        description: "Measure your heart rate first thing in the morning before getting out of bed.",
        unit: "beats per minute",
      },
      {
        id: "cardio-frequency",
        type: "multiple-choice",
        question: "How often do you currently do cardio exercise?",
        options: ["Never or rarely", "1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"],
      },
      {
        id: "recovery-rate",
        type: "scale",
        question: "How quickly do you recover from moderate physical activity?",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Very slow recovery", max: "Very fast recovery" },
      },
    ],
  },

  // FLEXIBILITY & MOBILITY ASSESSMENT
  {
    id: "flexibility-mobility",
    name: "Flexibility & Mobility",
    description: "Evaluate your flexibility, mobility, and movement quality",
    icon: "🤸",
    relatedProgressions: [],
    questions: [
      {
        id: "toe-touch",
        type: "multiple-choice",
        question: "Can you touch your toes while standing with straight legs?",
        options: [
          "Cannot reach past my knees",
          "Can reach mid-shin",
          "Can reach ankles",
          "Can touch toes with fingertips",
          "Can place palms flat on floor",
        ],
      },
      {
        id: "overhead-reach",
        type: "multiple-choice",
        question: "Can you reach your arms fully overhead without arching your back?",
        options: [
          "Cannot lift arms above shoulder height",
          "Can reach shoulder height only",
          "Can reach overhead with back arch",
          "Can reach overhead with minimal arch",
          "Perfect overhead mobility",
        ],
      },
      {
        id: "hip-mobility",
        type: "multiple-choice",
        question: "How is your hip mobility in a deep squat position?",
        options: [
          "Very tight, cannot squat deep",
          "Tight, limited depth",
          "Moderate, can reach parallel",
          "Good, can go below parallel",
          "Excellent, very mobile",
        ],
      },
      {
        id: "daily-stiffness",
        type: "scale",
        question: "How stiff do you feel when you wake up in the morning?",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Very stiff", max: "Very loose" },
      },
      {
        id: "stretching-frequency",
        type: "multiple-choice",
        question: "How often do you stretch or do mobility work?",
        options: ["Never", "Occasionally (few times per month)", "Weekly", "Several times per week", "Daily"],
      },
      {
        id: "movement-pain",
        type: "boolean",
        question: "Do you experience pain or discomfort during basic movements?",
      },
    ],
  },

  // GENERAL FITNESS BACKGROUND
  {
    id: "fitness-background",
    name: "Fitness Background",
    description: "Understand your exercise history and current activity level",
    icon: "📋",
    relatedProgressions: [
      "pushup-progression",
      "pullup-progression",
      "squat-progression",
      "plank-progression",
      "running-progression",
    ],
    questions: [
      {
        id: "exercise-frequency",
        type: "multiple-choice",
        question: "How often do you currently exercise?",
        options: ["Never or rarely", "1-2 times per week", "3-4 times per week", "5-6 times per week", "Daily"],
      },
      {
        id: "exercise-experience",
        type: "multiple-choice",
        question: "How long have you been exercising regularly?",
        options: ["Just starting", "Less than 6 months", "6 months to 2 years", "2-5 years", "More than 5 years"],
      },
      {
        id: "injury-history",
        type: "boolean",
        question: "Have you had any significant injuries in the past year?",
      },
      {
        id: "fitness-goals",
        type: "multiple-choice",
        question: "What is your primary fitness goal?",
        options: [
          "General health and wellness",
          "Weight loss",
          "Build muscle and strength",
          "Improve athletic performance",
          "Rehabilitation/injury prevention",
        ],
      },
      {
        id: "time-availability",
        type: "multiple-choice",
        question: "How much time can you dedicate to exercise per session?",
        options: ["15-20 minutes", "20-30 minutes", "30-45 minutes", "45-60 minutes", "More than 60 minutes"],
      },
      {
        id: "confidence-level",
        type: "scale",
        question: "How confident are you with exercise and fitness?",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Not confident at all", max: "Very confident" },
      },
    ],
  },
]

export const calculateAssessmentScore = (
  category: AssessmentCategory,
  answers: Record<string, any>,
): AssessmentResult => {
  let totalScore = 0
  let maxPossibleScore = 0

  category.questions.forEach((question) => {
    const answer = answers[question.id]
    if (answer === undefined || answer === null) return

    let questionScore = 0
    let questionMaxScore = 0

    switch (question.type) {
      case "multiple-choice":
        if (question.options) {
          questionMaxScore = question.options.length - 1
          questionScore = typeof answer === "number" ? answer : question.options.indexOf(answer)
        }
        break

      case "scale":
        if (question.scaleMin !== undefined && question.scaleMax !== undefined) {
          questionMaxScore = question.scaleMax - question.scaleMin
          questionScore = answer - question.scaleMin
        }
        break

      case "boolean":
        questionMaxScore = 1
        questionScore = answer ? 0 : 1 // Reverse scoring for pain/injury questions
        break

      case "performance":
        // Performance questions use category-specific scoring
        questionMaxScore = getPerformanceMaxScore(question.id)
        questionScore = Math.min(answer, questionMaxScore)
        break

      case "time-based":
        // Time-based questions use category-specific scoring
        questionMaxScore = getTimeBasedMaxScore(question.id)
        questionScore = Math.min(answer / getTimeBasedUnit(question.id), questionMaxScore)
        break
    }

    totalScore += questionScore
    maxPossibleScore += questionMaxScore
  })

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
  const level = percentage >= 70 ? "advanced" : percentage >= 40 ? "intermediate" : "beginner"

  const recommendations = generateRecommendations(category.id, level, percentage, answers)
  const startingLevels = calculateStartingLevels(category.id, level, percentage, answers)

  return {
    categoryId: category.id,
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage,
    level,
    recommendations,
    startingLevels,
  }
}

const getPerformanceMaxScore = (questionId: string): number => {
  const maxScores: Record<string, number> = {
    "pushup-max": 20,
    "squat-max": 30,
    "dead-bug": 10,
    "resting-heart-rate": 100, // Reverse scored, lower is better
  }
  return maxScores[questionId] || 10
}

const getTimeBasedMaxScore = (questionId: string): number => {
  const maxScores: Record<string, number> = {
    "hang-time": 10, // 10 points for 60+ seconds
    "plank-hold": 10, // 10 points for 120+ seconds
    "side-plank": 10, // 10 points for 60+ seconds per side
    "single-leg-balance": 10, // 10 points for 30+ seconds
    "walking-endurance": 10, // 10 points for 60+ minutes
  }
  return maxScores[questionId] || 10
}

const getTimeBasedUnit = (questionId: string): number => {
  const units: Record<string, number> = {
    "hang-time": 6, // 6 seconds per point
    "plank-hold": 12, // 12 seconds per point
    "side-plank": 6, // 6 seconds per point
    "single-leg-balance": 3, // 3 seconds per point
    "walking-endurance": 6, // 6 minutes per point
  }
  return units[questionId] || 1
}

const generateRecommendations = (
  categoryId: string,
  level: string,
  percentage: number,
  answers: Record<string, any>,
): string[] => {
  const recommendations: string[] = []

  // General recommendations based on level
  if (level === "beginner") {
    recommendations.push("Start with basic movements and focus on proper form")
    recommendations.push("Begin with shorter sessions and gradually increase duration")
    recommendations.push("Consider working with a trainer or following guided programs")
  } else if (level === "intermediate") {
    recommendations.push("You have a good foundation - focus on progressive overload")
    recommendations.push("Add variety to your workouts to continue improving")
    recommendations.push("Consider setting specific performance goals")
  } else {
    recommendations.push("You have excellent fitness - focus on advanced progressions")
    recommendations.push("Consider sport-specific training or advanced techniques")
    recommendations.push("Help others by sharing your knowledge and experience")
  }

  // Category-specific recommendations
  switch (categoryId) {
    case "upper-body-strength":
      if (answers["upper-body-pain"]) {
        recommendations.push("Address any pain issues before starting intensive training")
      }
      if (level === "beginner") {
        recommendations.push("Start with wall or incline push-ups to build strength safely")
      }
      break

    case "lower-body-strength":
      if (answers["knee-pain"]) {
        recommendations.push("Focus on low-impact exercises and proper knee alignment")
      }
      if (answers["ankle-mobility"] <= 1) {
        recommendations.push("Work on ankle mobility before progressing to deep squats")
      }
      break

    case "core-strength":
      if (answers["back-pain"]) {
        recommendations.push("Start with gentle core activation exercises")
        recommendations.push("Avoid exercises that cause back pain")
      }
      break

    case "cardiovascular-fitness":
      if (level === "beginner") {
        recommendations.push("Start with walking and gradually add jogging intervals")
      }
      break
  }

  return recommendations
}

const calculateStartingLevels = (
  categoryId: string,
  level: string,
  percentage: number,
  answers: Record<string, any>,
): Record<string, number> => {
  const startingLevels: Record<string, number> = {}

  switch (categoryId) {
    case "upper-body-strength":
      // Push-up progression starting level
      const pushupDifficulty = answers["pushup-difficulty"] || 0
      const pushupMax = answers["pushup-max"] || 0

      if (pushupDifficulty === 0 || pushupMax === 0) {
        startingLevels["pushup-progression"] = 1 // Wall push-ups
      } else if (pushupDifficulty === 1 || pushupMax < 3) {
        startingLevels["pushup-progression"] = 2 // Incline push-ups (high)
      } else if (pushupDifficulty === 2 || pushupMax < 8) {
        startingLevels["pushup-progression"] = 5 // Knee push-ups
      } else if (pushupDifficulty === 3 || pushupMax < 15) {
        startingLevels["pushup-progression"] = 6 // Standard push-ups
      } else {
        startingLevels["pushup-progression"] = 7 // Advanced variations
      }

      // Pull-up progression starting level
      const pullupAbility = answers["pullup-ability"] || 0
      const hangTime = answers["hang-time"] || 0

      if (pullupAbility === 0 || hangTime < 10) {
        startingLevels["pullup-progression"] = 1 // Dead hang
      } else if (pullupAbility === 1 || hangTime < 30) {
        startingLevels["pullup-progression"] = 2 // Flexed arm hang
      } else if (pullupAbility === 2) {
        startingLevels["pullup-progression"] = 4 // Band-assisted pull-ups
      } else if (pullupAbility === 3) {
        startingLevels["pullup-progression"] = 6 // Full pull-ups
      } else {
        startingLevels["pullup-progression"] = 7 // Advanced variations
      }
      break

    case "lower-body-strength":
      // Squat progression starting level
      const squatDepth = answers["squat-depth"] || 0
      const squatMax = answers["squat-max"] || 0

      if (squatDepth === 0 || squatMax === 0) {
        startingLevels["squat-progression"] = 1 // Chair-assisted squats
      } else if (squatDepth === 1 || squatMax < 10) {
        startingLevels["squat-progression"] = 2 // Box squats
      } else if (squatDepth === 2 || squatMax < 20) {
        startingLevels["squat-progression"] = 4 // Full range bodyweight squats
      } else if (squatDepth >= 3 && squatMax >= 20) {
        startingLevels["squat-progression"] = 5 // Goblet squats
      } else {
        startingLevels["squat-progression"] = 6 // Advanced variations
      }
      break

    case "core-strength":
      // Plank progression starting level
      const plankHold = answers["plank-hold"] || 0
      const plankDifficulty = answers["plank-difficulty"] || 0

      if (plankDifficulty === 0 || plankHold < 15) {
        startingLevels["plank-progression"] = 1 // Wall plank
      } else if (plankDifficulty === 1 || plankHold < 30) {
        startingLevels["plank-progression"] = 2 // Incline plank
      } else if (plankDifficulty === 2 || plankHold < 45) {
        startingLevels["plank-progression"] = 3 // Knee plank
      } else if (plankDifficulty === 3 || plankHold < 60) {
        startingLevels["plank-progression"] = 4 // Standard plank
      } else {
        startingLevels["plank-progression"] = 5 // Advanced variations
      }
      break

    case "cardiovascular-fitness":
      // Running progression starting level
      const runningAbility = answers["running-ability"] || 0
      const walkingEndurance = answers["walking-endurance"] || 0

      if (runningAbility === 0 || walkingEndurance < 15) {
        startingLevels["running-progression"] = 1 // Brisk walking
      } else if (runningAbility === 1 || walkingEndurance < 30) {
        startingLevels["running-progression"] = 2 // Walk-jog intervals (1:2)
      } else if (runningAbility === 2) {
        startingLevels["running-progression"] = 3 // Walk-jog intervals (1:1)
      } else if (runningAbility === 3) {
        startingLevels["running-progression"] = 5 // Continuous jog (short)
      } else {
        startingLevels["running-progression"] = 6 // Continuous jog (medium)
      }
      break
  }

  return startingLevels
}

export const getOverallFitnessLevel = (results: AssessmentResult[]): "beginner" | "intermediate" | "advanced" => {
  if (results.length === 0) return "beginner"

  const averagePercentage = results.reduce((sum, result) => sum + result.percentage, 0) / results.length

  if (averagePercentage >= 70) return "advanced"
  if (averagePercentage >= 40) return "intermediate"
  return "beginner"
}

export const getRecommendedProgressions = (results: AssessmentResult[]): string[] => {
  const recommended: string[] = []

  results.forEach((result) => {
    Object.keys(result.startingLevels).forEach((progressionId) => {
      if (!recommended.includes(progressionId)) {
        recommended.push(progressionId)
      }
    })
  })

  return recommended
}
