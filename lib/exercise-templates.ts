export interface ExerciseTemplate {
  id: number
  name: string
  movementPattern: string
  category: "Strength" | "Cardio" | "Flexibility" | "Sports"
  muscleGroups: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  equipment: string
  description: string
  instructions: string[]
  estimatedDuration: number
  benefits: string[]
  tips: string[]
  variations: {
    name: string
    description: string
  }[]
  recommendedSets: {
    sets: number
    reps: string
    rest: number
  }
  tags: string[]
}

export const movementPatterns = [
  "Push (Horizontal)",
  "Push (Vertical)",
  "Pull (Horizontal)",
  "Pull (Vertical)",
  "Squat",
  "Hinge",
  "Lunge",
  "Carry",
  "Rotation",
  "Anti-Extension",
  "Anti-Flexion",
  "Anti-Lateral Flexion",
  "Gait",
  "Jump/Plyometric",
  "Throw/Slam",
  "Isometric Hold",
  "Unilateral",
  "Bilateral",
]

export const exerciseTemplates: ExerciseTemplate[] = [
  // PUSH PATTERNS
  {
    id: 1,
    name: "Horizontal Push Template",
    movementPattern: "Push (Horizontal)",
    category: "Strength",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    difficulty: "Intermediate",
    equipment: "Barbell",
    description:
      "A horizontal pushing movement that targets the chest, shoulders, and triceps. Examples include bench press, push-ups, and chest press variations.",
    instructions: [
      "Set up in the starting position with proper alignment",
      "Engage your core and maintain neutral spine",
      "Push the weight away from your body in a horizontal plane",
      "Control the eccentric (lowering) portion of the movement",
      "Press back to the starting position with control",
      "Maintain proper breathing throughout the movement",
    ],
    estimatedDuration: 3,
    benefits: [
      "Builds upper body pushing strength",
      "Develops chest and shoulder muscles",
      "Improves functional pushing patterns",
      "Enhances core stability",
    ],
    tips: [
      "Keep your shoulder blades retracted and stable",
      "Don't allow your lower back to arch excessively",
      "Control the tempo - don't rush the movement",
      "Focus on quality over quantity",
    ],
    variations: [
      {
        name: "Incline Variation",
        description: "Perform on an inclined surface to target upper chest",
      },
      {
        name: "Decline Variation",
        description: "Perform on a declined surface to target lower chest",
      },
      {
        name: "Single-Arm Variation",
        description: "Perform one arm at a time for unilateral training",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "8-12",
      rest: 90,
    },
    tags: ["push", "horizontal", "chest", "compound"],
  },
  {
    id: 2,
    name: "Vertical Push Template",
    movementPattern: "Push (Vertical)",
    category: "Strength",
    muscleGroups: ["Shoulders", "Triceps", "Core"],
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    description:
      "A vertical pushing movement that primarily targets the shoulders and triceps. Examples include overhead press, shoulder press, and handstand push-ups.",
    instructions: [
      "Start with weights at shoulder level",
      "Engage your core and maintain upright posture",
      "Press the weight directly overhead",
      "Keep your head in neutral position",
      "Lower the weight with control to shoulder level",
      "Maintain stability throughout the movement",
    ],
    estimatedDuration: 3,
    benefits: [
      "Builds shoulder strength and stability",
      "Improves overhead mobility",
      "Develops core strength",
      "Enhances functional pressing patterns",
    ],
    tips: [
      "Don't arch your back excessively",
      "Keep your core engaged throughout",
      "Press in a straight line overhead",
      "Start with lighter weights to master form",
    ],
    variations: [
      {
        name: "Seated Variation",
        description: "Perform seated to reduce core demand and focus on shoulders",
      },
      {
        name: "Single-Arm Variation",
        description: "Press one arm at a time for unilateral strength",
      },
      {
        name: "Behind-the-Neck Variation",
        description: "Press from behind the neck (advanced, requires good mobility)",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "8-10",
      rest: 90,
    },
    tags: ["push", "vertical", "shoulders", "overhead"],
  },

  // PULL PATTERNS
  {
    id: 3,
    name: "Horizontal Pull Template",
    movementPattern: "Pull (Horizontal)",
    category: "Strength",
    muscleGroups: ["Lats", "Rhomboids", "Middle Traps", "Biceps"],
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    description:
      "A horizontal pulling movement that targets the back muscles and biceps. Examples include rows, face pulls, and horizontal pulling variations.",
    instructions: [
      "Set up with proper posture and alignment",
      "Initiate the pull by retracting your shoulder blades",
      "Pull the weight toward your torso",
      "Squeeze your shoulder blades together at the end",
      "Control the return to starting position",
      "Maintain neutral spine throughout",
    ],
    estimatedDuration: 3,
    benefits: [
      "Strengthens posterior chain muscles",
      "Improves posture and shoulder health",
      "Balances pushing movements",
      "Develops pulling strength",
    ],
    tips: [
      "Lead with your elbows, not your hands",
      "Focus on squeezing your shoulder blades",
      "Don't use momentum to complete the movement",
      "Keep your chest up and shoulders back",
    ],
    variations: [
      {
        name: "Wide Grip Variation",
        description: "Use a wider grip to target different muscle fibers",
      },
      {
        name: "Narrow Grip Variation",
        description: "Use a closer grip for more bicep involvement",
      },
      {
        name: "Single-Arm Variation",
        description: "Perform one arm at a time for unilateral training",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "10-12",
      rest: 75,
    },
    tags: ["pull", "horizontal", "back", "rows"],
  },
  {
    id: 4,
    name: "Vertical Pull Template",
    movementPattern: "Pull (Vertical)",
    category: "Strength",
    muscleGroups: ["Lats", "Rhomboids", "Biceps", "Core"],
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    description:
      "A vertical pulling movement that primarily targets the lats and upper back. Examples include pull-ups, chin-ups, and lat pulldowns.",
    instructions: [
      "Hang from the bar with arms fully extended",
      "Engage your core and maintain body tension",
      "Pull your body up by driving your elbows down",
      "Aim to get your chin over the bar",
      "Lower yourself with control to full extension",
      "Maintain proper form throughout the range of motion",
    ],
    estimatedDuration: 3,
    benefits: [
      "Builds upper body pulling strength",
      "Develops V-shaped back",
      "Improves grip strength",
      "Enhances functional pulling patterns",
    ],
    tips: [
      "Don't swing or use momentum",
      "Focus on pulling with your back, not just arms",
      "Use assistance if needed to maintain proper form",
      "Control both the up and down phases",
    ],
    variations: [
      {
        name: "Assisted Variation",
        description: "Use bands or assistance machine for beginners",
      },
      {
        name: "Weighted Variation",
        description: "Add weight for advanced practitioners",
      },
      {
        name: "Neutral Grip Variation",
        description: "Use neutral grip for different muscle emphasis",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "5-10",
      rest: 120,
    },
    tags: ["pull", "vertical", "lats", "bodyweight"],
  },

  // SQUAT PATTERNS
  {
    id: 5,
    name: "Squat Pattern Template",
    movementPattern: "Squat",
    category: "Strength",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    difficulty: "Beginner",
    equipment: "Bodyweight",
    description:
      "A fundamental squatting movement that targets the lower body muscles. Examples include bodyweight squats, goblet squats, and back squats.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your chest up and core engaged",
      "Initiate the movement by sitting back with your hips",
      "Lower until your thighs are parallel to the ground",
      "Drive through your heels to return to standing",
      "Maintain neutral spine throughout the movement",
    ],
    estimatedDuration: 2,
    benefits: [
      "Strengthens entire lower body",
      "Improves functional movement patterns",
      "Enhances core stability",
      "Builds muscle mass and strength",
    ],
    tips: [
      "Keep your knees in line with your toes",
      "Don't let your knees cave inward",
      "Focus on sitting back, not just down",
      "Keep your weight on your heels",
    ],
    variations: [
      {
        name: "Goblet Squat",
        description: "Hold weight at chest level for added resistance",
      },
      {
        name: "Jump Squat",
        description: "Add explosive jump for plyometric training",
      },
      {
        name: "Single-Leg Squat",
        description: "Perform on one leg for unilateral strength",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "12-15",
      rest: 60,
    },
    tags: ["squat", "lower body", "compound", "functional"],
  },

  // HINGE PATTERNS
  {
    id: 6,
    name: "Hip Hinge Template",
    movementPattern: "Hinge",
    category: "Strength",
    muscleGroups: ["Glutes", "Hamstrings", "Lower Back", "Core"],
    difficulty: "Intermediate",
    equipment: "Kettlebell",
    description:
      "A hip-dominant movement that targets the posterior chain. Examples include deadlifts, kettlebell swings, and Romanian deadlifts.",
    instructions: [
      "Stand with feet hip-width apart",
      "Keep a slight bend in your knees",
      "Hinge at the hips by pushing your hips back",
      "Keep your chest up and spine neutral",
      "Feel a stretch in your hamstrings",
      "Drive your hips forward to return to standing",
    ],
    estimatedDuration: 3,
    benefits: [
      "Strengthens posterior chain muscles",
      "Improves hip mobility and function",
      "Builds functional movement patterns",
      "Enhances athletic performance",
    ],
    tips: [
      "This is a hip movement, not a squat",
      "Keep the weight close to your body",
      "Don't round your back",
      "Focus on feeling the stretch in your hamstrings",
    ],
    variations: [
      {
        name: "Single-Leg Hinge",
        description: "Perform on one leg for unilateral training",
      },
      {
        name: "Stiff-Leg Variation",
        description: "Keep legs straighter for more hamstring emphasis",
      },
      {
        name: "Sumo Stance",
        description: "Use wider stance for different muscle emphasis",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "8-12",
      rest: 90,
    },
    tags: ["hinge", "posterior chain", "glutes", "hamstrings"],
  },

  // LUNGE PATTERNS
  {
    id: 7,
    name: "Lunge Pattern Template",
    movementPattern: "Lunge",
    category: "Strength",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    description:
      "A unilateral lower body movement that challenges balance and stability. Examples include forward lunges, reverse lunges, and lateral lunges.",
    instructions: [
      "Start in a standing position",
      "Step into lunge position (forward, back, or lateral)",
      "Lower your body until both knees are at 90 degrees",
      "Keep your torso upright and core engaged",
      "Push through your front heel to return to start",
      "Maintain balance and control throughout",
    ],
    estimatedDuration: 3,
    benefits: [
      "Builds unilateral leg strength",
      "Improves balance and stability",
      "Enhances functional movement",
      "Addresses muscle imbalances",
    ],
    tips: [
      "Don't let your front knee go past your toes",
      "Keep most of your weight on your front leg",
      "Maintain upright torso position",
      "Control the descent and ascent",
    ],
    variations: [
      {
        name: "Reverse Lunge",
        description: "Step backward instead of forward",
      },
      {
        name: "Lateral Lunge",
        description: "Step to the side for frontal plane movement",
      },
      {
        name: "Walking Lunge",
        description: "Alternate legs while moving forward",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "10-12 each leg",
      rest: 75,
    },
    tags: ["lunge", "unilateral", "balance", "functional"],
  },

  // CORE PATTERNS
  {
    id: 8,
    name: "Anti-Extension Template",
    movementPattern: "Anti-Extension",
    category: "Strength",
    muscleGroups: ["Core", "Abs", "Hip Flexors"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    description: "Core exercises that resist spinal extension. Examples include planks, dead bugs, and hollow holds.",
    instructions: [
      "Get into the starting position",
      "Engage your core muscles",
      "Maintain neutral spine position",
      "Resist the urge to arch your back",
      "Breathe normally while holding tension",
      "Focus on quality over duration",
    ],
    estimatedDuration: 2,
    benefits: [
      "Builds core stability and strength",
      "Improves spinal health",
      "Enhances posture",
      "Reduces lower back pain risk",
    ],
    tips: [
      "Don't hold your breath",
      "Focus on maintaining neutral spine",
      "Start with shorter holds and progress",
      "Quality is more important than duration",
    ],
    variations: [
      {
        name: "Dynamic Variation",
        description: "Add movement while maintaining core stability",
      },
      {
        name: "Single-Limb Variation",
        description: "Remove one point of contact for increased challenge",
      },
      {
        name: "Loaded Variation",
        description: "Add external resistance for progression",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "30-60 seconds",
      rest: 45,
    },
    tags: ["core", "anti-extension", "stability", "isometric"],
  },

  // CARDIO PATTERNS
  {
    id: 9,
    name: "Gait Pattern Template",
    movementPattern: "Gait",
    category: "Cardio",
    muscleGroups: ["Full Body", "Legs", "Core"],
    difficulty: "Beginner",
    equipment: "Bodyweight",
    description:
      "Movement patterns that mimic or enhance natural gait. Examples include walking, running, marching, and step-ups.",
    instructions: [
      "Maintain upright posture",
      "Engage your core for stability",
      "Use natural arm swing",
      "Land softly with each step",
      "Maintain steady rhythm",
      "Focus on proper breathing",
    ],
    estimatedDuration: 5,
    benefits: ["Improves cardiovascular health", "Enhances coordination", "Builds endurance", "Low impact on joints"],
    tips: [
      "Start at a comfortable pace",
      "Focus on form over speed",
      "Land on midfoot, not heel",
      "Keep your head up and eyes forward",
    ],
    variations: [
      {
        name: "High Knees",
        description: "Exaggerated knee lift for intensity",
      },
      {
        name: "Butt Kicks",
        description: "Heel to glute contact for hamstring activation",
      },
      {
        name: "Lateral Steps",
        description: "Side-to-side movement for frontal plane training",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "30-60 seconds",
      rest: 30,
    },
    tags: ["gait", "cardio", "coordination", "endurance"],
  },

  // PLYOMETRIC PATTERNS
  {
    id: 10,
    name: "Jump/Plyometric Template",
    movementPattern: "Jump/Plyometric",
    category: "Sports",
    muscleGroups: ["Quadriceps", "Glutes", "Calves", "Core"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    description:
      "Explosive jumping movements that develop power and athleticism. Examples include jump squats, box jumps, and broad jumps.",
    instructions: [
      "Start in athletic position",
      "Load your muscles with a quick countermovement",
      "Explode upward with maximum force",
      "Extend through your hips, knees, and ankles",
      "Land softly with bent knees",
      "Reset before the next repetition",
    ],
    estimatedDuration: 2,
    benefits: [
      "Develops explosive power",
      "Improves athletic performance",
      "Builds fast-twitch muscle fibers",
      "Enhances coordination",
    ],
    tips: [
      "Focus on landing softly",
      "Quality over quantity",
      "Rest between reps to maintain power",
      "Progress gradually to avoid injury",
    ],
    variations: [
      {
        name: "Single-Leg Jump",
        description: "Perform on one leg for unilateral power",
      },
      {
        name: "Lateral Jump",
        description: "Jump side-to-side for frontal plane power",
      },
      {
        name: "Depth Jump",
        description: "Step down then immediately jump up",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "5-8",
      rest: 120,
    },
    tags: ["plyometric", "power", "explosive", "athletic"],
  },

  // CARRY PATTERNS
  {
    id: 11,
    name: "Carry Pattern Template",
    movementPattern: "Carry",
    category: "Strength",
    muscleGroups: ["Core", "Shoulders", "Traps", "Legs"],
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    description:
      "Loaded carrying movements that build strength and stability. Examples include farmer's walks, suitcase carries, and overhead carries.",
    instructions: [
      "Pick up the weight with proper form",
      "Maintain upright posture",
      "Engage your core throughout",
      "Take controlled steps",
      "Keep your shoulders level",
      "Breathe normally while walking",
    ],
    estimatedDuration: 2,
    benefits: [
      "Builds functional strength",
      "Improves core stability",
      "Enhances grip strength",
      "Develops postural muscles",
    ],
    tips: [
      "Start with lighter weights",
      "Focus on maintaining posture",
      "Don't lean to one side",
      "Take your time with each step",
    ],
    variations: [
      {
        name: "Suitcase Carry",
        description: "Carry weight on one side only",
      },
      {
        name: "Overhead Carry",
        description: "Carry weight overhead for shoulder stability",
      },
      {
        name: "Front-Loaded Carry",
        description: "Carry weight in front for core challenge",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "20-40 steps",
      rest: 90,
    },
    tags: ["carry", "functional", "core", "stability"],
  },
  // ADDITIONAL MOVEMENT PATTERNS
  {
    id: 12,
    name: "Rotation Pattern Template",
    movementPattern: "Rotation",
    category: "Sports",
    muscleGroups: ["Obliques", "Core", "Shoulders"],
    difficulty: "Intermediate",
    equipment: "Medicine Ball",
    description:
      "Rotational movements that develop power and stability in the transverse plane. Examples include wood chops, Russian twists, and rotational throws.",
    instructions: [
      "Start in athletic stance with core engaged",
      "Initiate movement from your core, not arms",
      "Rotate through your torso while maintaining posture",
      "Control both the rotation and return phases",
      "Keep your hips stable during upper body rotation",
      "Breathe out during the exertion phase",
    ],
    estimatedDuration: 3,
    benefits: [
      "Develops rotational power",
      "Improves core strength",
      "Enhances athletic performance",
      "Builds functional movement patterns",
    ],
    tips: [
      "Start with lighter resistance",
      "Focus on core initiation",
      "Don't rotate from your back",
      "Control the entire range of motion",
    ],
    variations: [
      {
        name: "Half-Kneeling Rotation",
        description: "Perform in half-kneeling position for stability",
      },
      {
        name: "Standing Rotation",
        description: "Full standing position for functional training",
      },
      {
        name: "Seated Rotation",
        description: "Seated position to isolate core rotation",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "10-15 each side",
      rest: 60,
    },
    tags: ["rotation", "core", "power", "athletic"],
  },
  {
    id: 13,
    name: "Unilateral Training Template",
    movementPattern: "Unilateral",
    category: "Strength",
    muscleGroups: ["Variable", "Core", "Stabilizers"],
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    description:
      "Single-limb exercises that address imbalances and improve stability. Examples include single-arm rows, single-leg squats, and unilateral carries.",
    instructions: [
      "Set up in proper starting position",
      "Engage your core for stability",
      "Perform movement with one limb while stabilizing",
      "Focus on maintaining balance and control",
      "Complete all reps on one side before switching",
      "Pay attention to any strength differences",
    ],
    estimatedDuration: 4,
    benefits: [
      "Addresses muscle imbalances",
      "Improves stability and balance",
      "Enhances proprioception",
      "Builds functional strength",
    ],
    tips: [
      "Start with lighter weights",
      "Focus on quality over quantity",
      "Use your core to maintain stability",
      "Progress gradually to avoid injury",
    ],
    variations: [
      {
        name: "Alternating Pattern",
        description: "Alternate sides with each rep",
      },
      {
        name: "Offset Loading",
        description: "Hold weight on opposite side",
      },
      {
        name: "Single-Side Focus",
        description: "Complete all sets on weaker side first",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "8-12 each side",
      rest: 75,
    },
    tags: ["unilateral", "balance", "stability", "imbalances"],
  },
  {
    id: 14,
    name: "Bilateral Training Template",
    movementPattern: "Bilateral",
    category: "Strength",
    muscleGroups: ["Variable", "Core"],
    difficulty: "Beginner",
    equipment: "Barbell",
    description:
      "Two-limb exercises that allow for heavier loading and strength development. Examples include squats, deadlifts, and bench press.",
    instructions: [
      "Set up with proper symmetrical positioning",
      "Engage both sides equally",
      "Maintain balance between left and right",
      "Focus on coordinated movement patterns",
      "Use full range of motion",
      "Progress load gradually over time",
    ],
    estimatedDuration: 3,
    benefits: [
      "Allows for heavier loading",
      "Builds maximum strength",
      "Develops coordination",
      "Efficient for muscle building",
    ],
    tips: [
      "Ensure equal contribution from both sides",
      "Don't let one side dominate",
      "Focus on symmetrical movement",
      "Progress weight conservatively",
    ],
    variations: [
      {
        name: "Barbell Variation",
        description: "Using barbell for maximum load",
      },
      {
        name: "Dumbbell Variation",
        description: "Using dumbbells for more freedom",
      },
      {
        name: "Machine Variation",
        description: "Using machines for guided movement",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "6-12",
      rest: 90,
    },
    tags: ["bilateral", "strength", "coordination", "loading"],
  },
  {
    id: 15,
    name: "Isometric Hold Template",
    movementPattern: "Isometric Hold",
    category: "Strength",
    muscleGroups: ["Variable", "Core"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    description:
      "Static holds that build strength and endurance. Examples include planks, wall sits, and static squats.",
    instructions: [
      "Get into the target position",
      "Engage all relevant muscles",
      "Maintain proper alignment",
      "Breathe normally throughout the hold",
      "Focus on maintaining tension",
      "Hold for prescribed duration",
    ],
    estimatedDuration: 2,
    benefits: [
      "Builds isometric strength",
      "Improves muscular endurance",
      "Enhances stability",
      "Develops mental toughness",
    ],
    tips: [
      "Start with shorter holds",
      "Focus on proper form over duration",
      "Don't hold your breath",
      "Progress time gradually",
    ],
    variations: [
      {
        name: "Loaded Hold",
        description: "Add external resistance",
      },
      {
        name: "Single-Limb Hold",
        description: "Remove one point of contact",
      },
      {
        name: "Dynamic Hold",
        description: "Add small movements during hold",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "20-60 seconds",
      rest: 60,
    },
    tags: ["isometric", "endurance", "stability", "mental"],
  },
  {
    id: 16,
    name: "Throw/Slam Template",
    movementPattern: "Throw/Slam",
    category: "Sports",
    muscleGroups: ["Full Body", "Core", "Shoulders"],
    difficulty: "Intermediate",
    equipment: "Medicine Ball",
    description:
      "Explosive throwing and slamming movements that develop power. Examples include medicine ball slams, wall balls, and rotational throws.",
    instructions: [
      "Start in athletic position",
      "Generate power from your legs and core",
      "Accelerate through the throwing motion",
      "Follow through completely",
      "Reset and prepare for next repetition",
      "Focus on maximum effort with each rep",
    ],
    estimatedDuration: 2,
    benefits: [
      "Develops explosive power",
      "Improves rate of force development",
      "Enhances athletic performance",
      "Provides stress relief",
    ],
    tips: [
      "Use your whole body, not just arms",
      "Focus on speed and power",
      "Allow for full follow-through",
      "Rest between reps to maintain quality",
    ],
    variations: [
      {
        name: "Overhead Slam",
        description: "Slam from overhead position",
      },
      {
        name: "Rotational Throw",
        description: "Add rotational component",
      },
      {
        name: "Chest Pass",
        description: "Explosive chest-level throw",
      },
    ],
    recommendedSets: {
      sets: 4,
      reps: "6-10",
      rest: 90,
    },
    tags: ["explosive", "power", "athletic", "full-body"],
  },
  {
    id: 17,
    name: "Anti-Flexion Template",
    movementPattern: "Anti-Flexion",
    category: "Strength",
    muscleGroups: ["Lower Back", "Glutes", "Hamstrings"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    description:
      "Exercises that resist spinal flexion and strengthen the posterior chain. Examples include back extensions, reverse hyperextensions, and good mornings.",
    instructions: [
      "Set up in starting position",
      "Engage your glutes and hamstrings",
      "Maintain neutral spine alignment",
      "Resist the urge to round your back",
      "Focus on hip hinge movement",
      "Control both concentric and eccentric phases",
    ],
    estimatedDuration: 3,
    benefits: ["Strengthens posterior chain", "Improves spinal health", "Enhances posture", "Reduces back pain risk"],
    tips: [
      "Don't hyperextend your back",
      "Focus on hip movement, not back",
      "Start with bodyweight only",
      "Progress slowly and carefully",
    ],
    variations: [
      {
        name: "Prone Hold",
        description: "Static hold in extended position",
      },
      {
        name: "Dynamic Extension",
        description: "Controlled movement through range",
      },
      {
        name: "Loaded Variation",
        description: "Add external resistance",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "10-15",
      rest: 60,
    },
    tags: ["anti-flexion", "posterior-chain", "spinal-health", "posture"],
  },
  {
    id: 18,
    name: "Anti-Lateral Flexion Template",
    movementPattern: "Anti-Lateral Flexion",
    category: "Strength",
    muscleGroups: ["Obliques", "Core", "Quadratus Lumborum"],
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    description:
      "Exercises that resist lateral spinal flexion. Examples include side planks, suitcase carries, and unilateral farmer's walks.",
    instructions: [
      "Set up in proper alignment",
      "Engage your core and obliques",
      "Resist lateral bending or tilting",
      "Maintain neutral spine position",
      "Focus on stability over movement",
      "Breathe normally while maintaining tension",
    ],
    estimatedDuration: 2,
    benefits: [
      "Strengthens lateral core muscles",
      "Improves spinal stability",
      "Enhances functional strength",
      "Reduces injury risk",
    ],
    tips: [
      "Don't let your body lean or tilt",
      "Focus on maintaining straight line",
      "Start with shorter durations",
      "Progress gradually",
    ],
    variations: [
      {
        name: "Static Hold",
        description: "Hold position without movement",
      },
      {
        name: "Dynamic Challenge",
        description: "Add movement while maintaining stability",
      },
      {
        name: "Loaded Carry",
        description: "Walk while resisting lateral flexion",
      },
    ],
    recommendedSets: {
      sets: 3,
      reps: "30-45 seconds each side",
      rest: 45,
    },
    tags: ["anti-lateral-flexion", "obliques", "stability", "functional"],
  },
  {
    id: 19,
    name: "Metabolic Conditioning Template",
    movementPattern: "Gait",
    category: "Cardio",
    muscleGroups: ["Full Body", "Cardiovascular System"],
    difficulty: "Intermediate",
    equipment: "Variable",
    description:
      "High-intensity exercises designed to improve metabolic capacity. Examples include circuit training, HIIT, and complex movements.",
    instructions: [
      "Warm up thoroughly before starting",
      "Work at high intensity during work periods",
      "Focus on maintaining good form despite fatigue",
      "Use prescribed rest periods for recovery",
      "Monitor your heart rate if possible",
      "Cool down properly after completion",
    ],
    estimatedDuration: 4,
    benefits: [
      "Improves cardiovascular fitness",
      "Increases metabolic rate",
      "Burns calories efficiently",
      "Builds work capacity",
    ],
    tips: [
      "Start conservatively and build up",
      "Form is more important than speed",
      "Listen to your body",
      "Stay hydrated throughout",
    ],
    variations: [
      {
        name: "HIIT Protocol",
        description: "High intensity intervals with rest",
      },
      {
        name: "Circuit Training",
        description: "Multiple exercises in sequence",
      },
      {
        name: "Tabata Protocol",
        description: "20 seconds work, 10 seconds rest",
      },
    ],
    recommendedSets: {
      sets: 4,
      reps: "30-60 seconds",
      rest: 30,
    },
    tags: ["metabolic", "conditioning", "hiit", "cardio"],
  },
  {
    id: 20,
    name: "Mobility Enhancement Template",
    movementPattern: "Gait",
    category: "Flexibility",
    muscleGroups: ["Variable", "Joints", "Fascia"],
    difficulty: "Beginner",
    equipment: "Yoga Mat",
    description:
      "Dynamic movements that improve joint range of motion and movement quality. Examples include leg swings, arm circles, and dynamic stretching.",
    instructions: [
      "Start with gentle, controlled movements",
      "Gradually increase range of motion",
      "Move through full available range",
      "Don't force or bounce",
      "Focus on smooth, rhythmic movements",
      "Breathe naturally throughout",
    ],
    estimatedDuration: 3,
    benefits: [
      "Improves joint mobility",
      "Enhances movement quality",
      "Prepares body for activity",
      "Reduces injury risk",
    ],
    tips: [
      "Never force a stretch",
      "Move within comfortable range",
      "Progress gradually over time",
      "Focus on areas of restriction",
    ],
    variations: [
      {
        name: "Static Stretching",
        description: "Hold stretches for extended periods",
      },
      {
        name: "Dynamic Movement",
        description: "Moving stretches and mobility work",
      },
      {
        name: "PNF Stretching",
        description: "Contract-relax stretching technique",
      },
    ],
    recommendedSets: {
      sets: 2,
      reps: "10-15 movements",
      rest: 15,
    },
    tags: ["mobility", "flexibility", "movement-quality", "injury-prevention"],
  },
]

export const getTemplatesByMovementPattern = (pattern: string): ExerciseTemplate[] => {
  return exerciseTemplates.filter((template) => template.movementPattern === pattern)
}

export const getTemplatesByCategory = (category: string): ExerciseTemplate[] => {
  return exerciseTemplates.filter((template) => template.category === category)
}

export const getTemplatesByDifficulty = (difficulty: string): ExerciseTemplate[] => {
  return exerciseTemplates.filter((template) => template.difficulty === difficulty)
}

export const searchTemplates = (searchTerm: string): ExerciseTemplate[] => {
  const term = searchTerm.toLowerCase()
  return exerciseTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(term) ||
      template.movementPattern.toLowerCase().includes(term) ||
      template.description.toLowerCase().includes(term) ||
      template.muscleGroups.some((muscle) => muscle.toLowerCase().includes(term)) ||
      template.tags.some((tag) => tag.toLowerCase().includes(term)),
  )
}
