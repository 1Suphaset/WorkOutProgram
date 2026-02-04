import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง daily notes ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ dailyNotes: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM daily_notes WHERE user_id=$1 ORDER BY date DESC', [userId])
  return NextResponse.json({ dailyNotes: result.rows })
}

// POST: เพิ่ม daily note ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO daily_notes (user_id, date, content, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      userId,
      data.date,
      data.content,
      data.createdAt,
      data.updatedAt,
    ]
  )
  return NextResponse.json({ dailyNote: res.rows[0] })
}

// PUT: แก้ไข daily note (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE daily_notes SET
      date=$2, content=$3, created_at=$4, updated_at=$5
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.date,
      data.content,
      data.createdAt,
      data.updatedAt,
    ]
  )
  return NextResponse.json({ dailyNote: res.rows[0] })
}

// DELETE: ลบ daily note (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM daily_notes WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 