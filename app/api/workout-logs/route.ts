import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง workout logs ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ workoutLogs: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM workout_logs WHERE user_id=$1 ORDER BY completed_at DESC', [userId])
  return NextResponse.json({ workoutLogs: result.rows })
}

// POST: เพิ่ม workout log ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO workout_logs (user_id, workout_id, completed_at, duration, exercises, notes, overall_effort)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userId,
      data.workoutId,
      data.completedAt,
      data.duration,
      JSON.stringify(data.exercises),
      data.notes,
      data.overallEffort,
    ]
  )
  return NextResponse.json({ workoutLog: res.rows[0] })
}

// PUT: แก้ไข workout log (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE workout_logs SET
      workout_id=$2, completed_at=$3, duration=$4, exercises=$5, notes=$6, overall_effort=$7
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.workoutId,
      data.completedAt,
      data.duration,
      JSON.stringify(data.exercises),
      data.notes,
      data.overallEffort,
    ]
  )
  return NextResponse.json({ workoutLog: res.rows[0] })
}

// DELETE: ลบ workout log (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM workout_logs WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 