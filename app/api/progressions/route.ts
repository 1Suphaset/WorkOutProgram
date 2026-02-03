import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { pool } from "@/lib/db"


// GET: ดึง progressions ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ progressions: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM progressions WHERE user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ progressions: result.rows })
}

// POST: เพิ่ม progression ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO progressions (user_id, template_id, current_level, start_date, completed_sessions, total_sessions, week_in_level, is_active, notes, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      userId,
      data.templateId,
      data.currentLevel,
      data.startDate,
      data.completedSessions,
      data.totalSessions,
      data.weekInLevel,
      data.isActive,
      JSON.stringify(data.notes),
      data.createdAt,
    ]
  )
  return NextResponse.json({ progression: res.rows[0] })
}

// PUT: แก้ไข progression (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE progressions SET
      template_id=$2, current_level=$3, start_date=$4, completed_sessions=$5, total_sessions=$6, week_in_level=$7, is_active=$8, notes=$9, created_at=$10
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.templateId,
      data.currentLevel,
      data.startDate,
      data.completedSessions,
      data.totalSessions,
      data.weekInLevel,
      data.isActive,
      JSON.stringify(data.notes),
      data.createdAt,
    ]
  )
  return NextResponse.json({ progression: res.rows[0] })
}

// DELETE: ลบ progression (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM progressions WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 