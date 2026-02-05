export interface ProgressionLevel {
  level: number
  name: string
  description: string
  prerequisites?: string[]
  targetWeeks: number
  progressionCriteria: {
    reps?: number
    sets?: number
    duration?: number // in seconds
    weight?: number // percentage of bodyweight or previous level
    form?: string[]
  }
}

export interface ProgressiveExerciseTemplate {
  id: string
  name: string
  movementPattern: string
  category: "Strength" | "Cardio" | "Flexibility" | "Sports"
  muscleGroups: string[]
  equipment: string
  description: string
  totalWeeks: number
  levels: ProgressionLevel[]
  safetyNotes: string[]
  commonMistakes: string[]
  whenToProgress: string[]
  whenToRegress: string[]
  alternativeExercises: string[]
  image_url?: string
}

export const progressiveTemplates: ProgressiveExerciseTemplate[] = [
  // PUSH-UP PROGRESSION
  {
    id: "pushup-progression",
    name: "Push-Up Progression",
    movementPattern: "Push (Horizontal)",
    category: "Strength",
    muscleGroups: ["Chest", "Shoulders", "Triceps", "Core"],
    equipment: "Bodyweight",
    description:
      "A complete push-up progression from wall push-ups to advanced variations, building upper body and core strength progressively.",
    totalWeeks: 16,
    levels: [
      {
        level: 1,
        name: "Wall Push-Ups",
        description: "Standing push-ups against a wall to learn the movement pattern with minimal load.",
        targetWeeks: 2,
        progressionCriteria: {
          reps: 15,
          sets: 3,
          form: [
            "Maintain straight line from head to heels",
            "Control both up and down phases",
            "Full range of motion",
          ],
        },
      },
      {
        level: 2,
        name: "Incline Push-Ups (High)",
        description: "Push-ups with hands elevated on a high surface (bench, couch) to reduce body weight load.",
        prerequisites: ["Complete Level 1 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 12,
          sets: 3,
          form: ["Maintain plank position", "Chest touches surface", "No sagging hips"],
        },
      },
      {
        level: 3,
        name: "Incline Push-Ups (Medium)",
        description: "Push-ups with hands on a medium height surface to further increase load.",
        prerequisites: ["Complete Level 2 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 10,
          sets: 3,
          form: ["Perfect form maintained", "Full range of motion", "Controlled tempo"],
        },
      },
      {
        level: 4,
        name: "Incline Push-Ups (Low)",
        description: "Push-ups with hands on a low surface (step, low bench) approaching floor level.",
        prerequisites: ["Complete Level 3 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 8,
          sets: 3,
          form: ["Chest nearly touches surface", "Strong core engagement", "No knee drop"],
        },
      },
      {
        level: 5,
        name: "Knee Push-Ups",
        description: "Push-ups from knees to build strength for full push-ups while maintaining proper form.",
        prerequisites: ["Complete Level 4 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 12,
          sets: 3,
          form: ["Straight line from knees to head", "Chest touches floor", "Full extension at top"],
        },
      },
      {
        level: 6,
        name: "Standard Push-Ups",
        description: "Full push-ups from toes with proper form and full range of motion.",
        prerequisites: ["Complete Level 5 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 10,
          sets: 3,
          form: ["Perfect plank position", "Chest touches floor", "Full lockout at top"],
        },
      },
      {
        level: 7,
        name: "Wide-Grip Push-Ups",
        description: "Push-ups with wider hand placement to target chest more and add variety.",
        prerequisites: ["Complete Level 6 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 8,
          sets: 3,
          form: ["Hands wider than shoulders", "Maintain core stability", "Full range of motion"],
        },
      },
      {
        level: 8,
        name: "Diamond Push-Ups",
        description: "Push-ups with hands in diamond shape to emphasize triceps and increase difficulty.",
        prerequisites: ["Complete Level 7 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 6,
          sets: 3,
          form: ["Hands form diamond shape", "Elbows track back", "Maintain straight body line"],
        },
      },
    ],
    safetyNotes: [
      "Never sacrifice form for repetitions",
      "Stop if you experience wrist, shoulder, or lower back pain",
      "Warm up shoulders and wrists before training",
      "Progress only when you can complete all sets with perfect form",
    ],
    commonMistakes: [
      "Allowing hips to sag or pike up",
      "Not achieving full range of motion",
      "Rushing through repetitions",
      "Progressing too quickly without mastering current level",
    ],
    whenToProgress: [
      "Can complete all sets and reps with perfect form",
      "Exercise feels significantly easier than when you started the level",
      "You can do 2-3 extra reps beyond the target on the last set",
      "You've completed the target weeks for the current level",
    ],
    whenToRegress: [
      "Cannot maintain proper form for full sets",
      "Experiencing pain or discomfort",
      "Cannot complete minimum reps (50% of target)",
      "Form breaks down significantly during sets",
    ],
    alternativeExercises: [
      "Chest press machine",
      "Resistance band chest press",
      "Dumbbell bench press",
      "TRX push-ups",
    ],
    image_url: "/placeholder.svg?height=300&width=400&text=Push-Up+Progression",
  },

  // SQUAT PROGRESSION
  {
    id: "squat-progression",
    name: "Squat Progression",
    movementPattern: "Squat",
    category: "Strength",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    equipment: "Bodyweight",
    description:
      "A comprehensive squat progression from assisted squats to advanced single-leg variations, building lower body strength and mobility.",
    totalWeeks: 20,
    levels: [
      {
        level: 1,
        name: "Chair-Assisted Squats",
        description: "Squats using a chair for support to learn proper movement pattern and build initial strength.",
        targetWeeks: 2,
        progressionCriteria: {
          reps: 15,
          sets: 3,
          form: ["Sit back into squat", "Knees track over toes", "Use chair only for balance"],
        },
      },
      {
        level: 2,
        name: "Box Squats",
        description: "Squats sitting down to a box or bench to ensure proper depth and build confidence.",
        prerequisites: ["Complete Level 1 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 12,
          sets: 3,
          form: ["Sit fully on box", "Stand without using hands", "Control descent"],
        },
      },
      {
        level: 3,
        name: "Partial Range Squats",
        description: "Bodyweight squats to a comfortable depth, gradually increasing range of motion.",
        prerequisites: ["Complete Level 2 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 15,
          sets: 3,
          form: ["Consistent depth each rep", "No knee cave", "Chest up throughout"],
        },
      },
      {
        level: 4,
        name: "Full Range Bodyweight Squats",
        description: "Complete bodyweight squats with thighs parallel to floor or below.",
        prerequisites: ["Complete Level 3 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 20,
          sets: 3,
          form: ["Thighs parallel or below", "Heels stay down", "Full hip extension at top"],
        },
      },
      {
        level: 5,
        name: "Goblet Squats (Light)",
        description: "Squats holding a light weight at chest level to add load and improve form.",
        prerequisites: ["Complete Level 4 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 15,
          sets: 3,
          weight: 10, // pounds
          form: ["Weight stays at chest", "Elbows point down", "Maintain upright torso"],
        },
      },
      {
        level: 6,
        name: "Goblet Squats (Moderate)",
        description: "Squats with moderate weight to continue building strength.",
        prerequisites: ["Complete Level 5 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 12,
          sets: 3,
          weight: 20, // pounds
          form: ["Perfect squat mechanics", "No forward lean", "Smooth tempo"],
        },
      },
      {
        level: 7,
        name: "Jump Squats",
        description: "Explosive squat jumps to develop power and athleticism.",
        prerequisites: ["Complete Level 6 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 8,
          sets: 3,
          form: ["Soft landing", "Full squat depth", "Explosive upward movement"],
        },
      },
      {
        level: 8,
        name: "Single-Leg Squats (Assisted)",
        description: "Pistol squats with assistance to build unilateral strength and balance.",
        prerequisites: ["Complete Level 7 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 5,
          sets: 3,
          form: ["Control descent", "Non-working leg extended", "Use minimal assistance"],
        },
      },
    ],
    safetyNotes: [
      "Keep knees aligned with toes throughout movement",
      "Don't let knees cave inward",
      "Stop if you experience knee or hip pain",
      "Ensure adequate ankle mobility before progressing",
    ],
    commonMistakes: [
      "Knees caving inward",
      "Rising up on toes",
      "Leaning too far forward",
      "Not reaching adequate depth",
    ],
    whenToProgress: [
      "Can perform all reps with perfect form",
      "No knee or hip discomfort",
      "Can add 2-3 extra reps to final set",
      "Movement feels smooth and controlled",
    ],
    whenToRegress: [
      "Cannot maintain knee alignment",
      "Experiencing joint pain",
      "Cannot reach target depth",
      "Balance issues affecting form",
    ],
    alternativeExercises: ["Leg press machine", "Wall sits", "Step-ups", "Lunges"],
    image_url: "/placeholder.svg?height=300&width=400&text=Squat+Progression",
  },

  // PULL-UP PROGRESSION
  {
    id: "pullup-progression",
    name: "Pull-Up Progression",
    movementPattern: "Pull (Vertical)",
    category: "Strength",
    muscleGroups: ["Lats", "Rhomboids", "Biceps", "Core"],
    equipment: "Pull-up Bar",
    description:
      "A systematic pull-up progression from dead hangs to advanced variations, building upper body pulling strength.",
    totalWeeks: 24,
    levels: [
      {
        level: 1,
        name: "Dead Hang",
        description: "Simply hanging from the bar to build grip strength and shoulder stability.",
        targetWeeks: 2,
        progressionCriteria: {
          duration: 30,
          sets: 3,
          form: ["Active shoulder engagement", "Straight arms", "Feet off ground"],
        },
      },
      {
        level: 2,
        name: "Flexed Arm Hang",
        description: "Hanging with chin over bar to build isometric strength in the top position.",
        prerequisites: ["Complete Level 1 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 15,
          sets: 3,
          form: ["Chin over bar", "Chest up", "Shoulders engaged"],
        },
      },
      {
        level: 3,
        name: "Negative Pull-Ups",
        description: "Jumping up and slowly lowering down to build eccentric strength.",
        prerequisites: ["Complete Level 2 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          duration: 5, // 5-second negatives
          reps: 5,
          sets: 3,
          form: ["Slow controlled descent", "Full range of motion", "No dropping"],
        },
      },
      {
        level: 4,
        name: "Band-Assisted Pull-Ups",
        description: "Pull-ups with resistance band assistance to reduce body weight.",
        prerequisites: ["Complete Level 3 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 8,
          sets: 3,
          form: ["Full range of motion", "Chin over bar", "Control both phases"],
        },
      },
      {
        level: 5,
        name: "Partial Range Pull-Ups",
        description: "Pull-ups through partial range of motion to build strength in specific ranges.",
        prerequisites: ["Complete Level 4 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 5,
          sets: 3,
          form: ["Consistent range each rep", "No swinging", "Smooth movement"],
        },
      },
      {
        level: 6,
        name: "Full Pull-Ups",
        description: "Complete pull-ups from dead hang to chin over bar.",
        prerequisites: ["Complete Level 5 progression criteria"],
        targetWeeks: 4,
        progressionCriteria: {
          reps: 5,
          sets: 3,
          form: ["Dead hang start", "Chin clears bar", "Full extension at bottom"],
        },
      },
      {
        level: 7,
        name: "Wide-Grip Pull-Ups",
        description: "Pull-ups with wider grip to target lats more and add variety.",
        prerequisites: ["Complete Level 6 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          reps: 3,
          sets: 3,
          form: ["Hands wider than shoulders", "Lead with chest", "Full range of motion"],
        },
      },
      {
        level: 8,
        name: "Weighted Pull-Ups",
        description: "Pull-ups with additional weight to continue strength progression.",
        prerequisites: ["Complete Level 7 progression criteria"],
        targetWeeks: 4,
        progressionCriteria: {
          reps: 3,
          sets: 3,
          weight: 10, // pounds
          form: ["Maintain perfect form", "No swinging", "Control added weight"],
        },
      },
    ],
    safetyNotes: [
      "Warm up shoulders thoroughly before training",
      "Don't swing or use momentum",
      "Stop if you experience shoulder or elbow pain",
      "Use proper grip to avoid calluses and tears",
    ],
    commonMistakes: [
      "Using momentum or swinging",
      "Not achieving full range of motion",
      "Progressing too quickly",
      "Neglecting grip strength development",
    ],
    whenToProgress: [
      "Can complete all sets with strict form",
      "No shoulder or elbow discomfort",
      "Can add 1-2 extra reps to final set",
      "Movement feels smooth and controlled",
    ],
    whenToRegress: [
      "Cannot maintain strict form",
      "Experiencing joint pain",
      "Cannot complete minimum reps",
      "Relying too heavily on momentum",
    ],
    alternativeExercises: ["Lat pulldown machine", "Inverted rows", "Resistance band pull-aparts", "TRX rows"],
    image_url: "/placeholder.svg?height=300&width=400&text=Pull-Up+Progression",
  },

  // PLANK PROGRESSION
  {
    id: "plank-progression",
    name: "Plank Progression",
    movementPattern: "Anti-Extension",
    category: "Strength",
    muscleGroups: ["Core", "Shoulders", "Glutes"],
    equipment: "Bodyweight",
    description: "A progressive plank series building core stability from basic holds to dynamic variations.",
    totalWeeks: 16,
    levels: [
      {
        level: 1,
        name: "Wall Plank",
        description: "Standing plank against wall to learn proper alignment with minimal load.",
        targetWeeks: 1,
        progressionCriteria: {
          duration: 30,
          sets: 3,
          form: ["Straight line from head to heels", "Engage core", "No sagging"],
        },
      },
      {
        level: 2,
        name: "Incline Plank",
        description: "Plank with hands elevated to reduce difficulty while building strength.",
        prerequisites: ["Complete Level 1 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 30,
          sets: 3,
          form: ["Maintain straight line", "Breathe normally", "No hip drop"],
        },
      },
      {
        level: 3,
        name: "Knee Plank",
        description: "Plank from knees to build core strength before progressing to full plank.",
        prerequisites: ["Complete Level 2 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 45,
          sets: 3,
          form: ["Straight line from knees to head", "Strong core engagement", "Stable shoulders"],
        },
      },
      {
        level: 4,
        name: "Standard Plank",
        description: "Full plank from toes with proper form and breathing.",
        prerequisites: ["Complete Level 3 progression criteria"],
        targetWeeks: 3,
        progressionCriteria: {
          duration: 60,
          sets: 3,
          form: ["Perfect alignment", "Normal breathing", "No trembling"],
        },
      },
      {
        level: 5,
        name: "Plank with Leg Lifts",
        description: "Standard plank with alternating leg lifts to add instability challenge.",
        prerequisites: ["Complete Level 4 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 10, // per leg
          sets: 3,
          form: ["Maintain plank position", "Small leg lifts", "No hip rotation"],
        },
      },
      {
        level: 6,
        name: "Plank with Arm Reaches",
        description: "Plank with alternating arm reaches to challenge stability further.",
        prerequisites: ["Complete Level 5 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 8, // per arm
          sets: 3,
          form: ["Stable hips", "Reach straight ahead", "No body rotation"],
        },
      },
      {
        level: 7,
        name: "Side Plank",
        description: "Lateral plank to target obliques and lateral core stability.",
        prerequisites: ["Complete Level 6 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 30, // per side
          sets: 3,
          form: ["Straight line from head to feet", "Top arm up", "No sagging"],
        },
      },
      {
        level: 8,
        name: "Plank to Push-Up",
        description: "Dynamic movement from plank to push-up position building strength and coordination.",
        prerequisites: ["Complete Level 7 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          reps: 8,
          sets: 3,
          form: ["Smooth transitions", "Maintain alignment", "Control both directions"],
        },
      },
    ],
    safetyNotes: [
      "Don't hold your breath during planks",
      "Stop if you experience lower back pain",
      "Focus on quality over duration",
      "Keep hips level throughout",
    ],
    commonMistakes: [
      "Allowing hips to sag or pike up",
      "Holding breath",
      "Placing hands too far forward",
      "Tensing neck and shoulders",
    ],
    whenToProgress: [
      "Can hold position with perfect form",
      "Breathing remains normal throughout",
      "No trembling or form breakdown",
      "Can exceed target time by 10-15 seconds",
    ],
    whenToRegress: [
      "Cannot maintain proper alignment",
      "Experiencing lower back discomfort",
      "Holding breath or struggling to breathe",
      "Significant trembling or shaking",
    ],
    alternativeExercises: ["Dead bug", "Bird dog", "Hollow hold", "Mountain climbers"],
    image_url: "/placeholder.svg?height=300&width=400&text=Plank+Progression",
  },

  // RUNNING PROGRESSION
  {
    id: "running-progression",
    name: "Running Progression",
    movementPattern: "Gait",
    category: "Cardio",
    muscleGroups: ["Legs", "Core", "Cardiovascular System"],
    equipment: "Bodyweight",
    description:
      "A beginner-friendly running progression from walking to continuous running, building cardiovascular endurance safely.",
    totalWeeks: 12,
    levels: [
      {
        level: 1,
        name: "Brisk Walking",
        description: "Fast-paced walking to build aerobic base and prepare for running.",
        targetWeeks: 2,
        progressionCriteria: {
          duration: 1200, // 20 minutes
          sets: 1,
          form: ["Maintain brisk pace", "Good posture", "Comfortable breathing"],
        },
      },
      {
        level: 2,
        name: "Walk-Jog Intervals (1:2)",
        description: "Alternating 1 minute jogging with 2 minutes walking.",
        prerequisites: ["Complete Level 1 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 1200, // 20 minutes total
          sets: 1,
          form: ["Easy jog pace", "Land midfoot", "Relaxed shoulders"],
        },
      },
      {
        level: 3,
        name: "Walk-Jog Intervals (1:1)",
        description: "Equal intervals of 1 minute jogging and 1 minute walking.",
        prerequisites: ["Complete Level 2 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 1200, // 20 minutes total
          sets: 1,
          form: ["Consistent jog pace", "Controlled breathing", "Good form throughout"],
        },
      },
      {
        level: 4,
        name: "Walk-Jog Intervals (2:1)",
        description: "2 minutes jogging with 1 minute walking recovery.",
        prerequisites: ["Complete Level 3 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 1500, // 25 minutes total
          sets: 1,
          form: ["Maintain pace during jog intervals", "Quick recovery", "No excessive fatigue"],
        },
      },
      {
        level: 5,
        name: "Continuous Jog (Short)",
        description: "Continuous easy jogging for 10 minutes without walking breaks.",
        prerequisites: ["Complete Level 4 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 600, // 10 minutes
          sets: 1,
          form: ["Conversational pace", "Relaxed form", "No walking breaks"],
        },
      },
      {
        level: 6,
        name: "Continuous Jog (Medium)",
        description: "Continuous jogging for 15 minutes building endurance.",
        prerequisites: ["Complete Level 5 progression criteria"],
        targetWeeks: 2,
        progressionCriteria: {
          duration: 900, // 15 minutes
          sets: 1,
          form: ["Steady pace", "Efficient form", "Comfortable effort"],
        },
      },
    ],
    safetyNotes: [
      "Start slowly and build gradually",
      "Listen to your body and rest when needed",
      "Proper footwear is essential",
      "Stay hydrated, especially in warm weather",
    ],
    commonMistakes: [
      "Starting too fast",
      "Progressing too quickly",
      "Poor running form",
      "Ignoring pain or discomfort",
    ],
    whenToProgress: [
      "Can complete current level comfortably",
      "No excessive fatigue or soreness",
      "Good form maintained throughout",
      "Eager to increase challenge",
    ],
    whenToRegress: [
      "Excessive fatigue or soreness",
      "Cannot complete target duration",
      "Form breaks down significantly",
      "Joint pain or injury concerns",
    ],
    alternativeExercises: ["Stationary bike", "Elliptical machine", "Swimming", "Rowing machine"],
    image_url: "/placeholder.svg?height=300&width=400&text=Running+Progression",
  },
]

export const getProgressiveTemplateById = (id: string | number): ProgressiveExerciseTemplate | undefined => {
  return progressiveTemplates.find((template) => String(template.id) === String(id))
}

export const getProgressiveTemplatesByCategory = (category: string): ProgressiveExerciseTemplate[] => {
  return progressiveTemplates.filter((template) => template.category === category)
}

export const getProgressiveTemplatesByMovementPattern = (pattern: string): ProgressiveExerciseTemplate[] => {
  return progressiveTemplates.filter((template) => template.movementPattern === pattern)
}

export const calculateProgressionWeeks = (template: ProgressiveExerciseTemplate, currentLevel: number): number => {
  return template.levels.slice(0, currentLevel).reduce((total, level) => total + level.targetWeeks, 0)
}

export const getNextLevel = (template: ProgressiveExerciseTemplate, currentLevel: number): ProgressionLevel | null => {
  return template.levels[currentLevel] || null
}

export const getPreviousLevel = (
  template: ProgressiveExerciseTemplate,
  currentLevel: number,
): ProgressionLevel | null => {
  return currentLevel > 0 ? template.levels[currentLevel - 2] : null
}
