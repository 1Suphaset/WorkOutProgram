export interface MovementTest {
  id: string
  name: string
  category: "mobility" | "stability" | "movement-pattern" | "asymmetry"
  description: string
  instructions: string[]
  equipment?: string[]
  videoUrl?: string
  imageUrl?: string
  scoringCriteria: {
    score: number
    description: string
    indicators: string[]
  }[]
  commonCompensations: string[]
  redFlags: string[]
  correctives: {
    mobility?: string[]
    stability?: string[]
    activation?: string[]
  }
}

export interface MovementScreenCategory {
  id: string
  name: string
  description: string
  icon: string
  tests: MovementTest[]
  purpose: string
}

export interface MovementScreenResult {
  testId: string
  score: number
  maxScore: number
  notes: string
  compensations: string[]
  redFlags: string[]
  leftSide?: number
  rightSide?: number
  asymmetry?: boolean
}

export interface MovementScreenAssessment {
  id: string
  userId: string
  completedAt: string
  results: MovementScreenResult[]
  overallScore: number
  maxOverallScore: number
  riskLevel: "low" | "moderate" | "high"
  primaryLimitations: string[]
  recommendedCorrectiveExercises: string[]
  exerciseRestrictions: string[]
  followUpRecommendations: string[]
}

export const movementScreenTests: MovementScreenCategory[] = [
  // FUNDAMENTAL MOVEMENT PATTERNS
  {
    id: "fundamental-patterns",
    name: "Fundamental Movement Patterns",
    description: "Assess basic movement competency and identify major dysfunctions",
    icon: "🏃",
    purpose: "Evaluate fundamental movement patterns that form the basis of all athletic activities",
    tests: [
      {
        id: "overhead-squat",
        name: "Overhead Squat Assessment",
        category: "movement-pattern",
        description: "Comprehensive assessment of total-body movement efficiency and neuromuscular control",
        instructions: [
          "Stand with feet shoulder-width apart, toes pointing slightly outward",
          "Raise arms overhead with elbows straight and hands wider than shoulders",
          "Slowly squat down as deep as possible while keeping arms overhead",
          "Hold the bottom position for 2 seconds",
          "Return to starting position",
          "Perform 5 repetitions while being observed from front, side, and back",
        ],
        equipment: ["None required", "Optional: dowel rod or broomstick"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Overhead+Squat+Assessment",
        scoringCriteria: [
          {
            score: 3,
            description: "Optimal Movement",
            indicators: [
              "Torso remains upright throughout movement",
              "Arms stay overhead without compensation",
              "Thighs parallel to floor or below",
              "Knees track over toes",
              "Feet remain flat on floor",
              "No excessive forward lean",
            ],
          },
          {
            score: 2,
            description: "Acceptable with Minor Deviations",
            indicators: [
              "Slight forward lean of torso",
              "Minor knee valgus (inward movement)",
              "Slight heel rise",
              "Arms drift slightly forward",
              "Adequate depth achieved",
            ],
          },
          {
            score: 1,
            description: "Poor Movement Quality",
            indicators: [
              "Excessive forward lean",
              "Significant knee valgus or varus",
              "Heels rise significantly",
              "Arms fall forward markedly",
              "Limited squat depth",
              "Loss of balance",
            ],
          },
        ],
        commonCompensations: [
          "Forward head posture",
          "Rounded shoulders",
          "Excessive lumbar extension",
          "Knee valgus collapse",
          "Heel rise",
          "Weight shift to toes",
        ],
        redFlags: [
          "Sharp pain during movement",
          "Inability to maintain balance",
          "Severe movement restrictions",
          "Significant asymmetries between sides",
        ],
        correctives: {
          mobility: [
            "Ankle dorsiflexion stretches",
            "Hip flexor stretches",
            "Thoracic spine mobility",
            "Shoulder flexion stretches",
          ],
          stability: ["Core stabilization exercises", "Glute activation drills", "Single-leg balance training"],
          activation: ["Glute bridges", "Clamshells", "Wall slides", "Dead bugs"],
        },
      },
      {
        id: "single-leg-squat",
        name: "Single Leg Squat Assessment",
        category: "movement-pattern",
        description: "Assess unilateral lower extremity strength, balance, and movement control",
        instructions: [
          "Stand on one leg with hands on hips",
          "Lift the non-stance leg slightly off the ground",
          "Slowly squat down on the stance leg as far as comfortable",
          "Maintain balance and control throughout the movement",
          "Return to starting position",
          "Perform 5 repetitions on each leg",
          "Observe for compensations and asymmetries",
        ],
        equipment: ["None required"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Single+Leg+Squat",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Control",
            indicators: [
              "Maintains balance throughout movement",
              "Knee tracks over toe",
              "Minimal trunk deviation",
              "Smooth, controlled movement",
              "Achieves good depth (45+ degrees knee flexion)",
              "No compensatory movements",
            ],
          },
          {
            score: 2,
            description: "Good with Minor Compensations",
            indicators: [
              "Slight balance challenges",
              "Minor knee valgus",
              "Slight trunk lean",
              "Adequate depth achieved",
              "Some arm movement for balance",
            ],
          },
          {
            score: 1,
            description: "Poor Control",
            indicators: [
              "Significant balance loss",
              "Marked knee valgus",
              "Excessive trunk lean",
              "Limited depth",
              "Multiple compensatory movements",
              "Unable to complete movement",
            ],
          },
        ],
        commonCompensations: [
          "Knee valgus (inward collapse)",
          "Trunk lateral flexion",
          "Excessive arm movement",
          "Hip hiking",
          "Ankle instability",
          "Contralateral pelvic drop",
        ],
        redFlags: [
          "Sharp knee or hip pain",
          "Complete inability to balance",
          "Severe knee valgus",
          "Significant asymmetry between sides",
        ],
        correctives: {
          mobility: ["Hip flexor stretches", "IT band stretches", "Ankle mobility work"],
          stability: ["Single-leg balance training", "Glute strengthening", "Core stabilization"],
          activation: ["Glute medius activation", "Hip abductor strengthening", "Proprioceptive training"],
        },
      },
    ],
  },

  // MOBILITY ASSESSMENTS
  {
    id: "mobility-screen",
    name: "Mobility Screen",
    description: "Identify specific joint mobility limitations and restrictions",
    icon: "🤸",
    purpose: "Assess joint range of motion and identify mobility restrictions that may limit performance",
    tests: [
      {
        id: "shoulder-mobility",
        name: "Shoulder Mobility Screen",
        category: "mobility",
        description: "Assess shoulder flexion, internal rotation, and scapular mobility",
        instructions: [
          "Stand with feet together and arms at sides",
          "Reach one hand over the shoulder and down the back",
          "Reach the other hand up the back from below",
          "Try to touch or overlap fingers behind the back",
          "Measure the distance between fingertips",
          "Test both sides (right hand up/left hand down, then switch)",
          "Do not force the movement if painful",
        ],
        equipment: ["Measuring tape or ruler"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Shoulder+Mobility+Test",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Mobility",
            indicators: [
              "Fingertips overlap by 1+ inches",
              "No pain during movement",
              "Smooth, unrestricted motion",
              "Minimal compensation patterns",
            ],
          },
          {
            score: 2,
            description: "Good Mobility",
            indicators: [
              "Fingertips touch or within 1 inch",
              "Slight discomfort but no sharp pain",
              "Minor compensations",
              "Adequate range achieved",
            ],
          },
          {
            score: 1,
            description: "Limited Mobility",
            indicators: [
              "Fingertips more than 1.5 inches apart",
              "Significant restrictions",
              "Pain or discomfort",
              "Major compensatory movements",
            ],
          },
        ],
        commonCompensations: [
          "Excessive trunk side bending",
          "Shoulder elevation",
          "Scapular winging",
          "Forward head posture",
        ],
        redFlags: [
          "Sharp shoulder pain",
          "Numbness or tingling",
          "Complete inability to reach",
          "History of shoulder dislocation",
        ],
        correctives: {
          mobility: [
            "Cross-body shoulder stretches",
            "Doorway chest stretches",
            "Sleeper stretches",
            "Thoracic spine mobility",
          ],
          stability: ["Scapular stabilization exercises", "Rotator cuff strengthening", "Postural awareness training"],
        },
      },
      {
        id: "hip-mobility",
        name: "Hip Mobility Assessment",
        category: "mobility",
        description: "Evaluate hip flexion, extension, and rotation range of motion",
        instructions: [
          "Lie on back with both legs extended",
          "Pull one knee toward chest as far as comfortable",
          "Keep the opposite leg flat on the ground",
          "Hold for 5 seconds and measure knee-to-chest distance",
          "Test hip extension by lying prone and lifting thigh off ground",
          "Assess internal/external rotation in seated position",
          "Test both sides and compare",
        ],
        equipment: ["Mat or comfortable surface", "Measuring device"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Hip+Mobility+Assessment",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Hip Mobility",
            indicators: [
              "Knee touches chest easily",
              "Opposite leg remains flat",
              "Hip extension >10 degrees",
              "Internal rotation >35 degrees",
              "External rotation >45 degrees",
              "No pain or restrictions",
            ],
          },
          {
            score: 2,
            description: "Good Hip Mobility",
            indicators: [
              "Knee comes within 2 inches of chest",
              "Slight lifting of opposite leg",
              "Hip extension 5-10 degrees",
              "Adequate rotation ranges",
              "Minor discomfort only",
            ],
          },
          {
            score: 1,
            description: "Limited Hip Mobility",
            indicators: [
              "Knee more than 4 inches from chest",
              "Opposite leg lifts significantly",
              "Hip extension <5 degrees",
              "Limited rotation ranges",
              "Pain or significant restrictions",
            ],
          },
        ],
        commonCompensations: ["Posterior pelvic tilt", "Lumbar flexion", "Opposite leg lifting", "Trunk rotation"],
        redFlags: ["Sharp hip or groin pain", "Severe restrictions", "Significant asymmetries", "Numbness in leg"],
        correctives: {
          mobility: ["Hip flexor stretches", "Pigeon pose stretches", "Hip circles", "90/90 hip stretches"],
          stability: ["Glute strengthening", "Core stabilization", "Hip abductor strengthening"],
        },
      },
      {
        id: "ankle-mobility",
        name: "Ankle Dorsiflexion Test",
        category: "mobility",
        description: "Assess ankle dorsiflexion range of motion and calf flexibility",
        instructions: [
          "Stand facing a wall with hands against it",
          "Place one foot 5 inches from the wall",
          "Keep heel down and try to touch knee to wall",
          "If successful, move foot back 1 inch and repeat",
          "Continue until knee can no longer touch wall",
          "Measure maximum distance from wall to toe",
          "Test both ankles and compare",
        ],
        equipment: ["Wall", "Measuring tape"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Ankle+Mobility+Test",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Ankle Mobility",
            indicators: [
              "Knee touches wall at 5+ inches",
              "No heel lifting",
              "Smooth, unrestricted movement",
              "No pain or discomfort",
            ],
          },
          {
            score: 2,
            description: "Good Ankle Mobility",
            indicators: [
              "Knee touches wall at 3-4 inches",
              "Minimal heel lifting",
              "Slight restriction felt",
              "No significant discomfort",
            ],
          },
          {
            score: 1,
            description: "Limited Ankle Mobility",
            indicators: [
              "Knee touches wall at <3 inches",
              "Significant heel lifting",
              "Marked restrictions",
              "Pain or significant tightness",
            ],
          },
        ],
        commonCompensations: ["Heel lifting", "Foot pronation", "Knee valgus", "Hip flexion compensation"],
        redFlags: ["Sharp ankle pain", "Severe restrictions", "History of ankle injury", "Swelling or instability"],
        correctives: {
          mobility: ["Calf stretches", "Wall ankle stretches", "Ankle circles", "Foam rolling calves"],
          stability: ["Ankle strengthening", "Balance training", "Proprioceptive exercises"],
        },
      },
    ],
  },

  // STABILITY ASSESSMENTS
  {
    id: "stability-screen",
    name: "Stability & Balance Screen",
    description: "Evaluate core stability, balance, and neuromuscular control",
    icon: "⚖️",
    purpose: "Assess stability and balance capabilities that are essential for injury prevention",
    tests: [
      {
        id: "single-leg-balance",
        name: "Single Leg Balance Test",
        category: "stability",
        description: "Assess static balance and proprioceptive control",
        instructions: [
          "Stand on one leg with hands on hips",
          "Lift the other leg so thigh is parallel to ground",
          "Close eyes and maintain balance",
          "Time how long balance is maintained",
          "Test ends when foot touches down or eyes open",
          "Test both legs separately",
          "Record best time for each leg",
        ],
        equipment: ["Stopwatch or timer"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Single+Leg+Balance",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Balance",
            indicators: [
              "Maintains balance >30 seconds",
              "Minimal body sway",
              "No compensatory movements",
              "Consistent performance",
            ],
          },
          {
            score: 2,
            description: "Good Balance",
            indicators: [
              "Maintains balance 15-30 seconds",
              "Slight body sway",
              "Minor compensatory movements",
              "Generally stable",
            ],
          },
          {
            score: 1,
            description: "Poor Balance",
            indicators: [
              "Maintains balance <15 seconds",
              "Significant body sway",
              "Multiple compensatory movements",
              "Frequent loss of balance",
            ],
          },
        ],
        commonCompensations: ["Excessive arm movement", "Hip hiking", "Trunk lean", "Ankle strategies"],
        redFlags: [
          "Complete inability to balance",
          "Dizziness or vertigo",
          "Significant asymmetries",
          "History of falls",
        ],
        correctives: {
          stability: [
            "Progressive balance training",
            "Proprioceptive exercises",
            "Core strengthening",
            "Ankle stability work",
          ],
        },
      },
      {
        id: "plank-endurance",
        name: "Plank Endurance Test",
        category: "stability",
        description: "Assess core endurance and stability under load",
        instructions: [
          "Start in forearm plank position",
          "Maintain straight line from head to heels",
          "Keep core engaged and avoid sagging",
          "Hold position as long as possible",
          "Test ends when form breaks down",
          "Record total time held",
          "Note any compensations observed",
        ],
        equipment: ["Mat or comfortable surface", "Timer"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Plank+Endurance",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Core Endurance",
            indicators: [
              "Holds plank >90 seconds",
              "Perfect form maintained",
              "No sagging or hiking",
              "Controlled breathing",
            ],
          },
          {
            score: 2,
            description: "Good Core Endurance",
            indicators: [
              "Holds plank 45-90 seconds",
              "Minor form breakdown near end",
              "Slight sagging or hiking",
              "Generally good control",
            ],
          },
          {
            score: 1,
            description: "Poor Core Endurance",
            indicators: [
              "Holds plank <45 seconds",
              "Significant form breakdown",
              "Major sagging or hiking",
              "Unable to maintain position",
            ],
          },
        ],
        commonCompensations: ["Hip sagging", "Hip hiking", "Head dropping", "Shoulder blade winging"],
        redFlags: ["Lower back pain", "Inability to maintain position", "Severe form breakdown", "Breath holding"],
        correctives: {
          stability: [
            "Progressive plank variations",
            "Dead bug exercises",
            "Bird dog holds",
            "Core breathing exercises",
          ],
        },
      },
    ],
  },

  // ASYMMETRY DETECTION
  {
    id: "asymmetry-screen",
    name: "Asymmetry Detection",
    description: "Identify left-right imbalances and compensatory patterns",
    icon: "⚖️",
    purpose: "Detect asymmetries that may predispose to injury or limit performance",
    tests: [
      {
        id: "step-down-test",
        name: "Lateral Step Down Test",
        category: "asymmetry",
        description: "Assess unilateral control and identify asymmetries in lower extremity function",
        instructions: [
          "Stand on 6-8 inch step or platform",
          "Slowly lower one leg toward the ground",
          "Lightly touch heel to ground without weight bearing",
          "Return to starting position with control",
          "Perform 5 repetitions on each leg",
          "Observe for compensations and asymmetries",
          "Compare quality between sides",
        ],
        equipment: ["6-8 inch step or platform"],
        imageUrl: "/placeholder.svg?height=300&width=400&text=Step+Down+Test",
        scoringCriteria: [
          {
            score: 3,
            description: "Excellent Control Both Sides",
            indicators: [
              "Smooth, controlled movement",
              "Knee tracks over toe",
              "Minimal trunk deviation",
              "No compensatory movements",
              "Symmetrical performance",
            ],
          },
          {
            score: 2,
            description: "Good Control with Minor Asymmetries",
            indicators: [
              "Generally good control",
              "Minor compensations",
              "Slight asymmetries noted",
              "Adequate movement quality",
            ],
          },
          {
            score: 1,
            description: "Poor Control or Significant Asymmetries",
            indicators: [
              "Loss of control",
              "Major compensations",
              "Significant side-to-side differences",
              "Unable to complete movement",
            ],
          },
        ],
        commonCompensations: ["Knee valgus", "Trunk lean", "Hip drop", "Ankle instability", "Arm compensation"],
        redFlags: ["Sharp pain on one side", "Complete inability on one side", "Severe asymmetries", "Loss of balance"],
        correctives: {
          stability: [
            "Unilateral strengthening",
            "Balance training",
            "Proprioceptive exercises",
            "Movement retraining",
          ],
        },
      },
    ],
  },
]

export const calculateMovementScreenScore = (
  results: MovementScreenResult[],
): {
  overallScore: number
  maxOverallScore: number
  riskLevel: "low" | "moderate" | "high"
  primaryLimitations: string[]
  recommendedCorrectiveExercises: string[]
  exerciseRestrictions: string[]
} => {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0)
  const maxScore = results.reduce((sum, result) => sum + result.maxScore, 0)
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

  // Determine risk level
  let riskLevel: "low" | "moderate" | "high"
  if (percentage >= 80) {
    riskLevel = "low"
  } else if (percentage >= 60) {
    riskLevel = "moderate"
  } else {
    riskLevel = "high"
  }

  // Identify primary limitations
  const primaryLimitations: string[] = []
  const lowScoreResults = results.filter((result) => result.score <= 1)

  lowScoreResults.forEach((result) => {
    const test = findTestById(result.testId)
    if (test) {
      primaryLimitations.push(`${test.name}: ${test.category}`)
    }
  })

  // Generate corrective exercise recommendations
  const recommendedCorrectiveExercises: string[] = []
  const exerciseRestrictions: string[] = []

  lowScoreResults.forEach((result) => {
    const test = findTestById(result.testId)
    if (test) {
      // Add corrective exercises
      if (test.correctives.mobility) {
        recommendedCorrectiveExercises.push(...test.correctives.mobility)
      }
      if (test.correctives.stability) {
        recommendedCorrectiveExercises.push(...test.correctives.stability)
      }
      if (test.correctives.activation) {
        recommendedCorrectiveExercises.push(...test.correctives.activation)
      }

      // Add exercise restrictions based on red flags
      if (result.redFlags.length > 0) {
        exerciseRestrictions.push(`Avoid high-intensity ${test.category} exercises until ${test.name} improves`)
      }
    }
  })

  // Remove duplicates
  const uniqueCorrectiveExercises = [...new Set(recommendedCorrectiveExercises)]
  const uniqueExerciseRestrictions = [...new Set(exerciseRestrictions)]

  return {
    overallScore: totalScore,
    maxOverallScore: maxScore,
    riskLevel,
    primaryLimitations,
    recommendedCorrectiveExercises: uniqueCorrectiveExercises,
    exerciseRestrictions: uniqueExerciseRestrictions,
  }
}

const findTestById = (testId: string): MovementTest | undefined => {
  for (const category of movementScreenTests) {
    const test = category.tests.find((t) => t.id === testId)
    if (test) return test
  }
  return undefined
}

export const generateMovementScreenReport = (assessment: MovementScreenAssessment): string => {
  const report = `
FUNCTIONAL MOVEMENT SCREEN REPORT
Generated: ${new Date(assessment.completedAt).toLocaleDateString()}

OVERALL SCORE: ${assessment.overallScore}/${assessment.maxOverallScore} (${Math.round((assessment.overallScore / assessment.maxOverallScore) * 100)}%)
RISK LEVEL: ${assessment.riskLevel.toUpperCase()}

PRIMARY LIMITATIONS:
${assessment.primaryLimitations.map((limitation) => `• ${limitation}`).join("\n")}

RECOMMENDED CORRECTIVE EXERCISES:
${assessment.recommendedCorrectiveExercises.map((exercise) => `• ${exercise}`).join("\n")}

EXERCISE RESTRICTIONS:
${
  assessment.exerciseRestrictions.length > 0
    ? assessment.exerciseRestrictions.map((restriction) => `• ${restriction}`).join("\n")
    : "• No specific restrictions identified"
}

FOLLOW-UP RECOMMENDATIONS:
${assessment.followUpRecommendations.map((rec) => `• ${rec}`).join("\n")}
  `
  return report
}
