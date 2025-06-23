export interface WorkoutTemplate {
  id: string
  name: string
  nameTranslations: {
    th: string
  }
  type: "Cardio" | "Strength" | "Core" | "Flexibility" | "Full Body" | "HIIT"
  duration: number // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description: string
  descriptionTranslations: {
    th: string
  }
  exercises: {
    name: string
    nameTranslations: {
      th: string
    }
    sets?: number
    reps?: number | string
    duration?: number // in seconds
    rest?: number // in seconds
    instructions: string
    instructionsTranslations: {
      th: string
    }
  }[]
  equipment: string[]
  targetMuscles: string[]
  calories: number // estimated calories burned
  tags: string[]
}

export const workoutTemplates: WorkoutTemplate[] = [
  // EXISTING TEMPLATES (keeping the current structure)
  {
    id: "full-body-beginner",
    name: "Full Body Beginner",
    nameTranslations: {
      th: "โปรแกรมเริ่มต้นทั้งร่างกาย",
    },
    type: "Full Body",
    duration: 30,
    difficulty: "Beginner",
    description:
      "A complete full-body workout perfect for beginners. Focuses on basic movements and building strength.",
    descriptionTranslations: {
      th: "โปรแกรมออกกำลังกายทั้งร่างกายที่เหมาะสำหรับผู้เริ่มต้น เน้นการเคลื่อนไหวพื้นฐานและการสร้างความแข็งแรง",
    },
    exercises: [
      {
        name: "Bodyweight Squats",
        nameTranslations: { th: "สควอทด้วยน้ำหนักตัว" },
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: "Stand with feet shoulder-width apart, lower into squat position, then return to standing.",
        instructionsTranslations: { th: "ยืนให้เท้าห่างเท่าไหล่ ลงนั่งท่าสควอท แล้วกลับสู่ท่ายืน" },
      },
      {
        name: "Push-ups (Modified)",
        nameTranslations: { th: "วิดพื้น (แบบปรับเปลี่ยน)" },
        sets: 3,
        reps: 8,
        rest: 60,
        instructions: "Start in plank position, lower chest to ground, push back up. Use knees if needed.",
        instructionsTranslations: { th: "เริ่มในท่าแพลงค์ ลดอกลงสู่พื้น แล้วผลักขึ้น ใช้เข่าถ้าจำเป็น" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Full Body"],
    calories: 150,
    tags: ["beginner", "full-body", "bodyweight"],
  },
  {
    id: "hiit-cardio",
    name: "HIIT Cardio Blast",
    nameTranslations: {
      th: "HIIT คาร์ดิโอเบิร์น",
    },
    type: "HIIT",
    duration: 20,
    difficulty: "Intermediate",
    description: "High-intensity interval training to boost cardiovascular fitness and burn calories quickly.",
    descriptionTranslations: {
      th: "การฝึกแบบช่วงความเข้มสูงเพื่อเพิ่มสมรรถภาพหัวใจและเผาผลาญแคลอรี่อย่างรวดเร็ว",
    },
    exercises: [
      {
        name: "Jumping Jacks",
        nameTranslations: { th: "จัมปิ้งแจ็ค" },
        duration: 30,
        rest: 15,
        instructions: "Jump while spreading legs and raising arms overhead, then return to starting position.",
        instructionsTranslations: { th: "กระโดดพร้อมแยกขาและยกแขนขึ้นเหนือศีรษะ แล้วกลับสู่ท่าเริ่มต้น" },
      },
      {
        name: "High Knees",
        nameTranslations: { th: "ยกเข่าสูง" },
        duration: 30,
        rest: 15,
        instructions: "Run in place while lifting knees as high as possible toward chest.",
        instructionsTranslations: { th: "วิ่งในที่พร้อมยกเข่าให้สูงที่สุดเข้าหาอก" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Cardiovascular", "Full Body"],
    calories: 200,
    tags: ["hiit", "cardio", "high-intensity"],
  },

  // NEW CARDIO TEMPLATES
  {
    id: "jump-rope-cardio",
    name: "Jump Rope Cardio",
    nameTranslations: {
      th: "กระโดดเชือกคาร์ดิโอ",
    },
    type: "Cardio",
    duration: 15,
    difficulty: "Beginner",
    description: "Simple yet effective jump rope workout to improve coordination and cardiovascular health.",
    descriptionTranslations: {
      th: "การออกกำลังกายกระโดดเชือกที่เรียบง่ายแต่มีประสิทธิภาพ เพื่อพัฒนาการประสานงานและสุขภาพหัวใจ",
    },
    exercises: [
      {
        name: "Basic Jump Rope",
        nameTranslations: { th: "กระโดดเชือกพื้นฐาน" },
        sets: 5,
        duration: 60,
        rest: 30,
        instructions: "Jump with both feet together, keeping a steady rhythm. Land softly on balls of feet.",
        instructionsTranslations: { th: "กระโดดด้วยเท้าทั้งสองข้างพร้อมกัน รักษาจังหวะให้สม่ำเสมอ ลงด้วยปลายเท้าอย่างนุ่มนวล" },
      },
      {
        name: "Single Leg Hops",
        nameTranslations: { th: "กระโดดขาเดียว" },
        sets: 4,
        duration: 30,
        rest: 45,
        instructions: "Alternate jumping on one foot, then the other. Focus on balance and control.",
        instructionsTranslations: { th: "สลับกระโดดด้วยขาข้างหนึ่ง แล้วขาอีกข้าง เน้นการทรงตัวและการควบคุม" },
      },
    ],
    equipment: ["Jump Rope"],
    targetMuscles: ["Calves", "Cardiovascular", "Core"],
    calories: 180,
    tags: ["cardio", "jump-rope", "coordination"],
  },
  {
    id: "burpee-blast",
    name: "Burpee Blast",
    nameTranslations: {
      th: "เบอร์ปี้เบิร์น",
    },
    type: "Cardio",
    duration: 12,
    difficulty: "Intermediate",
    description: "High-intensity burpee workout that targets full body strength and cardiovascular endurance.",
    descriptionTranslations: {
      th: "การออกกำลังกายเบอร์ปี้ความเข้มสูงที่เน้นความแข็งแรงทั้งร่างกายและความอดทนของหัวใจ",
    },
    exercises: [
      {
        name: "Standard Burpees",
        nameTranslations: { th: "เบอร์ปี้มาตรฐาน" },
        sets: 4,
        reps: 8,
        rest: 60,
        instructions: "Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead.",
        instructionsTranslations: { th: "นั่งยองลง กระโดดถอยหลังเป็นท่าแพลงค์ วิดพื้น กระโดดเท้าเข้าหา แล้วกระโดดขึ้นยกแขน" },
      },
      {
        name: "Burpee Variations",
        nameTranslations: { th: "เบอร์ปี้หลากหลาย" },
        sets: 3,
        reps: 6,
        rest: 90,
        instructions: "Mix different burpee styles: half burpees, burpee broad jumps, or single-arm burpees.",
        instructionsTranslations: { th: "ผสมเบอร์ปี้หลายแบบ: ครึ่งเบอร์ปี้ เบอร์ปี้กระโดดไกล หรือเบอร์ปี้แขนเดียว" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Full Body", "Cardiovascular"],
    calories: 220,
    tags: ["burpees", "hiit", "full-body", "intense"],
  },
  {
    id: "mountain-climber-cardio",
    name: "Mountain Climber Cardio",
    nameTranslations: {
      th: "เมาน์เทนไคลม์เบอร์คาร์ดิโอ",
    },
    type: "Cardio",
    duration: 10,
    difficulty: "Beginner",
    description: "Fast-paced mountain climber workout to build core strength and cardiovascular endurance.",
    descriptionTranslations: {
      th: "การออกกำลังกายเมาน์เทนไคลม์เบอร์จังหวะเร็วเพื่อสร้างความแข็งแรงของกล้ามเนื้อหลักและความอดทนของหัวใจ",
    },
    exercises: [
      {
        name: "Mountain Climbers",
        nameTranslations: { th: "เมาน์เทนไคลม์เบอร์" },
        sets: 4,
        duration: 45,
        rest: 30,
        instructions:
          "Start in plank position, alternate bringing knees to chest rapidly while maintaining plank form.",
        instructionsTranslations: { th: "เริ่มในท่าแพลงค์ สลับดึงเข่าเข้าหาอกอย่างรวดเร็วโดยรักษาท่าแพลงค์" },
      },
      {
        name: "Cross-Body Mountain Climbers",
        nameTranslations: { th: "เมาน์เทนไคลม์เบอร์ข้ามตัว" },
        sets: 3,
        duration: 30,
        rest: 45,
        instructions: "Bring knee toward opposite elbow, alternating sides to engage obliques.",
        instructionsTranslations: { th: "ดึงเข่าไปหาข้อศอกข้างตรงข้าม สลับข้างเพื่อใช้กล้ามเนื้อข้างลำตัว" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Core", "Shoulders", "Cardiovascular"],
    calories: 160,
    tags: ["mountain-climbers", "core", "cardio"],
  },
  {
    id: "high-knees-workout",
    name: "High Knees Workout",
    nameTranslations: {
      th: "การออกกำลังกายยกเข่าสูง",
    },
    type: "Cardio",
    duration: 8,
    difficulty: "Beginner",
    description: "Dynamic high knees workout to improve leg strength, coordination, and cardiovascular fitness.",
    descriptionTranslations: {
      th: "การออกกำลังกายยกเข่าสูงแบบไดนามิกเพื่อพัฒนาความแข็งแรงของขา การประสานงาน และสมรรถภาพหัวใจ",
    },
    exercises: [
      {
        name: "High Knees March",
        nameTranslations: { th: "เดินยกเข่าสูง" },
        sets: 3,
        duration: 60,
        rest: 30,
        instructions: "March in place lifting knees to hip level, pump arms naturally, maintain good posture.",
        instructionsTranslations: { th: "เดินในที่ยกเข่าถึงระดับสะโพก แกว่งแขนตามธรรมชาติ รักษาท่าทางที่ดี" },
      },
      {
        name: "High Knees Sprint",
        nameTranslations: { th: "วิ่งยกเข่าสูง" },
        sets: 4,
        duration: 30,
        rest: 45,
        instructions: "Run in place with maximum knee lift, increase tempo for higher intensity.",
        instructionsTranslations: { th: "วิ่งในที่พร้อมยกเข่าให้สูงสุด เพิ่มจังหวะเพื่อความเข้มข้นสูงขึ้น" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Quadriceps", "Hip Flexors", "Cardiovascular"],
    calories: 140,
    tags: ["high-knees", "cardio", "legs"],
  },

  // NEW STRENGTH TEMPLATES
  {
    id: "push-up-power",
    name: "Push-up Power",
    nameTranslations: {
      th: "พาวเวอร์วิดพื้น",
    },
    type: "Strength",
    duration: 20,
    difficulty: "Intermediate",
    description:
      "Comprehensive push-up workout targeting chest, shoulders, and triceps with various push-up variations.",
    descriptionTranslations: {
      th: "การออกกำลังกายวิดพื้นแบบครอบคลุมที่เน้นอก ไหล่ และกล้ามเนื้อแขนหลังด้วยท่าวิดพื้นหลากหลาย",
    },
    exercises: [
      {
        name: "Standard Push-ups",
        nameTranslations: { th: "วิดพื้นมาตรฐาน" },
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: "Keep body straight, lower chest to ground, push back up maintaining form.",
        instructionsTranslations: { th: "รักษาตัวให้ตรง ลดอกลงสู่พื้น ผลักขึ้นโดยรักษาท่าทาง" },
      },
      {
        name: "Wide-Grip Push-ups",
        nameTranslations: { th: "วิดพื้นมือกว้าง" },
        sets: 3,
        reps: 10,
        rest: 60,
        instructions: "Place hands wider than shoulders, focus on chest engagement.",
        instructionsTranslations: { th: "วางมือกว้างกว่าไหล่ เน้นการใช้กล้ามเนื้ออก" },
      },
      {
        name: "Diamond Push-ups",
        nameTranslations: { th: "วิดพื้นเพชร" },
        sets: 2,
        reps: 8,
        rest: 90,
        instructions: "Form diamond shape with hands, targets triceps more intensely.",
        instructionsTranslations: { th: "ทำรูปเพชรด้วยมือ เน้นกล้ามเนื้อแขนหลังมากขึ้น" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    calories: 120,
    tags: ["push-ups", "upper-body", "strength"],
  },
  {
    id: "squat-strength",
    name: "Squat Strength",
    nameTranslations: {
      th: "ความแข็งแรงสควอท",
    },
    type: "Strength",
    duration: 25,
    difficulty: "Intermediate",
    description: "Lower body strength workout focusing on squat variations to build leg and glute strength.",
    descriptionTranslations: {
      th: "การออกกำลังกายความแข็งแรงส่วนล่างที่เน้นท่าสควอทหลากหลายเพื่อสร้างความแข็งแรงของขาและสะโพก",
    },
    exercises: [
      {
        name: "Bodyweight Squats",
        nameTranslations: { th: "สควอทน้ำหนักตัว" },
        sets: 4,
        reps: 15,
        rest: 60,
        instructions: "Feet shoulder-width apart, sit back and down, drive through heels to stand.",
        instructionsTranslations: { th: "เท้าห่างเท่าไหล่ นั่งถอยหลังและลง ผลักผ่านส้นเท้าเพื่อยืน" },
      },
      {
        name: "Jump Squats",
        nameTranslations: { th: "สควอทกระโดด" },
        sets: 3,
        reps: 12,
        rest: 75,
        instructions: "Perform squat then explode up into jump, land softly and repeat.",
        instructionsTranslations: { th: "ทำสควอทแล้วระเบิดขึ้นกระโดด ลงอย่างนุ่มนวลและทำซ้ำ" },
      },
      {
        name: "Single-Leg Squats",
        nameTranslations: { th: "สควอทขาเดียว" },
        sets: 2,
        reps: "6 each leg",
        rest: 90,
        instructions: "Squat on one leg, use chair for balance if needed, focus on control.",
        instructionsTranslations: { th: "สควอทด้วยขาข้างเดียว ใช้เก้าอี้ช่วยทรงตัวถ้าจำเป็น เน้นการควบคุม" },
      },
    ],
    equipment: ["None", "Chair (optional)"],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    calories: 140,
    tags: ["squats", "lower-body", "strength", "glutes"],
  },
  {
    id: "lunge-workout",
    name: "Lunge Workout",
    nameTranslations: {
      th: "การออกกำลังกายลันจ์",
    },
    type: "Strength",
    duration: 18,
    difficulty: "Beginner",
    description: "Unilateral leg strength workout using various lunge patterns to improve balance and leg strength.",
    descriptionTranslations: {
      th: "การออกกำลังกายความแข็งแรงขาแบบข้างเดียวใช้ท่าลันจ์หลากหลายเพื่อพัฒนาการทรงตัวและความแข็งแรงของขา",
    },
    exercises: [
      {
        name: "Forward Lunges",
        nameTranslations: { th: "ลันจ์ไปข้างหน้า" },
        sets: 3,
        reps: "12 each leg",
        rest: 60,
        instructions: "Step forward into lunge, lower back knee toward ground, push back to start.",
        instructionsTranslations: { th: "ก้าวไปข้างหน้าเป็นท่าลันจ์ ลดเข่าหลังลงสู่พื้น ผลักกลับสู่จุดเริ่มต้น" },
      },
      {
        name: "Reverse Lunges",
        nameTranslations: { th: "ลันจ์ถอยหลัง" },
        sets: 3,
        reps: "10 each leg",
        rest: 60,
        instructions: "Step backward into lunge, focus on front leg stability, return to center.",
        instructionsTranslations: { th: "ก้าวถอยหลังเป็นท่าลันจ์ เน้นความมั่นคงของขาหน้า กลับสู่ตรงกลาง" },
      },
      {
        name: "Lateral Lunges",
        nameTranslations: { th: "ลันจ์ข้าง" },
        sets: 2,
        reps: "8 each side",
        rest: 75,
        instructions: "Step to side, sit back on one leg, keep other leg straight, return to center.",
        instructionsTranslations: { th: "ก้าวไปข้าง นั่งถอยหลังด้วยขาข้างหนึ่ง ขาอีกข้างตรง กลับสู่ตรงกลาง" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    calories: 110,
    tags: ["lunges", "unilateral", "balance", "legs"],
  },
  {
    id: "plank-challenge",
    name: "Plank Challenge",
    nameTranslations: {
      th: "ท้าทายแพลงค์",
    },
    type: "Strength",
    duration: 15,
    difficulty: "Intermediate",
    description: "Core-focused workout using plank variations to build stability, strength, and endurance.",
    descriptionTranslations: {
      th: "การออกกำลังกายเน้นกล้ามเนื้อหลักใช้ท่าแพลงค์หลากหลายเพื่อสร้างความมั่นคง ความแข็งแรง และความอดทน",
    },
    exercises: [
      {
        name: "Standard Plank",
        nameTranslations: { th: "แพลงค์มาตรฐาน" },
        sets: 3,
        duration: 45,
        rest: 30,
        instructions: "Hold plank position, keep body straight from head to heels, engage core.",
        instructionsTranslations: { th: "ค้างท่าแพลงค์ รักษาตัวให้ตรงจากหัวถึงส้นเท้า กระชับกล้ามเนื้อหลัก" },
      },
      {
        name: "Side Planks",
        nameTranslations: { th: "แพลงค์ข้าง" },
        sets: 2,
        duration: "30 each side",
        rest: 45,
        instructions: "Lie on side, prop up on elbow, lift hips to create straight line.",
        instructionsTranslations: { th: "นอนตะแคง ค้ำด้วยข้อศอก ยกสะโพกให้เป็นเส้นตรง" },
      },
      {
        name: "Plank Up-Downs",
        nameTranslations: { th: "แพลงค์ขึ้น-ลง" },
        sets: 3,
        reps: 10,
        rest: 60,
        instructions: "Start in plank, lower to forearms one arm at a time, return to plank.",
        instructionsTranslations: { th: "เริ่มในท่าแพลงค์ ลงสู่แขนพับทีละข้าง กลับสู่ท่าแพลงค์" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Core", "Shoulders", "Arms"],
    calories: 90,
    tags: ["plank", "core", "isometric", "stability"],
  },
  {
    id: "deadlift-basics",
    name: "Deadlift Basics",
    nameTranslations: {
      th: "พื้นฐานเดดลิฟท์",
    },
    type: "Strength",
    duration: 30,
    difficulty: "Advanced",
    description:
      "Fundamental deadlift workout focusing on proper form and progressive loading for posterior chain strength.",
    descriptionTranslations: {
      th: "การออกกำลังกายเดดลิฟท์พื้นฐานที่เน้นท่าทางที่ถูกต้องและการเพิ่มน้ำหนักแบบค่อยเป็นค่อยไปเพื่อความแข็งแรงของกล้ามเนื้อด้านหลัง",
    },
    exercises: [
      {
        name: "Romanian Deadlifts",
        nameTranslations: { th: "เดดลิฟท์โรมาเนีย" },
        sets: 4,
        reps: 10,
        rest: 90,
        instructions: "Hinge at hips, lower weight while keeping back straight, feel stretch in hamstrings.",
        instructionsTranslations: { th: "งอที่สะโพก ลดน้ำหนักลงโดยรักษาหลังตรง รู้สึกยืดที่กล้ามเนื้อหลังขา" },
      },
      {
        name: "Single-Leg Deadlifts",
        nameTranslations: { th: "เดดลิฟท์ขาเดียว" },
        sets: 3,
        reps: "8 each leg",
        rest: 75,
        instructions: "Balance on one leg, hinge forward, touch ground with fingertips, return to standing.",
        instructionsTranslations: { th: "ทรงตัวด้วยขาข้างเดียว งอไปข้างหน้า แตะพื้นด้วยปลายนิ้ว กลับสู่ท่ายืน" },
      },
      {
        name: "Sumo Deadlift Stretch",
        nameTranslations: { th: "ยืดเดดลิฟท์ซูโม่" },
        sets: 2,
        reps: 12,
        rest: 60,
        instructions: "Wide stance, toes out, squat down and up focusing on hip mobility.",
        instructionsTranslations: { th: "ยืนกว้าง เท้าชี้ออก นั่งยองขึ้นลงเน้นการเคลื่อนไหวของสะโพก" },
      },
    ],
    equipment: ["Dumbbells", "Kettlebell"],
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back", "Core"],
    calories: 160,
    tags: ["deadlift", "posterior-chain", "hinge", "strength"],
  },

  // NEW CORE TEMPLATES
  {
    id: "crunch-core",
    name: "Crunch Core",
    nameTranslations: {
      th: "คอร์ครันช์",
    },
    type: "Core",
    duration: 12,
    difficulty: "Beginner",
    description: "Classic abdominal workout focusing on crunches and variations to strengthen the rectus abdominis.",
    descriptionTranslations: {
      th: "การออกกำลังกายหน้าท้องแบบคลาสสิกที่เน้นครันช์และรูปแบบต่างๆ เพื่อเสริมสร้างกล้ามเนื้อหน้าท้องตรง",
    },
    exercises: [
      {
        name: "Basic Crunches",
        nameTranslations: { th: "ครันช์พื้นฐาน" },
        sets: 3,
        reps: 20,
        rest: 45,
        instructions: "Lie on back, knees bent, lift shoulders off ground, squeeze abs, lower slowly.",
        instructionsTranslations: { th: "นอนหงาย งอเข่า ยกไหล่ขึ้นจากพื้น บีบหน้าท้อง ลงช้าๆ" },
      },
      {
        name: "Bicycle Crunches",
        nameTranslations: { th: "ครันช์จักรยาน" },
        sets: 3,
        reps: "15 each side",
        rest: 45,
        instructions: "Alternate bringing elbow to opposite knee in cycling motion.",
        instructionsTranslations: { th: "สลับนำข้อศอกไปหาเข่าข้างตรงข้ามในการเคลื่อนไหวแบบปั่นจักรยาน" },
      },
      {
        name: "Reverse Crunches",
        nameTranslations: { th: "ครันช์ย้อนกลับ" },
        sets: 2,
        reps: 15,
        rest: 60,
        instructions: "Lift knees toward chest, curl hips off ground, focus on lower abs.",
        instructionsTranslations: { th: "ยกเข่าเข้าหาอก งอสะโพกขึ้นจากพื้น เน้นหน้าท้องส่วนล่าง" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Rectus Abdominis", "Obliques"],
    calories: 70,
    tags: ["crunches", "abs", "core", "beginner"],
  },
  {
    id: "russian-twist-core",
    name: "Russian Twist Core",
    nameTranslations: {
      th: "คอร์รัสเซียนทวิสต์",
    },
    type: "Core",
    duration: 10,
    difficulty: "Intermediate",
    description: "Rotational core workout using Russian twists to target obliques and improve rotational strength.",
    descriptionTranslations: {
      th: "การออกกำลังกายคอร์แบบหมุนใช้รัสเซียนทวิสต์เพื่อเน้นกล้ามเนื้อข้างลำตัวและพัฒนาความแข็งแรงในการหมุน",
    },
    exercises: [
      {
        name: "Russian Twists",
        nameTranslations: { th: "รัสเซียนทวิสต์" },
        sets: 4,
        reps: 20,
        rest: 30,
        instructions: "Sit with knees bent, lean back slightly, rotate torso side to side.",
        instructionsTranslations: { th: "นั่งงอเข่า เอนหลังเล็กน้อย หมุนลำตัวไปมาข้างๆ" },
      },
      {
        name: "Weighted Russian Twists",
        nameTranslations: { th: "รัสเซียนทวิสต์ถ่วงน้ำหนัก" },
        sets: 3,
        reps: 16,
        rest: 45,
        instructions: "Hold weight or water bottle, perform twists with added resistance.",
        instructionsTranslations: { th: "ถือน้ำหนักหรือขวดน้ำ ทำทวิสต์พร้อมความต้านทานเพิ่มเติม" },
      },
      {
        name: "Feet-Up Russian Twists",
        nameTranslations: { th: "รัสเซียนทวิสต์ยกเท้า" },
        sets: 2,
        reps: 12,
        rest: 60,
        instructions: "Lift feet off ground while twisting, increases core challenge.",
        instructionsTranslations: { th: "ยกเท้าขึ้นจากพื้นขณะทวิสต์ เพิ่มความท้าทายของคอร์" },
      },
    ],
    equipment: ["None", "Weight (optional)"],
    targetMuscles: ["Obliques", "Rectus Abdominis", "Hip Flexors"],
    calories: 80,
    tags: ["russian-twists", "obliques", "rotation", "core"],
  },
  {
    id: "leg-raise-core",
    name: "Leg Raise Core",
    nameTranslations: {
      th: "คอร์ยกขา",
    },
    type: "Core",
    duration: 14,
    difficulty: "Intermediate",
    description: "Lower abdominal focused workout using leg raise variations to strengthen the deep core muscles.",
    descriptionTranslations: {
      th: "การออกกำลังกายเน้นหน้าท้องส่วนล่างใช้ท่ายกขาหลากหลายเพื่อเสริมสร้างกล้ามเนื้อคอร์ส่วนลึก",
    },
    exercises: [
      {
        name: "Lying Leg Raises",
        nameTranslations: { th: "ยกขานอน" },
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: "Lie flat, lift straight legs to 90 degrees, lower slowly without touching ground.",
        instructionsTranslations: { th: "นอนราบ ยกขาตรงถึง 90 องศา ลงช้าๆ โดยไม่แตะพื้น" },
      },
      {
        name: "Bent-Knee Leg Raises",
        nameTranslations: { th: "ยกขางอเข่า" },
        sets: 3,
        reps: 15,
        rest: 45,
        instructions: "Keep knees bent at 90 degrees, lift knees toward chest, lower with control.",
        instructionsTranslations: { th: "งอเข่า 90 องศา ยกเข่าเข้าหาอก ลงอย่างมีการควบคุม" },
      },
      {
        name: "Flutter Kicks",
        nameTranslations: { th: "เตะกระพือ" },
        sets: 2,
        duration: 30,
        rest: 45,
        instructions: "Small alternating leg movements, keep lower back pressed to ground.",
        instructionsTranslations: { th: "เคลื่อนไหวขาสลับเล็กๆ กดหลังส่วนล่างติดพื้น" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Lower Abs", "Hip Flexors", "Core"],
    calories: 85,
    tags: ["leg-raises", "lower-abs", "core", "hip-flexors"],
  },
  {
    id: "flutter-kick-core",
    name: "Flutter Kick Core",
    nameTranslations: {
      th: "คอร์เตะกระพือ",
    },
    type: "Core",
    duration: 8,
    difficulty: "Beginner",
    description:
      "Dynamic core workout using flutter kicks and variations to build endurance and lower abdominal strength.",
    descriptionTranslations: {
      th: "การออกกำลังกายคอร์แบบไดนามิกใช้เตะกระพือและรูปแบบต่างๆ เพื่อสร้างความอดทนและความแข็งแรงของหน้าท้องส่วนล่าง",
    },
    exercises: [
      {
        name: "Flutter Kicks",
        nameTranslations: { th: "เตะกระพือ" },
        sets: 4,
        duration: 30,
        rest: 30,
        instructions: "Lie on back, lift legs slightly, alternate small up and down movements.",
        instructionsTranslations: { th: "นอนหงาย ยกขาเล็กน้อย สลับเคลื่อนไหวขึ้นลงเล็กๆ" },
      },
      {
        name: "Scissor Kicks",
        nameTranslations: { th: "เตะกรรไกร" },
        sets: 3,
        duration: 25,
        rest: 35,
        instructions: "Cross legs over each other in scissoring motion, keep core engaged.",
        instructionsTranslations: { th: "ไขว้ขาข้ามกันในการเ���ลื่อนไหวแบบกรรไกร กระชับคอร์" },
      },
      {
        name: "Vertical Leg Crunches",
        nameTranslations: { th: "ครันช์ขาตั้ง" },
        sets: 2,
        reps: 15,
        rest: 45,
        instructions: "Legs straight up, crunch up toward feet, focus on upper abs.",
        instructionsTranslations: { th: "ขาตั้งตรง ครันช์ขึ้นไปหาเท้า เน้นหน้าท้องส่วนบน" },
      },
    ],
    equipment: ["None"],
    targetMuscles: ["Lower Abs", "Hip Flexors", "Core Stabilizers"],
    calories: 60,
    tags: ["flutter-kicks", "dynamic", "endurance", "lower-abs"],
  },

  // NEW FLEXIBILITY TEMPLATES
  {
    id: "hamstring-flexibility",
    name: "Hamstring Flexibility",
    nameTranslations: {
      th: "ความยืดหยุ่นกล้ามเนื้อหลังขา",
    },
    type: "Flexibility",
    duration: 15,
    difficulty: "Beginner",
    description:
      "Comprehensive hamstring stretching routine to improve flexibility and reduce tightness in the posterior thigh.",
    descriptionTranslations: {
      th: "โปรแกรมยืดกล้ามเนื้อหลังขาแบบครอบคลุมเพื่อพัฒนาความยืดหยุ่นและลดความตึงของต้นขาด้านหลัง",
    },
    exercises: [
      {
        name: "Standing Hamstring Stretch",
        nameTranslations: { th: "ยืดหลังขายืน" },
        sets: 2,
        duration: 30,
        rest: 15,
        instructions: "Place heel on elevated surface, lean forward gently, feel stretch in back of leg.",
        instructionsTranslations: { th: "วางส้นเท้าบนพื้นผิวสูง เอนไปข้างหน้าเบาๆ รู้สึกยืดที่หลังขา" },
      },
      {
        name: "Seated Forward Fold",
        nameTranslations: { th: "นั่งก้มไปข้างหน้า" },
        sets: 2,
        duration: 45,
        rest: 20,
        instructions: "Sit with legs extended, reach toward toes, keep back straight.",
        instructionsTranslations: { th: "นั่งเหยียดขา เอื้อมไปหาปลายเท้า รักษาหลังตรง" },
      },
      {
        name: "Lying Hamstring Stretch",
        nameTranslations: { th: "ยืดหลังขานอน" },
        sets: 2,
        duration: "30 each leg",
        rest: 15,
        instructions: "Lie on back, pull one leg toward chest, keep other leg flat.",
        instructionsTranslations: { th: "นอนหงาย ดึงขาข้างหนึ่งเข้าหาอก ขาอีกข้างแบน" },
      },
    ],
    equipment: ["None", "Towel (optional)"],
    targetMuscles: ["Hamstrings", "Calves", "Lower Back"],
    calories: 30,
    tags: ["hamstring", "flexibility", "stretching", "mobility"],
  },
  {
    id: "childs-pose-flow",
    name: "Child's Pose Flow",
    nameTranslations: {
      th: "โฟลว์ท่าเด็ก",
    },
    type: "Flexibility",
    duration: 12,
    difficulty: "Beginner",
    description:
      "Relaxing yoga-inspired flow centered around child's pose to release tension and improve spinal mobility.",
    descriptionTranslations: {
      th: "การไหลแบบโยคะที่ผ่อนคลายเน้นท่าเด็กเพื่อปลดปล่อยความตึงเครียดและพัฒนาการเคลื่อนไหวของกระดูกสันหลัง",
    },
    exercises: [
      {
        name: "Child's Pose",
        nameTranslations: { th: "ท่าเด็ก" },
        sets: 3,
        duration: 60,
        rest: 15,
        instructions: "Kneel, sit back on heels, extend arms forward, rest forehead on ground.",
        instructionsTranslations: { th: "คุกเข่า นั่งบนส้นเท้า เหยียดแขนไปข้างหน้า วางหน้าผากบนพื้น" },
      },
      {
        name: "Cat-Cow Stretch",
        nameTranslations: { th: "ยืดแมว-วัว" },
        sets: 2,
        reps: 10,
        rest: 30,
        instructions: "On hands and knees, alternate arching and rounding spine slowly.",
        instructionsTranslations: { th: "คลานสี่ขา สลับโค้งและโค้งกระดูกสันหลังช้าๆ" },
      },
      {
        name: "Extended Child's Pose",
        nameTranslations: { th: "ท่าเด็กยืด" },
        sets: 2,
        duration: 45,
        rest: 20,
        instructions: "From child's pose, walk hands to one side, feel stretch along side body.",
        instructionsTranslations: { th: "จากท่าเด็ก เดินมือไปข้างหนึ่ง รู้สึกยืดตามข้างลำตัว" },
      },
    ],
    equipment: ["Yoga Mat"],
    targetMuscles: ["Spine", "Hips", "Shoulders", "Back"],
    calories: 25,
    tags: ["childs-pose", "yoga", "relaxation", "spinal-mobility"],
  },
  {
    id: "cobra-stretch-flow",
    name: "Cobra Stretch Flow",
    nameTranslations: {
      th: "โฟลว์ยืดท่างู",
    },
    type: "Flexibility",
    duration: 10,
    difficulty: "Beginner",
    description:
      "Gentle backbending sequence using cobra pose variations to improve spinal extension and chest opening.",
    descriptionTranslations: {
      th: "ลำดับการงอหลังเบาๆ ใช้ท่างูหลากหลายเพื่อพัฒนาการเหยียดกระดูกสันหลังและเปิดอก",
    },
    exercises: [
      {
        name: "Sphinx Pose",
        nameTranslations: { th: "ท่าสฟิงซ์" },
        sets: 2,
        duration: 45,
        rest: 30,
        instructions: "Lie on stomach, prop up on forearms, gentle backbend, open chest.",
        instructionsTranslations: { th: "นอนคว่ำ ค้ำด้วยแขนพับ งอหลังเบาๆ เปิดอก" },
      },
      {
        name: "Low Cobra",
        nameTranslations: { th: "ท่างูต่ำ" },
        sets: 3,
        duration: 30,
        rest: 20,
        instructions: "Press palms down, lift chest slightly, keep hips on ground.",
        instructionsTranslations: { th: "กดฝ่ามือลง ยกอกเล็กน้อย สะโพกติดพื้น" },
      },
      {
        name: "Full Cobra",
        nameTranslations: { th: "ท่างูเต็ม" },
        sets: 2,
        duration: 20,
        rest: 40,
        instructions: "Straighten arms more, deeper backbend, listen to your body.",
        instructionsTranslations: { th: "เหยียดแขนมากขึ้น งอหลังลึกขึ้น ฟังร่างกายของคุณ" },
      },
    ],
    equipment: ["Yoga Mat"],
    targetMuscles: ["Spine", "Chest", "Shoulders", "Hip Flexors"],
    calories: 20,
    tags: ["cobra", "backbend", "spinal-extension", "chest-opening"],
  },
]

export const getWorkoutTemplatesByType = (type: string): WorkoutTemplate[] => {
  return workoutTemplates.filter((template) => template.type === type)
}

export const getWorkoutTemplatesByDifficulty = (difficulty: string): WorkoutTemplate[] => {
  return workoutTemplates.filter((template) => template.difficulty === difficulty)
}

export const searchWorkoutTemplates = (searchTerm: string): WorkoutTemplate[] => {
  const term = searchTerm.toLowerCase()
  return workoutTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(term) ||
      template.description.toLowerCase().includes(term) ||
      template.type.toLowerCase().includes(term) ||
      template.targetMuscles.some((muscle) => muscle.toLowerCase().includes(term)) ||
      template.tags.some((tag) => tag.toLowerCase().includes(term)),
  )
}

export const getWorkoutTemplateById = (id: string): WorkoutTemplate | undefined => {
  return workoutTemplates.find((template) => template.id === id)
}
