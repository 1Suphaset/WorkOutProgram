import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง workouts ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ workouts: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM workouts WHERE user_id=$1 ORDER BY date DESC', [userId])
  const workouts = result.rows.map(w => ({
    ...w,
    exercises: typeof w.exercises === 'string' ? JSON.parse(w.exercises) : w.exercises
  }))
  return NextResponse.json({ workouts })
}

// POST: เพิ่ม workout ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  // Validation: ตรวจสอบ exerciseId ทุกตัวต้องมีใน exercises table
  if (Array.isArray(data.exercises)) {
    const exerciseIds = data.exercises.map((ex: any) => ex.exerciseId).filter((id: any) => !!id)
    if (exerciseIds.length > 0) {
      const { rows } = await pool.query(
        'SELECT id FROM exercises WHERE id = ANY($1::bigint[])',
        [exerciseIds]
      )
      const foundIds = rows.map(r => String(r.id))
      const missingIds = exerciseIds.filter((id: any) => !foundIds.includes(String(id)))
      if (missingIds.length > 0) {
        return NextResponse.json({ error: `exerciseId(s) not found: ${missingIds.join(', ')}` }, { status: 400 })
      }
    }
  }

  const res = await pool.query(
    `INSERT INTO workouts (user_id, date, name, exercises, notes, completed, duration, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      data.date,
      data.name,
      JSON.stringify(data.exercises),
      data.notes,
      data.completed,
      data.duration,
      data.createdAt,
    ]
  )
  const workout = res.rows[0]
  return NextResponse.json({ workout: { ...workout, exercises: typeof workout.exercises === 'string' ? JSON.parse(workout.exercises) : workout.exercises } })
}

// PUT: แก้ไข workout (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  // Validation: ตรวจสอบ exerciseId ทุกตัวต้องมีใน exercises table
  if (Array.isArray(data.exercises)) {
    const exerciseIds = data.exercises.map((ex: any) => ex.exerciseId).filter((id: any) => !!id)
    if (exerciseIds.length > 0) {
      const { rows } = await pool.query(
        'SELECT id FROM exercises WHERE id = ANY($1::bigint[])',
        [exerciseIds]
      )
      const foundIds = rows.map(r => String(r.id))
      const missingIds = exerciseIds.filter((id: any) => !foundIds.includes(String(id)))
      if (missingIds.length > 0) {
        return NextResponse.json({ error: `exerciseId(s) not found: ${missingIds.join(', ')}` }, { status: 400 })
      }
    }
  }
  const res = await pool.query(
    `UPDATE workouts SET
      date=$2, name=$3, exercises=$4, notes=$5, completed=$6, duration=$7, created_at=$8
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.date,
      data.name,
      JSON.stringify(data.exercises),
      data.notes,
      data.completed,
      data.duration,
      data.createdAt,
    ]
  )
  const workout = res.rows[0]
  return NextResponse.json({ workout: { ...workout, exercises: typeof workout.exercises === 'string' ? JSON.parse(workout.exercises) : workout.exercises } })
}

// DELETE: ลบ workout (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM workouts WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 