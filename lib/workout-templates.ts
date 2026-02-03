export interface WorkoutTemplate {
  id: number
  name: string
  type: string
  exercises: {
    id?: number; // เพิ่ม field นี้เพื่อรองรับ id
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
}

export const workoutTemplates: WorkoutTemplate[] = [
  // EXISTING TEMPLATES (keeping the current structure)
  {
    id: 1,
    name: "Full Body Beginner",
    type: "Full Body",
    exercises: [
      {
        id: 46,
        name: "Bodyweight Squats",
        nameTranslations: { th: "สควอทด้วยน้ำหนักตัว" },
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: "Stand with feet shoulder-width apart, lower into squat position, then return to standing.",
        instructionsTranslations: { th: "ยืนให้เท้าห่างเท่าไหล่ ลงนั่งท่าสควอท แล้วกลับสู่ท่ายืน" },
      },
      {
        id: 47,
        name: "Push-ups (Modified)",
        nameTranslations: { th: "วิดพื้น (แบบปรับเปลี่ยน)" },
        sets: 3,
        reps: 8,
        rest: 60,
        instructions: "Start in plank position, lower chest to ground, push back up. Use knees if needed.",
        instructionsTranslations: { th: "เริ่มในท่าแพลงค์ ลดอกลงสู่พื้น แล้วผลักขึ้น ใช้เข่าถ้าจำเป็น" },
      },
    ],
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    type: "HIIT",
    exercises: [
      {
        id: 6,
        name: "Jumping Jacks",
        nameTranslations: { th: "จัมปิ้งแจ็ค" },
        duration: 30,
        rest: 15,
        instructions: "Jump while spreading legs and raising arms overhead, then return to starting position.",
        instructionsTranslations: { th: "กระโดดพร้อมแยกขาและยกแขนขึ้นเหนือศีรษะ แล้วกลับสู่ท่าเริ่มต้น" },
      },
      {
        id: 9,
        name: "High Knees",
        nameTranslations: { th: "ยกเข่าสูง" },
        duration: 30,
        rest: 15,
        instructions: "Run in place while lifting knees as high as possible toward chest.",
        instructionsTranslations: { th: "วิ่งในที่พร้อมยกเข่าให้สูงที่สุดเข้าหาอก" },
      },
    ],
  },

  // NEW CARDIO TEMPLATES
  {
    id: 3,
    name: "Jump Rope Cardio",
    type: "Cardio",
    exercises: [
      {
        id: 48,
        name: "Basic Jump Rope",
        nameTranslations: { th: "กระโดดเชือกพื้นฐาน" },
        sets: 5,
        duration: 60,
        rest: 30,
        instructions: "Jump with both feet together, keeping a steady rhythm. Land softly on balls of feet.",
        instructionsTranslations: { th: "กระโดดด้วยเท้าทั้งสองข้างพร้อมกัน รักษาจังหวะให้สม่ำเสมอ ลงด้วยปลายเท้าอย่างนุ่มนวล" },
      },
      {
        id: 49,
        name: "Single Leg Hops",
        nameTranslations: { th: "กระโดดขาเดียว" },
        sets: 4,
        duration: 30,
        rest: 45,
        instructions: "Alternate jumping on one foot, then the other. Focus on balance and control.",
        instructionsTranslations: { th: "สลับกระโดดด้วยขาข้างหนึ่ง แล้วขาอีกข้าง เน้นการทรงตัวและการควบคุม" },
      },
    ],
  },
  {
    id: 4,
    name: "Burpee Blast",
    type: "Cardio",
    exercises: [
      {
        id: 50,
        name: "Standard Burpees",
        nameTranslations: { th: "เบอร์ปี้มาตรฐาน" },
        sets: 4,
        reps: 8,
        rest: 60,
        instructions: "Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead.",
        instructionsTranslations: { th: "นั่งยองลง กระโดดถอยหลังเป็นท่าแพลงค์ วิดพื้น กระโดดเท้าเข้าหา แล้วกระโดดขึ้นยกแขน" },
      }
    ],
  },
  {
    id: 5,
    name: "Mountain Climber Cardio",
    type: "Cardio",
    exercises: [
      {
        id: 52,
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
        id: 53,
        name: "Cross-Body Mountain Climbers",
        nameTranslations: { th: "เมาน์เทนไคลม์เบอร์ข้ามตัว" },
        sets: 3,
        duration: 30,
        rest: 45,
        instructions: "Bring knee toward opposite elbow, alternating sides to engage obliques.",
        instructionsTranslations: { th: "ดึงเข่าไปหาข้อศอกข้างตรงข้าม สลับข้างเพื่อใช้กล้ามเนื้อข้างลำตัว" },
      },
    ],
  },

  // NEW STRENGTH TEMPLATES
  {
    id: 7,
    name: "Push-up Power",
    type: "Strength",
    exercises: [
      {
        id: 55,
        name: "Standard Push-ups",
        nameTranslations: { th: "วิดพื้นมาตรฐาน" },
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: "Keep body straight, lower chest to ground, push back up maintaining form.",
        instructionsTranslations: { th: "รักษาตัวให้ตรง ลดอกลงสู่พื้น ผลักขึ้นโดยรักษาท่าทาง" },
      },
      {
        id: 56,
        name: "Wide-Grip Push-ups",
        nameTranslations: { th: "วิดพื้นมือกว้าง" },
        sets: 3,
        reps: 10,
        rest: 60,
        instructions: "Place hands wider than shoulders, focus on chest engagement.",
        instructionsTranslations: { th: "วางมือกว้างกว่าไหล่ เน้นการใช้กล้ามเนื้ออก" },
      },
      {
        id: 57,
        name: "Diamond Push-ups",
        nameTranslations: { th: "วิดพื้นเพชร" },
        sets: 2,
        reps: 8,
        rest: 90,
        instructions: "Form diamond shape with hands, targets triceps more intensely.",
        instructionsTranslations: { th: "ทำรูปเพชรด้วยมือ เน้นกล้ามเนื้อแขนหลังมากขึ้น" },
      },
    ],
  },
  {
    id: 8,
    name: "Squat Strength",
    type: "Strength",
    exercises: [
      {
        id: 46,
        name: "Bodyweight Squats",
        nameTranslations: { th: "สควอทน้ำหนักตัว" },
        sets: 4,
        reps: 15,
        rest: 60,
        instructions: "Feet shoulder-width apart, sit back and down, drive through heels to stand.",
        instructionsTranslations: { th: "เท้าห่างเท่าไหล่ นั่งถอยหลังและลง ผลักผ่านส้นเท้าเพื่อยืน" },
      },
      {
        id: 58,
        name: "Jump Squats",
        nameTranslations: { th: "สควอทกระโดด" },
        sets: 3,
        reps: 12,
        rest: 75,
        instructions: "Perform squat then explode up into jump, land softly and repeat.",
        instructionsTranslations: { th: "ทำสควอทแล้วระเบิดขึ้นกระโดด ลงอย่างนุ่มนวลและทำซ้ำ" },
      },
      {
        id: 59,
        name: "Single-Leg Squats",
        nameTranslations: { th: "สควอทขาเดียว" },
        sets: 2,
        reps: "6 each leg",
        rest: 90,
        instructions: "Squat on one leg, use chair for balance if needed, focus on control.",
        instructionsTranslations: { th: "สควอทด้วยขาข้างเดียว ใช้เก้าอี้ช่วยทรงตัวถ้าจำเป็น เน้นการควบคุม" },
      },
    ],
  },
  {
    id: 9,
    name: "Lunge Workout",
    type: "Strength",
    exercises: [
      {
        id: 3,
        name: "Forward Lunges",
        nameTranslations: { th: "ลันจ์ไปข้างหน้า" },
        sets: 3,
        reps: "12 each leg",
        rest: 60,
        instructions: "Step forward into lunge, lower back knee toward ground, push back to start.",
        instructionsTranslations: { th: "ก้าวไปข้างหน้าเป็นท่าลันจ์ ลดเข่าหลังลงสู่พื้น ผลักกลับสู่จุดเริ่มต้น" },
      },
      {
        id: 3,
        name: "Reverse Lunges",
        nameTranslations: { th: "ลันจ์ถอยหลัง" },
        sets: 3,
        reps: "10 each leg",
        rest: 60,
        instructions: "Step backward into lunge, focus on front leg stability, return to center.",
        instructionsTranslations: { th: "ก้าวถอยหลังเป็นท่าลันจ์ เน้นความมั่นคงของขาหน้า กลับสู่ตรงกลาง" },
      },
      {
        id: 3,
        name: "Lateral Lunges",
        nameTranslations: { th: "ลันจ์ข้าง" },
        sets: 2,
        reps: "8 each side",
        rest: 75,
        instructions: "Step to side, sit back on one leg, keep other leg straight, return to center.",
        instructionsTranslations: { th: "ก้าวไปข้าง นั่งถอยหลังด้วยขาข้างหนึ่ง ขาอีกข้างตรง กลับสู่ตรงกลาง" },
      },
    ],
  },
  {
    id: 10,
    name: "Plank Challenge",
    type: "Strength",
    exercises: [
      {
        id: 3,
        name: "Standard Plank",
        nameTranslations: { th: "แพลงค์มาตรฐาน" },
        sets: 3,
        duration: 45,
        rest: 30,
        instructions: "Hold plank position, keep body straight from head to heels, engage core.",
        instructionsTranslations: { th: "ค้างท่าแพลงค์ รักษาตัวให้ตรงจากหัวถึงส้นเท้า กระชับกล้ามเนื้อหลัก" },
      },
      {
        id: 3,
        name: "Side Planks",
        nameTranslations: { th: "แพลงค์ข้าง" },
        sets: 2,
        duration: 30,
        rest: 45,
        instructions: "Lie on side, prop up on elbow, lift hips to create straight line.",
        instructionsTranslations: { th: "นอนตะแคง ค้ำด้วยข้อศอก ยกสะโพกให้เป็นเส้นตรง" },
      },
      {
        id: 3,
        name: "Plank Up-Downs",
        nameTranslations: { th: "แพลงค์ขึ้น-ลง" },
        sets: 3,
        reps: 10,
        rest: 60,
        instructions: "Start in plank, lower to forearms one arm at a time, return to plank.",
        instructionsTranslations: { th: "เริ่มในท่าแพลงค์ ลงสู่แขนพับทีละข้าง กลับสู่ท่าแพลงค์" },
      },
    ],
  },
  {
    id: 11,
    name: "Deadlift Basics",
    type: "Strength",
    exercises: [
      {
        id: 3,
        name: "Romanian Deadlifts",
        nameTranslations: { th: "เดดลิฟท์โรมาเนีย" },
        sets: 4,
        reps: 10,
        rest: 90,
        instructions: "Hinge at hips, lower weight while keeping back straight, feel stretch in hamstrings.",
        instructionsTranslations: { th: "งอที่สะโพก ลดน้ำหนักลงโดยรักษาหลังตรง รู้สึกยืดที่กล้ามเนื้อหลังขา" },
      },
      {
        id: 3,
        name: "Single-Leg Deadlifts",
        nameTranslations: { th: "เดดลิฟท์ขาเดียว" },
        sets: 3,
        reps: "8 each leg",
        rest: 75,
        instructions: "Balance on one leg, hinge forward, touch ground with fingertips, return to standing.",
        instructionsTranslations: { th: "ทรงตัวด้วยขาข้างเดียว งอไปข้างหน้า แตะพื้นด้วยปลายนิ้ว กลับสู่ท่ายืน" },
      },
      {
        id: 3,
        name: "Sumo Deadlift Stretch",
        nameTranslations: { th: "ยืดเดดลิฟท์ซูโม่" },
        sets: 2,
        reps: 12,
        rest: 60,
        instructions: "Wide stance, toes out, squat down and up focusing on hip mobility.",
        instructionsTranslations: { th: "ยืนกว้าง เท้าชี้ออก นั่งยองขึ้นลงเน้นการเคลื่อนไหวของสะโพก" },
      },
    ],
  },

  // NEW CORE TEMPLATES
  {
    id: 12,
    name: "Crunch Core",
    type: "Core",
    exercises: [
      {
        id: 3,
        name: "Basic Crunches",
        nameTranslations: { th: "ครันช์พื้นฐาน" },
        sets: 3,
        reps: 20,
        rest: 45,
        instructions: "Lie on back, knees bent, lift shoulders off ground, squeeze abs, lower slowly.",
        instructionsTranslations: { th: "นอนหงาย งอเข่า ยกไหล่ขึ้นจากพื้น บีบหน้าท้อง ลงช้าๆ" },
      },
      {
        id: 3,
        name: "Bicycle Crunches",
        nameTranslations: { th: "ครันช์จักรยาน" },
        sets: 3,
        reps: "15 each side",
        rest: 45,
        instructions: "Alternate bringing elbow to opposite knee in cycling motion.",
        instructionsTranslations: { th: "สลับนำข้อศอกไปหาเข่าข้างตรงข้ามในการเคลื่อนไหวแบบปั่นจักรยาน" },
      },
      {
        id: 3,
        name: "Reverse Crunches",
        nameTranslations: { th: "ครันช์ย้อนกลับ" },
        sets: 2,
        reps: 15,
        rest: 60,
        instructions: "Lift knees toward chest, curl hips off ground, focus on lower abs.",
        instructionsTranslations: { th: "ยกเข่าเข้าหาอก งอสะโพกขึ้นจากพื้น เน้นหน้าท้องส่วนล่าง" },
      },
    ],
  },
  {
    id: 17,
    name: "Child's Pose Flow",
    type: "Flexibility",
    exercises: [
      {
        id: 12,
        name: "Child's Pose",
        nameTranslations: { th: "ท่าเด็ก" },
        sets: 3,
        duration: 60,
        rest: 15,
        instructions: "Kneel, sit back on heels, extend arms forward, rest forehead on ground.",
        instructionsTranslations: { th: "คุกเข่า นั่งบนส้นเท้า เหยียดแขนไปข้างหน้า วางหน้าผากบนพื้น" },
      },
      {
        id: 13,
        name: "Cat-Cow Stretch",
        nameTranslations: { th: "ยืดแมว-วัว" },
        sets: 2,
        reps: 10,
        rest: 30,
        instructions: "On hands and knees, alternate arching and rounding spine slowly.",
        instructionsTranslations: { th: "คลานสี่ขา สลับโค้งและโค้งกระดูกสันหลังช้าๆ" },
      }
    ],
    
  }
]

export const getWorkoutTemplatesByType = (type: string): WorkoutTemplate[] => {
  return workoutTemplates.filter((template) => template.type === type)
}

export const searchWorkoutTemplates = (searchTerm: string): WorkoutTemplate[] => {
  const term = searchTerm.toLowerCase()
  return workoutTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(term) ||
      template.type.toLowerCase().includes(term)
  )
}

export const getWorkoutTemplateById = (id: number | string): WorkoutTemplate | undefined => {
  return workoutTemplates.find((template) => String(template.id) === String(id))
}
