import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง templates ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ templates: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM templates WHERE user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ templates: result.rows })
}

// POST: เพิ่ม template ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO templates (user_id, name, exercises, category, created_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      userId,
      data.name,
      JSON.stringify(data.exercises),
      data.category,
      data.createdAt,
    ]
  )
  return NextResponse.json({ template: res.rows[0] })
}

// PUT: แก้ไข template (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE templates SET
      name=$2, exercises=$3, category=$4, created_at=$5
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.name,
      JSON.stringify(data.exercises),
      data.category,
      data.createdAt,
    ]
  )
  return NextResponse.json({ template: res.rows[0] })
}

// DELETE: ลบ template (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM templates WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 