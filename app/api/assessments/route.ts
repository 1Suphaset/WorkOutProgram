import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง assessments ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ assessments: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM assessments WHERE user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ assessments: result.rows })
}

// POST: เพิ่ม assessment ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO assessments (user_id, completed_at, results, overall_fitness_level, recommended_progressions, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      data.completedAt,
      JSON.stringify(data.results),
      data.overallFitnessLevel,
      JSON.stringify(data.recommendedProgressions),
      data.createdAt,
    ]
  )
  return NextResponse.json({ assessment: res.rows[0] })
}

// PUT: แก้ไข assessment (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE assessments SET
      completed_at=$2, results=$3, overall_fitness_level=$4, recommended_progressions=$5, created_at=$6
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.completedAt,
      JSON.stringify(data.results),
      data.overallFitnessLevel,
      JSON.stringify(data.recommendedProgressions),
      data.createdAt,
    ]
  )
  return NextResponse.json({ assessment: res.rows[0] })
}

// DELETE: ลบ assessment (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM assessments WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 